'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import AdSense from '@/components/Adsense';

const Rank = () => {
  const [rankingList, setRankingList] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const fetchRanking = async (pageNum = 1) => {
    if (loadingRef.current) return; // 중복 호출 방지
    loadingRef.current = true;

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/bot/enhance/rank`, {
        page: pageNum,
        limit: 20,
        userId: sessionStorage.getItem("userCode")
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
    fetchRanking(1);
  }, []);

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
    if (page === 1) return; // 첫 로딩은 위에서 이미 호출함
    fetchRanking(page);
  }, [page]);

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground min-h-screen">
      <h2 className="text-2xl font-bold mb-2 dark:text-gray-300">🏆 빈틈봇 <span className="text-blue-600 font-medium">[전체]</span> 재련 랭킹</h2>
      <AdSense adSlot="1488834693" />
      <p className="text-gray-600 mb-2 dark:text-gray-300">최종 재련 달성 순으로 정렬된 전체 유저 랭킹입니다.
        <span className="text-gray-600 mb-2 dark:text-gray-300"> ※빈틈봇연동시 대표캐릭터가 표시됩니다.</span>
      </p>

      {myRank && (
        <div className="overflow-x-auto pr-4">
          <div className="mb-2 p-2 bg-blue-50 dark:bg-gray-500 border dark:border-gray-600 rounded-xl shadow-sm">
            <h4 className="text-blue-800 dark:text-blue-200 font-semibold text-lg mb-1">🎯 내 랭킹</h4>
            <p className="text-gray-800 dark:text-gray-100">👤 닉네임: {myRank.USER_NAME}</p>
            <p className="text-gray-800 dark:text-gray-100">👤 대표 캐릭터: {myRank.NICKNAME}</p>
            <p className="text-gray-800 dark:text-gray-100">🏅 순위: {myRank.RANKING}위</p>
            <p className="text-gray-800 dark:text-gray-100">🔨 단계: {myRank.STEP}단계{myRank.ADVANCE_STEP ? ` (+${myRank.ADVANCE_STEP})` : ''}</p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto pr-4">
        <table className="w-full table-auto border-collapse border border-gray-200 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-blue-900">
            <tr>
              <th className="p-2 border dark:border-gray-600 w-[60px]">순위</th>
              <th className="p-2 border dark:border-gray-600 w-[160px]">재련(상급재련)</th>
              <th className="p-2 border dark:border-gray-600 w-[100px]">닉네임</th>
              <th className="p-2 border dark:border-gray-600 w-[200px]">대표 캐릭터</th>
              <th className="p-2 border dark:border-gray-600 w-[180px]">직업</th>
              <th className="p-2 border dark:border-gray-600 w-[250px]">최종 달성 일시</th>
            </tr>
          </thead>
          <tbody className='dark:bg-gray-700'>
            {rankingList.map((user) => (
              <tr
                key={user.USER_ID}
                className={
                  user.USER_ID === sessionStorage.getItem("userCode")
                    ? 'bg-yellow-100 dark:bg-yellow-900 font-bold'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              >
                <td
                  className={`text-center border p-2 font-semibold ${user.RANKING == 1
                    ? 'text-yellow-500'
                    : user.RANKING == 2
                      ? 'text-gray-500'
                      : user.RANKING == 3
                        ? 'text-orange-400'
                        : 'text-black dark:text-gray-300'
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
                <td className="text-center border p-2 dark:border-gray-600 dark:text-gray-200"><span className="font-bold text-blue-600 dark:text-gray-200">{user.STEP}단계</span>
                  {user.ADVANCE_STEP > 0 && (
                    <span className="text-sm  text-green-600 dark:text-green-400 ml-1">
                      (+{user.ADVANCE_STEP})
                    </span>
                  )}</td>
                <td className="border p-2 dark:border-gray-600 dark:text-gray-200 text-left max-w-[100px] truncate">{user.USER_NAME}</td>
                <td className="text-center border p-2 dark:border-gray-600 dark:text-gray-200">
                  {user.NICKNAME && user.NICKNAME !== 'UNKNOWN' ? (
                    <Link href={`/character/${user.NICKNAME}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {user.NICKNAME}
                    </Link>
                  ) : (
                    '미연동'
                  )}
                </td>
                <td className="text-center dark:text-gray-200">
                  {user.NICKNAME && user.NICKNAME !== 'UNKNOWN' ? (
                    <>
                      {user.JOB} {user.SUBJOB}<br />{user.ITEM_LEVEL.toFixed(2)}
                    </>
                  ) : (
                    ''
                  )}
                </td>
                <td className="text-center border p-2 dark:border-gray-600 dark:text-gray-300">{user.ACHIEVE_DTTI}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!hasMore && (
          <p className="text-center mt-4 text-gray-500 dark:text-gray-400">더 이상 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Rank;
