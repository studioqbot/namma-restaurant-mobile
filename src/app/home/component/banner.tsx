"use client";
import React from 'react';
import ReviewCard from './reviewcarousel';
import ImageSlider from './banner-slider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function Banner() {
    const router = useRouter()
    return (
        <main className=' container w-full relative pt-[55px]'>


            <section className="grid grid-cols-1 lg:grid-cols-4 gap-[40px]">
                <div className="col-span-1 lg:col-span-5">
                    <div className="w-full py-[70px] pt-[30px] pb-[50px]">
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

                        {/* <div className="block lg:hidden sm:bg-transparent md:bg-green-500 sm:bg-blue-500 lg:bg-transparent p-4 rounded-[100px]"> */}
                        <div className="block lg:hidden p-4 rounded-[100px]">
                            <ImageSlider />
                        </div>
                        <div className="flex gap-[15px]">
                            <button
                                className="bg-[#FFC300] px-[32px] py-[11px] rounded-[100px] text-[17px] font-bold text-[#A02621] relative"
                                onClick={() =>
                                    window.open(
                                        'https://order.nammarestaurant.com/',
                                        '_blank',
                                        'noopener,noreferrer'
                                    )
                                }
                            >
                                Order Now
                            </button>
                            <button
                                className="bg-transparent border border-[#A02621] px-[32px] py-[11px] rounded-[100px] text-[17px] font-medium text-[#A02621]"
                                onClick={() => router.push('/our-menu')}
                            >
                                Explore Our Menu
                            </button>
                        </div>
                    </div>


                    <ReviewCard />

                </div>


            </section>


        </main>
    );
}

export default Banner;