require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db/connection');
const logger = require('./logger');  // logger.js 임포트

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// React 정적 파일 제공
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes
app.get('/api/data', async (req, res) => {
  try {
    logger.info("/api/data 요청");
    const [rows] = await pool.query('SELECT * FROM ISLAND_SCHEDULE');
    res.json(rows);
  } catch (err) {
    logger.error('오류 발생:', err);  // 오류 로그 한 번만 찍음
    res.status(500).json({ error: 'Database query error' });
  }
});

app.post('/api/data', async (req, res) => {
  const { column1, column2 } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO table_name (column1, column2) VALUES (?, ?)', [column1, column2]);
    res.json({ success: true, insertedId: result.insertId });
  } catch (err) {
    console.error('오류 발생:', err);
    res.status(500).json({ error: 'Database insertion error' });
  }
});

// React의 index.html로 fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

