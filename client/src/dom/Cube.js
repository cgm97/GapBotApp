import React, { useEffect, useState } from "react";
// import axios from "axios";
import api from '../utils/api'; // 설정된 Axios 인스턴스
import { useUserContext, } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import '../css/Cube.css'; // CSS 파일 (위에서 작성한 스타일을 참조)
import goldIcon from '../img/cube/gold.png';
import jewellery3Icon from '../img/cube/jewellery3.png';
import jewellery4Icon from '../img/cube/jewellery4.png';
import silingIcon from '../img/cube/siling.png';
import cardIcon from '../img/cube/card.png';
import solar1Icon from '../img/cube/solar1.png';
import solar2Icon from '../img/cube/solar2.png';
import solar3Icon from '../img/cube/solar3.png';
import solar4Icon from '../img/cube/solar4.png';
import solar5Icon from '../img/cube/solar5.png';
import stone3Icon from '../img/cube/stone3.png';
import stone4Icon from '../img/cube/stone4.png';
import { Helmet } from "react-helmet-async";

const Cube = () => {
  const [characterInfo, setCharacterInfo] = useState(null);
  const [cubeInfo, setCubeInfo] = useState(null);
  // const { token } = useUserContext(); // Context에서 사용자 정보 가져오기
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const { logout } = useUserContext(); // Context에서 사용자 정보 가져오기
  const navigate = useNavigate();

  // 저장 처리
  const handleSave = (characterIndex) => {

    // 저장 후 플래그 초기화
    setCharacterInfo((prevState) => {
      const newCharacterInfo = [...prevState];
      newCharacterInfo[characterIndex].isSaveEnabled = true;
      return newCharacterInfo;
    });

    if (sessionStorage.getItem("token")) {
      const saveCube = async () => {
        try {
          await api.post(
            '/cube/save',
            characterInfo[characterIndex],
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
              withCredentials: true // 쿠키도 자동으로 포함되어 전송
            });
        } catch (err) {
          if (err.response.status === 403) {
            setError('로그인기한이 만료되어 로그아웃 되었습니다.');
            logout();
            navigate("/login");
          } else {
            setError('사용자 정보를 가져오는 데 실패했습니다.');
            logout();
            navigate("/login");
          }
        } finally {
          setLoading(false);
        }
      };
      // db 저장처리
      saveCube();
    }
  };

  // 전체 큐브 보상아이템 합계 게산
  const calculateCubes = (cubes) => {
    const retReward = [];

    cubes.forEach(cube => {
      // cube.type과 일치하는 cubeInfo 찾기
      const cubeData = cubeInfo.find(info => info.NAME === cube.name);

      if (cubeData) {
        const { CARD_EXP, JEWELRY, JEWELRY_PRICE, STONES, SILLING, ETC1, ETC2, ETC3 } = cubeData;

        let totalCardExp = 0;
        let totalJewelry = 0;
        let totalJewelryPrice = 0;
        let totalStones = 0;
        let totalSelling = 0;
        let totalEtc1 = 0;
        let totalEtc2 = 0;
        let totalEtc3 = 0;

        // cube.count 만큼 반복하여 보상 계산
        for (let i = 0; i < cube.count; i++) {
          totalCardExp += CARD_EXP;
          totalJewelry += JEWELRY;
          totalJewelryPrice += JEWELRY_PRICE;
          totalStones += STONES;
          totalSelling += SILLING;
          totalEtc1 += ETC1;
          totalEtc2 += ETC2;
          totalEtc3 += ETC3;
        }

        // retReward 배열에 푸시
        retReward.push({
          name: cube.name,
          reward: {
            count: cube.count,
            cardExp: totalCardExp,
            jewelry: totalJewelry,
            jewelryPrice: totalJewelryPrice,
            stones: totalStones,
            selling: totalSelling,
            etc1: totalEtc1,
            etc2: totalEtc2,
            etc3: totalEtc3
          }
        });
      }
    });

    return retReward;
  };

  // 모든 캐릭의 총합
  function calculateTotalRewards(characterInfo) {
    let totalGold = 0;
    let totalSiling = 0;
    let totalCardExp = 0;
    let totalJewelry3Tier = 0;  // 금제 (3티어)
    let totalJewelry4Tier = 0;  // 해금 (4티어)

    characterInfo.forEach((character) => {
      const calculatedCubes = calculateCubes(character.CUBES); // 기존 calculateCubes 호출

      calculatedCubes.forEach((cube) => {
        totalGold += cube.reward.jewelryPrice;
        totalSiling += cube.reward.selling;
        totalCardExp += cube.reward.cardExp;

        // 후처리에서 cube.name에 따라 보석을 구분하여 합산
        if (cube.name.includes("금제")) {
          totalJewelry3Tier += cube.reward.jewelry;  // 금제 (3티어)
        } else if (cube.name.includes("해금")) {
          totalJewelry4Tier += cube.reward.jewelry;  // 해금 (4티어)
        }
      });
    });

    return {
      gold: totalGold,
      siling: totalSiling,
      cardExp: totalCardExp,
      jewelry3Tier: totalJewelry3Tier, // 금제 (3티어) 보석 합계
      jewelry4Tier: totalJewelry4Tier, // 해금 (4티어) 보석 합계
    };
  }

  // 보석 등급 계산 (1레벨 -> 최대한 레벨올리기)
  function calculatejewelryGrad(totalJewelry) {
    const levelRequirements = [1, 3, 9, 27, 81, 243, 729, 2187, 6561, 19683];
    const levelCounts = [];
    let remainingJewels = totalJewelry;

    for (let level = levelRequirements.length - 1; level >= 0; level--) {
      const requiredForNextLevel = levelRequirements[level];
      if (remainingJewels >= requiredForNextLevel) {
        const countForLevel = Math.floor(remainingJewels / requiredForNextLevel);
        levelCounts.push({ level: level + 1, count: countForLevel });
        remainingJewels -= countForLevel * requiredForNextLevel;
      }
    }

    return levelCounts;
  }

  // 수량 변경 처리
  const handleCountChange = (characterIndex, tierName, value) => {
    const newValue = Math.max(0, Number(value) || 0);

    setCharacterInfo((prevState) => {
      const newCharacterInfo = [...prevState];
      const character = newCharacterInfo[characterIndex];
      const cubeIndex = character.CUBES.findIndex((cube) => cube.name === tierName);
      console.log(character.CUBES);
      if (cubeIndex !== -1) {
        character.CUBES[cubeIndex].count = newValue;
      } else {
        character.CUBES[character.CUBES.length] = { name: tierName, count: newValue };
      }
      if (sessionStorage.getItem("token")) {
        character.isSaveEnabled = false; // 수정 시 무조건 저장 버튼 활성화
      }
      return newCharacterInfo;
    });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.post(
          '/cube',
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            withCredentials: true, // 쿠키 사용
          });
        setCharacterInfo(response.data.return.characterInfo); // 사용자 정보 저장
        setCubeInfo(response.data.return.cubeInfo)
      } catch (err) {
        if (err.response.status === 403) {
          setError('로그인기한이 만료되어 로그아웃 되었습니다.');
          logout();
          navigate("/login");
        } else {
          setError('사용자 정보를 가져오는 데 실패했습니다.');
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (sessionStorage.getItem("token")) {
      fetchUserInfo(); // 토큰이 있을 때만 사용자 정보 호출
    } else {
      // 임시 데이터로 설정
      setCharacterInfo([{
        "NICKNAME": "테스트1",
        "SERVER": "루페온",
        "JOB": "디스트로이어",
        "ITEM_LEVEL": 1680.83,
        "CUBES": [
          {
            "name": "1금제",
            "count": 0
          },
          {
            "name": "2금제",
            "count": 0
          },
          {
            "name": "3금제",
            "count": 0
          },
          {
            "name": "4금제",
            "count": 0
          },
          {
            "name": "5금제",
            "count": 0
          },
          {
            "name": "1해금",
            "count": 0
          },
          {
            "name": "2해금",
            "count": 0
          }
        ],
        'isSaveEnabled': true, // 초기 값으로 각 캐릭터의 isSaveEnabled 상태 관리
      },
      {
        "NICKNAME": "테스트2",
        "SERVER": "루페온",
        "JOB": "브레이커",
        "ITEM_LEVEL": 1680,
        "CUBES": [
          {
            "name": "1금제",
            "count": 0
          },
          {
            "name": "2금제",
            "count": 0
          },
          {
            "name": "3금제",
            "count": 0
          },
          {
            "name": "4금제",
            "count": 0
          },
          {
            "name": "5금제",
            "count": 0
          },
          {
            "name": "1해금",
            "count": 0
          },
          {
            "name": "2해금",
            "count": 0
          }
        ],
        'isSaveEnabled': true, // 초기 값으로 각 캐릭터의 isSaveEnabled 상태 관리
      }]);



      setCubeInfo([
        {
          "NAME": "1금제",
          "LEVEL": 1,
          "CARD_EXP": 3000,
          "JEWELRY": 21,
          "JEWELRY_PRICE": 0,
          "STONES": 20,
          "SILLING": 79859,
          "ETC1": 6,
          "ETC2": 3,
          "ETC3": 1
        },
        {
          "NAME": "2금제",
          "LEVEL": 2,
          "CARD_EXP": 9000,
          "JEWELRY": 36,
          "JEWELRY_PRICE": 0,
          "STONES": 14,
          "SILLING": 100142,
          "ETC1": 8,
          "ETC2": 4,
          "ETC3": 2
        },
        {
          "NAME": "3금제",
          "LEVEL": 3,
          "CARD_EXP": 12000,
          "JEWELRY": 54,
          "JEWELRY_PRICE": 0,
          "STONES": 25,
          "SILLING": 110370,
          "ETC1": 11,
          "ETC2": 6,
          "ETC3": 2
        },
        {
          "NAME": "4금제",
          "LEVEL": 4,
          "CARD_EXP": 13000,
          "JEWELRY": 72,
          "JEWELRY_PRICE": 0,
          "STONES": 14,
          "SILLING": 120518,
          "ETC1": 12,
          "ETC2": 7,
          "ETC3": 3
        },
        {
          "NAME": "5금제",
          "LEVEL": 5,
          "CARD_EXP": 13500,
          "JEWELRY": 81,
          "JEWELRY_PRICE": 0,
          "STONES": 25,
          "SILLING": 129802,
          "ETC1": 13,
          "ETC2": 8,
          "ETC3": 4
        },
        {
          "NAME": "1해금",
          "LEVEL": 6,
          "CARD_EXP": 18000,
          "JEWELRY": 9,
          "JEWELRY_PRICE": 0,
          "STONES": 14,
          "SILLING": 140173,
          "ETC1": 4,
          "ETC2": 4,
          "ETC3": 0
        },
        {
          "NAME": "2해금",
          "LEVEL": 7,
          "CARD_EXP": 19500,
          "JEWELRY": 18,
          "JEWELRY_PRICE": 0,
          "STONES": 25,
          "SILLING": 151741,
          "ETC1": 5,
          "ETC2": 5,
          "ETC3": 0
        }
        ,
        {
          "NAME": "3해금",
          "LEVEL": 8,
          "CARD_EXP": 20000,
          "JEWELRY": 24,
          "JEWELRY_PRICE": 0,
          "STONES": 32,
          "SILLING": 159631,
          "ETC1": 6,
          "ETC2": 6,
          "ETC3": 0
        }
      ])
      setLoading(false); // 임시 데이터 로딩 완료 처리
    }
  }, [navigate, logout]);

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 상태 표시
  }

  if (error) {
    return <div>{error}</div>; // 에러 상태 표시
  }

  return (
    <div>

      {/* SEO 메타 태그 */}
      <Helmet>
        <title>큐브 계산기 | LOAGAP</title>
        <meta name="description" content={`로스트아크 큐브 계산기입니다. 빈틈봇과 연동 할 수 있으며, 모든 원정대를 계산해줍니다.`} />
        <meta name="keywords" content="빈틈봇, 큐브 계산기, 금제, 해금" />
        <meta name="robots" content="index, follow" />

        {/* JSON-LD 구조화 데이터 */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "빈틈봇, 큐브 계산기",
            "url": window.location.href,
            "description": `로스트아크 큐브 계산기입니다. 빈틈봇과 연동 할 수 있으며, 모든 원정대를 계산해줍니다.`,
            "game": {
              "@type": "VideoGame",
              "name": "Lost Ark"
            }
          })}
        </script>
      </Helmet>
      <div className="total-rewards">
        <h4>총 계산</h4>
        {characterInfo && Array.isArray(characterInfo) && (
          <div className="reward-summary">
            {/* 총 골드 */}
            <div className="reward-item">
              <img src={goldIcon} alt="골드" className="icon_gold" />
              <span className="value">
                {new Intl.NumberFormat("ko-KR").format(calculateTotalRewards(characterInfo).gold)}
              </span>
            </div>

            {/* 총 실링 */}
            <div className="reward-item">
              <img src={silingIcon} alt="실링" className="icon" />
              <span className="value">
                {new Intl.NumberFormat("ko-KR").format(calculateTotalRewards(characterInfo).siling)}
              </span>
            </div>

            {/* 총 카드 EXP */}
            <div className="reward-item">
              <img src={cardIcon} alt="카드 EXP" className="icon" />
              <span className="value">
                {new Intl.NumberFormat("ko-KR").format(calculateTotalRewards(characterInfo).cardExp)}
              </span>
            </div>

            {/* 금제(3티어) 보석 */}
            <div className="reward-item">
              <img src={jewellery3Icon} alt="금제 보석" />
              <span className="value">
                {calculatejewelryGrad(calculateTotalRewards(characterInfo).jewelry3Tier).map((jewel) => (
                  <span key={jewel.level} className="jewel-info">
                    {jewel.level}레벨: {jewel.count}개
                  </span>
                ))}
              </span>
            </div>

            {/* 해금(4티어) 보석 */}
            <div className="reward-item">
              <img src={jewellery4Icon} alt="해금 보석" />
              <span className="value">
                {calculatejewelryGrad(calculateTotalRewards(characterInfo).jewelry4Tier).map((jewel) => (
                  <span key={jewel.level} className="jewel-info">
                    {jewel.level}레벨: {jewel.count}개
                  </span>
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="cube-contains">
        {characterInfo &&
          Array.isArray(characterInfo) &&
          characterInfo.map(({ SERVER, NICKNAME, JOB, ITEM_LEVEL, CUBES, isSaveEnabled }, characterIndex) => (
            <div className="content" key={NICKNAME}>
              <span className="title">{NICKNAME}</span>
              <span className="sub-title">
                [{SERVER}] Lv.{ITEM_LEVEL} {JOB}
              </span>

              {/* 3티어 섹션 */}
              <div className="tier-section">
                <h3 className="tier-title">3티어</h3>
                <ul className="tier-list">
                  {["1금제", "2금제", "3금제", "4금제", "5금제"].map((tierName, index) => {
                    const cube = CUBES.find((c) => c.name === tierName) || { count: 0 };
                    return (
                      <li key={index}>
                        <div className="grid-container">
                          {Array.from({ length: 4 }).map((_, idx) => {
                            // 채우는 순서를 결정
                            const newIndexOrder = [0, 1, 2, 3]; // 좌측 상단, 우측 상단, 좌측 하단, 우측 하단
                            const actualIndex = newIndexOrder[idx];

                            // 색칠 여부를 결정하는 조건
                            const shouldColor =
                              (index === 1 && actualIndex === 0) || // 1개일 때 좌측 상단만 채우기
                              (index === 2 && actualIndex < 2) || // 2개일 때 상단 2개 채우기
                              (index === 3 && actualIndex !== 1) || // 3개일 때 우측 상단 제외 채우기
                              index === 4; // 4개일 때 모두 채우기

                            return (
                              <div
                                className={`grid-item ${shouldColor ? "t3" : ""}`}
                                key={idx}
                              ></div>
                            );
                          })}
                        </div>




                        <span className="tier-name">{tierName}</span>
                        <input
                          type="number"
                          min="0"
                          max="999"
                          value={cube.count}
                          placeholder="수량"
                          className="quantity-input"
                          onChange={(e) => handleCountChange(characterIndex, tierName, parseInt(e.target.value, 10) || 0)} // 0으로 fallback
                          onInput={(e) => {
                            // 입력된 값의 숫자화 처리
                            let value = e.target.value;

                            // 숫자가 아닌 경우 초기화
                            if (!/^\d+$/.test(value)) {
                              e.target.value = 0;
                              return;
                            }

                            // 숫자 변환 및 앞의 0 제거
                            value = parseInt(value, 10);

                            // 최소/최대값 처리
                            if (value < 0) {
                              value = 0;
                            } else if (value > 999) {
                              value = 999;
                            }

                            // 수정된 값을 다시 반영
                            e.target.value = value;
                          }}
                        />

                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* 4티어 섹션 */}
              <div className="tier-section">
                <h3 className="tier-title">4티어</h3>
                <ul className="tier-list">
                  {["1해금", "2해금", "3해금"].map((tierName, index) => {
                    const cube = CUBES.find((c) => c.name === tierName) || { count: 0 };
                    return (
                      <li key={index}>
                        <div className="grid-container">
                          {Array.from({ length: 4 }).map((_, idx) => {
                            // 채우는 순서를 결정
                            const newIndexOrder = [0, 1, 2, 3]; // 좌측 상단, 우측 상단, 좌측 하단, 우측 하단
                            const actualIndex = newIndexOrder[idx];

                            // 색칠 여부를 결정하는 조건
                            const shouldColor =
                              (index === 1 && actualIndex === 0) || // 1개일 때 좌측 상단만 채우기
                              (index === 2 && actualIndex < 2) || // 2개일 때 상단 2개 채우기
                              (index === 3 && actualIndex !== 1) || // 3개일 때 우측 상단 제외 채우기
                              index === 4; // 4개일 때 모두 채우기

                            return (
                              <div
                                className={`grid-item ${shouldColor ? "t4" : ""}`}
                                key={idx}
                              ></div>
                            );
                          })}
                        </div>
                        <span className="tier-name">{tierName}</span>
                        <input
                          type="number"
                          min="0"
                          max="999"
                          value={cube.count}
                          placeholder="수량"
                          className="quantity-input"
                          onChange={(e) => handleCountChange(characterIndex, tierName, parseInt(e.target.value, 10) || 0)} // 0으로 fallback
                          onInput={(e) => {
                            // 입력된 값의 숫자화 처리
                            let value = e.target.value;

                            // 숫자가 아닌 경우 초기화
                            if (!/^\d+$/.test(value)) {
                              e.target.value = 0;
                              return;
                            }

                            // 숫자 변환 및 앞의 0 제거
                            value = parseInt(value, 10);

                            // 최소/최대값 처리
                            if (value < 0) {
                              value = 0;
                            } else if (value > 999) {
                              value = 999;
                            }

                            // 수정된 값을 다시 반영
                            e.target.value = value;
                          }}
                        />

                      </li>
                    );
                  })}
                </ul>
              </div>
              {/* 저장 버튼 */}
              <button
                type="submit"
                className={`save-button ${isSaveEnabled ? 'disabled' : ''}`} // CSS 클래스 추가
                onClick={() => handleSave(characterIndex)} // 함수 참조 전달
                disabled={isSaveEnabled} // 상태 값에 따라 활성화/비활성화 설정
              >
                저장
              </button>

              {/* 총 수급 아이템 섹션 */}
              <div className="tier-section">
                <h3 className="tier-title">
                  총 <span>{CUBES.reduce((sum, cube) => sum + cube.count, 0)}장</span>의 수급 아이템
                </h3>
                <div className="goldSpan">
                  <img src={goldIcon} alt="골드" className="icon_gold" />
                  {/* 골드(보석값) 계산 부분 수정 */}
                  <span className="goldAmount">
                    {new Intl.NumberFormat('ko-KR').format(
                      calculateCubes(CUBES).reduce((sum, info) => sum + (info.reward.jewelryPrice || 0), 0)
                    )}
                  </span>
                </div>
                <div className="goldSpan">
                  <img src={silingIcon} alt="실링" className="icon" />
                  {/* 실링 계산 부분 수정 */}
                  <span className="goldAmount">
                    {new Intl.NumberFormat('ko-KR').format(
                      calculateCubes(CUBES).reduce((sum, info) => sum + (info.reward.selling || 0), 0)
                    )}
                  </span>
                </div>
                <div className="goldSpan">
                  <img src={cardIcon} alt="카드" className="icon" />
                  {/* 카드 EXP 계산 부분 수정 */}
                  <span className="goldAmount">
                    {new Intl.NumberFormat('ko-KR').format(
                      calculateCubes(CUBES).reduce((sum, info) => sum + (info.reward.cardExp || 0), 0)
                    )}
                  </span>
                </div>
              </div>

              {/* 보석 아이템 섹션 */}
              <div className="jewellery-contains">
                {["금제", "해금"].map((name, index) => (
                  <div className="content" key={index}>
                    {/* 보석 아이템 */}
                    <div className="rewardSpan">
                      <span className="rewardSpan" key={`${name}T`}>
                        {/* 아이콘 추가 */}
                        <img
                          src={name === "금제" ? jewellery3Icon : jewellery4Icon}
                          alt={`${name} 보석`}
                          className="icon-jewellery"
                        />
                      </span>
                      <dd>
                        {/* 보석 개수 계산 */}
                        {(() => {
                          // 총 보석 개수 계산
                          const totalJewelry = calculateCubes(CUBES).reduce((sum, info) => {
                            if (info.name.includes(name)) {
                              return sum + info.reward.jewelry;
                            }
                            return sum;
                          }, 0);

                          const levelCounts = calculatejewelryGrad(totalJewelry);

                          // 결과 출력
                          return (
                            <div>
                              {levelCounts.length === 0 ? (
                                <div>0개</div>
                              ) : (
                                levelCounts.map((levelInfo, index) => (
                                  <div key={index}>
                                    {levelInfo.count > 0
                                      ? `${levelInfo.level}레벨: ${levelInfo.count}개`
                                      : `${levelInfo.level}레벨: 0개`}
                                  </div>
                                ))
                              )}
                            </div>
                          );
                        })()}
                      </dd>
                    </div>
                  </div>
                ))}
              </div>

              {/* 아이템 섹션 */}
              <div className="item-contains">
                {["금제", "해금"].map((name, index) => (
                  <div className="content" key={index}>
                    {/* 아이템 그룹 */}
                    <div className="rewardSpan">
                      {name === "금제" ? (
                        // 금제일 때 사용하는 아이콘
                        [solar1Icon, solar2Icon, solar3Icon].map((icon, iconIndex) => (
                          <div key={`${name}-icon-${iconIndex}`} className="rewardSpan">
                            <img src={icon} alt={`금제 아이템 ${iconIndex + 1}`} className="icon" />
                            <dd>
                              {
                                calculateCubes(CUBES).reduce((sum, info) => {
                                  if (info.name.includes(name)) {
                                    const rewardKey = `etc${iconIndex + 1}`; // 예: etc1, etc2, etc3
                                    return sum + (info.reward[rewardKey] || 0); // 해당 속성이 없을 경우 0으로 처리
                                  }
                                  return sum;
                                }, 0)
                              }개
                            </dd>
                          </div>
                        ))
                      ) : (
                        // 해금일 때 사용하는 아이콘
                        [solar4Icon, solar5Icon].map((icon, iconIndex) => (
                          <div key={`${name}-icon-${iconIndex}`} className="rewardSpan">
                            <img src={icon} alt={`해금 아이템 ${iconIndex + 1}`} className="icon" />
                            <dd>
                              {
                                calculateCubes(CUBES).reduce((sum, info) => {
                                  if (info.name.includes(name)) {
                                    const rewardKey = `etc${iconIndex + 1}`; // 예: etc1, etc2, etc3
                                    return sum + (info.reward[rewardKey] || 0); // 해당 속성이 없을 경우 0으로 처리
                                  }
                                  return sum;
                                }, 0)
                              }개
                            </dd>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Stone 아이템 추가 부분 */}
                    <div className="rewardSpan">
                      {name === "금제" ? (
                        // 금제일 때 사용하는 stone3Icon
                        [stone3Icon].map((icon, iconIndex) => (
                          <div key={`${name}-stone-icon-${iconIndex}`} className="rewardSpan">
                            <img src={icon} alt={`금제 스톤 ${iconIndex + 1}`} className="icon" />
                            <dd>
                              {
                                calculateCubes(CUBES).reduce((sum, info) => {
                                  if (info.name.includes("금제")) {
                                    return sum + (info.reward.stones || 0); // stone 보상 계산
                                  }
                                  return sum;
                                }, 0)
                              }개
                            </dd>
                          </div>
                        ))
                      ) : (
                        // 해금일 때 사용하는 stone4Icon
                        [stone4Icon].map((icon, iconIndex) => (
                          <div key={`${name}-stone-icon-${iconIndex}`} className="rewardSpan">
                            <img src={icon} alt={`해금 스톤 ${iconIndex + 1}`} className="icon" />
                            <dd>
                              {
                                calculateCubes(CUBES).reduce((sum, info) => {
                                  if (info.name.includes("해금")) {
                                    return sum + (info.reward.stones || 0); // stone 보상 계산
                                  }
                                  return sum;
                                }, 0)
                              }개
                            </dd>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>

  );
};

export default Cube;
