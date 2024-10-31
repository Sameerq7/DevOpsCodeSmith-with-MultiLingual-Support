import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json());
app.use(express.static("public"));

app.post("/generate-code", async (req, res) => {
    const { problem } = req.body;
    if (!problem) {
        return res.status(400).json({ error: "Problem statement is required." });
    }

    try {
        const result = await model.generateContent(problem);
        const generatedText = result?.response?.candidates[0]?.content?.parts[0]?.text || '';

        // Regex to capture code blocks in different languages
        const codeRegex = /```(java|python|javascript|cpp|c|go|ruby|typescript|php|swift|kotlin|r|scala|perl|bash|shell|html|css|json|yaml|dart|flutter|csharp|objectivec|powershell|lua|haskell|elixir|clojure|fortran|matlab|groovy|vbnet|rust|fsharp)\n([\s\S]*?)```/gi;
        const match = generatedText.match(codeRegex);

        // If code block is found, send the code part only; otherwise, send the whole generated text
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
