'use client';
import Loader from '@/components/loder';
import GlobalContext from '@/constants/global-context';
import { CatalogItemsType, CategoryDataType, LineItemsType, ModifierDataType, ModifierIds, ModifierType, OrderCreateBody,  OrderUpdateBodyAdd } from '@/constants/types';
import { catalogItems, catalogSearchApi, orderCreateApi, orderUpdateApi } from '@/services/apiServices';
import { getDataFromLocalStorage, isEmptyObj, removeItemFrmLocalStorage, setDataInLocalStorage } from '@/utils/genericUtilties';
import dayjs, { Dayjs } from 'dayjs';
import React, { useContext, useEffect, useMemo, useState } from 'react';
interface OurMenuItemsType {
    data: CatalogItemsType;
    setLineItems: React.Dispatch<React.SetStateAction<LineItemsType[]>>;
    lineItems: LineItemsType[];
    setUpdateLineItem: React.Dispatch<React.SetStateAction<LineItemsType[]>>;
    updateLineItem: LineItemsType[];
    setIsItemAdded: React.Dispatch<React.SetStateAction<boolean>>;
    modifierList: ModifierDataType[];
    modifierIds: ModifierIds[];
    setModifierIds: React.Dispatch<React.SetStateAction<ModifierIds[]>>;
    setFieldToClear: React.Dispatch<React.SetStateAction<string[]>>;

};
const OurMenuItems = ({ data, setLineItems, lineItems, setUpdateLineItem, setIsItemAdded, updateLineItem, modifierList }: OurMenuItemsType) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [modifierListData, setModifierListData] = useState<ModifierType[] | undefined>([]);
    const [selectedOption, setSelectedOption] = useState<string>('');



    const [isAdded, setIsAdded] = useState(false);
    const { setCartItemCount, cartItemCount, isOrderUpdate, orderDetails, setFieldToRemove } = useContext(GlobalContext);

    const matchedItem = useMemo(() => {
        return orderDetails?.line_items?.find(
            (dataItem: LineItemsType) => dataItem?.catalog_object_id === data?.item_data?.variations[0]?.id
        );
    }, [lineItems, data]);


    const handleCountIncrement = async (quantityVal: string | undefined) => {
        setIsItemAdded(true);
        const count = quantityVal ? parseInt(quantityVal) : quantity;
        setQuantity(count + 1);
        setCartItemCount(cartItemCount + 1);


        setLineItems((prevData: LineItemsType[]) => {
            const items = prevData.find((obj: LineItemsType) => obj.catalog_object_id === data?.item_data?.variations[0]?.id);
            if (items) {
                items.quantity = String(count + 1);
                return prevData;
            }
            return prevData
        });

        if ((isOrderUpdate === 'update' || isOrderUpdate === 'created' || isOrderUpdate === 'updated')) {
            const updateItem = orderDetails?.line_items?.find((obj: LineItemsType) => obj.catalog_object_id === data?.item_data?.variations[0]?.id) as LineItemsType | undefined;;

            setUpdateLineItem((prevData: LineItemsType[]) => {
                const items = prevData.find((obj: LineItemsType) => obj.catalog_object_id === data?.item_data?.variations[0]?.id) as LineItemsType;
                if (!items) {
                    return [...prevData, {
                        quantity: String(count + 1),
                        uid: updateItem?.uid,
                        catalog_object_id: data?.item_data?.variations[0]?.id
                    }] as LineItemsType[]
                } else {
                    items.quantity = String(count + 1);
                    items.uid = updateItem?.uid;
                    return prevData as LineItemsType[];
                }
            });
        }

    }


    const handleCountDecrement = (quantityVal: string | undefined) => {
        setIsItemAdded(true);
        const count = quantityVal ? parseInt(quantityVal) : quantity;
        setCartItemCount(cartItemCount - 1);
        if (count == 1) {

            const removeLineItem = lineItems?.filter((item) => item?.catalog_object_id !== data?.item_data?.variations[0]?.id);
            setLineItems(removeLineItem);
            const updateItem = orderDetails?.line_items?.find((obj: LineItemsType) => obj.catalog_object_id === data?.item_data?.variations[0]?.id);
            setFieldToRemove((prevData) => [...prevData, `line_items[${updateItem?.uid}]`] as string[])
            const removeUpdateLineItem = updateLineItem?.filter((item: LineItemsType) => item?.uid !== updateItem?.uid);
            setUpdateLineItem(removeUpdateLineItem);
        } else {

            setLineItems((prevData: LineItemsType[]) => {
                const item = prevData.find((obj: LineItemsType) => obj.catalog_object_id === data?.item_data?.variations[0]?.id);
                if (item) {
                    item.quantity = String(count - 1);
                    return prevData;
                }
                return prevData;
            });


        };

        if (matchedItem?.quantity) {
            setQuantity(parseInt(matchedItem?.quantity) - 1);
        } else {
            setQuantity(quantity - 1)
        };
    };

    const handleAddClick = () => {
        setIsItemAdded(true)
        setQuantity(quantity + 1)
        setCartItemCount(cartItemCount + 1)
        setIsAdded(true)
        if (data?.item_data?.modifier_list_info && data?.item_data?.modifier_list_info[0]?.modifier_list_id) {
            setIsModalOpen(true);
            const modifierData = modifierList?.find((modifier) => modifier?.id === data?.item_data?.modifier_list_info[0]?.modifier_list_id) as ModifierDataType | undefined;
            setModifierListData(modifierData?.modifier_list_data?.modifiers || []);

        }

        if (!isOrderUpdate) {
            setLineItems([...lineItems, {
                quantity: String(quantity + 1),
                catalog_object_id: data?.item_data?.variations[0]?.id,
            }] as LineItemsType[]);
        } else {
            setLineItems((prevData) => {
                return [...prevData, {
                    quantity: String(quantity + 1),
                    catalog_object_id: data?.item_data?.variations[0]?.id,
                }] as LineItemsType[]
            });
            setUpdateLineItem((prevData) => {
                return [...prevData, {
                    quantity: String(quantity + 1),
                    catalog_object_id: data?.item_data?.variations[0]?.id,
                }] as LineItemsType[];
            })
        }
    }



    const handleCheckboxChange = (modifierName: string, modifierId: string) => {
        setSelectedOption(modifierName);



        setLineItems((prevData: LineItemsType[]) => {
            const addModifier = prevData?.find((item) => item.catalog_object_id === data?.item_data?.variations[0]?.id);
            if (addModifier) {
                addModifier.modifiers = [{ catalog_object_id: modifierId }]
            }
            return prevData
        }

        );

        if (isOrderUpdate && isOrderUpdate !== 'create') {
            setUpdateLineItem((prevData: LineItemsType[]) => {
                const addModifier = prevData?.find((item) => item.catalog_object_id === data?.item_data?.variations[0]?.id);
                if (addModifier) {
                    addModifier.modifiers = [{ catalog_object_id: modifierId }]
                }
                return prevData
            }

            );
        }


    };




    return (
        <>
            <div className="flex items-center justify-between py-2 relative w-full">
                <div className='flex flex-col font-semibold flex-[3] '>
                    <span className="bg-[#eee1d1] text-[16px] text-[#222A4A] pr-[10px]" style={{wordBreak: 'break-all'}}>{data?.item_data?.name}</span>
                    <span className="bg-[#eee1d1] text-[16px] text-[#222A4A] font-normal">${data?.item_data?.variations[0]?.item_variation_data?.price_money?.amount / 100}</span>
                </div>
                <div className="flex items-center justify-end bg-[#eee1d1] gap-4 pl-[11px] flex-1">
                    {(isAdded || (matchedItem && !isEmptyObj(matchedItem))) ? <div className="flex items-center min-w-[100px] border border-[#A02621] rounded-[100px] overflow-hidden text-[#A02621] text-[15px]">
                        <button
                            onClick={() => handleCountDecrement(matchedItem?.quantity)}
                            className="px-3 py-1 text-[#A02621] hover:bg-gray-100"
                        >
                            -
                        </button>
                        <span className="px-3 py-1 text-[#A02621]">
                            {matchedItem ? matchedItem?.quantity : quantity}
                        </span>
                        <button
                            onClick={() => {
                                handleCountIncrement(matchedItem?.quantity)
                            }}
                            className="px-3 py-1 text-[#A02621] hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div> : <button
                        onClick={handleAddClick}
                        className="py-[4px] min-w-[100px] border border-[#A02621] rounded-[100px] overflow-hidden text-[#A02621] text-[15px]"
                    >
                        Add
                    </button>}
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
                                        <span className="bg-white min-w-[100px] relative z-[2] text-left">{modifier?.modifier_data?.name}</span>
                                        <div className="bg-white relative z-[2] flex pl-[10px]">

                                            <input
                                                type="checkbox"
                                                id={modifier?.modifier_data?.name}
                                                name="customization"
                                                value={modifier?.modifier_data?.name}
                                                checked={selectedOption === modifier?.modifier_data?.name}
                                                onChange={() => handleCheckboxChange(modifier?.modifier_data?.name, modifier?.id)}
                                                className="hidden peer"
                                            />

                                            <label
                                                htmlFor={modifier?.modifier_data?.name}
                                                className="w-5 h-5 border border-[#222A4A] rounded-full flex items-center justify-center cursor-pointer peer-checked:border-[#A02621] peer-checked:bg-[#A02621]"
                                            >
                                                <div className="w-2.5 h-2.5 bg-white rounded-full peer-checked:bg-[#A02621]"></div>
                                            </label>
                                        </div>

                                    </div>
                                ))}
                                <div className='w-full flex justify-end mt-4' onClick={() => {
                                    if (selectedOption) {
                                        setIsModalOpen(false)
                                    }
                                }}>
                                    <button className='bg-[#FFC300] px-[32px] py-[5px] rounded-[100px] text-[14px] font-bold text-[#A02621] relative'>Confirm</button>
                                </div>

                            </div>
                        </div>
                    </div>
                }
            </div>


        </>
    );
};

const OurMenu = () => {

    const { setCatalogCategory, setCatalogCategoryAndItem, catalogCategory, isOrderUpdate,
        catalogCategoryAndItem, lineItems, updateLineItem, setLineItems, setUpdateLineItem, orderDetails, setIsOrdered, isOrdered,
        setIsOrderUpdate, setOrderDetails, setFieldToRemove, fieldToRemove, catalogCategoryTab, setCatalogCategoryTab, setGlobalLoading } = useContext(GlobalContext);
    const [modifierList, setMofierList] = useState<ModifierDataType[]>([]);
    const [isItemAdded, setIsItemAdded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modifierIds, setModifierIds] = useState<ModifierIds[]>([]);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

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

    const getCatalofCategoryData = async () => {
        try {
            const params = { types: 'CATEGORY' }
            const response = await catalogItems(params);
            if (response?.status === 200) {
                setDataInLocalStorage('CatalogCategoryData', response?.data?.objects);
                setCatalogCategory(response?.data?.objects);
                setCatalogCategoryTab(response?.data?.objects);
            }

        } catch (error) {
            console.log('Error', error);
        }
    };

    const getCatalofItemAndCAtegoryData = async () => {
        try {
            const params = { types: 'ITEM' }
            const response = await catalogItems(params);
            if (response?.status === 200) {
                setDataInLocalStorage('CatalogItemsData', response?.data?.objects)
                const currentTimePlusFiveMinutes = dayjs().add(1, 'week').toDate();

                setDataInLocalStorage('Date', currentTimePlusFiveMinutes)

                setCatalogCategoryAndItem(response?.data?.objects)
            }


        } catch (error) {
            console.log('Error', error);

        }
    };

    const handleCategoryTabs = async (categoryItem: CategoryDataType) => {

        setCatalogCategory([
            categoryItem
        ]);
        closeMenuModal()

    };

    const getOurMenuDatasFromLocal = () => {
        const itemAndCategoryData: CatalogItemsType[] | null = getDataFromLocalStorage('CatalogItemsData');
        const categoryData: CategoryDataType[] | null = getDataFromLocalStorage('CatalogCategoryData');
        const modifierData: ModifierDataType[] | null = getDataFromLocalStorage('ModifierListData');


        if (itemAndCategoryData && itemAndCategoryData?.length) {
            setCatalogCategoryAndItem(itemAndCategoryData)

        }
        if (categoryData && categoryData?.length) {
            setCatalogCategory(categoryData);
            setCatalogCategoryTab(categoryData);
        }
        if (modifierData && modifierData?.length) {

            setMofierList(modifierData);

        }
    };

    const handleSearchItemsChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = event.target.value;

        if (timeoutId) {
            clearTimeout(timeoutId);
        }


        const newTimeoutId = setTimeout(() => {
            searchCatakogItems(searchText);
        }, 500); // 500ms delay

        setTimeoutId(newTimeoutId);
    };

    const searchCatakogItems = async (searchText: string) => {
        setLoading(true)
        if (searchText) {
            try {
                const body = {
                    query: {
                        text_query: {
                            keywords: [searchText]
                        }
                    }
                };
                const response = await catalogSearchApi(body);
                setLoading(false)
                if (response?.status === 200 && response?.data?.objects) {
                    setCatalogCategoryAndItem(response?.data?.objects);
                    const categoryIds = response?.data?.objects?.map((data: CatalogItemsType) => data?.item_data?.category_id);


                    if (categoryIds?.length) {
                        const filterData = catalogCategoryTab?.filter((item) => categoryIds?.includes(item?.id));


                        setCatalogCategory(filterData)
                    }


                } else {
                    getOurMenuDatasFromLocal();
                }
            } catch (error) {
                setLoading(false)
                console.log("Error", error);
                getOurMenuDatasFromLocal();
            }
        } else {
            setLoading(false)
            getOurMenuDatasFromLocal()
        }

    }

    const orderCreate = async () => {
        setGlobalLoading(true)
        const body: OrderCreateBody = {
            order: {
                location_id: process.env.NEXT_PUBLIC_LOCATION_ID,
                line_items: lineItems,
                modifiers: modifierIds,
                pricing_options: {
                    auto_apply_taxes: true,
                    auto_apply_discounts: true,
                },
            }
        }
        if (modifierIds?.length > 0) {
            delete body?.order?.modifiers
        }
        try {
            const response = await orderCreateApi(body);
            setGlobalLoading(false)
            if (response?.status === 200) {
                setIsOrderUpdate('created');
                setOrderDetails(response?.data?.order);
                setDataInLocalStorage('OrderId', response?.data?.order?.id)
                setLineItems(response?.data?.order?.line_items || []);
                setIsOrdered(!isOrdered);

            };

        } catch (error) {
            setGlobalLoading(false)
            console.log('Error', error);
        };
    };

    const orderUpdate = async () => {
        setGlobalLoading(true)
        const body: OrderUpdateBodyAdd = {
            fields_to_clear: fieldToRemove,
            order: {
                location_id: process.env.NEXT_PUBLIC_LOCATION_ID,
                line_items: updateLineItem,

                pricing_options: {
                    auto_apply_taxes: true,
                    auto_apply_discounts: true,
                },
                version: orderDetails?.version
            }
        }
        try {
            const response = await orderUpdateApi(body, orderDetails?.id)
            setGlobalLoading(false)
            if (response?.status === 200) {

                setOrderDetails(response?.data?.order);
                setLineItems(response?.data?.order?.line_items || []);
                setIsOrderUpdate('updated');
                setIsOrdered(!isOrdered);
            }

        } catch (error) {
            setGlobalLoading(false)
            console.log('Error', error);
        }
    };



    useEffect(() => {
        const dateData: Dayjs | null = getDataFromLocalStorage('Date');

        // if (activeMenu === 'All') {
        getOurMenuDatasFromLocal();
        // }

        if (((dayjs(dateData).isSame() || dayjs(dateData).isBefore()) || !dateData)) {
            // if (activeMenu === 'All') {
            getCatalofItemAndCAtegoryData();
            getCatalofCategoryData();
            getModifierListData();
            // }

        }

    }, []);

    useEffect(() => {

        if ((isOrderUpdate === 'create')) {
            orderCreate();
        } else if ((isOrderUpdate && isItemAdded)) {
            orderUpdate();
        }

    }, [isOrderUpdate]);


    useEffect(() => {
        if (lineItems?.length === 0) {
            removeItemFrmLocalStorage(['OrderId'])
        }
    }, []);

    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const openMenuModal = () => setIsMenuModalOpen(true);
    const closeMenuModal = () => setIsMenuModalOpen(false);

    return (
        <div className="w-full p-[20px]">
            <div className="container">
                <div className='w-full flex items-center relative mt-[25px] mb-[30px]'>
                    <span className="absolute top-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
                    <span className='text-[#A02621] text-[27px] leading-[31px] font-semibold font-unbounded bg-[#eee1d1] absolute pr-[10px] top-[-14px] left-0'>Our Menu</span>
                </div>
                {(catalogCategory && catalogCategory?.length > 0) && catalogCategory?.map((category, index) => {
                    const catalogItems = catalogCategoryAndItem?.filter((itemData: CatalogItemsType) => {
                        return itemData?.item_data?.category_id === category?.id;
                    });
                    return <div key={index} className="w-full">
                        <div className="my-[25px] w-full float-left">
                            <h2 className="text-[23px] font-medium bg-[#eee1d1] font-unbounded text-[#222A4A]">
                                {category?.category_data?.name}
                            </h2>
                            <div className="space-y-2">
                                {(catalogItems && catalogItems?.length > 0) && catalogItems?.map((item) => (
                                    <OurMenuItems
                                        key={item?.id}
                                        data={item}
                                        lineItems={lineItems}
                                        setLineItems={setLineItems}
                                        setUpdateLineItem={setUpdateLineItem}
                                        updateLineItem={updateLineItem}
                                        setIsItemAdded={setIsItemAdded}
                                        modifierList={modifierList}
                                        modifierIds={modifierIds}
                                        setModifierIds={setModifierIds}
                                        setFieldToClear={setFieldToRemove}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                })}
            </div>
            {/* Menu Search */}
            <div className='w-full flex fixed bottom-0 justify-between p-[20px] left-0 right-0 z-10'>
                <div className='w-[100%] pr-[8px] relative'>
                    <input
                        type="text"
                        onChange={handleSearchItemsChange}
                        className="w-full py-[10px] px-[15px] text-[14px] text-[#222A4A] border border-[#450A08] rounded-[100px] outline-0 bg-[#F9F2EA] pr-[50px]"
                    />
                    <img src='/assets/images/search.svg' alt='search' className='absolute right-[30px] top-[12px]' />
                </div>
                <div className=' relative'>
                    <button className='w-[104px] bg-[#450A08] rounded-[100px] h-[43px] text-[#EEE1D1] flex justify-center items-center py-[11px] px-[18px]w-[104px]' style={{ boxShadow: '0px 5px 5.6px 0px rgba(98, 65, 26, 0.5)' }} onClick={openMenuModal}>
                        <img src='/assets/images/menu-items.svg' alt='search' className='mr-[6px]' />
                        <span>Menu</span>
                    </button>
                </div>
            </div>

            {isMenuModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-[20px] "
                    onClick={closeMenuModal}
                >
                    <div
                        className="bg-white rounded-lg w-full p-[30px] relative h-[400px] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full flex flex-col items-start justify-center text-[#222A4A] text-[17px] gap-[30px]">
                            <span onClick={() => {
                                setCatalogCategory([...catalogCategoryTab]);
                                closeMenuModal()

                            }}>All</span>
                            {
                                (catalogCategoryTab && catalogCategoryTab?.length) && catalogCategoryTab?.map((item) => (
                                    <span onClick={() => handleCategoryTabs(item)} key={item?.id} >{item?.category_data?.name}</span>
                                ))
                            }


                        </div>
                    </div>
                </div>
            )}
            {
                loading && <Loader />
            }
        </div>
    );
};

export default OurMenu;
