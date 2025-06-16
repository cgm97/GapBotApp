const express = require('express');
const router = express.Router();
const characterService = require('./characterService'); // 상대 경로로 apiService 불러오기

/**
 * @swagger
 * tags:
 *   - name: CHARACTER API
 *     description: 캐릭터 API 목록
 */

/**
 * @swagger
 * /character/info:
 *   get:
 *     summary: 캐릭터 정보 조회
 *     tags: [CHARACTER API]
 *     description: 닉네임(nickName)으로 캐릭터의 프로필, 장비, 보석, 카드, 각인, 길드 등 상세 정보를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: nickName
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 캐릭터 닉네임
 *     responses:
 *       200:
 *         description: 캐릭터 상세 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipItems:
 *                   type: array
 *                   description: 장비 아이템 목록
 *                   items:
 *                     type: object
 *                 gemItems:
 *                   type: array
 *                   description: 보석 아이템 목록
 *                   items:
 *                     type: object
 *                 accessoryItems:
 *                   type: array
 *                   description: 악세서리 아이템 목록
 *                   items:
 *                     type: object
 *                 cardItems:
 *                   type: object
 *                   description: 카드 정보
 *                   properties:
 *                     name:
 *                       type: string
 *                     cards:
 *                       type: array
 *                       items:
 *                         type: object
 *                     cardSets:
 *                       type: array
 *                       items:
 *                         type: object
 *                 engravings:
 *                   type: array
 *                   description: 각인 정보 목록
 *                   items:
 *                     type: object
 *                 profile:
 *                   type: object
 *                   description: 캐릭터 프로필 정보
 *                   properties:
 *                     CHARACTER_LEVEL:
 *                       type: integer
 *                     EXPEDITION_LEVEL:
 *                       type: integer
 *                     IMG_URL:
 *                       type: string
 *                     ITEM_LEVEL:
 *                       type: number
 *                     ITEM_LEVEL_HISTORY:
 *                       type: array
 *                       items:
 *                         type: object
 *                     JOB:
 *                       type: string
 *                     NICKNAME:
 *                       type: string
 *                     PVP_GRADE:
 *                       type: string
 *                     STATS:
 *                       type: object
 *                     SERVER:
 *                       type: string
 *                     SUBJOB:
 *                       type: string
 *                     TITLE:
 *                       type: string
 *                     IS_DONATE:
 *                       type: boolean
 *                 guild:
 *                   type: object
 *                   description: 길드 정보
 *                   properties:
 *                     NAME:
 *                       type: string
 *                     IS_OWNER:
 *                       type: boolean
 *                 wisdom:
 *                   type: object
 *                   description: 특성 정보
 *                   properties:
 *                     NAME:
 *                       type: string
 *                     LEVEL:
 *                       type: integer
 *                 arkItems:
 *                   type: array
 *                   description: 아크 패시브 아이템 목록
 *                   items:
 *                     type: object
 *       403:
 *         description: 접근 불가 (유효하지 않은 호스트)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid host
 *       404:
 *         description: 등록되지 않은 캐릭터
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 등록되지 않은 캐릭터입니다.
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/search', characterService.getCharacterInfo);

/**
 * @swagger
 * /character/renew:
 *   get:
 *     summary: 캐릭터 정보 갱신 실행
 *     tags: [CHARACTER API]
 *     description: 닉네임(nickName)을 기준으로 캐릭터 정보를 다시 파싱 후 DB에 갱신합니다.
 *     parameters:
 *       - in: query
 *         name: nickName
 *         schema:
 *           type: string
 *         required: true
 *         description: 갱신할 캐릭터 닉네임
 *     responses:
 *       200:
 *         description: 갱신 완료
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 갱신완료
 *       403:
 *         description: 접근 불가 (유효하지 않은 호스트)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid host
 *       404:
 *         description: 갱신 실패 (캐릭터 정보가 없거나 삽입 실패)
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 갱신실패
 *       500:
 *         description: 서버 오류
 */
router.get('/renew', characterService.executeRenew);
module.exports = router;