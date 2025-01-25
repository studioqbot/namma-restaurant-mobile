'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Image from "next/image";
import GlobalContext from '@/constants/global-context';
import { Errors, LineItemsType, LineItemType, OrderDetailsType, OrderDetailsValue, YourDetailsType } from '@/constants/types';
import { createPayment, orderUpdateApi, retrieveOrder } from '@/services/apiServices';
import Loader from '@/components/loder';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDataFromLocalStorage } from '@/utils/genericUtilties';

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
    orderUpdate: (count: string, objectId: string, uid: string) => Promise<void>;
    // setAmount: React.Dispatch<React.SetStateAction<string | number>>;
    // setMoneyDetails: any;

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
        setAmount, amount, setFieldToRemove, setUpdateLineItem,isOrdered } = useContext(GlobalContext)
    const [loading, setLoading] = useState<boolean>(false);
    const [yourDetails, setYourDetails] = useState<YourDetailsType>();
    const [errors, setErrors] = useState<Errors>({
        name: '',
        mobile: ''
    });
    const router = useRouter()
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);



    const handleSubmitPayment = async (tokenData: any) => {

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
                location_id: "LC1BQTNRBNPKQ",
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
                console.log("Error", error);

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

    const orderUpdate = async (count: string, objectId: string, uid: string) => {
        setLoading(true)
        try {
            let body;
            if (count === '0') {
                body = {
                    fields_to_clear: [`line_items[${uid}]`],
                    order: {
                        location_id: 'LC1BQTNRBNPKQ',
                        version: orderDetails?.version
                    }
                };
            } else {
                body = {
                    order: {
                        location_id: "LC1BQTNRBNPKQ",
                        line_items: [
                            {
                                quantity: count,
                                uid: uid,
                                catalog_object_id: objectId
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
                const totalBasePrice = response?.data?.order?.line_items?.reduce((sum: number, item: LineItemType) => sum + (item.base_price_money.amount * parseInt(item?.quantity)), 0);
                setAmount(totalBasePrice);
                setLoading(false);
            }
        } catch (error) {
            console.log('Error', error);

        }
    };

    const fetchOrderDetails = async (orderId : string|unknown) => {
        try {
           
            const response = await retrieveOrder(orderId)
            if (response?.status === 200 && response?.data?.order) {
                setOrderDetails(response?.data?.order);
                setLineItems(response?.data?.order?.line_items || []);
                setIsOrderUpdate('created');
                const totalQuantity = response?.data?.order?.line_items?.reduce((sum: any, item: any) => sum + parseInt(item.quantity, 10), 0);
                setCartItemCount(totalQuantity)
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        const orderId = getDataFromLocalStorage('OrderId');
        console.log('orderId', orderId);
        
        if (orderDetails.id || orderId) {
            fetchOrderDetails(orderDetails.id || orderId)
        }

    }, [isOrdered])

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
                                    // setAmount={setAmount}
                                    // setMoneyDetails={setMoneyDetails} 
                                    />
                                ))
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
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] relative z-1 min-w-[71px] text-right">${amount}</span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 relative">
                                            <span className='absolute w-full border-b border-dotted border-[#222A4A] z-0' />
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] pr-[25px] relative z-1">Tax</span>
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] relative z-1 min-w-[71px] text-right">${orderDetails?.total_tax_money?.amount}</span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 relative">
                                            <span className='absolute w-full border-b border-dotted border-[#222A4A] z-0' />
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] pr-[25px] relative z-1">Discount</span>
                                            <span className="bg-[#fff] text-[14px] text-[#222A4A] relative z-1 min-w-[71px] text-right">${orderDetails?.total_discount_money?.amount}</span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 relative">
                                            <span className='absolute w-full border-b border-dotted border-[#222A4A] z-0' />
                                            <span className="bg-[#fff] text-[16px] font-semibold text-[#222A4A] pr-[25px] relative z-1">Total Amount</span>
                                            <span className="bg-[#fff] text-[16px] font-semibold text-[#222A4A] relative z-1 min-w-[71px] text-right">${orderDetails?.total_money?.amount}</span>
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
                                    cardTokenizeResponseReceived={(token: any) => {
                                        handleSubmitPayment(token)
                                    }}

                                    locationId="LC1BQTNRBNPKQ"
                                >
                                    <CreditCard render={(Button: any) => <Button style={button} >
                                        <span>Securely Pay ${2328.50}</span>
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

                            {/* Success Message */}
                            <div className="mb-6">
                                <p className="text-[14px] text-[#A02621] leading-[21px] font-semibold">
                                    Your order has been placed successfully!🎉
                                </p>
                                <p className="text-[14px] text-[#000000] leading-[21px] ">
                                    We're preparing your meal with the freshest ingredients and
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

                            <p className="text-[14px] text-[#000000] leading-[21px] mt-[22px]">We can't wait to serve you again!</p>

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
    const { lineItem, setCartItemCount, cartItemCount, orderUpdate
    } = props;

    const [quantity, setQuantity] = useState(parseInt(lineItem?.quantity) || 0);
    const [isItemAdded, setIsItemAdded] = useState(false);



    const handleCountIncrement = async (quantityVal: number) => {

        setIsItemAdded(true);
        const countIncrease = quantityVal + 1;
        setQuantity(countIncrease);
        setCartItemCount(cartItemCount + 1);
        const updateCount = String(countIncrease)
        orderUpdate(updateCount, lineItem?.catalog_object_id, lineItem?.uid)
    }

    const handleQuantityDecrement = (quantityVal: number) => {

        setIsItemAdded(true)
        const countIncrease = quantityVal - 1;

        setCartItemCount(cartItemCount - 1);
        setQuantity(countIncrease);

        if (countIncrease < 1) {
            orderUpdate('0', lineItem?.catalog_object_id, lineItem?.uid)
        } else {
            const updateCount = String(countIncrease)
            orderUpdate(updateCount, lineItem?.catalog_object_id, lineItem?.uid)


        };


    };

    return <div className='w-full flex items-center justify-between mb-[28px] last:mb-0'>
        <h3 className="text-[#222A4A] text-[14px] font-medium">
            {lineItem?.name}
        </h3>
        <div className='flex flex-col items-center ml-3'>
            <div className="text-[#222A4A] text-[15px] font-semibold text-center">${lineItem?.base_price_money?.amount * (isItemAdded ? quantity : parseInt(lineItem?.quantity))}</div>
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
    </div>
    {/* <div className='w-full flex items-center justify-between'>
            <h3 className="text-[#222A4A] text-[14px] font-medium">
                Nei Milagu Kozhi Sukka - Andhra <span className="text-[#A07E21] text-[14px] font-normal">(Change)</span>
            </h3>
            <div className='flex flex-col items-center ml-3'>
                <div className="text-[#222A4A] text-[15px] font-semibold text-center">$12.99</div>
                <div className="flex items-center w-[100px] mx-auto border border-[#A02621] rounded-[100px] overflow-hidden text-[#A02621] text-[12px]">
                    <button
                        // onClick={() => updateQuantity(name, -1)}
                        className="px-3 py-1 text-red-600 hover:bg-gray-100"
                    >
                        -
                    </button>
                    <span className="px-3 py-1 text-red-600">
                        1
                    </span>
                    <button
                        // onClick={() => updateQuantity(name, 1)}
                        className="px-3 py-1 text-red-600 hover:bg-gray-100"
                    >
                        +
                    </button>
                </div>
            </div>
        </div> */}

}

export default CartScreen;