'use client';

import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link href="/">LOAGAP</Link>
      </div>

      <div className="header-right">
        <nav className="nav">
          <ul>
            <li><Link href="/command">명령어</Link></li>
            <li><Link href="/price/book">유각시세</Link></li>
            <li><Link href="/price/jewel">보석시세</Link></li>
            <li><Link href="/cube">큐브</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
