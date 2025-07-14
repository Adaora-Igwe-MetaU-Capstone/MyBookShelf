const express = require('express')
const router = express.Router()
const { getUserPreferences } = require('../utils/recommendations')
const { PrismaClient } = require("@prisma/client");
const { connect } = require("./auth");
const prisma = new PrismaClient();

// get recommendations
router.get('/', async (req, res) => {
    const userId = 1
    const ApiKey = process.env.VITE_API_KEY
    // if (!userId) {
    //     return res.status(401).json({ error: "Not logged in" })
    // }
    try {
        const books = await prisma.book.findMany({
            where: {
                bookshelf: {
                    userId
                }
            },
            include: {
                reviews: true
            }
        }
        )
        const reviews = await prisma.review.findMany({
            where: { userId },
            include: {
                book: true
            }
        })
        console.log(getUserPreferences(reviews))
        const { topAuthors, topKeyWord } = getUserPreferences(reviews)
        const keyWordQuery = topKeyWord.map(k => `subject:${encodeURIComponent(k)}`).join("+")
        const authorQuery = topAuthors.map(a => `inauthor:${encodeURIComponent(a)}`).join('+')
        const finalQuery = `${keyWordQuery}+${authorQuery}`
        console.log('a', keyWordQuery, 'b', authorQuery)
        const queryParts = [...topKeyWord, ...topAuthors]
        const cleanedQuery = queryParts.map(k => encodeURIComponent(k)).join('+')
        const apiURL = `https://www.googleapis.com/books/v1/volumes?q=${cleanedQuery}&maxResults=20&key=${ApiKey}`

        console.log(apiURL)
        const response = await fetch(apiURL)
        const data = await response.json();
        console.log(data)
        const recommendations = data.items?.filter(item => {
            const googleId = item.id;
            return !books.some(book => book.googleId === googleId);
        }).map(item => ({
            googleId: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors?.join(", "),
            genres: item.volumeInfo.categories?.join(", "),
            thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        }))
        console.log(recommendations)
        res.json(recommendations, [])
    } catch (err) {
        console.error("Error fetching recommendatios:", err);
        res.status(500).json({ error: "Failed to fetch" })
    }

})

module.exports = router;
