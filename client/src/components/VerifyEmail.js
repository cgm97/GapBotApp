import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token"); // URL에서 token 가져오기

  const [isVerified, setIsVerified] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // token이 존재할 경우 서버에 API 요청 보내기
    if (token) {
      const verifyEmail = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/user/verifyEmail?token=${token}`
          );
          // 서버 응답 처리
          if (response.status === 200) {
            setIsVerified(true); // 이메일 인증 성공
          }
        } catch (error) {
          setError('이메일 인증에 실패했습니다. ['+error.response.data+"]");
          console.error('Error verifying email:', error);
        }
      };

      verifyEmail(); // API 호출
    }
  }, [token]); // token이 변경될 때마다 호출

  return (
    <div>
      <h2>이메일 인증</h2>
      {isVerified !== null ? (
        isVerified ? (
          <p>이메일 인증이 완료되었습니다!</p>
        ) : (
          <p>이메일 인증 실패. 다시 시도해 주세요.</p>
        )
      ) : (
        <p>인증을 진행 중입니다...</p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default VerifyEmail;
