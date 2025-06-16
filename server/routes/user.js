const express = require('express');
const router = express.Router();
const userService = require('./userService'); // 상대 경로로 apiService 불러오기

/**
 * @swagger
 * tags:
 *   - name: USER API
 *     description: 유저 관련 API 목록
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: 로그인 처리
 *     tags: [USER API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: 로그인 성공 시 JWT 토큰과 사용자 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                 email:
 *                   type: string
 *                   description: 사용자 이메일
 *                 userCode:
 *                   type: string
 *                   description: 유저 코드
 *                 roomCode:
 *                   type: string
 *                   description: 채팅방 코드
 *       401:
 *         description: 인증 실패
 */

router.post('/login', userService.executeLogin);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: 로그아웃 처리
 *     tags: [USER API]
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그아웃 되었습니다.
 *       401:
 *         description: 인증되지 않은 사용자
 */
router.post('/logout', userService.executeLogout);

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: 회원가입 처리
 *     tags: [USER API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 사용자 이메일
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 비밀번호
 *                 example: MySecurePassword123!
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 회원가입 정상처리되었습니다.
 *       409:
 *         description: 이미 등록된 계정
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이미 등록된 계정입니다.
 *       500:
 *         description: 서버 오류 또는 이메일 발송 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이메일 발송 오류가 발생했습니다. 다시 시도해주세요.
 */
router.post('/register', userService.executeRegister);

/**
 * @swagger
 * /user/refresh:
 *   get:
 *     summary: Access Token 재발급
 *     tags: [USER API]
 *     description: 클라이언트가 보유한 refreshToken(쿠키)을 통해 새로운 Access Token을 발급합니다.
 *     responses:
 *       200:
 *         description: Access Token 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access Token 재발급 되었습니다.
 *                 token:
 *                   type: string
 *                   description: 새로운 Access Token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *                 user:
 *                   type: string
 *                   description: 사용자 이메일 또는 ID
 *                   example: user@example.com
 *       403:
 *         description: Refresh Token 없음 또는 만료됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그인이 필요합니다.
 *       404:
 *         description: 사용자 정보 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 사용자를 찾을 수 없습니다.
 */
router.post('/refresh', userService.executeRefresh);

/**
 * @swagger
 * /user/mypage:
 *   get:
 *     summary: 마이페이지 - 사용자 정보 조회
 *     tags: [USER API]
 *     description: JWT Access Token을 기반으로 사용자의 이메일, 닉네임, 방 코드 등을 반환합니다.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 nickName:
 *                   type: string
 *                   example: 실틈
 *                 roomCode:
 *                   type: integer
 *                   example: 1001
 *                 userCode:
 *                   type: string
 *                   example: 1001Aas
 *       401:
 *         description: 유효하지 않은 토큰
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 유효하지 않은 토큰입니다.
 */
router.post('/mypage', userService.getMypage);

/**
 * @swagger
 * /user/save:
 *   post:
 *     summary: 사용자 정보 저장 및 대표 캐릭터 연동
 *     tags: [USER API]
 *     description: 이메일을 기준으로 캐릭터 데이터를 LostArk API에서 가져와 연동합니다. 대표 캐릭터 정보를 저장하고 JWT 토큰을 발급합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nickName
 *               - roomCode
 *               - userCode
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               nickName:
 *                 type: string
 *                 example: 대표캐릭터명
 *               roomCode:
 *                 type: integer
 *                 example: 321312312
 *               userCode:
 *                 type: string
 *                 example: 1001RR
 *     responses:
 *       200:
 *         description: 사용자 정보 저장 성공 및 토큰 발급
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 성공적으로 완료되었습니다.
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 userInfo:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     nickName:
 *                       type: string
 *                     roomCode:
 *                       type: integer
 *                     userCode:
 *                       type: string
 *       409:
 *         description: 다른 유저가 이미 해당 캐릭터를 등록한 경우
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이미 등록되어있는 다른 유저의 캐릭터입니다.
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 에러가 발생했습니다.
 */
router.post('/save', userService.saveUserInfo);

/**
 * @swagger
 * /user/verifyEmail:
 *   get:
 *     summary: 이메일 인증 처리
 *     tags: [USER API]
 *     description: 회원가입 시 전송된 이메일의 인증 링크를 통해 이메일 인증을 처리합니다.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: 이메일 인증용 JWT 토큰
 *     responses:
 *       200:
 *         description: 이메일 인증 완료
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 이메일 인증이 완료되었습니다.
 *       400:
 *         description: 토큰이 유효하지 않거나 만료됨
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 유효하지 않거나 만료된 인증 토큰입니다.
 */
router.get('/verifyEmail', userService.verifyEmail);

module.exports = router;