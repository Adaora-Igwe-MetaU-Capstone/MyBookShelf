const fs = require('fs');
const path = require('path');
const {
    cosineSimilarity,
    getAuthorSimilarity,
    normalizeRating,
    getSimilarity,
} = require('../utils/similarityUtils');

const books = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/cleaned_books.json'))
);
console.log(books.length, 'books loaded')
books.slice(0, 10).forEach(b => console.log(b.title));

// Pick two books to test
const bookA = books.find(b => b.title.toLowerCase().includes('angels'));
console.log('Found bookA:', bookA?.title);

const bookB = books.find(b => b.title.toLowerCase().includes('sushi'));
console.log('Found bookB:', bookB?.title);


if (!bookA || !bookB) {
    console.log('❌ One or both test books not found.');
    process.exit(1);
}

console.log(`📚 Comparing: "${bookA.title}" vs "${bookB.title}"`);
console.log('---');
console.log('📊 Category Similarity:', cosineSimilarity(bookA.categoryVector, bookB.categoryVector).toFixed(2));
console.log('👤 Author Match Bonus:', getAuthorSimilarity(bookA, bookB));
console.log('⭐️ Rating Score:', normalizeRating(bookB.averageRating).toFixed(2));
console.log('🔥 Hybrid Score:', getSimilarity(bookA, bookB).toFixed(2));
