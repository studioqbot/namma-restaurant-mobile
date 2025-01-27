'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const OurMenu = () => {


    return (
        <div className="w-full">
            <div className="container">
                {/* Title Start */}
                <div className='w-full px-[20px]'>
                    <div className='w-full flex items-center py-[20px] relative mt-[35px] mb-[5px] '>
                        <span className="absolute top-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
                        <span className='text-[#A02621] text-[27px] leading-[31px] font-semibold font-unbounded bg-[#eee1d1] absolute pr-[10px] top-[-14px] left-0'>Contact us</span>
                    </div>
                </div>
                {/* Title End */}
                <div className='w-full overflow-hidden'>

                    <div className="w-full p-[20px]">
                        <iframe className='!w-full' src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8012.9658033653095!2d-121.91946242632883!3d37.42837464239909!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fc8dededf5023%3A0x823eeab2d4bc523e!2s181%20Ranch%20Dr%2C%20Milpitas%2C%20CA%2095035%2C%20USA!5e0!3m2!1sen!2sin!4v1736788712581!5m2!1sen!2sin" width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    <div className='bg-white mt-[60px] pt-[50px] relative'>
                        <div className='w-full p-[25px]'>
                            <div className="text-center flex justify-center">
                                <img src="/assets/images/namma-special.svg" alt="banner-bg" className="absolute top-[-18px] z-[2]" />
                            </div>
                            <div className="w-full">
                                <div className="w-full p-[15px] pt-0 pb-0">
                                    <div>
                                        <p className="text-[14px] text-[#222A4A] leading-[21px] ">
                                            <span className='text-[#A02621]'>Namma Catering</span> brings authentic Indian flavors to your corporate events,
                                            weddings, and housewarming celebrations with customized menus crafted
                                            to suit your occasion.
                                        </p>
                                    </div>

                                    <div className="text-[14px] text-[#222A4A] leading-[21px] font-semibold mt-[20px]">
                                        🎉 Our Catering Services Include:
                                    </div>
                                    <ul className="text-[14px] text-[#222A4A] leading-[21px] list-disc pl-[20px]">
                                        <li>
                                            Corporate Events & Team Gatherings
                                        </li>
                                        <li>
                                            Weddings & Engagements
                                        </li>
                                        <li>
                                            Housewarming Ceremonies
                                        </li>
                                        <li>
                                            Private Parties & Festive Celebrations
                                        </li>
                                    </ul>

                                    <div className='w-full flex flex-row items-center text-[14px] text-[#222A4A] leading-[21px] mt-[20px] gap-[3px]'>
                                        <span className=' font-semibold'>Call us now:</span>
                                        <span className='text-[#A02621]'>
                                            <Link href="tel:+14086493417">408-649-3417</Link></span> and <span className='text-[#A02621]'>
                                            <Link href="tel:+14086493418" >408-649-3418</Link></span>
                                    </div>
                                    <div className='w-full flex flex-row items-center text-[14px] text-[#222A4A] leading-[21px] mb-[10px] gap-[3px]'>
                                        <span className=' font-semibold'>Email:</span> <span className='text-[#A02621]'>
                                            <Link href="mailto:reachusnamma@gmail.com">reachusnamma@gmail.com</Link></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="flex items-center flex-col justify-center bg-[#34A853] text-white p-4 w-full">
                                <div className="text-2xl">
                                    <Image
                                        src="/assets/images/items.svg"
                                        alt="Del"
                                        width={54}
                                        height={41}
                                    />
                                </div>
                                <p className="text-[18px] text-[#FFFFFF] font-semibold leading-[16px] font-unbounded text-center mt-[6px]">OPEN <br /> NOW</p>
                            </div>

                            {/* Monday */}
                            <div className="w-full flex flex-col items-center pt-[25px]">
                                <h4 className="text-[14px] text-[#222A4A] font-semibold">Mon</h4>
                                <p className="text-[14px] text-[#222A4A]">11:30 AM - 3:00 PM</p>
                                <p className="text-[14px] text-[#222A4A]">5:30 PM - 9:30 PM</p>
                            </div>

                            {/* Tuesday */}
                            <div className="w-full flex flex-col items-center  py-[35px]">
                                <h4 className="text-[14px] text-[#222A4A] font-semibold">Tue</h4>
                                <p className="text-[14px] text-[#222A4A]">Closed</p>
                            </div>

                            {/* Wed-Sun */}
                            <div className="w-full flex flex-col items-center pb-[25px]">
                                <h4 className="text-[14px] text-[#222A4A] font-semibold">
                                    Wed, Thu, Fri, Sat, and Sun
                                </h4>
                                <p className="text-[14px] text-[#222A4A]">11:30 AM - 3:00 PM</p>
                                <p className="text-[14px] text-[#222A4A]">5:30 PM - 10:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurMenu;
