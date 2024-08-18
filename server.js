const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'health_tracker'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// 식단 기록 저장
app.post('/api/diet', (req, res) => {
  const { meal, content } = req.body;
  const query = 'INSERT INTO diet (meal, content, date) VALUES (?, ?, NOW())';
  db.query(query, [meal, content], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Diet entry saved' });
  });
});

// 운동 기록 저장
app.post('/api/exercise', (req, res) => {
  const { content } = req.body;
  const query = 'INSERT INTO exercise (content, date) VALUES (?, NOW())';
  db.query(query, [content], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Exercise entry saved' });
  });
});

// 몸무게 저장
app.post('/api/weight', (req, res) => {
  const { weight } = req.body;
  const query = 'INSERT INTO weight (weight, date) VALUES (?, NOW())';
  db.query(query, [weight], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Weight entry saved' });
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
