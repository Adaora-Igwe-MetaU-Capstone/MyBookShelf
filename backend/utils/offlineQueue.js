const OFFLINE_QUEUE_KEY = 'offlineActionsQueue';

export function getOfflineQueue() {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
}
export function addToOfflineQueue(action) {
    const queue = getOfflineQueue();
    queue.push(action);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}
export function removeSyncedAction(action) {
    const queue = getOfflineQueue();
    queue.splice(index, 1)
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}
export function clearOfflineQueue() {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
}
export async function syncOfflineQueue() {
    const queue = getOfflineQueue();
    for (const action of queue) {
        try {
            const { type, data } = action
            if (type === 'ADD_TO_SHELF') {
                await fetch("http://localhost:3000/bookshelf/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(data)
                })

            }
            else if (type === 'SAVE_REFLECTION') {
                await fetch('http://localhost:3000/reflection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(data)
                })

            }

        } catch (err) {
            console.error(`Failed to sync action ${type}:`, err)

        }
    }
    localStorage.removeItem("OfflineQueue")
}
