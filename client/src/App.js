import React from "react";
import './App.css';
import ProtectedRoute from "./context/ProtectedRoute";
import Header from './components/Header';
import Top from './components/Top';
import MainPages from './dom/MainPages';
import Command from './dom/Command';
import CalendarUI from './dom/CalendarUI';
import Login from './dom/Login';
import Register from './dom/Register';
import PatchNote from './dom/PatchNote';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="wrapper">
        <div className="advertise left">
          <p>왼쪽 광고 영역</p>
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
            {/* Protected Routes */}
            <Route
              path="/mypage"
              element={
                <ProtectedRoute>
                  <div>마이페이지</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/todo"
              element={
                <ProtectedRoute>
                  <div>숙제</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cube"
              element={
                <ProtectedRoute>
                  <div>큐브</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarUI />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        <div className="advertise right">
          <p>오른쪽 광고 영역</p>
        </div>
      </div>
    </Router>
  );
}

export default App;