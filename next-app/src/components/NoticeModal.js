"use client";

import { useEffect, useState } from "react";

const notices = [
  {
    id: "notice_2025_12_08",
    title: "LOAGAP 공지사항",
    content: `📢 서비스 접속 안내

최근 디도스 공격으로 인해 서비스 접속이 일시적으로 불안정한 상황이 발생했습니다.

금일 Website 복구 작업이 완료되었으며, 금주 내 API 서버 이관 작업이 예정되어 있습니다.

항상 LOAGAP을 이용해주셔서 감사합니다.
`,
    date: "2025-12-08",
  },
];

export default function NoticeModal() {
  const [visibleNotices, setVisibleNotices] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const now = Date.now();

    // 1시간 동안 숨김 처리된 공지 제외
    const filtered = notices.filter((notice) => {
      const hideUntil = localStorage.getItem(`hide_${notice.id}`);
      if (!hideUntil) return true;
      return now > Number(hideUntil);
    });

    setVisibleNotices(filtered);
  }, []);

  const closeCurrent = () => {
    if (visibleNotices.length === 0) return;

    const current = visibleNotices[0];

    // 1시간 숨기기
    const hideUntil = Date.now() + 60 * 60 * 1000;
    localStorage.setItem(`hide_${current.id}`, String(hideUntil));

    // 현재 공지를 제거하고 다음 공지를 표시
    setVisibleNotices((prev) => prev.slice(1));
  };

  if (visibleNotices.length === 0) return null;

  const current = visibleNotices[0];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-3">{current.title}</h2>

        <p className="text-sm whitespace-pre-line mb-6">{current.content}</p>

        <p className="text-xs text-right mb-4">- {current.date}</p>

        <button
          onClick={closeCurrent}
          className="w-full mt-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          확인
        </button>
      </div>
    </div>
  );
}
