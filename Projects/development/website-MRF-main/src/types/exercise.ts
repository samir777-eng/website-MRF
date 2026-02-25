// Exercise System Types for MRF Educational Platform
// CRITICAL: Grade Isolation - Exercises are grade-specific (inherited from lecture)

import type { GradeLevel } from './lecture';

export type ExerciseType = 'post-lecture' | 'practice' | 'review';

export type ExerciseStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export type ExerciseQuestionType = 
  | 'multiple-choice' 
  | 'true-false' 
  | 'short-answer' 
  | 'essay' 
  | 'fill-blank'
  | 'matching'
  | 'ordering';

export interface Exercise {
  id: string;
  lectureId: string;
  
  // Basic Info
  title: string;
  description: string;
  type: ExerciseType;
  gradeLevel: GradeLevel; // CRITICAL: Grade-specific
  
  // Requirements
  requiresAllLessonsComplete: boolean;
  unlockAfter?: string; // Lesson ID or Exercise ID
  
  // Configuration
  timeLimit?: number; // in minutes (optional)
  passingScore: number; // percentage (e.g., 70)
  maxAttempts?: number; // unlimited if not set
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean; // after submission
  allowReview: boolean; // can review after completion
  
  // Questions
  questions: ExerciseQuestion[];
  totalPoints: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Teacher ID
  isPublished: boolean;
  
  // Estimated time
  estimatedDuration: number; // in minutes
}

export interface ExerciseQuestion {
  id: string;
  exerciseId: string;
  
  // Question content
  type: ExerciseQuestionType;
  question: string;
  order: number;
  points: number;
  
  // Multiple choice / True-False
  options?: string[];
  correctAnswer?: string | number | string[]; // Can be index, text, or multiple
  
  // Fill in the blank
  blanks?: ExerciseBlank[];
  
  // Matching
  matchPairs?: ExerciseMatchPair[];
  
  // Ordering
  orderItems?: string[];
  correctOrder?: number[];
  
  // Essay / Short answer
  sampleAnswer?: string;
  keywords?: string[]; // For auto-grading hints
  
  // Feedback
  explanation?: string; // Shown after submission
  hint?: string; // Optional hint for students
  
  // Media
  imageUrl?: string;
  audioUrl?: string;
}

export interface ExerciseBlank {
  id: string;
  position: number; // Position in text
  correctAnswer: string;
  acceptableAnswers?: string[]; // Alternative correct answers
  caseSensitive: boolean;
}

export interface ExerciseMatchPair {
  id: string;
  left: string;
  right: string;
}

export interface ExerciseAttempt {
  id: string;
  exerciseId: string;
  studentId: string;
  
  // Status
  status: 'not-started' | 'in-progress' | 'completed' | 'expired';
  attemptNumber: number;
  
  // Timing
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in seconds
  
  // Answers
  answers: ExerciseAnswer[];
  
  // Scoring
  score?: number; // percentage
  pointsEarned?: number;
  totalPoints: number;
  passed?: boolean;
  
  // Review
  reviewed: boolean;
  reviewedAt?: Date;
}

export interface ExerciseAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  
  // Answer content
  answer: string | number | string[] | ExerciseMatchAnswer[] | number[];
  
  // Grading
  isCorrect?: boolean;
  pointsEarned: number;
  maxPoints: number;
  
  // Feedback
  feedback?: string;
  
  // Timing
  answeredAt: Date;
  timeSpent: number; // seconds spent on this question
}

export interface ExerciseMatchAnswer {
  leftId: string;
  rightId: string;
}

export interface ExerciseResult {
  attempt: ExerciseAttempt;
  exercise: Exercise;
  
  // Overall results
  score: number; // percentage
  pointsEarned: number;
  totalPoints: number;
  passed: boolean;
  
  // Question breakdown
  questionResults: ExerciseQuestionResult[];
  
  // Stats
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  
  // Time
  totalTimeSpent: number; // seconds
  averageTimePerQuestion: number; // seconds
  
  // Next steps
  canRetry: boolean;
  attemptsRemaining?: number;
  unlockedContent?: string[]; // IDs of homework/content unlocked
}

export interface ExerciseQuestionResult {
  question: ExerciseQuestion;
  answer: ExerciseAnswer;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  feedback?: string;
  explanation?: string;
}

// Student's exercise history
export interface StudentExerciseHistory {
  exerciseId: string;
  exercise: Exercise;
  attempts: ExerciseAttempt[];
  
  // Best performance
  bestScore?: number;
  bestAttempt?: ExerciseAttempt;
  
  // Stats
  totalAttempts: number;
  averageScore: number;
  passed: boolean;
  
  // Progress
  firstAttemptAt: Date;
  lastAttemptAt: Date;
  completedAt?: Date;
}

// Exercise Statistics (for teachers)
export interface ExerciseStatistics {
  exerciseId: string;
  exercise: Exercise;
  
  // Engagement
  totalStudents: number;
  studentsStarted: number;
  studentsCompleted: number;
  completionRate: number; // percentage
  
  // Performance
  averageScore: number;
  passRate: number; // percentage
  averageAttempts: number;
  
  // Time
  averageTimeSpent: number; // seconds
  
  // Question analysis
  questionStatistics: ExerciseQuestionStatistics[];
  
  // Difficulty
  difficultyRating: 'easy' | 'medium' | 'hard'; // Based on pass rate
}

export interface ExerciseQuestionStatistics {
  questionId: string;
  question: ExerciseQuestion;
  
  // Performance
  totalAttempts: number;
  correctCount: number;
  incorrectCount: number;
  correctPercentage: number;
  
  // Time
  averageTimeSpent: number; // seconds
  
  // Common mistakes
  commonWrongAnswers?: { answer: string; count: number }[];
  
  // Difficulty
  difficultyRating: 'easy' | 'medium' | 'hard';
}

// API Request/Response Types
export interface ExerciseDetailResponse {
  exercise: Exercise;
  lecture: {
    id: string;
    title: string;
    weekNumber: number;
    gradeLevel: GradeLevel;
  };
  canAccess: boolean;
  accessMessage?: string;
  unlockRequirements?: {
    requiresAllLessons: boolean;
    allLessonsCompleted: boolean;
    incompleteLessons?: string[]; // Lesson IDs
  };
  previousAttempts?: ExerciseAttempt[];
  attemptsRemaining?: number;
}

export interface ExerciseStartRequest {
  exerciseId: string;
}

export interface ExerciseStartResponse {
  attempt: ExerciseAttempt;
  exercise: Exercise;
  timeLimit?: number; // seconds
}

export interface ExerciseSubmitRequest {
  attemptId: string;
  answers: {
    questionId: string;
    answer: string | number | string[] | ExerciseMatchAnswer[] | number[];
  }[];
}

export interface ExerciseSubmitResponse {
  result: ExerciseResult;
  unlocked?: {
    homework?: string; // Homework ID
    nextContent?: string; // Next content ID
  };
  achievements?: string[]; // Achievement IDs earned
}

// Exercise Filters
export interface ExerciseFilters {
  lectureId?: string;
  type?: ExerciseType;
  status?: ExerciseStatus;
  gradeLevel?: GradeLevel;
  search?: string;
}

