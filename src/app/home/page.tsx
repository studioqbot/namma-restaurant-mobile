import React from 'react';
import Banner from './component/banner';
import NammaSpecials from './component/nammaSpecial';
import FlavorJourney from './component/FlavorJourney';

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
    <>
      <Banner />
      <NammaSpecials />
      <FlavorJourney />
    </>
  );
}

export default HomePage;
