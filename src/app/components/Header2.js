'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header2() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scroll Down
        setShowHeader(false);
      } else {
        // Scroll Up
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div
      className={`absolute mt-[0.5px] border-b top-full -z-10 w-full bg-white transition-transform duration-500 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-full p-4">
        <div className="flex text-xs md:text-base space-x-4 md:space-x-8 justify-center items-center">
          <Link href="/Auction" className="relative group cursor-pointer">
            <p>Auction</p>
            <div className="w-full absolute hidden group-hover:flex h-1 transform transition-all duration-500 bg-black"></div>
          </Link>
          <Link href="/Preview" className="relative group cursor-pointer">
            <p>Upcoming</p>
            <div className="w-full absolute hidden group-hover:flex h-1 transform transition-all duration-500 bg-black"></div>
          </Link>
          <Link href="/Results" className="relative group cursor-pointer">
            <p>Results</p>
            <div className="w-full absolute hidden group-hover:flex h-1 transform transition-all duration-500 bg-black"></div>
          </Link>
          <Link href="/Sell" className="relative group cursor-pointer">
            <p>Sell</p>
            <div className="w-full absolute hidden group-hover:flex h-1 transform transition-all duration-500 bg-black"></div>
          </Link>
          <Link href="/FAQ" className="relative group cursor-pointer">
            <p>FAQ</p>
            <div className="w-full absolute hidden group-hover:flex h-1 transform transition-all duration-500 bg-black"></div>
          </Link>
          <Link href='/About' className="relative group cursor-pointer">
            <p>About</p>
            <div className="w-full absolute hidden group-hover:flex h-1 transform transition-all duration-500 bg-black"></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
