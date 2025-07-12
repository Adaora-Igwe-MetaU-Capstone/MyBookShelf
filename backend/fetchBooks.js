const fs = require('fs');
const axios = require('axios');
const GENRES = ["fantasy", "romance", "young adult", "science fiction", "thriller", "mystery", "historical fiction",
    "contemporary", "nonfiction", "biography", "self help", "memoir",
    "graphic novel", "poetry", "classic", "horror", "drama", "comedy", "adventure", "children"];
const MAX_BOOKS_PER_GENRE = 80;
const BATCH_SIZE = 40;
let allBooks = [];

async function fetchBooksByGenre(genre) {
    let books = [];
    for (let start = 0; start < MAX_BOOKS_PER_GENRE; start += BATCH_SIZE) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&startIndex=${start}&maxResults=${BATCH_SIZE}`;
        try {
            const response = await axios.get(url);
            const items = response.data.items || [];
            items.forEach(item => {
                if (item.volumeInfo?.title && item.id) {
                    books.push({
                        googleId: item.id,
                        title: item.volumeInfo.title,
                        authors: item.volumeInfo.authors || [],
                        genres: item.volumeInfo.categories || [],
                        genreSource: genre
                    });
                }
            });
        } catch (err) {
            console.error(`Error fetching ${genre} @ ${start}:`, err.message);
        }
    }
    console.log(`Fetched ${books.length} books for genre: ${genre}`);
    return books;
}
async function fetchAllGenres() {
    for (let genre of GENRES) {
        const books = await fetchBooksByGenre(genre);
        allBooks = allBooks.concat(books);
    }
    fs.writeFileSync('books.json', JSON.stringify(allBooks, null, 2));
    console.log(`📚 Done! Total books fetched: ${allBooks.length}`);

}
fetchAllGenres();
