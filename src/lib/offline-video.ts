"use client";

interface VideoCache {
  id: string;
  url: string;
  title: string;
  duration: number;
  size: number;
  downloadedAt: number;
  lastWatched?: number;
  progress?: number;
}

interface OfflineProgress {
  videoId: string;
  currentTime: number;
  duration: number;
  completed: boolean;
  lastUpdated: number;
}

class OfflineVideoManager {
  private dbName = 'MRFEducationVideos';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create video cache store
        if (!db.objectStoreNames.contains('videos')) {
          const videoStore = db.createObjectStore('videos', { keyPath: 'id' });
          videoStore.createIndex('downloadedAt', 'downloadedAt', { unique: false });
        }
        
        // Create progress store
        if (!db.objectStoreNames.contains('progress')) {
          const progressStore = db.createObjectStore('progress', { keyPath: 'videoId' });
          progressStore.createIndex('lastUpdated', 'lastUpdated', { unique: false });
        }
        
        // Create offline queue store
        if (!db.objectStoreNames.contains('offlineQueue')) {
          db.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async downloadVideo(videoId: string, url: string, title: string): Promise<void> {
    if (!this.db) await this.init();
    
    try {
      // Check if video is already cached
      const existingVideo = await this.getVideoFromCache(videoId);
      if (existingVideo) {
        console.log('Video already cached:', videoId);
        return;
      }

      // Fetch video blob
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch video');
      
      const blob = await response.blob();
      const videoCache: VideoCache = {
        id: videoId,
        url: URL.createObjectURL(blob),
        title,
        duration: 0, // Will be updated when video metadata loads
        size: blob.size,
        downloadedAt: Date.now()
      };

      // Store in IndexedDB
      const transaction = this.db!.transaction(['videos'], 'readwrite');
      const store = transaction.objectStore('videos');
      await new Promise((resolve, reject) => {
        const request = store.add(videoCache);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      console.log('Video cached successfully:', videoId);
    } catch (error) {
      console.error('Failed to cache video:', error);
      throw error;
    }
  }

  async getVideoFromCache(videoId: string): Promise<VideoCache | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['videos'], 'readonly');
      const store = transaction.objectStore('videos');
      const request = store.get(videoId);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCachedVideos(): Promise<VideoCache[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['videos'], 'readonly');
      const store = transaction.objectStore('videos');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removeVideoFromCache(videoId: string): Promise<void> {
    if (!this.db) await this.init();
    
    // Get video to revoke URL
    const video = await this.getVideoFromCache(videoId);
    if (video) {
      URL.revokeObjectURL(video.url);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['videos'], 'readwrite');
      const store = transaction.objectStore('videos');
      const request = store.delete(videoId);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveProgress(videoId: string, currentTime: number, duration: number): Promise<void> {
    if (!this.db) await this.init();
    
    const progress: OfflineProgress = {
      videoId,
      currentTime,
      duration,
      completed: currentTime >= duration * 0.9, // 90% completion
      lastUpdated: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['progress'], 'readwrite');
      const store = transaction.objectStore('progress');
      const request = store.put(progress);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProgress(videoId: string): Promise<OfflineProgress | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['progress'], 'readonly');
      const store = transaction.objectStore('progress');
      const request = store.get(videoId);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllProgress(): Promise<OfflineProgress[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['progress'], 'readonly');
      const store = transaction.objectStore('progress');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async syncProgressWhenOnline(): Promise<void> {
    if (!navigator.onLine) return;
    
    try {
      const allProgress = await this.getAllProgress();
      
      // In a real app, you would send this to your backend
      for (const progress of allProgress) {
        console.log('Syncing progress for video:', progress.videoId, progress);
        // await fetch('/api/sync-progress', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(progress)
        // });
      }
      
      console.log('Progress synced successfully');
    } catch (error) {
      console.error('Failed to sync progress:', error);
    }
  }

  async getCacheSize(): Promise<number> {
    const videos = await this.getAllCachedVideos();
    return videos.reduce((total, video) => total + video.size, 0);
  }

  async clearOldCache(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    const videos = await this.getAllCachedVideos();
    const now = Date.now();
    
    for (const video of videos) {
      if (now - video.downloadedAt > maxAgeMs) {
        await this.removeVideoFromCache(video.id);
        console.log('Removed old cached video:', video.title);
      }
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  async preloadLessons(lessonIds: string[]): Promise<void> {
    if (!this.isOnline()) {
      console.log('Cannot preload lessons while offline');
      return;
    }

    for (const lessonId of lessonIds) {
      try {
        // In a real app, you would get the video URL from your API
        const videoUrl = `/videos/lesson-${lessonId}.mp4`;
        const title = `درس ${lessonId}`;
        
        await this.downloadVideo(lessonId, videoUrl, title);
        console.log(`Preloaded lesson ${lessonId}`);
      } catch (error) {
        console.error(`Failed to preload lesson ${lessonId}:`, error);
      }
    }
  }
}

// Singleton instance
export const offlineVideoManager = new OfflineVideoManager();

// Initialize when the module loads
if (typeof window !== 'undefined') {
  offlineVideoManager.init().catch(console.error);
  
  // Sync progress when coming back online
  window.addEventListener('online', () => {
    offlineVideoManager.syncProgressWhenOnline();
  });
  
  // Clean up old cache periodically
  setInterval(() => {
    offlineVideoManager.clearOldCache();
  }, 24 * 60 * 60 * 1000); // Daily cleanup
}

export default OfflineVideoManager;
