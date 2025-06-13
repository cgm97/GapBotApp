const express = require('express');
const router = express.Router();
const botService = require('./botService'); // 상대 경로로 botService 불러오기

/**
 * @swagger
 * tags:
 *   - name: BOT API
 *     description: 빈틈봇 호출 API
 */

/**
 * @swagger
 * /bot/cube:
 *   get:
 *     summary: 큐브 조회
 *     tags: [BOT API]
 *     parameters:
 *       - in: query
 *         name: roomCode
 *         required: true
 *         description: 방 코드
 *         schema:
 *           type: string
 *       - in: query
 *         name: userCode
 *         required: true
 *         description: 사용자 코드
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 캐릭터 큐브 데이터 목록.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cubes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nickName:
 *                         type: string
 *                         description: 캐릭터 닉네임.
 *                       itemLevel:
 *                         type: number
 *                         description: 아이템 레벨.
 *                       server:
 *                         type: string
 *                         description: 서버명.
 *                       job:
 *                         type: string
 *                         description: 직업명.
 *                       cubes:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               description: 큐브 이름.
 *                             reward:
 *                               type: object
 *                               properties:
 *                                 count:
 *                                   type: integer
 *                                   description: 큐브 수량.
 *                                 cardExp:
 *                                   type: integer
 *                                   description: 카드 경험치.
 *                                 jewelry:
 *                                   type: integer
 *                                   description: 쥬얼리 보상.
 *                                 jewelryPrice:
 *                                   type: integer
 *                                   description: 쥬얼리 가격.
 *                                 stones:
 *                                   type: integer
 *                                   description: 스톤 보상.
 *                                 selling:
 *                                   type: integer
 *                                   description: 실링 보상.
 *                                 etc1:
 *                                   type: integer
 *                                   description: 기타 1 보상.
 *                                 etc2:
 *                                   type: integer
 *                                   description: 기타 2 보상.
 *                                 etc3:
 *                                   type: integer
 *                                   description: 기타 3 보상.
 *                               description: 큐브 보상 정보.
 *                 totalRewards:
 *                   type: object
 *                   properties:
 *                     totalGold:
 *                       type: integer
 *                       description: 전체 총 골드.
 *                     totalSilling:
 *                       type: integer
 *                       description: 전체 총 실링.
 *                     totalCardExp:
 *                       type: integer
 *                       description: 전체 총 카드 경험치.
 *                     total3jews:
 *                       type: integer
 *                       description: 3단계 쥬얼리 보상 수량.
 *                     total3jewsGrade:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           level:
 *                             type: integer
 *                             description: 쥬얼리 보상 등급.
 *                           count:
 *                             type: integer
 *                             description: 해당 등급의 쥬얼리 수량.
 *                       description: 3단계 쥬얼리 보상 등급 배열.
 *                     total4jews:
 *                       type: integer
 *                       description: 4단계 쥬얼리 보상 수량.
 *                     total4jewsGrade:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           level:
 *                             type: integer
 *                             description: 쥬얼리 보상 등급.
 *                           count:
 *                             type: integer
 *                             description: 해당 등급의 쥬얼리 수량.
 *                       description: 4단계 쥬얼리 보상 등급 배열.
 *                   description: 큐브 보상 요약.
 */

router.get('/cube', botService.getCharacterCube);

router.get('/bangleOption', botService.getBangleOption);
router.get('/accValue', botService.getAccValue);
router.get('/jewelsLog', botService.getJewelsLog);
router.get('/booksLog', botService.getBooksLog);

router.post('/enhance/try', botService.executeEnhance);
router.post('/enhance/rank', botService.getEnhanceRank);
router.get('/enhance/rates', botService.getEnhanceRates);

router.post('/myNickName', botService.getMyNickName);

module.exports = router;