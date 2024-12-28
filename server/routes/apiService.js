const axios = require('axios');
const pool = require('../db/connection');
const logger = require('../logger');  // logger.js 임포트
require('dotenv').config(); // .env 파일에서 환경 변수 로드

exports.getIsland = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ISLAND_SCHEDULE WHERE DL_YN = "N" ORDER BY BASE_DATE ');
        res.status(200).json(rows);
    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
    }
}

exports.getNotice = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM LOSTARK_NOTICE ORDER BY SNO ');
        res.status(200).json(rows);
    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
    }
}

exports.getEvent = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM LOSTARK_EVENT ORDER BY SNO ');
        console.log(rows)
        res.status(200).json(rows);
    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
    }
}
