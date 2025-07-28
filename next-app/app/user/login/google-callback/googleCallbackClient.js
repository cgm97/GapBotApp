'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';

export default function GoogleCallbackClient() {
  const router = useRouter();
  const { login } = useUserContext();

  useEffect(() => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('accessToken');
    const email = url.searchParams.get('email');
    const userCode = url.searchParams.get('userCode');
    const roomCode = url.searchParams.get('roomCode');

    if (accessToken && email) {
      login(email, accessToken, userCode, roomCode);
      router.replace('/');
    } else {
      router.replace('/user/login');
    }
  }, []);

  return (
    <div className="flex justify-center items-center py-10 text-gray-800 dark:text-white">
      로그인 처리 중...
    </div>
  );
}