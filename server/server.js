const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 요청 본문 파싱

// React 정적 파일 제공
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Node.js server!');
});

app.post('/api/data', (req, res) => {
  console.log('Received data:', req.body);
  res.json({ success: true, received: req.body });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
