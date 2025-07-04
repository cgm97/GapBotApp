'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdSense from '@/components/Adsense';

const EnhanceTry = () => {
  const [userId, setUserId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [result, setResult] = useState('');
  const [rates, setRates] = useState([]);
  const [blessRates, setBlessRates] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserCode = sessionStorage.getItem("userCode") || null;
      setUserId(storedUserCode);

      const storedRoomCode = sessionStorage.getItem("roomCode") || roomId;
      setRoomId(storedRoomCode);

    }
  }, []);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/bot/enhance/rates/advance`);
        setRates(res.data.reinforcementChances);
        setBlessRates(res.data.blessings);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRates();
  }, []);

  const handleEnhance = async () => {
    setResult('재련 시도 중...');

    const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/bot/enhance/advancedTry`, {
      userId,
      roomId,
      site: "Y"
    });

    setResult(res.data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md dark:bg-gray-300">
      {/* 제목 + 툴팁 */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">상급재련 시뮬레이터</h2>
        <div className="relative group">
          <span className="text-blue-600 cursor-pointer">🛠️재련 조건</span>
          <div className="absolute left-1/2 -translate-x-[50%] top-7 w-96 p-3 bg-blue-50 border border-blue-200 rounded shadow-md text-xs text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
            <ul className="list-disc list-inside space-y-1">
              <li>상급 재련 1~20단계는 재련 10단계부터 가능합니다.</li>
              <li>상급 재련 20~30단계는 재련 20단계부터 가능합니다.</li>
              <li>상급 재련 30~40단계는 재련 25단계부터 가능합니다.</li>
              <li>단, 후원 분양은 단계 제한이 없습니다.</li>
            </ul>
          </div>
        </div>
        <div className="relative group">
          <span className="text-blue-600 cursor-pointer">📘설명서</span>
          <div className="absolute left-1/2 -translate-x-[60%] top-7 w-96 p-3 bg-blue-50 border border-blue-200 rounded shadow-md text-xs text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>User/Room 코드</strong>는 빈틈봇에서 발급됩니다.<br />(카카오톡 채팅방에 <strong>빈틈봇연동</strong>이라고 입력하시면 발급받을 수 있습니다.)</li>
              <li>재련은 본인 카카오톡 채팅방에서 <strong>최초 1회 실행</strong>이 필요합니다.</li>
              <li>재련 시도에는 <strong>10분 쿨타임</strong>이 적용됩니다.</li>
              <li>로그인 시 저장된 코드가 자동 입력됩니다.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-4 pr-6">
        <label className="block text-sm font-medium mb-1">
          User Code
        </label>
        <input
          type="text"
          value={userId || ""}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-200"
          placeholder="빈틈봇이 발급한 유저 코드 (예: test)"
        />
      </div>

      <div className="mb-4 pr-6">
        <label className="block text-sm font-medium mb-1">
          Room Code
        </label>
        <input
          type="text"
          value={roomId || ""}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-200"
          placeholder="빈틈봇이 발급한 채팅방 코드 (예: test)"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        테스트용으로 <b>test / test</b> 코드를 사용할 수 있습니다.
      </p>

      <button
        onClick={handleEnhance}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        재련하기
      </button>

      <div className="mt-6 pr-6">
        <label className="block text-sm font-medium mb-1">재련 결과</label>
        <textarea
          readOnly
          value={result}
          rows={8}
          className="w-full border rounded  pr-3 text-sm bg-gray-100 resize-none dark:bg-gray-200"
        />
      </div>
      {/* 상급재련 확률 안내 (하단) */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-700 max-w-md mx-auto dark:bg-gray-200">
        <h3 className="font-semibold mb-2">상급재련 확률</h3>
        <ul className="list-disc list-inside space-y-1 max-h-60 overflow-auto">
          {rates.map(({ type, chance, xp }) => (
            <li key={type}>
              {type}: 확률 {chance}%, 경험치 {xp}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          * 위 확률은 빈틈봇 전용이며 실제 게임 내 확률과 다를 수 있습니다.
        </p>
      </div>
      {/* 선조의 가호 확률 안내 (하단) */}
      <div className="mt-2 p-4 bg-gray-100 rounded-lg text-sm text-gray-700 max-w-md mx-auto dark:bg-gray-200">
        <h3 className="font-semibold mb-2">선조의 가호</h3>
        <ul className="list-disc list-inside space-y-1 max-h-60 overflow-auto">
          {blessRates.map(({ name, chance, desc }) => (
            <li key={name}>
              {name}: 확률 {chance}%<br /> {desc}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          * 위 확률은 빈틈봇 전용이며 실제 게임 내 확률과 다를 수 있습니다.
        </p>
      </div>
      <div >
        <AdSense adSlot="1488834693" />
      </div>
    </div>

  );
};

export default EnhanceTry;
