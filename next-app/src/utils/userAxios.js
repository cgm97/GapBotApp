import axios from 'axios';

const userAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 쿠키 사용
});

// 요청 인터셉터
userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
userAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                // Access Token 만료 시 새로운 토큰을 받기 위한 요청
                const response = await userAxios.post('/user/refresh');

                // 세션에 새로 발급된 토큰 저장
                localStorage.setItem('token', response.data.token);

                // 원래 요청에 새로운 토큰을 갱신하여 재시도
                error.config.headers['Authorization'] = `Bearer ${response.data.token}`;
                return userAxios.request(error.config); // 원래 요청을 새 토큰으로 재시도
            } catch (refreshError) {
                // Refresh Token 만료 처리
                if(refreshError.response && refreshError.response.status === 403){
                    localStorage.removeItem('token');
                    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                    window.location.href = '/login'; // 로그인 페이지로 이동
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default userAxios;
