'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Rank = ({ roomId }) => {
  const [rankingList, setRankingList] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const [userCode, setUserCode] = useState(null);
  const [roomCode, setRoomCode] = useState(roomId);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserCode = sessionStorage.getItem("userCode") || null;
      setUserCode(storedUserCode);

      const storedRoomCode = sessionStorage.getItem("roomCode") || roomId;
      setRoomCode(storedRoomCode);
    }
  }, [roomId]);

  const fetchRanking = async (pageNum = 1) => {
    if (loadingRef.current) return; // 중복 호출 방지
    loadingRef.current = true;

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/bot/enhance/rank`, {
        page: pageNum,
        limit: 20,
        userId: userCode,
        roomId: roomCode
      });

      // 전체랭킹 데이터 붙이
      if (pageNum === 1) {
        setRankingList(res.data.allRanking);
      } else {
        setRankingList((prev) => [...prev, ...res.data.allRanking]);
      }

      setMyRank(res.data.myRanking);

      // 더 불러올 데이터가 없으면 false 처리
      if (res.data.allRanking.length < 15) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('랭킹 데이터 조회 실패', err);
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    if (roomCode !== null) {
      fetchRanking(1);
    }
  }, [roomCode]);

  // 스크롤 핸들러
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loadingRef.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // 화면 끝에서 100px 안쪽까지 왔을 때 다음 페이지 불러오기
      if (scrollTop + windowHeight + 100 >= docHeight) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  // page 변경시 데이터 추가로 불러오기
  useEffect(() => {
    if (page === 1 ) return;
    fetchRanking(page);
  }, [page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-2">
        🏆 빈틈봇 {roomCode && rankingList.length > 0 ? (
          <span className="text-blue-600 font-medium">[{rankingList[0].ROOM_NAME}]</span>
        ) : (
          <span className="text-blue-600 font-medium">[톡방]</span>
        )} 재련 랭킹
      </h2>
      <p className="text-gray-600 mb-2">최종 재련 달성 순으로 정렬된 전체 유저 랭킹입니다.</p>
      {!roomCode && (
        <div>
          <p className="text-red-600">비 로그인시 전체 랭킹이 표시됩니다.</p>
        </div>
      )}

      {myRank && (
        <div className="overflow-x-auto pr-4">
          <div className="mb-2 p-2 bg-blue-50 border rounded-xl shadow-sm">
            <h4 className="text-blue-800 font-semibold text-lg mb-1">🎯 내 랭킹</h4>
            <p>👤 닉네임: {myRank.USER_NAME}</p>
            <p>👤 대표 캐릭터: {myRank.NICKNAME}</p>
            <p>🏅 순위: {myRank.RANKING}위</p>
            <p>🔨 단계: {myRank.STEP}단계</p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto pr-4">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border w-[60px]">순위</th>
              <th className="p-2 border w-[80px]">재련</th>
              <th className="p-2 border w-[250px]">닉네임</th>
              <th className="p-2 border w-[250px]">대표 캐릭터</th>
              <th className="p-2 border w-[250px]">최종 달성 일시</th>
            </tr>
          </thead>
          <tbody>
            {rankingList.map((user) => (
              <tr
                key={user.USER_ID}
                className={
                  user.USER_ID === userCode
                    ? 'bg-yellow-100 font-bold'
                    : 'hover:bg-gray-50'
                }
              >
                <td
                  className={`text-center border p-2 font-semibold ${user.RANKING == 1
                    ? 'text-yellow-500'
                    : user.RANKING == 2
                      ? 'text-gray-500'
                      : user.RANKING == 3
                        ? 'text-orange-400'
                        : 'text-black'
                    }`}
                >
                  {user.RANKING == 1
                    ? '🥇'
                    : user.RANKING == 2
                      ? '🥈'
                      : user.RANKING == 3
                        ? '🥉'
                        : `${user.RANKING}위`}
                </td>
                <td className="text-center border p-2">{user.STEP}단계</td>
                <td className="text-left border p-2">{user.USER_NAME}</td>
                <td className="text-center border p-2">
                  {user.NICKNAME && user.NICKNAME !== 'UNKNOWN' ? (
                    <Link
                      href={`/character/${user.NICKNAME}`}
                      className="text-blue-600 hover:underline"
                    >
                      {user.NICKNAME}
                    </Link>
                  ) : (
                    user.NICKNAME
                  )}
                </td>
                <td className="text-center border p-2">{user.ACHIEVE_DTTI}</td>
              </tr>
            ))}
          </tbody>

        </table>
        {!hasMore && (
          <p className="text-center mt-4 text-gray-500">더 이상 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Rank;
