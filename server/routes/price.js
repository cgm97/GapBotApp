const express = require('express');
const router = express.Router();
const priceService = require('./priceService'); // 상대 경로로 apiService 불러오기

/**
 * @swagger
 * tags:
 *   - name: Character API
 *     description: 캐릭터 API 목록
 */

/**
 * @swagger
 * /character/search:
 *   get:
 *     summary: 캐릭터 정보를 가져옵니다.
 *     tags: [Character API]
 *     responses:
 *       200:
 *         description: 빈틈봇 패치노트 데이터 목록.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   SNO:
 *                     type: integer
 *                     description: 일련번호.
 *                   TITLE:
 *                     type: string
 *                     description: 제목.
 *                   CONTENTS:
 *                     type: string
 *                     description: 내용.
 *                   FST_DTTI:
 *                     type: string
 *                     description: 최초등록일시.
 *                   DL_YN:
 *                     type: string
 *                     format: date-time
 *                     description: 삭제여부.
 */
router.get('/book', priceService.getBookPrice);
router.get('/book/chart', priceService.getBookChartPrice);

router.get('/jewel', priceService.getJewelPrice);
router.get('/jewel/chart', priceService.getJewelChartPrice);
module.exports = router;