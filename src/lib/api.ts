// API utility functions for the educational platform
import { httpClient } from "@/lib/security/http-client";

export interface User {
  id: string;
  name: string;
  email: string;
  grade: string;
  xp: number;
  level: number;
  streak: number;
  avatar?: string;
  joinedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  thumbnailUrl?: string;
  grade: string;
  subject: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  completed: boolean;
  progress: number;
  createdAt: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  lessonId?: string;
  questions: QuizQuestion[];
  timeLimit: number;
  passingScore: number;
  maxAttempts: number;
  xpReward: number;
}

export interface Progress {
  userId: string;
  totalXP: number;
  level: number;
  streak: number;
  lessonsCompleted: number;
  totalLessons: number;
  quizzesCompleted: number;
  totalQuizzes: number;
  averageScore: number;
  studyTimeThisWeek: number;
  studyTimeThisMonth: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  avatar?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class APIClient {
  // Auth methods
  async login(
    email: string,
    password: string,
  ): Promise<APIResponse<{ user: User; token: string }>> {
    return httpClient.post(
      "/auth/login",
      { email, password },
      { skipAuth: true },
    );
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    grade: string;
  }): Promise<APIResponse<{ user: User; token: string }>> {
    return httpClient.post("/auth/register", userData, { skipAuth: true });
  }

  async getCurrentUser(): Promise<APIResponse<{ user: User }>> {
    return httpClient.get("/auth/me");
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<
    APIResponse<{
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }>
  > {
    return httpClient.post(
      "/auth/refresh",
      { refreshToken },
      { skipAuth: true },
    );
  }

  // Lesson methods
  async getLessons(filters?: {
    grade?: string;
    subject?: string;
  }): Promise<APIResponse<{ lessons: Lesson[] }>> {
    const params = new URLSearchParams();
    if (filters?.grade) params.append("grade", filters.grade);
    if (filters?.subject) params.append("subject", filters.subject);

    const query = params.toString();
    return httpClient.get(`/lessons${query ? `?${query}` : ""}`);
  }

  async getLesson(id: string): Promise<APIResponse<{ lesson: Lesson }>> {
    return httpClient.get(`/lessons/${id}`);
  }

  async updateLessonProgress(
    lessonId: string,
    progress: number,
  ): Promise<APIResponse<{ message: string; xpGained: number }>> {
    return httpClient.post(`/lessons/${lessonId}/progress`, { progress });
  }

  // Quiz methods
  async getQuizzes(
    lessonId?: string,
  ): Promise<APIResponse<{ quizzes: Quiz[] }>> {
    const params = lessonId ? `?lessonId=${lessonId}` : "";
    return httpClient.get(`/quizzes${params}`);
  }

  async getQuiz(id: string): Promise<APIResponse<{ quiz: Quiz }>> {
    return httpClient.get(`/quizzes/${id}`);
  }

  async submitQuiz(
    quizId: string,
    answers: Record<string, string>,
  ): Promise<
    APIResponse<{
      result: {
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        totalPoints: number;
        passed: boolean;
        xpGained: number;
      };
    }>
  > {
    return httpClient.post(`/quizzes/${quizId}/submit`, { answers });
  }

  // Progress methods
  async getProgress(): Promise<APIResponse<{ progress: Progress }>> {
    return httpClient.get("/progress");
  }

  async getLeaderboard(): Promise<
    APIResponse<{ leaderboard: LeaderboardEntry[] }>
  > {
    return httpClient.get("/leaderboard");
  }
}

export const api = new APIClient();
