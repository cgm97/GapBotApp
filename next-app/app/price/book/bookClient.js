"use client";

import { useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "@/css/BookPrice.css";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function BookClient({ booksPrice, bookLastUpdate }) {
  const [activeTab, setActiveTab] = useState("price");
  const [selectedItems, setSelectedItems] = useState([]);
  const [chartData, setChartData] = useState({});
  const [alert, setAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

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
    const btnRect = event.currentTarget.getBoundingClientRect();

    let top = btnRect.top - 40;
    let left = btnRect.left + btnRect.width / 2;
    if (top < 10) top = btnRect.bottom + 10;
    if (left < 10) left = 10;
    if (left > window.innerWidth - 150) left = window.innerWidth - 150;

    const isSelected = selectedItems.includes(itemName);
    let newSelected;

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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: false },
      x: { ticks: { autoSkip: false } },
    },
  };

  const datasets = selectedItems.map((itemName, idx) => ({
    label: itemName,
    data: chartData[itemName]?.map((d) => d.price) || [],
    borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
    backgroundColor: `hsla(${(idx * 60) % 360}, 70%, 50%, 0.2)`,
    tension: 0.3,
    fill: true,
    pointRadius: 4,
    pointHoverRadius: 6,
  }));

  const allDates = Array.from(
    new Set(
      selectedItems.flatMap((itemName) => chartData[itemName]?.map((d) => d.date) || [])
    )
  ).sort();

  return (
    <>
      {/* 탭 버튼 */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "1rem 0" }}>
        <button
          onClick={() => setActiveTab("price")}
          className={activeTab === "price" ? "active" : ""}
        >
          시세
        </button>
        <button
          onClick={() => setActiveTab("chart")}
          className={activeTab === "chart" ? "active" : ""}
          disabled={selectedItems.length === 0}
          title={selectedItems.length === 0 ? "먼저 시세 탭에서 각인서를 선택하세요" : ""}
        >
          차트
        </button>
      </div>

      {/* 시세 테이블 */}
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
            <h5 style={{ margin: "0.5rem 0" }}>last update {bookLastUpdate}</h5>
          </div>

          <table className="price-table">
            <thead>
              <tr>
                <th>각인서 이름</th>
                <th>현재가격</th>
                <th>읽는가격</th>
                <th>변동가격</th>
                <th>차트선택</th>
              </tr>
            </thead>
            <tbody>
              {booksPrice && Object.keys(booksPrice).length > 0 ? (
                Object.values(booksPrice).map((item) => {
                  const isSelected = selectedItems.includes(item.name);
                  return (
                    <tr key={item.name}>
                      <td><img src={item.icon} alt={item.name} className="icon" />{item.name}</td>
                      <td>{item.price.toLocaleString()}</td>
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
                      <td
                        style={{
                          color:
                            item.diffPrice > 0
                              ? "green"
                              : item.diffPrice < 0
                                ? "red"
                                : "gray",
                        }}
                      >
                        {item.diffPrice > 0
                          ? "▲"
                          : item.diffPrice < 0
                            ? "▼"
                            : "—"}{" "}
                        {Math.abs(item.diffPrice).toLocaleString()} ({item.percent}%)
                      </td>
                      <td>
                        <button
                          onClick={(e) => handleItemToggle(item.name, e)}
                          style={{
                            background: "none",
                            border: "1px solid",
                            borderColor: isSelected ? "green" : "gray",
                            color: isSelected ? "green" : "gray",
                            cursor: "pointer",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            userSelect: "none",
                          }}
                        >
                          {isSelected ? "−" : "+"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 차트 */}
      {activeTab === "chart" && selectedItems.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h5>※ 유물 각인서 시세를 차트로 확인할 수 있습니다.</h5>
          <Line data={{ labels: allDates, datasets }} options={chartOptions} />
        </div>
      )}

      {/* 알림 메시지 */}
      {alert && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            position: "fixed",
            top: alert.position.top,
            left: alert.position.left,
            transform: "translateX(-50%)",
            backgroundColor: alert.type === "add" ? "#27ae60" : "#e74c3c",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            pointerEvents: "auto",
            cursor: "pointer",
            zIndex: 9999,
            fontWeight: "600",
            userSelect: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            transition: "opacity 0.3s ease-in-out",
          }}
          onClick={() => setAlert(null)}
          onMouseEnter={() => {
            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
          }}
          onMouseLeave={() => {
            alertTimeoutRef.current = setTimeout(() => setAlert(null), 1200);
          }}
        >
          {alert.message}
        </div>
      )}
    </>
  );
}