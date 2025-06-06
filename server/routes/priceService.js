const { Console } = require('winston/lib/winston/transports');
const pool = require('../db/connection');
const logger = require('../logger');  // logger.js 임포트
const { sessionCache, getBookPrice, getDate, getJewelPrice } = require('../sessionUtil'); // 캐시 모듈 가져오기
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
        const nowBookPrice = await getBookPrice();

        // 트랜잭션 시작
        await connection.beginTransaction();
        const selectSql = `SELECT 
                ITEM_DATA AS BOOKS_DATA
              FROM ITEM_PRICE_LOG 
                WHERE BASE_DATE = ? AND ITEM_DVCD = ?
                 `;
        const [yesterdayPrice] = await connection.execute(selectSql, [yesterday, '02']);

        logger.info({
            method: req.method,
            url: req.url,  // 요청 URL
            message: `\nSql ${selectSql} \nParam ${[yesterday, '02']}`
        });

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

        res.status(200).json({
            success: true,
            booksPrice: retBooks,
            bookPriceLastUpdate: sessionCache.get("bookPriceLastUpdate")
        });

    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        res.status(500).json({ message: "Internal Server Error" });
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
        message: `요청 Host: ${referer} 유각조회: ${item}`,
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
                            AND ITEM_DVCD = ?`;
        let [bookData] = await connection.execute(selectSql, [item, '02']);

        logger.info({
            method: req.method,
            url: req.url,  // 요청 URL
            message: `\nSql ${selectSql} \nParam ${[item]}`
        });

        // 날자 포멧 변경
        bookData = bookData.map(item => ({
            ...item,
            date: formatDateString(item.date),
        }));

        // 현재 각인서 가격 조회 - 오늘 시세가지 차트에 적용
        const nowBookPrice = await getBookPrice();
        nowBookPrice.forEach(book => {
            if (book.name == item) {
                bookData.push({
                    date: getDate(),
                    name: book.name,
                    price: book.price
                })
            }
        });

        res.status(200).json({
            success: true,
            itemData: bookData
        });

    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        res.status(500).json({ message: "Internal Server Error" });
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
        const nowJewelPricePre = await getJewelPrice();

        // 트랜잭션 시작
        await connection.beginTransaction();
        const selectSql = `SELECT 
                ITEM_DATA AS JEWELS_DATA
              FROM ITEM_PRICE_LOG 
                WHERE BASE_DATE = ? AND ITEM_DVCD = ?
                 `;
        const [yesterdayPrice] = await connection.execute(selectSql, [yesterday, '01']);

        logger.info({
            method: req.method,
            url: req.url,  // 요청 URL
            message: `\nSql ${selectSql} \nParam ${[yesterday, '01']}`
        });

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
                        percent: percentChange
                    })
                }
            });
        });

        res.status(200).json({
            success: true,
            jewelsPrice: retJewels,
            jewelPriceLastUpdate: sessionCache.get("jewelPriceLastUpdate")
        });

    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        res.status(500).json({ message: "Internal Server Error" });
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
                            `
        let [jewelData] = await connection.execute(selectSql, [item]);

        logger.info({
            method: req.method,
            url: req.url,  // 요청 URL
            message: `\nSql ${selectSql} \nParam ${[item]}`
        });

        // 날자 포멧 변경
        jewelData = jewelData.map(item => ({
            ...item,
            date: formatDateString(item.date),
        }));

        // 현재 각인서 가격 조회 - 오늘 시세가지 차트에 적용
        const nowjewelPricePre = await getJewelPrice();
        const nowjewelPrice = Object.keys(nowjewelPricePre).sort((a, b) => Number(b) - Number(a)) // 10 → 7 내림차순
            .flatMap((level) =>
                nowjewelPricePre[level]
                    .sort((a, b) => a.name.localeCompare(b.name))); // 이름 가나다 정렬

        nowjewelPrice.forEach(jewel => {
            if (jewel.name == item) {
                jewelData.push({
                    date: getDate(),
                    name: jewel.name,
                    price: jewel.price
                })
            }
        });

        res.status(200).json({
            success: true,
            itemData: jewelData
        });

    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        res.status(500).json({ message: "Internal Server Error" });
    }
    finally {
        // DB 연결 해제
        if (connection) connection.release();
    }
}