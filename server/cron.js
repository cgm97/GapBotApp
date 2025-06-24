const cron = require('node-cron');
const axios = require('axios');
const logger = require('./logger');  // logger.js 임포트
const pool = require('./db/connection');
const { getBookPrice, getJewelPrice, getAccessoriesPrice, getDate } = require('./sessionUtil');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

const url = 'CRON';

// 매주 수요일 10시 1분에 실행 - 모험섬 정보
cron.schedule('1 10 * * 3', async () => { // async로 변경
    var method = '매주 WED 10:01 모험섬 데이터';
    logger.info({
        method: method,
        url: url,  // 요청 URL
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
            method: method,
            url: url,  // 요청 URL
            message: `데이터 불러오기 성공 ${data.length} 건`,
        });

        // 쿼리 실행 - 이전 데이터 DL_YN = Y 처리
        const updateSql = `UPDATE ISLAND_SCHEDULE
                            SET DL_YN = ?`;
        const [retDelete] = await connection.execute(updateSql, ["Y"]);
        logger.info({
            method: method,
            url: url,  // 요청 URL
            message: `이전 데이터 삭제처리 ${retDelete.affectedRows} 건`,
        });

        var arr = [];
        data.forEach(calender => {

            if (calender.CategoryName == '모험 섬') {

                const groupedByDate = calender.StartTimes ? calender.StartTimes.reduce((acc, dateTime) => {
                    const date = dateTime.split('T')[0].replace(/-/g, ''); // 날짜만 추출 (2024-12-25 -> 20241225)
                    const time = dateTime.split('T')[1]; // 시간만 추출 (예: 19:00:00)

                    if (!acc[date]) {
                        acc[date] = { times: [] }; // 날짜 키가 없으면 초기화
                    }

                    acc[date].times.push(time);

                    return acc;
                }, {}) : {};  // StartTimes가 null이면 빈 객체 반환

                arr.push(...Object.entries(groupedByDate).map(([date, { times }]) => {
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
        const promises = arr.map(island => {
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
            method: method,
            url: url,  // 요청 URL
            //message: `${JSON.stringify(arr, null, 2)} 모험섬 데이터 가공 종료`,
            message: `모험섬 데이터 ${totalAffectedRows}건 적재 완료 END`
        });
    } catch (error) {
        // 오류 발생 시 롤백
        await connection.rollback();
        // 에러 로깅
        logger.error({
            method: method,
            url: url,  // 요청 URL
            message: error.stack
        });
    } finally {
        // 연결 반환
        connection.release();
    }

});

// 매시 정각에 실행 - 공지사항 정보
cron.schedule('0 * * * *', async () => {
    var method = '매일 1시간마다';
    logger.info({
        method: method,
        url: url,  // 요청 URL
        message: '공지 저장 시작 START'
    });

    // 여기에 실제로 실행할 작업 코드 작성
    const connection = await pool.getConnection();
    const API_URL = "https://developer-lostark.game.onstove.com/news/notices";

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
            method: method,
            url: url,  // 요청 URL
            message: `데이터 불러오기 성공 ${data.length} 건`,
        });

        // 최신 공지가 현재 저장된 공지 이름이 같으면 변동사항이 없기 때문에 Pass처리
        const selectSql = `SELECT * FROM LOSTARK_NOTICE ORDER BY DATE DESC LIMIT 1`;
        const [retNotice] = await connection.execute(selectSql);

        if (retNotice.length > 0 && data[0].Title == retNotice[0].TITLE) {
            logger.info({
                method: method,
                url: url,  // 요청 URL
                message: `추가된 공지 데이터 없음 END`,
            });
            return;
        }

        // 쿼리 실행 - 이전 데이터 DL_YN = Y 처리
        const deleteSql = `DELETE FROM LOSTARK_NOTICE WHERE SNO != 0`;
        const [retDelete] = await connection.execute(deleteSql);
        logger.info({
            method: method,
            url: url,  // 요청 URL
            message: `이전 데이터 삭제처리 ${retDelete.affectedRows} 건`,
        });

        var arr = [];
        data.forEach(notice => {
            /* LOSTARK_NOTICE  Table
                SNO INT AUTO_INCREMENT PRIMARY KEY COMMENT '일련번호',
                TITLE VARCHAR(100) COMMENT '제목',
                TYPE VARCHAR(20) COMMENT '타입',
                URL VARCHAR(100) COMMENT '공지 URL'
                DATE 등록일자
            */
            arr.push(
                {
                    TITLE: notice.Title,
                    TYPE: notice.Type,
                    URL: notice.Link,
                    DATE: notice.Date
                }
            );
        });

        // 쿼리
        const insertSql = `INSERT INTO LOSTARK_NOTICE (
            TITLE,
            TYPE,
            URL,
            DATE
        ) VALUES (?, ?, ?, ?)`;

        // 쿼리 실행 (다중 insert Promise.all - 병렬처리)
        const promises = arr.map(notice => {
            return connection.execute(insertSql, [
                notice.TITLE,
                notice.TYPE,
                notice.URL,
                notice.DATE
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
            method: method,
            url: url,  // 요청 URL
            //message: `${JSON.stringify(arr, null, 2)} 모험섬 데이터 가공 종료`,
            message: `공지 데이터 ${totalAffectedRows}건 적재 완료 END`
        });
    } catch (error) {
        // 오류 발생 시 롤백
        await connection.rollback();
        // 에러 로깅
        logger.error({
            method: method,
            url: url,  // 요청 URL
            message: error.stack
        });
    } finally {
        // 연결 반환
        connection.release();
    }
});

// 매주 수요일 10시 1분에 실행 - 이벤트 정보
cron.schedule('1 10 * * 3', async () => { // async로 변경
    var method = '매주 WED 10:01 이벤트 데이터';
    logger.info({
        method: method,
        url: url,  // 요청 URL
        message: '이벤트 저장 시작 START'
    });

    // 여기에 실제로 실행할 작업 코드 작성
    const connection = await pool.getConnection();
    const API_URL = "https://developer-lostark.game.onstove.com/news/events";

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
            method: method,
            url: url,  // 요청 URL
            message: `데이터 불러오기 성공 ${data.length} 건`,
        });

        // 쿼리 실행 - 이전 데이터 DL_YN = Y 처리
        const deleteSql = `DELETE FROM LOSTARK_EVENT WHERE SNO != 0`;
        const [retDelete] = await connection.execute(deleteSql);
        logger.info({
            method: method,
            url: url,  // 요청 URL
            message: `이전 데이터 삭제처리 ${retDelete.affectedRows} 건`,
        });

        var arr = [];
        data.forEach(event => {
            /* LOSTARK_EVENT  Table
                SNO INT [pk, increment, note: '일련번호']
                TITLE VARCHAR(100) [note: '제목']
                URL VARCHAR(100) [note: '이벤트 URL']
                IMG_URL VARCHAR(100) [note: '이미지 URL']
            */
            arr.push(
                {
                    TITLE: event.Title,
                    URL: event.Link,
                    IMG_URL: event.Thumbnail
                }
            );
        });


        // 쿼리
        const insertSql = `INSERT INTO LOSTARK_EVENT (
            TITLE,
            URL,
            IMG_URL
        ) VALUES (?, ?, ?)`;
        // 쿼리 실행 (다중 insert Promise.all - 병렬처리)
        const promises = arr.map(event => {
            return connection.execute(insertSql, [
                event.TITLE,
                event.URL,
                event.IMG_URL
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
            method: method,
            url: url,  // 요청 URL
            //message: `${JSON.stringify(arr, null, 2)} 모험섬 데이터 가공 종료`,
            message: `이벤트 데이터 ${totalAffectedRows}건 적재 완료 END`
        });
    } catch (error) {
        // 오류 발생 시 롤백
        await connection.rollback();
        // 에러 로깅
        logger.error({
            method: method,
            url: url,  // 요청 URL
            message: error.stack
        });
    } finally {
        // 연결 반환
        connection.release();
    }
});

// 매일 0시 30분 _ 보석 조회
cron.schedule('30 0 * * *', async () => { // async로 변경
    var method = '매일 0시 30분 보석 데이터';
    logger.info({
        method: method,
        url: url,  // 요청 URL
        message: '보석 저장 시작 START'
    });

    // 여기에 실제로 실행할 작업 코드 작성
    const connection = await pool.getConnection();

    try {

        // 트랜잭션 시작
        await connection.beginTransaction();

        var jemArr = [];
        jemArr = await getJewelPrice();

        logger.info({
            method: method,
            url: url,  // 요청 URL
            message: `데이터 불러오기 성공 ${Object.keys(jemArr).length} 건`,
        });

        const today = new Date();

        // 년, 월, 일 구하기
        const year = today.getFullYear();  // 4자리 연도
        const month = (today.getMonth() + 1).toString().padStart(2, '0');  // 월 (0부터 시작하므로 +1, 두 자릿수로 만들기)
        const day = today.getDate().toString().padStart(2, '0');  // 일, 두 자릿수로 만들기

        // 'YYYYMMDD' 형식으로 결합
        const baseDate = `${year}${month}${day}`;

        console.log(baseDate);  // 예: 20250330

        // // 쿼리
        const insertSql = `INSERT INTO ITEM_PRICE_LOG (
                BASE_DATE,
                ITEM_DVCD,
                ITEM_DATA
            ) VALUES (?, ?, ?)`;

        connection.execute(insertSql, [
            baseDate,
            '01', // 보석 01
            jemArr
        ]);

        // 트랜잭션 커밋
        await connection.commit();
        logger.info({
            method: method,
            url: url,  // 요청 URL
            //message: `${JSON.stringify(arr, null, 2)} 모험섬 데이터 가공 종료`,
            message: `보석 데이터 ${Object.keys(jemArr).length}건 적재 완료 END`
        });
    } catch (error) {
        // 오류 발생 시 롤백
        await connection.rollback();
        // 에러 로깅
        logger.error({
            method: method,
            url: url,  // 요청 URL
            message: error.stack
        });
    } finally {
        // 연결 반환
        connection.release();
    }
});

// 매일 0시 30분_ 각인서 조회
cron.schedule('30 0 * * *', async () => { // async로 변경
    var method = '매일 0시 30분 각인서 데이터';
    logger.info({
        method: method,
        url: url,  // 요청 URL
        message: '각인서 저장 시작 START'
    });

    // 여기에 실제로 실행할 작업 코드 작성
    const connection = await pool.getConnection();
    try {

        // 트랜잭션 시작
        await connection.beginTransaction();

        var bookArr = [];
        bookArr = await getBookPrice();

        const today = new Date();

        // 년, 월, 일 구하기
        const year = today.getFullYear();  // 4자리 연도
        const month = (today.getMonth() + 1).toString().padStart(2, '0');  // 월 (0부터 시작하므로 +1, 두 자릿수로 만들기)
        const day = today.getDate().toString().padStart(2, '0');  // 일, 두 자릿수로 만들기

        // 'YYYYMMDD' 형식으로 결합
        const baseDate = `${year}${month}${day}`;

        // // 쿼리
        const insertSql = `INSERT INTO ITEM_PRICE_LOG (
                BASE_DATE,
                ITEM_DVCD,
                ITEM_DATA
            ) VALUES (?, ?, ?)`;

        connection.execute(insertSql, [
            baseDate,
            '02', // 아이템구분코드 _ 각인서 _ 02
            bookArr
        ]);

        // 트랜잭션 커밋
        await connection.commit();
        logger.info({
            method: method,
            url: url,  // 요청 URL
            //message: `${JSON.stringify(arr, null, 2)} 모험섬 데이터 가공 종료`,
            message: `유물 각인서 데이터 ${Object.keys(bookArr).length}건 적재 완료 END`
        });
    } catch (error) {
        // 오류 발생 시 롤백
        await connection.rollback();
        // 에러 로깅
        logger.error({
            method: method,
            url: url,  // 요청 URL
            message: error.stack
        });
    } finally {
        // 연결 반환
        connection.release();
    }
});

// 매일 0시 _ 악세서리 조회
cron.schedule('0 0 * * *', async () => { // async로 변경
    var method = '매일 0시 악세서리 데이터';
    logger.info({
        method: method,
        url: url,  // 요청 URL
        message: '악세서리 저장 시작 START'
    });

    // 여기에 실제로 실행할 작업 코드 작성
    const connection = await pool.getConnection();

    try {

        // 트랜잭션 시작
        await connection.beginTransaction();

        var accessArr = [];
        accessArr = await getAccessoriesPrice();

        logger.info({
            method: method,
            url: url,  // 요청 URL
            message: `데이터 불러오기 성공 ${Object.keys(accessArr).length} 건`,
        });

        // 'YYYYMMDD' 형식으로 결합
        const baseDate = getDate(0).replace(/-/g, ''); // 예: 20250620

        // // 쿼리
        const insertSql = `INSERT INTO ITEM_PRICE_LOG (
                BASE_DATE,
                ITEM_DVCD,
                ITEM_DATA
            ) VALUES (?, ?, ?)`;

        connection.execute(insertSql, [
            baseDate,
            '03', // 악세서리 03
            accessArr
        ]);

        // 트랜잭션 시작 - ACCESSORY_PRICE_LOG ChartData 용
        const accessoryPrice = accessArr; // 구조는 위와 동일

        await connection.beginTransaction();

        const insertSql1 = `
                INSERT INTO ACCESSORY_PRICE_LOG (
                BASE_DATE,
                TITLE,
                ENHANCE,
                NAME,
                OPTION1,
                OPTION2,
                PRICE
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                PRICE = VALUES(PRICE),
                FST_DTTI = CURRENT_TIMESTAMP,
                DL_YN = 'N'
            `;
        // 예: INSERT

        // "title": "상",
        // "enhances": [
        //     {
        //         "enhance": "1",
        //         "items": [
        //             {
        //                 "name": "목걸이",
        //                 "option": [
        //                     "적에게 주는 피해%", "추가 피해%"
        //                 ],
        //                 "price": 52999
        for (const { title, enhances } of accessoryPrice) {
            for (const { enhance, items } of enhances) {
                for (const item of items) {
                    const { name, price, option } = item;

                    await connection.execute(insertSql1, [
                        baseDate,
                        title,
                        enhance,
                        name,
                        option[0] || null,
                        option[1] || null,
                        price
                    ]);
                }
            }
        }

        // 트랜잭션 커밋
        await connection.commit();
        logger.info({
            method: method,
            url: url,  // 요청 URL
            //message: `${JSON.stringify(arr, null, 2)} 모험섬 데이터 가공 종료`,
            message: `악세서리 데이터 ${Object.keys(accessArr).length}건 적재 완료 END`
        });
    } catch (error) {
        // 오류 발생 시 롤백
        await connection.rollback();
        // 에러 로깅
        logger.error({
            method: method,
            url: url,  // 요청 URL
            message: error.stack
        });
    } finally {
        // 연결 반환
        connection.release();
    }
});

// 매일 60분마다 _ 악세서리 조회 (재갱신)
cron.schedule('*/60 * * * *', async () => { // async로 변경
    var method = '매 60분 악세서리 데이터';
    logger.info({
        method: method,
        url: url,  // 요청 URL
        message: '악세서리 조회 시작 START'
    });

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (hours === 0) {
        // 00시일 때는 실행하지 않음
        logger.info({
            method: method,
            url: url,  // 요청 URL
            message: '악세서리 조회 시작 END 0시 Pass'
        });
        return;
    }

    // 여기에 실제로 실행할 작업 코드 작성
    const connection = await pool.getConnection();
    try {

        // 트랜잭션 시작
        const baseDate = getDate(0).replace(/-/g, ''); // 예: 20250620
        const accessoryPrice = await getAccessoriesPrice(); // 구조는 위와 동일

        await connection.beginTransaction();

        const insertSql = `
                INSERT INTO ACCESSORY_PRICE_LOG (
                BASE_DATE,
                TITLE,
                ENHANCE,
                NAME,
                OPTION1,
                OPTION2,
                PRICE
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                PRICE = VALUES(PRICE),
                FST_DTTI = CURRENT_TIMESTAMP,
                DL_YN = 'N'
            `;
        // 예: INSERT

        // "title": "상",
        // "enhances": [
        //     {
        //         "enhance": "1",
        //         "items": [
        //             {
        //                 "name": "목걸이",
        //                 "option": [
        //                     "적에게 주는 피해%", "추가 피해%"
        //                 ],
        //                 "price": 52999
        for (const { title, enhances } of accessoryPrice) {
            for (const { enhance, items } of enhances) {
                for (const item of items) {
                    const { name, price, option } = item;

                    await connection.execute(insertSql, [
                        baseDate,
                        title,
                        enhance,
                        name,
                        option[0] || null,
                        option[1] || null,
                        price
                    ]);
                }
            }
        }

        logger.info({
            method: method,
            url: url,  // 요청 URL
            message: `악세서리 데이터 불러오기 성공 및 저장 ${Object.keys(accessoryPrice).length} 건`,
        });
        await connection.commit(); // 커밋
    } catch (error) {
        // 오류 발생 시 롤백
        await connection.rollback();
        // 에러 로깅
        logger.error({
            method: method,
            url: url,  // 요청 URL
            message: error.stack
        });
    } finally {
        // 연결 반환
        connection.release();
    }

});

// 매일 1분마다 보석, 각인서 갱신
cron.schedule('* * * * *', async () => {

    var method = '매 1분 각인서, 보석 데이터';

    logger.info({
        method: method,
        url: url,  // 요청 URL
        message: `Start`,
    });

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // 매일 0시 30분은 skip
    if (hours === 0 && minutes === 30) {
        logger.info({
            method: method,
            url: url,  // 요청 URL
            message: `0시 30분은 기존 배치로 처리됨 → skip`,
        });
        return;
    }

    try {
        await getBookPrice();; // 각인서
        await getJewelPrice(); // 보석

    } catch (error) {
        console.error('1분마다 작업 중 오류 발생:', error);
    }
    logger.info({
        method: method,
        url: url,  // 요청 URL
        message: `End`,
    });
});
module.exports = cron; // cron을 export하여 다른 파일에서 사용할 수 있게 함