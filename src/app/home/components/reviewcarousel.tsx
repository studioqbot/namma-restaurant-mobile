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
      <img  className="absolute bottom-[-20px] left-[10px] right-0"
                  src="/assets/images/review-bg.svg"
                  alt="Google logo"
                />
      <Slider {...settings}>
        <div>
          <div className="w-full mx-auto bg-white rounded-[15px] flex flex-col overflow-hidden">
            {/* Image Section */}
            <div className="bg-cover bg-no-repeat bg-center w-full min-h-[170px]" style={{ backgroundImage: `url('/assets/images/review-card-img.svg')` }}></div>

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
      </Slider>
      </div>
    </div>
  );
}
