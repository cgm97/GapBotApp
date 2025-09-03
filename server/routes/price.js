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

router.get('/accessory/chart', priceService.getAccessoryChart);

/**
 * @swagger
 * /price/market:
 *   get:
 *     summary: 마켓 아이템 가격 조회
 *     tags: [PRICE API]
 *     description: 젬, 강화재료 등 마켓 아이템의 현재 가격과 변동 정보를 조회합니다.
 *     responses:
 *       200:
 *         description: 마켓 가격 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 요청 성공 여부
 *                   example: true
 *                 marketsPrice:
 *                   type: object
 *                   description: 카테고리별 아이템 가격 정보
 *                   properties:
 *                     젬:
 *                       type: array
 *                       description: 젬 아이템 리스트
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: 아이템 이름
 *                             example: "(영웅)질서의 젬 : 안정"
 *                           tier:
 *                             type: string
 *                             nullable: true
 *                             description: 티어 정보
 *                             example: null
 *                           grade:
 *                             type: string
 *                             description: 등급
 *                             example: "영웅"
 *                           icon:
 *                             type: string
 *                             description: 아이콘 URL
 *                             example: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_110.png"
 *                           bundleCount:
 *                             type: number
 *                             description: 묶음 수량
 *                             example: 1
 *                           price:
 *                             type: number
 *                             description: 현재 가격
 *                             example: 144000
 *                           priceDiff:
 *                             type: number
 *                             description: 가격 변동량
 *                             example: 27020
 *                           percent:
 *                             type: string
 *                             description: 변동 퍼센트
 *                             example: "23.10"
 *                     강화재료:
 *                       type: array
 *                       description: 강화재료 아이템 리스트
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: 아이템 이름
 *                             example: "명예의 파편 주머니(대)"
 *                           tier:
 *                             type: number
 *                             nullable: true
 *                             description: 티어 정보
 *                             example: 3
 *                           grade:
 *                             type: string
 *                             description: 등급
 *                             example: "영웅"
 *                           icon:
 *                             type: string
 *                             description: 아이콘 URL
 *                             example: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_8_227.png"
 *                           bundleCount:
 *                             type: number
 *                             description: 묶음 수량
 *                             example: 1
 *                           price:
 *                             type: number
 *                             description: 현재 가격
 *                             example: 918
 *                           priceDiff:
 *                             type: number
 *                             description: 가격 변동량
 *                             example: -12
 *                           percent:
 *                             type: string
 *                             description: 변동 퍼센트
 *                             example: "-1.29"
 *       500:
 *         description: 서버 오류
 */
router.get('/market', priceService.getMarketPrice);

router.get('/market/chart', priceService.getMarketChart);

router.get('/package/efficiency/list', priceService.getPackageEfficiencyList);
router.post('/package/efficiency/insert', priceService.insertPackageEfficiencyList);
router.get('/package/efficiency/delete', priceService.deletePackageEfficiencyList);

/**
 * @swagger
 * /price/chaos:
 *   get:
 *     summary: 카오스 던전 효율 조회
 *     tags: [PRICE API]
 *     description: 카오스 던전에서 얻을 수 있는 보상 및 효율 데이터를 조회합니다.
 *     responses:
 *       200:
 *         description: 카오스 던전 효율 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: 카오스 던전 단계별 보상 및 가격 정보
 *                   items:
 *                     type: object
 *                     properties:
 *                       itemLevel:
 *                         type: integer
 *                         description: 요구 아이템 레벨
 *                         example: 1600
 *                       name:
 *                         type: string
 *                         description: 던전 이름 및 단계
 *                         example: "천공 2단계"
 *                       tradeablePrice:
 *                         type: number
 *                         description: 거래 가능한 아이템 합산 가격
 *                         example: 192
 *                       nonTradeablePrice:
 *                         type: number
 *                         description: 거래 불가 아이템 합산 가격
 *                         example: 12676
 *                       totalPrice:
 *                         type: number
 *                         description: 총합 가격 (거래 가능 + 불가)
 *                         example: 12867
 *                       rewards:
 *                         type: array
 *                         description: 보상 아이템 목록
 *                         items:
 *                           type: object
 *                           properties:
 *                             key:
 *                               type: string
 *                               description: 아이템 키 값
 *                               example: "refined_destruction_stone"
 *                             name:
 *                               type: string
 *                               description: 아이템 이름
 *                               example: "정제된 파괴강석"
 *                             count:
 *                               type: number
 *                               description: 획득 수량
 *                               example: 88
 *                             price:
 *                               type: number
 *                               description: 아이템 단가
 *                               example: 14
 *                             isTradeable:
 *                               type: boolean
 *                               description: 거래 가능 여부
 *                               example: true
 *                             icon:
 *                               type: string
 *                               description: 아이콘 이미지 URL
 *                               example: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_11_15.png"
 *       500:
 *         description: 서버 오류
 */

router.get('/chaos', priceService.getChaosPrice);

/**
 * @swagger
 * /price/guardian:
 *   get:
 *     summary: 가디언 토벌 효율 조회
 *     tags: [PRICE API]
 *     description: 가디언 토벌 보상 아이템과 효율 데이터를 조회합니다.
 *     responses:
 *       200:
 *         description: 가디언 토벌 효율 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: 가디언 토벌별 보상 및 가격 정보
 *                   items:
 *                     type: object
 *                     properties:
 *                       itemLevel:
 *                         type: integer
 *                         description: 요구 아이템 레벨
 *                         example: 1580
 *                       name:
 *                         type: string
 *                         description: 가디언 토벌 이름
 *                         example: "소나벨"
 *                       totalPrice:
 *                         type: number
 *                         description: 총합 가격
 *                         example: 194
 *                       rewards:
 *                         type: array
 *                         description: 보상 아이템 목록
 *                         items:
 *                           type: object
 *                           properties:
 *                             key:
 *                               type: string
 *                               description: 아이템 키 값
 *                               example: "refined_destruction_stone"
 *                             name:
 *                               type: string
 *                               description: 아이템 이름
 *                               example: "정제된 파괴강석"
 *                             count:
 *                               type: number
 *                               description: 획득 수량
 *                               example: 68
 *                             price:
 *                               type: number
 *                               description: 아이템 단가
 *                               example: 10
 *                             isTradeable:
 *                               type: boolean
 *                               description: 거래 가능 여부
 *                               example: true
 *                             icon:
 *                               type: string
 *                               description: 아이콘 이미지 URL
 *                               example: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_11_15.png"
 *       500:
 *         description: 서버 오류
 */
router.get('/guardian', priceService.getGuardianPrice);

/**
 * @swagger
 * /price/raid:
 *   get:
 *     summary: 레이드 보상 조회
 *     tags: [PRICE API]
 *     description: 각 레이드 노말/하드 보상과 가격 정보를 조회합니다.
 *     responses:
 *       200:
 *         description: 보스 보상 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: 보스별 보상 및 가격 정보
 *                   items:
 *                     type: object
 *                     properties:
 *                       itemLevel:
 *                         type: integer
 *                         description: 요구 아이템 레벨
 *                         example: 1610
 *                       name:
 *                         type: string
 *                         description: 보스 이름
 *                         example: "카멘"
 *                       difficulty:
 *                         type: string
 *                         description: 난이도
 *                         example: "노말"
 *                       totalPrice:
 *                         type: number
 *                         description: 총합 가격
 *                         example: 7365
 *                       extraTotalPrice:
 *                         type: number
 *                         description: 추가 보상 포함 총합 가격
 *                         example: 6396
 *                       rewards:
 *                         type: array
 *                         description: 기본 보상 아이템 목록
 *                         items:
 *                           type: object
 *                           properties:
 *                             key:
 *                               type: string
 *                               description: 아이템 키 값
 *                               example: "refined_destruction_stone"
 *                             name:
 *                               type: string
 *                               description: 아이템 이름
 *                               example: "정제된 파괴강석"
 *                             count:
 *                               type: number
 *                               description: 획득 수량
 *                               example: 555
 *                             price:
 *                               type: number
 *                               description: 아이템 단가
 *                               example: 83
 *                             isTradeable:
 *                               type: boolean
 *                               description: 거래 가능 여부
 *                               example: true
 *                             icon:
 *                               type: string
 *                               description: 아이콘 이미지 URL
 *                               example: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_11_15.png"
 *                       extraRewards:
 *                         type: array
 *                         description: 추가 보상 아이템 목록
 *                         items:
 *                           type: object
 *                           properties:
 *                             key:
 *                               type: string
 *                               example: "refined_guardian_stone"
 *                             name:
 *                               type: string
 *                               example: "정제된 가디언의 돌"
 *                             count:
 *                               type: number
 *                               example: 123
 *                             price:
 *                               type: number
 *                               example: 50
 *                             isTradeable:
 *                               type: boolean
 *                               example: true
 *                             icon:
 *                               type: string
 *                               example: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_11_16.png"
 *       500:
 *         description: 서버 오류
 */
router.get('/raid', priceService.getRaidPrice);

/**
 * @swagger
 * /price/enhance:
 *   post:
 *     summary: 장비 강화 비용 조회
 *     tags: [PRICE API]
 *     description: 무기 및 방어구 강화 단계별 비용과 사용 재료 정보를 조회합니다.
 *     responses:
 *       200:
 *         description: 강화 비용 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 armorEnhace:
 *                   type: array
 *                   description: 방어구 강화 단계별 정보
 *                   items:
 *                     type: object
 *                     properties:
 *                       level:
 *                         type: string
 *                         description: 강화 레벨 범위
 *                         example: "10-11"
 *                       totalCost:
 *                         type: number
 *                         description: 해당 단계 총 강화 비용
 *                         example: 12015
 *                       perLevelCost:
 *                         type: number
 *                         description: 레벨당 평균 비용
 *                         example: 2403
 *                       materials:
 *                         type: array
 *                         description: 사용 재료 목록
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               description: 재료 이름
 *                               example: "운명의 수호석"
 *                             count:
 *                               type: number
 *                               description: 필요 수량
 *                               example: 3127.9
 *                             pricePerUnit:
 *                               type: string
 *                               description: 개별 단가
 *                               example: "0.030"
 *                             total:
 *                               type: number
 *                               description: 총 비용
 *                               example: 94
 *                             icon:
 *                               type: string
 *                               description: 아이콘 URL
 *                               example: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png"
 *                 armorSequence:
 *                   type: array
 *                   description: 방어구 강화 순서
 *                   items:
 *                     type: string
 *                   example: ["14","1-10","16","11-20","19","21-30","31-40"]
 *                 weaponSequence:
 *                   type: array
 *                   description: 무기 강화 순서
 *                   items:
 *                     type: string
 *                   example: ["14","1-10","16","11-20","19","21-30","31-40"]
 *                 armorTotalCost:
 *                   type: number
 *                   description: 방어구 강화 총 비용
 *                   example: 1420436
 *                 weaponTotalCost:
 *                   type: number
 *                   description: 무기 강화 총 비용
 *                   example: 2581896
 *       500:
 *         description: 서버 오류
 */
router.post('/enhance', priceService.getEnhancePrice);

module.exports = router;