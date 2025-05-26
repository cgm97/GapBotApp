'use client';

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // next/navigation의 useRouter
import { useUserContext } from "@/context/UserContext"; 
import '@/css/Login.css'; // CSS 파일 (위에서 작성한 스타일을 참조)

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // 쿠키 포함
        }
      );

      if (response.status === 200) {
        setError("");
        const token = response.data.token;
        const userData = response.data.email;

        login(userData, token);
        router.push("/"); // Next.js 라우팅
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError(err.response.data.message);
        } else {
          setError("서버 오류: " + err.response.status);
        }
      } else {
        setError("네트워크 오류: " + err.message);
      }
    }
  };

  return (
<div className="login-container-wrapper">
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
          <button type="submit" className="login-button">
            로그인
          </button>
          <div className="register-link">
            <p>
              Don&apos;t have an account?{" "}
              <a href="/register" style={{ color: "black" }}>
                회원가입
              </a>
            </p>
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
 </div>
  );
}