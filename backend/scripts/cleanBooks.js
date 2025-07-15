const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const seenTitles = new Set();

fs.createReadStream('google_books_dataset.csv')
    .pipe(csv())
    .on('data', (data) => {
        const rating = parseFloat(data.averageRating);
        const title = data.title?.trim().toLowerCase();

        if (
            title &&
            data.categories &&
            !isNaN(rating) &&
            rating >= 3 &&
            !seenTitles.has(title)
        ) {
            const cleanedCategories = data.categories
                .split(/[\/,]/)
                .map(cat => cat.trim().toLowerCase());

            results.push({
                title: data.title.trim(),
                categories: cleanedCategories,
                averageRating: rating,
            });

            seenTitles.add(title);
        }
    })
    .on('end', () => {
        fs.writeFileSync('cleaned_books.json', JSON.stringify(results, null, 2));
    });
