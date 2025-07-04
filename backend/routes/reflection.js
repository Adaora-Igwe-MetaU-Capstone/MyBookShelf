const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { connect } = require("./auth");
const prisma = new PrismaClient();

router.post('/reflection', async (req, res) => {
    const userId = req.session.userId;
    const { googleId, content, title, author, cover, description } = req.body;
    if (!userId) {
        return res.status(401).json({ error: "Not logged in." });
    }
    try {
        let book = await prisma.book.findUnique({
            where: { googleId }
        })
        const shelf = await prisma.bookshelf.findFirst({
            where: {
                userId,
                // googleId,
                name: "Read"
            }
        })
        console.log("shelf", shelf)
        if (!book) {
            book = await prisma.book.create({
                data: {
                    googleId,
                    title,
                    author,
                    cover,
                    description,
                    bookshelf: {
                        connect: { id: shelf.id }  // <-- correct way to connect relation
                    }



                }
            })
        }

        // if (!shelf) {
        //     await prisma.bookshelf.create({
        //         data: {
        //             userId,
        //             googleId,
        //             name: "Read",
        //         }
        //     })
        // }
        const reflection = await prisma.reflection.upsert({
            where: {
                userId_googleId: {
                    userId: userId,
                    googleId: googleId,
                },
            },
            update: {
                content,
            },
            create: {
                userId: userId,
                googleId: googleId,
                content: content,
                // title,
                // author,
                // cover,
                // description
            },
        });
        res.json(reflection);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong." });
    }
});

router.get('/reflection/:googleId', async (req, res) => {
    const userId = req.session.userId;
    const googleId = req.params.googleId
    console.log(userId, googleId)
    if (!userId) {
        return res.status(401).json({ error: "Not logged in." });
    }

    try {
        const reflection = await prisma.reflection.findUnique({
            where: {
                userId_googleId: { userId, googleId }
            }
        })
        res.json(reflection);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong." });
    }
})
module.exports = router;
