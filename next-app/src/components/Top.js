"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import '@/css/App.css';

const Top = () => {
  const { user, logout } = useUserContext();
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const searchCharacter = (inputValue) => {
    router.push(`/character/${inputValue}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchCharacter(searchInput);
    }
  };

  return (
    <div className="top">
      <div className="container">
        <a href="https://open.kakao.com/o/g6Abem1g" target="_blank" rel="noopener noreferrer">빈틈봇 소통방(분양)</a>&nbsp;&nbsp;
        <Link href="/donate">후원안내</Link>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="캐릭터를 입력하세요..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="search-icon" onClick={() => searchCharacter(searchInput)}>
          <i className="fa fa-search"></i>
        </button>
      </div>

      <div className="container">
        {user ? (
          <>
            <Link href="/mypage">{user}님 </Link>
            <a href="#" onClick={handleLogout}>로그아웃</a>
          </>
        ) : (
          <Link href="/login">로그인</Link>
        )}
      </div>
    </div>
  );
};

export default Top;
