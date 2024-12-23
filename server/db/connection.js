const mysql = require('mysql2'); // MySQL2 모듈 가져오기
require('dotenv').config(); // .env 파일에서 환경 변수 로드

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Promise 기반으로 사용하려면 다음을 추가
const promisePool = pool.promise();

module.exports = promisePool; // Pool을 모듈로 내보내기