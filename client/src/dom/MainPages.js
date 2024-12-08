import React from "react";
import '../App.css'; // CSS 파일 (위에서 작성한 스타일을 참조)
import Calender from '../components/Calenders';

const MainPages = () => {
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
  </div>
  );
};

export default MainPages;