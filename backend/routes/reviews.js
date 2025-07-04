const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { connect } = require("./auth");
const prisma = new PrismaClient();

//get all reviews
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: true
            }
        })
        console.log(reviews)
        res.json(reviews)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

//add reviews
router.post('/review', async (req, res) => {
    const userId = req.session.userId;
    const { googleId, content, title, author, cover, description, rating } = req.body;
    // if (!userId) {
    //     return res.status(401).json({ error: "Not logged in." });
    // }
    try {
        let book = await prisma.book.findUnique({
            where: { googleId }
        })
        if (!book) {
            book = await prisma.book.create({
                data: {
                    googleId,
                    title,
                    author,
                    cover,
                    description,


                }
            })
        }
        const shelf = await prisma.bookshelf.findFirst({
            where: {
                userId,
                // googleId,
                name: "Read"
            }
        })
        if (!shelf) {
            await prisma.bookshelf.create({
                data: {
                    userId,
                    // googleId,
                    name: "Read",
                }
            })
        }
        console.log({ googleId, userId, rating, content })
        const review = await prisma.review.create({
            data: {
                user: { connect: { id: userId } },
                book: { connect: { id: googleId } },
                content: content,
                rating: Number(rating)
            }
        })
        console.log(review)
        res.json(review)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})
module.exports = router
