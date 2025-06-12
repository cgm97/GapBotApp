'use client';

import { useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";
import Link from 'next/link';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('패스워드가 일치하지 않습니다.');
      return;
    }

    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    const data = { email, password };
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/register`, data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        setIsSuccess(true);
        setError('');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setError(error.response.data.message);
        } else {
          setError('서버 오류: ' + error.response.status);
        }
      } else {
        setError('네트워크 오류: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    router.push('/login');
  };

  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-[600px] p-6 rounded-lg shadow-lg bg-white text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">회원가입</h2>
        <form onSubmit={handleSubmit} className="text-left space-y-4">
          <div className="space-y-1 pr-6">
            <label htmlFor="email" className="block text-gray-600 font-medium">Email</label>
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
          <div className="space-y-1 pr-6">
            <label htmlFor="password" className="block text-gray-600 font-medium">Password</label>
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
          <div className="space-y-1 pr-6">
            <label htmlFor="confirmPassword" className="block text-gray-600 font-medium">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-base transition"
            disabled={isLoading}
          >
            {isLoading ? '처리중...' : '회원가입'}
          </button>

          <div className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-black underline hover:text-blue-600">
              로그인
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        {isSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg text-center shadow-xl max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-2">회원가입 성공!</h2>
              <p className="text-gray-700 mb-2">{email}님, 가입이 완료되었습니다!</p>
              <p className="text-gray-500 text-sm mb-4">
                인증메일이 발송되었습니다. 이메일을 확인하고 인증을 완료해주세요.
                <br />
                인증 메일을 받지 못한 경우, 스팸 메일함을 확인해주세요.
              </p>
              <button
                onClick={handleModalClose}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-base transition"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
