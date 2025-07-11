import { openDB } from "idb";

const DB_NAME = "my-bookshelf";
const STORE_NAME = 'homepageBooks';
export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME)
            }
        }
    })

}
export const saveBookstoDB = async (books) => {
    const db = await initDB();
    await db.put(STORE_NAME, books, 'books');
}

export const getBooksFromDB = async () => {
    const db = await initDB();
    return db.get(STORE_NAME, 'books')
}
