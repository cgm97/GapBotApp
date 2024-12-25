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
        data.forEach(calender => {
            
    //  NO INT [pk, increment, note: '일련번호']
    // BASE_DATE VARCHAR(8) [pk, note: '기준일자']
    // TIME_TYPE CHAR(1) [pk, note: '시간 타입 (AM:0, PM:1)']
    // START_TIME JSON [note: '시작시간']
    // NAME VARCHAR(100) [note: '모험섬 이름']
    // REWARD_ITEMS JSON [note: '보상 아이템']
    // BONUS_REWARD_TYPE VARCHAR(100) [note: '주요 아이템']
    // IMG_URL VARCHAR(100) [note: '이미지 URL']
    // FST_DTTI TIMESTAMP [default: `CURRENT_TIMESTAMP`, note: '최초 등록 일자']
    // DL_YN CHAR(1) [default: 'N', note: '삭제 여부']
            if(calender.CategoryName == '모험 섬'){

                const groupedByDate = calender.StartTimes.reduce((acc, dateTime) => {
                    const date = dateTime.split('T')[0].replace(/-/g, ''); // 날짜만 추출 (2024-12-25 -> 20241225)
                    const time = dateTime.split('T')[1]; // 시간만 추출 (예: 19:00:00)
                
                    if (!acc[date]) {
                        acc[date] = { times: [] }; // 날짜 키가 없으면 초기화
                    }
                
                    acc[date].times.push(time);
                
                    return acc;
                }, {});
                
                arr.push(Object.entries(groupedByDate).map(([date, { times }]) => {
                    // 첫 번째 시간
                    const firstTime = times[0];
                
                    // 첫 번째 시간이 해당 날짜의 첫 시간이라면, 그 날짜의 모든 시간을 1로 설정
                    const allFirstTime = firstTime === '19:00:00'; // 19시가 첫 번째 시간인지 확인
                
                    return {
                        BASE_DATE: date, // 날짜 (모든 '-'를 제거한 값)
                        TIME_TYPE: allFirstTime ? 1 : 0, // 첫 번째 시간이 19시라면 전체 status를 1로 설정
                        START_TIME: times, // `time` 값만 포함된 배열
                        NAME: calender.ContentsName,
                        IMG_URL: calender.ContentsIcon
                    };
                }));
            }
        });

        logger.info({
            method: '매주 WED 10:01',
            url: 'CRON',  // 요청 URL
            message: `${JSON.stringify(arr, null, 2)}`,
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
