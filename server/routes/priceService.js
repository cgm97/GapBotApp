const { Console } = require('winston/lib/winston/transports');
const pool = require('../db/connection');
const logger = require('../logger');  // logger.js 임포트
const { sessionCache, getBookPrice, getDate, getJewelPrice, calculatePriceDiff, groupByNameArray, getMarketPrice } = require('../sessionUtil'); // 캐시 모듈 가져오기
require('dotenv').config(); // .env 파일에서 환경 변수 로드

function formatDateString(dateStr) {
    if (!dateStr || dateStr.length !== 8) return dateStr; // 유효성 검사

    const yyyy = dateStr.slice(0, 4);
    const mm = dateStr.slice(4, 6);
    const dd = dateStr.slice(6, 8);

    return `${yyyy}-${mm}-${dd}`;
}

// 유각 가격 조회
exports.getBookPrice = async (req, res, next) => {

    const yesterday = getDate(-1).replaceAll("-", "");

    // DB 연결
    const connection = await pool.getConnection();
    try {

        // 현재 각인서 가격 조회
        // const nowBookPrice = await getBookPrice();
        // 현재 각인서 가격 조회
        const nowBookPrice = sessionCache.get("bookPrice");

        if (!nowBookPrice) { // 캐쉬에 없을 경우 새로갱신
            return res.status(500).json({ message: "데이터 준비 중입니다. 잠시 후 다시 시도해주세요." });
        }

        // 트랜잭션 시작
        await connection.beginTransaction();
        const selectSql = `SELECT 
                ITEM_DATA AS BOOKS_DATA
              FROM ITEM_PRICE_LOG 
                WHERE BASE_DATE = ? AND ITEM_DVCD = ?
                 `;
        const [yesterdayPrice] = await connection.execute(selectSql, [yesterday, '02']);

        // logger.info({
        //     method: req.method,
        //     url: req.url,  // 요청 URL
        //     message: `\nSql ${selectSql} \nParam ${[yesterday, '02']}`
        // });

        const preBookPrice = yesterdayPrice[0]?.BOOKS_DATA || [];

        var retBooks = [];
        nowBookPrice.forEach(todayBookPrice => {
            preBookPrice.forEach(preBookPrice => {
                if (todayBookPrice.name == preBookPrice.name) {
                    var diffPrice = todayBookPrice.price - preBookPrice.price;

                    const percentChange = ((diffPrice / preBookPrice.price) * 100).toFixed(2);

                    retBooks.push({
                        name: todayBookPrice.name,
                        price: todayBookPrice.price,
                        diffPrice: diffPrice,
                        icon: todayBookPrice.icon,
                        percent: percentChange
                    })
                }
            });
        });

        return res.status(200).json({
            success: true,
            booksPrice: retBooks,
            bookPriceLastUpdate: sessionCache.get("bookPriceLastUpdate")
        });

    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        // return res.status(500).json({ message: "Internal Server Error" });
    }
    finally {
        // DB 연결 해제
        if (connection) connection.release();
    }
}

// 유각 가격 차트 조회
exports.getBookChartPrice = async (req, res, next) => {

    const { item } = req.query;

    // 로깅
    const referer = req.headers.referer || req.headers.origin;
    logger.info({
        method: req.method,
        url: req.url,
        message: `요청 Host: ${referer} 유각차트조회: ${item}`,
    });

    if (!referer || (!referer.includes('loagap.com') && !referer.includes('localhost'))) {
        return res.status(403).json({ message: 'Invalid host' });
    }

    // DB 연결
    const connection = await pool.getConnection();
    try {

        // 트랜잭션 시작
        await connection.beginTransaction();
        const selectSql = `SELECT
                            BASE_DATE AS date,
                            jt.name,
                            jt.price
                            FROM ITEM_PRICE_LOG,
                            JSON_TABLE(
                            ITEM_DATA,
                            '$[*]' COLUMNS (
                                name VARCHAR(100) PATH '$.name',
                                price INT PATH '$.price'
                            )
                            ) AS jt
                            WHERE jt.name = ?
                            AND ITEM_DVCD = ?
                            AND BASE_DATE <> CURRENT_DATE`;
        let [bookData] = await connection.execute(selectSql, [item, '02']);

        // logger.info({
        //     method: req.method,
        //     url: req.url,  // 요청 URL
        //     message: `\nSql ${selectSql} \nParam ${[item]}`
        // });

        // 날자 포멧 변경
        bookData = bookData.map(item => ({
            ...item,
            date: formatDateString(item.date),
            time: formatDateString(item.date),
        }));

        // 현재 각인서 가격 조회 - 오늘 시세가지 차트에 적용
        //  const nowBookPrice = await getJewelPrice();
        const nowBookPrice = sessionCache.get("bookPrice");
        nowBookPrice.forEach(book => {
            if (book.name == item) {
                bookData.push({
                    date: getDate(),
                    time: getDate(),
                    name: book.name,
                    price: book.price
                })
            }
        });

        return res.status(200).json({
            success: true,
            itemData: bookData
        });

    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        // return res.status(500).json({ message: "Internal Server Error" });
    }
    finally {
        // DB 연결 해제
        if (connection) connection.release();
    }
}

// 보석 가격 조회
exports.getJewelPrice = async (req, res, next) => {

    const yesterday = getDate(-1).replaceAll("-", "");

    // DB 연결
    const connection = await pool.getConnection();
    try {

        // 현재 각인서 가격 조회
        // const nowJewelPricePre = await getJewelPrice();
        const nowJewelPricePre = sessionCache.get("jewelPrice");

        // 트랜잭션 시작
        await connection.beginTransaction();
        const selectSql = `SELECT 
                ITEM_DATA AS JEWELS_DATA
              FROM ITEM_PRICE_LOG 
                WHERE BASE_DATE = ? AND ITEM_DVCD = ?
                 `;
        const [yesterdayPrice] = await connection.execute(selectSql, [yesterday, '01']);

        // logger.info({
        //     method: req.method,
        //     url: req.url,  // 요청 URL
        //     message: `\nSql ${selectSql} \nParam ${[yesterday, '01']}`
        // });

        const preJewelPricePre = yesterdayPrice[0]?.JEWELS_DATA || [];

        var retJewels = [];
        const nowJewelPrice = Object.keys(nowJewelPricePre).sort((a, b) => Number(b) - Number(a)) // 10 → 7 내림차순
            .flatMap((level) =>
                nowJewelPricePre[level]
                    .sort((a, b) => a.name.localeCompare(b.name))); // 이름 가나다 정렬
        const preJewelPrice = Object.keys(preJewelPricePre).sort((a, b) => Number(b) - Number(a)) // 10 → 7 내림차순
            .flatMap((level) =>
                preJewelPricePre[level]
                    .sort((a, b) => a.name.localeCompare(b.name))); // 이름 가나다 정렬

        nowJewelPrice.forEach(todayJewelPrice => {
            preJewelPrice.forEach(preJewelPrice => {
                if (todayJewelPrice.name == preJewelPrice.name) {
                    var diffPrice = todayJewelPrice.price - preJewelPrice.price;

                    const percentChange = ((diffPrice / preJewelPrice.price) * 100).toFixed(2);

                    retJewels.push({
                        name: todayJewelPrice.name,
                        price: todayJewelPrice.price,
                        diffPrice: diffPrice,
                        icon: todayJewelPrice.icon,
                        percent: percentChange,
                        grade: todayJewelPrice.grade
                    })
                }
            });
        });

        return res.status(200).json({
            success: true,
            jewelsPrice: retJewels,
            jewelPriceLastUpdate: sessionCache.get("jewelPriceLastUpdate")
        });

    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        // return res.status(500).json({ message: "Internal Server Error" });
    }
    finally {
        // DB 연결 해제
        if (connection) connection.release();
    }
}

// 보석 가격 차트 조회
exports.getJewelChartPrice = async (req, res, next) => {

    const { item } = req.query;

    // 로깅
    const referer = req.headers.referer || req.headers.origin;
    logger.info({
        method: req.method,
        url: req.url,
        message: `요청 Host: ${referer} 보석조회: ${item}`,
    });

    if (!referer || (!referer.includes('loagap.com') && !referer.includes('localhost'))) {
        return res.status(403).json({ message: 'Invalid host' });
    }

    // DB 연결
    const connection = await pool.getConnection();
    try {

        // 트랜잭션 시작
        await connection.beginTransaction();
        const selectSql = `SELECT BASE_DATE as date, name, price FROM (
                            SELECT BASE_DATE, jt.name, jt.price
                            FROM ITEM_PRICE_LOG,
                            JSON_TABLE(ITEM_DATA->'$."1"', '$[*]' COLUMNS (
                                name VARCHAR(100) PATH '$.name',
                                price INT PATH '$.price'
                            )) AS jt
                            WHERE ITEM_DVCD = '01'

                            UNION ALL

                            SELECT BASE_DATE, jt.name, jt.price
                            FROM ITEM_PRICE_LOG,
                            JSON_TABLE(ITEM_DATA->'$."2"', '$[*]' COLUMNS (
                                name VARCHAR(100) PATH '$.name',
                                price INT PATH '$.price'
                            )) AS jt
                            WHERE ITEM_DVCD = '01'

                            UNION ALL

                            SELECT BASE_DATE, jt.name, jt.price
                            FROM ITEM_PRICE_LOG,
                            JSON_TABLE(ITEM_DATA->'$."3"', '$[*]' COLUMNS (
                                name VARCHAR(100) PATH '$.name',
                                price INT PATH '$.price'
                            )) AS jt
                            WHERE ITEM_DVCD = '01'

                            UNION ALL

                            SELECT BASE_DATE, jt.name, jt.price
                            FROM ITEM_PRICE_LOG,
                            JSON_TABLE(ITEM_DATA->'$."4"', '$[*]' COLUMNS (
                                name VARCHAR(100) PATH '$.name',
                                price INT PATH '$.price'
                            )) AS jt
                            WHERE ITEM_DVCD = '01'

                            UNION ALL

                            SELECT BASE_DATE, jt.name, jt.price
                            FROM ITEM_PRICE_LOG,
                            JSON_TABLE(ITEM_DATA->'$."5"', '$[*]' COLUMNS (
                                name VARCHAR(100) PATH '$.name',
                                price INT PATH '$.price'
                            )) AS jt
                            WHERE ITEM_DVCD = '01'

                            UNION ALL

                            SELECT BASE_DATE, jt.name, jt.price
                            FROM ITEM_PRICE_LOG,
                            JSON_TABLE(ITEM_DATA->'$."6"', '$[*]' COLUMNS (
                                name VARCHAR(100) PATH '$.name',
                                price INT PATH '$.price'
                            )) AS jt
                            WHERE ITEM_DVCD = '01'

                            UNION ALL

                            SELECT BASE_DATE, jt.name, jt.price
                            FROM ITEM_PRICE_LOG,
                            JSON_TABLE(ITEM_DATA->'$."7"', '$[*]' COLUMNS (
                                name VARCHAR(100) PATH '$.name',
                                price INT PATH '$.price'
                            )) AS jt
                            WHERE ITEM_DVCD = '01'

                            UNION ALL

                            SELECT BASE_DATE, jt.name, jt.price
                            FROM ITEM_PRICE_LOG,
                            JSON_TABLE(ITEM_DATA->'$."8"', '$[*]' COLUMNS (
                                name VARCHAR(100) PATH '$.name',
                                price INT PATH '$.price'
                            )) AS jt
                            WHERE ITEM_DVCD = '01'

                            UNION ALL

                            SELECT BASE_DATE, jt.name, jt.price
                            FROM ITEM_PRICE_LOG,
                            JSON_TABLE(ITEM_DATA->'$."9"', '$[*]' COLUMNS (
                                name VARCHAR(100) PATH '$.name',
                                price INT PATH '$.price'
                            )) AS jt
                            WHERE ITEM_DVCD = '01'

                            UNION ALL

                            SELECT BASE_DATE, jt.name, jt.price
                            FROM ITEM_PRICE_LOG,
                            JSON_TABLE(ITEM_DATA->'$."10"', '$[*]' COLUMNS (
                                name VARCHAR(100) PATH '$.name',
                                price INT PATH '$.price'
                            )) AS jt
                            WHERE ITEM_DVCD = '01'
                            ) AS all_jewels
                            WHERE name = ?
                            AND BASE_DATE <> CURRENT_DATE
                            `
        let [jewelData] = await connection.execute(selectSql, [item]);

        // logger.info({
        //     method: req.method,
        //     url: req.url,  // 요청 URL
        //     message: `\nSql ${selectSql} \nParam ${[item]}`
        // });

        // 날자 포멧 변경
        jewelData = jewelData.map(item => ({
            ...item,
            date: formatDateString(item.date),
            time: formatDateString(item.date),
        }));

        // 현재 각인서 가격 조회 - 오늘 시세가지 차트에 적용
        // const nowjewelPricePre = await getJewelPrice();
        const nowjewelPricePre = sessionCache.get("jewelPrice");
        const nowjewelPrice = Object.keys(nowjewelPricePre).sort((a, b) => Number(b) - Number(a)) // 10 → 7 내림차순
            .flatMap((level) =>
                nowjewelPricePre[level]
                    .sort((a, b) => a.name.localeCompare(b.name))); // 이름 가나다 정렬

        nowjewelPrice.forEach(jewel => {
            if (jewel.name == item) {
                jewelData.push({
                    date: getDate(),
                    time: getDate(),
                    name: jewel.name,
                    price: jewel.price
                })
            }
        });

        return res.status(200).json({
            success: true,
            itemData: jewelData
        });

    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        // return res.status(500).json({ message: "Internal Server Error" });
    }
    finally {
        // DB 연결 해제
        if (connection) connection.release();
    }
}

// 악세 시세 조회
exports.getAccessoryPrice = async (req, res, next) => {

    // DB 연결
    const connection = await pool.getConnection();
    try {

        // 현재 각인서 가격 조회
        const nowAccessoryPrice = sessionCache.get("accessoryPrice");

        if (!nowAccessoryPrice) { // 캐쉬에 없을 경우 새로갱신
            return res.status(500).json({ message: "데이터 준비 중입니다. 잠시 후 다시 시도해주세요." });
        }

        // 트랜잭션 시작
        await connection.beginTransaction();

        // 전일자 DB
        const yesterday = getDate(-1).replaceAll("-", "");

        const selectSql = `SELECT 
                        ITEM_DATA AS ACCESSORYS_DATA
                    FROM ITEM_PRICE_LOG 
                        WHERE BASE_DATE = ? AND ITEM_DVCD = ?
                        `;

        const [rows] = await pool.query(selectSql, [yesterday, '03']);

        const preAccessoryPrice = rows[0]?.ACCESSORYS_DATA || [];

        // logger.info({
        //     method: req.method,
        //     url: req.url,  // 요청 URL
        //     message: `\nSql ${selectSql} \nParam ${[yesterday, '03']}`
        // });

        // nowAccessoryPrice.forEach(items => {
        //     console.log(items.title); // 상

        //     items.enhances.forEach(enhances =>{
        //         console.log(enhances.enhance); // 연마단계

        //         enhances.items.forEach(items =>{
        //             console.log(items.name);
        //             console.log(items.price);
        //             console.log(items.option);
        //         })
        //     })
        // })
        nowAccessoryPrice.forEach(nowItem => {
            const preItem = preAccessoryPrice.find(p => p.title === nowItem.title);
            if (!preItem) return;

            nowItem.enhances.forEach(nowEnhance => {
                const preEnhance = preItem.enhances.find(e => e.enhance === nowEnhance.enhance);
                if (!preEnhance) return;

                // 여기서 nowEnhance.items에 전일대비 값 추가해서 다시 넣는다.
                nowEnhance.items = calculatePriceDiff(preEnhance.items, nowEnhance.items);
            });
        });

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

        // const accessoryPrice = calculatePriceDiff()

        return res.status(200).json(
            {
                success: true,
                accessorysPrice: nowAccessoryPrice,
                accessoryPriceLastUpdate: sessionCache.get("accessoryPriceLastUpdate")
            }
        );

    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        // return res.status(500).json({ message: "Internal Server Error" });
    }
    finally {
        // DB 연결 해제
        if (connection) connection.release();
    }
}

// 악세서리 차트 조회
exports.getAccessoryChart = async (req, res, next) => {

    const { title, enhance, name, option, extra = '' } = req.query;

    // 로깅
    const referer = req.headers.referer || req.headers.origin;
    logger.info({
        method: req.method,
        url: req.url,
        message: `요청 Host: ${referer} 악세차트조회: ${title}, ${enhance}, ${name}, ${option}, ${extra}`,
    });

    if (!referer || (!referer.includes('loagap.com') && !referer.includes('localhost'))) {
        return res.status(403).json({ message: 'Invalid host' });
    }

    if (!title || !enhance || !name || !option) {
        return res.status(400).json({ message: '필수값 누락' });
    }

    // DB 연결
    const connection = await pool.getConnection();
    try {

        // 트랜잭션 시작
        await connection.beginTransaction();

        let selectSql = `
        SELECT 
            CAST(
                UNIX_TIMESTAMP(
                    CONCAT(DATE(MIN(FST_DTTI)), ' ', LPAD(FLOOR(HOUR(MIN(FST_DTTI)) / 4) * 4, 2, '0'), ':00:00')
                ) AS UNSIGNED
            ) AS time,
            MIN(PRICE) AS low,
            MAX(PRICE) AS high,
            SUBSTRING_INDEX(GROUP_CONCAT(PRICE ORDER BY FST_DTTI), ',', 1) AS open,
            SUBSTRING_INDEX(GROUP_CONCAT(PRICE ORDER BY FST_DTTI DESC), ',', 1) AS close
        FROM 
            ACCESSORY_PRICE_LOG
        WHERE 
            TITLE = ?
            AND ENHANCE = ?
            AND NAME = ?
            AND OPTION1 = ?
            AND (
            (? = 1 AND OPTION2 IS NULL)
            OR
            (? = 0 AND OPTION2 = ?)
            )
            AND PRICE > 0
            AND DL_YN = 'N'
        GROUP BY 
            DATE(FST_DTTI), FLOOR(HOUR(FST_DTTI) / 4)
        ORDER BY 
            time ASC
        `;

        const option2Value = extra === '' ? null : extra;
        const option2IsNull = option2Value == null ? 1 : 0;

        const params = [
            title,
            enhance,
            name,
            option,
            option2IsNull,
            option2IsNull,
            option2Value,
        ];
        const [rows] = await connection.execute(selectSql, params);

        const itemData = rows.map(item => ({
            time: Number(item.time),       // ← 문자열 → 숫자 변환
            low: Number(item.low),
            high: Number(item.high),
            open: Number(item.open),
            close: Number(item.close),
        }));

        // logger.info({
        //     method: req.method,
        //     url: req.url,  // 요청 URL
        //     message: `\nSql ${selectSql} \nParam ${params}`
        // });

        return res.status(200).json({
            success: true,
            itemData: itemData
        });

    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
    }
    finally {
        // DB 연결 해제
        if (connection) connection.release();
    }
}

// 마켓 재료 시세 조회
exports.getMarketPrice = async (req, res, next) => {

    // DB 연결
    const connection = await pool.getConnection();
    try {

        // 현재 각인서 가격 조회
        // const nowMarketPrice = sessionCache.get("marketPrice");
        const nowMarketPrice = await getMarketPrice();
        // 트랜잭션 시작
        const yesterday = getDate(-1).replaceAll("-", "");
        await connection.beginTransaction();
        const selectSql = `SELECT 
                ITEM_DATA AS MARKETS_DATA
              FROM ITEM_PRICE_LOG 
                WHERE BASE_DATE = ? AND ITEM_DVCD = ?
                 `;
        const [yesterdayPrice] = await connection.execute(selectSql, [yesterday, '04']);

        // logger.info({
        //     method: req.method,
        //     url: req.url,  // 요청 URL
        //     message: `\nSql ${selectSql} \nParam ${[yesterday, '02']}`
        // });

        const preMarketPrice = yesterdayPrice[0]?.MARKETS_DATA || [];

        const diffMarketPrice = {};
        for (const category in nowMarketPrice) {
            const nowItems = nowMarketPrice[category];
            const preItems = preMarketPrice[category] || [];

            diffMarketPrice[category] = nowItems.map(nowItem => {
                const preItem = preItems.find(p => p.name === nowItem.name);

                let priceDiff = null;
                let percentChange = null;

                if (preItem && typeof preItem.price === "number") {
                    priceDiff = nowItem.price - preItem.price;
                    if (preItem.price !== 0) {
                        percentChange = ((priceDiff / preItem.price) * 100).toFixed(2);
                    }
                }

                return {
                    ...nowItem,
                    priceDiff,
                    percent: percentChange,
                };
            });
        }

        return res.status(200).json({
            success: true,
            marketsPrice: diffMarketPrice,
            marketPriceLastUpdate: sessionCache.get("marketPriceLastUpdate")
        });

    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        // return res.status(500).json({ message: "Internal Server Error" });
    }
    finally {
        // DB 연결 해제
        if (connection) connection.release();
    }
}