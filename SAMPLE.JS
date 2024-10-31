import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());
app.use(express.static("public"));

const users = []; // Temporary storage. Replace with a database in production.

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully.' });
});

// Login for existing users
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
});

// Example protected route
app.get('/home', authenticateToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}` });
});

// Core functionality: Code generation endpoint
app.post("/generate-code", async (req, res) => {
    const { problem } = req.body;
    if (!problem) {
        return res.status(400).json({ error: "Problem statement is required." });
    }

    try {
        const result = await model.generateContent(problem);
        const generatedText = result?.response?.candidates[0]?.content?.parts[0]?.text || '';

        const codeRegex = /```(java|python|javascript|cpp|c|go|ruby|typescript|php|swift|kotlin|r|scala|perl|bash|shell|html|css|json|yaml|dart|flutter|csharp|objectivec|powershell|lua|haskell|elixir|clojure|fortran|matlab|groovy|vbnet|rust|fsharp)\n([\s\S]*?)```/gi;
        const match = generatedText.match(codeRegex);

        if (match) {
            res.json({ code: match[0].replace(/```(java|python|javascript|cpp|c|go|ruby|typescript|php|swift|kotlin|r|scala|perl|bash|shell|html|css|json|yaml|dart|flutter|csharp|objectivec|powershell|lua|haskell|elixir|clojure|fortran|matlab|groovy|vbnet|rust|fsharp)\n|```/g, "").trim() });
        } else {
            res.json({ code: generatedText.trim() });
        }

    } catch (error) {
        console.error("Error generating code:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
