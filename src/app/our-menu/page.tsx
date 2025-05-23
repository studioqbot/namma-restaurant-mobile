'use client';
import Loader from '@/components/loder';
import GlobalContext from '@/constants/global-context';
import { CatalogItemsType, CategoryDataType, LineItemsType, ModifierDataType, ModifierIds } from '@/constants/types';
import { catalogItems, catalogSearchApi } from '@/services/apiServices';
import { getDataFromLocalStorage, removeItemFrmLocalStorage, setDataInLocalStorage } from '@/utils/genericUtilties';
import dayjs, { Dayjs } from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
interface OurMenuItemsType {
    data: CatalogItemsType;
    setLineItems: React.Dispatch<React.SetStateAction<LineItemsType[]>>;
    lineItems: LineItemsType[];
    setUpdateLineItem: React.Dispatch<React.SetStateAction<LineItemsType[]>>;
    updateLineItem: LineItemsType[];

    modifierList: ModifierDataType[];
    modifierIds: ModifierIds[];
    setModifierIds: React.Dispatch<React.SetStateAction<ModifierIds[]>>;
    setFieldToClear: React.Dispatch<React.SetStateAction<string[]>>;
};

const OurMenuItems = ({ data }: OurMenuItemsType) => {

    return (
        <>
            {data?.item_data?.variations[0]?.item_variation_data?.price_money?.amount > 0 &&
                <div className="flex items-center py-2 w-full">
                    <span className="text-[16px] text-[#222A4A] font-semibold">
                        {data?.item_data?.name}
                    </span>
                    <div className="flex-grow border-b border-dotted border-[#222A4A] mx-2" />
                    <span className="text-[16px] text-[#222A4A] font-normal">
                        ${(data?.item_data?.variations[0]?.item_variation_data?.price_money?.amount) / 100}
                    </span>
                </div>
            }
        </>
    );
};

const OurMenu = () => {

    const { setCatalogCategory, setCatalogCategoryAndItem, catalogCategory,
        catalogCategoryAndItem, lineItems, updateLineItem, setLineItems, setUpdateLineItem,
        setFieldToRemove, catalogCategoryTab, setCatalogCategoryTab } = useContext(GlobalContext);
    const [modifierList, setMofierList] = useState<ModifierDataType[]>([]);

    const [loading, setLoading] = useState(false);
    const [modifierIds, setModifierIds] = useState<ModifierIds[]>([]);
    const [catalogCategoryAndItemCopy, setCatalogCategoryAndItemCopy] = useState<CatalogItemsType[]>([]);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [searchValue, setSearchValue] = useState('');


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
                const currentTimePlusFiveMinutes = dayjs().add(1, 'day').toDate();
                setDataInLocalStorage('Date', currentTimePlusFiveMinutes)
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
                const currentTimePlusFiveMinutes = dayjs().add(1, 'day').toDate();

                setDataInLocalStorage('Date', currentTimePlusFiveMinutes)

                setCatalogCategoryAndItem(response?.data?.objects);
                setCatalogCategoryAndItemCopy(response?.data?.objects);
            }


        } catch (error) {
            console.log('Error', error);

        }
    };



    const handleCategoryTabs = async (categoryItem: CategoryDataType) => {
        setSearchValue('');
        setCatalogCategory([
            categoryItem
        ]);
        setCatalogCategoryAndItem([...catalogCategoryAndItemCopy])
        closeMenuModal()

    };

    const getOurMenuDatasFromLocal = () => {
        const itemAndCategoryData: CatalogItemsType[] | null = getDataFromLocalStorage('CatalogItemsData');
        const categoryData: CategoryDataType[] | null = getDataFromLocalStorage('CatalogCategoryData');
        const modifierData: ModifierDataType[] | null = getDataFromLocalStorage('ModifierListData');


        if (itemAndCategoryData && itemAndCategoryData?.length) {
            setCatalogCategoryAndItem(itemAndCategoryData)
            setCatalogCategoryAndItemCopy(itemAndCategoryData)

        }
        if (categoryData && categoryData.length) {
            const uniqueByName = new Map<string, CategoryDataType>();

            categoryData.forEach((cat: CategoryDataType) => {
                const name = cat?.category_data?.name?.trim().toLowerCase();
                if (name && !uniqueByName.has(name)) {
                    uniqueByName.set(name, cat);
                }
            });

            const uniqueCategories = Array.from(uniqueByName.values());

            setCatalogCategory(uniqueCategories);
            setCatalogCategoryTab(uniqueCategories);
        }

        if (modifierData && modifierData?.length) {

            setMofierList(modifierData);

        }
    };

    const handleSearchItemsChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = event.target.value;
        setSearchValue(searchText)
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
                {[...new Map(catalogCategory.map(cat => [cat?.category_data?.name?.trim().toLowerCase(), cat])).values()]
                    .map((category, index) => {
                        const catalogItems = catalogCategoryAndItem?.filter((itemData: CatalogItemsType) => {
                            return itemData?.item_data?.category_id === category?.id;
                        });

                        // Only render if there are catalog items for the category
                        if (!catalogItems || catalogItems.length === 0) return null;

                        return (
                            <div key={index} className="w-full">
                                <div className="my-[25px] w-full float-left">
                                    <h2 className="text-[23px] font-medium bg-[#eee1d1] font-unbounded text-[#222A4A]">
                                        {category?.category_data?.name}
                                    </h2>
                                    <div className="space-y-2">
                                        {catalogItems.map((item) => (
                                            <OurMenuItems
                                                key={item?.id}
                                                data={item}
                                                lineItems={lineItems}
                                                setLineItems={setLineItems}
                                                setUpdateLineItem={setUpdateLineItem}
                                                updateLineItem={updateLineItem}
                                                modifierList={modifierList}
                                                modifierIds={modifierIds}
                                                setModifierIds={setModifierIds}
                                                setFieldToClear={setFieldToRemove}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
            {/* Menu Search */}
            <div className='w-full flex fixed bottom-0 justify-between p-[20px] left-0 right-0 z-10'>
                <div className='w-[100%] pr-[8px] relative'>
                    <input
                        type="text"
                        value={searchValue}
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
                                setSearchValue('');
                                setCatalogCategory([...catalogCategoryTab]);
                                setCatalogCategoryAndItem([...catalogCategoryAndItemCopy])
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
