const express = require('express');
const router = express.Router();
const cronTestService = require('./cronTestService'); // 상대 경로로 apiService 불러오기

// GET - /api/gameContents
router.get('/island', cronTestService.getIsland);
router.get('/notice', cronTestService.getNotice);

module.exports = router;