const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  // 인증이 필요  라우트 
  const publicRoutes = ['/user/mypage', '/user/save', '/cube']; 

  // 요청 URL이 인증이 필요 없는 페이지일 경우, 바로 next() 호출
  if (!publicRoutes.includes(req.originalUrl)) {
    return next();
  }

  // 인증이 필요한 라우트는 토큰 검증
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '토큰이 제공되지 않았습니다.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new Error(error));  // 에러 객체를 넘겨서 next 미들웨어로 전달
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

module.exports = jwtMiddleware;
