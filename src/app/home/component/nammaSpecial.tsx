/* eslint-disable */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { LineItems } from '@/constants/types';
import GlobalContext from '@/constants/global-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AnimatePresence, motion } from 'framer-motion';
import placeHolder from '../../../../public/assets/images/place-holder.png';

interface ItemData {
  amount: string;
  ecom_image_uris: string;
  price: string;
  name: string;
  image: string;
  item_data: {
    id: string;
    name: string;
    image: string;
    category: string;
  };
}

type NammaSpecialCardProps = {
  data: ItemData;
  lineItems: LineItems[];
  setLineItems: React.Dispatch<React.SetStateAction<LineItems[]>>;
  setIsItemAdded: () => void;
};

const NammaSpecials = () => {
  const { lineItems, setLineItems } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [nammaSpecialItemsData, setNammaSpecialItemsData] = useState<ItemData[]>([]);
  const [shuffledItems, setShuffledItems] = useState<ItemData[]>([]);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetcHotSellingList = async () => {
      try {
        const response = await fetch('api/hot-selling');
        const data = await response.json();
        setNammaSpecialItemsData(data.hot_selling_items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu list:', error);
      }
    };
    fetcHotSellingList();
  }, []);

  useEffect(() => {
    const shuffleArray = (array: ItemData[]) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.slice(0, 6);
    };

    if (nammaSpecialItemsData.length > 0) {
      setShuffledItems(shuffleArray(nammaSpecialItemsData));
      const interval = setInterval(() => {
        setShuffledItems(shuffleArray(nammaSpecialItemsData));
      }, 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [nammaSpecialItemsData]);

  return (
    <section className="container" style={{ width: 500 }}>
      <div className="max-w-6xl mx-auto py-[40px] bg-white relative rounded-[22px] overflow-hidden">

        {/* Background pattern image with fill */}
        <div className="absolute left-[24px] top-0 bottom-0 z-[1] w-full h-full">
          <Image
            src="/assets/images/bg-pattern1.svg"
            alt="background pattern"
            fill
            className="object-cover"
          />
        </div>

        {/* Title image */}
        <div className="text-center flex justify-center relative z-[2]">
          <Image
            src="/assets/images/namma-special.svg"
            width={167}
            height={58}
            alt="Namma Specials"
            className="absolute top-[-18px]"
          />
        </div>

        {/* Content Section */}
        {loading || nammaSpecialItemsData.length === 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="relative z-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}
              >
                <Skeleton height={200} width={200} style={{ borderRadius: '12px', marginBottom: '20px' }} />
                <Skeleton height={14} width={100} style={{ marginBottom: '6px' }} />
                <Skeleton height={14} width={70} style={{ marginBottom: '15px' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-[60px] mb-[40px] relative z-10">
            <AnimatePresence mode="popLayout">
              {shuffledItems.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2 }}
                >
                  <NammaSpecialCard
                    data={data}
                    lineItems={lineItems}
                    setLineItems={setLineItems}
                    setIsItemAdded={() => {}}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="text-center relative z-10">
          <button
            className="w-full max-w-md py-[15px] border border-[#A02621] rounded-[100px] mt-[11px] overflow-hidden text-[#A02621] text-[15px] font-medium"
            onClick={() => router.push('/our-menu')}
          >
            Explore Full Menu
          </button>
        </div>
      </div>
    </section>
  );
};

const NammaSpecialCard = React.memo(({ data }: NammaSpecialCardProps) => {
  return (
    <div className="flex flex-col items-center rounded-lg text-center">
      <div className="relative overflow-hidden mb-4">
        {data.ecom_image_uris ? (
          <Image
            src={data.ecom_image_uris[0]}
            width={100}
            height={100}
            alt={data.name}
            className="w-[163px] h-[163px] rounded-[15px]"
          />
        ) : (
          <Image
            src={placeHolder}
            max-width={100}
            height={100}
            alt="No image"
            className="w-[163px] h-[163px] rounded-[15px]"
          />
        )}
      </div>
      <h3 className="text-[12px] text-[#222A4A] font-medium px-[28px]">{data.name}</h3>
      <div className="flex flex-col items-center justify-between mt-auto">
        <span className="text-[13px] text-[#222A4A] font-bold mt-[15px]">
          {data.amount}
        </span>
      </div>
    </div>
  );
});

NammaSpecialCard.displayName = 'NammaSpecialCard';
export default NammaSpecials;
