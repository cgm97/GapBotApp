const axios = require('axios');
const pool = require('../db/connection');
const logger = require('../logger');  // logger.js 임포트
const spec = require('../calculator/specPoint');
const { sessionCache, getDateTime } = require('../sessionUtil'); // 세션 모듈 가져오기

// 재련강화확률표
const ENHANCEMENTDATA = [
  { step: 1, chance: 100, bonusChance: 100 },
  { step: 2, chance: 100, bonusChance: 100 },
  { step: 3, chance: 50, bonusChance: 27.91 },
  { step: 4, chance: 50, bonusChance: 27.91 },
  { step: 5, chance: 30, bonusChance: 18.60 },
  { step: 6, chance: 30, bonusChance: 18.60 },
  { step: 7, chance: 20, bonusChance: 13.95 },
  { step: 8, chance: 20, bonusChance: 13.95 },
  { step: 9, chance: 15, bonusChance: 11.63 },
  { step: 10, chance: 15, bonusChance: 11.63 },
  { step: 11, chance: 10, bonusChance: 9.30 },
  { step: 12, chance: 10, bonusChance: 9.30 },
  { step: 13, chance: 10, bonusChance: 9.30 },
  { step: 14, chance: 5, bonusChance: 4.65 },
  { step: 15, chance: 4, bonusChance: 1.86 },
  { step: 16, chance: 4, bonusChance: 1.86 },
  { step: 17, chance: 3, bonusChance: 1.40 },
  { step: 18, chance: 3, bonusChance: 1.40 },
  { step: 19, chance: 3, bonusChance: 1.40 },
  { step: 20, chance: 1.5, bonusChance: 0.70 },
  { step: 21, chance: 1.5, bonusChance: 0.70 },
  { step: 22, chance: 1, bonusChance: 0.47 },
  { step: 23, chance: 1, bonusChance: 0.47 },
  { step: 24, chance: 0.5, bonusChance: 0.23 },
  { step: 25, chance: 0.5, bonusChance: 0.23 }
];

// 시간계산
function toDate(dateTimeStr) {
  var parts = dateTimeStr.split(" "); // 날짜와 시간을 분리
  var dateParts = parts[0].split("-"); // 날짜를 분리 (YYYY-MM-DD)
  var timeParts = parts[1].split(":"); // 시간을 분리 (HH:mm:ss)

  return new Date(
    parseInt(dateParts[0]), // 년
    parseInt(dateParts[1]) - 1, // 월 (0부터 시작하므로 -1 필요)
    parseInt(dateParts[2]), // 일
    parseInt(timeParts[0]), // 시
    parseInt(timeParts[1]), // 분
    parseInt(timeParts[2]) // 초
  );
}

// 전체 큐브 보상아이템 합계 게산
const calculateCubes = (cubes) => {
  const retReward = [];

  cubes.forEach(cube => {
    // cube.type과 일치하는 cubeInfo 찾기
    const cubeData = sessionCache.get("cubeInfo").find(info => info.NAME === cube.name);

    if (cubeData) {
      const { CARD_EXP, JEWELRY, JEWELRY_PRICE, STONES, SILLING, ETC1, ETC2, ETC3 } = cubeData;

      let totalCardExp = 0;
      let totalJewelry = 0;
      let totalJewelryPrice = 0;
      let totalStones = 0;
      let totalSelling = 0;
      let totalEtc1 = 0;
      let totalEtc2 = 0;
      let totalEtc3 = 0;

      // cube.count 만큼 반복하여 보상 계산
      for (let i = 0; i < cube.count; i++) {
        totalCardExp += CARD_EXP;
        totalJewelry += JEWELRY;
        totalJewelryPrice += JEWELRY_PRICE;
        totalStones += STONES;
        totalSelling += SILLING;
        totalEtc1 += ETC1;
        totalEtc2 += ETC2;
        totalEtc3 += ETC3;
      }

      // retReward 배열에 푸시
      retReward.push({
        name: cube.name,
        reward: {
          count: cube.count,
          cardExp: totalCardExp,
          jewelry: totalJewelry,
          jewelryGrade: calculatejewelryGrad(totalJewelry),
          jewelryPrice: totalJewelryPrice,
          stones: totalStones,
          selling: totalSelling,
          etc1: totalEtc1,
          etc2: totalEtc2,
          etc3: totalEtc3
        }
      });
    }
  });

  return retReward;
};

// 모든 캐릭의 총합
function calculateTotalRewards(characterInfo) {
  let totalGold = 0;
  let totalSiling = 0;
  let totalCardExp = 0;
  let totalJewelry3Tier = 0;  // 금제 (3티어)
  let totalJewelry4Tier = 0;  // 해금 (4티어)

  characterInfo.forEach((character) => {
    const calculatedCubes = calculateCubes(character.CUBES); // 기존 calculateCubes 호출

    calculatedCubes.forEach((cube) => {
      totalGold += cube.reward.jewelryPrice;
      totalSiling += cube.reward.selling;
      totalCardExp += cube.reward.cardExp;

      // 후처리에서 cube.name에 따라 보석을 구분하여 합산
      if (cube.name.includes("금제")) {
        totalJewelry3Tier += cube.reward.jewelry;  // 금제 (3티어)
      } else if (cube.name.includes("해금")) {
        totalJewelry4Tier += cube.reward.jewelry;  // 해금 (4티어)
      }
    });
  });

  return {
    gold: totalGold,
    siling: totalSiling,
    cardExp: totalCardExp,
    total3jews: totalJewelry3Tier, // 금제 (3티어) 보석 합계
    total3jewsGrade: calculatejewelryGrad(totalJewelry3Tier),
    total4jews: totalJewelry4Tier, // 해금 (4티어) 보석 합계
    total4jewsGrade: calculatejewelryGrad(totalJewelry4Tier),
  };
}

// 보석 등급 계산 (1레벨 -> 최대한 레벨올리기)
function calculatejewelryGrad(totalJewelry) {
  const levelRequirements = [1, 3, 9, 27, 81, 243, 729, 2187, 6561, 19683];
  const levelCounts = [];
  let remainingJewels = totalJewelry;

  for (let level = levelRequirements.length - 1; level >= 0; level--) {
    const requiredForNextLevel = levelRequirements[level];
    if (remainingJewels >= requiredForNextLevel) {
      const countForLevel = Math.floor(remainingJewels / requiredForNextLevel);
      levelCounts.push({ level: level + 1, count: countForLevel });
      remainingJewels -= countForLevel * requiredForNextLevel;
    }
  }

  return levelCounts;
}

exports.getCharacterCube = async (req, res, next) => {

  const { roomCode, userCode } = req.query;
  console.log(roomCode, userCode);
  const connection = await pool.getConnection();
  try {
    // 트랜잭션 시작
    await connection.beginTransaction();
    const selectSql = `SELECT 
            CI.NICKNAME,
            CI.SERVER,
            CI.JOB,
            ROUND(CI.ITEM_LEVEL, 2) AS ITEM_LEVEL,
            CC.CUBES
        FROM 
            CHARACTER_INFO CI
        LEFT JOIN 
            CHARACTER_CUBE CC
        ON 
            CI.NICKNAME = CC.NICKNAME
        WHERE 
            CI.USERNAME = (SELECT
                            USERNAME
                           FROM USER_INFO
                        WHERE ROOM_CODE=?
                          AND USER_CODE=?
                        ) 
            AND CI.IS_LINKED = 'Y' 
            AND ITEM_LEVEL >= 1250 
            AND CI.DL_YN = 'N'
        ORDER BY 
            CI.ITEM_LEVEL DESC`

    const [cubeInfo] = await connection.execute(selectSql, [roomCode, userCode]);

    logger.info({
      method: req.method,
      url: req.url,  // 요청 URL
      message: `\nSql ${selectSql} \nParam ${[roomCode, userCode]}`
    });

    let retJson = {};
    retJson.cubes = cubeInfo.map(character => {
      return {
        nickName: character.NICKNAME,       // NICKNAME 값을 반환
        itemLevel: character.ITEM_LEVEL,
        server: character.SERVER,           // SERVER 값을 반환
        job: character.JOB,                 // JOB 값을 반환
        cubes: calculateCubes(character.CUBES)   // calculateCubes 함수의 결과 반환
      };
    });

    // 총 합계
    retJson.totalRewards = calculateTotalRewards(cubeInfo);

    // 트랜잭션 커밋
    await connection.commit();

    if (cubeInfo.length == 0) {
      retJson = {};
    }
    res.status(200).send(retJson);
  } catch (err) {
    // 오류 발생 시 롤백
    await connection.rollback();
    next(new Error(err));  // 에러 객체를 넘겨서 next 미들웨어로 전달
    res.status(400).send('잘못된 요청입니다.');
  } finally {
    // DB 연결 해제
    if (connection) connection.release();
  }

}

exports.getBangleOption = async (req, res, next) => {
  try {
    const { nickName } = req.query;
    res.status(200).json(await spec.getBangleOption(nickName));
  } catch (error) {
    next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
  }
}

exports.getAccValue = async (req, res, next) => {
  try {
    const { nickName } = req.query;
    res.status(200).json(await spec.getAccValue(nickName));
  } catch (error) {
    next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
  }
}

exports.getJewelsLog = async (req, res, next) => {
  const connection = await pool.getConnection();

  const { date } = req.query;

  if (!date) {
    res.status(400).send('날짜를 입력해주세요.');
  }

  const todayDate = date;

  // 연, 월, 일 추출
  const year = parseInt(date.substring(0, 4), 10);
  const month = parseInt(date.substring(4, 6), 10) - 1; // JS의 월은 0부터 시작
  const day = parseInt(date.substring(6, 8), 10);

  // 어제 날짜 구하기
  const yesterday = new Date(year, month, day);
  yesterday.setDate(yesterday.getDate() - 1);  // 어제 날짜로 설정

  const yearYesterday = yesterday.getFullYear();
  const monthYesterday = (yesterday.getMonth() + 1).toString().padStart(2, '0');
  const dayYesterday = yesterday.getDate().toString().padStart(2, '0');
  const yesterdayDate = `${yearYesterday}${monthYesterday}${dayYesterday}`;  // 'YYYYMMDD' 형식

  try {
    // 트랜잭션 시작
    await connection.beginTransaction();
    const selectSql = `SELECT 
          ITEM_DATA AS JEWELS_DATA
        FROM ITEM_PRICE_LOG 
          WHERE BASE_DATE = ? AND ITEM_DVCD = ?
           `;

    const [todayPrice] = await connection.execute(selectSql, [todayDate, '01']);
    const [yesterdayPrice] = await connection.execute(selectSql, [yesterdayDate, '01']);

    logger.info({
      method: req.method,
      url: req.url,  // 요청 URL
      message: `\nSql ${selectSql} \nParam ${[todayDate, yesterdayDate]}`
    });

    let retJson = {};
    let todayArr = [];
    let yesterdayArr = [];

    const todayKeys = Object.keys(todayPrice[0]?.JEWELS_DATA || {});
    const yesterdayKeys = Object.keys(yesterdayPrice[0]?.JEWELS_DATA || {});

    // 오늘 가격 배열 만들기
    for (let i = 0; i < todayKeys.length; i++) {
      const key = todayKeys[i];
      todayArr.push(...todayPrice[0].JEWELS_DATA[key]);
    }

    // 어제 가격 배열 만들기
    for (let i = 0; i < yesterdayKeys.length; i++) {
      const key = yesterdayKeys[i];
      yesterdayArr.push(...yesterdayPrice[0].JEWELS_DATA[key]);
    }

    // 오늘 가격과 어제 가격 차이 계산
    todayArr.forEach(todayItem => {
      // 같은 이름의 보석을 어제 배열에서 찾기
      const yesterdayItem = yesterdayArr.find(yesterdayItem => yesterdayItem.name === todayItem.name);

      if (yesterdayItem) {
        // 가격 차이 계산
        const priceDifference = todayItem.price - yesterdayItem.price;

        // retJson에 추가
        retJson[todayItem.name] = {
          todayPrice: todayItem.price,
          yesterdayPrice: yesterdayItem.price,
          priceDifference: priceDifference
        };
      }
    });

    res.status(200).send(retJson);
  } catch (err) {
    // 오류 발생 시 롤백
    await connection.rollback();
    next(new Error(err));  // 에러 객체를 넘겨서 next 미들웨어로 전달
    res.status(400).send('잘못된 요청입니다.');
  } finally {
    // DB 연결 해제
    if (connection) connection.release();
  }
}

exports.getBooksLog = async (req, res, next) => {
  const connection = await pool.getConnection();

  const { date } = req.query;

  if (!date) {
    res.status(400).send('날짜를 입력해주세요.');
  }

  try {
    // 트랜잭션 시작
    await connection.beginTransaction();
    const selectSql = `SELECT 
            ITEM_DATA AS BOOKS_DATA
          FROM ITEM_PRICE_LOG 
            WHERE BASE_DATE = ? AND ITEM_DVCD = ?
             `;
    const [yesterdayPrice] = await connection.execute(selectSql, [date, '02']);

    logger.info({
      method: req.method,
      url: req.url,  // 요청 URL
      message: `\nSql ${selectSql} \nParam ${[date]}`
    });

    let retJson = yesterdayPrice[0]?.BOOKS_DATA || [];


    res.status(200).send(retJson);
  } catch (err) {
    // 오류 발생 시 롤백
    await connection.rollback();
    next(new Error(err));  // 
  } finally {
    // DB 연결 해제
    if (connection) connection.release();
  }
}

// 재련강화
exports.executeEnhance = async (req, res, next) => {

  let { userId, userName, roomId, roomName, site } = req.body;

  // LOAGAP 재련으로 들어왔을경우
  if (site == "Y") {
    if(!userId || !roomId){
      return res.status(200).send(
        "필수 파라미터가 누락되었습니다."
      );
    }
  }
  else {
    if (!userId || !userName || !roomId || !roomName) {
      return res.status(200).send(
        "필수 파라미터가 누락되었습니다."
      );
    }
  }

  const connection = await pool.getConnection();
  try {
    // 트랜잭션 시작
    await connection.beginTransaction();

    // USER_CODE
    const selectSql = `
      SELECT 
        A.STEP, 
        A.BONUS, 
        CAST(DATE_FORMAT(A.ACHIEVE_DTTI, '%Y-%m-%d %H:%i:%s') AS CHAR) AS ACHIEVE_DTTI,
        CAST(DATE_FORMAT(A.LST_DTTI, '%Y-%m-%d %H:%i:%s') AS CHAR) AS LST_DTTI,
        B.NICKNAME,
        A.SUCCESS_CNT,
        A.FAIL_CNT,
        A.USER_NAME,
        A.ROOM_NAME
      FROM BOT_ENHANCE_STATUS A
      LEFT JOIN USER_INFO B
        ON A.USER_ID = B.USER_CODE
      AND A.ROOM_ID = B.ROOM_CODE
      WHERE A.USER_ID = ?
        AND A.ROOM_ID = ?
    `;

    const [selectReInfo] = await connection.execute(selectSql, [userId, roomId]);

    logger.info({
      method: req.method,
      url: req.url,  // 요청 URL
      message: `\nSql ${selectSql} \nParam ${[userId, roomId]}`
    });

    const userRefInfo = (Array.isArray(selectReInfo) && selectReInfo.length > 0)
      ? selectReInfo[0]
      : {};  // 결과가 없을 경우 초기값

    // LOAGAP 사이트에선 초기 데이터 없을 경우 불가능
    if (site === "Y") {
      if (!userRefInfo || Object.keys(userRefInfo).length === 0) {
        return res.status(200).send(
          "재련 시뮬레이션은 본인의 채팅방에서 최초 1회 실행되어야 합니다.",
        );
      } else {
        userName = userRefInfo.USER_NAME;
        roomName = userRefInfo.ROOM_NAME;
      }
    }
    // 유저 재련 정보
    let currentDate = getDateTime();
    let currentStep = userRefInfo.STEP || 0;
    let nextStep = currentStep + 1;
    let bonus = userRefInfo.BONUS || 0.00;
    let bonusOrg = userRefInfo.BONUS || 0.00;
    let achieveDtti = userRefInfo.ACHIEVE_DTTI || null;
    let lstDtti = userRefInfo.LST_DTTI || null;
    let nickName = userRefInfo.NICKNAME || "UNKNOWN";
    let successCnt = userRefInfo.SUCCESS_CNT || 0;
    let failCnt = userRefInfo.FAIL_CNT || 0;
    let msg = "";

    // 현재 단계의 강화데이터 조히
    const nextData = ENHANCEMENTDATA.find(e => e.step === nextStep);

    if (!nextData) {
      msg = `🏆 ${userName}님은 이미 **최대 강화 단계(25)**에 도달했습니다!`;
      return res.status(200).send(msg);
    } else {

      if (lstDtti != null) {
        var baseTime = 10 * 60 * 1000; // 10분

        var nowDate = toDate(currentDate);
        var lastChatDate = toDate(lstDtti);

        var checkTime = nowDate - lastChatDate;

        if (checkTime < baseTime) {
          var remainingTime = baseTime - checkTime;
          var minutes = Math.floor(remainingTime / 60000);
          var seconds = Math.floor((remainingTime % 60000) / 1000);

          msg += `⏳ [쿨타임 대기 중]\n\n${userName}님\n`;
          msg += `🕒 남은 시간: ${minutes > 0 ? minutes + "분 " : ""}${seconds}초`;

          return res.status(200).send(msg);
        }
      }
    }

    // 강화 확률 계산
    let successChance = nextData.chance;

    let successChanceTxt = "";
    if (bonus == 100) {
      successChanceTxt = "🎯 성공 확률: 100% (장기백ㅊㅊ!)\n";
    } else {
      successChanceTxt = `🎯 성공 확률: ${successChance}%\n`;
    }

    // 강화 시도
    const randomValue = Math.random() * 100; // 0~100 사이의 난수

    if (randomValue < successChance || bonus == 100) {
      // 강화 성공
      msg += `🎉 [재련 성공]\n\n`;
      msg += successChanceTxt;
      msg += `📌 ${userName}님, 강화에 성공했습니다!\n`;
      msg += `🔨 단계: ${currentStep} ➝ ${nextStep}\n`;
      msg += `✨ 장인의 기운이 초기화`;
      bonus = 0; // 장인의 기운 초기화
      achieveDtti = currentDate;
      currentStep = nextStep;
      successCnt++;
    } else {
      // 강화 실패
      bonus = Number(bonus) + Number(nextData.bonusChance);
      if (bonus > 100) bonus = 100;
      msg += `💥 [재련 실패]\n\n`;
      msg += successChanceTxt;
      msg += `📌 ${userName}님, 강화에 실패했습니다.\n`;
      msg += `🔨 단계 유지: ${currentStep}\n`;
      msg += `✨ 장인의 기운 ${Number(bonusOrg).toFixed(2)}% ➝ ${Number(bonus).toFixed(2)}%`;
      failCnt++;
    }

    const refinmInsertSql = `
            INSERT INTO BOT_ENHANCE_STATUS (
                USER_ID, ROOM_ID, USER_NAME, ROOM_NAME, STEP, BONUS, ACHIEVE_DTTI, LST_DTTI, USERNAME, SUCCESS_CNT, FAIL_CNT
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
            ON DUPLICATE KEY UPDATE
                USER_NAME = VALUES(USER_NAME),
                ROOM_NAME = VALUES(ROOM_NAME),
                STEP = VALUES(STEP),
                BONUS = VALUES(BONUS),
                ACHIEVE_DTTI = VALUES(ACHIEVE_DTTI),
                LST_DTTI = VALUES(LST_DTTI),
                USERNAME = VALUES(USERNAME),
                SUCCESS_CNT = VALUES(SUCCESS_CNT),
                FAIL_CNT = VALUES(FAIL_CNT)
        `;
    connection.execute(refinmInsertSql, [userId, roomId, userName, roomName, currentStep, bonus, achieveDtti, currentDate, nickName, successCnt, failCnt]);

    // logger.info({
    //   method: req.method,
    //   url: req.url,  // 요청 URL
    //   message: `\nSql ${refinmInsertSql} \nParam ${[userId, roomId, userName, roomName, currentStep, bonus, achieveDtti, currentDate, nickName]}`
    // });

    // 트랜잭션 커밋
    await connection.commit();

    res.status(200).send(msg);
  } catch (err) {
    // 오류 발생 시 롤백
    await connection.rollback();
    next(new Error(err));  // 

    res.status(400).send('잘못된 요청입니다.');
  } finally {
    // DB 연결 해제
    if (connection) connection.release();
  }
}

exports.getEnhanceRank = async (req, res, next) => {
  const connection = await pool.getConnection();

  const { userId, roomId, page = 1, limit = 9999 } = req.body;
  const offset = (page - 1) * limit;

  try {
    await connection.beginTransaction();

    /** 1) 전체 랭킹 조회 */
    let rankingSql = `
      WITH Ranked AS (
        SELECT 
          USER_ID,
          STEP,
          USER_NAME,
          ROOM_NAME,
          USERNAME AS NICKNAME,
          RANK() OVER (ORDER BY STEP DESC, ACHIEVE_DTTI) AS RANKING,
          CAST(DATE_FORMAT(ACHIEVE_DTTI, '%Y-%m-%d %H:%i:%s') AS CHAR) AS ACHIEVE_DTTI,
          SUCCESS_CNT,
          FAIL_CNT
        FROM BOT_ENHANCE_STATUS
        WHERE DL_YN = 'N'
        ${roomId ? ' AND ROOM_ID = ?' : ''}
      )
      SELECT *
      FROM Ranked
      ORDER BY RANKING
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `;

    const queryParams = [];
    if (roomId) queryParams.push(roomId);

    const [rankings] = await connection.execute(rankingSql, queryParams);

    logger.info({
      method: req.method,
      url: req.url,  // 요청 URL
      message: `\nSql ${rankingSql} \nParam ${queryParams}`
    });

    /** 2) 내 랭킹 조회 */
    let myRanking = null;
    if (userId) {
      let myRankingSql = `
        SELECT *
        FROM (
          SELECT 
            USER_ID,
            STEP,
            USER_NAME,
            ROOM_NAME,
            USERNAME AS NICKNAME,
            RANK() OVER (ORDER BY STEP DESC, ACHIEVE_DTTI) AS RANKING,
            CAST(DATE_FORMAT(ACHIEVE_DTTI, '%Y-%m-%d %H:%i:%s') AS CHAR) AS ACHIEVE_DTTI,
            SUCCESS_CNT,
            FAIL_CNT
          FROM BOT_ENHANCE_STATUS
          WHERE DL_YN = 'N'
          ${roomId ? ' AND ROOM_ID = ?' : ''}
        ) AS Ranked
        WHERE USER_ID = ?
      `;
      const myRankingParams = roomId ? [roomId, userId] : [userId];

      const [myRankingRows] = await connection.execute(myRankingSql, myRankingParams);
      myRanking = myRankingRows.length > 0 ? myRankingRows[0] : null;
    }

    res.json({
      allRanking: rankings,
      myRanking: myRanking
    });

  } catch (err) {
    await connection.rollback();
    next(new Error(err));
  } finally {
    // DB 연결 해제
    if (connection) connection.release();
  }
};

// 대표캐릭터 조회 (빈틈봇)
exports.getMyNickName = async (req, res, next) => {
  const { userId, roomId } = req.body;

  let nickName = "";
  if (userId && roomId) {
    const selectNickName = `SELECT NICKNAME FROM USER_INFO WHERE ROOM_CODE = ? AND USER_CODE = ?`;

    const [rows] = await pool.query(selectNickName, [roomId, userId]);

    logger.info({
      method: req.method,
      url: req.url,  // 요청 URL
      message: `\nSql ${selectNickName} \nParam ${[roomId, userId]}`
    });
    
    nickName = rows[0]?.NICKNAME || "";
  }

  logger.info({
    method: req.method,
    url: req.url,
    message: `내정보(대표캐릭터): ${nickName}`,
  });
  res.json({
    'NICKNAME': nickName
  });
};

// 재련 강화 확률표 조회
exports.getEnhanceRates = async (req, res, next) => {
  return res.send(ENHANCEMENTDATA);
};