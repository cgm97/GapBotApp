const pool = require('../db/connection');
const logger = require('../logger');  // logger.js 임포트
const characterUtil = require('../characterUtil');
// const combatUtil = require('../combat-power-calculator/run');

require('dotenv').config(); // .env 파일에서 환경 변수 로드


// 날짜 중복 방지 및 레벨 업데이트 함수
const updateItemLevelHistory = (origin, current) => {
    // current의 가장 최신 데이터를 가져옴
    const latestCurrent = current[current.length - 1];

    // origin에서 같은 날짜의 데이터를 찾음
    const existingIndex = origin.findIndex(item => item.day === latestCurrent.day);

    // 문자열로 된 ITEM_LEVEL을 숫자로 변환
    const currentLevel = parseFloat(latestCurrent.ITEM_LEVEL.replace(/,/g, ''));

    if (existingIndex !== -1) {
        // 같은 날짜의 데이터가 존재하는 경우
        const originLevel = parseFloat(origin[existingIndex].ITEM_LEVEL.replace(/,/g, ''));

        if (currentLevel > originLevel) {
            // 레벨이 더 높으면 업데이트
            origin[existingIndex].ITEM_LEVEL = latestCurrent.ITEM_LEVEL;
        }
    } else {
        // 같은 날짜의 데이터가 없는 경우, 새로운 데이터 추가
        origin.push(latestCurrent);
    }

    return origin; // 업데이트된 origin 반환
};

exports.getCharacterInfo = async (req, res, next) => {
  try {
    let { nickName } = req.query;
    nickName = tryDecodeURIComponent(nickName);

    const referer = req.headers.referer || req.headers.origin || '';

    logger.info({
      method: req.method,
      url: req.url,
      message: `캐릭터검색: ${nickName}`,
    });

    const [rows] = await exports.selectCharacter(nickName);

    if (rows.length > 0 && rows[0].characterData?.equipItems) {
      const characterData = rows[0].characterData;
      const lastFetch = new Date(rows[0].last_fetch_date);
      const now = new Date();

      const isOver24Hours = (now - lastFetch) >= 24 * 60 * 60 * 1000;

      if (isOver24Hours && !referer.includes('loagap.com/meta')) {
        const isSuccess = await exports.renewCharacterInfo(nickName);
        logger.info({
          method: req.method,
          url: req.url,
          message: `캐릭터검색 1일 이전 갱신 : ${isSuccess}`,
        });
      }

      return res.status(200).json({
        ...characterData,
        lastFetchDate: rows[0].last_fetch_date,
      });
    }

    // DB에 없을 경우 신규 캐릭터 조회 및 저장
    logger.info({
      method: req.method,
      url: req.url,
      message: `캐릭터검색 DB 존재 x : ${nickName}`,
    });

    const characterData = await characterUtil.getCharacterProfile(nickName);

    const isSuccess = await characterUtil.insertCharacterInfo(
      characterData.equipItems,
      characterData.gemItems,
      characterData.accessoryItems,
      characterData.cardItems,
      characterData.engravings,
      characterData.profile,
      characterData.guild,
      characterData.wisdom,
      characterData.arkItems,
      characterData.arkGridItems
    );

    if (isSuccess) {
      return res.status(200).json(characterData);
    }

    const message = '등록되지 않은 캐릭터입니다.';
    return referer.includes('loagap.com/meta')
      ? res.status(200).send(message)
      : res.status(404).send(message);

  } catch (error) {
    next(new Error(error));
  }
};

exports.executeRenew = async (req, res, next) => {
    let { nickName } = req.query;
    nickName = tryDecodeURIComponent(nickName);

    try {
        logger.info({
            method: req.method,
            url: req.url,
            message: `캐릭터갱신: ${nickName}`,
        });

        const isSuccess = await exports.renewCharacterInfo(nickName);

        if (isSuccess) {
            res.status(200).send("갱신완료");
        } else {
            res.status(404).send("갱신실패");
        }
    } catch (error) {
        next(new Error(error));
    }
};

exports.renewCharacterInfo = async (nickName) => {
    const query = `SELECT ITEM_LEVEL_HISTORY FROM CHARACTER_INFO WHERE NICKNAME = ?`;
    const [rows] = await pool.query(query, [nickName]);

    const originItemLevelHistory = rows[0]?.ITEM_LEVEL_HISTORY || null;

    // 파싱
    const { equipItems, gemItems, accessoryItems, cardItems, engravings, profile, guild, wisdom, arkItems, arkGridItems } = await characterUtil.getCharacterProfile(nickName);

    // 히스토리 병합
    if (originItemLevelHistory) {
        const updatedHistory = updateItemLevelHistory(originItemLevelHistory, profile.ITEM_LEVEL_HISTORY);
        profile.ITEM_LEVEL_HISTORY = updatedHistory;
    }

    const isSuccess = await characterUtil.insertCharacterInfo(
        equipItems, gemItems, accessoryItems, cardItems,
        engravings, profile, guild, wisdom, arkItems, arkGridItems
    );

    return isSuccess;
};

function tryDecodeURIComponent(value) {
    try {
        ``
        const decoded = decodeURIComponent(value);
        // 디코딩했는데 다시 인코딩하면 같으면 → 이미 디코딩된 값
        if (encodeURIComponent(decoded) === value) {
            return decoded; // 원래 디코딩된 값이 맞음
        }
    } catch (e) {
        // decodeURIComponent가 실패하면 원본 그대로 사용
    }
    return value;
}

exports.selectCharacter = async (nickName) => {

    const query = ` SELECT
                        CI.NICKNAME AS profile,
                        JSON_OBJECT(
                            'profile',JSON_OBJECT(
                                'CHARACTER_LEVEL', CI.CHARACTER_LEVEL,
                                'EXPEDITION_LEVEL', CI.EXPEDITION_LEVEL,
                                'EXPEDITION_CHARACTER', CI.EXPEDITION_CHARACTER,
                                'IMG_URL', CI.IMG_URL,
                                'ITEM_LEVEL', ROUND(CI.ITEM_LEVEL, 2),
                                'COMBAT_POWER', ROUND(CI.COMBAT_POWER, 2),
                                'ITEM_LEVEL_HISTORY', CI.ITEM_LEVEL_HISTORY,
                                'JOB', CI.JOB,
                                'NICKNAME', CI.NICKNAME,
                                'PVP_GRADE', CI.PVP_GRADE,
                                'STATS', CI.STATS,
                                'SERVER', CI.SERVER,
                                'SUBJOB', CI.SUBJOB,
                                'TITLE', CI.TITLE,
                                'IS_DONATE', CI.IS_DONATE
                            ),
                            'equipItems', CE.EQUIPMENTS,
                            'accessoryItems', CE.ACCESSORY,
                            'engravings', CE.ENGRAVING,
                            'gemItems', CJ.JEWELS,
                            'cardItems', JSON_OBJECT(
                                'name', CC.NAME,
                                'cards', CC.CARDS,
                                'cardSets', CC.CARD_SETS
                            ),
                            
                            'guild', JSON_OBJECT(
                                'NAME', CG.NAME,
                                'IS_OWNER', CG.IS_OWNER
                            ),
                            'wisdom', JSON_OBJECT(
                                'NAME', CW.NAME,
                                'LEVEL', CW.LEVEL
                            ),
                            'arkItems', CAP.ARK_PASSIVE,
							'skillItems', JSON_OBJECT(
                                'point', CSK.SKILL_POINT,
                                'skill', CSK.SKILLS
                            ),
                            'arkGridItems', CAG.ARK_GRID
                        ) AS characterData,
                         CAST(DATE_FORMAT(CI.LST_DTTI, '%Y-%m-%d %H:%i:%s') AS CHAR) AS last_fetch_date
                    FROM 
                        CHARACTER_INFO CI
                    LEFT JOIN CHARACTER_EQUIPMENT CE ON CI.NICKNAME = CE.NICKNAME
                    LEFT JOIN CHARACTER_JEWELS CJ ON CI.NICKNAME = CJ.NICKNAME
                    LEFT JOIN CHARACTER_CARD CC ON CI.NICKNAME = CC.NICKNAME
                    LEFT JOIN CHARACTER_GUILD CG ON CI.NICKNAME = CG.NICKNAME
                    LEFT JOIN CHARACTER_WISDOM CW ON CI.NICKNAME = CW.NICKNAME
                    LEFT JOIN CHARACTER_ARKPASSIVE CAP ON CI.NICKNAME = CAP.NICKNAME
                    LEFT JOIN CHARACTER_SKILL CSK ON CI.NICKNAME = CSK.NICKNAME
                    LEFT JOIN CHARACTER_ARKGRID CAG ON CI.NICKNAME = CAG.NICKNAME
                    WHERE CI.NICKNAME = ?`;

    return await pool.query(query, [nickName]);
}

// exports.executeCombatPower = async (req, res, next) => {
//     let { nickName } = req.query;
//     nickName = tryDecodeURIComponent(nickName);

//     const char = await combatUtil.getCharacterCombat(nickName);

//     res.status(200).json(char);
// }
