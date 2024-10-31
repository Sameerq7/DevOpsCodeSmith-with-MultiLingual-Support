import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import codeGenerationRoutes from './routes/codeGeneration.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key', // Replace with a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(express.static(path.join(__dirname, '../public')));

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    return res.redirect('/login'); // Redirect to login if not authenticated
};

// API routes
app.use('/api/auth', authRoutes);

// Ensure user is authenticated before accessing code generation routes
app.use('/api/code', isAuthenticated, codeGenerationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
