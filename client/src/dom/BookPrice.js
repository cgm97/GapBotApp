import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/BookPrice.css";
import { Helmet } from "react-helmet-async";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const BookPrice = () => {
  const [activeTab, setActiveTab] = useState("price");
  const [booksPrice, setBooksPrice] = useState({});
  const [selectedItems, setSelectedItems] = useState([]); // 다중 선택
  const [chartData, setChartData] = useState({});
  const [alert, setAlert] = useState(null); // {message, type, position}
  const alertTimeoutRef = useRef(null);

  // 세션 스토리지 캐시 관련
  const CACHE_KEY = "booksPrice";
  const CACHE_TIME_KEY = "booksPriceTime";
  const CACHE_UPDATE_DATE = "booksPriceLastUpdate";
  const CACHE_DURATION = 60 * 1000; // 1분

  const fetchBookData = async () => {
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    const cachedTime = sessionStorage.getItem(CACHE_TIME_KEY);
    const expire = Date.now();

    if (cachedData && cachedTime && expire - Number(cachedTime) < CACHE_DURATION) {
      setBooksPrice(JSON.parse(cachedData));
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/price/book`
      );
      if (response.status === 200) {
        const data = response.data.booksPrice || {};
        setBooksPrice(data);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        sessionStorage.setItem(CACHE_TIME_KEY, String(expire));

        const now = new Date();
        const yyyy = now.getFullYear();
        const MM = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const HH = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");

        sessionStorage.setItem(
          CACHE_UPDATE_DATE,
          `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
        );
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  // 각 item 차트 데이터 여러개 관리
  const fetchChartData = async (itemName) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/price/book/chart?item=${encodeURIComponent(
          itemName
        )}`
      );
      if (response.status === 200) {
        setChartData((prev) => ({ ...prev, [itemName]: response.data.itemData }));
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // 아이템 선택 / 해제 함수
  const handleItemToggle = (itemName, event) => {
    event.preventDefault();
    const btnRect = event.currentTarget.getBoundingClientRect();

    // 메시지 위치 계산 (버튼 위쪽 중앙, 화면 밖 나가지 않도록)
    let top = btnRect.top - 40;
    let left = btnRect.left + btnRect.width / 2;
    if (top < 10) top = btnRect.bottom + 10;
    if (left < 10) left = 10;
    if (left > window.innerWidth - 150) left = window.innerWidth - 150;

    const isSelected = selectedItems.includes(itemName);
    let newSelected;

    if (isSelected) {
      // 제거
      newSelected = selectedItems.filter((name) => name !== itemName);
      setAlert({ message: `${itemName} 제거됨`, type: "remove", position: { top, left } });
    } else {
      // 추가
      newSelected = [...selectedItems, itemName];
      setAlert({ message: `${itemName} 추가됨`, type: "add", position: { top, left } });
      fetchChartData(itemName);
    }

    setSelectedItems(newSelected);

    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = setTimeout(() => setAlert(null), 1800);
  };

  useEffect(() => {
    fetchBookData();
  }, []);

  // 차트 옵션
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

  // 선택된 아이템들에 대한 차트 데이터셋 생성
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

  // X축 레이블 (최대한 모든 날짜 통합해서 사용)
  const allDates = Array.from(
    new Set(
      selectedItems.flatMap(
        (itemName) => chartData[itemName]?.map((d) => d.date) || []
      )
    )
  ).sort();

  return (
    <div className="container-patch">
      <Helmet>
        <title>유각시세 | LOAGAP</title>
        <meta name="description" content="LOAGAP 유각시세, 유각차트" />
        <meta name="keywords" content="빈틈봇, 유각시세, 유각차트" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <h2>유각 시세 / 차트</h2>

      {/* 탭 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          margin: "1rem 0",
        }}
      >
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

      {activeTab === "price" && (
        <div className="price-table-container">
          <div
            style={{ textAlign: "center", marginBottom: "1rem", color: "#555" }}
          >
            기준일자 :{" "}
            {new Date(new Date().setDate(new Date().getDate() - 1))
              .toISOString()
              .slice(0, 10)}
            <p>
              ※ 변동가격은 기준일자 0시 기준으로 계산된 값이며,
              차트에 추가하거나 제거할 수 있습니다.
            </p>
            <br />
            <p>last update {sessionStorage.getItem(CACHE_UPDATE_DATE)}</p>
          </div>
          <table className="price-table">
            <thead>
              <tr>
                <th>각인서 이름</th>
                <th>현재가격</th>
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
                      <td>{item.name}</td>
                      <td>{item.price.toLocaleString()}</td>
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
                        {Math.abs(item.diffPrice).toLocaleString()} ({item.percent}
                        %)
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
                          aria-pressed={isSelected}
                          aria-label={`${item.name} ${
                            isSelected ? "제거" : "추가"
                          } 버튼`}
                        >
                          {isSelected ? "−" : "+"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4}>데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "chart" && selectedItems.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <Line
            data={{
              labels: allDates,
              datasets: datasets,
            }}
            options={chartOptions}
          />
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
    </div>
  );
};

export default BookPrice;
