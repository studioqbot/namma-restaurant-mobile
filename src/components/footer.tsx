import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (

    <>
      <footer className="w-full mt-[45px]">
        <div className='container'>
          <div className='w-full flex items-center justify-between py-[35px] relative :after'>
            <span className="absolute top-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
            <div className='flex flex-col'>
          
              <div className="flex items-center text-[14px] text-[#222A4A] gap-[3px] mt-[5px]">
                <a
                  href="mailto:reachusnamma@gmail.com"
                  className="text-[14px] text-[#222A4A]"
                >
                  reachusnamma@gmail.com
                </a>
                <span>|</span>
                <span><Link href="tel:+14086493417">408-649-3417</Link> &  <Link href="tel:+14086493418">408-649-3418</Link></span>

                <div className="ml-4">
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


              </div>
            </div>


  {/* column 3 */}
            <div>
              <div className='flex flex-col text-[14px] text-[#222A4A] text-right'>
                <span>Copyright © {currentYear} Namma Restaurant. All rights reserved.</span>
                <div className="flex flex-wrap gap-[3px] justify-end">
                  <a href="/privacy-policy" className="hover:underline">
                    Privacy Policy
                  </a>
                  <span >|</span>
                  <a href="/terms-and-conditions" className="hover:underline">
                    Terms and Conditions
                  </a>
                  <span >|</span>
                  <Link href="https://studioq.co.in/" className="hover:underline flex items-center gap-1">
                    Built by <Image
                      src="/assets/images/SQ.svg"
                      alt="Google logo"
                      width={20}
                      height={20}
                    />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;