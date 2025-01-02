import React, { useState } from "react";
import axios from 'axios';
import { Link , useNavigate } from 'react-router-dom';
import { useUserContext } from "../context/UserContext";
import '../css/Login.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // useNavigate 훅 사용
    const { login } = useUserContext(); // Context에서 login 함수 가져오기

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const data = {
            email: email,
            password: password
        };
    
        try {
            const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/user/login', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        
            // 로그인 성공 시 처리
            if (response.status === 200) {
                setError('');
                // sessionStorage.setItem('token', response.data.token);
                // sessionStorage.setItem('email', response.data.email);
                const token = response.data.token; // 서버에서 반환된 JWT 토큰
                const userData = response.data.email ; // 필요하면 서버에서 사용자 정보를 더 받아와서 추가
                login(userData, token); // Context에 로그인 정보 저장
                navigate("/"); // 로그인 후 메인 페이지로 이동
            }
        
        } catch (error) {
            if (error.response) {
                // 서버 응답이 있는 경우 (4xx, 5xx 상태 코드)
                if (error.response.status === 401) {
                    setError(error.response.data.message);
                } else {
                    setError('서버 오류: ' + error.response.status);
                }
            } else {
                // 네트워크 오류 또는 서버에서 응답이 없는 경우
                setError('네트워크 오류: ' + error.message);
            }
        }
    };

    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
                <div className="register-link">
                    <p>Don't have an account? <Link to="/register" style={{ color: "black" }}>회원가입</Link></p>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
