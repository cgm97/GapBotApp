import React, { useEffect } from "react";
import './App.css';
import ProtectedRoute from "./context/ProtectedRoute";
import Header from './components/Header';
import Top from './components/Top';
import VerifyEmail from './components/VerifyEmail';
import MainPages from './dom/MainPages';
import Command from './dom/Command';
import CalendarUI from './dom/CalendarUI';
import Login from './dom/Login';
import Register from './dom/Register';
import PatchNote from './dom/PatchNote';
import Cube from './dom/Cube';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyPage from "./dom/MyPage";

function App() {
  useEffect(() => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      document.body.appendChild(script);
    
      return () => {
        // 컴포넌트 언마운트 시 스크립트를 제거
        document.body.removeChild(script);
      };
    }, []);
  return (
    <Router>
      <div className="wrapper">
        <div className="advertise left">
        <ins
          className="kakao_ad_area"
          style={{ display: 'none' }}
          data-ad-unit = "DAN-Qnq0ez9rvfuNOCVh"
          data-ad-width = "160"
          data-ad-height = "600">
        </ins>
        </div>
        <div className="content">
          <Top />
          <Header />
          <Routes>
            <Route path="/" element={<MainPages />} />
            <Route path="/login" element={<div className="centered"><Login /></div>} />
            <Route path="/register" element={<div className="centered"><Register /></div>} />
            <Route path="/cmd" element={<Command />} />
            <Route path="/character" element={<div>전투정보실</div>} />
            <Route path="/patchNote" element={<PatchNote />} />
            <Route path="/verifyEmail" element={<VerifyEmail />} />

            {/* Protected Routes */}
            <Route
              path="/mypage"
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todo"
              element={
                // <ProtectedRoute>
                  <div>숙제</div>
                // </ProtectedRoute>
              }
            />
            <Route
              path="/cube"
              element={<Cube />}
            />
            <Route
              path="/calendar"
              element={
                // <ProtectedRoute>
                  <CalendarUI />
                // </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        <div className="advertise right">
        <ins
          className="kakao_ad_area"
          style={{ display: 'none' }}
          data-ad-unit = "DAN-sj5267WiC2Xirn0q"
          data-ad-width = "160"
          data-ad-height = "600">
        </ins>
        </div>
      </div>
    </Router>
  );
}

export default App;