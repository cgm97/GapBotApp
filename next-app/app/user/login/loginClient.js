'use client';

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import Link from 'next/link';

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
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setError("");
        const token = response.data.token;
        const userData = response.data.email;
        const userCode = response.data.userCode;
        const roomCode = response.data.roomCode;
        login(userData, token, userCode, roomCode);
        router.push("/");
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
    <div className="flex justify-center items-center py-8">
      <div className="w-[600px] p-5 rounded-lg shadow-lg bg-white text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">로그인</h2>
        <form onSubmit={handleSubmit} className="text-left space-y-4">
          <div className="space-y-1 pr-6">
            <label htmlFor="email" className="block text-gray-600 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1 pr-6" >
            <label htmlFor="password" className="block text-gray-600 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-base transition"
          >
            로그인
          </button>
          <div className="text-center text-sm text-gray-600 mt-2">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-black underline hover:text-blue-600">회원가입</Link>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
