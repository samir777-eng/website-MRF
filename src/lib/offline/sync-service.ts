"use client";

/**
 * Offline Sync Service
 *
 * Automatically syncs offline data when network is restored.
 * Uses Background Sync API when available, falls back to online/offline events.
 */

import { indexedDBManager } from "./indexed-db";

const SYNC_ENDPOINTS = {
  PROGRESS: "/api/sync/progress",
  QUIZ_RESULTS: "/api/sync/quiz-results",
  GAMIFICATION: "/api/gamification/stats",
} as const;

const MAX_RETRIES = 3;

class OfflineSyncService {
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;

  init(): void {
    if (typeof window === "undefined") return;

    // Listen for online/offline events
    window.addEventListener("online", () => this.onOnline());
    window.addEventListener("offline", () => this.onOffline());

    // Register background sync if available
    this.registerBackgroundSync();

    // Initial sync if online
    if (navigator.onLine) {
      this.syncAll();
    }

    // Periodic sync check every 5 minutes when online
    this.syncInterval = setInterval(
      () => {
        if (navigator.onLine && !this.isSyncing) {
          this.syncAll();
        }
      },
      5 * 60 * 1000
    );
  }

  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private async registerBackgroundSync(): Promise<void> {
    if (
      !("serviceWorker" in navigator) ||
      !("sync" in ServiceWorkerRegistration.prototype)
    ) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      // Register sync tags
      await (
        registration as ServiceWorkerRegistration & {
          sync: { register: (tag: string) => Promise<void> };
        }
      ).sync?.register("sync-progress");
      await (
        registration as ServiceWorkerRegistration & {
          sync: { register: (tag: string) => Promise<void> };
        }
      ).sync?.register("sync-quiz-results");
    } catch (error) {
      console.warn("Background sync registration failed:", error);
    }
  }

  private onOnline(): void {
    console.log("🌐 Network restored, syncing offline data...");
    this.syncAll();
  }

  private onOffline(): void {
    console.log("📴 Network lost, entering offline mode");
  }

  async syncAll(): Promise<{ success: boolean; errors: string[] }> {
    if (this.isSyncing) {
      return { success: false, errors: ["Sync already in progress"] };
    }

    this.isSyncing = true;
    const errors: string[] = [];

    try {
      // Sync progress data
      const progressResult = await this.syncProgress();
      if (!progressResult.success) {
        errors.push(`Progress sync: ${progressResult.error}`);
      }

      // Sync quiz results
      const quizResult = await this.syncQuizResults();
      if (!quizResult.success) {
        errors.push(`Quiz sync: ${quizResult.error}`);
      }

      // Process offline queue
      const queueResult = await this.processOfflineQueue();
      if (!queueResult.success) {
        errors.push(`Queue sync: ${queueResult.error}`);
      }

      console.log("✅ Sync complete", errors.length ? { errors } : "");
      return { success: errors.length === 0, errors };
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncProgress(): Promise<{ success: boolean; error?: string }> {
    try {
      const unsyncedProgress = await indexedDBManager.getUnsyncedProgress();

      if (unsyncedProgress.length === 0) {
        return { success: true };
      }

      const response = await fetch(SYNC_ENDPOINTS.PROGRESS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ progress: unsyncedProgress }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Mark all as synced
      for (const entry of unsyncedProgress) {
        await indexedDBManager.markProgressSynced(entry.id);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async syncQuizResults(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const unsyncedResults = await indexedDBManager.getUnsyncedQuizResults();

      if (unsyncedResults.length === 0) {
        return { success: true };
      }

      const response = await fetch(SYNC_ENDPOINTS.QUIZ_RESULTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ results: unsyncedResults }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Mark all as synced
      for (const result of unsyncedResults) {
        await indexedDBManager.markQuizResultSynced(result.id);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async processOfflineQueue(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const queue = await indexedDBManager.getOfflineQueue();

      if (queue.length === 0) {
        return { success: true };
      }

      const failed: number[] = [];

      for (const action of queue) {
        try {
          await this.processAction(action);
          if (action.id) {
            await indexedDBManager.removeFromOfflineQueue(action.id);
          }
        } catch {
          failed.push(action.id || 0);
        }
      }

      if (failed.length > 0) {
        return { success: false, error: `${failed.length} actions failed` };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async processAction(action: {
    type: string;
    payload: unknown;
  }): Promise<void> {
    const endpoints: Record<string, string> = {
      progress: SYNC_ENDPOINTS.PROGRESS,
      quiz: SYNC_ENDPOINTS.QUIZ_RESULTS,
      xp: "/api/gamification/award-xp",
      achievement: "/api/gamification/stats",
    };

    const endpoint = endpoints[action.type];
    if (!endpoint) {
      throw new Error(`Unknown action type: ${action.type}`);
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(action.payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  }

  // Public method to queue offline actions
  async queueAction(
    type: "progress" | "xp" | "quiz" | "achievement",
    payload: unknown
  ): Promise<void> {
    await indexedDBManager.addToOfflineQueue({
      type,
      payload,
      createdAt: Date.now(),
      retries: 0,
    });

    // Try immediate sync if online
    if (navigator.onLine) {
      this.syncAll();
    }
  }

  // Check if there's pending offline data
  async hasPendingSync(): Promise<boolean> {
    const [progress, quiz, queue] = await Promise.all([
      indexedDBManager.getUnsyncedProgress(),
      indexedDBManager.getUnsyncedQuizResults(),
      indexedDBManager.getOfflineQueue(),
    ]);
    return progress.length > 0 || quiz.length > 0 || queue.length > 0;
  }

  // Get sync status for UI
  async getSyncStatus(): Promise<{
    pendingProgress: number;
    pendingQuiz: number;
    pendingActions: number;
    isOnline: boolean;
    isSyncing: boolean;
  }> {
    const [progress, quiz, queue] = await Promise.all([
      indexedDBManager.getUnsyncedProgress(),
      indexedDBManager.getUnsyncedQuizResults(),
      indexedDBManager.getOfflineQueue(),
    ]);

    return {
      pendingProgress: progress.length,
      pendingQuiz: quiz.length,
      pendingActions: queue.length,
      isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
      isSyncing: this.isSyncing,
    };
  }
}

export const offlineSyncService = new OfflineSyncService();
