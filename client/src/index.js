import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from "./context/UserContext"; // UserProvider 가져오기
import { HelmetProvider } from 'react-helmet-async'; // HelmetProvider import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // React.StrictMode 제거
  <HelmetProvider> 
  <UserProvider> 
    <App />
  </UserProvider>
  </HelmetProvider> 
);

// React.StrictMode 제거 _ 2024 12 25 두번 request 호출하여 제거
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
