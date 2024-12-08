import React from "react";
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Top from './components/Top';
import MainPages from './dom/MainPages';
import Command from './dom/Command';
import CalendarUI from './dom/CalendarUI';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

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
        <Route path="/cmd" element={<Command />} />
        <Route path="/character" element={<div>전투정보실</div>} />
        <Route path="/homework" element={<div>숙제</div>} />
        <Route path="/calendar" element={<CalendarUI />} />
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