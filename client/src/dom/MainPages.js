import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../App.css'; // CSS 파일 (위에서 작성한 스타일을 참조)
import Island from '../components/Island';

const MainPages = () => {
  const [noticeData, setNoticeData] = useState(null);
  const [eventData, setEventData] = useState(null);

  // 공지사항 API 데이터 호출
  useEffect(() => {
    const storedData = sessionStorage.getItem('notice');

    if (storedData) {
      // sessionStorage에서 데이터를 불러온 경우
      const parsedData = JSON.parse(storedData);
      setNoticeData(parsedData);
    } else {
      // sessionStorage에 데이터가 없는 경우 API 호출
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/notice')
        .then((response) => {
          setNoticeData(response.data);
          sessionStorage.setItem('notice', JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("API 호출 오류:", error);
        });
    }
  }, []);

  // 공지사항 API 데이터 호출
  useEffect(() => {
    const storedData = sessionStorage.getItem('event');

    if (storedData) {
      // sessionStorage에서 데이터를 불러온 경우
      const parsedData = JSON.parse(storedData);
      setEventData(parsedData);
    } else {
      // sessionStorage에 데이터가 없는 경우 API 호출
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/event')
        .then((response) => {
          setEventData(response.data);
          sessionStorage.setItem('event', JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("API 호출 오류:", error);
        });
    }
  }, []);

  return (
    <div>
      <Island />
      <div className="ad-content">
        <div>광고</div>
      </div>
      <div className="notice">
        <div className="content">
          <h4>로스트아크 공지사항</h4>
          <ul>
            {noticeData && (
              noticeData.slice(0, 20).map((notice, index) => (
                <li key={index} className="truncate-text">
                  <a href={notice.URL} className="link-style" target="_blank" rel="noopener noreferrer">
                    [{notice.TYPE}] {notice.TITLE}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="content">
          <h4>빈틈봇 패치노트</h4>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
            <li>Item 4</li>
            <li>Item 5</li>
          </ul>
        </div>
        <div className="content">
          <h4>로스트아크 이벤트</h4>
          <ul>
            {eventData && (
              eventData.map((event, index) => (
                <li key={index} className="truncate-text">
                  <a href={event.URL} className="link-style" target="_blank" rel="noopener noreferrer">
                     {/* {event.TITLE} */}
                     <img src={event.IMG_URL} alt={event.TITLE} className="image" />
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainPages;