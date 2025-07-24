import express from "express";
import { GoogleGenerativeAI } from "@google/genai";
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
router.post("/generate-prompt", async (req, res) => {
    const { title, authors, description } = req.body;
    const prompt = `
  Create a thoughtful, open-ended reflection prompt for a reader who has just finished a book titled "${title}" by ${authors?.join(", ")}.
  The book description is: "${description}"
  Keep the tone personal, inviting introspection.`;
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        res.json({ prompt: text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate prompt." });
    }
});

module.exports = router;
