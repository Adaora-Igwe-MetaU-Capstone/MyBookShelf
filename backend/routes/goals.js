const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { connect } = require("./auth");
const prisma = new PrismaClient();

//add goals
router.post('/setgoal', async (req, res) => {
    const userId = req.session.userId
    const { year, target } = req.body
    if (!userId) {
        return res.status(401).json({ error: "Not logged in." })
    }
    try {
        const goal = await prisma.goal.upsert({
            where: {
                userId_year: {
                    userId,
                    year
                }
            },
            update: { target: parseInt(target) },
            create: { userId, year, target: parseInt(target) }
        }
        )
        res.json(goal)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Could not set goal" })
    }
})
//get goals
router.get('/goal', async (req, res) => {
    const userId = req.session.userId;
    console.log(userId)
    const currentYear = new Date().getFullYear();
    if (!userId) {
        return res.status(401).json({ error: "Not logged in." })
    }
    try {
        const goal = await prisma.goal.findFirst({
            where: {
                userId,
                year: currentYear
            },
        });
        res.json(goal)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Error!" })
    }
})

//get progress on goal
router.get('/progress', async (req, res) => {
    const currentYear = new Date().getFullYear();
    const userId = req.session.userId;
    const read = await prisma.bookshelf.findFirst({
        where: {
            name: 'Read',
            userId: userId
        }
    })
    console.log(read)
    const booksRead = await prisma.book.findMany({
        where: {
            userId,
            bookshelfId: read.id,
            createdAt: {
                gte: new Date(`${currentYear}-01-01T00:00:00.000Z`)
            }

        },

    })
    console.log(booksRead)
    res.json(booksRead.length)
})
module.exports = router
