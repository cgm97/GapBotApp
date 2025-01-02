const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./logger');  // logger.js 임포트
const lostarkAPI = require('./routes/api'); // 라우트 등록
const user = require('./routes/user'); // 라우트 등록
const cron = require('./cron'); // cron.js를 불러옵니다
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cronTest = require('./routes/cronTest'); // 라우트 등록
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger 정의 설정
const swaggerDefinition = {
  openapi: '3.0.0', // OpenAPI 3.0 규격을 사용
  info: {
    title: 'LOAGAP API', // API 제목
    version: '1.0.0', // API 버전
    description: 'LOAGAP API Description', // API 설명
  },
  servers: [
    {
      url: `http://localhost:${PORT}`, // 서버 URL
      description: 'Development Server', // 서버 설명
    },
    {
      url: 'https://api.loagap.com', // 운영 서버 URL
      description: 'Production Server', // 서버 설명
    },
  ],
};

// Swagger 옵션 설정
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // API 문서화를 위한 파일 경로
};

// Swagger 스펙을 생성
const swaggerSpec = swaggerJSDoc(options);

// Swagger UI 설정
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 미들웨어: 모든 요청에 대해 자동으로 로그 기록
app.use((req, res, next) => {
  const requestId = Date.now();  // 요청 ID 또는 타임스탬프
  // 로그에 요청 메서드와 URL, 요청 ID를 기록
  logger.info({
    method: req.method,
    url: req.originalUrl,  // 요청 URL
    message: '[INERCEPTER]'
  });
  next();  // 다음 미들웨어로 전달
});

// CRON 로컬테스트용 주석처리
app.use('/cron', cronTest);

// 로스트아크 API 사용
app.use('/api', lostarkAPI);
// 유저 API 사용
app.use('/user', user);

// 후처리 미들웨어 (에러 처리 및 로깅)
app.use((err, req, res, next) => {
  // 에러 로그 기록
  logger.error({
    method: req.method,
    url: req.originalUrl,
    message: err.stack,
  });
  // 에러 응답
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on PORT :${PORT}`);
});

