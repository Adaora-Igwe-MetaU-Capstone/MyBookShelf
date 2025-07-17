const fs = require('fs');
const csv = require('csv-parser');
const results = [];
const seenBooks = new Set();
function parseArrayString(str) {
    try {
        const fixedStr = str.replace(/'/g, '"');
        return JSON.parse(fixedStr);
    } catch {
        return [];
    }
}
fs.createReadStream('GoogleBookAPIDataset 2.csv')
    .pipe(csv())
    .on('data', (data) => {
        const title = data['title']?.trim();
        const authorsRaw = data['authors'] || '[]';
        const categoriesRaw = data['categories'] || '[]';
        const rating = parseFloat(data['averageRating']);
        if (!title || isNaN(rating) || rating < 3) return;
        const authors = parseArrayString(authorsRaw).map(a => a.trim().toLowerCase());
        const categories = parseArrayString(categoriesRaw).map(c => c.trim().toLowerCase());
        if (authors.length === 0) return;
        const bookKey = `${title.toLowerCase()}|${authors[0]}`;
        if (seenBooks.has(bookKey)) return;
        seenBooks.add(bookKey);
        const book = {
            id: data['id'],
            title,
            authors,
            categories,
            averageRating: rating,
            maturityRating: data['maturityRating'],
            publishedDate: data['publishedDate'],
            pageCount: parseInt(data['pageCount']) || 0,
            description: data['desc']?.trim() || '',
        };
        results.push(book);
    })
    .on('end', () => {
        fs.writeFileSync('cleaned_books.json', JSON.stringify(results, null, 2));
    })
    .on('error', (err) => {
        console.error('Error reading CSV:', err);
    });
