const express = require('express');
const router = express.Router();
const apiService = require('./apiService'); // 상대 경로로 apiService 불러오기

// GET - /api/gameContents
router.get('/gameContents', apiService.getGameContents);

// GET - /api/data
router.get('/data', apiService.getData);



module.exports = router;