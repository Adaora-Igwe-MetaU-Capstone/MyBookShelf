function getUserPreferences(reviews) {
    const keyWordCount = {}
    const authorCount = {}
    reviews.forEach(review => {
        if (review.rating >= 4 && review.book) {
            // if (book.genres && Array.isArray(book.genres)) {
            //     book.genres.forEach(genre => {
            //         genreCount[genre] = (genreCount[genre] || 0) + 1

            //     })
            // }
            const author = review.book.author
            const titleWords = review.book.title.split(" ")
            if (author) {
                authorCount[author] = (authorCount[author] || 0) + 1
            }
            // if (book.title) {
            //     const words = book.title.toLowerCase().replace(/[^a-zA-Z\s]/g, '').split(/\s+/)

            titleWords.forEach(word => {
                const lower = word.toLowerCase()
                if (lower.length > 3) {
                    keyWordCount[lower] = (keyWordCount[lower] || 0) + 1

                }
            })

        }
    }
    )
    const sortedKeyword = Object.entries(keyWordCount).sort((a, b) => b[1] - a[1])
    const sortedAuthor = Object.entries(authorCount).sort((a, b) => b[1] - a[1])

    return {
        topKeyWord: sortedKeyword.slice(0, 3).map(([k]) => k),
        topAuthors: sortedAuthor.slice(0, 3).map(([a]) => a)
    }

}
module.exports = { getUserPreferences }
