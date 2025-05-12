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
   <div className="w-full mx-auto sm:grid sm:grid-cols-1">

      <div className="relative">
        <div className=" hidden md:block">
          <img
            className="absolute bottom-[-25px] w-[calc(100%-8px)] mx-[2px] my-[1px] "
            alt="Review background"
            src="/assets/images/review-bg.svg"
          />
        </div>
        <Slider {...settings}>
          {/* Slide 1 */}
          <div>
            <div className="mx-auto bg-white rounded-[15px] flex flex-col sm:flex-row overflow-hidden shadow-md ">
              <div
                className="w-full sm:w-[140px] min-h-[180px] sm:h-auto bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url('/assets/images/review-card-img.svg')` }}
              ></div>
              <div className="py-4 px-5 flex-1 ">
                <p className="text-[#222A4A] text-[13px] leading-[21px] mb-3">
                  The Vanjaram Fish Fry at Namma Restaurant is simply outstanding! Perfectly spiced, crisp on the outside, and tender inside—every bite is a burst of Karaikudi goodness. It's my absolute favorite!
                </p>
                <div className="flex items-center space-x-2 w-full max-w-lg">
                  <Image src="/assets/images/google.svg" alt="Google logo" width={20} height={20} />
                  <span className="text-[#222A4A] text-[14px] font-semibold">Priya R</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div>
            <div className="mx-auto bg-white rounded-[15px] flex flex-col sm:flex-row overflow-hidden shadow-md">
              <div
                className="w-full sm:w-[140px] min-h-[180px] sm:h-auto bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url('/assets/images/review-card-img.svg')` }}
              ></div>
              <div className="py-4 px-5 flex-1">
                <p className="text-[#222A4A] text-[13px] leading-[21px] mb-3">
                  Amazing service and the Chettinad Chicken Curry was so flavorful. Definitely going back for more!
                </p>
                <div className="flex items-center space-x-2">
                  <Image src="/assets/images/google.svg" alt="Google logo" width={20} height={20} />
                  <span className="text-[#222A4A] text-[14px] font-semibold">Rajesh K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div>
            <div className="mx-auto bg-white rounded-[15px] flex flex-col sm:flex-row overflow-hidden shadow-md">
              <div
                className="w-full sm:w-[140px] min-h-[180px] sm:h-auto bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url('/assets/images/review-card-img.svg')` }}
              ></div>
              <div className="py-4 px-5 flex-1">
                <p className="text-[#222A4A] text-[13px] leading-[21px] mb-3">
                  We loved the authentic taste and friendly ambiance. Namma Restaurant feels like home!
                </p>
                <div className="flex items-center space-x-2">
                  <Image src="/assets/images/google.svg" alt="Google logo" width={20} height={20} />
                  <span className="text-[#222A4A] text-[14px] font-semibold">Divya M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 4 */}
          <div>
            <div className="mx-auto bg-white rounded-[15px] flex flex-col sm:flex-row overflow-hidden shadow-md">
              <div
                className="w-full sm:w-[140px] min-h-[180px] sm:h-auto bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url('/assets/images/review-card-img.svg')` }}
              ></div>
              <div className="py-4 px-5 flex-1">
                <p className="text-[#222A4A] text-[13px] leading-[21px] mb-3">
                  Tried the Veg Meals and it was beyond expectations—fresh, tasty, and satisfying!
                </p>
                <div className="flex items-center space-x-2" >
                  <Image src="/assets/images/google.svg" alt="Google logo" width={20} height={20} />
                  <span className="text-[#222A4A] text-[14px] font-semibold">Karthik S</span>
                </div>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
}
