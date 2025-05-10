import React from 'react';
import Banner from './component/banner';
import NammaSpecials from './component/nammaSpecial';
import FlavorJourney from './component/FlavorJourney';
import ReviewCard from './component/reviewcarousel';
import ImageSlider from './component/banner-slider';
import Image from 'next/image'; // ✅ Make sure this is present

export interface CatelogFilterBody {
  limit: number;
  custom_attribute_filters: [
    {
      bool_filter: boolean;
      custom_attribute_definition_id: string;
    }
  ];
}

async function HomePage() {
  return (
    <main>
      <Image src="/assets/images/banner-bg.svg" width={'150'} height={'150'} alt="banner-bg" className="w-full absolute top-[170px] z-[-1]" />
      <div className=" container flex flex-col lg:flex-row gap-6 px-4">

        {/* LEFT COLUMN - 40% */}
        <div className="w-full lg:w-[40%] flex flex-col gap-6">

          <Banner />

          <div className="relative top-[60]">
            <NammaSpecials />

          </div>
        </div>

        {/* RIGHT COLUMN - 60% */}
        <div className="w-full lg:w-[60%]">
          <div className="pl-[40] relative top-[-90] hidden md:block">
            <ImageSlider />
          </div>
          <div className="relative top-[-125]">
            <FlavorJourney />
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
