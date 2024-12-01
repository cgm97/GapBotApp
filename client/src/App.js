import React, { useState, useEffect } from "react";
import axios from 'axios';
import './App.css';
import logo from "./img/로고_light_투명배경.png"; // 로고 이미지 가져오기

function App() {
  // 선택된 요일 상태 관리
  const [activeDay, setActiveDay] = useState(null);
  // 요일 데이터
  const daysWithDate = [
    { day: "일", date: "12/01" },
    { day: "월", date: "12/02" },
    { day: "화", date: "12/03" },
    { day: "수", date: "12/04" },
    { day: "목", date: "12/05" },
    { day: "금", date: "12/06" },
    { day: "토", date: "12/07" },
  ];
  const content = {
    "12/01": "일요일의 내용입니다.",
    "12/02": "월요일의 내용입니다.",
    "12/03": "화요일의 내용입니다.",
    "12/04": "수요일의 내용입니다.",
    "12/05": "목요일의 내용입니다.",
    "12/06": "금요일의 내용입니다.",
    "12/07": "토요일의 내용입니다.",
  };
  // 오늘의 요일을 계산하여 초기 상태 설정
  useEffect(() => {
    const today = new Date(); // 현재 날짜 객체
    const currentDay = today.getDay(); // 요일 (0: 일, 1: 월, ...)
    const currentDate = daysWithDate[currentDay].date; // 오늘 날짜에 해당하는 데이터
    setActiveDay(currentDate); // 활성화된 날짜로 설정
  }, []);
return (
  <div class="wrapper">
    {/* 왼쪽 광고 영역 */}
    <div class="advertise left">
      <p>왼쪽 광고 영역</p>
    </div>

    <div class="content">
      <div class="top">
        <div class="container">
          <span><a href="#">빈틈봇 분양</a></span>
        </div>
        <div class="container">
          <span><a href="#">로그인</a></span>
        </div>
      </div>

      <header class="header">
        <div class="logo"><a href="#about">LOAGAP</a></div>
        <div class="search-container">
          <input type="text" class="search-box" placeholder="캐릭터명을 입력하세요." />
          <button class="search-icon">
            <i class="fa fa-search"></i>
          </button>
        </div>
        <nav class="nav">
          <ul>
            <li><a href="#about">명령어</a></li>
            <li><a href="#posts">전투정보실</a></li>
            <li><a href="#contact">숙제</a></li>
            <li><a href="#contact">일정</a></li>
          </ul>
        </nav>
      </header>

    <main>
      <div className="calendar">
        <div className="calendar-days">
          {daysWithDate.map(({ day, date }) => (
            <div
              key={date}
              className={`day ${activeDay === date ? "active" : ""}`}
              onClick={() => setActiveDay(date)}
            >
              <div className="day-date">{date}</div>
              <div className="day-name">{day}</div>
            </div>
          ))}
        </div>

        {activeDay && (
          <div className="content">
            <h3>{activeDay}의 내용</h3>
            <p>{content[activeDay]}</p>
          </div>
        )}
      </div>
      <div className="ad-content">
        <div>광고</div>
      </div>
      <div className="notice">
        <div className="content">
          <h4>로스트아크 공지사항</h4>
          <ul>
            <li>dsadas</li>
            <li>dsadas</li>
            <li>dsadas</li>
            <li>dsadas</li>
          </ul>
        </div>
        <div className="content">
          <h4>빈틈봇 서버현황</h4>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
        <div className="content">
          <h4>로스트아크 이벤트</h4>
          <ul>
            <li>Item A</li>
            <li>Item B</li>
            <li>Item C</li>
          </ul>
        </div>
      </div>
    </main>
    </div>

    <div class="advertise right">
      <p>오른쪽 광고 영역</p>
    </div>
  </div>
  );
}

export default App;