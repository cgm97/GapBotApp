const axios = require('axios');
const pool = require('../db/connection');
const logger = require('../logger');  // logger.js 임포트
const spec = require('../calculator/specPoint');
const accessoryFillter = require('../accessoryFillter');
const { sessionCache, getDateTime, getDate, calculatePriceDiff } = require('../sessionUtil'); // 세션 모듈 가져오기
const characterService = require('./characterService'); // 상대 경로로 apiService 불러오기

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

// 기본 상급재련 성공 확률
const reinforcementChances = [
  { type: '대성공x2', chance: 5, xp: 40 },
  { type: '대성공', chance: 15, xp: 20 },
  { type: '성공', chance: 80, xp: 10 }
];

// 상급재련 가호 확률 (6번째 시도마다 발동)
const blessings = [
  { name: '갈라투르의 망치', chance: 15, effect: (xp) => xp * 5, desc: '🔥 경험치 ×5' },
  { name: '겔라르의 칼', chance: 35, effect: (xp) => xp * 3, desc: '⚔️ 경험치 ×3' },
  { name: '쿠훔바르의 모루', chance: 15, effect: (xp) => xp + 30, preserveBlessing: "Y", desc: '✨ 경험치 +30\n🔄 선조의 가호가 재충전됩니다!' },
  { name: '테메르의 정', chance: 35, effect: (xp) => xp + 10, skipNextCost: "Y", desc: '✨ 경험치 +10\n⏩ 다음 재련 시 쿨타임 생략!' }
];

// 가중확률 계산
function calculatedChances(option) {
  const r = Math.random() * 100;
  let acc = 0;
  for (const opt of option) {
    acc += opt.chance;
    if (r < acc) {
      return opt;
    }
  }
  return option[option.length - 1];
}

function makeBar(count, max = 100, barLength = 10) {
  const FULL = '▉';
  const EMPTY = '　';
  const filled = Math.floor((count / max) * barLength);
  const empty = barLength - filled;
  return FULL.repeat(filled) + EMPTY.repeat(empty);
}

function blessingGauge(count, max = 6) {
  const filled = '★';  // 채워진 별
  const empty = '☆';   // 빈 별
  // count가 max를 초과하거나 음수일 때 제한
  count = Math.min(Math.max(count, 0), max);

  const filledStars = filled.repeat(count);
  const emptyStars = empty.repeat(max - count);
  const gauge = `(${count}/${max})`;
  return `선조의 가호 [${filledStars + emptyStars}] ${count != 6 ? gauge : ''}`;
}

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

    const todayPrice = sessionCache.get("jewelPrice");
    const [yesterdayPrice] = await connection.execute(selectSql, [yesterdayDate, '01']);

    logger.info({
      method: req.method,
      url: req.url,  // 요청 URL
      message: `\nSql ${selectSql} \nParam ${[yesterdayDate]}`
    });

    let retJson = {};
    let todayArr = [];
    let yesterdayArr = [];

    const todayKeys = Object.keys(todayPrice);
    const yesterdayKeys = Object.keys(yesterdayPrice[0]?.JEWELS_DATA || {});

    // 오늘 가격 배열 만들기
    for (let i = 0; i < todayKeys.length; i++) {
      const key = todayKeys[i];
      todayArr.push(...todayPrice[key]);
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
    if (!userId || !roomId) {
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

// 상급재련강화
exports.executeAdvancedEnhance = async (req, res, next) => {

  let { userId, userName, roomId, roomName, site } = req.body;

  // LOAGAP 재련으로 들어왔을경우
  if (site == "Y") {
    if (!userId || !roomId) {
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
        A.STEP AS ENHANCE_STEP, 
        B.STEP, 
        B.XP,
        BLESSING_PRESERVED ,
        SKIP_NEXT_COST ,
        ATTEMPT_COUNT ,
        CAST(DATE_FORMAT(B.ACHIEVE_DTTI, '%Y-%m-%d %H:%i:%s') AS CHAR) AS ACHIEVE_DTTI,
        CAST(DATE_FORMAT(B.LST_DTTI, '%Y-%m-%d %H:%i:%s') AS CHAR) AS LST_DTTI,
        A.USER_NAME,
        A.ROOM_NAME
      FROM BOT_ENHANCE_STATUS  A
      LEFT JOIN BOT_ENHANCE_ADVANCED B
        ON A.USER_ID = B.USER_ID
      AND A.ROOM_ID = B.ROOM_ID
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

    // 유저 재련 정보
    let currentDate = getDateTime();
    let currentStep = userRefInfo.STEP || 0;
    let xp = userRefInfo.XP || 0;
    let blessingYn = userRefInfo.BLESSING_PRESERVED || "N"; // 가호 유지 여부
    let skip_coolYn = userRefInfo.SKIP_NEXT_COST || "N"; // 쿨타임 스킵 여부
    let count = userRefInfo.ATTEMPT_COUNT || 0;
    let achieveDtti = userRefInfo.ACHIEVE_DTTI || null;
    let lstDtti = userRefInfo.LST_DTTI || null;
    let msg = "";

    // 재련 초기 데이터 없을 경우 불가능
    // LOAGAP 사이트에선 초기 데이터 없을 경우 불가능
    if (site === "Y") {
      if (!userRefInfo || Object.keys(userRefInfo).length === 0) {
        return res.status(200).send(
          "상급재련 시뮬레이션은 본인의 채팅방에서 재련 최초 1회 실행되어야 합니다.",
        );
      } else {
        userName = userRefInfo.USER_NAME;
        roomName = userRefInfo.ROOM_NAME;
      }
    }

    if (!userRefInfo || Object.keys(userRefInfo).length === 0) {
      return res.status(200).send(
        "상급재련 시뮬레이션은 본인의 채팅방에서 재련 최초 1회 실행되어야 합니다.",
      );
    }

    if (currentStep >= 40) {
      msg = `🏆 ${userName}님은 \n**최대 상급 재련 단계(40)**에 도달했습니다!`
      return res.status(200).send(msg);
    }

    if (userRefInfo.ENHANCE_STEP < 10 && !roomName.includes("후원") && !(roomName.includes("빈틈") || roomName.includes("봇테스트"))) {
      msg = `${userName}님, 상급재련 시뮬레이션은 \n**무료 분양의 경우 재련 10단계 이상부터 이용 가능합니다.**\n현재 단계는 ${userRefInfo.ENHANCE_STEP}단계입니다. 조건을 달성하면 이용하실 수 있어요!`;
      return res.status(200).send(msg);
    }

    if (currentStep >= 20 && userRefInfo.ENHANCE_STEP < 20 && !roomName.includes("후원") && !(roomName.includes("빈틈") || roomName.includes("봇테스트"))) {
      msg = `${userName}님, 상급재련 시뮬레이션 20단게 이상부터는 \n**무료 분양의 경우 재련 20단계 이상부터 이용 가능합니다.**\n현재 단계는 ${userRefInfo.ENHANCE_STEP}단계입니다. 조건을 달성하면 이용하실 수 있어요!`;
      return res.status(200).send(msg);
    }

    if (currentStep >= 30 && userRefInfo.ENHANCE_STEP < 25 && !roomName.includes("후원") && !(roomName.includes("빈틈") || roomName.includes("봇테스트"))) {
      msg = `${userName}님, 상급재련 시뮬레이션 30단게 이상부터는 \n**무료 분양의 경우 재련 25단계 이상부터 이용 가능합니다.**\n현재 단계는 ${userRefInfo.ENHANCE_STEP}단계입니다. 조건을 달성하면 이용하실 수 있어요!`;
      return res.status(200).send(msg);
    }

    if (lstDtti != null && skip_coolYn == 'N') {
      var baseTime = 30 * 60 * 1000; // 30분

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
    } else {
      skip_coolYn = "N";
    }

    // 강화 확률 게산
    const chance = calculatedChances(reinforcementChances);
    let gainedXP = chance.xp;
    const gainedType = chance.type;

    // 6번째 시도마다 가호 발동
    let usedBlessing = null;
    let blessMsg = "\n";
    if (count == 6 || blessingYn == "Y") {
      const blessing = calculatedChances(blessings);

      usedBlessing = blessing;
      gainedXP = usedBlessing.effect(gainedXP);
      xp += gainedXP;

      skip_coolYn = usedBlessing.skipNextCost || "N";
      blessingYn = usedBlessing.preserveBlessing || "N";
      count = 0;

      blessMsg += "🌟 선조의 가호 발동\n"
      blessMsg += "[" + usedBlessing?.name + "]\n";
      blessMsg += usedBlessing?.desc;
    }
    else {
      xp += gainedXP;
      count += 1;
    }

    // 선조재충전 특수효과
    if (blessingYn == "Y") {
      count = 6;
    }
    msg += `🎉 [상급재련 ${gainedType}]\n`;
    msg += `${userName}님\n\n`;
    msg += `${blessingGauge(count)}\n`;

    // XP 100 도달 시 강화
    if (xp >= 100) {
      currentStep += 1;
      xp -= 100;
      achieveDtti = getDateTime();
      msg += `현재 단계: ${currentStep - 1} ➝ ${currentStep}\n`;
    } else {
      msg += `현재 단계: ${currentStep}\n`;
    }
    msg += `경험치: ${xp} / 100 (+${gainedXP})\n`;
    msg += `[${makeBar(xp)}]`;
    if (count == 6) {
      msg += `\n\n✨ 다음 시도에 선조의 가호 발동!`;
    }
    msg += blessMsg;

    const refinmInsertSql = `
          INSERT INTO BOT_ENHANCE_ADVANCED (
              USER_ID, ROOM_ID, USER_NAME, ROOM_NAME, STEP, XP, BLESSING_PRESERVED, SKIP_NEXT_COST, ATTEMPT_COUNT, ACHIEVE_DTTI, LST_DTTI
          ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
          ON DUPLICATE KEY UPDATE
              USER_NAME = VALUES(USER_NAME),
              ROOM_NAME = VALUES(ROOM_NAME),
              STEP = VALUES(STEP),
              XP = VALUES(XP),
              BLESSING_PRESERVED = VALUES(BLESSING_PRESERVED),
              SKIP_NEXT_COST = VALUES(SKIP_NEXT_COST),
              ATTEMPT_COUNT = VALUES(ATTEMPT_COUNT),
              ACHIEVE_DTTI = VALUES(ACHIEVE_DTTI),
              LST_DTTI = VALUES(LST_DTTI)
      `;

    connection.execute(refinmInsertSql, [userId, roomId, userName, roomName, currentStep, xp, blessingYn, skip_coolYn, count, achieveDtti, currentDate]);

    // 트랜잭션 커밋
    await connection.commit();

    return res.status(200).send(msg);
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
          A.USER_ID,
          A.STEP,
          C.STEP AS ADVANCE_STEP,
          A.USER_NAME,
          A.ROOM_NAME,
          A.USERNAME AS NICKNAME,
          B.ITEM_LEVEL,
          B.JOB,
          B.SUBJOB,
          RANK() OVER (ORDER BY (A.STEP + IFNULL(C.STEP, 0)) DESC, A.ACHIEVE_DTTI) AS RANKING,
          CAST(DATE_FORMAT(A.ACHIEVE_DTTI, '%Y-%m-%d %H:%i:%s') AS CHAR) AS ACHIEVE_DTTI,
          A.SUCCESS_CNT,
          A.FAIL_CNT
        FROM BOT_ENHANCE_STATUS A
        LEFT JOIN CHARACTER_INFO B
          ON A.USERNAME = B.NICKNAME
        LEFT JOIN BOT_ENHANCE_ADVANCED C
          ON A.USER_ID = C.USER_ID
			    AND A.ROOM_ID = C.ROOM_ID
        WHERE A.DL_YN = 'N' 
          ${roomId ? ' AND A.ROOM_ID = ?' : ''}
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
              A.USER_ID,
              A.STEP,
              C.STEP AS ADVANCE_STEP,
              A.USER_NAME,
              A.ROOM_NAME,
              A.USERNAME AS NICKNAME,
              RANK() OVER (ORDER BY (A.STEP + IFNULL(C.STEP, 0)) DESC, A.ACHIEVE_DTTI) AS RANKING,
              CAST(DATE_FORMAT(A.ACHIEVE_DTTI, '%Y-%m-%d %H:%i:%s') AS CHAR) AS ACHIEVE_DTTI,
              A.SUCCESS_CNT,
              A.FAIL_CNT
            FROM BOT_ENHANCE_STATUS A
              LEFT JOIN BOT_ENHANCE_ADVANCED C
                ON A.USER_ID = C.USER_ID
                AND A.ROOM_ID = C.ROOM_ID
            WHERE A.DL_YN = 'N'
            ${roomId ? 'AND A.ROOM_ID = ?' : ''}
          ) AS ranked
          WHERE ranked.USER_ID = ?
      `;
      const myRankingParams = roomId ? [userId, roomId] : [userId];

      logger.info({
        method: req.method,
        url: req.url,  // 요청 URL
        message: `\nSql ${myRankingSql} \nParam ${myRankingParams}`
      });

      const [myRankingRows] = await connection.execute(myRankingSql, myRankingParams);
      myRanking = myRankingRows[0] || null;
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

// LOPEC 점수 조회
exports.getLopecPoint = async (req, res, next) => {
  const { nickName } = req.query;

  logger.info({
    method: req.method,
    url: req.url,
    message: `로펙조회: ${nickName}`,
  });

  const API_URL = `https://lopec-api.tassardar6-c0f.workers.dev/${nickName}`;

  try {
    const response = await axios.get(API_URL, {
      headers: {
        accept: 'application/json'
      },
    });

    // {
    //     "nickname": "곰주제",
    //     "characterClass": "야성 환수사",
    //     "evoKarma": 21,
    //     "totalStatus": 2378,
    //     "statusSpecial": null,
    //     "statusHaste": null,
    //     "totalSum": 3715.199998305726,
    //     "achieveDate": "20250614044140"
    // }
    param = response.data.result;
  } catch (error) {
    logger.error({
      method: req.method,
      url: req.url,
      message: `로펙 API 호출 실패`,
      error,
    });
    return res.send("캐릭터 정보가 없습니다.");
  }

  let = msg = `📢 ${nickName}님의 LOPEC\n\n`;
  if (param?.specPoint != null) {
    msg += `스펙 포인트: ${(param.specPoint).toFixed(2)}\n`
    msg += `클래스: ${param.Class}\n\n`
    msg += `LOPEC 상세보기 ▼\n`
    msg += `${param.thumbnailUrl}`
  } else {
    msg += "캐릭터 정보가 없습니다."
    msg += `LOPEC 갱신하기 ▼\n`
    msg += `${param.thumbnailUrl}`
  }
  res.send(msg);
};

// 악세 시세 조회
// http://localhost:5000/bot/accessory?title=%EC%83%81%ED%95%98&enhance=2&type=%EA%B3%A0%EB%8C%80
exports.getAccessory = async (req, res, next) => {
  const { grade, title, enhance } = req.query;

  const accessory = accessoryFillter.ACCESSORY;
  const CategoryCode = accessoryFillter.CATEGORYCODE;
  const categortKeys = Object.keys(CategoryCode); // necklace earring ring
  const gradeFillter = accessoryFillter.GRADE;
  const functionSingle = accessoryFillter.getEtcOptionsSingle;
  const functionDouble = accessoryFillter.getEtcOptionsDouble;

  // 현재 시세
  let retAccessory = [];
  for (const categortKey of categortKeys) {
    const acsryOption = accessory[title][categortKey];

    for (const acsry of acsryOption) {
      const name = acsry.name;
      const params = acsry.params;
      const pointAdjust = acsry.pointAdjust || 0;
      const option = acsry.option;
      let etcOptions = null;

      // 증첩 (상상 ... 중하)
      if (accessory[title].useGetEtcOptionDouble) {
        if (enhance == 1) {
          continue; // 연마 횟수가 1은 중첩 불가 -> 단일만 조회
        }
        etcOptions = functionDouble(params[0], params[1], params[2], params[3], params[4], (gradeFillter[grade].point[enhance] + pointAdjust));
      }
      // 딘일(상 중)
      else {
        etcOptions = functionSingle(params[0], params[1], params[2], (gradeFillter[grade].point[enhance] + pointAdjust));
      }

      const body = {
        "ItemLevelMin": gradeFillter[grade].level,
        "ItemLevelMax": gradeFillter[grade].level,
        "ItemUpgradeLevel": enhance,
        "CategoryCode": CategoryCode[categortKey],
        "ItemGradeQuality": 67, // 깨포 최대치
        "SkillOptions": [],
        "EtcOptions": etcOptions,
        "Sort": "BUY_PRICE",
        "PageNo": 1,
        "SortCondition": "ASC"
      }

      const response = await axios.post("https://developer-lostark.game.onstove.com/auctions/items", body, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization': `bearer ${process.env.LOA_API_KEY}`,
        },
      });

      const item = (response.data.Items && response.data.Items.length > 0)
        ? response.data.Items[0]
        : null;

      // 1️⃣ title 그룹 찾기
      let titleGroup = retAccessory.find(t => t.title === title);
      if (!titleGroup) {
        titleGroup = { title, enhances: [] };
        retAccessory.push(titleGroup);
      }

      // 2️⃣ enhance 그룹 찾기
      let enhanceGroup = titleGroup.enhances.find(e => e.enhance === enhance);
      if (!enhanceGroup) {
        enhanceGroup = { enhance, items: [] };
        titleGroup.enhances.push(enhanceGroup);
      }

      // 3️⃣ 해당 enhance 안에 item 추가
      enhanceGroup.items.push({
        name: name,
        option: option,
        price: item?.AuctionInfo?.BuyPrice ?? 0
      });
    }
  };

  // 전일자 DB
  const yesterday = getDate(-1).replaceAll("-", "");

  const selectSql = `SELECT 
                ITEM_DATA AS ACCESSORYS_DATA
              FROM ITEM_PRICE_LOG 
                WHERE BASE_DATE = ? AND ITEM_DVCD = ?
                 `;

  const [rows] = await pool.query(selectSql, [yesterday, '03']);

  const accessoryData = rows[0]?.ACCESSORYS_DATA;
  const titleGroup = accessoryData.find(t => t.title === title);

  if (!titleGroup) {
    return res.status(404).json({ message: '해당 title 없음' });
  }

  const enhanceGroup = titleGroup.enhances.find(e => e.enhance == enhance);

  if (!enhanceGroup) {
    return res.status(404).json({ message: '해당 enhance 없음' });
  }

  // "title": "상",
  // "enhances": [
  //     {
  //         "enhance": "1",
  //         "items": [
  //             {
  //                 "name": "목걸이",
  //                 "option": [
  //                     "적에게 주는 피해%"
  //                 ],
  //                 "price": 52999


  logger.info({
    method: req.method,
    url: req.url,  // 요청 URL
    message: `\nSql ${selectSql} \nParam ${[yesterday, '03']}`
  });

  logger.info({
    method: req.method,
    url: req.url,
    message: `악세서리 시세`,
  });

  let items = null;
  if (grade == "고대") {
    items = groupByNameArray(calculatePriceDiff(enhanceGroup.items, retAccessory[0].enhances[0].items));
  } else {
    items = groupByNameArray(retAccessory[0].enhances[0].items);
  }

  return res.json({
    grade: grade,
    title: title,
    enhance: enhanceGroup.enhance,
    // yesterdayItems: enhanceGroup.items,
    items: items
  });
}
// 재련 강화 확률표 조회
exports.getEnhanceRates = async (req, res, next) => {
  return res.send(ENHANCEMENTDATA);
};

// 상급재련 강화 확률표 조회
exports.getEnhanceAdvanceRates = async (req, res, next) => {
  return res.send({
    reinforcementChances,
    blessings
  });
};

// name별로 배열로 묶기
function groupByNameArray(items) {
  const map = new Map();

  items.forEach(item => {
    if (!map.has(item.name)) {
      map.set(item.name, []);
    }
    map.get(item.name).push(item);
  });

  // 그룹핑 후, 각 그룹 내 아이템에서 name 삭제
  return Array.from(map, ([name, items]) => ({
    name,
    items: items.map(({ name, ...rest }) => rest), // name 제거 후 나머지만 반환
  }));
}

// 로아베스팅 - 재련 견적 게산 API
exports.executeLoavestCalc = async (req, res, next) => {

  const { nickName, startLevel = 10, targetLevel } = req.query;

  const parts = [];
  const partTypes = ["helmet", "shoulder", "chest", "pants", "gloves", "weapon"];

  let requestData = {
    // book_count: 0,
    // breath_count: 0,
    parts: [],
    tier: 4
  };

  let IS_DONATE = "N";
  if (nickName != "방어구" && nickName != "무기") {
    const [rows] = await characterService.selectCharacter(nickName);

    if (rows.length > 0 && rows[0].characterData.equipItems != null) {
      // 조회된 데이터가 있을 경우
      const characterData = rows[0].characterData;

      // JSON 데이터를 해체할당으로 분리
      const {
        equipItems
      } = characterData;
      IS_DONATE = characterData.profile.IS_DONATE;

      equipItems.slice(0, -1).map((item, index) => {

        const enhanceMatch = item.name.match(/\+(\d+)/); // + 뒤 숫자
        // const advanceMatch = item.name.match(/X(\d+)/);     // X 뒤 숫자

        const enhance = enhanceMatch ? parseInt(enhanceMatch[1]) : null;
        // const advance = advanceMatch ? parseInt(advanceMatch[1]) : null;

        // 타겟레벨보다 현재 장비 렙이 높으면 패스
        if (enhance < targetLevel) {
          parts.push({
            current_level: enhance,
            target_level: targetLevel,
            part_type: partTypes[index]
          });
        }
      });
    }
    else {
      return res.status(500).send("LOAGAP에서 우선 캐릭터 조회를 해주세요.");
    }
  } else {
    partTypes.forEach(type => {
      if (nickName == "무기") {
        if (type == "weapon") {
          parts.push({
            current_level: startLevel,
            target_level: targetLevel,
            part_type: type
          });
        }
      } else {
        if (type == "gloves") {
          parts.push({
            current_level: startLevel,
            target_level: targetLevel,
            part_type: type
          });
        }
      }
    });
  }

  requestData.parts = parts;
  try {
    const API_URL = `https://loavesting-backend.vercel.app/api/calculator/refine/cost/`;
    const response = await axios.post(API_URL, requestData, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": " cb8badb0-f02e-4587-b4d8-76774fe06e81"
      }
    });

    const data = response.data.data;

    const result = {
      nickName: nickName,
      startLevel: startLevel,
      targetLevel: targetLevel,
      helmet_startLevel: parts.find(p => p.part_type === 'helmet')?.current_level || '',
      shoulder_startLevel: parts.find(p => p.part_type === 'shoulder')?.current_level || '',
      chest_startLevel: parts.find(p => p.part_type === 'chest')?.current_level || '',
      pants_startLevel: parts.find(p => p.part_type === 'pants')?.current_level || '',
      gloves_startLevel: parts.find(p => p.part_type === 'gloves')?.current_level || '',
      weapon_startLevel: parts.find(p => p.part_type === 'weapon')?.current_level || '',

      helmet_totalGold: (data.details.helmet || []).reduce((sum, item) => {
        const usedPriceTotal = Object.values(item.used_price || {}).reduce((a, b) => a + b, 0);
        return sum + item.gold + usedPriceTotal;
      }, 0).toLocaleString(),

      shoulder_totalGold: (data.details.shoulder || []).reduce((sum, item) => {
        const usedPriceTotal = Object.values(item.used_price || {}).reduce((a, b) => a + b, 0);
        return sum + item.gold + usedPriceTotal;
      }, 0).toLocaleString(),

      chest_totalGold: (data.details.chest || []).reduce((sum, item) => {
        const usedPriceTotal = Object.values(item.used_price || {}).reduce((a, b) => a + b, 0);
        return sum + item.gold + usedPriceTotal;
      }, 0).toLocaleString(),

      pants_totalGold: (data.details.pants || []).reduce((sum, item) => {
        const usedPriceTotal = Object.values(item.used_price || {}).reduce((a, b) => a + b, 0);
        return sum + item.gold + usedPriceTotal;
      }, 0).toLocaleString(),

      gloves_totalGold: (data.details.gloves || []).reduce((sum, item) => {
        const usedPriceTotal = Object.values(item.used_price || {}).reduce((a, b) => a + b, 0);
        return sum + item.gold + usedPriceTotal;
      }, 0).toLocaleString(),

      weapon_totalGold: (data.details.weapon || []).reduce((sum, item) => {
        const usedPriceTotal = Object.values(item.used_price || {}).reduce((a, b) => a + b, 0);
        return sum + item.gold + usedPriceTotal;
      }, 0).toLocaleString(),
      totalGold: (data.total_gold + data.total_material_cost).toLocaleString() || 0,
      totalSilling: data.total_silver.toLocaleString() || 0,

      img: IS_DONATE == "Y" ? "https://www.loagap.com/donationKing.png" : "",

      original: response.data
    }

    return res.status(200).json(
      result
    );
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
};

// 로스트 빌드 - TOP 3 스킬 조회
exports.getlostBuilds = async (req, res, next) => {

  const { nickName } = req.query;

  try {
    const API_URL = `https://api.lostbuilds.com/bot/teum/character/${nickName}`;
    const lostBuilds = await axios.get(API_URL, {
      headers: {
        accept: 'application/json'
      },
    });


    const topSkills = lostBuilds.data.top3Skills;
    let bracelet = 0;
    let msg = `❚ ${nickName}님 로스트빌드\n\n`;

    msg += `❚ 스킬 데미지 TOP 3\n`;
    topSkills.forEach(skill => {
      const { skillName, expectedDamage, cooldown, dps, braceletEfficiency } = skill;

      // 한글식 피해량 변환 (억, 만 단위)
      const billion = Math.floor(expectedDamage / 1_0000_0000);
      const million = Math.floor((expectedDamage % 1_0000_0000) / 1_0000);

      const formattedDamage =
        (billion ? `${billion}억 ` : '') +
        (million ? `${million}만` : '');

      // DPS: 천 단위 쉼표 + 한글식 표시
      const formattedDps =
        dps >= 10000 ? `${(dps / 10000).toFixed(2)}만` : Math.round(dps).toLocaleString();

      // 팔찌 효율 % 변환
      bracelet = ((braceletEfficiency - 1) * 100).toFixed(2);

      msg += `[${skillName}]\n`;
      msg += ` ┌ 피해량: ${formattedDamage.trim()}\n`;
      msg += ` ┣ DPS: ${formattedDps}\n`;
      msg += ` └ 쿨타임: ${cooldown.toFixed(2)}초\n\n`;
    });

    msg += `로스트빌드 바로가기 ▼`
    msg += `\nhttps://lostbuilds.com/info/${nickName}`
    // 응답 반환
    return res.status(200).send(
      msg
    );
  } catch (e) {
    return res.status(500).send(`캐릭터에 오류가 발생했거나, 갱신이 필요합니다.\nhttps://lostbuilds.com/info/${nickName}`);
  }

};

// 로아업
exports.getLoaup = async (req, res, next) => {

  const { nickName } = req.query;

  const [rows] = await characterService.selectCharacter(nickName);
  if (rows.length > 0) {
  }
  else {
    return res.status(500).send("LOAGAP에서 우선 캐릭터 조회를 해주세요.");
  }
  const subJob = rows[0].characterData.profile.SUBJOB;

  var API_URL = `https://loaup.com/api/efficiency/${nickName}`;
  if(subJob == "서폿"){
    API_URL = `https://loaup.com/api/efficiency/${nickName}%3F쫀지`;
  }

  try {
    const loaup = await axios.get(API_URL, {
      headers: {
        accept: 'application/json'
      },
    });

    const topEfficiencies = loaup.data.result.topEfficiencies;

    let msg = `❚ ${nickName}님 스펙업 효율\n\n`;
    msg += "❚ TOP 5 효율 리스트\n";
    var idx = 1;
    topEfficiencies.forEach(item => {
      if(item.type == "accessory"){
        msg += `[${idx}] ${item.name} ${item.details}\n`
      } else {
        msg += `[${idx}] ${item.name}\n`
      }
      idx++;
    })

    msg += `\n로아업 바로가기 ▼`
    msg += `\nhttps://loaup.com/character/${nickName}`

    // 응답 반환
    return res.status(200).send(
      msg
    );
  } catch (e) {
    return res.status(500).send(`캐릭터에 오류가 발생했거나, 갱신이 필요합니다.\nhttps://loaup.com/character/${nickName}`);
  }

};