const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const secretKey = 'your_secret_key'; // JWT 비밀 키

// MySQL 연결 설정
const db = mysql.createPool({
    host: 'localhost',
    user: 'esther',         // MySQL 사용자 이름
    password: 'alskdjfhg2325',         // MySQL 비밀번호
    database: 'diet_data'
});

app.use(cors());
app.use(bodyParser.json());

// 로그인 API
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).send('Database query failed');
        if (results.length === 0) return res.status(401).send('Invalid credentials');

        const user = results[0];
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id }, secretKey);
        res.json({ token });
    });
});

// 회원가입 API
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
        if (err) return res.status(500).send('Database query failed');
        res.status(201).send('User created');
    });
});

// 미들웨어: 인증된 사용자만 접근 가능
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied');

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        req.userId = decoded.userId;
        next();
    });
};

// 일기 데이터 저장 API
app.post('/diary', authenticate, (req, res) => {
    const { date, diet_morning, diet_afternoon, diet_evening, exercise, weight } = req.body;

    db.query('INSERT INTO diaries (user_id, date, diet_morning, diet_afternoon, diet_evening, exercise, weight) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [req.userId, date, diet_morning, diet_afternoon, diet_evening, exercise, weight], (err) => {
            if (err) return res.status(500).send('Database query failed');
            res.status(201).send('Diary entry saved');
        });
});

// 일기 데이터 조회 API
app.get('/diary', authenticate, (req, res) => {
    db.query('SELECT * FROM diaries WHERE user_id = ?', [req.userId], (err, results) => {
        if (err) return res.status(500).send('Database query failed');
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
