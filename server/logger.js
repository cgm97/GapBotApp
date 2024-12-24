const winston = require('winston');
const path = require('path');

// 현재 날짜를 "yyyyMMdd" 형식으로 가져오는 함수
const getDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');  // 1월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const logger = winston.createLogger({
  level: 'info',  // 로그 레벨 설정
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: path.join('logs', `loagapLog_${getDateString()}.log`),  // 동적으로 날짜가 포함된 파일 이름
      maxsize: 100000000,  // 파일 크기 제한 (예시: 100MB)
      maxFiles: 30         // 최대 파일 개수 (예시: 최대 30일 파일 보관)
    })
  ]
});

module.exports = logger;