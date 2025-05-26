'use client';

import VerifyEmailPage from './verifyEmailClient';
import React, { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}