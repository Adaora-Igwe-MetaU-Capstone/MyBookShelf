const express = require("express");
const router = express.Router();
const { generatePrompt } = require("../utils/geminiClient");
const redisClient = require("../utils/redisClient");
const cacheKey = "reflection-prompts"
const indexKey = "current-index"
const cacheExpiryTime = 86400;
async function getCachedPrompts() {
    const promptsJSON = await redisClient.get(cacheKey);
    const index = await redisClient.get(indexKey);
    const prompts = promptsJSON ? JSON.parse(promptsJSON) : [];
    return { prompts, index: index ? parseInt(index) : 0 };
}
async function setCachedPrompts(prompts) {
    await redisClient.set(cacheKey, JSON.stringify(prompts), {
        EX: cacheExpiryTime,
    });
    await redisClient.set(indexKey, 0, {
        EX: cacheExpiryTime,
    });
}
async function incrementPromptIndex() {
    const index = await redisClient.incr(indexKey);
    return index;
}
router.post("/generate-prompt", async (req, res) => {
    try {
        const { title, authors, description } = req.body;
        const { prompts, index } = await getCachedPrompts();
        if (!prompts.length || index >= prompts.length) {
            const newPrompts = await generatePrompt({ title, authors, description });
            await setCachedPrompts(newPrompts);
            prompts = newPrompts;
            index = 0;
        }
        const currPrompt = prompts[index]
        await incrementPromptIndex();
        res.json({ prompt: currPrompt });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate prompt." });
    }
});
module.exports = router;
