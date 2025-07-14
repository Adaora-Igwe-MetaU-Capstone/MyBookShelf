const express = require("express");
const router = express.Router();
// get popular books
router.get("/popular", async (req, res) => {
    const ApiKey = process.env.VITE_API_KEY
    try {
        const subjects = ['african', 'romance', 'mystery',
            'fantasy', 'science fiction', 'thriller', 'horror',
            'biography', 'history', 'self help', 'cooking',
            'spiritual',
            'children', 'poetry', 'comics',
            'graphic novels',];
        const allBooks = [];

        for (const subject of subjects) {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${subject}&orderBy=newest&maxResults=10&key=${ApiKey}`);
            const data = await response.json();
            if (data.items) {
                allBooks.push(...data.items);
            }
        }
        const uniqueBooksMap = new Map();
        for (const book of allBooks) {
            if (book.volumeInfo.imageLinks?.thumbnail) {
                uniqueBooksMap.set(book.id, book);
            }
        }
        const uniqueBooks = Array.from(uniqueBooksMap.values());
        console.log('Combined books:', uniqueBooks);


        // const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:romance&orderBy=newest&maxResults=40&key=${ApiKey}`)
        // const data = await response.json()
        res.json(uniqueBooks)
    } catch (err) {
        console.error("Error fetching books: ", err)
        res.status(500).json({ error: "Error fetching books" })
    }

}
)

//get searched books
router.get("/search", async (req, res) => {
    const { q } = req.query
    const ApiKey = process.env.VITE_API_KEY
    const query = q || "bestsellers"
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=30&key=${ApiKey}`)
        const data = await response.json()
        res.json(data.items)
    } catch (err) {
        console.error("Error fetching books: ", err)
        res.status(500).json({ error: "Error fetching books" })
    }
})
module.exports = router
