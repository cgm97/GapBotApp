'use client';

import { useState } from 'react';
import '@/css/Donate.css';

export default function DonatePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className="login-container">
      <h2>후원안내</h2>
      <form>
        <div className="form-group">
          <label>계좌이체</label>
          <ul>
            <li>은행명: 카카오뱅크</li>
            <li>계좌번호: 3333-24-7122428</li>
            <li>예금주: 최규민</li>
          </ul>
          <label>모바일 카카오페이 송금</label>
          <a className="special" href="https://qr.kakaopay.com/FPzrlKoeT" target="_blank" rel="noopener noreferrer">클릭</a>
        </div>
        <div className="form-group">
          <label>캐릭터명 후원</label>
          <ul>
            <li>
              캐릭터명으로 1,000원 이상 후원해주시는 분께 감사의 마음을 담아 <br />등록된 캐릭터명에 모코코 아이콘 및 왕관을 부여해드립니다.<br />
              <button onClick={handleModalOpen} className="login-button">예시 보기</button>
            </li>
          </ul>
        </div>
        <div className="form-group">
          여러분의 소중한 후원금은 모두 LOAGAP의 서버 운영 및 서비스 품질 향상을 위한 유지보수에 전액 사용됩니다. 더욱 안정적이고 빠른 서비스를 제공하기 위해 최선을 다하겠습니다.<br /><br />
          광고 수익 또한 전액 서버 운영과 유지보수에 사용됩니다. ‘광고 클릭 = 사랑’이라는 공식, 알고 계셨나요? 클릭 해주셔서 감사합니다.
        </div>
      </form>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>후원 아이콘 예시</h2>
            <p>후원자 캐릭터명에 표시될 아이콘은 아래와 같습니다.</p>
            <p>웹:[캐릭터명] <img src='/img/donate/donation.png' alt="후원" className="arkPassive-image" />/ 모바일: 왕관</p>
            <div className="image-container">
              <img src='/img/donate/web.png' alt="웹후원" className="web-image" />
              <img src='/img/donate/mobile.png' alt="모바일후원" className="mobile-image" />
            </div>
            <button onClick={handleModalClose} className="login-button">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
