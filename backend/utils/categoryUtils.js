export function getCategories(books) {
    const allCategories = new Set()
    books.forEach(book => {
        book.genres.forEach(category => {
            allCategories.add(category.trim())
        })

    })
    return Array.from(allCategories)

}

export function createCategoryVector(book, categoryList) {
    return categoryList.map(category => book.genres.includes(category) ? 1 : 0)
}

export function addVectorsToBooks(books, categoryList) {
    return books.map(book => ({
        ...book,
        categoryVector: createCategoryVector(book, categoryList)
    }))

}
