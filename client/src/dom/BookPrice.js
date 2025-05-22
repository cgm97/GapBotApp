import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../css/BookPrice.css';
import { Helmet } from "react-helmet-async";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const BookPrice = () => {
  const [activeTab, setActiveTab] = useState("price");
  const [booksPrice, setBooksPrice] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [chartData, setChartData] = useState(null);

  // 실시간 시세 sessionStorage 담아서 관리
  const CACHE_KEY = "booksPrice";
  const CACHE_TIME_KEY = "booksPriceTime";
  const CACHE_UPDATE_DATE = "booksPriceLastUpdate";
  const CACHE_DURATION = 60 * 1000; // 1분

  const fetchBookData = async () => {
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    const cachedTime = sessionStorage.getItem(CACHE_TIME_KEY);
    const exprire = Date.now();

    if (cachedData && cachedTime && exprire - Number(cachedTime) < CACHE_DURATION) {
      setBooksPrice(JSON.parse(cachedData));
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/price/book`);
      if (response.status === 200) {
        const data = response.data.booksPrice || {};
        setBooksPrice(data);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        sessionStorage.setItem(CACHE_TIME_KEY, String(exprire));

        const now = new Date();
        const yyyy = now.getFullYear();
        const MM = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const HH = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');

        sessionStorage.setItem(CACHE_UPDATE_DATE, `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`);
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  const fetchChartData = async (itemName) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/price/book/chart?item=${encodeURIComponent(itemName)}`);
      if (response.status === 200) {
        setChartData(response.data.itemData);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const handleNameClick = (itemName) => {
    setSelectedItem(itemName);
    setActiveTab("chart");
    fetchChartData(itemName);
  };

  useEffect(() => {
    fetchBookData();
  }, []);

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
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "1rem 0" }}>
        <button onClick={() => setActiveTab("price")} className={activeTab === "price" ? "active" : ""}>
          시세
        </button>
        <button onClick={() => setActiveTab("chart")} className={activeTab === "chart" ? "active" : ""}>
          차트
        </button>
      </div>

      {activeTab === "price" && (
        <div className="price-table-container">
          <div style={{ textAlign: "center", marginBottom: "1rem", color: "#555" }}>
            <p>last update {sessionStorage.getItem(CACHE_UPDATE_DATE)}</p>
            기준 일자 : {new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10)}
            <p>※ 변동 금액은 기준일자 0시 기준으로 계산된 값이며, 각인서를 클릭시 차트를 보실 수 있습니다.</p>
          </div>
          <table className="price-table">
            <thead>
              <tr>
                <th>각인서 이름</th>
                <th>현재 가격 (실시간)</th>
                <th>변동 가격</th>
              </tr>
            </thead>
            <tbody>
              {booksPrice && Object.keys(booksPrice).length > 0 ? (
                Object.values(booksPrice).map((item) => (
                  <tr key={item.name}>
                    <td>
                      <button
                        style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
                        onClick={() => handleNameClick(item.name)}
                      >
                        {item.name}
                      </button>
                    </td>
                    <td>{item.price.toLocaleString()}</td>
                    <td style={{ color: item.diffPrice > 0 ? 'green' : item.diffPrice < 0 ? 'red' : 'gray' }}>
                      {item.diffPrice > 0 ? '▲' : item.diffPrice < 0 ? '▼' : '—'} {Math.abs(item.diffPrice).toLocaleString()} ({item.percent}%)
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">시세 정보를 불러오는 중입니다...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "chart" && selectedItem && (
        <div style={{ width: "100%", maxWidth: "800px", margin: "2rem auto" }}>
          <h3 style={{ textAlign: "center" }}>{selectedItem} 가격 추이</h3>
          {chartData ? (
            <Line
              data={{
                labels: chartData.map(item => item.date),
                datasets: [
                  {
                    label: `${selectedItem} 가격`,
                    data: chartData.map(item => item.price),
                    borderColor: "#007bff",
                    backgroundColor: "rgba(0, 123, 255, 0.1)",
                    tension: 0.3,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                  },
                ],
              }}
              options={chartOptions}
            />
          ) : (
            <p style={{ textAlign: "center" }}>차트 데이터를 불러오는 중입니다...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookPrice;