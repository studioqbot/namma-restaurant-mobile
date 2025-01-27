'use client'
import React, { useContext, useEffect, useState } from 'react';
import Image from "next/image";
import GlobalContext from '@/constants/global-context';
import { Errors, LineItemsType, LineItemType, ModifierDataType, ModifierType, OrderDetailsType, OrderDetailsValue, OrderUpdateBodyAdd, TokenData, YourDetailsType } from '@/constants/types';
import { catalogItems, createPayment, getCatalogObject, orderUpdateApi, retrieveOrder } from '@/services/apiServices';
import Loader from '@/components/loder';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDataFromLocalStorage, setDataInLocalStorage } from '@/utils/genericUtilties';
import LoadingGif from '../../../public/assets/images/slow-cooker-loader.gif';

type ButtonComponent = React.ComponentType<{ children: React.ReactNode, style: React.CSSProperties }>;

type CartProps = {
    // getOrderDetails: () => void;
    lineItem: LineItemType;
    setCartItemCount: React.Dispatch<React.SetStateAction<number>>;
    cartItemCount: number;
    setLineItems: React.Dispatch<React.SetStateAction<LineItemsType[]>>;
    orderDetails: OrderDetailsType;
    setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetailsType>>;
    // setUpdateLineItem: React.Dispatch<React.SetStateAction<LineItemsType[]>>;
    // updateLineItem: LineItemsType[];
    setIsOrderUpdate: React.Dispatch<React.SetStateAction<string>>;
    orderUpdate: (count: string, objectId: string, uid: string, modifierId: string, modifierUid: string) => Promise<void>;
    // setAmount: React.Dispatch<React.SetStateAction<string | number>>;
    // setMoneyDetails: any;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    modifierList: ModifierDataType[] | undefined;

}

const button = {
    width: '100%',
    border: '1px solid #0DB561',
    fontSize: '14px',
    color: '#0DB561',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '13px 0',
    borderRadius: '10px',
    backgroundColor: 'transparent'
}

function CartScreen() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { orderDetails, setCartItemCount, cartItemCount, setLineItems, setOrderDetails, setIsOrderUpdate,
           setAmount, setFieldToRemove, setUpdateLineItem, isOrdered, globalLoading } = useContext(GlobalContext)
    const [loading, setLoading] = useState<boolean>(false);
    const [yourDetails, setYourDetails] = useState<YourDetailsType>();
    const [modifierList, setMofierList] = useState<ModifierDataType[]>([]);
    const [errors, setErrors] = useState<Errors>({
        name: '',
        mobile: ''
    });
    const router = useRouter()
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);



    const handleSubmitPayment = async (tokenData: TokenData) => {

        const errorData = { ...errors } as Errors;
        if (!yourDetails?.name) {
            errorData.name = 'Full name is required'
        } else {
            errorData.name = ''
        }

        if (!yourDetails?.mobile) {
            errorData.mobile = 'Mobile is required'
        } else {
            errorData.mobile = ''
        }
        setErrors(errorData)
        if (!errorData.name && !errorData.mobile) {
            setLoading(true)
            const body = {
                source_id: tokenData?.token,
                idempotency_key: window.crypto.randomUUID(),
                location_id: process.env.NEXT_PUBLIC_LOCATION_ID,
                amount_money: {
                    amount: orderDetails?.total_money?.amount,
                    currency: "USD"
                },
                order_id: orderDetails?.id,
                billing_address: {
                    first_name: yourDetails?.name
                },
                buyer_email_address: yourDetails?.email,
                buyer_phone_number: `+1${yourDetails?.mobile}`,
                note: yourDetails?.note ?? "",
            };

            try {
                const response = await createPayment(body);

                if (response?.status === 200) {
                    setLoading(false)

                    openModal()

                }
            } catch (error) {
                setLoading(true);
                console.log("Error", error);
                alert('Card nonce not found');

            }
        }

    }

    const handleYourDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const errorData = { ...errors } as Errors;
        switch (name) {
            case 'mobile':
                if (!value) {
                    errorData.mobile = "Mobile is required";
                } else if (value.length > 10) {
                    errorData.mobile = "Mobile must be a valid 10-digit number";
                } else {
                    errorData.mobile = "";
                }
                break;
            case 'name':
                if (!value) {
                    errorData.name = 'Full name is required'
                } else {
                    errorData.name = ''
                }
                break;
            case 'email':
                const emailRegex = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;
                if (!emailRegex.test(value)) {
                    errorData.email = "Please enter a valid email address.";
                } else {
                    errorData.email = '';
                }
            default:
                break;
        }
        setErrors(errorData)
        setYourDetails((prevData) => {
            return { ...prevData, [name]: value } as YourDetailsType;
        })
    }

    const orderUpdate = async (count: string, objectId: string, uid: string, modifierId: string, modifierUid: string) => {
        setLoading(true)
        const modifier = modifierId ? [{ catalog_object_id: modifierId }] : [];
        const clear = modifierUid ? [`line_items[${uid}].modifiers[${modifierUid}]`] : [];
        try {
            let body: OrderUpdateBodyAdd;
            if (count === '0') {
                body = {
                    fields_to_clear: [`line_items[${uid}]`],
                    order: {
                        location_id: process.env.NEXT_PUBLIC_LOCATION_ID,
                        version: orderDetails?.version
                    }
                };
            } else {
                body = {
                    fields_to_clear: clear,
                    order: {
                        location_id: process.env.NEXT_PUBLIC_LOCATION_ID,
                        line_items: [
                            {
                                quantity: count,
                                uid: uid,
                                catalog_object_id: objectId,
                                modifiers: modifier
                            }
                        ],
                        pricing_options: {
                            auto_apply_taxes: true,
                            auto_apply_discounts: true
                        },
                        version: orderDetails?.version
                    }
                }
            }



            const orderId = orderDetails?.id;
            const response = await orderUpdateApi(body, orderId);
            if (response?.status === 200) {
                setOrderDetails(response?.data?.order);
                setLineItems(response?.data?.order?.line_items || []);
                setLoading(false);
                if (!globalLoading && !response?.data?.order?.line_items) {
                    router.push('/our-menu')
                }
            }
        } catch (error) {
            console.log('Error', error);

        }
    };

    const fetchOrderDetails = async (orderId: string | unknown) => {
        // setGlobalLoading(true)
        try {

            const response = await retrieveOrder(orderId);
            // setGlobalLoading(false)
            if (response?.status === 200 && response?.data?.order) {
                setOrderDetails(response?.data?.order);
                setLineItems(response?.data?.order?.line_items || []);
                setIsOrderUpdate('created');
                const totalQuantity = response?.data?.order?.line_items?.reduce((sum: number, item: LineItemType) => sum + parseInt(item.quantity, 10), 0);
                setCartItemCount(totalQuantity)
            }
        } catch (error) {
            // setGlobalLoading(false)
            console.log(error);

        }
    };

    const getModifierListData = async () => {
        try {
            const params = { types: 'MODIFIER_LIST' }
            const response = await catalogItems(params);
            if (response?.status === 200) {
                setDataInLocalStorage('ModifierListData', response?.data?.objects);
                setMofierList(response?.data?.objects);
            }

        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        const orderId = getDataFromLocalStorage('OrderId');
        console.log('orderId', orderId);

        if (orderDetails.id || orderId) {
            fetchOrderDetails(orderDetails.id || orderId)
        }

    }, [isOrdered]);

    useEffect(() => {
        getModifierListData()
    }, [])

    return (
        <>
            <div className="w-full p-[20px]">
                <div className="container">
                    {/* Title Start */}
                    <div className='w-full flex items-center py-[20px] relative mt-[35px] mb-[5px]'>
                        <span className="absolute top-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
                        <span className='text-[#A02621] text-[27px] leading-[31px] font-semibold font-unbounded bg-[#eee1d1] absolute pr-[10px] top-[-14px] left-0'>Your Cart</span>
                    </div>
                    {/* Title End */}

                    <div className='w-full'>
                        <div className="w-full px-[21px] py-[25px] bg-[#F7F0E3] rounded-[11px] mb-[27px]">

                            {
                                (orderDetails?.line_items && orderDetails?.line_items?.length > 0) && orderDetails?.line_items?.map((lineItem) => (
                                    <CartItem key={lineItem?.uid}
                                        // getOrderDetails={getOrderDetails}
                                        lineItem={lineItem}
                                        setCartItemCount={setCartItemCount}
                                        cartItemCount={cartItemCount}
                                        setLineItems={setLineItems}
                                        orderDetails={orderDetails}
                                        setOrderDetails={setOrderDetails}
                                        // setUpdateLineItem={setUpdateLineItem}
                                        // updateLineItem={updateLineItem}
                                        setIsOrderUpdate={setIsOrderUpdate}
                                        orderUpdate={orderUpdate}
                                        setLoading={setLoading}
                                        modifierList={modifierList}
                                    // setAmount={setAmount}
                                    // setMoneyDetails={setMoneyDetails} 
                                    />
                                ))
                            }

                            {globalLoading &&

                                <div className="w-full py-[20px] rounded-full p-5 flex justify-center">
                                    <Image className='h-[100px] w-[100px] ' src={LoadingGif} alt="Loading..." />
                                </div>
                            }
                            {/* Add More Items Button */}
                            <button className="w-full mt-6 py-[13px] bg-[#FFC300] text-[#A02621] text-[14px] font-bold rounded-[100px] hover:bg-amber-500 transition-colors" onClick={() => router.push('/our-menu')}>
                                + Add more items
                            </button>

                            {/* Takeaway Notice */}
                            <div className="mt-4 flex items-start gap-2 text-sm text-gray-700">
                                <Image
                                    src="/assets/images/exclamatory.svg"
                                    alt="Del"
                                    width={19}
                                    height={19}
                                />
                                <p className='text-[15px] text-black leading-[25px]'>
                                    This order is for <span className="font-semibold">takeaway only</span>.
                                    If you prefer home delivery, please place your order through{' '}
                                    <Link href="https://www.doordash.com/store/namma-restaurant-milpitas-29736140/?srsltid=AfmBOorYQ1j1NCUV1TAfEetxd3eb3EOeYd8meoKzi3x2YmeJGwZTRyEo" target="_blank" className="underline">DoorDash</Link>.
                                </p>
                            </div>
                        </div>

                        <div className='w-full'>
                            <div className="w-full p-[23px] overflow-hidden relative bg-cover bg-no-repeat " style={{ backgroundImage: `url('/assets/images/pattern-bg.svg')` }}>
                                {/* Order Details Section */}
                                <div className="w-full mb-[30px]">
                                    <h2 className="text-[#A02621] text-[15px] font-bold mb-[12px]">Order Details</h2>

                                    <div className="w-full">
                                        <div className="flex items-center justify-between py-2 relative">
                                            <span className='absolute w-full border-b border-dotted border-[#222A4A] z-0' />
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] pr-[25px] relative z-1">Total Items</span>
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] relative z-1 min-w-[71px] text-right">02</span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 relative">
                                            <span className='absolute w-full border-b border-dotted border-[#222A4A] z-0' />
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] pr-[25px] relative z-1">Amount</span>
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] relative z-1 min-w-[71px] text-right">${parseFloat((((orderDetails?.total_money?.amount / 100) + (orderDetails?.total_discount_money?.amount / 100)) - (orderDetails?.total_tax_money?.amount / 100)).toFixed(2))}</span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 relative">
                                            <span className='absolute w-full border-b border-dotted border-[#222A4A] z-0' />
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] pr-[25px] relative z-1">Tax</span>
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] relative z-1 min-w-[71px] text-right">${orderDetails?.total_tax_money?.amount / 100 || 0}</span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 relative">
                                            <span className='absolute w-full border-b border-dotted border-[#222A4A] z-0' />
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] pr-[25px] relative z-1">Discount</span>
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] relative z-1 min-w-[71px] text-right">${orderDetails?.total_discount_money?.amount / 100 || 0}</span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 relative">
                                            <span className='absolute w-full border-b border-dotted border-[#222A4A] z-0' />
                                            <span className="bg-[#fff] text-[16px] font-semibold text-[#222A4A] pr-[25px] relative z-1">Total Amount</span>
                                            <span className="bg-[#fff] text-[16px] font-semibold text-[#222A4A] relative z-1 min-w-[71px] text-right">${orderDetails?.total_money?.amount / 100 || 0}</span>
                                        </div>


                                    </div>
                                </div>

                                {/* Your Details Section */}
                                <div className="w-full mb-[30px]">
                                    <h2 className="text-[#A02621] text-[15px] font-bold mb-[12px]">Your Details</h2>

                                    <div className="gap-[18px] mb-[20]">
                                        <label className="text-[14px] text-[#222A4A] font-medium">Fullname</label>
                                        <input
                                            type="text"
                                            name='name'
                                            value={yourDetails?.name || ''}
                                            onChange={(event) => handleYourDetailsChange(event)}
                                            className="w-full py-2 text-[14px] text-[#222A4A] border-b border-[#BEB6AC] outline-0"
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    <div className="gap-[18px] mb-[20]">
                                        <label className="text-[14px] text-[#222A4A] font-medium">Email ID</label>
                                        <input
                                            type="email"
                                            name='email'
                                            value={yourDetails?.email || ''}
                                            onChange={(event) => handleYourDetailsChange(event)}
                                            className="w-full py-2 text-[14px] text-[#222A4A] border-b border-[#BEB6AC] outline-0"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    <div className="gap-[18px] mb-[20]">
                                        <label className="text-[14px] text-[#222A4A] font-medium">Mobile</label>
                                        <input
                                            type='number'
                                            name='mobile'
                                            value={yourDetails?.mobile}
                                            onChange={(event) => handleYourDetailsChange(event)}
                                            className="w-full py-2 text-[14px] text-[#222A4A] border-b border-[#BEB6AC] outline-0"
                                        />
                                        {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                                    </div>

                                    <div className="gap-[18px] mb-[20]">
                                        <label className="text-[14px] text-[#222A4A] font-medium">Note (if any)</label>
                                        <input
                                            type="text"
                                            name='note'
                                            value={yourDetails?.note || ''}
                                            onChange={(event) => handleYourDetailsChange(event)}
                                            className="w-full py-2 text-[14px] text-[#222A4A] border-b border-[#BEB6AC] outline-0"
                                        />
                                    </div>
                                </div>

                                {/* Payment Details Section */}
                                <PaymentForm

                                    applicationId="sandbox-sq0idb-CdrXsMRXd9_VI-MO3QiAHQ"
                                    cardTokenizeResponseReceived={(token: TokenData) => {
                                        handleSubmitPayment(token)
                                    }}

                                    locationId={process.env.NEXT_PUBLIC_LOCATION_ID}
                                >
                                    <CreditCard render={(Button: ButtonComponent) => <Button style={button} >
                                        <span>Securely Pay ${orderDetails?.total_money?.amount / 100}</span>
                                    </Button>} />
                                </PaymentForm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg w-[80%] p-6 relative pt-[80px] mt-[150px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center justify-center max-w-lg mx-auto p-6 text-center">
                            <div className='absolute top-[-150px]'>
                                <Image
                                    src="/assets/images/thanks-img.svg"
                                    alt="Del"
                                    width={240}
                                    height={240}
                                />
                            </div>

                            {/* Heading */}
                            <h1 className="text-[#28272C] text-[27px] font-semibold leading-[38px] font-unbounded mb-[13px]">
                                Thank You for
                                <br />
                                Your Order!
                            </h1>
                            <h3 className="text-[#28272C] text-[11px] font-semibold leading-[20px] font-unbounded mb-[11px]">
                                Order ID: {orderDetails?.id}
                            </h3>
                            {/* Success Message */}
                            <div className="mb-6">
                                <p className="text-[14px] text-[#A02621] leading-[21px] font-semibold">
                                    Your order has been placed successfully!🎉
                                </p>
                                <p className="text-[14px] text-[#000000] leading-[21px] ">
                                    We{"'"}re preparing your meal with the freshest ingredients and
                                    authentic flavors to ensure you enjoy a truly satisfying experience.
                                </p>
                            </div>

                            {/* Takeaway Notice */}
                            <div className="text-[14px] text-[#000000] leading-[21px]">
                                {/* <MapPin className="text-red-600 w-5 h-5" /> */}
                                <p className="text-[14px] text-[#000000] leading-[21px]">
                                    📍Reminder: This order is for <span className="text-red-600 font-medium">takeaway only</span>.
                                </p>
                            </div>

                            {/* Delivery Info */}
                            <div className="text-[14px] text-[#000000] leading-[21px] mt-[22px]">
                                <h2 className="text-[14px] text-[#000000] leading-[21px]">Want your next meal delivered?</h2>
                                <p className="text-[14px] text-[#000000] leading-[21px]">
                                    You can order from us on DoorDash for convenient home delivery.
                                </p>
                            </div>

                            <p className="text-[14px] text-[#000000] leading-[21px] mt-[22px]">We can{"'"}t wait to serve you again!</p>

                            {/* Continue Button */}
                            <button className="w-[164px] py-[12px] border border-[#A02621] text-[12px] text-[#A02621] font-medium rounded-[100px] mt-[22px]" onClick={() => {
                                setOrderDetails(OrderDetailsValue)
                                setLineItems([]);
                                setCartItemCount(0);
                                setIsModalOpen(false)
                                setFieldToRemove([])
                                setUpdateLineItem([]);
                                setAmount(0);
                                setIsOrderUpdate('')
                                router.push('/our-menu')
                            }} >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {
                loading && <Loader />
            }
        </>
    );
}


const CartItem = (props: CartProps) => {
    const { lineItem, setCartItemCount, cartItemCount, orderUpdate, setLoading, modifierList
    } = props;

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [quantity, setQuantity] = useState(parseInt(lineItem?.quantity) || 0);
    const [isItemAdded, setIsItemAdded] = useState(false);
    const [modifierListData, setModifierListData] = useState<ModifierType[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [modifierId, setModifierId] = useState<string>('');

    const handleCountIncrement = async (quantityVal: number) => {

        setIsItemAdded(true);
        const countIncrease = quantityVal + 1;
        setQuantity(countIncrease);
        setCartItemCount(cartItemCount + 1);
        const updateCount = String(countIncrease)
        orderUpdate(updateCount, lineItem?.catalog_object_id, lineItem?.uid, '', '')
    }

    const handleQuantityDecrement = (quantityVal: number) => {

        setIsItemAdded(true)
        const countIncrease = quantityVal - 1;

        setCartItemCount(cartItemCount - 1);
        setQuantity(countIncrease);

        if (countIncrease < 1) {
            orderUpdate('0', lineItem?.catalog_object_id, lineItem?.uid, '', '')
        } else {
            const updateCount = String(countIncrease)
            orderUpdate(updateCount, lineItem?.catalog_object_id, lineItem?.uid, '', '');


        };


    };

    const changeModifier = async () => {
        if (lineItem?.catalog_object_id) {

            setLoading(true)

            try {

                const response = await getCatalogObject(lineItem?.modifiers[0]?.catalog_object_id);
                setLoading(false)
                if (response?.status === 200) {
                    setIsModalOpen(true);
                    const modifierData = modifierList?.find((modifier) => modifier?.id === response?.data?.object?.modifier_data?.modifier_list_id)
                    console.log('modifierData', modifierData, response?.data?.object?.modifier_data?.modifier_list_id);

                    setModifierListData(modifierData?.modifier_list_data?.modifiers || [])
                }
            } catch (error) {
                setLoading(false)
                console.log(error);

            }




        }
    };
    const handleCheckboxChange = (modifierName: string, modifierId: string, modifier: { id: string }) => {
        setSelectedOption(modifierName);
        // lineItem?.modifiers[0]?.catalog_object_id === modifierId
        if (modifier?.id !== lineItem?.modifiers[0]?.catalog_object_id) {
            setModifierId(modifierId)

        } else {
            setModifierId('')
        }



    };

    return <div className='w-full flex items-center justify-between mb-[28px] last:mb-0'>
        <h3 className="text-[#222A4A] text-[14px] items-start font-medium flex flex-col flex-[3]" style={{wordBreak: 'break-all'}}>
            {lineItem?.name}&nbsp;&nbsp;
            {lineItem?.modifiers?.length > 0 && <button className="text-[#A07E21] text-[14px] font-normal" onClick={changeModifier}> (Change)</button>}
        </h3>
        <div className='flex flex-col items-center ml-3 flex-1 justify-end'>
            <div className="text-[#222A4A] text-[15px] font-semibold text-center">${(lineItem?.base_price_money?.amount / 100 * (isItemAdded ? quantity : parseInt(lineItem?.quantity))).toFixed(2)}</div>
            <div className="flex items-center w-[100px] mx-auto border border-[#A02621] rounded-[100px] overflow-hidden text-[#A02621] text-[12px]">
                <button
                    onClick={() => {
                        handleQuantityDecrement(isItemAdded ? quantity : parseInt(lineItem?.quantity))
                    }}
                    className="px-3 py-1 text-red-600 hover:bg-gray-100"
                >
                    -
                </button>
                <span className="px-3 py-1 text-red-600">
                    {isItemAdded ? quantity : lineItem?.quantity}
                </span>
                <button
                    onClick={() => {
                        handleCountIncrement(isItemAdded ? quantity : parseInt(lineItem?.quantity))
                    }}
                    className="px-3 py-1 text-red-600 hover:bg-gray-100"
                >
                    +
                </button>
            </div>
        </div>
        {
            isModalOpen && <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] pb-[80px] px-[20px] "
                onClick={() => setIsModalOpen(false)}
            >
                <div
                    className="bg-white rounded-lg w-full p-[30px] relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-full flex flex-col items-start justify-center">
                        <h2 className="text-lg font-semibold text-gray-800 mb-[10px]">Customization</h2>
                        {modifierListData && modifierListData?.length && modifierListData.map((modifier: ModifierType) => (
                            <div
                                key={modifier?.id}
                                className="flex items-center justify-between w-full py-[10px] relative"
                            >
                                <span className='absolute w-full border-b border-dotted border-[#222A4A] z-[1]' />
                                <span className=" bg-white min-w-[100px] relative z-[2]">{modifier?.modifier_data?.name}</span>
                                <div className="bg-white relative z-[2] flex pl-[10px]">

                                    <input
                                        type="checkbox"
                                        id={modifier?.modifier_data?.name}
                                        name="customization"
                                        value={modifier?.modifier_data?.name}
                                        checked={(selectedOption || lineItem?.modifiers[0]?.name) === modifier?.modifier_data?.name}
                                        onChange={() => handleCheckboxChange(modifier?.modifier_data?.name, modifier?.id, modifier)}
                                        className="hidden peer"
                                    />

                                    <label
                                        htmlFor={modifier?.modifier_data?.name}
                                        className="w-5 h-5 border border-[#222A4A] rounded-full flex items-center justify-center cursor-pointer peer-checked:border-[#A02621] peer-checked:bg-[#A02621]"
                                    >
                                        <div className="w-2.5 h-2.5 bg-white rounded-full peer-checked:bg-[#A02621]"></div>
                                    </label>
                                </div>

                                {/* <span className=' bg-white relative z-[2] flex pl-[10px]'>
                    
                    </span> */}

                            </div>
                        ))}

                        <div className='w-full flex justify-end mt-4' onClick={() => {
                            setIsModalOpen(false);
                            if (modifierId) {
                                orderUpdate(String(quantity), lineItem?.catalog_object_id, lineItem?.uid, modifierId, lineItem?.modifiers[0]?.uid)
                            }
                        }}>
                            <button className='bg-[#FFC300] px-[32px] py-[5px] rounded-[100px] text-[14px] font-bold text-[#A02621] relative'>Confirm</button>
                        </div>


                    </div>
                </div>
            </div>
        }
    </div>


}

export default CartScreen;