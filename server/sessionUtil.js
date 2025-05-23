const sessionCache = new Map(); // Map 객체 생성
const pool = require('./db/connection');
const logger = require('./logger');  // logger.js 임포트
const axios = require('axios');
let lastBookPriceUpdate = 0;
let lastJewelPriceUpdate = 0;

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

// 보석 시세 조회
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
    for (var i = 7; i <= 10; i++) {
        if (!jemArr[i]) jemArr[i] = [];
        const body = {
            "CategoryCode": 210000,
            "Sort": "BUY_PRICE",
            "ItemTier": 4,
            "ItemName": i + "레벨 작열"
        };

        // await 사용
        const response = await axios.post(API_URL, body, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',  // JSON 데이터를 전송할 때 필요
                'authorization': `bearer ${process.env.LOA_API_KEY}`,
            },
        });

        // response.data를 사용
        const itemName = response.data.Items[0].Name;
        const price = response.data.Items[0].AuctionInfo.BuyPrice;
        const icon = response.data.Items[0].Icon;

        // 데이터 저장
        jemArr[i].push({
            name: itemName,
            price: price,
            icon: icon
        });
    }

    for (var i = 7; i <= 10; i++) {
        if (!jemArr[i]) jemArr[i] = [];
        const body = {
            "CategoryCode": 210000,
            "Sort": "BUY_PRICE",
            "ItemTier": 4,
            "ItemName": i + "레벨 겁화"
        };

        // await 사용
        const response = await axios.post(API_URL, body, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',  // JSON 데이터를 전송할 때 필요
                'authorization': `bearer ${process.env.LOA_API_KEY}`,
            },
        });

        // response.data를 사용
        const itemName = response.data.Items[0].Name;
        const price = response.data.Items[0].AuctionInfo.BuyPrice;
        const icon = response.data.Items[0].Icon;

        // 데이터 저장
        jemArr[i].push({
            name: itemName,
            price: price,
            icon: icon
        });
    }

    sessionCache.set("jewelPrice", jemArr);
    sessionCache.set("jewelPriceLastUpdate", getDateTime());

    lastJewelPriceUpdate = now;
    return jemArr;
}

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

module.exports = {
    sessionCache,
    initializeCache,
    getBookPrice,
    getJewelPrice,
    getDateTime,
    getDate
};
