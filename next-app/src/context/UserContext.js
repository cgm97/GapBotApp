'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      const storedToken = sessionStorage.getItem('token');

      if (storedUser && storedToken) {
        setUser(storedUser); // JSON 문자열이라면 JSON.parse(storedUser) 가능
      }
    } catch (error) {
      console.error('sessionStorage 데이터 읽기 오류:', error);
    }
  }, []);

  const login = (userData, tokenData) => {
    setUser(userData);
    sessionStorage.setItem('user', userData);
    sessionStorage.setItem('token', tokenData);
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setUser(null);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    }
  };

  const resetToken = (tokenData) => {
    sessionStorage.setItem('token', tokenData);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, resetToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext는 UserProvider 내부에서만 사용해야 합니다.');
  }
  return context;
};
