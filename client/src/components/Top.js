import { React, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from "../context/UserContext";
import '../App.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

const Top = () => {
  const { logout } = useUserContext(); // Context에서 login 함수 가져오기
  const userToken = sessionStorage.getItem("token");
  const userEmail = sessionStorage.getItem("user");
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 리디렉션 처리
  // const userEmail = sessionStorage.getItem("email");

  const handleLogout = () => {
    // 로그아웃 처리: token을 localStorage에서 제거하고 로그인 페이지로 리디렉션
    logout();
    // sessionStorage.removeItem("token");
    // sessionStorage.removeItem("email");
    navigate("/login");
  };

  const searchCharacter = (inputValue) => {
    navigate(`/character/${inputValue}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchCharacter(searchInput); // 엔터키 입력 시 검색 실행
    }
  };

  return (
    <div className="top">
      <div className="container">
        <span><a href="https://open.kakao.com/o/g6Abem1g" target="_blank" rel="noopener noreferrer">빈틈봇 소통방(분양)</a></span>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="캐릭터를 입력하세요..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)} // input 값을 상태로 관리
          onKeyDown={handleKeyDown} // 엔터키 반응 추가
        />
        <button
          className="search-icon"
          onClick={() => searchCharacter(searchInput)} // 버튼 클릭 시 상태 값을 전달
        >
          <i className="fa fa-search"></i>
        </button>
      </div>

      <div className="container">
        {userToken && userEmail ? (
          // token이 있으면 로그아웃 버튼
          <span><Link to="/mypage" >{userEmail}님 </Link><Link to="#" onClick={handleLogout}>로그아웃</Link></span>
        ) : (
          // token이 없으면 로그인 버튼
          <span><Link to="/login">로그인</Link></span>
        )}
      </div>
    </div>
  );
};

export default Top;