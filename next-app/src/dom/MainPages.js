'use client'; // 클라이언트 컴포넌트로 선언

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Island from '@/components/Island';
import KakaoAdFit from '@/components/KakaoAdFit';
import AdSense from '@/components/Adsense';

const MainPages = () => {
  const [noticeData, setNoticeData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [patchNoteData, setPatchNoteData] = useState([]);


  // 클라이언트 환경변수
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const storedData = sessionStorage.getItem('notice');
    if (storedData) {
      setNoticeData(JSON.parse(storedData));
    } else {
      axios.get(`${SERVER_URL}/api/notice`)
        .then(res => {
          setNoticeData(res.data);
          sessionStorage.setItem('notice', JSON.stringify(res.data));
        })
        .catch(console.error);
    }
  }, [SERVER_URL]);

  useEffect(() => {
    const storedData = sessionStorage.getItem('event');
    if (storedData) {
      setEventData(JSON.parse(storedData));
    } else {
      axios.get(`${SERVER_URL}/api/event`)
        .then(res => {
          setEventData(res.data);
          sessionStorage.setItem('event',JSON.stringify(res.data));
        })
        .catch(console.error);
    }
  }, [SERVER_URL]);

  useEffect(() => {
    const storedData = sessionStorage.getItem('patchNote');
    if (storedData) {
      setPatchNoteData(JSON.parse(storedData));
    } else {
      axios.get(`${SERVER_URL}/api/patchNote`)
        .then(res => {
          setPatchNoteData(res.data);
          sessionStorage.setItem('patchNote', JSON.stringify(res.data));
        })
        .catch(console.error);
    }
  }, [SERVER_URL]);

  return (
    <>
      <Island />

      <div className="ad-content dark:bg-gray-500">
        {/* <KakaoAdFit unit="DAN-lOG6HPbp08gmb26g" width={728} height={90} disabled={true} /> */}
        <AdSense adSlot="1488834693" />
      </div>

      <div className="notice">
        <div className="content dark:bg-gray-500">
          <h4>로스트아크 공지사항</h4>
          <ul>
            {noticeData?.slice(0, 20).map((notice, idx) => (
              <li key={idx} className="truncate-text">
                <a href={notice.URL} className="link-style" target="_blank" rel="noopener noreferrer">
                  [{notice.TYPE}] {notice.TITLE}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="content dark:bg-gray-500">
          <h4>빈틈봇 패치노트</h4>
          <ul>
            {patchNoteData?.slice(0, 20).map((patchNote) => (
              <li key={patchNote.SNO} className="truncate-text">
                <Link href="/patchnote" className="link-style">
                  {patchNote.TITLE}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="content dark:bg-gray-500">
          <h4>로스트아크 이벤트</h4>
          <ul>
            {eventData?.map((event, idx) => (
              <li key={idx} className="truncate-text">
                <a href={event.URL} className="link-style" target="_blank" rel="noopener noreferrer">
                  <img src={event.IMG_URL} alt={event.TITLE} className="image" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MainPages;
