const pool = require('../db/connection');
const logger = require('../logger');  // logger.js 임포트
const utils = require('../characterUtil');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

// 유각 가격 조회
exports.getBookPrice = async (req, res, next) => {

    const today = new Date();                // 오늘 날짜
    today.setDate(today.getDate() - 1);      // 하루 전으로 설정 (어제)

    const year = today.getFullYear();        // 연도
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 월 (0부터 시작하므로 +1)
    const day = today.getDate().toString().padStart(2, '0');          // 일

    const yesterday = `${year}${month}${day}`; // 'YYYYMMDD' 형식


    // DB 연결
    const connection = await pool.getConnection();
    try {

        // 현재 각인서 가격 조회
        const nowBookPrice = await utils.getBookPrice();

        console.log(nowBookPrice);
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
            message: `\nSql ${selectSql} \nParam ${[yesterday]}`
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
                        percent: percentChange
                    })
                }
            });
        });

        res.status(200).json({
            success: true,
            booksPrice: retBooks
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
        const [bookData] = await connection.execute(selectSql, [item, '02']);

        logger.info({
            method: req.method,
            url: req.url,  // 요청 URL
            message: `\nSql ${selectSql} \nParam ${[item]}`
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