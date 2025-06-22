'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
// import { Line } from 'react-chartjs-2';
import "@/css/BookPrice.css";
import LineChart from '@/components/LineChart';
import useSWR from 'swr';

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
//   TimeScale
// } from 'chart.js';

// import annotationPlugin from 'chartjs-plugin-annotation';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
//   TimeScale,
//   annotationPlugin
// );

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const fetcher = (url) => axios.get(url).then(res => res.data);

export default function JewelClient({ jewelsPrice, jewelPriceLastUpdate }) {
  const [activeTab, setActiveTab] = useState('price');
  const [selectedItems, setSelectedItems] = useState([]);
  const [chartData, setChartData] = useState({});
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);
  const [nextUpdateIn, setNextUpdateIn] = useState(60); // 초 단위 카운트다운

  // SWR 적용
  const { data, error, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/price/jewel`,
    fetcher,
    {
      fallbackData: { jewelsPrice, jewelPriceLastUpdate },
      refreshInterval: 0,      // 자동갱신 끔
      revalidateOnFocus: false,
    }
  );

  const lastUpdateTimeRef = useRef(Date.now());

  // 1분마다 직접 mutate 호출 → 기준 시점 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      mutate();                             // 수동 갱신
      lastUpdateTimeRef.current = Date.now(); // 기준 시점 갱신
    }, 61000);
    return () => clearInterval(interval);
  }, [mutate]);

  // 1초마다 기준 시점 기준으로 남은 시간 계산
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastUpdateTimeRef.current) / 1000);
      const remaining = 60 - (elapsed % 60);
      setNextUpdateIn(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  // swr 몇초 후에 한다고 카운터 여기까지

  useEffect(() => {
    if (!data) return;
    // 아이템 가격 변동 시
  }, [data]);

  // 렌더링할 데이터는 SWR data 기준
  const currentPrice = data?.jewelsPrice || jewelsPrice;
  const lastUpdate = data?.jewelPriceLastUpdate || jewelPriceLastUpdate;

  const fetchChartData = async (itemName) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/price/jewel/chart?item=${encodeURIComponent(itemName)}`);
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
    if (!data?.jewelsPrice) return;

    const changed = [];

    Object.entries(data.jewelsPrice).forEach(([key, newItem]) => {
      const prevItem = prevPriceRef.current[key];
      if (prevItem && prevItem.price !== newItem.price) {
        changed.push({
          name: newItem.name,
          oldPrice: prevItem.price,
          newPrice: newItem.price,
          diff: newItem.price - prevItem.price,
        });
      }
    });

    // 이전 changedItems와 새로 계산된 changed를 JSON 문자열로 비교 (간단한 깊은 비교)
    const prevChangedStr = JSON.stringify(changedItems);
    const newChangedStr = JSON.stringify(changed);

    if (prevChangedStr !== newChangedStr) {
      setChangedItems(changed);

      if (changed.length > 0) {
        if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
        alertTimeoutRef.current = setTimeout(() => setChangedItems([]), 50000);
      }
    }

    prevPriceRef.current = JSON.parse(JSON.stringify(data.jewelsPrice));
  }, [data]);

  // const annotationData = [
  //   { date: '2025-04-30', label: 'Live 광휘 언급' },
  //   { date: '2025-05-20', label: 'Live 공증 삭제' }
  // ];

  // const annotationLines = annotationData.reduce((acc, { date, label }, idx) => {
  //   acc[`line${idx}`] = {
  //     type: 'line',
  //     scaleID: 'x',
  //     value: date,
  //     borderColor: 'black',
  //     borderWidth: 1,
  //     label: {
  //       display: true,
  //       content: label,
  //       color: '#fff',
  //       backgroundColor: 'rgba(0, 0, 0, 0.6)',
  //       position: 'end'
  //     },
  //   };
  //   return acc;
  // }, {});

  // const chartOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: { position: 'top' },
  //     tooltip: { enabled: true },
  //     annotation: {
  //       annotations: annotationLines, //
  //     },
  //   },
  //   scales: {
  //     y: { beginAtZero: false },
  //     x: { ticks: { autoSkip: false } }
  //   }
  // };

  // const datasets = selectedItems.map((item, idx) => ({
  //   label: item,
  //   data: chartData[item]?.map(d => d.price) || [],
  //   borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
  //   backgroundColor: `hsla(${(idx * 60) % 360}, 70%, 50%, 0.2)`,
  //   fill: true,
  //   tension: 0.3,
  //   pointRadius: 3,
  //   pointHoverRadius: 6,
  // }));

  // const allDates = Array.from(
  //   new Set(selectedItems.flatMap(item => chartData[item]?.map(d => d.date) || []))
  // ).sort();

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
        <button onClick={() => setActiveTab('price')} className={activeTab === 'price' ? 'active' : ''}>시세</button>
        <button
          onClick={() => setActiveTab('chart')}
          className={activeTab === 'chart' ? 'active' : ''}
          disabled={selectedItems.length === 0}
        >
          차트
        </button>
      </div>

      {activeTab === 'price' && (
        <div className="price-table-container">
          <div style={{ textAlign: "center", marginBottom: "1rem", color: "#555" }}>
            <h3 style={{ margin: "0.5rem 0" }}>※ 로스트아크 보석 실시간 시세를 조회할 수 있습니다.</h3>
            <h4 style={{ margin: "0.5rem 0" }}>
              변동가격은 기준일자 0시 기준으로 계산된 값이며, 차트를 추가하거나 제거할 수 있습니다.
            </h4>
            <h5 style={{ margin: "0.5rem 0" }}>
              기준일자 : {new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10)}
            </h5>
            <h5 className="my-2 text-gray-700">
              <span className="ml-1 text-xs text-gray-400">
                1분마다 자동 갱신 / 다음 갱신까지 <b className='text-red-400'>{nextUpdateIn}초</b> 남음
              </span><br />
              <span className="ml-1 text-xs text-gray-400">
                (갱신 시 1분 대비 가격 변동이 약 50초간 표시됩니다.)
              </span><br />
              last update <span className="font-semibold">{lastUpdate}</span>

            </h5>
          </div>
          <table className="price-table">
            <thead>
              <tr>
                <th className='p-2 border w-[200px]'>보석</th>
                <th className="p-2 border w-[200px] text-left">
                  현재 가격 <span className="ml-1 text-xs text-gray-300">(1분 대비)</span>
                </th>
                <th className='p-2 border w-[200px]'>
                  변동 가격 <span className="ml-1 text-xs text-gray-300">(기준일자 대비)</span>
                </th>
                <th>차트</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(currentPrice).map(item => {
                const isSelected = selectedItems.includes(item.name);
                const changedInfo = changedItems.find(ci => ci.name === item.name);
                const isChanged = !!changedInfo;
                const changeInfo = changedItems.find(ci => ci.name === item.name);
                return (
                  <tr
                    key={item.name}
                    className={isChanged ? "animate-price-change" : ""}
                  >
                    <td><img src={item.icon} alt={item.name} className="icon" /> {item.name}</td>
                    <td>
                      {item.price.toLocaleString()}
                      {changeInfo && (
                        <span className={` ml-2 text-sm font-medium ${changeInfo.diff > 0 ? 'text-green-600' : changeInfo.diff < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                          {/* 이전 대비 차액 */}
                          {'('}{changeInfo.diff > 0 ? '+' : ''}
                          {changeInfo.diff.toLocaleString()}{')'}
                        </span>
                      )}
                    </td>
                    <td style={{ color: item.diffPrice > 0 ? 'green' : item.diffPrice < 0 ? 'red' : 'gray' }}>
                      {item.diffPrice > 0 ? '▲' : item.diffPrice < 0 ? '▼' : '—'}{' '}
                      {Math.abs(item.diffPrice).toLocaleString()} ({item.percent}%)
                    </td>
                    <td>
                      <button
                        onClick={(e) => handleItemToggle(item.name, e)}
                        style={{
                          border: '1px solid',
                          borderColor: isSelected ? 'green' : 'gray',
                          color: isSelected ? 'green' : 'gray',
                          borderRadius: 4,
                          padding: '4px 8px',
                          cursor: 'pointer',
                        }}
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
      )}

      {activeTab === 'chart' && selectedItems.length > 0 && (
        <div >
          <h5>※ 하단 라벨을 클릭하여 해당 보석 차트를 켜거나 끌 수 있습니다.</h5>
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
