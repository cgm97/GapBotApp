# GapBotWeb  

1.1 폴더 구조  
GapBotApp/  
├── client/                # React 프로젝트 (프론트엔드)  
│   ├── build/             # React 빌드 결과물  
│   ├── src/               # React 소스 코드  
│   └── public/  
├── server/                # Node.js 프로젝트 (백엔드)  
│   ├── db/  
│   │   └── connection.js  # db connection  
│   ├─── server.js         # Node.js 서버 코드  
│   └─── .env              # properties db정보  
├── README.md              # 프로젝트 설명  
└── package.json           # 루트 package.json


## 🚀 Node.js 설정
1-1. server 폴더로 이동
```
cd server
npm init -y
npm install express cors body-parser
npm install --save-dev nodemon
npm install mysql2
npm install dotenv  
npm install winston  
npm install axios  
npm install node-cron  
```
1-2. Nodemon 설정 (옵션)  
package.json의 scripts 수정
```
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```
1-3 Node.js 실행
```
npm run dev
http://localhost:5000 실행
```
## 🚀 React 설정
1-1. client 폴더로 이동
```
cd client
npx create-react-app .
npm install react react-dom
npm install --save @toast-ui/calendar  
npm install react-router-dom  
```
1-2.React 실행
```
npm start
http://localhost:3000
```
1-3. Axios 설치 (API 요청)
```
npm install axios
```
## 🚀 React와 Node.js 통합 (빌드 후) _ 일단 생략
1-1. React 앱 빌드
```
cd client
npm run build
```
## 🚀 React와 Node.js 통합 서버 실행 (필수)
```
1. concurrently 설치
서버(root 폴더)에서 concurrently 설치
프로젝트 루트 디렉토리(GapBotApp)로 이동:
cd GapBotApp

concurrently 패키지 설치:
npm install --save-dev concurrently

2. 프로젝트 구조 정리
현재 프로젝트 구조가 아래와 같아야 합니다:
react-nodejs-app/
├── client/                # React 프로젝트
│   ├── package.json
├── server/                # Node.js 서버
│   ├── server.js
│   └── package.json
├── package.json           # 루트 package.json
3. 루트 package.json 설정
루트 package.json 파일을 생성하거나 수정하여 다음과 같이 작성합니다:

GapBotApp/package.json:
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

4. 실행
루트 디렉토리에서 다음 명령어 실행:
npm start

React 개발 서버(http://localhost:3000)와 Node.js 서버(http://localhost:5000)가 동시에 실행됩니다.
```