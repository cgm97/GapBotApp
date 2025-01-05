import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/MyPage.css';

const MyPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [roomCode, setRoomCode] = useState('');
    const [userCode, setUserCode] = useState('');
    const [nickName, setNickName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, resetToken } = useUserContext(); // Context에서 사용자 정보 가져오기
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.post(
                    process.env.REACT_APP_SERVER_URL + '/user/mypage',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setUserInfo(response.data); // 사용자 정보 저장
                setRoomCode(response.data.roomCode);
                setUserCode(response.data.userCode);
                setNickName(response.data.nickName);
            } catch (err) {
                setError('사용자 정보를 가져오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
    
        if (token) {
            fetchUserInfo(); // 함수 호출
        } else {
            navigate("/login");
        }
    }, [token, navigate]); // `fetchUserInfo` 제거

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleSave = async (e) => {
        e.preventDefault(); // 폼 기본 동작 방지
        try {
            setLoading(true); // 저장 중 상태
            const response = await axios.post(
                process.env.REACT_APP_SERVER_URL + '/user/save',
                {
                    email: userInfo.email,
                    nickName: nickName,
                    roomCode: roomCode,
                    userCode: userCode,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            resetToken(response.data.token) // 내정보 수정시 토큰 재발급
            setUserInfo(response.data.userInfo); // 최신 정보로 업데이트
            setIsSuccess(true);
        } catch (err) {
            setError('사용자 정보를 저장하는데 실패했습니다.');
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
                    <button type="submit" className="button">
                        저장
                    </button>
                </div>
            </form>
            {/* 회원가입 성공 모달 */}
            {isSuccess && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>내정보 수정</h2>
                        {userInfo.email}
                        <p>성공적으로 완료되었습니다.</p><br />
                        <button onClick={handleModalClose} className="login-button">확인</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPage;
