const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { connect } = require("./auth");
const prisma = new PrismaClient();

router.post('/reflection', async (req, res) => {
    const userId = req.session.userId;
    const { bookId, content } = req.body;
    if (!userId) {
        return res.status(401).json({ error: "Not logged in." });
    }
    try {
        const reflection = await prisma.reflection.upsert({
            where: {
                userId_bookId: {
                    userId: userId,
                    bookId: bookId,
                },
            },
            update: {
                content,
            },
            create: {
                userId: userId,
                bookId: bookId,
                content: content,
            },
        });
        res.json(reflection);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong." });
    }
});

router.get('/reflection/:bookId', async (req, res) => {
    const userId = req.session.userId;
    const bookId = parseInt(req.params.bookId);
    console.log(userId, bookId)
    if (!userId) {
        return res.status(401).json({ error: "Not logged in." });
    }
    try {
        const reflection = await prisma.reflection.findUnique({
            where: {
                userId_bookId: { userId, bookId }
            }
        })
        res.json(reflection);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong." });
    }
})
module.exports = router;
