const express = require('express');
const router = express.Router();
const priceService = require('./priceService'); // 상대 경로로 apiService 불러오기

/**
 * @swagger
 * tags:
 *   - name: PRICE API
 *     description: 로스트아크 아이템 시세 API 목록
 */

/**
 * @swagger
 * /price/book:
 *   get:
 *     summary: 유물 각인서 가격 조회
 *     tags: [PRICE API]
 *     description: 전일 대비 유물 각인서 가격과 변화율을 조회합니다.
 *     responses:
 *       200:
 *         description: 각인서 가격 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 booksPrice:
 *                   type: array
 *                   description: 각인서별 현재 가격과 전일 대비 차이
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: 아이템 이름
 *                       price:
 *                         type: integer
 *                         description: 현재 가격
 *                       diffPrice:
 *                         type: number
 *                         description: 전일 대비 가격 변화량
 *                       icon:
 *                         type: string
 *                         description: 아이템 아이콘 URL
 *                       percent:
 *                         type: string
 *                         description: 전일 대비 변화율(%) - 소수점 두 자리
 *                 bookPriceLastUpdate:
 *                   type: string
 *                   description: 마지막 가격 업데이트 시각
 *                   example: "2025-06-13 15:00"
 *       500:
 *         description: 서버 오류
 */
router.get('/book', priceService.getBookPrice);

/**
 * @swagger
 * /price/book/chart:
 *   get:
 *     summary: 유물 각인서 가격 차트 조회
 *     tags: [PRICE API]
 *     description: 특정 각인서 가격의 날짜별 차트 데이터를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: item
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 각인서 이름
 *     responses:
 *       200:
 *         description: 각인서 차트 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 itemData:
 *                   type: array
 *                   description: 날짜별 각인서 가격 데이터
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         description: 기준 날짜 (YYYY-MM-DD)
 *                         example: "2025-06-12"
 *                       name:
 *                         type: string
 *                         description: 각인서 이름
 *                       price:
 *                         type: integer
 *                         description: 해당 날짜의 가격
 *       403:
 *         description: 허용되지 않은 호스트에서의 요청
 *       500:
 *         description: 서버 오류
 */
router.get('/book/chart', priceService.getBookChartPrice);

/**
 * @swagger
 * /price/jewel:
 *   get:
 *     summary: 보석 가격 조회
 *     tags: [PRICE API]
 *     description: 전일 대비 4T 보석 가격과 변화율을 조회합니다.
 *     responses:
 *       200:
 *         description: 보석 가격 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 jewelsPrice:
 *                   type: array
 *                   description: 보석별 현재 가격과 전일 대비 차이
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: 아이템 이름
 *                       price:
 *                         type: integer
 *                         description: 현재 가격
 *                       diffPrice:
 *                         type: number
 *                         description: 전일 대비 가격 변화량
 *                       icon:
 *                         type: string
 *                         description: 아이템 아이콘 URL
 *                       percent:
 *                         type: string
 *                         description: 전일 대비 변화율(%) - 소수점 두 자리
 *                 jewelPriceLastUpdate:
 *                   type: string
 *                   description: 마지막 가격 업데이트 시각
 *                   example: "2025-06-13 15:00"
 *       500:
 *         description: 서버 오류
 */
router.get('/jewel', priceService.getJewelPrice);

/**
 * @swagger
 * /price/jewel/chart:
 *   get:
 *     summary: 보석 가격 차트 조회
 *     tags: [PRICE API]
 *     description: 특정 보석 가격의 날짜별 차트 데이터를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: item
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 보석 이름
 *     responses:
 *       200:
 *         description: 보석 가격 차트 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 itemData:
 *                   type: array
 *                   description: 날짜별 보석 가격 데이터 배열
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: '2025-06-16'
 *                         description: 날짜 (YYYY-MM-DD)
 *                       name:
 *                         type: string
 *                         example: '루비'
 *                         description: 보석 이름
 *                       price:
 *                         type: integer
 *                         example: 1200
 *                         description: 가격
 *       403:
 *         description: 허용되지 않은 호스트에서의 요청
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/jewel/chart', priceService.getJewelChartPrice);

/**
 * @swagger
 * /price/accessory:
 *   get:
 *     summary: 악세서리 가격 조회
 *     tags: [PRICE API]
 *     description: 전일 대비 악세서리 가격과 변화율을 조회합니다.
 *     responses:
 *       200:
 *         description: 악세서리 가격 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessorysPrice:
 *                   type: array
 *                   description: 악세서리 등급별 현재 가격과 전일 대비 차이
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: 악세서리 등급 (ex. 상, 중상, 중중 등)
 *                         example: "상"
 *                       enhances:
 *                         type: array
 *                         description: 연마 단계별 데이터
 *                         items:
 *                           type: object
 *                           properties:
 *                             enhance:
 *                               type: string
 *                               description: 연마 단계
 *                               example: "1"
 *                             items:
 *                               type: array
 *                               description: 악세서리 옵션별 가격 정보
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   name:
 *                                     type: string
 *                                     description: 악세서리 종류 (목걸이, 귀걸이, 반지)
 *                                     example: "목걸이"
 *                                   option:
 *                                     type: array
 *                                     description: 옵션 배열
 *                                     items:
 *                                       type: string
 *                                     example: ["적에게 주는 피해%"]
 *                                   price:
 *                                     type: integer
 *                                     description: 현재 가격
 *                                     example: 49000
 *                                   priceDiff:
 *                                     type: number
 *                                     description: 전일 대비 가격 변화량
 *                                     example: -10000
 *                                   percentDiff:
 *                                     type: number
 *                                     description: 전일 대비 변화율(%), 소수점 둘째 자리
 *                                     example: -16.95
 *                 accessoryPriceLastUpdate:
 *                   type: string
 *                   description: 마지막 가격 업데이트 시각
 *                   example: "2025-06-18 15:00"
 *       500:
 *         description: 서버 오류
 */
router.get('/accessory', priceService.getAccessoryPrice);
module.exports = router;