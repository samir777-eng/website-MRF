import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// Mock API responses for testing
const mockApiResponses = {
  "/api/auth/login": {
    method: "POST",
    response: {
      success: true,
      token: "mock-jwt-token",
      user: { id: 1, name: "Test User" },
    },
  },
  "/api/auth/register": {
    method: "POST",
    response: { success: true, message: "User registered successfully" },
  },
  "/api/lessons": {
    method: "GET",
    response: {
      lessons: [
        { id: 1, title: "Arabic Basics", duration: 30, difficulty: "beginner" },
        {
          id: 2,
          title: "Grammar Fundamentals",
          duration: 45,
          difficulty: "intermediate",
        },
      ],
    },
  },
  "/api/lessons/1": {
    method: "GET",
    response: {
      id: 1,
      title: "Arabic Basics",
      content: "Lesson content here...",
      videoUrl: "https://example.com/video.mp4",
      duration: 30,
      difficulty: "beginner",
    },
  },
  "/api/quizzes": {
    method: "GET",
    response: {
      quizzes: [
        {
          id: 1,
          title: "Basic Arabic Quiz",
          questions: 10,
          difficulty: "beginner",
        },
        {
          id: 2,
          title: "Grammar Quiz",
          questions: 15,
          difficulty: "intermediate",
        },
      ],
    },
  },
  "/api/user/progress": {
    method: "GET",
    response: {
      totalLessons: 50,
      completedLessons: 12,
      currentStreak: 5,
      totalXP: 1250,
      level: 3,
    },
  },
};

// Create MSW handlers for API testing
const apiHandlers = [
  http.post("/api/auth/login", () => {
    return HttpResponse.json({
      success: true,
      token: "mock-jwt-token",
      user: { id: 1, name: "Test User" },
    });
  }),
  http.post("/api/auth/register", () => {
    return HttpResponse.json({
      success: true,
      message: "User registered successfully",
    });
  }),
  http.get("/api/lessons", () => {
    return HttpResponse.json({
      lessons: [
        { id: 1, title: "Arabic Basics", duration: 30, difficulty: "beginner" },
        {
          id: 2,
          title: "Advanced Grammar",
          duration: 45,
          difficulty: "advanced",
        },
      ],
    });
  }),
  http.get("/api/lessons/:id", ({ params }) => {
    const { id } = params;
    if (id === "999") {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({
      id: Number(id),
      title: "Arabic Basics",
      content: "Lesson content here",
      duration: 30,
      difficulty: "beginner",
    });
  }),
  http.get("/api/quizzes", () => {
    return HttpResponse.json({
      quizzes: [
        { id: 1, title: "Basic Quiz", questions: 10, difficulty: "beginner" },
      ],
    });
  }),
  http.post("/api/quizzes/:id/submit", () => {
    return HttpResponse.json({
      score: 85,
      passed: true,
      feedback: "Great job!",
    });
  }),
  http.get("/api/user/progress", () => {
    return HttpResponse.json({
      completedLessons: 5,
      totalLessons: 20,
      currentStreak: 7,
      totalXP: 1250,
    });
  }),
  http.post("/api/user/progress", () => {
    return HttpResponse.json({ success: true, newXP: 50 });
  }),
];

const server = setupServer(...apiHandlers);

describe("API Integration Tests", () => {
  const baseUrl = "http://localhost:3000";

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  describe("Authentication Endpoints", () => {
    it("should handle login requests", async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("success");
    });

    it("should handle registration requests", async () => {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test User",
          email: "newuser@example.com",
          password: "password123",
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("success");
    });

    it("should validate required fields in registration", async () => {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "incomplete@example.com",
          // Missing name and password
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("Lessons Endpoints", () => {
    it("should fetch lessons list", async () => {
      const response = await fetch(`${baseUrl}/api/lessons`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("lessons");
      expect(Array.isArray(data.lessons)).toBe(true);
    });

    it("should fetch individual lesson", async () => {
      const response = await fetch(`${baseUrl}/api/lessons/1`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("title");
      expect(data).toHaveProperty("content");
    });

    it("should handle non-existent lesson", async () => {
      const response = await fetch(`${baseUrl}/api/lessons/999`);

      expect(response.status).toBe(404);
    });
  });

  describe("Quiz Endpoints", () => {
    it("should fetch quizzes list", async () => {
      const response = await fetch(`${baseUrl}/api/quizzes`);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("quizzes");
      expect(Array.isArray(data.quizzes)).toBe(true);
    });

    it("should submit quiz answers", async () => {
      const response = await fetch(`${baseUrl}/api/quizzes/1/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: [
            { questionId: 1, answer: "A" },
            { questionId: 2, answer: "B" },
          ],
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("score");
    });
  });

  describe("User Progress Endpoints", () => {
    it("should fetch user progress", async () => {
      const response = await fetch(`${baseUrl}/api/user/progress`, {
        headers: {
          Authorization: "Bearer mock-jwt-token",
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("totalLessons");
      expect(data).toHaveProperty("completedLessons");
      expect(data).toHaveProperty("currentStreak");
    });

    it("should update lesson progress", async () => {
      const response = await fetch(`${baseUrl}/api/user/progress/lesson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mock-jwt-token",
        },
        body: JSON.stringify({
          lessonId: 1,
          progress: 100,
          timeSpent: 1800, // 30 minutes
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("success");
    });
  });

  describe("Error Handling", () => {
    it("should handle malformed JSON", async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "invalid json",
      });

      expect(response.status).toBe(400);
    });

    it("should handle missing content-type", async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email: "test@example.com" }),
      });

      expect(response.status).toBe(400);
    });

    it("should handle unauthorized requests", async () => {
      const response = await fetch(`${baseUrl}/api/user/progress`);

      expect(response.status).toBe(401);
    });
  });

  describe("Rate Limiting", () => {
    it("should handle rate limiting", async () => {
      // Make multiple rapid requests
      const requests = Array(10)
        .fill(null)
        .map(() =>
          fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: "test@example.com",
              password: "wrong",
            }),
          }),
        );

      const responses = await Promise.all(requests);

      // At least some requests should be rate limited
      const rateLimitedResponses = responses.filter((r) => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});
