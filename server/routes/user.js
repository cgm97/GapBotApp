const express = require('express');
const router = express.Router();
const userService = require('./userService'); // 상대 경로로 apiService 불러오기

/**
 * @swagger
 * tags:
 *   - name: USER API
 *     description: 유저 관련 API 목록 (로그인,회원가입,내정보)
 */

/**
 * @swagger
 * /api/event:
 *   get:
 *     summary: 로그인 처리
 *     tags: [USER API]
 *     responses:
 *       200:
 *         description: 로그인 데이터 목록.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   EMAIL:
 *                     type: string
 *                     description: 이메일.
 *                   PASSWORD:
 *                     type: string
 *                     description: 패스워드.
 */
router.post('/login', userService.executeLogin);

router.post('/register', userService.executeRegister);

router.post('/mypage', userService.getMypage);

router.post('/save', userService.saveUserInfo);

router.get('/verifyEmail', userService.verifyEmail);

module.exports = router;