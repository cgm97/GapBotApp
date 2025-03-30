const express = require('express');
const router = express.Router();
const cronTestService = require('./cronTestService'); // 상대 경로로 apiService 불러오기

// GET - /api/gameContents
router.get('/island', cronTestService.getIsland);
router.get('/notice', cronTestService.getNotice);
router.get('/event', cronTestService.getEvent);
router.get('/jem', cronTestService.getJem);
module.exports = router;