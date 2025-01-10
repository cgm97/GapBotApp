import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleSubmit = async (event) => {
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

        const data = {
            email: email,
            password: password
        };

        // 로딩 시작
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/user/register', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // 회원가입 성공 시 처리
            if (response.status === 201) {
                setError('');
                setIsSuccess(true); // 회원가입 성공 표시
            }

        } catch (error) {
            if (error.response) {
                // 서버 응답이 있는 경우 (4xx, 5xx 상태 코드)
                if (error.response.status === 409) {
                    setError(error.response.data.message);
                } else {
                    setError('서버 오류: ' + error.response.status);
                }
            } else {
                // 네트워크 오류 또는 서버에서 응답이 없는 경우
                setError('네트워크 오류: ' + error.message);
            }
        } finally {
            // 로딩 끝
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        navigate('/login'); // 로그인 페이지로 리디렉션
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
                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? '처리중...' : '회원가입'}
                </button>
                <div className="register-link">
                    <p>Already have an account? <Link to="/login" style={{ color: "black" }}>로그인</Link></p>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
            {/* 회원가입 성공 모달 */}
            {isSuccess && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>회원가입 성공!</h2>
                        <p>{email}님, 가입이 완료되었습니다!</p>
                        <p>인증메일이 발송되었습니다. 이메일을 확인하고 인증을 완료해주세요.</p><br />
                        <p>인증 메일을 받지 못한 경우, 스팸 메일함을 확인해주세요.</p>
                        <button onClick={handleModalClose} className="login-button">확인</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
