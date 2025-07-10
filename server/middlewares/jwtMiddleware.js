const jwt = require('jsonwebtoken');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

const jwtMiddleware = (req, res, next) => {
  const privateRoutes = ['/user/mypage', '/user/save', '/cube', '/cube/save']; // 인증이 필요한 라우트

  // 보호되지 않은 라우트는 통과
  if (!privateRoutes.some((route) => req.originalUrl.startsWith(route))) {
    return next();
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
      return res.status(401).json({ message: 'Access Token 만료되었습니다.' });
    } else {
      return res.status(401).json({ message: '유효하지 않은 Access Token입니다.', error: error.message });
    }
  }
};

module.exports = jwtMiddleware;