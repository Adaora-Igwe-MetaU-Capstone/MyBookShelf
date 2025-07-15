const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const { connect } = require("./auth");
const prisma = new PrismaClient();

router.get('/recs', async (req, res) => {
    const userId = req.session.userId;
    const bookshelves = await prisma.bookshelf.findMany({
        where: { userId },
        include: { books: true }
    })
})
module.exports = router;
