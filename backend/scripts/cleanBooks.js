const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('google_books_dataset.csv')
    .pipe(csv())
    .on('data', (data) => {
        const rating = parseFloat(data.averageRating);
        if (data.title && data.categories && !isNaN(rating) && rating >= 3) {
            const cleanedCategories = data.categories
                .split(/[\/,]/)
                .map(cat => cat.trim().toLowerCase());

            results.push({
                title: data.title.trim(),
                categories: cleanedCategories,
                averageRating: rating,
            });
        }
    })
    .on('end', () => {
        fs.writeFileSync('cleaned_books.json', JSON.stringify(results, null, 2));
        console.log('✅ Cleaned data saved to cleaned_books.json');
    });
