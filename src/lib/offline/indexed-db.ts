"use client";

/**
 * IndexedDB Manager for MRF Educational Platform
 *
 * Handles offline storage for:
 * - Lesson/quiz progress
 * - Gamification state (XP, streaks, achievements)
 * - User preferences
 * - Offline queue for sync when back online
 */

const DB_NAME = "MRFEducation";
const DB_VERSION = 2;

// Store names
const STORES = {
  PROGRESS: "progress",
  GAMIFICATION: "gamification",
  QUIZ_RESULTS: "quizResults",
  OFFLINE_QUEUE: "offlineQueue",
  USER_PREFERENCES: "userPreferences",
} as const;

// Interfaces
export interface ProgressEntry {
  id: string;
  lessonId: string;
  userId?: string;
  currentPosition: number;
  duration: number;
  completed: boolean;
  lastUpdated: number;
  synced: boolean;
}

export interface GamificationState {
  userId: string;
  xp: number;
  level: number;
  streak: number;
  energy: number;
  lastEnergyUpdate: number;
  achievements: string[];
  lastUpdated: number;
  synced: boolean;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId?: string;
  score: number;
  answers: Record<string, string>;
  timeSpent: number;
  completedAt: number;
  synced: boolean;
}

export interface OfflineAction {
  id?: number;
  type: "progress" | "xp" | "quiz" | "achievement";
  payload: unknown;
  createdAt: number;
  retries: number;
}

class IndexedDBManager {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === "undefined") {
        reject(new Error("IndexedDB not supported"));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Progress store
        if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
          const store = db.createObjectStore(STORES.PROGRESS, {
            keyPath: "id",
          });
          store.createIndex("lessonId", "lessonId", { unique: false });
          store.createIndex("synced", "synced", { unique: false });
          store.createIndex("lastUpdated", "lastUpdated", { unique: false });
        }

        // Gamification store
        if (!db.objectStoreNames.contains(STORES.GAMIFICATION)) {
          const store = db.createObjectStore(STORES.GAMIFICATION, {
            keyPath: "userId",
          });
          store.createIndex("synced", "synced", { unique: false });
        }

        // Quiz results store
        if (!db.objectStoreNames.contains(STORES.QUIZ_RESULTS)) {
          const store = db.createObjectStore(STORES.QUIZ_RESULTS, {
            keyPath: "id",
          });
          store.createIndex("quizId", "quizId", { unique: false });
          store.createIndex("synced", "synced", { unique: false });
          store.createIndex("completedAt", "completedAt", { unique: false });
        }

        // Offline queue store
        if (!db.objectStoreNames.contains(STORES.OFFLINE_QUEUE)) {
          const store = db.createObjectStore(STORES.OFFLINE_QUEUE, {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("type", "type", { unique: false });
          store.createIndex("createdAt", "createdAt", { unique: false });
        }

        // User preferences store
        if (!db.objectStoreNames.contains(STORES.USER_PREFERENCES)) {
          db.createObjectStore(STORES.USER_PREFERENCES, { keyPath: "key" });
        }
      };
    });

    return this.initPromise;
  }

  private async ensureDB(): Promise<IDBDatabase> {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");
    return this.db;
  }

  // Progress operations
  async saveProgress(entry: ProgressEntry): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.PROGRESS], "readwrite");
      const store = tx.objectStore(STORES.PROGRESS);
      const request = store.put({
        ...entry,
        synced: false,
        lastUpdated: Date.now(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProgress(lessonId: string): Promise<ProgressEntry | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.PROGRESS], "readonly");
      const store = tx.objectStore(STORES.PROGRESS);
      const index = store.index("lessonId");
      const request = index.get(lessonId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getUnsyncedProgress(): Promise<ProgressEntry[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.PROGRESS], "readonly");
      const store = tx.objectStore(STORES.PROGRESS);
      const index = store.index("synced");
      const request = index.getAll(IDBKeyRange.only(false));
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async markProgressSynced(id: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.PROGRESS], "readwrite");
      const store = tx.objectStore(STORES.PROGRESS);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        if (getReq.result) {
          const updated = { ...getReq.result, synced: true };
          store.put(updated);
        }
        resolve();
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  // Quiz results operations
  async saveQuizResult(result: QuizResult): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.QUIZ_RESULTS], "readwrite");
      const store = tx.objectStore(STORES.QUIZ_RESULTS);
      const request = store.put({ ...result, synced: false });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUnsyncedQuizResults(): Promise<QuizResult[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.QUIZ_RESULTS], "readonly");
      const store = tx.objectStore(STORES.QUIZ_RESULTS);
      const index = store.index("synced");
      const request = index.getAll(IDBKeyRange.only(false));
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async markQuizResultSynced(id: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.QUIZ_RESULTS], "readwrite");
      const store = tx.objectStore(STORES.QUIZ_RESULTS);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        if (getReq.result) {
          store.put({ ...getReq.result, synced: true });
        }
        resolve();
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }

  // Offline queue operations
  async addToOfflineQueue(action: Omit<OfflineAction, "id">): Promise<number> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.OFFLINE_QUEUE], "readwrite");
      const store = tx.objectStore(STORES.OFFLINE_QUEUE);
      const request = store.add({ ...action, retries: 0 });
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getOfflineQueue(): Promise<OfflineAction[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.OFFLINE_QUEUE], "readonly");
      const store = tx.objectStore(STORES.OFFLINE_QUEUE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async removeFromOfflineQueue(id: number): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.OFFLINE_QUEUE], "readwrite");
      const store = tx.objectStore(STORES.OFFLINE_QUEUE);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearOfflineQueue(): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.OFFLINE_QUEUE], "readwrite");
      const store = tx.objectStore(STORES.OFFLINE_QUEUE);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Gamification state
  async saveGamificationState(state: GamificationState): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.GAMIFICATION], "readwrite");
      const store = tx.objectStore(STORES.GAMIFICATION);
      const request = store.put({ ...state, lastUpdated: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getGamificationState(
    userId: string,
  ): Promise<GamificationState | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.GAMIFICATION], "readonly");
      const store = tx.objectStore(STORES.GAMIFICATION);
      const request = store.get(userId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // User preferences
  async setPreference(key: string, value: unknown): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.USER_PREFERENCES], "readwrite");
      const store = tx.objectStore(STORES.USER_PREFERENCES);
      const request = store.put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPreference<T>(key: string): Promise<T | null> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORES.USER_PREFERENCES], "readonly");
      const store = tx.objectStore(STORES.USER_PREFERENCES);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBManager = new IndexedDBManager();
