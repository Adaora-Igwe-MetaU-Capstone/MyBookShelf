const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('google_books_dataset.csv')
    .pipe(csv())
    .on('data', (data) => {
        const title = data['Title']?.trim()
        const author = data['Author']?.trim()
        const mainGenre = data['Main Genre']?.trim()
        const subGenre = data['Sub Genre']?.trim()
        const rating = parseFloat(data.Rating);
        const numRated = parseInt(data['No. of People rated'])
        const url = data['URLs']?.trim()
        if (
            !title || !author || !mainGenre || !subGenre || isNan(rating) || isNan(numRated) || rating < 3 || numRated < 10
        ) return;
        const categories = [
            ...mainGenre.split(',').map(category => category.trim()),
            ...subGenre.split(',').map(category => category.trim()),
        ]
        const book = {
            title,
            author,
            categories,
            averageRating: rating,
            ratingsCount: numRated,
            url,
        }
        results.push(book);


    })
    .on('end', () => {
        fs.writeFileSync('cleaned_books.json', JSON.stringify(results, null, 2));
        console.log('✅ Cleaned data saved to cleaned_books.json');
    });
