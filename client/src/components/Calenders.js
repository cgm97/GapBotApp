import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../App.css';

const Calender = () => {
  const [activeDay, setActiveDay] = useState(null);

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

  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const currentDate = daysWithDate[currentDay]?.date;
    if (currentDate) {
      setActiveDay(currentDate);
    } else {
      console.error("Invalid currentDate:", currentDate);
    }
  }, []);

  const [data, setData] = useState(null);

  useEffect(() => {
    // 세션 스토리지에서 데이터 확인
    const storedData = sessionStorage.getItem('gameContents');
    if (storedData) {
      // 세션 스토리지에 데이터가 있으면 바로 사용
      setData(JSON.parse(storedData));
    } else {
      // 세션 스토리지에 데이터가 없으면 API 호출
      axios.get(process.env.REACT_APP_SERVER_URL+'/api/gameContents')
        .then((response) => {
          setData(response.data);  // API 응답 데이터를 상태에 저장
          sessionStorage.setItem('gameContents', JSON.stringify(response.data)); // 로컬 스토리지에 저장
        })
        .catch((error) => {
          console.error("API 호출 오류:", error);
          setData(null);  // 에러 발생 시 null로 설정
        });
    }
  }, []);  // 컴포넌트가 마운트될 때 한 번만 실행

  return (
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

      {data && (
        <div className="api-data">
          <h3>API 응답 데이터</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Calender;