const nodemailer = require('nodemailer');
require('dotenv').config();

// 이메일 발송 함수
const sendVerificationEmail = async (userEmail, verificationToken) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS 사용 시 false로 설정
    auth: {
      user: process.env.LOAGAP_EAMIL,  // 발송할 이메일 주소
      pass: process.env.LOAGAP_PWD,   // 이메일 계정 비밀번호
    },
    tls: {
      rejectUnauthorized: false,  // 이메일 전송 시 인증서 오류를 무시
    }
  });

  const mailOptions = {
    from: process.env.LOAGAP_EAMIL,  // 발송자 이메일
    to: userEmail,  // 수신자 이메일
    subject: 'LOAGAP(빈틈봇) 이메일 인증',
    text: `아래 링크를 클릭하여 이메일 인증을 완료해주세요:\n\n
    https://loagap.com/verifyEmail?token=${verificationToken}`, // 인증 토큰 포함
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('이메일 발송 오류:', error);
  } finally {
    transporter.close();
  }
};

module.exports = { sendVerificationEmail };
