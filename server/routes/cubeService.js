const pool = require('../db/connection');
const logger = require('../logger');  // logger.js 임포트
const jwt = require('jsonwebtoken');
const { sessionCache } = require('../sessionUtil'); // 세션 모듈 가져오기
require('dotenv').config(); // .env 파일에서 환경 변수 로드

// 유저 캐릭터 큐브 조회
exports.getCharacterCubeInfo = async (req, res, next) => {

    // DB 연결
    const connection = await pool.getConnection();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: "Access Token이 없습니다." });
        return;
    }
    
    try {
        // 토큰 추출
        const token = authHeader.split(' ')[1];
    
        // 토큰 검증 및 디코딩
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { USERNAME } = decoded;
    
        // 사용자 정보 조회 SQL
        const characterSql = `
            SELECT 
                CI.NICKNAME,
                CI.SERVER,
                CI.JOB,
                ROUND(CI.ITEM_LEVEL, 2) AS ITEM_LEVEL,
                CC.CUBES,
                true AS isSaveEnabled
            FROM 
                CHARACTER_INFO CI
            LEFT JOIN 
                CHARACTER_CUBE CC
            ON 
                CI.NICKNAME = CC.NICKNAME
            WHERE 
                CI.USERNAME = ? 
                AND CI.IS_LINKED = 'Y' 
                AND ITEM_LEVEL >= 1250 
                AND CI.DL_YN = 'N'
            ORDER BY 
                CI.ITEM_LEVEL DESC;
        `;
    
        // 큐브 정보 조회 SQL
        // const cubeInfoSql = `
        //     SELECT 
        //         NAME,
        //         LEVEL,
        //         CARD_EXP,
        //         JEWELRY,
        //         JEWELRY_PRICE,
        //         STONES,
        //         SILLING,
        //         ETC1,
        //         ETC2,
        //         ETC3
        //     FROM 
        //         CUBE_INFO
        //     WHERE 
        //         DL_YN = 'N'
        //     ORDER BY 
        //         LEVEL ASC;
        // `;
    
        // SQL 실행
        const [characterInfo] = await connection.execute(characterSql, [USERNAME]);
        // const [cubeInfo] = await connection.execute(cubeInfoSql);
    
        // 응답 데이터
        res.status(200).json({
            success: true,
            return: {
                characterInfo,
                cubeInfo:sessionCache.get("cubeInfo")
            }
        });
    
        // 로그 기록
        logger.info({
            method: req.method,
            url: req.url,
            message: `\nCharacter SQL: ${characterSql} \nParam: ${USERNAME}`
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

// 유저 캐릭터의 큐브 저장
exports.saveCubeInfo = async (req, res, next) => {

    const { NICKNAME, CUBES } = req.body;

    // DB 연결
    const connection = await pool.getConnection();
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        res.status(401).json({ message: "Access Token이 없습니다." });
        return;
    }

    try {
        // 토큰 추출
        const token = authHeader.split(' ')[1];
    
        // 토큰 검증 및 디코딩
        jwt.verify(token, process.env.JWT_SECRET);

        // 큐브 정보 조회 SQL
        const updateCubeInfoSql = `
                                UPDATE CHARACTER_CUBE
                                SET CUBES = ?
                                WHERE NICKNAME = ?;
                            `;
    
        // SQL 실행
        const [characterInfo] = await connection.execute(updateCubeInfoSql, [CUBES, NICKNAME]);
    
        // 응답 데이터
        res.status(200).json({
            success: true,
        });
    
        // 로그 기록
        logger.info({
            method: req.method,
            url: req.url,
            message: `\nCharacter SQL: ${updateCubeInfoSql} \nParam: ${[JSON.stringify(CUBES,null, 2), NICKNAME]}`
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