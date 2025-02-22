import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import codeGenerationRoutes from './routes/codeGeneration.js';
import cors from 'cors';

dotenv.config();

const app = express();

// CORS setup for cross-origin requests
app.use(cors({
    origin: ['https://codesmith-with-multilingual-support.onrender.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
}));

app.options('*', cors()); // Preflight handling

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'your_secret_key', // Replace with a secure secret
        resave: false,
        saveUninitialized: true,
        cookie: { secure: process.env.NODE_ENV === 'production' } // True if using HTTPS
    })
);

app.use(express.static(path.join(__dirname, '../static')));

app.use(express.static(path.join(__dirname, '../public')));

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    return res.redirect('/login'); // Redirect to login if not authenticated
};

// Redirect root URL to /login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Serve HTML pages
app.get('/index', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/code',  codeGenerationRoutes);

app.listen(PORT, () => {
    console.log(`Please navigate to http://localhost:${PORT} to access the application.`);
});
