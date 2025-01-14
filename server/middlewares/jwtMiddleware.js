const jwt = require('jsonwebtoken');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

// const jwtMiddleware = (req, res, next) => {
//   // 인증이 필요  라우트 
//   const privateRoutes = ['/user/mypage', '/user/save', '/cube']; // 인증이 필요한 라우트

//   if (!privateRoutes.includes(req.originalUrl)) {
//     return next(); // 인증이 필요 없는 경로는 바로 통과
//   }
  

//   // 인증이 필요한 라우트는 토큰 검증
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
//     return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
//   }
// };

const jwtMiddleware = (req, res, next) => {
  const privateRoutes = ['/user/mypage', '/user/save', '/cube', '/cube/save']; // 인증이 필요한 라우트

  if (!privateRoutes.includes(req.originalUrl)) {
      return next(); // 인증이 필요 없는 경로는 통과
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access Token이 제공되지 않았습니다.' });
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    // Access Token 검증
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    
    return next(); // Access Token이 유효하면 통과
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Access Token 만료 시 Refresh Token으로 새로운 Access Token 발급
      const refreshToken = req.cookies?.refreshToken; // Refresh Token은 HttpOnly 쿠키에서 가져옴

      if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh Token이 없습니다. 다시 로그인하세요.' });
      }
      return res.status(401).json({ message: 'Access Token 만료되었습니다.'});
    } else {
      return res.status(401).json({ message: '유효하지 않은 Access Token입니다.', error: error.message });
    }
  }
};

module.exports = jwtMiddleware;