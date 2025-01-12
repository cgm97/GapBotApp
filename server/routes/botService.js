const axios = require('axios');
const pool = require('../db/connection');
const logger = require('../logger');  // logger.js 임포트
const { sessionCache } = require('../sessionUtil'); // 세션 모듈 가져오기

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
        const selectSql =   `SELECT 
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

        let retJson = [];
        let charactersCubeInfo = cubeInfo.map(character => {
            return {
                nickName: character.NICKNAME,       // NICKNAME 값을 반환
                itemLevel: character.ITEM_LEVEL,
                server: character.SERVER,       // SERVER 값을 반환
                job: character.JOB, // JOB 값을 반환
                cubes: calculateCubes(character.CUBES)   // calculateCubes 함수의 결과 반환
            };
        });

        retJson.push({
            cubes: charactersCubeInfo
        })
        // totalRewards를 charactersCubeInfo에 추가
        retJson.push({
            totalRewards: calculateTotalRewards(cubeInfo)
        });
        
        // 트랜잭션 커밋
        await connection.commit();
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