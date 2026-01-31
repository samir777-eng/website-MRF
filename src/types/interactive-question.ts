// Interactive Mid-Lecture Questions
// Questions that appear at specific timestamps during video lectures

export type InteractiveQuestionType = "multiple-choice" | "true-false" | "poll";

export type InteractiveQuestionDifficulty = "easy" | "medium" | "hard";

export interface InteractiveQuestion {
  id: string;
  lessonId: string;

  // Timing
  timestamp: number; // seconds into the video when question appears
  duration?: number; // how long to show question (default: until answered)
  pauseVideo: boolean; // whether to pause video when question appears

  // Question content
  question: string;
  type: InteractiveQuestionType;
  difficulty: InteractiveQuestionDifficulty;

  // Options
  options: string[];
  correctAnswer: number; // index of correct answer

  // Feedback
  correctFeedback: string; // shown when answer is correct
  incorrectFeedback: string; // shown when answer is wrong
  explanation?: string; // detailed explanation (optional)

  // Context
  context?: string; // what Mr. Reda is explaining at this point
  relatedTopic?: string; // e.g., "الفاعل", "المفعول به"

  // Rewards
  xpReward: number; // XP for correct answer

  // Analytics
  totalAttempts: number;
  correctAttempts: number;
  averageResponseTime: number; // seconds

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface InteractiveQuestionAttempt {
  id: string;
  userId: string;
  questionId: string;
  lessonId: string;

  // Attempt details
  userAnswer: number; // index of selected option
  isCorrect: boolean;
  responseTime: number; // seconds taken to answer

  // Video context
  videoTimestamp: number; // when in the video they answered
  watchedBefore: boolean; // did they watch this part before?

  // Rewards
  xpEarned: number;

  // Metadata
  attemptedAt: Date;
}

export interface LessonInteractiveQuestions {
  lessonId: string;
  lessonTitle: string;
  totalQuestions: number;
  questions: InteractiveQuestion[];

  // User progress
  userProgress?: {
    questionsAnswered: number;
    correctAnswers: number;
    totalXpEarned: number;
    accuracy: number; // percentage
    averageResponseTime: number;
  };
}

export interface InteractiveQuestionStats {
  questionId: string;

  // Overall stats
  totalAttempts: number;
  uniqueUsers: number;
  correctAttempts: number;
  accuracy: number; // percentage

  // Response distribution
  optionDistribution: {
    [optionIndex: number]: {
      count: number;
      percentage: number;
    };
  };

  // Timing
  averageResponseTime: number;
  medianResponseTime: number;

  // Difficulty assessment
  perceivedDifficulty: "too-easy" | "appropriate" | "too-hard";

  updatedAt: Date;
}

// Helper function to determine if question should appear
export function shouldShowQuestion(
  currentTime: number,
  question: InteractiveQuestion,
  alreadyAnswered: boolean,
): boolean {
  // Don't show if already answered
  if (alreadyAnswered) return false;

  // Show if current time matches timestamp (within 1 second)
  const timeDiff = Math.abs(currentTime - question.timestamp);
  return timeDiff < 1;
}

// Helper function to calculate XP reward based on difficulty and response time
export function calculateInteractiveQuestionXP(
  difficulty: InteractiveQuestionDifficulty,
  responseTime: number,
  isCorrect: boolean,
): number {
  if (!isCorrect) return 0;

  // Base XP by difficulty
  const baseXP = {
    easy: 5,
    medium: 10,
    hard: 15,
  }[difficulty];

  // Speed bonus (answer within 10 seconds)
  const speedBonus = responseTime <= 10 ? 5 : 0;

  return baseXP + speedBonus;
}

// Helper function to format timestamp for display
export function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Question templates for common scenarios
export const QUESTION_TEMPLATES = {
  // When Mr. Reda poses a question
  BEFORE_SOLUTION: {
    context: "قبل الحل",
    correctFeedback: "ممتاز! إجابتك صحيحة. الآن شاهد شرح الأستاذ.",
    incorrectFeedback: "لا بأس، شاهد الشرح لتفهم الحل الصحيح.",
  },

  // During explanation
  DURING_EXPLANATION: {
    context: "أثناء الشرح",
    correctFeedback: "رائع! أنت تتابع الشرح بتركيز.",
    incorrectFeedback: "راجع هذا الجزء من الشرح مرة أخرى.",
  },

  // After explanation
  AFTER_EXPLANATION: {
    context: "بعد الشرح",
    correctFeedback: "عظيم! لقد فهمت الدرس.",
    incorrectFeedback: "أعد مشاهدة الشرح لفهم أفضل.",
  },
};
