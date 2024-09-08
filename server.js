const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = 3000;

// 환경 변수 로드
require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY; // JWT 비밀 키

// MySQL 연결 설정
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Database connected successfully');
    connection.release(); // 연결 반환
});

app.use(cors());
app.use(bodyParser.json());

// 기본 라우트 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 회원가입 페이지 라우트 추가
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, 'public')));

// 로그인 API
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Database query failed:', err);
            return res.status(500).json({ message: 'Database query failed' });
        }
        if (results.length === 0) {
            console.log('Invalid credentials: No user found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        if (!(await bcrypt.compare(password, user.password))) {
            console.log('Invalid credentials: Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        try {
            const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
            console.log('Generated token:', token);
            res.json({
                token,
                username: user.username
            });
        } catch (error) {
            console.error('Token generation failed:', error);
            res.status(500).json({ message: 'Token generation failed' });
        }
    });
});

// 회원가입 API
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
        if (err) {
            console.error('Database query failed: ', err);
            return res.status(500).json({ message: '회원가입 실패' });
        }
        res.status(201).json({ message: '회원가입 성공' });
    });
});

// 미들웨어: 인증된 사용자만 접근 가능
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // 'Bearer <token>'에서 <token> 부분 추출

    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ error: 'Invalid token' });
        }
        console.log('Decoded token:', decoded); // 디버깅: 디코딩된 토큰 출력
        req.userId = decoded.userId; // userId 설정
        next();
    });
};



// 일기 데이터 저장 API
app.post('/diary', authenticate, (req, res) => {
    const { date, diet, exercise, weight } = req.body;
    const { morning: meal_morning, afternoon: meal_afternoon, evening: meal_evening } = diet;

    console.log('Received diary data:', req.body); // 디버깅을 위한 로그 추가
    console.log('User ID:', req.userId); // 디버깅: userId 로그 추가

    if (!req.userId) {
        return res.status(400).json({ error: 'User ID is missing' });
    }

    db.query('INSERT INTO records (user_id, date, meal_morning, meal_afternoon, meal_evening, exercise, weight) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [req.userId, date, meal_morning, meal_afternoon, meal_evening, exercise, weight], (err) => {
            if (err) {
                console.error('Database query failed:', err); // 에러 로그 추가
                return res.status(500).json({ error: 'Database query failed' });
            }
            res.status(201).json({ message: 'Diary entry saved' });
        });
});


// 일기 데이터 조회 API

// 일기 데이터 수정 API
app.put('/diary/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const { meal_morning, meal_afternoon, meal_evening, exercise, weight } = req.body;

    db.query('UPDATE records SET meal_morning = ?, meal_afternoon = ?, meal_evening = ?, exercise = ?, weight = ? WHERE id = ? AND user_id = ?', 
        [meal_morning, meal_afternoon, meal_evening, exercise, weight, id, req.userId], (err) => {
            if (err) return res.status(500).send('Database query failed');
            res.status(200).send('Diary entry updated');
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
