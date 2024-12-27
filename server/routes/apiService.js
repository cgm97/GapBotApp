const axios = require('axios');
const pool = require('../db/connection');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

exports.getGameContents = async (req, res, next) => {
    const API_URL = "https://developer-lostark.game.onstove.com/gamecontents/calendar";
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'accept': 'application/json',
                'authorization': `bearer ${process.env.LOA_API_KEY}`,
            },
        });
        
        res.status(200).json(response.data);
    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
    }
};

exports.getData = async (req, res, next) => {
    try {
        console.log("CICD TEST1");
        const [rows] = await pool.query('SELECT * FROM ISLAND_SCHEDULE WHERE DL_YN = "N" ORDER BY BASE_DATE ');
        res.status(200).json(rows);
    } catch (error) {
        next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
    }
}