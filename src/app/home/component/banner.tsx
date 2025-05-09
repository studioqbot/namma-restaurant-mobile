"use client";
import React from 'react';
import ReviewCard from './reviewcarousel';
import ImageSlider from './banner-slider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function Banner() {
    const router = useRouter()
    return (
        <div className='w-full relative pt-[55px]'>
            <Image src="/assets/images/banner-bg.svg" width={'150'} height={'150'} alt="banner-bg" className="w-full absolute top-[50px] z-[-1]" />
            <div className='container'>
                <div className='grid grid-cols-12 gap-[40px]'>
                    <div className='col-span-5'>
                        <div className='w-full py-[70px] pt-[30px] pb-[50px]'>
                            <h1 className="text-[32px] leading-[40px] text-[#222A4A] font-unbounded">
                                Authentic
                                <br />
                                <span className="text-[#A02621] font-bold">South Indian Flavors,</span>
                                <br />
                                Right Here in California!
                            </h1>
                            <p className="text-[17px] text-[#222A4A] leading-[22px] py-[17px]">
                                Experience the rich culinary heritage of South India, crafted with love and served fresh for your takeaway delight.
                            </p>
                            <div className="flex gap-[15px]">
                                <button className="bg-[#FFC300] px-[32px] py-[11px] rounded-[100px] text-[17px] font-bold text-[#A02621] relative" onClick={() => window.open(
                                    'https://order.nammarestaurant.com/',
                                    '_blank',
                                    'noopener,noreferrer'
                                )}>Order Now</button>
                                <button className="bg-transparent border border-[#A02621] px-[32px] py-[11px] rounded-[100px] text-[17px] font-medium text-[#A02621]" onClick={() => router.push('/our-menu')} >Explore Our Menu</button>
                            </div>
                        </div>
                        <div className='w-full'>
                            <ReviewCard />
                        </div>
                    </div>
                    <div className='col-span-7'>
                        <div className='w-full mt-[-100px] pl-[50px]'>
                            {/* <Image src="/assets/images/hero-slider1.svg" alt="banner-bg" className="w-full" /> */}
                            <ImageSlider />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;