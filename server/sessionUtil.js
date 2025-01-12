const sessionCache = new Map(); // Map 객체 생성
const pool = require('./db/connection');

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

module.exports = {
    sessionCache,
    initializeCache,
};
