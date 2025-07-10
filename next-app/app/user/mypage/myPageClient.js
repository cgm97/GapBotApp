'use client'

import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import userAxios from '@/utils/userAxios'; // 로그인 유저 전용 Axios
import { useRouter } from "next/navigation";

const MyPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [roomCode, setRoomCode] = useState('');
    const [userCode, setUserCode] = useState('');
    const [nickName, setNickName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { resetToken, logout } = useUserContext();
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useRouter();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await userAxios.post('/user/mypage');
                setUserInfo(response.data);
                setRoomCode(response.data.roomCode ?? '');
                setUserCode(response.data.userCode ?? '');
                setNickName(response.data.nickName ?? '');
            } catch (error) {
                if (error.response?.status === 403) {
                    setError('로그인기한이 만료되어 로그아웃 되었습니다.');
                    logout();
                    navigate.push("/login");
                } else {
                    setError('사용자 정보를 가져오는 데 실패했습니다.');
                    logout();
                    navigate.push("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        if (localStorage.getItem("token")) {
            fetchUserInfo();
        }
    }, [navigate, logout]);

    if (loading) {
        return <div className="text-center text-lg py-8">로딩 중...</div>;
    }

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await userAxios.post(
                '/user/save',
                {
                    email: userInfo.email,
                    nickName,
                    roomCode,
                    userCode,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true
                }
            );
            resetToken(response.data.token);
            setUserInfo(response.data.userInfo);
            setIsSuccess(true);
        } catch (error) {
            if (error.response?.status === 409) {
                setError(error.response.data.message);
            } else if (error.response?.status === 403) {
                setError('로그인기한이 만료되어 로그아웃 되었습니다.');
                logout();
                navigate.push("/login");
            } else {
                setError('네트워크 오류: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setIsSuccess(false);
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
            <h2 className="text-2xl font-semibold mb-6 text-center">내 정보</h2>

            <form onSubmit={handleSave} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="space-y-1 pr-6" >
                    <input
                        type="email"
                        id="email"
                        value={userInfo?.email || ''}
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500 bg-gray-100"
                    />
                    </div>
                </div>

                <div>
                    <label htmlFor="character" className="block text-sm font-medium text-gray-700 mb-1">대표 캐릭터</label>
                    <div className="space-y-1 pr-6" >
                    <input
                        type="text"
                        id="character"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                        placeholder="로스트아크 본인 대표 캐릭터 닉네임"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                    </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    <p>카카오톡방에서 빈틈봇에게 <strong className="text-black">빈틈봇연동</strong> 입력</p>
                    <p>빈틈봇이 발급한 <strong className="text-black">채팅방 CODE / 유저 CODE</strong>를 입력하세요.</p>
                </div>

                <div>
                    <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-1">채팅방 CODE</label>
                    <div className="space-y-1 pr-6" >
                    <input
                        type="text"
                        id="roomCode"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        placeholder="빈틈봇이 발급해준 CODE"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                    </div>
                </div>

                <div>
                    <label htmlFor="userCode" className="block text-sm font-medium text-gray-700 mb-1">유저 CODE</label>
                    <div className="space-y-1 pr-6" >
                    <input
                        type="text"
                        id="userCode"
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        placeholder="빈틈봇이 발급해준 CODE 또는 명"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    저장
                </button>
            </form>

            {/* 성공 모달 */}
            {isSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg text-center max-w-sm w-full">
                        <h2 className="text-xl font-semibold mb-2">내정보 수정</h2>
                        <p className="mb-4">성공적으로 완료되었습니다.</p>
                        <button onClick={handleModalClose} className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">확인</button>
                    </div>
                </div>
            )}

            {/* 에러 모달 */}
            {error && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg text-center max-w-sm w-full">
                        <h2 className="text-xl font-semibold mb-2 text-red-600">내정보 수정</h2>
                        <p className="mb-4 text-gray-700">{error}</p>
                        <button onClick={() => setError('')} className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPage;
