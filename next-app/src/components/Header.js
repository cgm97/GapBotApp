"use client";

import React from 'react';
// import '@/css/App.css';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="header">
      <div className="logo"><Link href="/">LOAGAP</Link></div>
      <nav className="nav">
        <ul>
          <li><Link href="/command">명령어</Link></li>
          <li><Link href="/price/book">유각시세</Link></li>
          <li><Link href="/price/jewel">보석시세</Link></li>
          {/* <li><Link href="/character">전투정보실</Link></li> */}
          {/* <li><Link href="/todo">TODO</Link></li> */}
          <li><Link href="/cube">큐브</Link></li>
          {/* <li><Link href="/calendar">일정</Link></li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
