import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Correct route definition
router.post('/generate-code', async (req, res) => {
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
            const code = match[0].replace(/```(java|python|javascript|cpp|c|go|ruby|typescript|php|swift|kotlin|r|scala|perl|bash|shell|html|css|json|yaml|dart|flutter|csharp|objectivec|powershell|lua|haskell|elixir|clojure|fortran|matlab|groovy|vbnet|rust|fsharp)\n|```/g, "").trim();
            res.json({ code });
        } else {
            res.json({ code: generatedText.trim() });
        }

    } catch (error) {
        console.error("Error generating code:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default router;
