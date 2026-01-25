"use client";

import { useState, useEffect, useCallback } from 'react';
import { offlineVideoManager } from '@/lib/offline-video';

interface UseOfflineVideoReturn {
  isVideoAvailable: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  videoUrl: string | null;
  downloadVideo: () => Promise<void>;
  removeVideo: () => Promise<void>;
  isOnline: boolean;
  cacheSize: number;
  error: string | null;
}

export function useOfflineVideo(
  videoId: string,
  originalUrl: string,
  title: string
): UseOfflineVideoReturn {
  const [isVideoAvailable, setIsVideoAvailable] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [cacheSize, setCacheSize] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Check if video is available in cache
  const checkVideoAvailability = useCallback(async () => {
    try {
      const cachedVideo = await offlineVideoManager.getVideoFromCache(videoId);
      if (cachedVideo) {
        setIsVideoAvailable(true);
        setVideoUrl(cachedVideo.url);
      } else {
        setIsVideoAvailable(false);
        setVideoUrl(originalUrl);
      }
    } catch (err) {
      console.error('Error checking video availability:', err);
      setError('فشل في التحقق من توفر الفيديو');
    }
  }, [videoId, originalUrl]);

  // Download video for offline viewing
  const downloadVideo = useCallback(async () => {
    if (!offlineVideoManager.isOnline()) {
      setError('يجب الاتصال بالإنترنت لتحميل الفيديو');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setError(null);

    try {
      // Simulate download progress (in real app, you'd track actual progress)
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await offlineVideoManager.downloadVideo(videoId, originalUrl, title);
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      
      // Update video availability
      await checkVideoAvailability();
      
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);
      
    } catch (err) {
      console.error('Error downloading video:', err);
      setError('فشل في تحميل الفيديو');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  }, [videoId, originalUrl, title, checkVideoAvailability]);

  // Remove video from cache
  const removeVideo = useCallback(async () => {
    try {
      await offlineVideoManager.removeVideoFromCache(videoId);
      setIsVideoAvailable(false);
      setVideoUrl(originalUrl);
      await updateCacheSize();
    } catch (err) {
      console.error('Error removing video:', err);
      setError('فشل في حذف الفيديو');
    }
  }, [videoId, originalUrl]);

  // Update cache size
  const updateCacheSize = useCallback(async () => {
    try {
      const size = await offlineVideoManager.getCacheSize();
      setCacheSize(size);
    } catch (err) {
      console.error('Error getting cache size:', err);
    }
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize
  useEffect(() => {
    checkVideoAvailability();
    updateCacheSize();
  }, [checkVideoAvailability, updateCacheSize]);

  return {
    isVideoAvailable,
    isDownloading,
    downloadProgress,
    videoUrl,
    downloadVideo,
    removeVideo,
    isOnline,
    cacheSize,
    error
  };
}

// Hook for managing video progress
export function useVideoProgress(videoId: string) {
  const [progress, setProgress] = useState<{ currentTime: number; duration: number } | null>(null);

  const saveProgress = useCallback(async (currentTime: number, duration: number) => {
    try {
      await offlineVideoManager.saveProgress(videoId, currentTime, duration);
      setProgress({ currentTime, duration });
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  }, [videoId]);

  const loadProgress = useCallback(async () => {
    try {
      const savedProgress = await offlineVideoManager.getProgress(videoId);
      if (savedProgress) {
        setProgress({
          currentTime: savedProgress.currentTime,
          duration: savedProgress.duration
        });
      }
    } catch (err) {
      console.error('Error loading progress:', err);
    }
  }, [videoId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progress,
    saveProgress,
    loadProgress
  };
}

// Hook for managing offline lesson preloading
export function useOfflineLessons() {
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [cachedLessons, setCachedLessons] = useState<string[]>([]);

  const preloadLessons = useCallback(async (lessonIds: string[]) => {
    if (!offlineVideoManager.isOnline()) {
      console.log('Cannot preload lessons while offline');
      return;
    }

    setIsPreloading(true);
    setPreloadProgress(0);

    try {
      for (let i = 0; i < lessonIds.length; i++) {
        const lessonId = lessonIds[i];
        await offlineVideoManager.downloadVideo(
          lessonId,
          `/videos/lesson-${lessonId}.mp4`,
          `درس ${lessonId}`
        );
        
        setPreloadProgress(((i + 1) / lessonIds.length) * 100);
      }

      // Update cached lessons list
      const allCached = await offlineVideoManager.getAllCachedVideos();
      setCachedLessons(allCached.map(video => video.id));
      
    } catch (err) {
      console.error('Error preloading lessons:', err);
    } finally {
      setIsPreloading(false);
    }
  }, []);

  const updateCachedLessons = useCallback(async () => {
    try {
      const allCached = await offlineVideoManager.getAllCachedVideos();
      setCachedLessons(allCached.map(video => video.id));
    } catch (err) {
      console.error('Error updating cached lessons:', err);
    }
  }, []);

  useEffect(() => {
    updateCachedLessons();
  }, [updateCachedLessons]);

  return {
    isPreloading,
    preloadProgress,
    cachedLessons,
    preloadLessons,
    updateCachedLessons
  };
}
