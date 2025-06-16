const express = require('express');
const router = express.Router();
const apiService = require('./apiService'); // 상대 경로로 apiService 불러오기

/**
 * @swagger
 * tags:
 *   - name: LostArk API
 *     description: 메인화면 API 목록
 */

/**
 * @swagger
 * /api/island:
 *   get:
 *     summary: 모험섬 정보를 가져옵니다.
 *     tags: 
 *      - LostArk API
 *     responses:
 *       200:
 *         description: 모험섬 데이터 목록.
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
 *                   BASE_DATE:
 *                     type: string
 *                     description: 기준 날짜 (YYYYMMDD 형식).
 *                   TIME_TYPE:
 *                     type: string
 *                     description: 시간 타입(0.오전 1.오후).
 *                   NAME:
 *                     type: string
 *                     description: 섬 이름.
 *                   START_TIME:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: 시작 시간 목록.
 *                   REWARD_ITEMS:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         Items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               Icon:
 *                                 type: string
 *                                 description: 아이템 아이콘 URL.
 *                               Name:
 *                                 type: string
 *                                 description: 아이템 이름.
 *                               Grade:
 *                                 type: string
 *                                 description: 아이템 등급.
 *                               StartTimes:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                                 description: 시작 시간 목록.
 *                         ItemLevel:
 *                           type: integer
 *                           description: 입장 제한 아이템 레벨.
 *                   BONUS_REWARD_TYPE:
 *                     type: string
 *                     description: 메인 보너스 보상 유형.
 *                   IMG_URL:
 *                     type: string
 *                     description: 섬 이미지 URL.
 *                   FST_DTTI:
 *                     type: string
 *                     format: date-time
 *                     description: 최초등록일시.
 *                   DL_YN:
 *                     type: string
 *                     description: 삭제 여부.
 */
router.get('/island', apiService.getIsland);

/**
 * @swagger
 * /api/notice:
 *   get:
 *     summary: 공지사항 목록을 가져옵니다.
 *     tags: 
 *      - LostArk API
 *     responses:
 *       200:
 *         description: 공지사항 데이터 목록.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   SNO:
 *                     type: integer
 *                     description: 공지사항 일련번호.
 *                   TITLE:
 *                     type: string
 *                     description: 공지사항 제목.
 *                   TYPE:
 *                     type: string
 *                     description: 공지사항 유형(공지, 이벤트 등).
 *                   URL:
 *                     type: string
 *                     description: 공지사항 URL.
 *                   DATE:
 *                     type: string
 *                     format: date-time
 *                     description: 공지사항 등록 일자.
 */
router.get('/notice', apiService.getNotice);

/**
 * @swagger
 * /api/event:
 *   get:
 *     summary: 이벤트 목록을 가져옵니다.
 *     tags: 
 *      - LostArk API
 *     responses:
 *       200:
 *         description: 이벤트 데이터 목록.
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
 *                     description: 이벤트 제목.
 *                   URL:
 *                     type: string
 *                     description: 이벤트 URL.
 *                   IMG_URL:
 *                     type: string
 *                     description: 이벤트 이미지 URL.
 *                   FST_DTTI:
 *                     type: string
 *                     format: date-time
 *                     description: 최초등록일시.
 */
router.get('/event', apiService.getEvent);

/**
 * @swagger
 * /api/patchNote:
 *   get:
 *     summary: 빈틈봇 패치노트를 가져옵니다.
 *     tags: 
 *      - LostArk API
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
router.get('/patchNote', apiService.getPatchNote);

module.exports = router;