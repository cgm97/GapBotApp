'use client';

import React, { useState, useEffect } from 'react';

export default function ChaosClient({ chaosData }) {
  const [openRows, setOpenRows] = useState({});

  const toggleRow = (index) => {
    setOpenRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="overflow-x-auto p-4 text-gray-800 dark:text-gray-200">
      <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm bg-white dark:bg-gray-900 rounded-lg overflow-hidden" aria-label="카오스 던전 효율 표">
        <caption className="sr-only">로스트아크 카오스 던전(카던) 레벨별 효율</caption>
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="px-4 py-2">입장레벨</th>
            <th className="px-4 py-2">이름</th>
            <th className="px-4 py-2">거래가능</th>
            <th className="px-4 py-2">거래불가</th>
            <th className="px-4 py-2">총 합계</th>
            <th className="px-4 py-2">구성품</th>
          </tr>
        </thead>
        <tbody>
          {chaosData.map((row, i) => (
            <React.Fragment key={i}>
              <tr className="border-b border-gray-200 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-4 py-2 text-center">{row.itemLevel}</td>
                <td className="px-4 py-2">{row.name}</td>
                <td className="px-4 py-2 text-right text-green-600 dark:text-green-400">
                  {row.tradeablePrice.toLocaleString()} G
                </td>
                <td className="px-4 py-2 text-right text-red-500 dark:text-red-400">
                  {row.nonTradeablePrice.toLocaleString()} G
                </td>
                <td className="px-4 py-2 text-right font-bold text-yellow-600 dark:text-yellow-400">
                  {row.totalPrice.toLocaleString()} G
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => toggleRow(i)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {openRows[i] ? '숨기기' : '보기'}
                  </button>
                </td>
              </tr>

              {openRows[i] && (
                <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <td colSpan={6} className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {row.rewards.map((reward, idx) => (
                        <div
                          key={reward.key + idx}
                          className="flex items-start gap-3 border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-900 shadow-sm"
                        >
                          {reward.icon && (
                            <img
                              src={reward.icon}
                              alt={reward.name}
                              className="w-8 h-8"
                            />
                          )}
                          <div className="text-xs space-y-1">
                            <div className="font-bold text-gray-900 dark:text-white">{reward.name}</div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-300">
                                {reward.count.toLocaleString()}개, 약 {reward.price.toLocaleString()} G
                              </span>
                            </div>
                            <div
                              className={`text-[11px] font-medium ${reward.isTradeable
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-400 dark:text-gray-500'
                                }`}
                            >
                              {reward.isTradeable ? '거래가능' : '거래불가(귀속)'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <footer className="mt-10 text-xs text-gray-500 dark:text-gray-400">
        <p>
          LOAGAP는 로스트아크의 카오스 던전 보상 효율을 실시간 골드 시세 기준으로 계산하여 제공합니다.
          카오스 던전 효율, 로아 카던 보상, 로아 카던 효율 등 다양한 키워드로 검색해보세요.
        </p>
      </footer>
    </div>
  );
}
