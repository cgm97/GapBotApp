const axios = require('axios');
const pool = require('../db/connection');
const logger = require('../logger');  // logger.js 임포트
const { sendVerificationEmail } = require('../nodeMail'); // 이메일인증
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config(); // .env 파일에서 환경 변수 로드

exports.executeLogin = async (req, res, next) => {
    const { email, password } = req.body;

    // DB 연결
    const connection = await pool.getConnection();

    try {
        // 사용자 정보 조회
        const selectSql = `
            SELECT USERNAME, PASSWORD, NICKNAME, ROOM_CODE, USER_CODE ,EMAIL_VERIFIED
            FROM USER_INFO 
            WHERE USERNAME = ? AND DL_YN = 'N';
        `;
        const [userInfo] = await connection.execute(selectSql, [email]);

        logger.info({
            method: req.method,
            url: req.url,  // 요청 URL
            message: `\nSql ${selectSql} \nParam ${email}`
        });

        // 사용자 존재 여부 확인
        if (userInfo.length === 0) {
            return res.status(401).json({ message: '아이디 또는 패스워드를 확인해주세요.' });
        }

        const user = userInfo[0];

        // 비밀번호 검증
        const isMatch = await bcrypt.compare(password, user.PASSWORD);
        if (!isMatch) {
            return res.status(401).json({ message: '아이디 또는 패스워드를 확인해주세요.' });
        }

        const isVerificationEmail = user.EMAIL_VERIFIED;
        if (isVerificationEmail == 'N') {
            return res.status(401).json({ message: '이메일 인증이 완료되지 않았습니다.' });
        }

        // JWT 생성
        const payload = {
            USERNAME: user.USERNAME,
            NICKNAME: user.NICKNAME,
            ROOM_CODE: user.ROOM_CODE,
            USER_CODE: user.USER_CODE
        };
        const payload1 = {
            USERNAME: user.USERNAME
        };
        // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_TIME_ACCESS }); // 15분 만료
        const refreshToken = jwt.sign(payload1, process.env.JWT_SECRET_REFRESH, { expiresIn: process.env.EXPIRES_TIME_REFRESH }); // 7일 만료

        // Refresh Token을 HttpOnly 쿠키로 설정
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'PROD', // 프로덕션 환경에서만 secure 옵션 활성화
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
        });

        // 응답
        return res.status(200).json({ token: accessToken, email: user.USERNAME });
    } catch (error) {
        next(new Error(err));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    } finally {
        // DB 연결 해제
        if (connection) connection.release();
    }
};

exports.executeRefresh = async (req, res, next) => {
    const { refreshToken } = req.cookies;

    // Refresh Token이 없는 경우
    if (!refreshToken) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    try {
        // Refresh Token 검증
        const user = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

        const connection = await pool.getConnection();

        const selectSql = `SELECT USERNAME, NICKNAME, ROOM_CODE, USER_CODE FROM USER_INFO WHERE USERNAME =?`;
        const [userInfo] = await connection.execute(selectSql, [user.USERNAME]);
        
        // userInfo가 없으면, 해당 사용자가 존재하지 않음
        if (!userInfo || userInfo.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        
        // 새로운 Access Token 생성
        const payload = {
            USERNAME: userInfo[0].USERNAME,
            NICKNAME: userInfo[0].NICKNAME,
            ROOM_CODE: userInfo[0].ROOM_CODE,
            USER_CODE: userInfo[0].USER_CODE,
        };

        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_TIME_ACCESS });

        console.log("서버 갱신");

        return res.status(200).json({ message: 'Access Token 재발급 되었습니다.', token: newAccessToken });
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'RefreshToken이 만료되었습니다.' });
    }
};


exports.executeRegister = async (req, res, next) => {

    const { email, password } = req.body;

    const connection = await pool.getConnection();

    try {
        // 트랜잭션 시작
        await connection.beginTransaction();

        // 쿼리 실행 - 이전 데이터 DL_YN = Y 처리
        const selectSql = `SELECT USERNAME FROM USER_INFO WHERE USERNAME =?`;
        const [userInfo] = await connection.execute(selectSql, [email]);

        // 등록된 사용자 체크
        if (userInfo.length > 0) {
            return res.status(409).json({ message: '이미 등록된 계정입니다.' });
        }

        const salt = await bcrypt.genSalt(10); // salt 생성
        const hashedPassword = await bcrypt.hash(password, salt); // 비밀번호 해시화

        // 쿼리 실행 - 이전 데이터 DL_YN = Y 처리
        const insertSql = `INSERT INTO USER_INFO (
            USERNAME,
            PASSWORD
        ) VALUES (?,?)`;
        const [insertUser] = await connection.execute(insertSql, [email, hashedPassword]);

        logger.info({
            method: req.method,
            url: req.url,  // 요청 URL
            message: `\nSql ${insertSql} \nParam ${email}`
        });

        // 트랜잭션 커밋

        const verificationToken = generateVerificationToken(email);
        // 이메일 인증 링크 발송
        try {
            await sendVerificationEmail(email, verificationToken); // 이메일 전송 시 오류가 발생하면 에러가 던져짐
        } catch (error) {
            // 이메일 발송 오류가 발생하면 롤백
            await connection.rollback();
            next(new Error(err));  // 에러 객체를 넘겨서 next 미들웨어로 전달
            return res.status(500).json({ message: '이메일 발송 오류가 발생했습니다. 다시 시도해주세요.' });
        }

        await connection.commit();
        res.status(201).json({ message: '회원가입 정상처리되었습니다.' });
    } catch (err) {
        // 오류 발생 시 롤백
        await connection.rollback();

        res.status(500).json({ message: 'Server error' });
        next(new Error(err));  // 에러 객체를 넘겨서 next 미들웨어로 전달
    } finally {
        // DB 연결 해제
        if (connection) connection.release();
    }
}

// 이메일 인증코드(토큰)
const generateVerificationToken = (userEmail) => {
    const payload = { email: userEmail };
    const secret = process.env.JWT_SECRET;  // JWT 비밀 키
    const options = { expiresIn: process.env.EXPIRES_TIME_ACCESS };  // 토큰 만료 시간 설정

    return jwt.sign(payload, secret, options);
};

exports.getMypage = async (req, res, next) => {

    try {
        // 요청 헤더에서 Authorization 추출
        const authHeader = req.headers.authorization;

        // 토큰 추출
        const token = authHeader.split(' ')[1];

        // 토큰 검증 및 디코딩
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { USERNAME, NICKNAME, ROOM_CODE, USER_CODE } = decoded;

        // 사용자 정보 응답
        return res.status(200).json({ email: USERNAME, nickName: NICKNAME, roomCode: ROOM_CODE, userCode: USER_CODE });
    } catch (err) {
        next(new Error(err));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
}

exports.saveUserInfo = async (req, res, next) => {

    const { email, nickName, roomCode, userCode } = req.body;
    const connection = await pool.getConnection();

    try {
        // 트랜잭션 시작
        await connection.beginTransaction();

        // 원정대 캐릭터 조회
        const API_URL = `https://developer-lostark.game.onstove.com/characters/${nickName}/siblings`;
        const response = await axios.get(API_URL, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${process.env.LOA_API_KEY}`,
            },
        });

        const data = response.data;

        // 입력된 캐릭터가 이미 다른유저에게 할당되어있는지 체크
        const isCharacterSql = `
            SELECT count(*) AS count 
            FROM CHARACTER_INFO
            WHERE NICKNAME = ?
            AND USERNAME != ?
        `;

        const [rows] = await connection.execute(isCharacterSql, [nickName, email]);
        // rows는 배열이므로, rows[0].count를 사용해야 함
        if (rows[0].count > 0) {
            return res.status(401).json({ message: '이미 등록되어있는 다른 유저의 캐릭터입니다.' });
        }


        // CHARACTER_INFO 유저의 기존 캐릭터 데이터 초기화 처리
        const resetUserCharacterSql = `
            UPDATE CHARACTER_INFO SET USERNAME = null , IS_LINKED = 'N'
            WHERE USERNAME = ?
        `;
        await connection.execute(resetUserCharacterSql, [email]);

        // CHARACTER_INFO 삽입 SQL
        const charInsertSql = `
            INSERT INTO CHARACTER_INFO (
                NICKNAME, USERNAME, SERVER, JOB, CHARACTER_LEVEL, ITEM_LEVEL, IS_LINKED
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?
            )
            ON DUPLICATE KEY UPDATE
                SERVER = VALUES(SERVER),
                USERNAME = VALUES(USERNAME),
                JOB = VALUES(JOB),
                CHARACTER_LEVEL = VALUES(CHARACTER_LEVEL),
                ITEM_LEVEL = VALUES(ITEM_LEVEL),
                IS_LINKED = VALUES(IS_LINKED)
        `;

        // 다중 INSERT Promise
        const charPromises = data.map(character => {
            const server = character.ServerName;
            const nickname = character.CharacterName;
            const job = character.CharacterClassName;
            const level = character.CharacterLevel;
            const itemLevel = parseFloat(character.ItemMaxLevel.replace(/,/g, ''));

            // 로깅
            logger.info({
                method: req.method,
                url: req.url,
                message: `character info insert: ${server} ${job} ${nickname}}`,
            });

            return connection.execute(charInsertSql, [
                nickname,
                email,
                server,
                job,
                level,
                itemLevel,
                'Y'
            ]);
        });

        // 캐릭터의 큐브데이터 생성
        const cubeInsertSql = `
            INSERT INTO CHARACTER_CUBE (
                NICKNAME, CUBES
            ) VALUES (
                ?, ?
            )
            ON DUPLICATE KEY UPDATE
                CUBES = IF(CUBES = '', VALUES(CUBES), CUBES)
        `;

        const cubePromises = data.map(character => {
            const nickname = character.CharacterName;
            const cubes = [
                { "name": "1금제", "count": 0 },
                { "name": "2금제", "count": 0 },
                { "name": "3금제", "count": 0 },
                { "name": "4금제", "count": 0 },
                { "name": "5금제", "count": 0 },
                { "name": "1해금", "count": 0 },
                { "name": "2해금", "count": 0 }
            ];

            logger.info({
                method: req.method,
                url: req.url,
                message: `character cube insert: ${nickname}}`,
            });

            return connection.execute(cubeInsertSql, [
                nickname,
                JSON.stringify(cubes), // JSON 문자열로 저장
            ]);
        });

        // 모든 삽입 작업 실행
        await Promise.all(charPromises);
        await Promise.all(cubePromises);

        // 유저 정보 업데이트 SQL
        const updateSql = `
            UPDATE USER_INFO 
            SET NICKNAME = ?, ROOM_CODE = ?, USER_CODE = ?
            WHERE USERNAME = ?
        `;
        await connection.execute(updateSql, [nickName, roomCode, userCode, email]);

        // 로깅
        logger.info({
            method: req.method,
            url: req.url,
            message: `User info updated: ${JSON.stringify({ nickName, roomCode, userCode, email })}`,
        });

        // JWT 생성
        const payload = {
            USERNAME: email,
            NICKNAME: nickName,
            ROOM_CODE: roomCode,
            USER_CODE: userCode,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_TIME_ACCESS });

        // 트랜잭션 커밋
        await connection.commit();

        // 응답
        res.status(200).json({
            message: "성공적으로 완료되었습니다.",
            token,
            userInfo: { email, nickName, roomCode, userCode },
        });
    } catch (err) {
        // 트랜잭션 롤백
        await connection.rollback();

        next(new Error(err));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    } finally {
        // 연결 해제
        if (connection) connection.release();
    }
};


exports.verifyEmail = async (req, res, next) => {

    const { token } = req.query;
    const connection = await pool.getConnection();
    try {
        // JWT 토큰 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // 사용자의 이메일 인증 처리 (예: DB에서 인증 상태 업데이트)
        // 쿼리 실행 유저 정보 수정

        // 트랜잭션 시작
        await connection.beginTransaction();
        const updateSql = `UPDATE USER_INFO 
            SET EMAIL_VERIFIED='Y'
        WHERE USERNAME=?`;
        const [userInfo] = await connection.execute(updateSql, [email]);

        logger.info({
            method: req.method,
            url: req.url,  // 요청 URL
            message: `\nSql ${updateSql} \nParam ${[email]}`
        });

        // 트랜잭션 커밋
        await connection.commit();

        res.status(200).send('이메일 인증이 완료되었습니다.');
    } catch (err) {
        // 오류 발생 시 롤백
        await connection.rollback();
        next(new Error(err));  // 에러 객체를 넘겨서 next 미들웨어로 전달
        res.status(400).send('유효하지 않거나 만료된 인증 토큰입니다.');
    } finally {
        // DB 연결 해제
        if (connection) connection.release();
    }

}