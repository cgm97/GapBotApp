const express = require('express');
const router = express.Router();
const apiService = require('./apiService'); // 상대 경로로 apiService 불러오기

// GET - /api/island 모험섬
router.get('/island', apiService.getIsland);
// GET - /api/notice 공지사항
router.get('/notice', apiService.getNotice);


module.exports = router;