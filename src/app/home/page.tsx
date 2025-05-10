import React from 'react';
import Banner from './component/banner';
import NammaSpecials from './component/nammaSpecial';
import FlavorJourney from './component/FlavorJourney';
import ReviewCard from './component/reviewcarousel';
import ImageSlider from './component/banner-slider';

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
    <div className=" container flex flex-col lg:flex-row gap-6 px-4">
      {/* LEFT COLUMN - 40% */}
      <div className="w-full lg:w-[40%] flex flex-col gap-6">
        <Banner />
        <NammaSpecials />
      </div>

      {/* RIGHT COLUMN - 60% */}
      <div className="w-full lg:w-[60%]">

        <ImageSlider />

        <FlavorJourney />
      </div>
    </div>

  );
}

export default HomePage;
