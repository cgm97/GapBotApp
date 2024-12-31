import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../css/Login.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Basic validation
        if (password !== confirmPassword) {
            setError('패스워드가 일치하지 않습니다.');
            return;
        }

        if (!email || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        // Dummy validation for demonstration
        // Replace this with actual API call to register the user
        setSuccess('Registration successful! You can now log in.');
        setError(''); // Clear any previous error
    };

    return (
        <div className="login-container">
            <h2>회원가입</h2>
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
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                    />
                </div>
                <button type="submit" className="login-button">Register</button>
                <div className="register-link">
                    <p>Already have an account? <Link to="/login" style={{ color: "black" }}>로그인</Link></p>
                </div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </form>
        </div>
    );
};

export default Register;
