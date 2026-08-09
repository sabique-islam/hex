import type { EditorKind } from "./kinds";

const DB_NAME = "hex-files";
const DB_VERSION = 1;
const STORE = "files";

export interface HexFileRecord {
  id: string;
  kind: EditorKind;
  name: string;
  bytes: ArrayBuffer;
  updatedAt: number;
  createdAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt");
        store.createIndex("kind", "kind");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB tx failed"));
    tx.onabort = () => reject(tx.error ?? new Error("IndexedDB tx aborted"));
  });
}

export function newFileId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `f-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function putFile(
  record: Omit<HexFileRecord, "createdAt" | "updatedAt"> & {
    createdAt?: number;
    updatedAt?: number;
  },
): Promise<HexFileRecord> {
  const db = await openDb();
  const now = Date.now();
  const full: HexFileRecord = {
    id: record.id,
    kind: record.kind,
    name: record.name,
    bytes: record.bytes,
    createdAt: record.createdAt ?? now,
    updatedAt: record.updatedAt ?? now,
  };
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(full);
  await txDone(tx);
  db.close();
  return full;
}

export async function getFile(id: string): Promise<HexFileRecord | null> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readonly");
  const req = tx.objectStore(STORE).get(id);
  const result = await new Promise<HexFileRecord | undefined>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as HexFileRecord | undefined);
    req.onerror = () => reject(req.error ?? new Error("get failed"));
  });
  await txDone(tx);
  db.close();
  return result ?? null;
}

export async function listRecent(limit = 12): Promise<HexFileRecord[]> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readonly");
  const store = tx.objectStore(STORE);
  const index = store.index("updatedAt");
  const req = index.openCursor(null, "prev");
  const out: HexFileRecord[] = [];
  await new Promise<void>((resolve, reject) => {
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor || out.length >= limit) {
        resolve();
        return;
      }
      out.push(cursor.value as HexFileRecord);
      cursor.continue();
    };
    req.onerror = () => reject(req.error ?? new Error("list failed"));
  });
  await txDone(tx);
  db.close();
  return out;
}

export async function deleteFile(id: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(id);
  await txDone(tx);
  db.close();
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
