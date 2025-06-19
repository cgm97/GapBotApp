const sessionCache = new Map(); // Map 객체 생성
const pool = require('./db/connection');
const logger = require('./logger');  // logger.js 임포트
const fillter = require('./accessoryFillter');  // logger.js 임포트
const axios = require('axios');
let lastBookPriceUpdate = 0;
let lastJewelPriceUpdate = 0;
let accessoryPriceLastUpdate = 0;

// 초기 데이터 설정 함수
const initializeCache = async () => {
    try {
        const cubeInfo = await getCubeInfo(); // 비동기 함수의 결과를 대기
        sessionCache.set("cubeInfo", cubeInfo); // 실제 데이터를 Map에 저장
        // console.log("Session Cache:", Object.fromEntries(sessionCache)); // Map 내용을 출력
    } catch (error) {
        console.error("Failed to initialize cache:", error);
    }
};

// 큐브 정보 가져오기 함수
const getCubeInfo = async () => {
    let connection;
    try {
        // DB 연결
        connection = await pool.getConnection();

        // 큐브 정보 조회 SQL
        const cubeInfoSql = `
            SELECT 
                NAME,
                LEVEL,
                CARD_EXP,
                JEWELRY,
                JEWELRY_PRICE,
                STONES,
                SILLING,
                ETC1,
                ETC2,
                ETC3
            FROM 
                CUBE_INFO
            WHERE 
                DL_YN = 'N'
            ORDER BY 
                LEVEL ASC;
        `;
        const [cubeInfo] = await connection.execute(cubeInfoSql);
        return cubeInfo; // 쿼리 결과 반환
    } catch (error) {
        console.error("Error fetching cube info:", error);
        throw error; // 에러를 호출자에게 전달
    } finally {
        // 연결 해제
        if (connection) connection.release();
    }
};

// 실시간 유각시세 갱신 (1분 내에는 캐시 사용)
const getBookPrice = async () => {
    const method = 'getBookPrice';
    const now = Date.now();

    if (now - lastBookPriceUpdate < 60 * 1000) {
        logger.info({
            method,
            url: "SessionUtil",
            message: `bookPrice: 1분 이내 요청 → 캐시 사용`,
        });
        return sessionCache.get("bookPrice");
    }

    const API_URL = "https://developer-lostark.game.onstove.com/markets/items";
    let bookArr = [];

    for (let i = 1; i < 10; i++) {
        const body = {
            "Sort": "CURRENT_MIN_PRICE",
            "CategoryCode": 40000,
            "ItemGrade": "유물",
            "PageNo": i,
            "SortCondition": "DESC"
        };

        try {
            const response = await axios.post(API_URL, body, {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: `bearer ${process.env.LOA_API_KEY}`,
                },
            });

            if (!response.data.Items || response.data.Items.length === 0) break;

            response.data.Items.forEach(item => {
                bookArr.push({
                    name: item.Name,
                    price: item.CurrentMinPrice,
                    icon: item.Icon,
                    grade: item.Grade,
                });
            });
        } catch (error) {
            logger.error({
                method,
                url: "SessionUtil",
                message: `bookPrice API 호출 실패`,
                error,
            });
            throw error;
        }
    }

    logger.info({
        method,
        url: "SessionUtil",
        message: `bookPrice 갱신 완료 - ${bookArr.length}건`,
    });

    sessionCache.set("bookPrice", bookArr);
    sessionCache.set("bookPriceLastUpdate", getDateTime());

    lastBookPriceUpdate = now;
    return bookArr;
};

const getJewelPrice = async () => {
    const method = 'getJewelPrice';
    const now = Date.now();

    if (now - lastJewelPriceUpdate < 60 * 1000) {
        logger.info({
            method,
            url: "SessionUtil",
            message: `getJewelPrice: 1분 이내 요청 → 캐시 사용`,
        });
        return sessionCache.get("jewelPrice");
    }

    const API_URL = "https://developer-lostark.game.onstove.com/auctions/items";
    let jemArr = {};

    for (let i = 1; i <= 10; i++) {
        jemArr[i] = [];

        const types = ["작열", "겁화"];
        for (const type of types) {
            const body = {
                CategoryCode: 210000,
                Sort: "BUY_PRICE",
                ItemTier: 4,
                ItemName: `${i}레벨 ${type}`
            };

            const response = await axios.post(API_URL, body, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${process.env.LOA_API_KEY}`,
                },
            });

            const item = response.data.Items[0];
            jemArr[i].push({
                name: item.Name,
                price: item.AuctionInfo.BuyPrice,
                icon: item.Icon,
            });
        }
    }
    sessionCache.set("jewelPrice", jemArr);
    sessionCache.set("jewelPriceLastUpdate", getDateTime());
    lastJewelPriceUpdate = now;

    return jemArr;
};

const getAccessoriesPrice = async () => {
    const method = 'getAccessoriesPrice';
    const now = Date.now();

    const accessory = fillter.ACCESSORY;
    const grade = fillter.GRADE;
    const CategoryCode = fillter.CATEGORYCODE;
    const functionSingle = fillter.getEtcOptionsSingle;
    const functionDouble = fillter.getEtcOptionsDouble;

    if (now - accessoryPriceLastUpdate < 60 * 60 * 1000) { // 1시간
        logger.info({
            method,
            url: "SessionUtil",
            message: `${method}: 1시간 이내 요청 → 캐시 사용`,
        });
        return sessionCache.get("accessoryPrice");
    }

    const accessoryKeys = Object.keys(accessory); // 상 상상 상중 ... 중하
    const gradeKeys = Object.keys(grade); // 고대, 유물
    const categortKeys = Object.keys(CategoryCode); // necklace earring ring

    const API_URL = "https://developer-lostark.game.onstove.com/auctions/items";
    const LOA_API1 = `bearer ${process.env.LOA_API_KEY_ITEM1}`
    const LOA_API2 = `bearer ${process.env.LOA_API_KEY_ITEM2}`
    var cnt = 0;

    let retAccessory = [];
    try {
        // 고대 유물
        for (const gradeKey of gradeKeys) {
            if (gradeKey == "유물") continue; // 유물은 패스
            // 옵션갯수 3,2,1
            for (const optionCount of Object.keys(grade[gradeKey].point)) {

                // 상 상상 상중 .... 중하
                for (const accessoryKey of accessoryKeys) {

                    // necklace earring ring
                    for (const categortKey of categortKeys) {

                        const acsryOption = accessory[accessoryKey][categortKey];

                        for (const acsry of acsryOption) {
                            const name = acsry.name;
                            const params = acsry.params;
                            const pointAdjust = acsry.pointAdjust || 0;
                            const option = acsry.option;
                            let etcOptions = null;

                            // 증첩 (상상 ... 중하)
                            if (accessory[accessoryKey].useGetEtcOptionDouble) {
                                if (optionCount == 1) {
                                    continue; // 연마 횟수가 1은 중첩 불가 -> 단일만 조회
                                }
                                etcOptions = functionDouble(params[0], params[1], params[2], params[3], params[4], (grade[gradeKey].point[optionCount] + pointAdjust));
                            }
                            // 딘일(상 중)
                            else {
                                etcOptions = functionSingle(params[0], params[1], params[2], (grade[gradeKey].point[optionCount] + pointAdjust));
                            }

                            const body = {
                                "ItemLevelMin": grade[gradeKey].level,
                                "ItemLevelMax": grade[gradeKey].level,
                                "ItemUpgradeLevel": optionCount,
                                "CategoryCode": CategoryCode[categortKey],
                                "ItemGradeQuality": 67, // 깨포 최대치
                                "SkillOptions": [],
                                "EtcOptions": etcOptions,
                                "Sort": "BUY_PRICE",
                                "PageNo": 1,
                                "SortCondition": "ASC"
                            }

                            // LOA API 세팅 분당 100회 제한
                            let authorization = LOA_API1;
                            if (cnt > 80) {
                                authorization = LOA_API2;
                            }
                            
                            const response = await axios.post(API_URL, body, {
                                headers: {
                                    'accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'authorization': authorization,
                                },
                            });

                            const item = (response.data.Items && response.data.Items.length > 0)
                                ? response.data.Items[0]
                                : null;

                            const title = accessory[accessoryKey].title;
                            const enhance = optionCount; // 연마 단계

                            // 1️⃣ title 그룹 찾기
                            let titleGroup = retAccessory.find(t => t.title === title);
                            if (!titleGroup) {
                                titleGroup = { title, enhances: [] };
                                retAccessory.push(titleGroup);
                            }

                            // 2️⃣ enhance 그룹 찾기
                            let enhanceGroup = titleGroup.enhances.find(e => e.enhance === enhance);
                            if (!enhanceGroup) {
                                enhanceGroup = { enhance, items: [] };
                                titleGroup.enhances.push(enhanceGroup);
                            }

                            // 3️⃣ 해당 enhance 안에 item 추가
                            enhanceGroup.items.push({
                                name: name,
                                option: option,
                                price: item?.AuctionInfo?.BuyPrice ?? 0
                            });
                            cnt++;
                                   
            // "title": "상",
            // "enhances": [
            //     {
            //         "enhance": "1",
            //         "items": [
            //             {
            //                 "name": "목걸이",
            //                 "option": [
            //                     "적에게 주는 피해%"
            //                 ],
            //                 "price": 52999
                        
                        }


                    }


                }

            }

        }
        
    } catch (err) {
         console.error("에러 발생:", err?.response?.data || err.message || err);
    }

    sessionCache.set("accessoryPrice", retAccessory);
    sessionCache.set("accessoryPriceLastUpdate", getDateTime());
    accessoryPriceLastUpdate = now;

    return retAccessory;
};

// 현지날짜 시간 조회
const getDateTime = (offsetDays = 0) => {
    const now = new Date();
    now.setDate(now.getDate() + offsetDays);

    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const HH = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}

// 현재날짜 조회
const getDate = (offsetDays = 0) => {
    const now = new Date();
    now.setDate(now.getDate() + offsetDays);

    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd}`;
};

// 악세 가격 차이 계산
const calculatePriceDiff = (yesterdayItems, todayItems) => {
  const yesterdayMap = new Map();

  for (const item of yesterdayItems) {
    const key = makeStrictKey(item);
    if (!yesterdayMap.has(key)) {
      yesterdayMap.set(key, item.price);
    } else {
      const prev = yesterdayMap.get(key);
      yesterdayMap.set(key, Math.min(prev, item.price)); // 최저가 기준
    }
  }

  return todayItems.map(item => {
    const key = makeStrictKey(item);
    const yesterdayPrice = yesterdayMap.get(key);

    let priceDiff = 0;
    let percentDiff = 0;

    if (typeof yesterdayPrice === 'number' && yesterdayPrice > 0) {
      priceDiff = item.price - yesterdayPrice;
      percentDiff = (priceDiff / yesterdayPrice) * 100;
      // 소수점 둘째 자리까지 반올림
      percentDiff = Math.round(percentDiff * 100) / 100;
    }

    return {
      ...item,
      priceDiff,
      percentDiff
    };
  });
}

// 악세 전일자대비 구하기
const makeStrictKey = (item) => {
  return `${item.name}|${item.option.join(',')}`;
}

module.exports = {
    sessionCache,
    initializeCache,
    getBookPrice,
    getJewelPrice,
    getAccessoriesPrice,
    getDateTime,
    getDate,
    calculatePriceDiff
};
