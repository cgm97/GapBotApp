const cron = require('node-cron');
const axios = require('axios');
const logger = require('./logger');  // logger.js 임포트
const pool = require('./db/connection');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

// 매주 수요일 10시 1분에 실행 - 모험섬 정보
// cron.schedule('* * * * *', async () => { // 1분마다 실행
cron.schedule('1 10 * * 3', async () => { // async로 변경

    logger.info({
        method: '매주 WED 10:01',
        url: 'CRON',  // 요청 URL
        message: '모험섬 저장 시작 START'
    });

    // 여기에 실제로 실행할 작업 코드 작성
    const connection = await pool.getConnection();
    const API_URL = "https://developer-lostark.game.onstove.com/gamecontents/calendar";

    try {

        // 트랜잭션 시작
        await connection.beginTransaction();

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
            method: '매주 WED 10:01 모험섬 데이터',
            url: '[CRON]',  // 요청 URL
            message: `데이터 불러오기 성공 ${data.length} 건`,
        });

        // 쿼리 실행 - 이전 데이터 DL_YN = Y 처리
        const updateSql = `UPDATE ISLAND_SCHEDULE
                            SET DL_YN = ?`;
        const [retDelete] = await connection.execute(updateSql, ["Y"]);
        logger.info({
            method: '매주 WED 10:01 모험섬 데이터',
            url: '[CRON]',  // 요청 URL
            message: `이전 데이터 삭제처리 ${retDelete.affectedRows} 건`,
        });

        var arr = [];
        data.forEach(calender => {

            if (calender.CategoryName == '모험 섬') {

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

                    // RewardItems 배열 순회
                    let category = '';
                    calender.RewardItems.forEach(reward => {
                        if (reward.Items && Array.isArray(reward.Items)) {
                            reward.Items.forEach(item => {
                                if (item.StartTimes && Array.isArray(item.StartTimes)) {
                                    // 아이템의 StartTimes에서 날짜만 추출하여 비교
                                    item.StartTimes.forEach(startTime => {
                                        const startDate = startTime.split('T')[0].replace(/-/g, ''); // 날짜 부분만 추출
                                        const isItemOnTargetDate = startDate === date; // 날짜 비교

                                        if (isItemOnTargetDate) {
                                            if (item.Name.includes("골드")) {
                                                category = "골드";
                                            } else if (item.Name.includes("카드")) {
                                                category = "카드";
                                            } else if (item.Name.includes("주화")) {
                                                category = "주화";
                                            } else if (item.Name.includes("실링")) {
                                                category = "실링";
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });

                    /* ISLAND_SCHEDULE Table
                        SNO INT [pk, increment, note: '일련번호']
                        BASE_DATE VARCHAR(8) [pk, note: '기준일자']
                        TIME_TYPE CHAR(1) [pk, note: '시간 타입 (AM:0, PM:1)']
                        NAME VARCHAR(100) [note: '모험섬 이름']
                        START_TIME JSON [note: '시작시간']
                        REWARD_ITEMS JSON [note: '보상 아이템']
                        BONUS_REWARD_TYPE VARCHAR(100) [note: '주요 아이템']
                        IMG_URL VARCHAR(100) [note: '이미지 URL']
                        FST_DTTI TIMESTAMP [default: `CURRENT_TIMESTAMP`, note: '최초 등록 일자']
                        DL_YN CHAR(1) [default: 'N', note: '삭제 여부']
                    */
                    return {
                        BASE_DATE: date,                 // 날짜 (모든 '-'를 제거한 값)
                        TIME_TYPE: allFirstTime ? 1 : 0, // 첫 번째 시간이 19시라면 전체 status를 1로 설정
                        NAME: calender.ContentsName,
                        START_TIME: times || [],  // `time` 값만 포함된 배열
                        REWARD_ITEMS: calender.RewardItems || {},
                        BONUS_REWARD_TYPE: category,
                        IMG_URL: calender.ContentsIcon || ''
                    };
                }));
            }
        });

        // 쿼리
        const insertSql = `INSERT INTO ISLAND_SCHEDULE (
            BASE_DATE,
            TIME_TYPE,
            NAME,
            START_TIME,
            REWARD_ITEMS,
            BONUS_REWARD_TYPE,
            IMG_URL
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        // 쿼리 실행 (다중 insert Promise.all - 병렬처리)
        const promises = arr.flat().map(island => {
            return connection.execute(insertSql, [
                island.BASE_DATE,
                island.TIME_TYPE,
                island.NAME,
                JSON.stringify(island.START_TIME) || '[]',  // START_TIME이 없으면 빈 배열로 처리
                JSON.stringify(island.REWARD_ITEMS) || '{}', // REWARD_ITEMS가 없으면 빈 객체로 처리
                island.BONUS_REWARD_TYPE || '',  // BONUS_REWARD_TYPE이 없으면 빈 문자열로 처리
                island.IMG_URL || ''  // IMG_URL이 없으면 빈 문자열로 처리
            ]);
        });
        const retInsert = await Promise.all(promises);

        // 각 삽입 작업의 결과에서 affectedRows 출력
        let totalAffectedRows = 0;
        retInsert.forEach(result => {
            totalAffectedRows += result[0].affectedRows;  // 결과는 배열로 반환되므로 result[0]에 접근
        });

        // 트랜잭션 커밋
        await connection.commit();
        logger.info({
            method: '매주 WED 10:01 모험섬 데이터',
            url: '[CRON]',  // 요청 URL
            //message: `${JSON.stringify(arr, null, 2)} 모험섬 데이터 가공 종료`,
            message: `모험섬 데이터 ${totalAffectedRows}건 적재 완료 END`
        });
    } catch (error) {
        // 오류 발생 시 롤백
        await connection.rollback();
        // 에러 로깅
        logger.error({
            method: '매주 WED 10:01 모험섬 데이터',
            url: '[CRON]',  // 요청 URL
            message: error.stack
        });
    } finally {
        // 연결 반환
        connection.release();
    }

});

module.exports = cron; // cron을 export하여 다른 파일에서 사용할 수 있게 함
