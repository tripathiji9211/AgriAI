import { openDB, DBSchema } from 'idb';

interface AgriAIDB extends DBSchema {
  pendingScans: {
    key: string;
    value: {
      id: string;
      imageBlob: File;
      timestamp: number;
    };
  };
  results: {
    key: string;
    value: {
      id: string;
      data: unknown;
      timestamp: number;
    };
  }
}

let dbPromise: ReturnType<typeof openDB<AgriAIDB>> | null = null;

export function getDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<AgriAIDB>('agriai-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('pendingScans')) {
          db.createObjectStore('pendingScans', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('results')) {
          db.createObjectStore('results', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function savePendingScan(imageBlob: File) {
  const db = await getDB();
  if (!db) return null;
  const id = Date.now().toString();
  await db.put('pendingScans', {
    id,
    imageBlob,
    timestamp: Date.now(),
  });
  return id;
}

export async function getPendingScans() {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('pendingScans');
}

export async function removePendingScan(id: string) {
  const db = await getDB();
  if (!db) return;
  return db.delete('pendingScans', id);
}

export async function saveResult(id: string, data: unknown) {
  const db = await getDB();
  if (!db) return;
  await db.put('results', { id, data, timestamp: Date.now() });
}

export async function getResult(id: string) {
  const db = await getDB();
  if (!db) return null;
  return db.get('results', id);
}
