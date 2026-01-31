// Lecture System Types for MRF Educational Platform
// CRITICAL: Grade Isolation - Students can ONLY see content for their enrolled grade

export type GradeLevel = "1" | "2" | "3"; // First, Second, Third Secondary

export type LectureStatus = "upcoming" | "current" | "past" | "locked";

export type LessonType = "video" | "reading" | "interactive";

// User Profile with Grade
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  gradeLevel: GradeLevel; // IMMUTABLE after registration (or requires admin approval)
  subscriptionStatus: "active" | "expired" | "trial" | "none";
  subscriptionExpiresAt?: Date;
  registeredAt: Date;
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  weekNumber: number; // Week 1, 2, 3, etc.
  gradeLevel: GradeLevel;

  // Scheduling
  scheduledDate: Date;
  startTime: string; // e.g., "18:00"
  duration: number; // in minutes

  // Status
  status: LectureStatus;
  isPublished: boolean;

  // Content
  thumbnailUrl?: string;
  introVideoUrl?: string;

  // Requirements
  requiresPreviousQuiz: boolean;
  previousLectureId?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Teacher ID

  // Stats
  totalLessons: number;
  estimatedDuration: number; // Total duration in minutes
  enrolledStudents: number;
}

export interface Lesson {
  id: string;
  lectureId: string;

  // Basic Info
  title: string;
  description: string;
  order: number; // Lesson 1, 2, 3, etc.
  type: LessonType;

  // Content
  videoUrl?: string;
  videoDuration?: number; // in seconds
  thumbnailUrl?: string;

  // Materials
  notes?: string; // Markdown content
  pdfUrl?: string;
  attachments?: LessonAttachment[];

  // Progress
  isRequired: boolean;
  unlockAfter?: string; // Lesson ID that must be completed first

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonAttachment {
  id: string;
  name: string;
  url: string;
  type: "pdf" | "doc" | "image" | "other";
  size: number; // in bytes
}

export interface LectureEnrollment {
  id: string;
  studentId: string;
  lectureId: string;

  // Status
  enrolledAt: Date;
  startedAt?: Date;
  completedAt?: Date;

  // Progress
  completedLessons: string[]; // Array of lesson IDs
  currentLessonId?: string;
  progressPercentage: number;

  // Requirements
  preQuizCompleted: boolean;
  preQuizScore?: number;
  exerciseCompleted: boolean;
  exerciseScore?: number;
  homeworkSubmitted: boolean;
  homeworkGrade?: number;

  // Access
  hasAccess: boolean; // Based on subscription status
  accessExpiresAt?: Date;
}

export interface LessonProgress {
  id: string;
  studentId: string;
  lessonId: string;
  lectureId: string;

  // Progress
  startedAt: Date;
  completedAt?: Date;
  lastWatchedPosition?: number; // Video position in seconds
  watchedDuration: number; // Total watched time in seconds

  // Status
  isCompleted: boolean;
  completionPercentage: number;

  // Metadata
  updatedAt: Date;
}

export interface WeekSchedule {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  lectures: Lecture[];
  isCurrentWeek: boolean;
}

// API Response Types
export interface LectureListResponse {
  lectures: Lecture[];
  currentWeek: number;
  totalWeeks: number;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface LectureDetailResponse {
  lecture: Lecture;
  lessons: Lesson[];
  enrollment?: LectureEnrollment;
  canAccess: boolean;
  accessMessage?: string;
  nextLesson?: Lesson;
  previousLecture?: Lecture;
  nextLecture?: Lecture;
}

export interface LessonDetailResponse {
  lesson: Lesson;
  lecture: Lecture;
  progress?: LessonProgress;
  canAccess: boolean;
  accessMessage?: string;
  nextLesson?: Lesson;
  previousLesson?: Lesson;
}

// Filter and Sort Types
// NOTE: gradeLevel filter is for admin/teacher use only
// Students automatically get content filtered by their enrolled grade
export interface LectureFilters {
  gradeLevel?: GradeLevel; // Admin/Teacher only - students see their grade only
  status?: LectureStatus;
  weekNumber?: number;
  search?: string;
}

export type LectureSortBy =
  | "weekNumber"
  | "scheduledDate"
  | "title"
  | "enrolledStudents";
export type SortOrder = "asc" | "desc";

export interface LectureSortOptions {
  sortBy: LectureSortBy;
  order: SortOrder;
}

// API Request Context - includes user's grade for filtering
export interface RequestContext {
  userId: string;
  userGrade: GradeLevel; // Used to filter all content
  isAdmin: boolean;
  isTeacher: boolean;
}
