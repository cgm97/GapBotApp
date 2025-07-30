'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isEnhanceOpen, setEnhanceOpen] = useState(false);
  const [isPriceOpen, setPriceOpen] = useState(false);
  const [isEfficiencyOpen, setEfficiencyOpen] = useState(false);

  // 메뉴가 동시에 열리지 않게 토글 함수
  const toggleEnhance = () => {
    setEnhanceOpen((prev) => !prev);
    if (!isEnhanceOpen) {
      setPriceOpen(false);
      setEfficiencyOpen(false);
    }
  };

  const togglePrice = () => {
    setPriceOpen((prev) => !prev);
    if (!isPriceOpen) {
      setEnhanceOpen(false);
      setEfficiencyOpen(false);
    }
  };

  const toggleEfficiency = () => {
    setEfficiencyOpen((prev) => !prev);
    if (!isEfficiencyOpen) {
      setEnhanceOpen(false);
      setPriceOpen(false);
    }
  };

  return (
    <header className="header relative z-50 bg-blue-700 text-white px-6 py-3">
      <div className="logo">
        <Link href="/">LOAGAP</Link>
      </div>

      <div className="header-right">
        <nav className="nav">
          <ul className="flex gap-4 flex-wrap items-center">
            <li><Link href="/command">명령어</Link></li>

            <li className="relative">
              <span
                onClick={toggleEnhance}
                className="cursor-pointer select-none font-bold px-2 py-1 rounded hover:text-yellow-300"
                role="button"
                aria-expanded={isEnhanceOpen}
                aria-controls="enhance-dropdown"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleEnhance();
                }}
              >
                재련게임 {isEnhanceOpen ? '▼' : '▶'}
              </span>
            </li>

            <li className="relative">
              <span
                onClick={togglePrice}
                className="cursor-pointer select-none font-bold px-2 py-1 rounded hover:text-yellow-300"
                role="button"
                aria-expanded={isPriceOpen}
                aria-controls="price-dropdown"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') togglePrice();
                }}
              >
                시세보기 {isPriceOpen ? '▼' : '▶'}
              </span>
            </li>
            <li className="relative">
              <span
                onClick={toggleEfficiency}
                className="cursor-pointer select-none font-bold px-2 py-1 rounded hover:text-yellow-300"
                role="button"
                aria-expanded={isEfficiencyOpen}
                aria-controls="efficiency-dropdown"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleEfficiency();
                }}
              >
                효율보기 {isEfficiencyOpen ? '▼' : '▶'}
              </span>
            </li>
            <li><Link href="/cube">큐브</Link></li>
          </ul>
        </nav>
      </div>

      {/* 재련 드롭다운 - 기존 dropdown-menu 클래스 유지 + 아래 펼침 */}
      <ul
        id="enhance-dropdown"
        className={`dropdown-menu flex gap-4 list-none bg-[#3678cf] shadow-md rounded-b absolute right-0 top-full z-50 px-4 py-2 transition-max-height duration-300 overflow-hidden ${isEnhanceOpen ? 'max-h-64 block' : 'max-h-0 hidden'
          }`}
        aria-hidden={!isEnhanceOpen}
        style={{
          marginTop: 0,
          backgroundImage: "url('/img/image.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center', // 원하면 위치 조절
          backgroundSize: 'cover', // 원하면 크기 조절
        }}
      >
        <li className="px-4 py-2 whitespace-nowrap hover:bg-blue-600 rounded">
          <Link href="/enhance/try" title="재련 시뮬레이터">시뮬</Link>
        </li>
        <li className="px-4 py-2 whitespace-nowrap hover:bg-blue-600 rounded">
          <Link href="/enhance/rank/all">전체 순위</Link>
        </li>
        <li className="px-4 py-2 whitespace-nowrap hover:bg-blue-600 rounded">
          <Link href="/enhance/rank/room">톡방 순위</Link>
        </li>
      </ul>

      {/* 시세 드롭다운 */}
      <ul
        id="price-dropdown"
        className={`dropdown-menu flex gap-4 list-none bg-[#3678cf] shadow-md rounded-b absolute right-0 top-full z-50 px-4 py-2 transition-max-height duration-300 overflow-hidden ${isPriceOpen ? 'max-h-64 block' : 'max-h-0 hidden'
          }`}
        aria-hidden={!isPriceOpen}
        style={{
          marginTop: 0,
          backgroundImage: "url('/img/image.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center', // 원하면 위치 조절
          backgroundSize: 'cover', // 원하면 크기 조절
        }}
      >
        <li className="px-4 py-2 whitespace-nowrap hover:bg-blue-600 rounded">
          <Link href="/price/market">재료시세</Link>
        </li>
        <li className="px-4 py-2 whitespace-nowrap hover:bg-blue-600 rounded">
          <Link href="/price/book">유각시세</Link>
        </li>
        <li className="px-4 py-2 whitespace-nowrap hover:bg-blue-600 rounded">
          <Link href="/price/jewel">보석시세</Link>
        </li>
        <li className="px-4 py-2 whitespace-nowrap hover:bg-blue-600 rounded">
          <Link href="/price/accessory">악세시세</Link>
        </li>
      </ul>

      {/* 효율 드롭다운 */}
      <ul
        id="efficiency-dropdown"
        className={`dropdown-menu flex gap-4 list-none bg-[#3678cf] shadow-md rounded-b absolute right-0 top-full z-50 px-4 py-2 transition-max-height duration-300 overflow-hidden ${isEfficiencyOpen ? 'max-h-64 block' : 'max-h-0 hidden'}`}
        aria-hidden={!isEfficiencyOpen}
        style={{
          marginTop: 0,
          backgroundImage: "url('/img/image.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <li className="px-4 py-2 whitespace-nowrap hover:bg-blue-600 rounded">
          <Link href="/efficiency/package" title="패키지 효율 계산">패키지 계산기</Link>
        </li>
        <li className="px-4 py-2 whitespace-nowrap hover:bg-blue-600 rounded">
          <Link href="/efficiency/enhance" title="상급재련 효율">상급재련 | 재련루트</Link>
        </li>
        <li className="px-4 py-2 whitespace-nowrap hover:bg-blue-600 rounded">
          <Link href="/efficiency/chaos" title="카오스 던전 효율">카오스 던전</Link>
        </li>
        <li className="px-4 py-2 whitespace-nowrap hover:bg-blue-600 rounded">
          <Link href="/efficiency/guardian" title="가디언 토벌 효율">가디언 토벌</Link>
        </li>
        <li className="px-4 py-2 whitespace-nowrap hover:bg-blue-600 rounded">
          <Link href="/efficiency/raid" title="레이드 더보기 효율">더보기</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
