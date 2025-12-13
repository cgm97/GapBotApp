const express = require('express');
const router = express.Router();
const botService = require('./botService'); // 상대 경로로 botService 불러오기

/**
 * @swagger
 * tags:
 *   - name: BOT API
 *     description: 빈틈봇 호출 API 목록
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

/**
 * @swagger
 * /bot/bangleOption:
 *   get:
 *     summary: 팔찌 옵션 조회
 *     tags: [BOT API]
 *     description: 닉네임(nickName)을 기준으로 팔찌 옵션 정보를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: nickName
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 캐릭터 닉네임
 *     responses:
 *       200:
 *         description: 팔찌 옵션 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bangleOption:
 *                   type: array
 *                   description: 팔찌 옵션 리스트
 *                   items:
 *                     type: object
 *                     properties:
 *                       quality:
 *                         type: string
 *                         description: 옵션 수치 또는 등급
 *                       option:
 *                         type: string
 *                         description: 옵션 이름
 *                 name:
 *                   type: string
 *                   description: 팔찌 장비 등급 이름
 *                 tier:
 *                   type: string
 *                   description: 팔찌 등급 티어
 *               example:
 *                 bangleOption:
 *                   - quality: "+114"
 *                     option: "신속"
 *                   - quality: "+100"
 *                     option: "특화"
 *                   - quality: "상"
 *                     option: "기습"
 *                   - quality: "하"
 *                     option: "망치"
 *                 name: "고대"
 *                 tier: "3"
 *       500:
 *         description: 서버 오류
 */
router.get('/bangleOption', botService.getBangleOption);

/**
 * @swagger
 * /bot/accValue:
 *   get:
 *     summary: 악세서리 옵션 조회
 *     tags: [BOT API]
 *     description: 닉네임(nickName)을 기준으로 악세서리 옵션 정보를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: nickName
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 캐릭터 닉네임
 *     responses:
 *       200:
 *         description: 악세서리 값 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bangleValue:
 *                   type: integer
 *                   description: 팔찌 효과 값
 *                   example: 12.66
 *                 elixirValue:
 *                   type: integer
 *                   description: 엘릭서 효과 값
 *                   example: 20.21
 *                 hyperValue:
 *                   type: integer
 *                   description: 하이퍼 효과 값
 *                   example: 19.33
 *       500:
 *         description: 서버 오류
 */
router.get('/accValue', botService.getAccValue);

/**
 * @swagger
 * /bot/jewelsLog:
 *   get:
 *     summary: 보석 가격 로그 조회
 *     tags: [BOT API]
 *     description: 특정 날짜 기준 오늘과 어제 보석 가격 차이를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           pattern: '^\d{8}$'
 *         required: true
 *         description: 조회할 날짜 (YYYYMMDD 형식)
 *     responses:
 *       200:
 *         description: 보석 가격 및 어제와의 가격 차이
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   todayPrice:
 *                     type: integer
 *                     description: 오늘 가격
 *                     example: 117
 *                   yesterdayPrice:
 *                     type: integer
 *                     description: 어제 가격
 *                     example: 117
 *                   priceDifference:
 *                     type: number
 *                     description: 가격 차이 (오늘 - 어제)
 *                     example: 0
 *       400:
 *         description: 잘못된 요청 (날짜 미입력 또는 기타 오류)
 *       500:
 *         description: 서버 오류
 */
router.get('/jewelsLog', botService.getJewelsLog);

/**
 * @swagger
 * /bot/booksLog:
 *   get:
 *     summary: 유물 각인서 가격 로그 조회
 *     tags: [BOT API]
 *     description: 특정 날짜 기준 유물 각인서 가격 데이터를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           pattern: '^\d{8}$'
 *         required: true
 *         description: 조회할 날짜 (YYYYMMDD 형식)
 *     responses:
 *       200:
 *         description: 유물 각인서 가격 데이터 배열
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   icon:
 *                     type: string
 *                     description: 아이템 아이콘 URL
 *                     example: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_9_25.png"
 *                   name:
 *                     type: string
 *                     description: 아이템 이름
 *                     example: "아드레날린 각인서"
 *                   grade:
 *                     type: string
 *                     description: 아이템 등급
 *                     example: "유물"
 *                   price:
 *                     type: integer
 *                     description: 현재 가격
 *                     example: 282777
 *       400:
 *         description: 날짜 미입력 등 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.get('/booksLog', botService.getBooksLog);

/**
 * @swagger
 * /bot/enhance/try:
 *   post:
 *     summary: 재련 시뮬레이션 실행
 *     tags: [BOT API]
 *     description: 유저의 재련 상태를 기반으로 재련을 시도하고 성공/실패 여부 및 결과 메시지를 반환합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roomId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 유저 CODE
 *               userName:
 *                 type: string
 *                 description: 사용자 이름
 *               roomId:
 *                 type: string
 *                 description: 채팅방 CODE
 *               roomName:
 *                 type: string
 *                 description: 채팅방 이름
 *               site:
 *                 type: string
 *                 description: 'LOAGAP에서의 요청 여부 ("Y"일 경우 userName, roomName은 생략 가능)'
 *     responses:
 *       200:
 *         description: 재련 결과 메시지 반환
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "🎉 [재련 성공]\n\n🎯 성공 확률: 25%\n📌 홍길동님, 강화에 성공했습니다!\n🔨 단계: 4 ➝ 5\n✨ 장인의 기운이 초기화"
 *       400:
 *         description: 잘못된 요청 (서버 오류 발생 시)
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "잘못된 요청입니다."
 */
router.post('/enhance/try', botService.executeEnhance);

router.post('/enhance/advancedTry', botService.executeAdvancedEnhance);
/**
 * @swagger
 * /bot/enhance/rank:
 *   post:
 *     summary: 재련 랭킹 조회
 *     tags: [BOT API]
 *     description: 전체 유저 또는 특정 채팅방 기준의 재련 랭킹을 조회하며, 요청 유저의 랭킹도 함께 제공합니다.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: (선택) 본인의 랭킹 확인을 위한 사용자 ID
 *               roomId:
 *                 type: string
 *                 description: (선택) 채팅방 단위로 랭킹을 제한할 경우 사용
 *               page:
 *                 type: integer
 *                 default: 1
 *                 description: "페이지 번호 (기본값: 1)"
 *               limit:
 *                 type: integer
 *                 default: 9999
 *                 description: "한 페이지당 결과 수 (기본값: 9999)"
 *     responses:
 *       200:
 *         description: 전체 랭킹 및 요청 유저의 랭킹 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allRanking:
 *                   type: array
 *                   description: 전체 랭킹 목록
 *                   items:
 *                     type: object
 *                     properties:
 *                       USER_ID:
 *                         type: string
 *                       USER_NAME:
 *                         type: string
 *                       ROOM_NAME:
 *                         type: string
 *                       NICKNAME:
 *                         type: string
 *                       STEP:
 *                         type: integer
 *                       SUCCESS_CNT:
 *                         type: integer
 *                       FAIL_CNT:
 *                         type: integer
 *                       RANKING:
 *                         type: integer
 *                       ACHIEVE_DTTI:
 *                         type: string
 *                         format: date-time
 *                 myRanking:
 *                   type: object
 *                   description: 요청 유저의 현재 랭킹 정보 (없을 경우 null)
 *                   nullable: true
 *       500:
 *         description: 서버 내부 오류
 */
router.post('/enhance/rank', botService.getEnhanceRank);

/**
 * @swagger
 * /bot/enhance/rates:
 *   get:
 *     summary: 재련 단계별 확률표 조회
 *     tags: [BOT API]
 *     description: 각 재련 단계별 성공 확률과 실패 시 증가하는 장인의 기운(보너스 확률)을 반환합니다.
 *     responses:
 *       200:
 *         description: 강화 확률표 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   step:
 *                     type: integer
 *                     example: 1
 *                     description: 재련 단계
 *                   chance:
 *                     type: number
 *                     format: float
 *                     example: 100
 *                     description: 해당 단계의 기본 성공 확률 (%)
 *                   bonusChance:
 *                     type: number
 *                     format: float
 *                     example: 27.91
 *                     description: 실패 시 증가하는 장인의 기운 (%)
 *       500:
 *         description: 서버 내부 오류
 */
router.get('/enhance/rates', botService.getEnhanceRates);

/**
 * @swagger
 * /bot/enhance/rates/advance:
 *   get:
 *     summary: 재련 단계별 확률표 조회
 *     tags: [BOT API]
 *     description: 각 재련 단계별 성공 확률과 실패 시 증가하는 장인의 기운(보너스 확률)을 반환합니다.
 *     responses:
 *       200:
 *         description: 강화 확률표 및 가호 효과 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reinforcementChances:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: 대성공x2
 *                       chance:
 *                         type: number
 *                         example: 5
 *                       xp:
 *                         type: number
 *                         example: 40
 *                 blessings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: 갈라투르의 망치
 *                       chance:
 *                         type: number
 *                         example: 15
 *                       desc:
 *                         type: string
 *                         example: "🔥 상급 재련 경험치 ×5"
 *                       preserveBlessing:
 *                         type: string
 *                         example: "Y"
 *                       skipNextCost:
 *                         type: string
 *                         example: "Y"
 *       500:
 *         description: 서버 내부 오류
 */
router.get('/enhance/rates/advance', botService.getEnhanceAdvanceRates);

/**
 * @swagger
 * /bot/myNickName:
 *   post:
 *     summary: 대표 캐릭터 닉네임 조회
 *     tags: [BOT API]
 *     description: 주어진 userId와 roomId를 기반으로 등록된 대표 캐릭터의 닉네임(NICKNAME)을 반환합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "U123456"
 *                 description: 사용자 ID (USER_CODE)
 *               roomId:
 *                 type: string
 *                 example: "R123456"
 *                 description: 채팅방 ID (ROOM_CODE)
 *     responses:
 *       200:
 *         description: 닉네임 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 NICKNAME:
 *                   type: string
 *                   example: "실틈"
 *       400:
 *         description: 필수 파라미터 누락 또는 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post('/myNickName', botService.getMyNickName);

/**
 * @swagger
 * /bot/accessory:
 *   get:
 *     summary: 액세서리 가격 정보 조회
 *     tags: [BOT API]
 *     description: grade, title, enhance 쿼리 파라미터를 받아 해당 조건에 맞는 액세서리 가격 데이터를 반환합니다.
 *     parameters:
 *       - in: query
 *         name: grade
 *         schema:
 *           type: string
 *         required: true
 *         description: "액세서리 등급 (예: 고대)"
 *         example: 고대
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: "가격 등급 타이틀 (예: 상, 중, 하)"
 *         example: 상
 *       - in: query
 *         name: enhance
 *         schema:
 *           type: string
 *         required: true
 *         description: "연마 수치 (예: 1, 2, 3)"
 *         example: "1"
 *     responses:
 *       200:
 *         description: 액세서리 가격 데이터 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 grade:
 *                   type: string
 *                   example: 고대
 *                 title:
 *                   type: string
 *                   example: 상
 *                 enhance:
 *                   type: string
 *                   example: "1"
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: 목걸이
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             option:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               example: ["적에게 주는 피해%"]
 *                             price:
 *                               type: integer
 *                               example: 58000
 *                             priceDiff:
 *                               type: integer
 *                               example: -1000
 *                             percentDiff:
 *                               type: number
 *                               format: float
 *                               example: -1.69
 *       400:
 *         description: 필수 쿼리 파라미터 누락 또는 잘못된 요청
 *       500:
 *         description: 서버 내부 오류
 */
router.get('/accessory', botService.getAccessory);

// 외부 API
router.get('/loavesting/calculator', botService.executeLoavestCalc);
router.get('/lostBuilds', botService.getlostBuilds);
router.get('/lopec', botService.getLopecPoint);
router.get('/loaup', botService.getLoaup);
module.exports = router;