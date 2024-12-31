import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../css/Login.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Dummy validation for demonstration
        if (email === 'admin@naver.com' && password === '1234') {
            alert('Login successful!');
        } else {
            setError('Invalid email or password');
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
