import React from 'react';
import '../App.css'; // CSS 파일 (위에서 작성한 스타일을 참조)
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo"><Link to="/">LOAGAP</Link></div>
      <nav className="nav">
        <ul>
          <li><Link to="/cmd">명령어</Link></li>
          <li><Link to="/bookPrice">유각시세</Link></li>
          <li><Link to="/jewelPrice">보석시세</Link></li>
          {/* <li><Link to="/character">전투정보실</Link></li> */}
          {/* <li><Link to="/todo">TODO</Link></li> */}
          <li><Link to="/cube">큐브</Link></li>
          {/* <li><Link to="/calendar">일정</Link></li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;