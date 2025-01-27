
'use client'
import React from 'react';
import ReviewCard from './reviewcarousel';
import ImageSlider from './banner-slider';
import { useRouter } from 'next/navigation';


function Banner() {
    const router = useRouter();
    return (
        <div className='w-full relative '>
            {/* <img src="/assets/images/banner-bg.svg" alt="banner-bg" className="w-full absolute top-[50px] z-[-1]" /> */}
            <div className='container'>
                <div className='grid grid-cols-12 '>
                    <div className='col-span-12'>
                        <div className='w-full '>
                            <h1 className="text-[30px] leading-[30px] text-[#222A4A] font-unbounded">
                                Authentic
                                <br />
                                <span className="text-[#A02621] font-bold">South Indian <br/> Flavors,</span>
                                <br />
                                <span className='text-[15px] leading-[30px] text-[#222A4A] font-unbounded'>Right Here in California!</span>
                            </h1>
                            
                        </div>
                        
                    </div>
                    <div className='col-span-12'>
                        <div className='w-full'>
                        {/* <img src="/assets/images/hero-slider1.svg" alt="banner-bg" className="w-full" /> */}
                        <ImageSlider/>
                        <button className="w-full bg-[#FFC300] px-[32px] py-[11px] rounded-[100px] text-[17px] font-bold text-[#A02621] relative my-[20px]" onClick={() => router.push('/our-menu')}>Order Now</button>
                        </div>
                        <div className='w-full mb-[55px]'>
                            <div className='text-[18px] leading-[25px] text-[#A02621] font-bold font-unbounded text-center mb-[12px]'>What Our Customers <br/> Are Saying</div>
                            <ReviewCard/>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;