'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className="header relative z-50">
      <div className="logo">
        <Link href="/">LOAGAP</Link>
      </div>

      <div className="header-right">
        <nav className="nav">
          <ul className="flex gap-4">
            <li><Link href="/command">명령어</Link></li>
             <li
              className="dropdown relative"
              onClick={handleDropdownClick}
            >
              <span className="cursor-pointer select-none">
                재련
              </span>
              <ul
                className={`dropdown-menu absolute top-full left-0 z-50 bg-[#3678cf] shadow-md transition-all duration-300 ${
                  isOpen ? 'block' : 'hidden'
                }`}
              >
                <li className="px-4 py-2 whitespace-nowrap">
                  <Link href="/enhance/try" title="재련 시뮬레이터">시뮬</Link>
                </li>
                <li className="px-4 py-2 whitespace-nowrap">
                  <Link href="/enhance/rank/all">전체 순위</Link>
                </li>
                <li className="px-4 py-2 whitespace-nowrap">
                  <Link href="/enhance/rank/room">톡방 순위</Link>
                </li>
              </ul>
            </li>
            <li><Link href="/price/market">재료시세</Link></li>
            <li><Link href="/price/book">유각시세</Link></li>
            <li><Link href="/price/jewel">보석시세</Link></li>
            <li><Link href="/price/accessory">악세시세</Link></li>
            <li><Link href="/cube">큐브</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
