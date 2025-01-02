import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from "../context/UserContext";
import '../App.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

const Top = () => {
  const { logout } = useUserContext(); // Context에서 login 함수 가져오기
  const userToken = sessionStorage.getItem("token");
  // const userEmail = sessionStorage.getItem("email");
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 리디렉션 처리

  const handleLogout = () => {
    // 로그아웃 처리: token을 localStorage에서 제거하고 로그인 페이지로 리디렉션
    logout();
    // sessionStorage.removeItem("token");
    // sessionStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="top">
      <div className="container">
        <span><a href="https://open.kakao.com/o/g6Abem1g" target="_blank" rel="noopener noreferrer">빈틈봇 소통방(분양)</a></span>
      </div>
      <div className="container">
        {userToken ? (
          // token이 있으면 로그아웃 버튼
          <span><Link to="#"onClick={handleLogout} style={{ cursor: "pointer" }}>로그아웃</Link></span>
          ) : (
          // token이 없으면 로그인 버튼
          <span><Link to="/login">로그인</Link></span>
        )}
      </div>
    </div>
  );
};

export default Top;