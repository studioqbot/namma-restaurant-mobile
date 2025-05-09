
import React from 'react';
import Banner from './component/banner';
import NammaSpecials from './component/nammaSpecial';


export interface CatelogFilterBody {
  limit:number;
  custom_attribute_filters: [
    {
      bool_filter: boolean,
      custom_attribute_definition_id: string
    }
  ]
}


async function HomePage() {


  return (
    <>
      <Banner />
      <div className='w-full'>
        <div className='container'>
          <div className='grid grid-cols-12 gap-[40px]'>
            <div className='col-span-5'>
              <NammaSpecials  />
            </div>
            <div className='col-span-7 overflow-hidden rounded-[23px]'>
              <div className='w-full rounded-[23px] bg-[#F7F0E3] py-[23px] px-[23px] pr-[70px] mt-[35px] h-full'>
                <div className='grid grid-cols-12 gap-[25px] h-full'>
                  <div className='col-span-6 h-full'>
                    <div className="w-full h-full bg-cover bg-no-repeat bg-center " style={{ backgroundImage: `url('/assets/images/journey-bg.svg')` }} />
                  </div>
                  <div className='col-span-6 flex items-center'>
                    <div className='w-full'>
                      <h3 className='text-black text-[25px] leading-[38px] font-unbounded mb-[15px]'>
                        A Journey Through <br /> India{"'"}s Flavors
                      </h3>
                      <p className='text-[#222A4A] text-[13px] leading-[27px] mb-[30px]'>
                        South Indian cuisine is a vibrant celebration of traditions, flavors, and heritage that has been perfected over centuries. Each region offers its own distinct culinary treasures, making South Indian food a delightful mosaic of tastes and aromas. Tamil Nadu enchants with its bold and fiery Chettinad spices, Kerala captivates with its coconut-rich curries and fresh seafood, Andhra Pradesh excites with its tangy tamarind and spicy chilies, and Karnataka charms with its balanced flavors, from the comforting Rasam to the aromatic Bisibele Bath.
                      </p>
                      <p className='text-[#222A4A] text-[13px] leading-[27px] mb-[30px]'>
                        At Namma Restaurant, we honor this incredible diversity by bringing together dishes that truly capture the essence of South Indian cooking. Our menu is crafted to celebrate the traditional recipes and authentic flavors of the region, from the golden crispness of a perfectly made Dosa to the hearty warmth of a bowl of Sambar or the indulgent richness of a Malabar-style curry.
                      </p>
                      <p className='text-[#222A4A] text-[13px] leading-[27px] mb-[30px]'>
                        Every dish we serve is a reflection of South India{"'"}s culinary heritage, a tribute to the passion and care that go into every meal. Whether you’re rediscovering old favorites or exploring something new, our food promises to take you on a flavorful journey through the heart of South India.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;