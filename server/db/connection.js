const mysql = require('mysql2'); // MySQL2 모듈 가져오기
require('dotenv').config(); // .env 파일에서 환경 변수 로드

const pool = mysql.createPool({
  host: process.env.DB_HOST,          // 데이터베이스 호스트
  port: process.env.DB_PORT,          // 데이터베이스 포트
  user: process.env.DB_USER,          // 데이터베이스 사용자 이름
  password: process.env.DB_PASSWORD,  // 데이터베이스 비밀번호
  database: process.env.DB_NAME,      // 사용할 데이터베이스 이름
  charset: 'utf8mb4',                 // UTF-8 문자셋 지원 (이모지 포함)

  waitForConnections: true,           // 풀에 사용 가능한 연결이 없을 때 대기
  connectionLimit: 50,                // 최대 연결 수 (트래픽에 맞게 조정)
  queueLimit: 1000,                   // 대기 중인 요청 최대 수
  connectTimeout: 10000,              // 연결 시도 제한 시간 (ms)
  acquireTimeout: 10000,              // 풀에서 연결 획득 제한 시간 (ms)
  timeout: 30000,                     // 요청 처리 시간 제한 (ms)

  // 추가 옵션
  supportBigNumbers: true,            // 큰 숫자 처리 지원
  bigNumberStrings: true,             // 큰 숫자를 문자열로 반환
});

// Promise 기반으로 사용하려면 다음을 추가
const promisePool = pool.promise();

module.exports = promisePool; // Pool을 모듈로 내보내기