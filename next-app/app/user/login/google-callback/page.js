'use client';

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUserContext();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const email = searchParams.get("email");
    const userCode = searchParams.get("userCode");
    const roomCode = searchParams.get("roomCode");

    if (accessToken && email) {
      login(email, accessToken, userCode, roomCode);
      router.replace("/");
    } else {
      alert("구글 로그인 실패. 다시 시도해주세요.");
      router.replace("/login");
    }
  }, []);

  return <div className="text-center py-20">구글 로그인 처리 중...</div>;
}
