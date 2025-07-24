const express = require("express");
const router = express.Router();
const { generatePrompt } = require("../utils/geminiClient");
router.post("/generate-prompt", async (req, res) => {
    try {
        const { title, authors, description } = req.body;
        const prompt = await generatePrompt({ title, authors, description });
        res.json({ prompt: prompt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate prompt." });
    }
});
module.exports = router;
