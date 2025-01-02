import React, { createContext, useContext, useState } from "react";

// Context 생성
export const UserContext = createContext();

// Context Provider
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 사용자 정보 상태
    const [token, setToken] = useState(null); // 토큰 상태

    // 로그인 정보 동기화
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        const storedToken = sessionStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser)); // 저장된 user 값을 객체로 변환
            setToken(storedToken);
        }
    }, []);

    const login = (userData, tokenData) => {
        setUser(userData);
        setToken(tokenData);
        sessionStorage.setItem("user", userData); // 브라우저에 저장
        sessionStorage.setItem("token", tokenData);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{ user, token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom Hook
export const useUserContext = () => useContext(UserContext);
