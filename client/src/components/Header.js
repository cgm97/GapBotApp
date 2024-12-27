import React from 'react';
import '../App.css'; // CSS 파일 (위에서 작성한 스타일을 참조)
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo"><Link to="/">LOAGAP</Link></div>
      <div className="search-container">
        <input type="text" className="search-box" placeholder="캐릭터를 입력하세요...." />
        <button className="search-icon">
          <i className="fa fa-search"></i>
        </button>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/cmd">명령어</Link></li>
          <li><Link to="/character">전투정보실</Link></li>
          <li><Link to="/homework">숙제</Link></li>
          <li><Link to="/calendar">일정</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;