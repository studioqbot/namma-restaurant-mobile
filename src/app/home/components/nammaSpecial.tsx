'use client'
import GlobalContext from '@/constants/global-context';
import { ImageType, LineItemsType, ModifierDataType, NammaSpecialItems } from '@/constants/types';
import { catalogItems, nammaSpecialItems } from '@/services/apiServices';
import { getDataFromLocalStorage, removeItemFrmLocalStorage, setDataInLocalStorage } from '@/utils/genericUtilties';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Image from 'next/image';
import placeHolder from '../../../../public/assets/images/place-holder.png';

export interface CatelogFilterBody {
  limit: number;
  custom_attribute_filters: [
    {
      bool_filter: boolean,
      custom_attribute_definition_id: string
    }
  ]
}
interface NammaSpecialCardProps {
  data: NammaSpecialItems;
  image: ImageType | undefined;
  lineItems: LineItemsType[];
  setLineItems: React.Dispatch<React.SetStateAction<LineItemsType[]>>;
  // setIsItemAdded: React.Dispatch<React.SetStateAction<boolean>>;
  modifierList: ModifierDataType[];
}

const NammaSpecialCard = (props: NammaSpecialCardProps) => {
  const { image, data } = props;

  return (
    <div className="flex flex-col items-center rounded-lg text-center transform transition-all duration-500 ease-in-out"
    >
      <div
        style={{
          borderRadius: '20px', // Smooth curve for the image container
          width: '250px',
          minHeight: '165px',
          maxHeight: '165px',
          position: 'relative',
          overflow: 'hidden', // Ensures the image doesn't overflow
        }}
        className="transition-all duration-500 ease-in-out transform hover:scale-105"
      >
        {/* Image Section */}
        <div className="relative w-full h-full">
          {image?.image_data?.url ? (
            <img
              src={image?.image_data?.url}
              alt="card-img"
              className="object-cover w-full h-full transition-all duration-1000 ease-in-out transform hover:scale-110"
            />
          ) : (
            <Image
              src={placeHolder}
              alt="card-img"
              className="object-cover w-full h-full transition-all duration-1000 ease-in-out transform hover:scale-110"
            />
          )}
        </div>

        {/* Image Name */}
        <h3 className="text-[1px] text-[#222A4A] font-medium px-[10px] mt-4">{data?.item_data?.name}</h3>

        {/* Item Price */}
        <span className="text-[16px] text-[#222A4A] font-bold px-[10px] mt-2">
          ${data?.item_data?.variations[0]?.item_variation_data?.price_money?.amount / 100}
        </span>
      </div>
      <h3 className="text-[16px] text-[#222A4A] font-medium px-[28px] transition-opacity duration-500 ease-in-out pt-[2px]">{data?.item_data?.name} dfdf</h3>
      <div className="flex flex-col items-center justify-between mt-auto">
        <span className="text-[16px] text-[#222A4A] font-bold mt-[15px] transition-opacity duration-500 ease-in-out">
          ${data?.item_data?.variations[0]?.item_variation_data?.price_money?.amount / 100}
        </span>
      </div>
    </div>
  );
};

const NammaSpecials = () => {
  const { lineItems, setLineItems } = useContext(GlobalContext);

  // const [isItemAdded, setIsItemAdded] = useState(false);
  const [imageData, setImageData] = useState<ImageType[]>([])
  const [nammaSpecialItemsData, setNammaSpecialItemsData] = useState<NammaSpecialItems[]>([])
  const [modifierList, setMofierList] = useState<ModifierDataType[]>([]);

  const dataLimit = 6;
  const router = useRouter();

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const getNammaSpeacialDatas = async () => {
    try {
      const body: CatelogFilterBody = {
        limit: dataLimit,
        custom_attribute_filters: [
          {
            bool_filter: true,
            custom_attribute_definition_id: "P6DTBZV62JU2X2AXJQL34JH6"
          }
        ]
      };
      const response = await nammaSpecialItems(body);
      if (response?.status === 200) {
        setNammaSpecialItemsData(shuffleArray(response?.data?.items));
        setDataInLocalStorage('NammaSpecialItemsData', response?.data?.items);
        const currentTimePlusOneWeek = dayjs().add(1, 'day').toDate();
        setDataInLocalStorage('DateHome', currentTimePlusOneWeek);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  const getNammaSpeacialItemsImage = async () => {
    try {
      const params = { types: 'IMAGE' };
      const response = await catalogItems(params);
      if (response?.status === 200) {
        setImageData(response?.data?.objects);
        setDataInLocalStorage('ImageData', response?.data?.objects);
        const currentTimePlusOneWeek = dayjs().add(1, 'day').toDate();
        setDataInLocalStorage('DateHome', currentTimePlusOneWeek);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getModifierListData = async () => {
    try {
      const params = { types: 'MODIFIER_LIST' };
      const response = await catalogItems(params);
      if (response?.status === 200) {
        setDataInLocalStorage('ModifierListData', response?.data?.objects);
        setMofierList(response?.data?.objects);
        const currentTimePlusOneWeek = dayjs().add(1, 'day').toDate();
        setDataInLocalStorage('DateHome', currentTimePlusOneWeek);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  const getNammaSpeacialDataFromLocal = () => {
    const imageDatas: ImageType[] | null = getDataFromLocalStorage('ImageData');
    const nammaSpecialData: NammaSpecialItems[] | null = getDataFromLocalStorage('NammaSpecialItemsData');
    const modifierListDatas: ModifierDataType[] | null = getDataFromLocalStorage('ModifierListData');

    if (nammaSpecialData && nammaSpecialData?.length > 0) {
      setNammaSpecialItemsData(nammaSpecialData);
    }

    if (modifierListDatas && modifierListDatas?.length > 0) {
      setMofierList(modifierListDatas);
    }

    if (imageDatas && imageDatas?.length > 0) {
      setImageData(imageDatas);
    }
  };

  useEffect(() => {
    getNammaSpeacialDataFromLocal();
    const dateData: Dayjs | null = getDataFromLocalStorage('DateHome');
    if (((dayjs(dateData).isSame() || dayjs(dateData).isBefore()) || !dateData)) {
      getNammaSpeacialDatas();
      getNammaSpeacialItemsImage();
      getModifierListData();
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNammaSpecialItemsData((prevData) => shuffleArray(prevData)); // Shuffle the items every 5 seconds
    }, 5000);

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  useEffect(() => {
    if (lineItems?.length === 0) {
      removeItemFrmLocalStorage(['OrderId']);
    }
  }, []);

  return (
    <div className="w-full mx-auto pt-[70px] pb-[30px] px-[30px] bg-white relative rounded-[22px] mt-[30px]">
      <div className='h-full absolute w-full top-0 bottom-0 z-[1] flex justify-center left-0 right-0'>
        <img src="/assets/images/bg-pattern1.svg" alt="banner-bg" className="h-full absolute top-0 bottom-0 z-[1]" />
      </div>
      <div className="text-center flex justify-center">
        <img src="/assets/images/namma-special.svg" alt="banner-bg" className="absolute top-[-18px] z-[2]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-[60px] mb-[40px] relative z-10">
        {(nammaSpecialItemsData && nammaSpecialItemsData?.length > 0) && nammaSpecialItemsData?.map((data: NammaSpecialItems) => {
          const image = imageData?.find((img: ImageType) => {
            if (data?.item_data?.image_ids?.length) {
              return img?.id === data?.item_data?.image_ids[0];
            }
            return null;
          });

          return (
            <NammaSpecialCard
              key={data?.id}
              image={image}
              data={data}
              lineItems={lineItems}
              setLineItems={setLineItems}
              // setIsItemAdded={setIsItemAdded}
              modifierList={modifierList}
            />
          );
        })}
        <div className="text-center relative z-10">
          <button
            onClick={() => router.push('/our-menu')}
            className="w-full max-w-md py-[15px] border border-[#A02621] rounded-[100px] mt-[11px] overflow-hidden text-[#A02621] text-[15px] font-medium transition-all duration-300 ease-in-out hover:bg-[#A02621] hover:text-white"
          >
            Explore Full Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default NammaSpecials;
