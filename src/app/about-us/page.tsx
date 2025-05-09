'use client';
import React from 'react';

const OurMenu = () => {


    return (
        <div className="w-full">
            <div className="container">
                {/* Title Start */}
                <div className='w-full flex items-center py-[20px] relative mt-[55px] mb-[30px]'>
                    <span className="absolute top-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
                    <span className='text-[#A02621] text-[27px] leading-[31px] font-semibold font-unbounded bg-[#eee1d1] absolute pr-[10px] top-[-14px] left-0'>Our Story</span>
                </div>
                {/* Title End */}
                <div className='w-full rounded-tr-[17px] rounded-br-[17px] overflow-hidden min-h-[57vh]'>
                    <p className='text-[17px] text-[#222A4A] leading-[22px] py-[17px]'>
                       {`At Namma Restaurant, we’re more than just a place to eat — we’re a journey into the heart of India’s rich culinary tradition. From the first bite, our guests are transported into a world of bold, smoky flavors, lovingly crafted using ancient techniques that have been perfected for generations.`}
                    </p>
                    <p className='text-[17px] text-[#222A4A] leading-[22px] py-[17px]'>
                        {`Customers often say it’s not just the food that makes Namma special, but the experience. The sizzle of dishes prepared over hot stones, the aroma of food cooked in coal grills, and the unmistakable smokiness from our tandoori ovens all come together to create an atmosphere that feels both timeless and modern.`}
                    </p>
                    <p className='text-[17px] text-[#222A4A] leading-[22px] py-[17px]'>
                        {`Our chefs are true artisans, recreating the flavors of India with dedication and passion. Whether it’s a delicate, spicy curry or perfectly grilled meats, each dish carries a piece of the story behind it. It’s not just about the food; it’s about the journey it takes you on — one where you can taste the heritage and history of India in every bite.`}
                    </p>
                    <p className='text-[17px] text-[#222A4A] leading-[22px] py-[17px]'>
                        {`But don't just take our word for it. Our customers rave about the experience, with many calling it “the best Indian food they've ever had,” and noting how they feel like they’ve stepped into an authentic, warm, and welcoming corner of India. Whether you're a lifelong fan of Indian cuisine or new to the flavors, Namma Restaurant promises an unforgettable, flavorful experience that will have you coming back for more.`}
                    </p>
                </div>
            </div>
        </div>
    );
};

// 

export default OurMenu;
