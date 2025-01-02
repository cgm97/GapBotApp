const axios = require('axios');
const pool = require('../db/connection');
const logger = require('../logger');  // logger.js 임포트
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config(); // .env 파일에서 환경 변수 로드

// 더미 사용자 데이터 (데이터베이스 사용 시 대체)
const users = [
    { id: 1, email: 'admin@11', password: '$2a$10$qpJQ1cdzxya0Igt6VCrwW.eu0DgncCNlO0K8uFDf5itJ618J9bIzm'} // 이미 암호화된 비밀번호
];

exports.executeLogin = async (req, res, next) => {

    const { email, password } = req.body;

    // 이메일로 사용자 찾기
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: '아이디 또는 패스워드를 확인해주세요.' });

    // 비밀번호 비교
    const salt = await bcrypt.genSalt(10); // salt 생성
    const hashedPassword = await bcrypt.hash(password, salt); // 비밀번호 해시화

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: '아이디 또는 패스워드를 확인해주세요.' });

    // JWT 생성
    const payload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // 1시간 만료

    // HttpOnly 쿠키로 토큰 설정
    // res.cookie('token', token, {
    //     httpOnly: true,        // JavaScript에서 접근 불가
    //     secure: process.env.SERVER_ENV === 'PROD', // 프로덕션에서는 https에서만 전송
    //     sameSite: 'Strict',    // 다른 도메인에서 쿠키를 전송하지 않도록 설정
    //     maxAge: 3600000        // 쿠키 만료 시간 (1시간)
    // });

    return res.status(200).json({ token:token,email:email }); // 유저 정보 반환
    // return res.status(200).json(token); // 유저 정보 반환
}

exports.executeRegister = async (req, res, next) => {

    const { email, password } = req.body;
    try {

        // 등록된 사용자 체크
        const user = users.find(u => u.email === email);
        if (user) return res.status(409).json({ message: '이미 등록된 계정입니다.' });

        const salt = await bcrypt.genSalt(10); // salt 생성
        const hashedPassword = await bcrypt.hash(password, salt); // 비밀번호 해시화

        // 데이터베이스에 저장하는 과정 (여기서는 더미 데이터 사용)
        users.push({ id: users.length + 1, email, password: hashedPassword });

        res.status(201).json({ message: '회원가입 정상처리되었습니다.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}