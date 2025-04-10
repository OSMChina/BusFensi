import { openDB, IDBPDatabase } from 'idb';
import { PersistStorage } from 'zustand/middleware';

// Database instance cache keyed by dbName
const dbCache: Record<string, Promise<IDBPDatabase>> = {};

export const createIDBStorage = <T>(options: { dbName: string; storeName: string }): PersistStorage<T> => {
    const { dbName, storeName } = options;

    const getDatabase = async () => {
        if (!dbCache[dbName]) {
            dbCache[dbName] = openDB(dbName, 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName);
                    }
                },
                terminated: () => {
                    delete dbCache[dbName]; // Remove from cache on connection loss
                },
            });
        }
        return dbCache[dbName];
    };

    return {
        getItem: async (name: string) => {
            try {
                const db = await getDatabase();
                const value = await db.get(storeName, name);
                return value ? JSON.parse(value) : null;
            } catch (error) {
                console.error('IDB getItem failed:', error);
                return null;
            }
        },
        setItem: async (name: string, value: unknown) => {
            try {
                const db = await getDatabase();
                const tx = db.transaction(storeName, 'readwrite');
                // Stringify the entire StorageValue object
                await tx.store.put(JSON.stringify(value), name);
                await tx.done;
            } catch (error) {
                console.error('IDB setItem failed:', error);
            }
        },
        removeItem: async (name: string) => {
            try {
                const db = await getDatabase();
                const tx = db.transaction(storeName, 'readwrite');
                await tx.store.delete(name);
                await tx.done;
            } catch (error) {
                console.error('IDB removeItem failed:', error);
            }
        },
    };
};
