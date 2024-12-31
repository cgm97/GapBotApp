import React from "react";
import { Link } from 'react-router-dom';
import '../App.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

const Top = () => {
  return (
    <div className="top">
      <div className="container">
        <span><a href="https://open.kakao.com/o/g6Abem1g" target="_blank">빈틈봇 소통방(분양)</a></span>
      </div>
      <div className="container">
        <span><Link to="/login">로그인</Link></span>
      </div>
    </div>
  );
};

export default Top;