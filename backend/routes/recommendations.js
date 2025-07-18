const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { getSimilarity } = require("../utils/similarityUtils");
const { getCategories, addVectorsToBooks } = require("../utils/categoryUtils.js");
const prisma = new PrismaClient();
router.get('/recs', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: No user ID in session" });
    }
    try {
        const userWithBooks = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                bookshelves: {
                    include: { books: true }
                }
            }
        });
        if (!userWithBooks || !userWithBooks.bookshelves?.length) {
            return res.status(200).json([]);
        }
        const userBooks = userWithBooks.bookshelves.flatMap(bs => bs.books);

        if (userBooks.length === 0) {
            return res.status(200).json([]);
        }
        console.log('userBooks:', userBooks);

        const categoryList = getCategories(userBooks);
        const enrichedUserBooks = addVectorsToBooks(userBooks, categoryList);
        const userBookGoogleIds = enrichedUserBooks.map(b => b.googleId).filter(Boolean);
        const otherBooksRaw = await prisma.recBook.findMany({
            where: {
                googleId: {
                    notIn: userBookGoogleIds
                }
            }
        });
        const enrichedOtherBooks = addVectorsToBooks(otherBooksRaw, categoryList);
        let recs = [];
        enrichedUserBooks.forEach(userBook => {
            enrichedOtherBooks.forEach(otherBook => {
                const similarity = getSimilarity(userBook, otherBook);
                recs.push({ book: otherBook, similarity });
            });
        });
        const deduped = new Map();
        recs.forEach(({ book, similarity }) => {
            if (!deduped.has(book.googleId) || deduped.get(book.googleId).similarity < similarity) {
                deduped.set(book.googleId, { book, similarity });
            }
        });
        const top = Array.from(deduped.values())
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 10)
            .map(entry => entry.book);
        res.status(200).json(top);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});
module.exports = router;
