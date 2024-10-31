import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();
const users = []; // Temporary user storage; replace with a database in production.

// Pre-defined default user
const defaultUsername = "9121sameer@gmail.com";
const defaultPassword = await bcrypt.hash("sameer", 10);
users.push({ username: defaultUsername, password: defaultPassword });

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
        return res.status(409).json({ error: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully.' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Set session on successful login
    req.session.user = { username }; // Store user information in the session
    res.json({ message: 'Login successful' });
});

export default router;
