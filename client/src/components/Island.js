import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../App.css';
import '../css/Island.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

const Island = () => {
  const [activeDay, setActiveDay] = useState(null);
  const [content, setContent] = useState({});
  const [data, setData] = useState(null);
  const [daysWithDate, setDaysWithDate] = useState([]);

  // API 데이터 호출
  useEffect(() => {
    const storedData = sessionStorage.getItem('island');

    if (storedData) {
      // sessionStorage에서 데이터를 불러온 경우
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
    } else {
      // sessionStorage에 데이터가 없는 경우 API 호출
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/island')
        .then((response) => {
          setData(response.data);
          sessionStorage.setItem('island', JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("API 호출 오류:", error);
        });
    }
  }, []);

  // BASE_DATE 기준으로 daysWithDate 계산
  useEffect(() => {
    if (data && data.length > 0) {
      const baseDate = data[0]?.BASE_DATE;  // 예시로 첫 번째 데이터에서 BASE_DATE 추출
      if (baseDate) {
        const baseDateObj = new Date(
          baseDate.slice(0, 4),
          baseDate.slice(4, 6) - 1,  // 월은 0부터 시작하므로 -1
          baseDate.slice(6, 8)
        );

        const newDaysWithDate = Array.from({ length: 7 }, (_, i) => {
          const day = new Date(baseDateObj);
          day.setDate(day.getDate() + i);  // baseDate를 기준으로 i일을 더해줌
          const month = String(day.getMonth() + 1).padStart(2, '0');
          const dayOfMonth = String(day.getDate()).padStart(2, '0');
          const dateFormatted = `${month}/${dayOfMonth}`;
          const dayOfWeek = day.toLocaleString('default', { weekday: 'short' });

          return { day: dayOfWeek, date: dateFormatted };
        });

        setDaysWithDate(newDaysWithDate);  // 계산된 날짜들을 상태에 저장
      }
    }
  }, [data]);  // 의존성 배열에 data 추가 (data가 변경될 때마다 실행)

  // 오늘 날짜를 activeDay로 설정
  useEffect(() => {
    if (daysWithDate.length > 0) {
      const today = new Date();
      const todayDateFormatted = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

      // 오늘 날짜를 daysWithDate에서 찾아서 activeDay로 설정
      const todayDay = daysWithDate.find(({ date }) => date === todayDateFormatted);
      if (todayDay) {
        setActiveDay(todayDay.date);  // 오늘 날짜를 활성화된 상태로 설정
      }
    }
  }, [daysWithDate]);  // daysWithDate가 변경될 때마다 실행

  // content 업데이트
  useEffect(() => {
    if (data && daysWithDate.length > 0) {
      const newContent = daysWithDate.reduce((acc, { date }) => {
        // 해당 날짜에 맞는 모든 아이템을 찾기
        const matchingItems = data.filter(item => {
          const baseDateFormatted = item.BASE_DATE.slice(4, 6) + '/' + item.BASE_DATE.slice(6, 8);  // BASE_DATE를 MM/DD로 변환
          return baseDateFormatted === date;
        });

        // 찾은 아이템들을 content에 추가
        if (matchingItems.length > 0) {
          acc[date] = matchingItems;
        } else {
          acc[date] = [{}]; // 해당 날짜에 데이터가 없으면 기본 메시지
        }

        return acc;
      }, {});

      setContent(newContent);
    }
  }, [data, daysWithDate]);  // data와 daysWithDate가 변경될 때마다 실행

  return (
    <div className="calendar">
      <div className="calendar-days">
        {daysWithDate.map(({ day, date }) => (
          <div
            key={date}
            className={`day ${activeDay === date ? "active" : ""}`}
            onClick={() => setActiveDay(date)}
          >
            <div className="day-date">{date}</div>
            <div className="day-name">{day}</div>
          </div>
        ))}
      </div>
      <div className="islandContent">
        {activeDay && (
          Object.entries(
            content[activeDay].reduce((groups, island) => {
              const { TIME_TYPE } = island;
              if (!groups[TIME_TYPE]) groups[TIME_TYPE] = [];
              groups[TIME_TYPE].push(island);
              return groups;
            }, {})
          ).map(([timeType, islands]) => {
            // 중복 제거한 START_TIME 추출
            const uniqueStartTimes = [
              ...new Set(
                islands
                  .map((island) => {
                    // START_TIME이 배열일 경우, 배열의 각 항목을 처리하고 trim() 적용
                    if (Array.isArray(island.START_TIME)) {
                      return island.START_TIME.map((time) => typeof time === 'string' ? time.trim() : '')
                    }
                    return [];
                  })
                  .flat()  // 중첩된 배열을 평탄화
                  .filter((time) => time !== '') // 빈 문자열 제거
              )
            ];

            return (
              <div className="time-group" key={timeType}>
                {/* TIME_TYPE 헤더 및 START_TIME 표시 */}
                <h3 className="time-header">
                  {uniqueStartTimes.map((time, index) => (
                    <div key={index} className="time-box">
                      {time}
                    </div>
                  ))}
                </h3>

                {/* TIME_TYPE에 해당하는 Island 리스트 */}
                <div className="island-list">
                  {islands.map((island, index) => (
                    <div className="list-item" key={index}>
                      <img src={island.IMG_URL} alt={island.NAME} className="image" />
                      <p className="name">
                        [{island.BONUS_REWARD_TYPE}] {island.NAME}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>




    </div>
  );
};

export default Island;
