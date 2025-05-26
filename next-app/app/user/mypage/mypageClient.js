'use client'

import { useEffect, useState } from "react";
import { useUserContext, } from "@/context/UserContext";
// import axios from "axios";
import api from '@/utils/api'; // 설정된 Axios 인스턴스
import { useRouter } from "next/navigation"; // next/navigation의 useRouter
import '@/css/MyPage.css';

const MyPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [roomCode, setRoomCode] = useState('');
    const [userCode, setUserCode] = useState('');
    const [nickName, setNickName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { resetToken, logout } = useUserContext(); // Context에서 사용자 정보 가져오기
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useRouter();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.post(
                    '/user/mypage',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                        withCredentials: true // 쿠키도 자동으로 포함되어 전송
                    }
                );
                setUserInfo(response.data); // 사용자 정보 저장
                setRoomCode(response.data.roomCode);
                setUserCode(response.data.userCode);
                setNickName(response.data.nickName);
            } catch (error) {
                if (error.response.status === 403) {
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

        if (sessionStorage.getItem("token")) {
            fetchUserInfo(); // 함수 호출
        }
    }, [navigate, logout]); // `fetchUserInfo` 제거

    if (loading) {
        return <div>로딩 중...</div>;
    }

    const handleSave = async (e) => {
        e.preventDefault(); // 폼 기본 동작 방지
        try {
            setLoading(true); // 저장 중 상태
            // const response = await axios.post(
            //     process.env.REACT_APP_SERVER_URL + '/user/save',
            //     {
            //         email: userInfo.email,
            //         nickName: nickName,
            //         roomCode: roomCode,
            //         userCode: userCode,
            //     },
            //     {
            //         headers: {
            //             Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            //         },
            //         withCredentials: true // 쿠키도 자동으로 포함되어 전송
            //     }
            // );
            const response = await api.post(
                '/user/save',
                {
                    email: userInfo.email,
                    nickName: nickName,
                    roomCode: roomCode,
                    userCode: userCode,
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    withCredentials: true // 쿠키도 자동으로 포함되어 전송
                }
            );
            resetToken(response.data.token) // 내정보 수정시 토큰 재발급
            setUserInfo(response.data.userInfo); // 최신 정보로 업데이트
            setIsSuccess(true);
        } catch (error) {
            if (error.response) {
                // 서버 응답이 있는 경우 (4xx, 5xx 상태 코드)
                if (error.response.status === 409) {
                    setError(error.response.data.message);
                } else if (error.response.status === 403) {
                    setError('로그인기한이 만료되어 로그아웃 되었습니다.');
                    logout();
                    navigate.push("/login");
                }
            } else {
                // 네트워크 오류 또는 서버에서 응답이 없는 경우
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
        <div className="user-profile-container">
            <h2>내 정보</h2>
            <form onSubmit={handleSave}>
                <div className="user-info">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={userInfo?.email || ''}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="character">대표 캐릭터</label>
                        <input
                            type="text"
                            id="character"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            placeholder="로스트아크 본인 대표 캐릭터 닉네임"
                            required
                        />
                    </div>

                    {/* CODE 그룹 섹션 시작 */}
                    <div className="code-section">
                        {/* 설명 문구 */}
                        <p>
                            카카오톡방에서 빈틈봇에게 <strong>'빈틈봇연동'</strong>을 입력하세요.
                        </p>
                        <p>
                            이후 빈틈봇이 발급한 <strong>채팅방CODE</strong>, <strong>유저CODE</strong>를 입력해주세요.
                        </p>
                        <div className="form-group">
                            <label htmlFor="roomCode">채팅방 CODE</label>
                            <input
                                type="text"
                                id="roomCode"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                placeholder="빈틈봇이 발급해준 CODE"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="userCode">유저 CODE</label>
                            <input
                                type="text"
                                id="userCode"
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value)}
                                placeholder="빈틈봇이 발급해준 CODE 또는 명"
                            />
                        </div>
                    </div>
                    {/* CODE 그룹 섹션 끝 */}

                    <button type="submit" className="button">
                        저장
                    </button>
                </div>
            </form>

            {/* 성공 메시지 모달 */}
            {isSuccess && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>내정보 수정</h2>
                        <p>성공적으로 완료되었습니다.</p>
                        <button onClick={handleModalClose} className="login-button">확인</button>
                    </div>
                </div>
            )}

            {/* 에러 메시지 모달 */}
            {error && (
                <div className="modal">
                    <div className="modal-content error">
                        <h2>내정보 수정</h2>
                        <p>오류가 발생하였습니다.</p>
                        <p>{error}</p>
                        <button onClick={() => setError('')} className="login-button">닫기</button>
                    </div>
                </div>
            )}
        </div>
    );

};

export default MyPage;
