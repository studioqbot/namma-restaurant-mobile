import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Footer() {
  return (

    <>
      <footer className="w-full  bottom-0">
        <div className='container'>
          <div className='w-full flex items-center flex-col justify-between py-[35px] relative :after'>
            <div className='flex flex-col'>
              <div className="flex flex-wrap gap-[3px] text-[14px] text-[#222A4A] font-normal justify-center">
                <Link href="/">Home</Link>
                <span>|</span>
                <Link href="/our-menu" className="hover:text-gray-900">Our Menu</Link>
                <span >|</span>
                <Link href="/contact-us" className="hover:text-gray-900">Contact us</Link>
              </div>
              <div className="flex flex-wrap gap-[3px] text-[14px] text-[#222A4A] font-normal justify-center">
                <span className="hover:text-gray-900">Privacy Policy</span>
                <span >|</span>
                <span className="hover:text-gray-900">Terms and Conditions</span>
              </div>
              <div className="flex items-center flex-col text-[14px] text-[#222A4A] gap-[3px] my-[25px]">
                <a href="https://maps.google.com/?q=181+Ranch+Dr,+Milpitas+95035"
                  className="underline font-bold"
                  target="_blank"
                  rel="noopener noreferrer">
                  181 Ranch Dr, Milpitas 95035
                </a>
                <Link
                  href="mailto:reachusnamma@gmail.com"
                  className="text-[14px] text-[#222A4A]"
                >
                  reachusnamma@gmail.com
                </Link>
                <span><Link href="tel:+14086493417">408-649-3417</Link> & <Link href="tel:+14086493418">408-649-3418</Link></span>
              </div>
            </div>
            <div className="ml-5 mb-5 flex flex-col items-center justify-center mb-5"
            // style={{ backgroundColor: 'red' }}
            >
              <a
                href="https://chat.whatsapp.com/C6htpd8z34FLWzI6Upxw8f"
                className="mb-3 flex items-center space-x-2 underline font-bold text-gray-600 hover:text-blue-900"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/assets/images/whatsapp.svg"
                  alt="WhatsApp Icon"
                  width="18"
                  height="18"
                />
                <span >Join with us on WhatsApp</span>
              </a>

              <a
                href="https://www.instagram.com/namma_restaurant/"
                className="flex items-center space-x-2 underline font-bold text-gray-600 hover:text-blue-900"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/assets/images/instagram.svg"
                  alt="Instagram Icon"
                  width="21"
                  height="21"
                />
                <span> Follow us on Instagram</span>
              </a>
            </div>



            <div className='flex flex-col items-center text-[14px] text-[#222A4A] text-center'>
              <span>Copyright © 2025 Namma Restaurant. <br /> All rights reserved.</span>
              <div className="flex flex-wrap gap-[3px] mt-[25px]">
                <a href="https://studioq.co.in" target='_blank' className="hover:underline flex items-center gap-1">
                  Built by <Image
                    src="/assets/images/SQ.svg"
                    alt="Google logo"
                    width={20}
                    height={20}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;