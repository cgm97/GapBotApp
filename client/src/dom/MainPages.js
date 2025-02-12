import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios from 'axios';
import '../App.css'; // CSS 파일 (위에서 작성한 스타일을 참조)
import Island from '../components/Island';
import '../css/Command.css'; // CSS 파일 (위에서 작성한 스타일을 참조)
import { Link } from "react-router-dom";
import KakaoAdFit from "../components/KakaoAdFit";

const MainPages = () => {
  const [noticeData, setNoticeData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [patchNoteData, setPatchNoteData] = useState(null);

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.type = 'text/javascript';
  //   script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
  //   script.async = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     // 컴포넌트 언마운트 시 스크립트를 제거
  //     document.body.removeChild(script);
  //   };
  // }, []);

  // 공지사항 API 데이터 호출
  useEffect(() => {
    const storedData = sessionStorage.getItem('notice');

    if (storedData) {
      // sessionStorage에서 데이터를 불러온 경우
      const parsedData = JSON.parse(storedData);
      setNoticeData(parsedData);
    } else {
      // sessionStorage에 데이터가 없는 경우 API 호출
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/notice')
        .then((response) => {
          setNoticeData(response.data);
          sessionStorage.setItem('notice', JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("API 호출 오류:", error);
        });
    }
  }, []);

  // 이벤트 API 데이터 호출
  useEffect(() => {
    const storedData = sessionStorage.getItem('event');

    if (storedData) {
      // sessionStorage에서 데이터를 불러온 경우
      const parsedData = JSON.parse(storedData);
      setEventData(parsedData);
    } else {
      // sessionStorage에 데이터가 없는 경우 API 호출
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/event')
        .then((response) => {
          setEventData(response.data);
          sessionStorage.setItem('event', JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("API 호출 오류:", error);
        });
    }
  }, []);

  // 패치노트 API 데이터 호출
  useEffect(() => {
    const storedData = sessionStorage.getItem('patchNote');

    if (storedData) {
      // sessionStorage에서 데이터를 불러온 경우
      const parsedData = JSON.parse(storedData);
      setPatchNoteData(parsedData);
    } else {
      // sessionStorage에 데이터가 없는 경우 API 호출
      axios.get(process.env.REACT_APP_SERVER_URL + '/api/patchNote')
        .then((response) => {
          setPatchNoteData(response.data);
          sessionStorage.setItem('patchNote', JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("API 호출 오류:", error);
        });
    }
  }, []);

  return (
    <div>
      {/* SEO 메타 태그 */}
      {/* SEO 메타 태그 */}
      <Helmet>
        <title>LOAGAP</title>
        <meta name="description" content={`LOAGAP 메인페이지.`} />
        <meta name="keywords" content="빈틈봇, 메인페이지" />
        <meta name="robots" content="index, follow" />

        {/* JSON-LD 구조화 데이터 */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "빈틈봇, 메인페이지",
            "url": window.location.href,
            "description": `빈틈봇 메인페이지`,
            "game": {
              "@type": "VideoGame",
              "name": "Lost Ark"
            }
          })}
        </script>
      </Helmet>
      <Island />
      <div className="ad-content">
        <KakaoAdFit unit="DAN-lOG6HPbp08gmb26g" width={728} height={90} disabled={true} />
        {/* <ins
          className="kakao_ad_area"
          style={{ display: 'none' }}
          data-ad-unit="DAN-lOG6HPbp08gmb26g"
          data-ad-width="728"
          data-ad-height="90"
        ></ins> */}
      </div>
      <div className="notice">
        <div className="content">
          <h4>로스트아크 공지사항</h4>
          <ul>
            {noticeData && (
              noticeData.slice(0, 20).map((notice, index) => (
                <li key={index} className="truncate-text">
                  <a href={notice.URL} className="link-style" target="_blank" rel="noopener noreferrer">
                    [{notice.TYPE}] {notice.TITLE}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="content">
          <h4>빈틈봇 패치노트</h4>
          <ul>
            {patchNoteData && (
              patchNoteData.slice(0, 20).map((patchNote) => (
                <li key={patchNote.SNO} className="truncate-text">
                  <Link to="/patchNote" className="link-style"> {patchNote.TITLE} </Link>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="content">
          <h4>로스트아크 이벤트</h4>
          <ul>
            {eventData && (
              eventData.map((event, index) => (
                <li key={index} className="truncate-text">
                  <a href={event.URL} className="link-style" target="_blank" rel="noopener noreferrer">
                    {/* {event.TITLE} */}
                    <img src={event.IMG_URL} alt={event.TITLE} className="image" />
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainPages;