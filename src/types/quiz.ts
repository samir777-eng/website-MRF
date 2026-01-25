// Quiz System Types for MRF Educational Platform
// CRITICAL: Grade Isolation - Quizzes are grade-specific

import type { GradeLevel } from "./lecture";

export type QuizType =
  | "pre-lecture"
  | "post-lecture"
  | "practice"
  | "challenge";

export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "short-answer"
  | "essay";

export type QuizStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "expired";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  points: number;
  order: number;

  // Multiple choice / True-False
  options?: string[];
  correctAnswer?: string | number; // Index or value

  // Short answer / Essay
  maxLength?: number;
  minLength?: number;

  // Explanation shown after answer
  explanation?: string;

  // Media
  imageUrl?: string;
  audioUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  type: QuizType;

  // Association
  lectureId: string;
  gradeLevel: GradeLevel; // CRITICAL: Grade-specific

  // Configuration
  timeLimit?: number; // in minutes, null = no limit
  passingScore: number; // percentage (e.g., 70)
  maxAttempts?: number; // null = unlimited
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean; // After completion

  // Questions
  questions: QuizQuestion[];
  totalPoints: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Teacher ID
  isPublished: boolean;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | number | string[]; // Depends on question type
  timeSpent: number; // seconds spent on this question
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;

  // Status
  status: QuizStatus;
  attemptNumber: number;

  // Timing
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // total seconds

  // Answers
  answers: QuizAnswer[];

  // Results
  score?: number; // percentage
  pointsEarned?: number;
  totalPoints: number;
  correctAnswers?: number;
  totalQuestions: number;
  passed?: boolean;

  // Metadata
  ipAddress?: string;
  userAgent?: string;
}

export interface QuizResult {
  attempt: QuizAttempt;
  quiz: Quiz;

  // Detailed results per question
  questionResults: QuestionResult[];

  // Statistics
  averageTimePerQuestion: number;
  fastestQuestion: string; // question ID
  slowestQuestion: string; // question ID

  // Comparison
  classAverage?: number;
  percentile?: number; // Student's percentile in class
}

export interface QuestionResult {
  question: QuizQuestion;
  studentAnswer: string | number | string[];
  correctAnswer: string | number;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;
}

// Student's quiz history
export interface StudentQuizHistory {
  quizId: string;
  quiz: Quiz;
  attempts: QuizAttempt[];
  bestScore: number;
  averageScore: number;
  totalAttempts: number;
  passed: boolean;
  lastAttemptDate: Date;
}

// Quiz statistics for teachers
export interface QuizStatistics {
  quizId: string;
  quiz: Quiz;

  // Participation
  totalStudents: number;
  studentsAttempted: number;
  studentsCompleted: number;
  studentsPassed: number;

  // Performance
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  medianScore: number;

  // Timing
  averageTimeSpent: number;
  fastestCompletion: number;
  slowestCompletion: number;

  // Question analysis
  questionStatistics: QuestionStatistics[];

  // Attempts
  totalAttempts: number;
  averageAttempts: number;
}

export interface QuestionStatistics {
  questionId: string;
  question: string;

  // Performance
  correctCount: number;
  incorrectCount: number;
  correctPercentage: number;

  // Timing
  averageTimeSpent: number;

  // Common wrong answers (for multiple choice)
  commonWrongAnswers?: { answer: string; count: number }[];
}

// API Response Types
export interface QuizListResponse {
  quizzes: Quiz[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface QuizDetailResponse {
  quiz: Quiz;
  studentHistory?: StudentQuizHistory;
  canAttempt: boolean;
  attemptsRemaining?: number;
  nextAttemptAvailableAt?: Date;
  requirementsMet: boolean;
  requirementsMessage?: string;
}

export interface QuizAttemptResponse {
  attempt: QuizAttempt;
  timeRemaining?: number; // seconds
  currentQuestion: number;
  totalQuestions: number;
}

export interface QuizSubmitResponse {
  result: QuizResult;
  passed: boolean;
  canRetake: boolean;
  nextAttemptAvailableAt?: Date;
  unlocked?: string[]; // IDs of content unlocked by passing
}

// Filters
export interface QuizFilters {
  gradeLevel?: GradeLevel; // Admin/Teacher only
  type?: QuizType;
  status?: QuizStatus;
  lectureId?: string;
  search?: string;
}
