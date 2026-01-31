// Homework System Types for MRF Educational Platform
// CRITICAL: Grade Isolation - Homework is grade-specific (inherited from lecture)

import type { GradeLevel } from "./lecture";

export type HomeworkStatus =
  | "locked"
  | "available"
  | "in-progress"
  | "submitted"
  | "graded"
  | "late";

export type HomeworkQuestionType =
  | "essay"
  | "short-answer"
  | "file-upload"
  | "multiple-files"
  | "code"
  | "creative-writing";

export type SubmissionStatus =
  | "not-submitted"
  | "submitted"
  | "late"
  | "under-review"
  | "graded"
  | "returned";

export interface Homework {
  id: string;
  lectureId: string;

  // Basic Info
  title: string;
  description: string;
  instructions: string; // Detailed instructions (Markdown)
  gradeLevel: GradeLevel; // CRITICAL: Grade-specific

  // Requirements
  requiresExerciseComplete: boolean;
  exerciseId?: string;

  // Deadline
  deadline: Date;
  allowLateSubmission: boolean;
  lateSubmissionDeadline?: Date;
  latePenalty?: number; // Percentage deduction (e.g., 10 = 10% off)

  // Questions
  questions: HomeworkQuestion[];
  totalPoints: number;

  // Submission Settings
  allowMultipleSubmissions: boolean;
  maxSubmissions?: number;
  showGradeImmediately: boolean;

  // File Upload Settings
  allowedFileTypes?: string[]; // e.g., ['pdf', 'docx', 'jpg']
  maxFileSize?: number; // in MB
  maxFiles?: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Teacher ID
  isPublished: boolean;

  // Estimated time
  estimatedDuration: number; // in minutes
}

export interface HomeworkQuestion {
  id: string;
  homeworkId: string;

  // Question content
  type: HomeworkQuestionType;
  question: string;
  order: number;
  points: number;

  // Instructions
  instructions?: string;
  hints?: string[];

  // File upload requirements
  requiresFile?: boolean;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  minWords?: number; // For essays
  maxWords?: number;

  // Rubric
  rubric?: HomeworkRubric;

  // Sample/Reference
  sampleAnswer?: string;
  referenceLinks?: string[];

  // Media
  imageUrl?: string;
  attachmentUrl?: string;
}

export interface HomeworkRubric {
  id: string;
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  id: string;
  name: string; // e.g., "Excellent", "Good", "Fair", "Poor"
  description: string;
  points: number;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;

  // Status
  status: SubmissionStatus;
  submissionNumber: number; // 1, 2, 3, etc.

  // Timing
  submittedAt: Date;
  isLate: boolean;
  latePenaltyApplied?: number; // Percentage deducted

  // Answers
  answers: HomeworkAnswer[];

  // Files
  files: HomeworkFile[];

  // Grading
  score?: number; // percentage
  pointsEarned?: number;
  totalPoints: number;
  grade?: string; // e.g., "A", "B+", "85%"

  // Review
  reviewedBy?: string; // Teacher ID
  reviewedAt?: Date;
  feedback?: string; // Overall feedback

  // Resubmission
  allowResubmission: boolean;
  resubmissionDeadline?: Date;
  resubmissionRequested: boolean;
}

export interface HomeworkAnswer {
  id: string;
  submissionId: string;
  questionId: string;

  // Answer content
  answer: string; // Text answer

  // Files (if question requires file upload)
  files?: HomeworkFile[];

  // Grading
  pointsEarned?: number;
  maxPoints: number;
  feedback?: string; // Question-specific feedback

  // Rubric grading
  rubricScores?: RubricScore[];

  // Metadata
  answeredAt: Date;
  wordCount?: number;
}

export interface RubricScore {
  criterionId: string;
  levelId: string;
  points: number;
  comment?: string;
}

export interface HomeworkFile {
  id: string;
  name: string;
  url: string;
  type: string; // MIME type
  size: number; // in bytes
  uploadedAt: Date;
  uploadedBy: string; // Student ID
}

export interface HomeworkResult {
  submission: HomeworkSubmission;
  homework: Homework;

  // Overall results
  score: number; // percentage
  pointsEarned: number;
  totalPoints: number;
  grade: string;

  // Question breakdown
  questionResults: HomeworkQuestionResult[];

  // Timing
  submittedAt: Date;
  isLate: boolean;
  latePenaltyApplied?: number;

  // Feedback
  overallFeedback?: string;
  teacherComments?: string;

  // Next steps
  canResubmit: boolean;
  resubmissionDeadline?: Date;
}

export interface HomeworkQuestionResult {
  question: HomeworkQuestion;
  answer: HomeworkAnswer;
  pointsEarned: number;
  maxPoints: number;
  feedback?: string;
  rubricScores?: RubricScore[];
}

// Student's homework history
export interface StudentHomeworkHistory {
  homeworkId: string;
  homework: Homework;
  submissions: HomeworkSubmission[];

  // Best performance
  bestScore?: number;
  bestSubmission?: HomeworkSubmission;

  // Stats
  totalSubmissions: number;
  averageScore?: number;

  // Status
  currentStatus: HomeworkStatus;
  isCompleted: boolean;

  // Progress
  firstSubmissionAt?: Date;
  lastSubmissionAt?: Date;
  gradedAt?: Date;
}

// Homework Statistics (for teachers)
export interface HomeworkStatistics {
  homeworkId: string;
  homework: Homework;

  // Engagement
  totalStudents: number;
  studentsSubmitted: number;
  submissionRate: number; // percentage

  // Timing
  onTimeSubmissions: number;
  lateSubmissions: number;
  notSubmitted: number;

  // Performance
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  medianScore: number;

  // Grading
  graded: number;
  pendingReview: number;

  // Question analysis
  questionStatistics: HomeworkQuestionStatistics[];
}

export interface HomeworkQuestionStatistics {
  questionId: string;
  question: HomeworkQuestion;

  // Performance
  averageScore: number;
  highestScore: number;
  lowestScore: number;

  // Common issues
  commonMistakes?: string[];

  // Difficulty
  difficultyRating: "easy" | "medium" | "hard";
}

// API Request/Response Types
export interface HomeworkDetailResponse {
  homework: Homework;
  lecture: {
    id: string;
    title: string;
    weekNumber: number;
    gradeLevel: GradeLevel;
  };
  canAccess: boolean;
  accessMessage?: string;
  unlockRequirements?: {
    requiresExercise: boolean;
    exerciseCompleted: boolean;
    exerciseScore?: number;
  };
  previousSubmissions?: HomeworkSubmission[];
  submissionsRemaining?: number;
  deadline: Date;
  isLate: boolean;
}

export interface HomeworkSubmitRequest {
  homeworkId: string;
  answers: {
    questionId: string;
    answer: string;
    files?: File[];
  }[];
  files?: File[]; // General files
}

export interface HomeworkSubmitResponse {
  submission: HomeworkSubmission;
  result?: HomeworkResult; // If graded immediately
  message: string;
}

export interface HomeworkGradeRequest {
  submissionId: string;
  questionGrades: {
    questionId: string;
    pointsEarned: number;
    feedback?: string;
    rubricScores?: RubricScore[];
  }[];
  overallFeedback: string;
  allowResubmission?: boolean;
  resubmissionDeadline?: Date;
}

export interface HomeworkGradeResponse {
  result: HomeworkResult;
  notificationSent: boolean;
}

// Homework Filters
export interface HomeworkFilters {
  lectureId?: string;
  status?: HomeworkStatus;
  gradeLevel?: GradeLevel;
  search?: string;
  dueSoon?: boolean; // Due within 24 hours
  overdue?: boolean;
}
