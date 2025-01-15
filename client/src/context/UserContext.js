import React, { createContext, useContext, useState, useEffect  } from "react";
import axios from 'axios';

// Context 생성
export const UserContext = createContext();

// Context Provider
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 사용자 정보 상태
    // const [token, setToken] = useState(null); // 토큰 상태

    // 로그인 정보 동기화
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        const storedToken = sessionStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(storedUser); // 저장된 user 값을 객체로 변환
            // setToken(storedToken);
        }
    }, []);

    const login = (userData, tokenData) => {
        setUser(userData);
        // setToken(tokenData);
        sessionStorage.setItem("user", userData); // 브라우저에 저장
        sessionStorage.setItem("token", tokenData);
    };

    const logout = () => {
        handleLogout();
    };

    const resetToken = (tokenData) => {
        // setToken(tokenData);
        sessionStorage.setItem("token", tokenData);
    };

    const handleLogout = async () => {
        try {
          // 서버에 로그아웃 요청
          await axios.post(process.env.REACT_APP_SERVER_URL+'/user/logout', {}, { withCredentials: true });
      
          setUser(null);
          // setToken(null);
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("token");

        } catch (error) {
          console.error('로그아웃 실패:', error);
        }
      };

    return (
        <UserContext.Provider value={{ user, login, logout, resetToken }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom Hook
export const useUserContext = () => useContext(UserContext);
