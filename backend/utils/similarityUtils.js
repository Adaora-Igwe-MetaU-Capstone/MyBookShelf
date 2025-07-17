export function dotProduct(a, b) {
    return a.reduce((sum, val, i) => sum + val * b[i], 0)
}

export function magnitude(v) {
    return Math.sqrt(dotProduct(v, v))
}

export function cosineSimilarity(a, b) {
    const dot = dotProduct(a, b)
    const magA = magnitude(a)
    const magB = magnitude(b)
    if (magA == 0 || magB == 0) return 0;
    return dot / (magA * magB)
}

export function getAuthorSimilarity(bookA, bookB) {
    if (!bookA.author || !bookB.author) return 0;
    return bookA.author == bookB.author ? 1 : 0;
}

export function normalizeRating(rating, min = 1, max = 5) {
    if (!rating || isNaN(rating)) return 0;
    return (rating - min) / (max - min);
}

function getSimilarity(bookA, bookB) {
    const categorySimilarity = cosineSimilarity(bookA.categoryVector, bookB.categoryVector);
    // const vecA = vectorizeGenres(bookA.genres);
    // const vecB = vectorizeGenres(bookB.genres);
    // const categorySimilarity = cosineSimilarity(vecA, vecB);
    const authorSimilarity = getAuthorSimilarity(bookA, bookB);
    const ratingSimilarity = normalizeRating(bookB.averagerating)

    return (
        categorySimilarity * 0.6 +
        authorSimilarity * 0.2 +
        ratingSimilarity * 0.2
    )
}
export {
    getSimilarity
}
