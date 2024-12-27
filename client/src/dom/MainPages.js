import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../App.css'; // CSS 파일 (위에서 작성한 스타일을 참조)
import Calender from '../components/Calenders';

const MainPages = () => {
  const [data, setData] = useState(null);

  // API 데이터 호출
  useEffect(() => {
    const storedData = sessionStorage.getItem('notice');

    if (storedData) {
      // sessionStorage에서 데이터를 불러온 경우
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
    } else {
      // sessionStorage에 데이터가 없는 경우 API 호출
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/notice')
        .then((response) => {
          setData(response.data);
          sessionStorage.setItem('notice', JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("API 호출 오류:", error);
        });
    }
  }, []);
  return (
    <div>
      <Calender />
      <div className="ad-content">
        <div>광고</div>
      </div>
      <div className="notice">
        <div className="content">
          <h4>로스트아크 공지사항</h4>
          <ul>
            {data && (
              data.slice(0, 10).map((notice, index) => (
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
    </div>
  );
};

export default MainPages;