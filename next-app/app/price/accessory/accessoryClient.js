'use client';

import { useState } from 'react';
// import sampleData from './data.json';

export default function AccessoryClient({ accessorysPrice, accessoryLastUpdate }) {
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [selectedEnhances, setSelectedEnhances] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);

  const allTitles = ['전체', ...accessorysPrice.map((tier) => tier.title)];
  const allEnhanceLevels = ['전체', '1', '2', '3'];
  const allNames = ['전체', '목걸이', '귀걸이', '반지'];

  const toggleSelection = (value, selectedList, setSelectedList) => {
    if (value === '전체') {
      setSelectedList([]);
      return;
    }
    if (selectedList.includes(value)) {
      setSelectedList(selectedList.filter((v) => v !== value));
    } else {
      setSelectedList([...selectedList, value]);
    }
  };

  const filteredData = accessorysPrice
    .filter(
      (tier) =>
        selectedTitles.length === 0 || selectedTitles.includes(tier.title)
    )
    .map((tier) => ({
      ...tier,
      enhances: tier.enhances
        .filter(
          (e) =>
            selectedEnhances.length === 0 || selectedEnhances.includes(e.enhance)
        )
        .map((e) => ({
          ...e,
          items: e.items.filter(
            (item) =>
              selectedNames.length === 0 || selectedNames.includes(item.name)
          ),
        }))
        .filter((e) => e.items.length > 0),
    }))
    .filter((tier) => tier.enhances.length > 0);

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 1);
  const baseDateString = baseDate.toISOString().slice(0, 10);

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      {/* 안내 메시지 */}
      <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#555' }}>
        <h3 style={{ margin: '0.5rem 0' }}>※ 로스트아크 악세 실시간 시세를 조회할 수 있습니다.</h3>
        <h4 style={{ margin: '0.5rem 0' }}>
          변동가격은 기준일자 0시 기준으로 계산된 값이며, 차트를 추가하거나 제거할 수 있습니다.
        </h4>
        <h5 style={{ margin: '0.5rem 0' }}>기준일자 : {baseDateString}</h5>
        <h5 style={{ margin: '0.5rem 0' }}>last update {accessoryLastUpdate}</h5>
      </div>
      {/* 전체 필터 영역을 감싸는 박스 */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-start gap-4">
          {/* Title 필터 */}
          <div className="flex flex-wrap gap-2 mb-3 justify-center">
            {allTitles.map((title) => (
              <button
                key={title}
                onClick={() => toggleSelection(title, selectedTitles, setSelectedTitles)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${(title === '전체' && selectedTitles.length === 0) ||
                  selectedTitles.includes(title)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'
                  }`}
              >
                {title}
              </button>
            ))}
          </div>

          {/* Enhance 필터 */}
          <div className="flex flex-wrap gap-2 mb-3 justify-center">
            {allEnhanceLevels.map((level) => (
              <button
                key={level}
                onClick={() => toggleSelection(level, selectedEnhances, setSelectedEnhances)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${(level === '전체' && selectedEnhances.length === 0) ||
                  selectedEnhances.includes(level)
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-green-100'
                  }`}
              >
                {level === '전체' ? '전체' : `연마 ${level}회`}
              </button>
            ))}
          </div>

          {/* 장신구 이름 필터 */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {allNames.map((name) => (
              <button
                key={name}
                onClick={() => toggleSelection(name, selectedNames, setSelectedNames)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${(name === '전체' && selectedNames.length === 0) ||
                  selectedNames.includes(name)
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50'
                  }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* 결과 출력 */}
      {filteredData.length === 0 ? (
        <p className="text-gray-500 text-center">데이터가 없습니다.</p>
      ) : (
        filteredData.map((tier, idx) => (
          <div
            key={tier.title}
            className={`mb-8 border rounded-lg shadow-sm p-4 bg-gray-100`}
          >


            {tier.enhances.map((enhance) => (
              <div key={enhance.enhance} className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  연마 {enhance.enhance}회
                  <span className="text-sm text-gray-500 font-normal">(4T, 고대, 품질 67 이상)</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="border px-3 py-2">이름</th>
                        <th className="border px-3 py-2">옵션</th>
                        <th className="border px-3 py-2">가격</th>
                        <th className="border px-3 py-2">변동</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {enhance.items.map((item, idx) => (
                        <tr key={idx} className="text-center">
                          <td className="border px-3 py-1">{item.name}</td>
                          <td className="border px-3 py-1 accessory-options">
                            {item.option.map((opt, idx) => {
                              const grade = tier.title[idx] || '';

                              // Tailwind 클래스 매핑
                              const gradeClass = {
                                '상': 'bg-yellow-400 text-white text-xs px-1 rounded',
                                '중': 'bg-purple-700 text-white text-xs px-1 rounded',
                                '하': 'bg-blue-600 text-white text-xs px-1 rounded',
                              }[grade] || 'text-xs';

                              return (
                                <span key={`${opt}-${idx}`} className="mr-1 inline-block">
                                  <span className={`${gradeClass}`}>{grade}</span> {opt}
                                </span>
                              );
                            })}
                          </td>
                          <td className="border px-3 py-1">{item.price.toLocaleString() != 0 ? item.price.toLocaleString() : '매물없음'}</td>
                          <td
                            className={`border px-3 py-1 font-medium ${item.price === 0
                              ? 'text-gray-400'
                              : item.priceDiff > 0
                                ? 'text-green-600'
                                : item.priceDiff < 0
                                  ? 'text-red-600'
                                  : 'text-gray-500'
                              }`}
                          >
                            {item.price === 0
                              ? '—'
                              : `${item.priceDiff > 0 ? '▲' : item.priceDiff < 0 ? '▼' : '—'} ${Math.abs(item.priceDiff).toLocaleString()} (${item.percentDiff}%)`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
