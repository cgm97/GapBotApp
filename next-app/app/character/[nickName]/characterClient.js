'use client'

import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import KakaoAdFit from "@/components/KakaoAdFit";
import AdSense from '@/components/Adsense';
import '@/css/Character.css';
const elixirImg = '/img/elixir.png';
const hyperImg = '/img/hyper.png';
const guildImg = '/img/guild.png';
const donatePng = '/img/donate/donation.png';

const Character = ({nickName}) => {
    // const { nickName } = searchName;
    const [profile, setProfile] = useState({});
    const [guild, setGuild] = useState({});
    const [wisdom, setWisdom] = useState({});
    const [gemItems, setGemItems] = useState([]);
    const [equipItems, setEquipItems] = useState([]);
    const [accessoryItems, setAccessoryItems] = useState([]);
    const [arkItems, setArkItems] = useState({});
    const [engravings, setEngravings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRenewing, setIsRenewing] = useState(false); // 갱신 중 상태 추가
    const [error, setError] = useState(null);

    // 데이터 불러오기 함수
    const fetchCharacterData = useCallback(async () => {
        if (!nickName) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/character/search`, {
                params: { nickName },
            });

            if (response.status === 200) {
                const data = response.data;
                setProfile(data.profile || {});
                setGuild(data.guild || {});
                setWisdom(data.wisdom || {});
                setGemItems(data.gemItems || []);
                setEquipItems(data.equipItems || []);
                setAccessoryItems(data.accessoryItems || []);
                setArkItems(data.arkItems || {});
                setEngravings(data.engravings || []);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [nickName]); // nickName이 변경될 때만 함수 재생성

    // 갱신하기 버튼 클릭 시 실행되는 함수
    const handleRenew = async () => {
        setIsRenewing(true); // 갱신 중 상태 활성화
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/character/renew`, {
                params: { nickName },
            });

            if (response.status === 200) {
                fetchCharacterData(); // 데이터 다시 불러오기
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsRenewing(false); // 갱신 중 상태 비활성화
        }


    };

    // 데이터 불러오기
    useEffect(() => {
        fetchCharacterData();
    }, [fetchCharacterData]);

    // 에러 처리
    const handleError = (error) => {
        setProfile({});
        setGuild({});
        setWisdom({});
        setGemItems([]);
        setEquipItems([]);
        setAccessoryItems([]);
        setArkItems({});
        setEngravings([]);

        if (error.response?.status === 404) {
            setError(error.response.data);
        } else {
            setError("서버 오류가 발생했습니다.");
        }
    };

    // 로딩 상태
    if (isLoading) {
        return <p>검색 중...</p>;
    }

    // 로딩 상태
    if (isRenewing) {
        return <p>갱신 중...</p>;
    }

    // 데이터 없을 때
    if (!gemItems.length && !equipItems.length && !accessoryItems.length) {
        return <p>{error}</p>;
    }

    // 등급에 따른 CSS 클래스 반환
    const getGradeClass = (grade) => {
        switch (grade) {
            case '고대': return 'ancient';
            case '유물': return 'relic';
            case '전설': return 'legend';
            case '영웅': return 'heroic';
            default: return '';
        }
    };

    // 진행도에 따른 CSS 클래스 반환
    const getProgressClass = (progress) => {
        const progressValue = Number(progress);
        if (progressValue === 100) return 'yellow';
        if (progressValue >= 90) return 'purple';
        if (progressValue >= 70) return 'blue';
        if (progressValue >= 30) return 'green';
        return 'other';
    };

    return (
        <div className="character-container">
        <div className="group">
            {/* 캐릭터 정보 영역 */}
            <div className="group-info">
                <div className="character">
                    <img className="character-img" src={profile.IMG_URL} alt="캐릭터 이미지" />
                    <button className="renew-button" onClick={handleRenew}>갱신하기</button>
                    <div className="character-info">
                        <p className="character-name dark:text-gray-300">{profile.TITLE !== "없음" ? profile.TITLE : ""}</p>
                        <h1 className="character-name dark:text-gray-300">Lv.{profile.CHARACTER_LEVEL}&nbsp;{profile.NICKNAME} {profile.IS_DONATE==="Y"?<img src={donatePng} alt={"후원"} className="inline-block align-middle w-5 h-5 ml-1" />:""}</h1>
                        <ul className="character-info-list">
                            <li className="character-info-item">
                                <p className="character-info radius dark:bg-gray-300">전투력</p>
                                <span className="name dark:bg-gray-300">{profile.COMBAT_POWER}</span>
                            </li>
                            <li className="character-info-item">
                                <p className="character-info radius dark:bg-gray-300">직업</p>
                                <span className="name dark:bg-gray-300">{profile.JOB} {profile.SUBJOB !== "서폿" ? profile.SUBJOB : ""}</span>
                            </li>
                            <li className="character-info-item">
                                <p className="character-info radius dark:bg-gray-300">서버</p>
                                <span className="name dark:bg-gray-300">{profile.SERVER}</span>
                            </li>
                            <li className="character-info-item">
                                <p className="character-info radius dark:bg-gray-300">레벨</p>
                                <span className="name dark:bg-gray-300">{profile.ITEM_LEVEL} / {profile.EXPEDITION_LEVEL}</span>
                            </li>
                            <li className="character-info-item">
                                <p className="character-info radius dark:bg-gray-300">길드</p>
                                <span className="name dark:bg-gray-300">{Boolean(guild.IS_OWNER) && <img className="guild" src={guildImg} alt="길드장" />}{guild.NAME}</span>
                            </li>
                            <li className="character-info-item">
                                <p className="character-info radius dark:bg-gray-300">영지</p>
                                <span className="name dark:bg-gray-300">Lv.{wisdom.LEVEL}&nbsp;{wisdom.NAME}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 각인 정보 영역 */}
                <div className="engraving dark:bg-background">
                    {engravings.map((item, index) => (
                        <div key={index}>
                            <img className="engraving-img" src={item.imgSrc} alt={item.name} />
                            <div className={`engraving-ico ${item.color}`}></div>
                            <p className="name dark:text-gray-300">X{item.grade}</p>
                            <p className="name dark:text-gray-300">{item.name}</p>
                            {item.abilityLevel && (
                                <div>
                                    <div className="engraving-ico level" />
                                    <p className="name dark:text-gray-300">{item.abilityLevel}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 광고 영역 */}
                <div className="engraving dark:bg-background">
                    {/* <KakaoAdFit unit="DAN-KjllsdstWjrHOWe6" width={250} height={250} disabled={true} /> */}
                     <AdSense adSlot="1488834693" />
                </div>
            </div>

            {/* 장비 및 액세서리 영역 */}
            <div className="group-equip">
                <div className="armor-wrap">
                    <div className="armor-area dark:bg-background">
                        <ul className="equipment-list">
                            {equipItems.map((item, index) => (
                                <li key={index} className="equipment-item">
                                    {item.name === "평균" ? (
                                        <div className="average-item">
                                            <ul className="avgItem">
                                                <div className="item-image-wrapper ancient">
                                                    <img src={elixirImg} alt="빛나는 지혜의 엘릭서" className="item-image" />
                                                    <span className="item-progress yellow">{item.elixirSum}</span>
                                                </div>
                                                <div>
                                                    <p className="average-elixir-ability dark:text-gray-300">{item.elixirAbility}</p>
                                                    <p className="average-value dark:text-gray-300">{item.elixirValue !== 0 ? `${item.elixirValue}%` : ''}</p>
                                                </div>
                                                <div className="item-image-wrapper ancient">
                                                    <img src={hyperImg} alt="초월 이미지" className="item-image" />
                                                    <span className="item-progress yellow">{item.hyperSum}</span>
                                                </div>
                                                <div>
                                                    <p className="average-elixir-ability dark:text-gray-300 w-12">{item.hyperAvg}</p>
                                                    <p className="average-elixir-ability dark:text-gray-300 w-12">
                                                        {item.hyperValue !== 0 ? `${item.hyperValue}%` : `낙인력 ${item.stigmaticValue}%`}
                                                    </p>
                                                </div>
                                            </ul>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`item-image-wrapper ${getGradeClass(item.grade)}`}>
                                                <img src={item.imageUrl} alt={item.name} className="item-image" />
                                                <p className="level">T{item.tier}</p>
                                                <span className={`item-progress ${getProgressClass(item.progress)}`}>{item.progress}</span>
                                            </div>
                                            <div className="item-info">
                                                {Number(item.hyper) > 0 && (
                                                    <div className="hyper-wrap">
                                                        <img
                                                            className="item-image"
                                                            src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/ico_tooltip_transcendence.png"
                                                            alt="초월 아이콘"
                                                        />
                                                        <p className="hyperWarp1">{item.hyper}</p>
                                                        <p className="hyperWarp2 dark:text-gray-300">{item.hyperLevel}</p>
                                                    </div>
                                                )}
                                                <p className="name dark:text-gray-300">{item.name}</p>
                                                <ul className="attributes">
                                                    {(item.elixirs || []).map((elixir, index) => (
                                                        <li key={index} className="attribute-item dark:text-gray-300">{elixir}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 악세서리 영역 */}
                    <div className="accessory-area dark:bg-background">
                        <ul className="accessory-list">
                            {accessoryItems.map((accessory, index) => (
                                <li key={index} className="equipment-item">
                                    <div className={`item-image-wrapper ${getGradeClass(accessory.grade)}`}>
                                        <img src={accessory.imgSrc} alt={accessory.name} className="item-image" />
                                        <p className="level">T{accessory.tier}</p>
                                        <span className={`item-progress ${getProgressClass(accessory.progress)}`}>
                                            {isNaN(Number(accessory.progress))
                                                ? accessory.name === "팔찌"
                                                    ? <>{accessory.name} <span className="bangleValue">{accessory.bangleValue}%</span></>
                                                    : accessory.name
                                                : accessory.progress}
                                        </span>
                                    </div>
                                    <div className="accessory-options">
                                        {accessory.options.map((option, idx) => (
                                            <div key={idx}>
                                                {option.grade ? (
                                                    <ul>
                                                        <li className="attribute-item">
                                                            <span className={`option-${option.grade} dark:text-black`}>{option.grade}</span>&nbsp;
                                                            <span className="optionName dark:text-gray-300"> {option.optionName} </span>
                                                        </li>
                                                    </ul>
                                                ) : (
                                                    <div className="attribute-item">
                                                        <span className="optionName dark:text-gray-300">{option.optionName}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 보석 영역 */}
                <div className="gem-area dark:bg-background">
                    {gemItems.map((gem, index) => (
                        <div key={index} className={`gem-box ${getGradeClass(gem.grade)}`}>
                            <img src={gem.imgSrc} alt={gem.name} />
                            <p className="level">{gem.level}</p>
                            <div className="detail">{gem.name} {gem.option}</div>
                        </div>
                    ))}
                </div>

                {/* 아크패시브 영역 */}
                <div className="arkPassive-area dark:bg-background">
                    {['evolution', 'enlightenment', 'leap'].map((key) => (
                        <div key={key} className="arkPassive-column">
                            <div className="arkPassive-header">
                                <span className={`arkPassive-name ${key}`}>
                                    {key === "evolution" ? "진화" : key === "enlightenment" ? "깨달음" : "도약"}
                                </span>
                                <span className="arkPassive-point dark:text-gray-300">{arkItems[key].point}</span>
                            </div>
                            <ul className="arkPassive-list">
                                {arkItems[key].items.map((arkPassive, index) => (
                                    <li key={index} className="arkPassive-item">
                                        <img src={arkPassive.imgSrc} alt={arkPassive.name} className="arkPassive-image" />
                                        <div className="arkPassive-info">
                                            <span className="arkPassive-tier dark:text-gray-300">{arkPassive.tier}티어</span>
                                            <span className="arkPassive-name dark:text-gray-300">{arkPassive.name}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Character;