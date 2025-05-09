'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dayjs from 'dayjs';

import GlobalContext from '@/constants/global-context';

interface TimeRange {
  open: string;
  close: string;
}

interface OperationalHours {
  [key: string]: TimeRange[];
}

function Header() {
  const { setIsCartOpen } = useContext(GlobalContext);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const operationalHours: OperationalHours = {
    Mon: [{ open: '11:30', close: '15:00' }, { open: '17:30', close: '21:30' }],
    Tue: [],
    Wed: [{ open: '11:30', close: '15:00' }, { open: '17:30', close: '22:00' }],
    Thu: [{ open: '10:30', close: '15:00' }, { open: '17:30', close: '22:00' }],
    Fri: [{ open: '11:30', close: '15:00' }, { open: '17:30', close: '22:00' }],
    Sat: [{ open: '11:30', close: '15:00' }, { open: '17:30', close: '22:00' }],
    Sun: [{ open: '11:30', close: '15:00' }, { open: '17:30', close: '22:00' }],
  };

  useEffect(() => {
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    const redirectUrl = process.env.NEXT_PUBLIC_APP_MOBILE_URL;

    if (isMobileDevice && redirectUrl) {
      window.location.href = redirectUrl;
    }

    const checkIfOpen = () => {
      const now = dayjs();
      const currentDay = now.format('ddd');
      const currentTime = now.format('HH:mm');

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
  }, [operationalHours, setIsCartOpen]);

  return (
    <header className="w-full py-[22px]">
      <div className="container">
        <nav className="flex justify-between items-center">
          <button className="flex items-center" onClick={() => router.push('/home')}>
            <Image
              src="/assets/images/Logo.svg"
              alt="Logo"
              width={235}
              height={60}
              className="h-[60px]"
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-[45px] text-[14px] text-[#222A4A]">
            <Link href="/">Home</Link>
            <Link href="/our-menu">Our Menu</Link>
            <Link href="/about-us">About us</Link>
            <Link href="https://www.google.com/maps?q=181+Ranch+Dr,+Milpitas+95035" target="_blank">Location</Link>
            <Link href="/contact-us">Contact us</Link>
          </div>

          {/* Hamburger (Mobile only) */}
          <button className="md:hidden text-[#222A4A] text-2xl" onClick={() => setIsMenuOpen(true)}>
            ☰
          </button>
        </nav>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`
          fixed inset-0 z-50 flex justify-end
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          pointer-events-${isMenuOpen ? 'auto' : 'none'}
        `}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsMenuOpen(false)} />

        {/* Side Panel */}
        <div
          className={`
            relative w-[75%] h-screen bg-white p-6 shadow-lg
            transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-semibold text-[#222A4A]">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} className="text-2xl text-[#222A4A]">×</button>
          </div>
          <nav className="flex flex-col gap-4 text-[16px] text-[#222A4A]">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/our-menu" onClick={() => setIsMenuOpen(false)}>Our Menu</Link>
            <Link href="/about-us" onClick={() => setIsMenuOpen(false)}>About us</Link>
            <Link href="https://www.google.com/maps?q=181+Ranch+Dr,+Milpitas+95035" target="_blank" onClick={() => setIsMenuOpen(false)}>Location</Link>
            <Link href="/contact-us" onClick={() => setIsMenuOpen(false)}>Contact us</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
