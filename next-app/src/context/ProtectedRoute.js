'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login'); // 현재 페이지 기록을 대체(replace)해서 /login 페이지로 이동
    }
  }, [user, router]);

  if (!user) {
    return null; // 로딩중 또는 빈 화면 처리
  }

  return <>{children}</>;
};

export default ProtectedRoute;