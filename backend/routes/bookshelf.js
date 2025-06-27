const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET ALL BOOKS
router.get("/bookshelf", async (req, res)=>{
    const userId = req.session.userId;

    const bookshelf = await prisma.bookshelf.findMany({
        where: {userId: userId},
        include:{books: true}
    });
    res.json(bookshelf);
})

//ADD TO BOOKSHELF
router.post("/bookshelf/:bookshelfId/add", async (req, res) =>{
    console.log("men", req.session)
    const userId = req.session.userId;
    const {bookshelfId, description, title, author, cover, googleId} = req.body;

    const bookshelf = await prisma.bookshelf.findFirst({
        where: {id: bookshelfId, userId }
    })
    if(!bookshelf){
        return res.status(403).json({error: "Unauthorized Access"})
    }

    const newBook = await prisma.book.create({
        data: {
            title, author, cover, description, googleId, bookshelfId
        }
    })
    res.status(201).json(newBook);
})


module.exports = router
