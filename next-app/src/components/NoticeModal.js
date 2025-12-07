"use client";

import { useEffect, useState } from "react";

export default function NoticeModal() {
  const [open, setOpen] = useState(true);

  const closeModal = () => {
    setOpen(false);

    // 1시간 동안 다시 안 뜨도록 저장 (원하면 제거 가능)
    // const oneHourLater = Date.now() + 60 * 60 * 1000;
    // localStorage.setItem("notice_hide_until", String(oneHourLater));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-3">LOAGAP 공지사항</h2>
        <p className="text-sm mb-6">
          <br />📢 접속 불가 안내<br /><br />
            현재 서버 해킹 시도로 인해 서비스 접속이 원활하지 않은 상황이 발생했습니다.  <br />
            임시적으로 문제가 해결된 상태이지만, <br />동일한 문제가 재발할 경우 추가적인 보안 조치를 시행할 예정입니다.

            <br />항상 LOAGAP을 이용해주셔서 감사드립니다.  
            <br /><br />- LOAGAP 드림 (2025-12-07)
        </p>

        <button
          onClick={closeModal}
          className="w-full mt-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          확인
        </button>
      </div>
    </div>
  );
}
