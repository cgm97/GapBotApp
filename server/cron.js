const cron = require('node-cron');
const axios = require('axios');
const logger = require('./logger');  // logger.js 임포트
require('dotenv').config(); // .env 파일에서 환경 변수 로드

// 매주 수요일 10시 1분에 실행 - 모험섬 정보
// cron.schedule('1 10 * * 3', async () => { // async로 변경
cron.schedule('* * * * *', async () => { // 1분마다 실행

    logger.info({
        method: '매주 WED 10:01',
        url: 'CRON',  // 요청 URL
        message: '모험섬 저장 시작'
    });

    // 여기에 실제로 실행할 작업 코드 작성
    const API_URL = "https://developer-lostark.game.onstove.com/gamecontents/calendar";
    try {
        // await 사용
        const response = await axios.get(API_URL, {
            headers: {
                'accept': 'application/json',
                'authorization': `bearer ${process.env.LOA_API_KEY}`,
            },
        });

        // response.data를 사용
        const data = response.data;

        logger.info({
            method: '매주 WED 10:01',
            url: 'CRON',  // 요청 URL
            message: `모험섬 데이터 불러오기 성공 ${data.length} 건`,
        });

        var arr = [];
        data.array.forEach(calender => {
            
            if(calender.CategoryName == '모험 섬'){
                arr.push(calender.ContentsName);
            }
        });

        logger.info({
            method: '매주 WED 10:01',
            url: 'CRON',  // 요청 URL
            message: `모험섬 데이터 불러오기 성공 ${arr}`,
        });
    } catch (error) {
        // 에러 로깅
        logger.error({
            method: '매주 WED 10:01',
            url: 'CRON',  // 요청 URL
            message: error.message,
        });
    }

});

module.exports = cron; // cron을 export하여 다른 파일에서 사용할 수 있게 함
