'use client'
import React, { useContext, useEffect, useState } from 'react';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import GlobalContext from '@/constants/global-context';
import dayjs from 'dayjs';

function Header() {

  const router = useRouter();
  const { setIsCartOpen} = useContext(GlobalContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const operationalHours: { [key: string]: { open: string; close: string }[] } = {
    Mon: [
      { open: "11:30", close: "15:00" },
      { open: "17:30", close: "21:30" },
    ],
    Tue: [], 
    Wed: [
      { open: "11:30", close: "15:00" },
      { open: "17:30", close: "22:00" },
    ],
    Thu: [
      { open: "10:30", close: "15:00" },
      { open: "17:30", close: "22:00" },
    ],
    Fri: [
      { open: "11:30", close: "15:00" },
      { open: "17:30", close: "22:00" },
    ],
    Sat: [
      { open: "11:30", close: "15:00" },
      { open: "17:30", close: "22:00" },
    ],
    Sun: [
      { open: "11:30", close: "15:00" },
      { open: "17:30", close: "22:00" },
    ],
  };

  useEffect(() => {
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    if (!isMobileDevice) { 
      window.location.href = 'https://namma-restaurant-web-q78v.vercel.app/';

    }

    const checkIfOpen = () => {
      const now = dayjs();
      const currentDay = now.format("ddd"); 
      const currentTime = now.format("HH:mm"); 

      const todayHours = operationalHours[currentDay] || [];

      if (todayHours.length === 0) {
        setIsCartOpen(false);
        return;
      }

      const isOpenNow = todayHours.some(
        ({ open, close }) => currentTime >= open && currentTime <= close
      );

      setIsCartOpen(isOpenNow);
    };

    checkIfOpen();

    const interval = setInterval(checkIfOpen, 60000);

    return () => clearInterval(interval);
  }, []);

  
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        document.body.classList.add('sticky-header');
      } else {
        document.body.classList.remove('sticky-header');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  

  return (
    <header className='w-full py-[10px] header-container'>
      <div className='container px-4'>
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center" onClick={() => router.push('/home')}>
            <img src="/assets/images/Logo.svg" alt="Logo" className="h-[45px] w-auto" />
          </div>

          {/* Menu and Cart */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu */}
            <button
              className="text-[24px] text-[#222A4A] focus:outline-none"
              onClick={toggleDrawer}
            >
              <span className="block w-[25px] h-[3px] bg-[#222A4A] mb-[4px]"></span>
              <span className="block w-[25px] h-[3px] bg-[#222A4A] mb-[4px]"></span>
              <span className="block w-[25px] h-[3px] bg-[#222A4A]"></span>
            </button>
            {/* Cart */}
        
          </div>
        </nav>
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[250px] bg-[#FFF] shadow-lg transform transition-transform z-[9999] ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <button
          className="text-[24px] text-[#222A4A] absolute top-4 right-4 focus:outline-none"
          onClick={toggleDrawer}
        >
          &times;
        </button>
        <ul className="mt-[60px] px-4 space-y-4 text-[#222A4A]">
          <li>
            <Link href="/" onClick={toggleDrawer}>Home</Link>
          </li>
          <li>
            <Link href="/about-us" onClick={toggleDrawer}>About Us</Link>
          </li>
          <li>
            <Link href="/our-menu" onClick={toggleDrawer}>Our Menu</Link>
          </li>
          <li>
          <Link href="https://www.google.com/maps?q=181+Ranch+Dr,+Milpitas+95035" target='_blank'>Location</Link>
          </li>
          <li>
            <Link href="/contact-us" onClick={toggleDrawer}>Contact Us</Link>
          </li>
          <li>
          <a
            href="tel:408-649-3417"
            className="inline-block px-5 py-2 bg-[#A02621] text-white font-semibold rounded mt-1 uppercase"
          >
            Order Online
          </a>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9991]"
          onClick={toggleDrawer}
        ></div>
      )}
    </header>
  );
}

export default Header;
