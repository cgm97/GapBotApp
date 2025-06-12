'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EnhanceTry = () => {
  const [userId, setUserId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserCode = sessionStorage.getItem("userCode") || null;
      setUserId(storedUserCode);

      const storedRoomCode = sessionStorage.getItem("roomCode") || roomId;
      setRoomId(storedRoomCode);

    }
  }, []);

  const handleEnhance = async () => {
    setResult('재련 시도 중...');

      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/bot/enhance/try`, {
        userId,
        roomId,
        site:"Y"
      });

     setResult(res.data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">재련 시뮬레이터</h2>

      <div className="mb-4 pr-6">
        <label className="block text-sm font-medium mb-1">User Code</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="빈틈봇이 발급 한 유저CODE"
        />
      </div>

      <div className="mb-4 pr-6">
        <label className="block text-sm font-medium mb-1">Room Code</label>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="빈틈봇이 발급 한 채팅방CODE"
        />
      </div>

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
          className="w-full border rounded  pr-3 text-sm bg-gray-100 resize-none"
        />

      </div>
    </div>
  );
};

export default EnhanceTry;
