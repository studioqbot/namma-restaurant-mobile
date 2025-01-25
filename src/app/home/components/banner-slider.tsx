
"use client";  

import React from "react";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const Slider = dynamic(() => import("react-slick"), { ssr: false });

const ImageSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,    
  };

  const images = [
    "/assets/images/hero-slider1.svg",
    "/assets/images/hero-slider2.svg",
    "/assets/images/hero-slider3.svg",
  ];

  return (
    <div className="w-full">
      <Slider {...settings} className="outline-0">
        {images?.map((image, index) => (
          <div key={index} className="banner-slider w-!full">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
