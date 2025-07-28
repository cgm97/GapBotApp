'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';

export default function GoogleCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUserContext();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const email = searchParams.get('email');
    const userCode = searchParams.get('userCode');
    const roomCode = searchParams.get('roomCode');

    if (accessToken && email) {
      login(email, accessToken, userCode, roomCode);
      router.replace('/');
    } else {
      router.replace('/user/login');
    }
  }, [searchParams]);

  return (
    <div className="flex justify-center items-center py-10 text-gray-800 dark:text-white">
      로그인 처리 중...
    </div>
  );
}