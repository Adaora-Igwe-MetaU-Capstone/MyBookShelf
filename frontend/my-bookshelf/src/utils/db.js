import { openDB } from "idb";

const DB_NAME = "my-bookshelf";
const STORE_NAME = 'homepageBooks';
const QUEUE_STORE = 'offlineQueue'
export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME)
            }
            if (!db.objectStoreNames.contains(QUEUE_STORE)) {
                db.createObjectStore(QUEUE_STORE, { autoIncrement: true })
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


export const addToQueue = async (action) => {
    const db = await initDB()
    const tx = db.transaction(QUEUE_STORE, 'readwrite')
    await tx.store.add(action)
    await tx.done
}
export const getQueue = async () => {
    const db = await initDB()
    const tx = db.getAll(QUEUE_STORE)
    await tx.done
}


export const removeFromQueue = async (key) => {
    const db = await initDB()
    const tx = db.transaction(QUEUE_STORE, 'readwrite')
    await tx.store.delete(key)
    await tx.done
}
export const clearQueue = async (action) => {
    const db = await initDB()
    const tx = db.transaction(QUEUE_STORE, 'readwrite')
    await tx.store.clear()
    await tx.done
}
const deduplicate = (queue) => {
    const seen = new Map()
    const result = []
    for (let action of queue) {
        const key = `${action.type}-${action?.data?.googleId || ''}`
        seen.set(key, action)
        // if (seen.has(key)) {
        //     const existingIndex = result.findIndex((a) => `${a.type}-${a?.data?.googleId || ''}` === key)
        //     if (existingIndex !== 1) {
        //         result[existingIndex] = action
        //     }
        // } else {
        //     seen.set(key, true)
        //     result.push(action)
        // }
    }
    return Array.from(seen.values())
}
export const syncQueue = async () => {
    const db = await initDB()
    const tx = db.transaction(QUEUE_STORE, 'readonly')
    const keys = await tx.store.getAllKeys()
    const actions = await tx.store.getAll()
    const deduplicatedActions = deduplicate(actions)
    for (let i = 0; i < deduplicatedActions.length; i++) {
        const action = deduplicatedActions[i]
        try {
            if (action.type === "ADD_TO_SHELF") {
                await fetch("http://localhost:3000/bookshelf/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(action.data)
                })
            }
            else if (action.type === "SAVE_REFLECTION") {
                const res = await fetch('http://localhost:3000/reflection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(action.data)
                })
                if (res.ok) {
                    window.dispatchEvent(new CustomEvent('REFLECTION_SAVED', {
                        detail: {
                            reflection: action.data.content,
                            googleId: action.data.googleId
                        }
                    }));

                }
            }
            else if (action.type === "ADD_REVIEW") {
                const res = await fetch('http://localhost:3000/review', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(action.data)
                }
                )
                if (res.ok) {
                    window.dispatchEvent(new CustomEvent('REVIEW_SAVED', {
                        detail: {
                            review: action.data.content,
                            rating: Number(action.data.rating),
                            googleId: action.data.googleId
                        }
                    }));

                }
            } else if (action.type === "EDIT_REVIEW") {
                const res = await fetch(`http://localhost:3000/review/${action.data.googleId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                    body: JSON.stringify({
                        content: action.data.content,
                        rating: action.data.rating
                    })
                })
                if (res.ok) {
                    window.dispatchEvent(new CustomEvent('REVIEW_SAVED', {
                        detail: {
                            review: action.data.content,
                            rating: Number(action.data.rating),
                            googleId: action.data.googleId
                        }
                    }));

                }
            } else if (action.type === "SAVE_GOAL") {
                const res = await fetch(`http://localhost:3000/goal`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                    body: JSON.stringify({
                        year: action.data.year,
                        target: action.data.target,
                        isPublic: action.data.isPublic

                    })
                })
                if (res.ok) {

                    window.dispatchEvent(new CustomEvent('GOAL_SAVED', {
                        detail: {
                            year: action.data.year,
                            target: Number(action.data.target),
                            isPublic: action.data.isPublic,
                            userId: action.data.userId
                        }
                    }));


                }
            }
            await removeFromQueue(keys[i])
        } catch (err) {
            console.error('Failed to sync', err)
        }
    }
}
export { STORE_NAME, QUEUE_STORE }
