# 📌 GapBotApp - 빈틈봇

GapBotApp은 GapBot(Kakaotalk 자동응답)을 연계하며 React 프론트엔드와 Node.js 백엔드로 구성된 풀스택 웹 애플리케이션입니다.

## 🔗 [LOAGAP](https://loagap.com)

### ⚙️ 인프라 구성

- ☁️ **Amazon EC2**: 안정적이고 유연한 서버 운영 환경 제공  
- 💾 **Amazon RDS**: 확장성과 안정성을 갖춘 관계형 데이터베이스 서비스 사용  
- 🌐 **Nginx**: 고성능 웹 서버 및 리버스 프록시로 빠른 트래픽 처리와 보안 강화  
- ⚙️ **GitHub Actions**: 자동화된 CI/CD 파이프라인 구축으로 빠른 배포 및 안정성 확보  

> 빠르고 신뢰할 수 있는 서비스를 위해 AWS 기반과 자동화된 배포 환경으로 구축되었습니다.

---

## 📸 주요 페이지 미리보기

| 페이지         | 설명                                                        | 미리보기 |
|----------------|-------------------------------------------------------------|----------|
| 메인페이지     | 로스트아크의 공지사항, 이벤트, 모험섬 일정 표시             | ![메인페이지](https://github.com/user-attachments/assets/b026894f-98b3-4a09-81fe-554ba8a38646) |
| 명령어         | 사용 가능한 명령어 목록 표시                                 | ![명령어](https://github.com/user-attachments/assets/5d01dae7-648f-4e8c-93d6-217bb2c0dabb) |
| 로그인         | JWT 인증 방식                                                | ![로그인](https://github.com/user-attachments/assets/7924d842-380e-4fc8-9cfd-9b5d015b0fd4) |
| 이메일인증     | 회원가입 시 이메일 인증 + JWT 토큰 인증 방식 지원           | ![이메일인증](https://github.com/user-attachments/assets/8650c42a-54fb-4a0b-a159-cd119f1cd2f2)<br>![이메일인증토큰](https://github.com/user-attachments/assets/520debc2-d89c-4fd4-852b-776dcfac53cd) |
| 내 정보        | 대표 캐릭터 설정 및 빈틈봇과 연동 구현                      | ![내정보](https://github.com/user-attachments/assets/c7f8800b-c1c0-4daf-84af-7501659e42f8) |
| 큐브 계산기    | 대표 캐릭터의 원정대 캐릭터들을 기반으로 한 큐브 계산기     | ![큐브](https://github.com/user-attachments/assets/658309ea-154f-4fe5-814c-5fd209b9512b) |
| 캐릭터 조회    | 로스트아크 캐릭터 능력치 및 장비 정보 조회                  | ![캐릭터조회](https://github.com/user-attachments/assets/626e0687-e3d4-47b6-826b-de4fd120c0e2) |


---

## 📄 문서 및 아키텍처 정보

### 📘 Notion 문서  
GapBotApp의 전체 기획, 기능 정의, 데이터 흐름 등을 정리한 문서입니다.  
🔗 [Notion 링크](https://superb-antler-e73.notion.site/150c5e5dcbb180b7964ef1551a2fd565?v=150c5e5dcbb181e28b79000c5788c362)

### 🗂️ 데이터베이스 ERD  
GapBotApp의 데이터베이스 구조를 시각화한 ERD입니다.  
🔗 [ERD 링크](https://github.com/cgm97/GapBotApp/issues/59)
![ERD](https://github.com/user-attachments/assets/f71a90c7-5a96-4ffa-a618-ea2721f4fc18)


---

## 🗂️ 폴더 구조
```
GapBotApp/
├── client/                # React 프로젝트 (프론트엔드)
│   ├── build/             # 빌드 결과물
│   ├── src/               # 소스 코드
│   └── public/
├── server/                # Node.js 프로젝트 (백엔드)
│   ├── db/
│   │   └── connection.js  # DB 연결 설정
│   ├── server.js          # 서버 실행 코드
│   └── .env               # 환경 변수 (DB 정보 등)
├── README.md              # 프로젝트 설명
└── package.json           # 루트 package.json (동시 실행용)
```

---

## 🚀 Node.js 서버 설정

### 1. 패키지 설치
```bash
cd server
npm init -y
npm install express cors body-parser mysql2 dotenv winston axios node-cron
npm install swagger-jsdoc swagger-ui-express bcryptjs jsonwebtoken nodemailer cookie-parser
npm install --save-dev nodemon
```

### 2. `package.json` 스크립트 수정 (개발용)
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 3. 서버 실행
```bash
npm run dev
# 실행 주소: http://localhost:5000
```

---

## 🚀 React 프론트엔드 설정

### 1. 프로젝트 초기화 및 패키지 설치
```bash
cd client
npx create-react-app .
npm install react react-dom react-router-dom axios @toast-ui/calendar
```

### 2. React 앱 실행
```bash
npm start
# 실행 주소: http://localhost:3000
```

---

## ⚙️ React + Node.js 동시 실행 (개발용)

### 1. 루트에서 `concurrently` 설치
```bash
cd GapBotApp
npm install --save-dev concurrently
```

### 2. 루트 `package.json` 설정
```json
{
  "name": "gapbotapp",
  "version": "1.0.0",
  "scripts": {
    "start": "concurrently \"npm start --prefix client\" \"npm run dev --prefix server\""
  },
  "devDependencies": {
    "concurrently": "^9.1.0"
  }
}
```

### 3. 동시 실행
```bash
npm start
# React: http://localhost:3000
# Node.js: http://localhost:5000
```
