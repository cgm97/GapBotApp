"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "@/css/BookPrice.css";
import LineChart from "@/components/LineChart";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function BookClient({ booksPrice, bookLastUpdate }) {
  const [activeTab, setActiveTab] = useState("price");
  const [selectedItems, setSelectedItems] = useState([]);
  const [chartData, setChartData] = useState({});
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);
  const [nextUpdateIn, setNextUpdateIn] = useState(60);

  const { data, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/price/book`,
    fetcher,
    {
      fallbackData: { booksPrice, bookLastUpdate },
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  );

  const lastUpdateTimeRef = useRef(Date.now());
  const prevPriceRef = useRef({});
  const [changedItems, setChangedItems] = useState([]);

  // 1분마다 데이터 갱신 + 기준 시점 저장
  useEffect(() => {
    const interval = setInterval(() => {
      mutate();
      lastUpdateTimeRef.current = Date.now();
    }, 61000);
    return () => clearInterval(interval);
  }, [mutate]);

  // 1초마다 남은 시간 카운트
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastUpdateTimeRef.current) / 1000);
      const remaining = 60 - (elapsed % 60);
      setNextUpdateIn(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 변동 체크용
  useEffect(() => {
    if (!data?.booksPrice) return;

    const changed = [];
    Object.entries(data.booksPrice).forEach(([key, newItem]) => {
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

    if (JSON.stringify(changed) !== JSON.stringify(changedItems)) {
      setChangedItems(changed);
      if (changed.length > 0) {
        if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
        alertTimeoutRef.current = setTimeout(() => setChangedItems([]), 50000);
      }
    }

    prevPriceRef.current = JSON.parse(JSON.stringify(data.booksPrice));
  }, [data]);

  const fetchChartData = async (itemName) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/price/book/chart?item=${encodeURIComponent(itemName)}`
      );
      if (response.status === 200) {
        setChartData((prev) => ({
          ...prev,
          [itemName]: response.data.itemData,
        }));
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
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
      newSelected = selectedItems.filter((name) => name !== itemName);
      setAlert({ message: `${itemName} 제거됨`, type: "remove", position: { top, left } });
    } else {
      newSelected = [...selectedItems, itemName];
      setAlert({ message: `${itemName} 추가됨`, type: "add", position: { top, left } });
      fetchChartData(itemName);
    }

    setSelectedItems(newSelected);
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = setTimeout(() => setAlert(null), 1800);
  };

  const currentPrice = data?.booksPrice || booksPrice;
  const lastUpdate = data?.bookPriceLastUpdate || bookLastUpdate;

  return (
    <>
      {/* 탭 */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "1rem 0" }}>
        <button onClick={() => setActiveTab("price")} className={activeTab === "price" ? "active" : ""}>
          시세
        </button>
        <button
          onClick={() => setActiveTab("chart")}
          className={activeTab === "chart" ? "active" : ""}
          disabled={selectedItems.length === 0}
        >
          차트
        </button>
      </div>

      {activeTab === "price" && (
        <div className="price-table-container">
          <div style={{ textAlign: "center", marginBottom: "1rem", color: "#555" }}>
            <h3 style={{ margin: "0.5rem 0" }}>※ 로스트아크 유물 각인서 실시간 시세를 조회할 수 있습니다.</h3>
            <h4 style={{ margin: "0.5rem 0" }}>
              변동가격은 기준일자 0시 기준으로 계산된 값이며, 차트를 추가하거나 제거할 수 있습니다.
            </h4>
            <h5 style={{ margin: "0.5rem 0" }}>
              기준일자 : {new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10)}
            </h5>
            <h5 className="my-2 text-gray-700">
              <span className="text-xs text-gray-400">
                1분마다 자동 갱신 / 다음 갱신까지 <b className="text-red-500">{nextUpdateIn}초</b> 남음
              </span><br />
              <span className="ml-1 text-xs text-gray-400">
                (갱신 시 1분 대비 가격 변동이 약 50초간 표시됩니다.)
              </span> <br />
              last update <span className="font-semibold">{lastUpdate}</span>
            </h5>
          </div>

          <table className="price-table">
            <thead>
              <tr>
                <th>각인서 이름</th>
                <th>현재가격 <span className="ml-1 text-xs text-gray-300">(1분 대비)</span></th>
                <th>읽는가격</th>
                <th>변동가격 <span className="ml-1 text-xs text-gray-300">(기준일자 대비)</span></th>
                <th>차트</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(currentPrice).map((item) => {
                const isSelected = selectedItems.includes(item.name);
                const changeInfo = changedItems.find((ci) => ci.name === item.name);

                return (
                  <tr key={item.name} className={changeInfo ? "animate-price-change" : ""}>
                    <td><img src={item.icon} alt={item.name} className="icon" /> {item.name}</td>
                    <td>
                      {item.price.toLocaleString()}
                      {changeInfo && (
                        <span className={`ml-2 text-sm font-medium ${changeInfo.diff > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          ({changeInfo.diff > 0 ? "+" : ""}{changeInfo.diff.toLocaleString()})
                        </span>
                      )}
                    </td>
                    <td>
                      <details>
                        <summary>펼치기</summary>
                        <div>
                          <p>5장: {(item.price * 5).toLocaleString()}</p>
                          <p>10장: {(item.price * 10).toLocaleString()}</p>
                          <p>15장: {(item.price * 15).toLocaleString()}</p>
                          <p>20장: {(item.price * 20).toLocaleString()}</p>
                        </div>
                      </details>
                    </td>
                    <td style={{ color: item.diffPrice > 0 ? "green" : item.diffPrice < 0 ? "red" : "gray" }}>
                      {item.diffPrice > 0 ? "▲" : item.diffPrice < 0 ? "▼" : "—"}{" "}
                      {Math.abs(item.diffPrice).toLocaleString()} ({item.percent}%)
                    </td>
                    <td>
                      <button
                        onClick={(e) => handleItemToggle(item.name, e)}
                        style={{
                          border: "1px solid",
                          borderColor: isSelected ? "green" : "gray",
                          color: isSelected ? "green" : "gray",
                          borderRadius: 4,
                          padding: "4px 8px",
                          cursor: "pointer",
                        }}
                      >
                        {isSelected ? "−" : "+"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "chart" && selectedItems.length > 0 && (
        <div>
          <h5>※ 하단 라벨을 클릭하여 차트 라인 켜거나 끌 수 있음</h5>
          <LineChart rawData={chartData} />
        </div>
      )}

      {alert && (
        <div
          style={{
            position: "fixed",
            top: alert.position.top,
            left: alert.position.left,
            transform: "translateX(-50%)",
            backgroundColor: alert.type === "add" ? "#27ae60" : "#e74c3c",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            zIndex: 1000,
            fontWeight: "bold",
          }}
        >
          {alert.message}
        </div>
      )}
    </>
  );
}
