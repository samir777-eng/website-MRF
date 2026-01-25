/**
 * Offline Module - IndexedDB storage and sync services
 * 
 * Usage:
 * 
 * ```tsx
 * import { indexedDBManager, offlineSyncService } from '@/lib/offline';
 * 
 * // Initialize sync service (call once in app layout)
 * offlineSyncService.init();
 * 
 * // Save progress offline
 * await indexedDBManager.saveProgress({
 *   id: 'progress-123',
 *   lessonId: 'lesson-1',
 *   currentPosition: 120,
 *   duration: 600,
 *   completed: false,
 *   lastUpdated: Date.now(),
 *   synced: false,
 * });
 * 
 * // Queue an action for later sync
 * await offlineSyncService.queueAction('xp', {
 *   action: 'LESSON_COMPLETED',
 *   lessonId: 'lesson-1',
 * });
 * 
 * // Check sync status
 * const status = await offlineSyncService.getSyncStatus();
 * console.log(status.pendingProgress, status.isOnline);
 * ```
 */

export { indexedDBManager } from './indexed-db';
export type { 
  ProgressEntry, 
  GamificationState, 
  QuizResult, 
  OfflineAction 
} from './indexed-db';

export { offlineSyncService } from './sync-service';

