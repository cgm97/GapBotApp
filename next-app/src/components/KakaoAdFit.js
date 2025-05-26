"use client";

import { useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom"; // 삭제
import { usePathname } from "next/navigation";  // 추가

const KakaoAdFit = ({ unit, width, height, disabled }) => {
  const adContainer = useRef(null);
  const location = usePathname(); // 현재 위치를 추적

  useEffect(() => {
    console.log("useEffect 실행됨"); // useEffect가 실행되었는지 확인

    if (!disabled) {
      console.log("광고 비활성화됨");
      return; // 광고 비활성화 시 return
    }

    // 중복된 스크립트 로드 방지
    // if (!document.querySelector("script[src='https://t1.daumcdn.net/kas/static/ba.min.js']")) {
    document.querySelector("script[src='https://t1.daumcdn.net/kas/static/ba.min.js']")
      const script = document.createElement("script");
      script.src = "https://t1.daumcdn.net/kas/static/ba.min.js";
      script.async = true;

      // script.onload 이벤트 추가
      script.onload = () => {
        // console.log("카카오 애드핏 스크립트 로드 완료");
        
        // window.kakao와 window.kakao.adfit이 존재하는지 확인한 후 호출
        if (window.kakao && window.kakao.adfit) {
          // console.log("window.kakao.adfit 존재");
          window.kakao.adfit.push({}); // 광고를 표시하는 코드
        } else {
          // console.log("window.kakao.adfit이 존재하지 않음");
        }
      };

      script.onerror = () => {
        console.error("카카오 애드핏 스크립트 로드 실패");
      };

      document.body.appendChild(script); // <body>에 스크립트 추가
    
      // console.log("카카오 애드핏 스크립트 이미 로드됨");
      // 스크립트가 이미 로드되어 있으면 바로 광고를 표시
      if (window.kakao && window.kakao.adfit) {
        window.kakao.adfit.push({});
      } else {
        console.log("window.kakao.adfit이 존재하지 않음");
      }
  

    return () => {
      // console.log("클린업 함수 실행됨");
      if (adContainer.current) {
        adContainer.current.innerHTML = "";
      }
    };
  }, [disabled, unit]); // 의존성 배열에 disabled, unit 포함

  useEffect(() => {
    // console.log("라우트 변경 시 광고 초기화 시도");
    if (adContainer.current) {
      const adIns = adContainer.current.querySelector("ins");
      if (adIns) {
        // 광고가 로드되었는지 확인 후 다시 갱신
        // console.log("광고 요소가 존재합니다. 강제로 업데이트");
        if (window.kakao && window.kakao.adfit) {
          window.kakao.adfit.push({});
        }
      }
    }
  }, [location]); // 라우트가 변경될 때마다 실행

  return (
    <div ref={adContainer}>
      <ins
        className="kakao_ad_area"
        style={{ display: "block" }}
        data-ad-unit={unit}
        data-ad-width={width}
        data-ad-height={height}
      ></ins>
    </div>
  );
};

export default KakaoAdFit;
