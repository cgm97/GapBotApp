'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
// import { Line } from 'react-chartjs-2';
import "@/css/BookPrice.css";
import '@/css/Character.css';
import LineChart from '@/components/LineChart';
import useSWR from 'swr';

const fetcher = (url) => axios.get(url).then(res => res.data);

export default function MarketClient({ marketsPrice, marketPriceLastUpdate }) {
  const [activeTab, setActiveTab] = useState('price');
  const [selectedItems, setSelectedItems] = useState([]);
  const [chartData, setChartData] = useState({});
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);
  // const [nextUpdateIn, setNextUpdateIn] = useState(60); // 초 단위 카운트다운
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('전체');


  // SWR 적용
  const { data, error, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/price/market`,
    fetcher,
    {
      fallbackData: { marketsPrice, marketPriceLastUpdate },
      refreshInterval: 0,           // 자동 호출 제거
      revalidateOnFocus: false,     // 탭 전환시 요청 방지
    }
  );

  useEffect(() => {
    if (!data) return;
    // 아이템 가격 변동 시
  }, [data]);

  const handleRefresh = () => {
    if (disabled) return; // 이미 비활성화 상태면 무시

    setLoading(true);
    setDisabled(true);

    // 2초 지연 후 mutate 호출
    setTimeout(() => {
      mutate()
        .finally(() => {
          setLoading(false);
        });
    }, 2000);

    // 10초 후에 다시 활성화 (2초 딜레이 포함)
    setTimeout(() => {
      setDisabled(false);
    }, 10000);
  };


  // 렌더링할 데이터는 SWR data 기준
  const currentPrice = data?.marketsPrice || marketsPrice;
  const lastUpdate = data?.marketPriceLastUpdate || marketPriceLastUpdate;

  const fetchChartData = async (itemName) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/market/chart?item=${encodeURIComponent(itemName)}`);
      setChartData(prev => ({ ...prev, [itemName]: res.data.itemData }));
    } catch (e) {
      console.error("차트 데이터 오류:", e);
    }
  };

  const handleItemToggle = (itemName, event) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const isSelected = selectedItems.includes(itemName);
    let newSelected;

    let top = rect.top - 40;
    let left = rect.left + rect.width / 2;
    if (top < 10) top = rect.bottom + 10;
    if (left < 10) left = 10;
    if (left > window.innerWidth - 150) left = window.innerWidth - 150;

    if (isSelected) {
      newSelected = selectedItems.filter(name => name !== itemName);

      // chartData에서도 삭제
      setChartData(prev => {
        const updated = { ...prev };
        delete updated[itemName];
        return updated;
      });

      setAlert({ message: `${itemName} 제거됨`, type: 'remove', position: { top, left } });
    } else {
      newSelected = [...selectedItems, itemName];
      setAlert({ message: `${itemName} 추가됨`, type: 'add', position: { top, left } });
      fetchChartData(itemName);
    }

    setSelectedItems(newSelected);

    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = setTimeout(() => setAlert(null), 1800);
  };

  // 변동 체크를 위한 이전 가격 상태
  const prevPriceRef = useRef({});

  // 변동 감지용 상태
  const [changedItems, setChangedItems] = useState([]);

  useEffect(() => {
    if (!data?.marketsPrice) return;

    const changed = [];

    for (const [category, items] of Object.entries(data.marketsPrice)) {
      items.forEach(newItem => {
        const prevItem = prevPriceRef.current[newItem.name];
        if (prevItem && prevItem.price !== newItem.price) {
          changed.push({
            name: newItem.name,
            oldPrice: prevItem.price,
            newPrice: newItem.price,
            diff: newItem.price - prevItem.price,
          });
        }
      });
    }

    const prevChangedStr = JSON.stringify(changedItems);
    const newChangedStr = JSON.stringify(changed);

    if (prevChangedStr !== newChangedStr) {
      setChangedItems(changed);
      if (changed.length > 0) {
        if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
        alertTimeoutRef.current = setTimeout(() => setChangedItems([]), 50000);
      }
    }

    // 이전 가격 갱신
    const flatMap = {};
    for (const items of Object.values(data.marketsPrice)) {
      for (const item of items) {
        flatMap[item.name] = item;
      }
    }
    prevPriceRef.current = flatMap;
  }, [data]);

  // 등급에 따른 CSS 클래스 반환
  const getGradeClass = (grade) => {
    switch (grade) {
      case '고대': return 'ancient';
      case '유물': return 'relic';
      case '전설': return 'legend';
      case '영웅': return 'heroic';
      case '희귀': return 'rare';
      default: return '';
    }
  };

  return (
    <>
      <div className="flex justify-center gap-4 my-4">
        <button
          onClick={() => setActiveTab('price')}
          className={`
      px-4 py-2 rounded
      ${activeTab === 'price'
              ? 'bg-blue-600 text-white dark:bg-blue-800  dark:text-black'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100'}
    `}
        >
          시세
        </button>

        <button
          onClick={() => setActiveTab('chart')}
          disabled={selectedItems.length === 0}
          className={`
      px-4 py-2 rounded
      ${activeTab === 'chart'
              ? 'bg-blue-600 text-white dark:bg-blue-800  dark:text-black'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100'}
      ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
    `}
        >
          차트
        </button>
      </div>

      {activeTab === 'price' && (
        <div className="price-table-container">
          {/* SEO용 숨은 텍스트 영역 (화면에는 안 보임) */}
          <section className="sr-only" aria-label="생활 재료 및 강화 재료 시세 키워드">
            <h2>로스트아크 강화 재료 시세, 생활 재료 시세</h2>
            <p>
              강화 재료, 재련 재료, 생활 재료 시세, 벌목 재료 시세, 고고학 재료 시세, 채광 재료 시세, 낚시 재료 시세, 실시간 가격, T3, T4 재료, 오레하 융화 재료, 명예의 파편, 에스더 기운, 운명의 파편, 아비도스, 돌파석
            </p>
          </section>

          <main className="max-w-screen-lg mx-auto px-4 py-6">
            <section
              className="text-center mb-6 text-gray-700"
              aria-labelledby="jewel-price-guide"
            >
              <h1 id="jewel-price-guide" className="text-xl font-bold my-2 dark:text-gray-300">
                로스트아크 강화 재련 재료 시세 · 생활 재료 실시간 가격
              </h1>
              <p className="text-sm my-2 dark:text-gray-300">
                변동가격은 기준일자 0시 종가 기준으로 계산된 값이며, 차트를 추가하거나 제거할 수 있습니다.
              </p>
              <p className="text-sm my-2 dark:text-gray-300">
                <strong>기준일자:</strong>{' '}
                <time dateTime={new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10)}>{new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10)}</time>
              </p>
              <p className="text-sm my-2 text-gray-300">
                갱신 시 1분 대비 가격 변동이 약 50초간 표시됩니다.
              </p>
              <p className="text-sm my-2 text-center text-gray-700 flex items-center justify-center dark:text-gray-300">
                <strong>마지막 업데이트:</strong>{' '}
                <span className="font-semibold ml-1">{lastUpdate}</span>
                <button
                  onClick={handleRefresh}
                  aria-label="데이터 갱신"
                  title="데이터 갱신"
                  disabled={disabled}
                  className={`
                    ml-3 inline-flex items-center justify-center
                    bg-gray-100 hover:bg-gray-200
                    text-gray-600 hover:text-gray-800
                    rounded px-2 py-1
                    select-none
                    focus:outline-none focus:ring-2 focus:ring-blue-300
                    transition duration-150 ease-in-out
                    cursor-pointer
                    h-6
                    dark:bg-gray-300
                    ${loading ? 'cursor-wait opacity-70' : ''}
                    ${disabled && !loading ? 'cursor-not-allowed opacity-40 hover:bg-gray-100 hover:text-gray-600' : ''}
                  `}
                >
                  {loading ? (
                    <svg
                      className="h-3.5 w-3.5 animate-spin text-gray-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582M20 20v-5h-.581M4 9a8 8 0 0112.707-4.293M20 15a8 8 0 01-12.707 4.293"
                      />
                    </svg>
                  )}
                </button>
              </p>
            </section>
          </main>
          <div className="flex flex-wrap justify-center gap-2 my-2">
            {['전체', ...Object.keys(currentPrice)].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`
        px-3 py-1 rounded border text-sm
        ${categoryFilter === cat
                    ? 'bg-blue-600 text-white dark:bg-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100'}
      `}
              >
                {cat}
              </button>
            ))}
          </div>
          {Object.entries(currentPrice)
            .filter(([category]) => categoryFilter === '전체' || categoryFilter === category)
            .map(([category, items]) => (
              <div key={category} className="mb-8">
                <h2 className="text-lg font-semibold text-left px-4 dark:text-gray-200">
                  {category}
                </h2>

                <table className="price-table w-full border-collapse text-sm dark:text-gray-200">
                  <thead>
                    <tr className="dark:bg-blue-900 dark:text-gray-300">
                      <th className="dark:border-gray-600">아이템</th>
                      <th className="dark:border-gray-600">
                        현재 가격 <span className="ml-1 text-xs text-gray-300">(1분 대비)</span>
                      </th>
                      <th className="dark:border-gray-600">변동가격 <span className="ml-1 text-xs text-gray-300">(기준일자 대비)</span></th>
                      <th className="dark:border-gray-600">차트</th>
                    </tr>
                  </thead>
                  <tbody className="dark:bg-background dark:text-gray-300">
                    {items.slice()
                      .sort((a, b) => b.tier - a.tier) // 여기서 티어 정렬
                      .map(item => {
                        const isSelected = selectedItems.includes(item.name);
                        const changedInfo = changedItems.find(ci => ci.name === item.name);

                        return (
                          <tr key={item.name} className={`border-t dark:border-gray-600 ${changedInfo ? "animate-price-change" : ""}`}>
                            <td className="p-2 dark:border-gray-600">
                              <div className={`gem-box ${getGradeClass(item.grade)} inline-flex items-center justify-center rounded p-0`}
                                style={{ width: '38px', height: '38px' }}>
                                <img src={item.icon} alt={item.name} className="w-4 h-4 object-contain" />
                              </div>
                              <span style={{ position: 'relative', top: '-10px' }}>{item.name}</span>
                            </td>
                            <td className="p-1 dark:border-gray-600 leading-tight">
                              <div className="text-xs text-gray-400 leading-tight">
                                {item.bundleCount}개 묶음
                              </div>
                              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                                {item.price.toLocaleString()}
                                {changedInfo && (
                                  <span className={`text-sm ${changedInfo.diff > 0 ? 'text-red-500' : changedInfo.diff < 0 ? 'text-blue-500' : 'text-gray-500'}`}>
                                    ({changedInfo.diff > 0 ? '+' : ''}{changedInfo.diff.toLocaleString()})
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                                개당 {(item.price / item.bundleCount).toFixed(1).toLocaleString()}
                              </div>
                            </td>
                            <td className={`p-2 dark:border-gray-600 ${item.priceDiff > 0
                              ? 'text-red-500'
                              : item.priceDiff < 0
                                ? 'text-blue-500'
                                : 'text-gray-500'
                              }`}>
                              {item.priceDiff > 0 ? '▲' : item.priceDiff < 0 ? '▼' : '—'} {Math.abs(item.priceDiff).toLocaleString()} ({item.percent}%)
                            </td>

                            <td className="dark:border-gray-600">
                              <button
                                onClick={(e) => handleItemToggle(item.name, e)}
                                className={`border rounded px-2 py-1 text-sm transition dark:bg-gray-600 ${isSelected
                                  ? 'border-green-500 text-green-500 hover:bg-green-100 dark:hover:bg-green-700'
                                  : 'border-gray-400 text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                  }`}
                              >
                                {isSelected ? '−' : '+'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ))}


        </div>
      )}

      {activeTab === 'chart' && selectedItems.length > 0 && (
        <div >
          <h5>※ 하단 라벨을 클릭하여 해당 차트를 켜거나 끌 수 있습니다.</h5>
          {/* <Line
            data={{ labels: allDates, datasets }}
            options={chartOptions}
           /> */}
          <LineChart rawData={chartData} />
        </div>
      )}

      {alert && (
        <div
          style={{
            position: 'fixed',
            top: alert.position.top,
            left: alert.position.left,
            transform: 'translateX(-50%)',
            backgroundColor: alert.type === 'add' ? '#27ae60' : '#e74c3c',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            zIndex: 1000,
            fontWeight: 'bold',
          }}
        >
          {alert.message}
        </div>
      )}
    </>
  );
}
