"use client";

import React from "react";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });
import Image from "next/image";

export default function ReviewCard() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full">
      <div className="relative">
         {/* <Image
        src="/assets/images/review-bg.svg"
        alt="Google logo"
        fill
        className="object-cover absolute bottom-[-20px] left-[10px] right-0"
        priority
      /> */}
         <img className="absolute bottom-[-20px] left-[10px] right-0" alt="Google logo" src="/assets/images/review-bg.svg"/>
        <Slider {...settings}>
          <div>
            <div className="max-w-lg mx-auto bg-white rounded-[15px] flex overflow-hidden">
              {/* Image Section */}
              <div className="bg-cover bg-no-repeat bg-center min-w-[150px]" style={{ backgroundImage: `url('/assets/images/review-card-img.svg')` }}></div>

              {/* Text Content */}
              <div className="py-4 px-5">
                <p className="text-[#222A4A] text-[13px] leading-[21px] mb-3">
                  The Vanjaram Fish Fry at Namma Restaurant is simply outstanding! Perfectly spiced, crisp on the outside, and tender inside—every bite is a burst of Karaikudi goodness. It{"'"}s my absolute favorite!
                </p>
                <div className="flex items-center space-x-2">
                  <Image
                    src="/assets/images/google.svg"
                    alt="Google logo"
                    width={20}
                    height={20}
                  />
                  <span className="text-[#222A4A] text-[14px] font-semibold">Priya R</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="max-w-lg mx-auto bg-white rounded-[15px] flex overflow-hidden">
              {/* Image Section */}
              <div className="bg-cover bg-no-repeat bg-center min-w-[150px]" style={{ backgroundImage: `url('/assets/images/review-card-img2.svg')` }}></div>

              {/* Text Content */}
              <div className="py-4 px-5">
                <p className="text-[#222A4A] text-[13px] leading-[21px] mb-3">
                  Our first time coming to the  restaurant and what better way to find out their best dishes than to  have a thali and sample some of their dishes. The place is huge and very inviting! Fast service as well.
                </p>
                <div className="flex items-center space-x-2">
                  <Image
                    src="/assets/images/yelp_icon.svg"
                    alt="Google logo"
                    width={20}
                    height={20}
                  />
                  <span className="text-[#222A4A] text-[14px] font-semibold">Bindu A</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="max-w-lg mx-auto bg-white rounded-[15px] flex overflow-hidden">
              {/* Image Section */}
              <div className="bg-cover bg-no-repeat bg-center min-w-[150px]" style={{ backgroundImage: `url('/assets/images/review-card-img3.svg')` }}></div>

              {/* Text Content */}
              <div className="py-4 px-5">
                <p className="text-[#222A4A] text-[13px] leading-[21px] mb-3">
                  Gosh, the food here is simply fantastic!!! We tried a whole bunch of stuff and everything was perfect and just so delicious. We tried Pallipalayam Paneer for the first time {'-'} it was very spicy & tangy and I  loved it.
                </p>
                <div className="flex items-center space-x-2">
                  <Image
                    src="/assets/images/yelp_icon.svg"
                    alt="Google logo"
                    width={20}
                    height={20}
                  />
                  <span className="text-[#222A4A] text-[14px] font-semibold">Sahridaya N</span>
                </div>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
}
