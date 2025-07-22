'use client';

import React, { useState } from 'react';

export default function RaidClient({ raidData }) {
  const [openRows, setOpenRows] = useState({});

  const toggleRow = (index) => {
    setOpenRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="overflow-x-auto p-4 text-gray-800 dark:text-gray-200">
      <table className="min-w-full border border-gray-300 dark:border-gray-700 text-sm bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="px-4 py-2">입장레벨</th>
            <th className="px-4 py-2">이름</th>
            <th className="px-4 py-2">클리어 골드</th>
            <th className="px-4 py-2">더보기 골드</th>
            <th className="px-4 py-2">클골 - 더보기</th>
            <th className="px-4 py-2">더보기 효율</th>
            <th className="px-4 py-2">구성품</th>
          </tr>
        </thead>
        <tbody>
          {raidData.map((row, i) => (
            <React.Fragment key={i}>
              <tr className="border-b border-gray-200 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-4 py-2 text-center">{row.itemLevel}</td>
                <td className="px-4 py-2">{row.name} ({row.difficulty})</td>
                <td className="px-4 py-2 text-right">
                  {row.rewards.find(r => r.key === 'gold')?.count.toLocaleString() ?? '-'}
                </td>
                <td className="px-4 py-2 text-right">
                  {row.extraRewards.find(r => r.key === 'gold')?.count.toLocaleString() ?? '-'}
                </td>
                <td className="px-4 py-2 text-right font-bold text-yellow-600 dark:text-yellow-400">
                  {(row.rewards.find(r => r.key === 'gold')?.count - row.extraRewards.find(r => r.key === 'gold')?.count).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">
                  <span
                    className={
                      (row.extraTotalPrice - (row.extraRewards.find(r => r.key === 'gold')?.count ?? 0)) > 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }
                  >
                    {(row.extraTotalPrice - (row.extraRewards.find(r => r.key === 'gold')?.count ?? 0)).toLocaleString()}
                  </span>{' '}
                  <span
                    className={
                      (row.extraTotalPrice - (row.extraRewards.find(r => r.key === 'gold')?.count ?? 0)) > 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }
                  >
                    (
                    {(
                      ((row.extraTotalPrice - (row.extraRewards.find(r => r.key === 'gold')?.count ?? 0)) / row.extraTotalPrice) *
                      100
                    ).toFixed(2)}
                    %)
                  </span>
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
                  <td colSpan={7} className="p-4">
                    <div>
                      <div className="flex items-center justify-between mt-6 mb-2">
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          클리어 보상
                        </div>
                        <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                          보상가치 {row.totalPrice.toLocaleString()}G
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {row.rewards.filter(reward => reward.key !== 'gold').map((reward, idx) => (
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
                                {'거래불가(귀속)'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-6 mb-2">
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          더보기 보상
                        </div>
                        <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                          보상가치 {row.extraTotalPrice.toLocaleString()}G
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {row.extraRewards.filter(reward => reward.key !== 'gold').map((reward, idx) => (
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
                                {'거래불가(귀속)'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
