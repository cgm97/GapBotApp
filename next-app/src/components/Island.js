import React, { useState, useEffect } from "react";
import axios from "axios";
import '@/css/App.css';
import "@/css//Island.css";

const Island = () => {
  const [activeDay, setActiveDay] = useState(null);
  const [content, setContent] = useState({});
  const [data, setData] = useState(null);
  const [daysWithDate, setDaysWithDate] = useState([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("island");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
    } else {
      axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL + "/api/island")
        .then((response) => {
          setData(response.data);
          sessionStorage.setItem("island", JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("API 호출 오류:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      const baseDate = data[0]?.BASE_DATE;
      if (baseDate) {
        const baseDateObj = new Date(
          baseDate.slice(0, 4),
          baseDate.slice(4, 6) - 1,
          baseDate.slice(6, 8)
        );

        const newDaysWithDate = Array.from({ length: 7 }, (_, i) => {
          const day = new Date(baseDateObj);
          day.setDate(day.getDate() + i);
          const month = String(day.getMonth() + 1).padStart(2, "0");
          const dayOfMonth = String(day.getDate()).padStart(2, "0");
          const dateFormatted = `${month}/${dayOfMonth}`;
          const dayOfWeek = day.toLocaleString("default", { weekday: "short" });

          return { day: dayOfWeek, date: dateFormatted };
        });

        setDaysWithDate(newDaysWithDate);
      }
    }
  }, [data]);

  useEffect(() => {
    if (daysWithDate.length > 0) {
      const today = new Date();
      const todayDateFormatted = `${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(today.getDate()).padStart(2, "0")}`;

      const todayDay = daysWithDate.find(({ date }) => date === todayDateFormatted);
      if (todayDay) {
        setActiveDay(todayDay.date);
      }
    }
  }, [daysWithDate]);

  useEffect(() => {
    if (data && daysWithDate.length > 0) {
      const newContent = daysWithDate.reduce((acc, { date }) => {
        const matchingItems = data.filter((item) => {
          const baseDateFormatted =
            item.BASE_DATE.slice(4, 6) + "/" + item.BASE_DATE.slice(6, 8);
          return baseDateFormatted === date;
        });

        acc[date] = matchingItems.length > 0 ? matchingItems : [{}];

        return acc;
      }, {});

      setContent(newContent);
    }
  }, [data, daysWithDate]);

  return (
    <div className="calendar">
      <div className="calendar-days dark:bg-gray-500">
        {daysWithDate.map(({ day, date }) => (
          <div
            key={date}
            className={`day ${activeDay === date ? "active" : ""}`}
            onClick={() => setActiveDay(date)}
          >
            <div className={`day-date ${day === "토" || day === "일" ? "holiday" : ""} `}>
              {date}
            </div>
            <div className={`day-name ${day === "토" || day === "일" ? "holiday" : ""}`}>
              {day}
            </div>
          </div>
        ))}
      </div>
      <div className="islandContent dark:bg-gray-500">
        {activeDay &&
          Object.entries(
            content[activeDay].reduce((groups, island) => {
              const { TIME_TYPE } = island;
              if (!groups[TIME_TYPE]) groups[TIME_TYPE] = [];
              groups[TIME_TYPE].push(island);
              return groups;
            }, {})
          ).map(([timeType, islands]) => {
            const uniqueStartTimes = [
              ...new Set(
                islands
                  .map((island) => {
                    if (Array.isArray(island.START_TIME)) {
                      return island.START_TIME.map((time) =>
                        typeof time === "string" ? time.trim() : ""
                      );
                    }
                    return [];
                  })
                  .flat()
                  .filter((time) => time !== "")
              ),
            ];

            return (
              <div className="time-group" key={timeType}>
                <h3 className="time-header">
                  {uniqueStartTimes.map((time, index) => (
                    <div key={index} className="time-box dark:bg-gray-400">
                      {time}
                    </div>
                  ))}
                </h3>

                <div className="island-list">
                  {islands.map((island, index) => (
                    <div className="list-item dark:bg-gray-400" key={index}>
                      <img src={island.IMG_URL} alt={island.NAME} className="image" />
                      <p className="name">
                        [{island.BONUS_REWARD_TYPE}] {island.NAME}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Island;