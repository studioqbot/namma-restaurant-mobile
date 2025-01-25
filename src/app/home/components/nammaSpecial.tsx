'use client'
import GlobalContext from '@/constants/global-context';
import { ImageType, LineItemsType, NammaSpecialItems, OrderUpdateBodyAdd } from '@/constants/types';
import { catalogItems, nammaSpecialItems, orderCreateApi, orderUpdateApi } from '@/services/apiServices';
import { getDataFromLocalStorage, isEmptyObj, setDataInLocalStorage } from '@/utils/genericUtilties';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import ModifierModal from '../../../constants/modifier-modal'
import dayjs, { Dayjs } from 'dayjs';
import Image from 'next/image';
import placeHolder from '../../../../public/assets/images/place-holder.png'
interface NammaSpecialCardProps {
  data: NammaSpecialItems;
  image: ImageType | undefined;
  lineItems: LineItemsType[];
  setLineItems: React.Dispatch<React.SetStateAction<LineItemsType[]>>;
  setIsItemAdded: React.Dispatch<React.SetStateAction<boolean>>;
  modifierList: any[]

}



const NammaSpecialCard = (props: NammaSpecialCardProps) => {
  const [quantity, setQuantity] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { image, data, lineItems, setLineItems, setIsItemAdded, modifierList } = props;
  const { setCartItemCount, cartItemCount, isOrderUpdate, orderDetails,
    setUpdateLineItem, updateLineItem, setFieldToRemove } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modifierListData, setModifierListData] = useState([]);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);

  const matchedItem: (LineItemsType | undefined) = useMemo(() => {
    return lineItems?.find(
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
      const modifierData = modifierList?.find((modifier) => modifier?.id === data?.item_data?.modifier_list_info[0]?.modifier_list_id)
      setModifierListData(modifierData?.modifier_list_data?.modifiers);

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


    if (selectedOption.includes(modifierName)) {
      setSelectedOption(selectedOption.filter((item) => item !== modifierName));

    } else {
      setSelectedOption([...selectedOption, modifierName]);

      setLineItems((prevData: any) =>
        prevData?.map((item: any) => {
          const existingModifiers = item?.modifiers || [];
          const isDuplicate = existingModifiers.some(
            (modifier: any) => modifier.catalog_object_id === modifierId
          );
          return {
            ...item,
            modifiers: isDuplicate
              ? existingModifiers
              : [...existingModifiers, { catalog_object_id: modifierId }],
          };
        })
      );



    }
  };




  return (
    <div className="flex flex-col items-center rounded-lg text-center">
      <div className="relative overflow-hidden mb-4">
        {/* <img src={image?.image_data?.url ? image?.image_data?.url : '#'} alt="card-img" className="w-[163px] h-[163px] rounded-[15px]" /> */}
        {image?.image_data?.url ? <img src={image?.image_data?.url ? image?.image_data?.url : '#'} alt="card-img" className="w-[163px] h-[163px] rounded-[15px]" /> :
        <Image src={placeHolder} alt="card-img" className="w-[163px] h-[163px] rounded-[15px]"  />}
      </div>

      <h3 className="text-[14px] text-[#222A4A] font-medium px-[28px]">{data?.item_data?.name}</h3>
      <div className="flex flex-col items-center justify-between mt-auto">
        <span className="text-[14px] text-[#222A4A] font-bold mt-[15px]">${data?.item_data?.variations[0]?.item_variation_data?.price_money?.amount}</span>


        {(isAdded || (matchedItem && !isEmptyObj(matchedItem))) ? <div className="flex items-center border border-[#A02621] rounded-[100px] mt-[11px] overflow-hidden text-[#A02621] text-[12px]">
          <button
            className="px-3 py-1 text-red-600 hover:bg-gray-100"
            onClick={() => {
              handleCountDecrement(matchedItem?.quantity)
            }}
          >
            -
          </button>
          <span className="px-3 py-1">{matchedItem ? matchedItem?.quantity : quantity}</span>
          <button
            className="px-3 py-1 text-red-600 hover:bg-gray-100"
            onClick={() => handleCountIncrement(matchedItem?.quantity)}
          >
            +
          </button>
        </div> :
          <button className="px-[35px] py-[4px]  border border-[#A02621] rounded-[100px] mt-[11px] overflow-hidden text-[#A02621] text-[12px]" onClick={handleAddClick}>
            Add
          </button>}


      </div>
      {
        isModalOpen && <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[99999] pb-[80px] px-[20px] "
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-full p-[30px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex flex-col items-start justify-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-[10px]">Customization</h2>
              {modifierListData && modifierListData?.length && modifierListData.map((modifier: any) => (
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
                      checked={selectedOption.includes(modifier?.modifier_data?.name)}
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

                  {/* <span className=' bg-white relative z-[2] flex pl-[10px]'>
                    
                    </span> */}

                </div>
              ))}


            </div>
          </div>
        </div>
      }
    </div>
  );
};

const NammaSpecials = () => {


  const { isOrderUpdate, setOrderDetails, lineItems, setLineItems, orderDetails,
    updateLineItem, setIsOrderUpdate, fieldToRemove, setIsOrdered, isOrdered } = useContext(GlobalContext);
  const [isItemAdded, setIsItemAdded] = useState(false);
  const [imageData, setImageData] = useState([])
  const [nammaSpecialItemsData, setNammaSpecialItemsData] = useState([])
  const [modifierList, setMofierList] = useState<any[]>([]);
  const dataLimit = 6;

  const router = useRouter();


  const getNammaSpeacialDatas = async () => {
    try {
      const body = {
        limit: dataLimit,
        custom_attribute_filters: [
          {
            bool_filter: true,
            custom_attribute_definition_id: "MOY2QZ3ECH5SURG6SRQB3UEJ"
          }
        ]
      }
      const response = await nammaSpecialItems(body);
      if (response?.status === 200) {
        setNammaSpecialItemsData(response?.data?.items);
        setDataInLocalStorage('NammaSpecialItemsData', response?.data?.items);
        const currentTimePlusOneWeek = dayjs().add(1, 'week').toDate();
        setDataInLocalStorage('DateHome', currentTimePlusOneWeek);
      }


    } catch (error) {
      console.log('Error', error);

    }
  };

  const getNammaSpeacialItemsImage = async () => {
    try {
      const params = { types: 'IMAGE' }
      const response = await catalogItems(params);
      if (response?.status === 200) {
        setImageData(response?.data?.objects);
        setDataInLocalStorage('ImageData', response?.data?.objects);
        const currentTimePlusOneWeek = dayjs().add(1, 'week').toDate();
        setDataInLocalStorage('DateHome', currentTimePlusOneWeek);
      }


    } catch (error) {
      console.log(error);
    }
  }

  const getModifierListData = async () => {
    try {
      const params = { types: 'MODIFIER_LIST' }
      const response = await catalogItems(params);
      if (response?.status === 200) {
        setDataInLocalStorage('ModifierListData', response?.data?.objects);
        setMofierList(response?.data?.objects);
        const currentTimePlusOneWeek = dayjs().add(1, 'week').toDate();
        setDataInLocalStorage('DateHome', currentTimePlusOneWeek);
      }

    } catch (error) {
      console.log('Error', error);
    }
  };


  const orderCreate = async () => {

    const body = {

      order: {
        location_id: 'LC1BQTNRBNPKQ',
        line_items: lineItems,
        pricing_options: {
          auto_apply_taxes: true,
          auto_apply_discounts: true,
        },
      }
    }
    try {
      const response = await orderCreateApi(body)

      if (response?.status === 200) {
        setIsOrderUpdate('created');
        setDataInLocalStorage('OrderId', response?.data?.order?.id);
        setOrderDetails(response?.data?.order);
        setLineItems(response?.data?.order?.line_items || []);
        setIsOrdered(!isOrdered);
      }


    } catch (error) {
      console.log('Error', error);
    }
  }

  const orderUpdate = async () => {

    const body: OrderUpdateBodyAdd = {
      fields_to_clear: fieldToRemove,
      order: {
        location_id: 'LC1BQTNRBNPKQ',
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

      if (response?.status === 200) {

        setOrderDetails(response?.data?.order);
        setLineItems(response?.data?.order?.line_items || []);
        setIsOrderUpdate('updated');
        setIsOrdered(!isOrdered);
      }

    } catch (error) {
      console.log('Error', error);
    }
  };

  const getNammaSpeacialDataFromLocal = () => {
    const imageDatas: any = getDataFromLocalStorage('ImageData');
    const nammaSpecialData: any = getDataFromLocalStorage('NammaSpecialItemsData');
    const modifierListDatas: any[] | null = getDataFromLocalStorage('ModifierListData');

    if (nammaSpecialData && nammaSpecialData?.length > 0) {
      setNammaSpecialItemsData(nammaSpecialData);
    };

    if (modifierListDatas && modifierListDatas?.length > 0) {
      setMofierList(modifierListDatas);
    }

    if (imageDatas && imageDatas?.length > 0) {
      setImageData(imageDatas);
    };

  }

  useEffect(() => {
    getNammaSpeacialDataFromLocal();
    const dateData: Dayjs | null = getDataFromLocalStorage('DateHome');
    if (((dayjs(dateData).isSame() || dayjs(dateData).isBefore()) || !dateData)) {
      getNammaSpeacialDatas();
      getNammaSpeacialItemsImage();
      getModifierListData()
    }


  }, [])

  useEffect(() => {
    if ((isOrderUpdate === 'create')) {
      orderCreate()
    } else if ((isOrderUpdate && isItemAdded)) {
      orderUpdate()
    }

  }, [isOrderUpdate]);



  return (
    <div className="w-full mx-auto pt-[70px] pb-[30px] px-[30px] bg-white relative rounded-[22px] mt-[30px]">
      <div className='h-full absolute w-full top-0 bottom-0 z-[1] flex justify-center left-0 right-0'>
        <img src="/assets/images/bg-pattern1.svg" alt="banner-bg" className="h-full absolute top-0 bottom-0 z-[1]" />
      </div>
      <div className="text-center flex justify-center">
        <img src="/assets/images/namma-special.svg" alt="banner-bg" className="absolute top-[-18px] z-[2]" />
      </div>


      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-[60px] mb-[40px] relative z-10">

          {(nammaSpecialItemsData && nammaSpecialItemsData?.length > 0) && nammaSpecialItemsData?.map((data: any) => {

            const image: any | undefined = imageData?.find((img: any) => {
              if (data?.item_data?.image_ids?.length) {
                return img?.id === data?.item_data?.image_ids[0]
              }
              return null
            });

            return <NammaSpecialCard
              key={data?.id}
              image={image}
              data={data}
              lineItems={lineItems}
              setLineItems={setLineItems}
              setIsItemAdded={setIsItemAdded}
              modifierList={modifierList}

            />
          }

          )}
          <div className="text-center relative z-10">
            <button
              // onClick={handleExploreMenu}
              className="w-full max-w-md py-[15px] border border-[#A02621] rounded-[100px] mt-[11px] overflow-hidden text-[#A02621] text-[15px] font-medium"
            >
              Explore Full Menu
            </button>
          </div>
        </div>


      </>
    </div>
  );
};

export default NammaSpecials;