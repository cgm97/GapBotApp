import React, { useState, useEffect } from "react";
import '../App.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

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
    const currentDay = today.getDay(); // 요일 인덱스
    const currentDate = daysWithDate[currentDay]?.date; // 안전하게 접근
    if (currentDate) {
      setActiveDay(currentDate);
    } else {
      console.error("Invalid currentDate:", currentDate);
    }
  }, []);

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
    </div>
  );
};

export default Calender;
