export function getCategories(books) {
    const allCategories = new Set()
    books.forEach(book => {
        book.categories.forEach(category => {
            allCategories.add(category.trim())
        })
    })
    return Array.from(allCategories)
}
export function createCategoryVector(book, categoryList) {
    const categories = book.categories || book.genres || [];
    return categoryList.map(category => categories.includes(category) ? 1 : 0);
}
export function addVectorsToBooks(books, categoryList) {
    return books.map(book => ({
        ...book,
        categoryVector: createCategoryVector(book, categoryList)
    }))
}
