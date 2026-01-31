// Lesson System Types for MRF Educational Platform
// CRITICAL: Grade Isolation - Lessons are grade-specific (inherited from lecture)

import type { GradeLevel } from "./lecture";

export type LessonType = "video" | "reading" | "interactive" | "practice";

export type LessonStatus = "locked" | "available" | "in-progress" | "completed";

export type VideoQuality = "360p" | "480p" | "720p" | "1080p" | "auto";

export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export interface Lesson {
  id: string;
  lectureId: string;

  // Basic Info
  title: string;
  description: string;
  order: number; // 1, 2, 3, etc.
  type: LessonType;

  // Content
  videoUrl?: string;
  videoDuration?: number; // in seconds
  thumbnailUrl?: string;

  // Materials
  notes?: string; // Markdown content
  pdfUrl?: string;
  attachments?: LessonAttachment[];

  // Progress Requirements
  isRequired: boolean;
  unlockAfter?: string; // Lesson ID that must be completed first
  minimumWatchPercentage?: number; // e.g., 80% to mark as complete

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Teacher ID
  isPublished: boolean;

  // Estimated time
  estimatedDuration: number; // in minutes
}

export interface LessonAttachment {
  id: string;
  name: string;
  url: string;
  type: "pdf" | "doc" | "docx" | "ppt" | "pptx" | "image" | "other";
  size: number; // in bytes
  uploadedAt: Date;
}

export interface LessonProgress {
  id: string;
  studentId: string;
  lessonId: string;
  lectureId: string;

  // Status
  status: LessonStatus;

  // Video Progress
  lastWatchedPosition: number; // in seconds
  totalWatchedDuration: number; // total seconds watched (can be > video duration if rewatched)
  watchedPercentage: number; // 0-100

  // Completion
  isCompleted: boolean;
  completedAt?: Date;

  // Tracking
  startedAt: Date;
  lastAccessedAt: Date;
  accessCount: number; // number of times accessed

  // Notes
  studentNotes?: string;
  bookmarks?: LessonBookmark[];
}

export interface LessonBookmark {
  id: string;
  timestamp: number; // in seconds
  note?: string;
  createdAt: Date;
}

// Video Player State
export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackSpeed: PlaybackSpeed;
  quality: VideoQuality;
  isFullscreen: boolean;
  buffered: number; // percentage buffered
}

// Video Player Controls
export interface VideoPlayerControls {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  setQuality: (quality: VideoQuality) => void;
  toggleFullscreen: () => void;
  skipForward: (seconds: number) => void;
  skipBackward: (seconds: number) => void;
}

// Lesson Navigation
export interface LessonNavigation {
  currentLesson: Lesson;
  previousLesson?: Lesson;
  nextLesson?: Lesson;
  canGoToPrevious: boolean;
  canGoToNext: boolean;
  totalLessons: number;
  currentIndex: number;
}

// API Response Types
export interface LessonDetailResponse {
  lesson: Lesson;
  lecture: {
    id: string;
    title: string;
    weekNumber: number;
    gradeLevel: GradeLevel;
  };
  progress?: LessonProgress;
  navigation: LessonNavigation;
  canAccess: boolean;
  accessMessage?: string;
  unlockRequirements?: {
    requiresPreviousLesson: boolean;
    previousLessonCompleted: boolean;
    previousLessonTitle?: string;
  };
}

export interface LessonProgressUpdateRequest {
  lessonId: string;
  currentTime: number;
  watchedDuration: number;
  isCompleted: boolean;
}

export interface LessonProgressUpdateResponse {
  progress: LessonProgress;
  unlocked?: string[]; // IDs of lessons/content unlocked
  achievements?: string[]; // Achievement IDs earned
}

// Lesson Statistics (for teachers)
export interface LessonStatistics {
  lessonId: string;
  lesson: Lesson;

  // Engagement
  totalStudents: number;
  studentsStarted: number;
  studentsCompleted: number;
  completionRate: number; // percentage

  // Watch Time
  averageWatchTime: number; // seconds
  averageWatchPercentage: number;
  totalWatchTime: number; // total seconds across all students

  // Engagement Points
  averageRewatchCount: number;
  dropOffPoints: DropOffPoint[]; // where students stop watching

  // Access
  averageAccessCount: number;
  peakAccessTime?: Date;
}

export interface DropOffPoint {
  timestamp: number; // in seconds
  dropOffCount: number; // number of students who stopped here
  percentage: number; // percentage of total students
}

// Lesson Filters
export interface LessonFilters {
  lectureId?: string;
  type?: LessonType;
  status?: LessonStatus;
  search?: string;
}

// Lesson Notes (student's personal notes)
export interface LessonNote {
  id: string;
  lessonId: string;
  studentId: string;
  content: string; // Markdown
  timestamp?: number; // Video timestamp if note is time-specific
  createdAt: Date;
  updatedAt: Date;
}

// Lesson Completion Certificate
export interface LessonCompletionData {
  lessonId: string;
  lessonTitle: string;
  lectureTitle: string;
  completedAt: Date;
  watchedPercentage: number;
  totalWatchTime: number; // seconds
  accessCount: number;
}
