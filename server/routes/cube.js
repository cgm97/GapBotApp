const express = require('express');
const router = express.Router();
const cubeService = require('./cubeService'); // 상대 경로로 apiService 불러오기

/**
 * @swagger
 * tags:
 *   - name: CUBE
 *     description: 큐브 관련 API 목록
 */

/**
 * @swagger
 * /cube/:
 *   post:
 *     summary: 캐릭터의 큐브 정보를 조회합니다.
 *     tags: [CUBE]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               characterName:
 *                 type: string
 *                 description: 캐릭터 이름
 *               serverName:
 *                 type: string
 *                 description: 서버 이름
 *     responses:
 *       200:
 *         description: 캐릭터 큐브 정보 조회 결과.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 성공 여부.
 *                 return:
 *                   type: object
 *                   properties:
 *                     characterInfo:
 *                       type: array
 *                       description: 캐릭터 정보 목록.
 *                       items:
 *                         type: object
 *                         properties:
 *                           NICKNAME:
 *                             type: string
 *                             description: 캐릭터 닉네임.
 *                           SERVER:
 *                             type: string
 *                             description: 서버 이름.
 *                           JOB:
 *                             type: string
 *                             description: 직업 이름.
 *                           ITEM_LEVEL:
 *                             type: number
 *                             description: 아이템 레벨.
 *                           CUBES:
 *                             type: array
 *                             description: 큐브 데이터.
 *                             items:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   description: 큐브 이름.
 *                                 count:
 *                                   type: integer
 *                                   description: 큐브 개수.
 *                           isSaveEnabled:
 *                             type: boolean
 *                     cubeInfo:
 *                       type: array
 *                       description: 큐브 상세 정보 목록.
 *                       items:
 *                         type: object
 *                         properties:
 *                           NAME:
 *                             type: string
 *                             description: 큐브 이름.
 *                           LEVEL:
 *                             type: integer
 *                             description: 큐브 레벨.
 *                           CARD_EXP:
 *                             type: integer
 *                             description: 카드 경험치.
 *                           JEWELRY:
 *                             type: integer
 *                             description: 보석 개수.
 *                           JEWELRY_PRICE:
 *                             type: integer
 *                             description: 보석 가격.
 *                           STONES:
 *                             type: integer
 *                             description: 돌 개수.
 *                           SILLING:
 *                             type: integer
 *                             description: 실링.
 *                           ETC1:
 *                             type: integer
 *                             description: 기타 정보 1.
 *                           ETC2:
 *                             type: integer
 *                             description: 기타 정보 2.
 *                           ETC3:
 *                             type: integer
 *                             description: 기타 정보 3.
 */
router.post('/', cubeService.getCharacterCubeInfo);


/**
 * @swagger
 * /cube/save:
 *   post:
 *     summary: 캐릭터의 큐브 정보를 저장합니다.
 *     tags: [CUBE]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NICKNAME:
 *                 type: string
 *                 description: 캐릭터 닉네임.
 *                 example: 피할틈이없는망치망치공격
 *               CUBES:
 *                 type: array
 *                 description: 큐브 정보 목록.
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: 큐브 이름.
 *                       example: 1금제
 *                     count:
 *                       type: integer
 *                       description: 큐브 개수.
 *                       example: 11
 *               isSaveEnabled:
 *                 type: boolean
 *                 description: 저장 가능 여부.
 *                 example: false
 *     responses:
 *       200:
 *         description: 큐브 정보 저장 성공.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 성공 여부.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: 처리 결과 메시지.
 *                   example: 큐브 정보가 저장되었습니다.
 */
router.post('/save', cubeService.saveCubeInfo);

module.exports = router;