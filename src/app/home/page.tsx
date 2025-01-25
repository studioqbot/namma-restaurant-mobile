import React from 'react';
import Banner from './components/banner';
import NammaSpecials from './components/nammaSpecial';


function HomePage() {
  return (
    <div className='w-full p-[20px]'>
      <Banner />
      <div className='w-full'>
        <div className='container'>
          <div className='grid grid-cols-12 '>
            <div className='col-span-12'>
              <NammaSpecials />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;