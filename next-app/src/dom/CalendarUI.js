import React, { useEffect, useRef, useState } from "react";
import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";

const CalendarUI = () => {
    const calendarRef = useRef(null);
    const [calendarInstance, setCalendarInstance] = useState(null); // 캘린더 인스턴스 저장
    const [currentMonthText, setCurrentMonthText] = useState(""); // 현재 월 이름 저장

    useEffect(() => {
    // Calendar 인스턴스 생성
    const calendar = new Calendar(calendarRef.current, {
        defaultView: "month",
        useDetailPopup: true,
        useFormPopup: true
    });
    calendar.createEvents([
        {
            id: "1",
            calendarId: "1",
            title: "회의",
            category: "time",
            start: "2024-12-10T10:30:00+09:00",
            end: "2024-12-10T12:30:00+09:00",
        },
        {
            id: "12",
            calendarId: "22",
            title: "회의",
            category: "time",
            start: "2024-12-10T10:30:00+09:00",
            end: "2024-12-10T12:30:00+09:00",
        },
    ]);
    // 초기화 시 현재 달 설정
    updateCurrentMonthText(calendar);

    setCalendarInstance(calendar); // 캘린더 인스턴스를 상태로 저장
    return () => {
            // 컴포넌트 언마운트 시 Calendar 인스턴스 정리
            calendar.destroy();
        };
    }, []);
    
    const updateCurrentMonthText = (calendar) => {
        const currentDate = calendar.getDate();
        const year = currentDate.getFullYear().toString().slice(2); // "2024" -> "24"
        const month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1
        setCurrentMonthText(`${year}년 ${month}월`);
    };
    
      const handlePrev = () => {
        if (calendarInstance) {
          calendarInstance.prev(); // 이전 달로 이동
          updateCurrentMonthText(calendarInstance); // 월 이름 업데이트
        }
      };
    
      const handleNext = () => {
        if (calendarInstance) {
          calendarInstance.next(); // 다음 달로 이동
          updateCurrentMonthText(calendarInstance); // 월 이름 업데이트
        }
      };
    
      const handleToday = () => {
        if (calendarInstance) {
          calendarInstance.today(); // 오늘 날짜로 이동
          updateCurrentMonthText(calendarInstance); // 월 이름 업데이트
        }
      };
    return (
        <div>
        <h2>빈틈길드</h2>
        <div style={{ marginBottom: "10px" }}>
          <button onClick={handlePrev}>이전 달</button>
          <button onClick={handleToday} style={{ margin: "0 10px" }}>
            오늘
          </button>
          <button onClick={handleNext}>다음 달</button>
        </div>
        <p>{currentMonthText}</p>
        <div ref={calendarRef} style={{ height: "600px" }}></div>
      </div>
    );
};

export default CalendarUI;