'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isVerified, setIsVerified] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('토큰이 없습니다.');
      setIsVerified(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/user/verifyEmail?token=${token}`
        );
        if (response.status === 200) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
          setError('이메일 인증에 실패했습니다.');
        }
      } catch (error) {
        setIsVerified(false);
        setError(
          `이메일 인증에 실패했습니다. [${error.response?.data || error.message || '알 수 없는 오류'}]`
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      <h2>이메일 인증</h2>
      {isVerified === null && <p>인증 진행 중...</p>}
      {isVerified === true && <p>이메일 인증이 완료되었습니다!</p>}
      {isVerified === false && <p>이메일 인증 실패: {error}</p>}
    </div>
  );
}