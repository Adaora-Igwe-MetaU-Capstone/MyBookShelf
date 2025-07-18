const fs = require('fs');
const path = require('path');
const {
    cosineSimilarity,
    getAuthorSimilarity,
    normalizeRating,
    getSimilarity,
} = require('../utils/similarityUtils');

const books = await Prisma.recBook.findMany()

// Pick two books to test
const bookA = books.find(b => b.title.toLowerCase().includes('harry potter'));

const bookB = books.find(b => b.title.toLowerCase().includes('sherlock holmes'));


if (!bookA || !bookB) {
    console.log('❌ Error: Could not find books to test')
    process.exit(1);
}

console.log(`📚 Comparing: "${bookA.title}" vs "${bookB.title}"`);
console.log('---');
console.log('📊 Category Similarity:', cosineSimilarity(bookA.categoryVector, bookB.categoryVector).toFixed(2));
console.log('👤 Author Match Bonus:', getAuthorSimilarity(bookA, bookB));
console.log('⭐️ Rating Score:', normalizeRating(bookB.averageRating).toFixed(2));
console.log('🔥 Hybrid Score:', getSimilarity(bookA, bookB).toFixed(2));
