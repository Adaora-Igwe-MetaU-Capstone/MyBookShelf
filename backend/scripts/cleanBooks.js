const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const seenBooks = new Set();

fs.createReadStream('Books_df.csv')
    .pipe(csv())
    .on('data', (data) => {
        const title = data['Title']?.trim();
        const author = data['Author']?.trim();
        const mainGenre = data['Main Genre']?.trim();
        const subGenre = data['Sub Genre']?.trim();
        const rating = parseFloat(data.Rating);
        const numRated = parseInt(data['No. of People rated']);
        const url = data['URLs']?.trim();

        if (
            !title || !author || !mainGenre || !subGenre || isNaN(rating) || isNaN(numRated) || rating < 3 || numRated < 10
        ) return;

        const bookKey = `${title.toLowerCase()}|${author.toLowerCase()}`;
        if (seenBooks.has(bookKey)) return;

        seenBooks.add(bookKey);

        const categories = [
            ...mainGenre.split(',').map(category => category.trim()),
            ...subGenre.split(',').map(category => category.trim()),
        ];

        const book = {
            title,
            author,
            categories,
            averageRating: rating,
            ratingsCount: numRated,
            url,
        };

        results.push(book);
    })
    .on('end', () => {
        fs.writeFileSync('cleaned_books.json', JSON.stringify(results, null, 2));

    });
