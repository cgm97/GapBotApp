const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./logger');  // logger.js 임포트
const lostarkAPI = require('./routes/api'); // 라우트 등록
const user = require('./routes/user'); // 라우트 등록
const cube = require('./routes/cube'); // 라우트 등록
const price = require('./routes/price'); // 라우트 등록
const bot = require('./routes/bot'); // 라우트 등록
const character = require('./routes/character'); // 라우트 등록
const cron = require('./cron'); // cron.js를 불러옵니다
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cronTest = require('./routes/cronTest'); // 라우트 등록
const jwtMiddleware = require('./middlewares/jwtMiddleware'); // JWT 미들웨어 임포트
const { initializeCache } = require('./sessionUtil'); // 캐시 모듈 가져오기
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 서버 시작 시 캐시 초기화
initializeCache();

// Middleware
// CORS 설정
app.use(
  cors({
    origin: [process.env.REACT_APP_SERVER_URL1,
             process.env.REACT_APP_SERVER_URL2
            ], // 클라이언트 도메인
    credentials: true, // 쿠키를 포함한 요청을 허용
  })
);

app.use(express.json());

app.use(cookieParser());

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
  // 요청 처리 시작 로그
  logger.info({
    method: req.method,
    url: req.originalUrl,  // 요청 URL
    message: '[INTERCEPTOR] Request started'
  });
  
  // 응답이 끝난 후 로그를 기록하려면, res의 end 이벤트를 사용해야 합니다.
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode, // 응답 상태 코드
      message: '[INTERCEPTOR] Request completed'
    });
  });

  next();  // 다음 미들웨어로 전달
});

// JWT 미들웨어 적용 (인증이 필요한 라우트들에만 적용)
app.use(jwtMiddleware);

// CRON 로컬테스트용 주석처리
app.use('/cron', cronTest);

// 로스트아크 API 사용
app.use('/api', lostarkAPI);

// 유저 API 사용
app.use('/user', user);

// cube API 사용
app.use('/cube', cube);

// character API 사용
app.use('/character', character);

// price 전용 API 사용
app.use('/price', price);

// bot 전용 API 사용
app.use('/bot', bot);

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

