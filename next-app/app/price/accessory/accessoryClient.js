'use client';

import { useState } from 'react';
import CandleChart from '@/components/CandleChart';
import axios from 'axios';

export default function AccessoryClient({ accessorysPrice, accessoryLastUpdate }) {
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [selectedEnhances, setSelectedEnhances] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [modalItem, setModalItem] = useState(null); // 이름, title, enhance, option 포함

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

  const fetchChartData = async (link, itemMeta) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}${link}`);
      setChartData({ itemData: res.data.itemData });
      setModalItem(itemMeta);
    } catch (e) {
      console.error("차트 데이터 오류:", e);
    }
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      {/* 안내 메시지 */}
      <main className="max-w-screen-lg mx-auto px-4 py-6">
      <section
        className="text-center mb-6 text-gray-700"
        aria-labelledby="artifact-price-guide"
      >
        <h1 id="artifact-price-guide" className="text-xl font-bold my-2">
          로스트아크 악세서리 실시간 시세 조회
        </h1>
        <p className="text-sm my-2">
          변동가격은 기준일자 0시 기준으로 계산되며, 목록을 클릭하면 상세 차트를 확인하실 수 있습니다.
        </p>
        <p className="text-sm my-2">
          <strong>기준일자:</strong>{' '}
          <time dateTime={new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10)}>{new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10)}</time>
        </p>
        <p className="text-sm my-2 text-gray-400">
          1시간마다 갱신
          {/* 1분마다 자동 갱신 / 다음 갱신까지{' '}
              <b className="text-red-500">{nextUpdateIn}초</b> 남음
              <br />
              (갱신 시 1분 대비 가격 변동이 약 50초간 표시됩니다.) */}
        </p>
        <p className="text-sm my-2">
          <strong>마지막 업데이트:</strong> <span className="font-semibold">{accessoryLastUpdate}</span>
        </p>
      </section>
      </main>
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
                      {enhance.items.map((item, idx) => {
                        const query = new URLSearchParams();
                        query.set('title', tier.title);
                        query.set('enhance', enhance.enhance);
                        query.set('name', item.name);
                        query.set('option', item.option[0]);
                        if (item.option[1]) query.set('extra', item.option[1]);

                        const link = `/price/accessory/chart?${query.toString()}`;

                        return (
                          <tr
                            key={idx}
                            onClick={() =>
                              fetchChartData(link, {
                                title: tier.title,
                                enhance: enhance.enhance,
                                name: item.name,
                                option: item.option[0],
                                extra: item.option[1] || ''
                              })
                            }
                            className="text-center hover:bg-blue-50 cursor-pointer transition"
                          >
                            <td className="border px-3 py-1">{item.name}</td>
                            <td className="border px-3 py-1">
                              {item.option.map((opt, idx2) => {
                                const grade = tier.title[idx2] || '';
                                const gradeClass = {
                                  '상': 'bg-yellow-400 text-white text-xs px-1 rounded',
                                  '중': 'bg-purple-700 text-white text-xs px-1 rounded',
                                  '하': 'bg-blue-600 text-white text-xs px-1 rounded',
                                }[grade] || 'text-xs';

                                return (
                                  <span key={`${opt}-${idx2}`} className="mr-1 inline-block">
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
      {chartData && modalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative">
            {/* 상단: 제목 + 닫기 버튼 */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{`${modalItem.title} 연마 ${modalItem.enhance}단계`}</h2>
                <div className="flex flex-wrap gap-2 mt-2 text-sm items-center">
                  <span className="text-gray-700 font-semibold">{modalItem.name}</span>
                  {(() => {
                    const decodedTitle = modalItem.title || '';
                    const decodedOption = modalItem.option || '';
                    const extra = modalItem.extra || '';

                    const gradeArr = [];
                    if (decodedTitle.length < 2) {
                      gradeArr.push({ grade: decodedTitle, option: decodedOption });
                    } else {
                      gradeArr.push({ grade: decodedTitle.substring(0, 1), option: decodedOption });
                      gradeArr.push({ grade: decodedTitle.substring(1), option: extra });
                    }

                    return gradeArr.map((item, idx) => {
                      const gradeClass = {
                        '상': 'bg-yellow-500',
                        '중': 'bg-purple-500',
                        '하': 'bg-blue-500',
                      }[item.grade] || 'bg-gray-400';

                      return (
                        <span key={`${item.option}-${idx}`} className="flex items-center gap-1">
                          <span className={`text-white text-xs font-semibold px-2 py-0.5 rounded-full ${gradeClass}`}>
                            {item.grade}
                          </span>
                          <span className="text-gray-800">{item.option}</span>
                        </span>
                      );
                    });
                  })()}
                </div>
              </div>

              <button
                className="text-gray-400 hover:text-gray-700 transition text-xl"
                onClick={() => {
                  setChartData(null);
                  setModalItem(null);
                }}
              >
                ✕
              </button>
            </div>

            {/* 캔들 차트 */}
            <div className="mt-4">
              <CandleChart chartData={chartData.itemData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
