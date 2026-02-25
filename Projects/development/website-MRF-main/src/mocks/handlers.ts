import { http, HttpResponse } from "msw";

// API Request/Response Types
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  grade: string;
}

interface ProgressUpdateRequest {
  progress: number;
}

interface QuizSubmissionRequest {
  answers: Record<string, string>;
}

// Mock data
const mockUser = {
  id: "1",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  grade: "grade3",
  xp: 2450,
  level: 12,
  streak: 7,
  avatar: "/avatars/student-1.jpg",
  joinedAt: "2024-01-15T00:00:00Z",
};

const mockLessons = [
  {
    id: "1",
    title: "مقدمة في النحو العربي",
    description: "تعلم أساسيات النحو العربي والإعراب",
    duration: 1800, // 30 minutes
    videoUrl: "/videos/lesson-1.mp4",
    thumbnailUrl: "/thumbnails/lesson-1.jpg",
    grade: "grade1",
    subject: "arabic",
    difficulty: "beginner",
    xpReward: 100,
    completed: false,
    progress: 0,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "الأسماء والأفعال",
    description: "التمييز بين الأسماء والأفعال في اللغة العربية",
    duration: 2100, // 35 minutes
    videoUrl: "/videos/lesson-2.mp4",
    thumbnailUrl: "/thumbnails/lesson-2.jpg",
    grade: "grade1",
    subject: "arabic",
    difficulty: "beginner",
    xpReward: 120,
    completed: true,
    progress: 100,
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    title: "البلاغة والمحسنات البديعية",
    description: "دراسة البلاغة العربية والمحسنات البديعية",
    duration: 2700, // 45 minutes
    videoUrl: "/videos/lesson-3.mp4",
    thumbnailUrl: "/thumbnails/lesson-3.jpg",
    grade: "grade2",
    subject: "arabic",
    difficulty: "intermediate",
    xpReward: 150,
    completed: false,
    progress: 65,
    createdAt: "2024-01-03T00:00:00Z",
  },
];

const mockQuizzes = [
  {
    id: "1",
    title: "اختبار النحو الأساسي",
    description: "اختبر معرفتك بأساسيات النحو العربي",
    lessonId: "1",
    questions: [
      {
        id: "1",
        question: 'ما هو إعراب كلمة "الطالب" في جملة "جاء الطالب"؟',
        options: [
          { id: "a", text: "فاعل مرفوع", isCorrect: true },
          { id: "b", text: "مفعول به منصوب", isCorrect: false },
          { id: "c", text: "مبتدأ مرفوع", isCorrect: false },
          { id: "d", text: "خبر مرفوع", isCorrect: false },
        ],
        explanation:
          'كلمة "الطالب" في هذه الجملة هي فاعل للفعل "جاء" وهي مرفوعة بالضمة.',
        difficulty: "easy",
        points: 10,
      },
      {
        id: "2",
        question: "أي من الكلمات التالية فعل؟",
        options: [
          { id: "a", text: "كتاب", isCorrect: false },
          { id: "b", text: "يكتب", isCorrect: true },
          { id: "c", text: "مكتبة", isCorrect: false },
          { id: "d", text: "كاتب", isCorrect: false },
        ],
        explanation: 'كلمة "يكتب" هي فعل مضارع، بينما الكلمات الأخرى أسماء.',
        difficulty: "easy",
        points: 10,
      },
    ],
    timeLimit: 600, // 10 minutes
    passingScore: 70,
    maxAttempts: 3,
    xpReward: 50,
  },
];

const mockProgress = {
  userId: "1",
  totalXP: 2450,
  level: 12,
  streak: 7,
  lessonsCompleted: 15,
  totalLessons: 43,
  quizzesCompleted: 8,
  totalQuizzes: 20,
  averageScore: 85,
  studyTimeThisWeek: 420, // minutes
  studyTimeThisMonth: 1680, // minutes
  achievements: [
    {
      id: "1",
      name: "أول خطوة",
      description: "أكمل أول درس",
      icon: "🎯",
      unlockedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      name: "متحمس للتعلم",
      description: "ادرس لمدة 7 أيام متتالية",
      icon: "🔥",
      unlockedAt: "2024-01-22T15:30:00Z",
    },
  ],
};

export const handlers = [
  // Auth endpoints
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest;

    // Simulate authentication
    if (email === "ahmed@example.com" && password === "password") {
      return HttpResponse.json({
        success: true,
        user: mockUser,
        token: "mock-jwt-token",
      });
    }

    return HttpResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 },
    );
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const userData = (await request.json()) as RegisterRequest;

    return HttpResponse.json({
      success: true,
      user: { ...mockUser, ...userData, id: Date.now().toString() },
      token: "mock-jwt-token",
    });
  }),

  http.get("/api/auth/me", () => {
    return HttpResponse.json({
      success: true,
      user: mockUser,
    });
  }),

  // Lessons endpoints
  http.get("/api/lessons", ({ request }) => {
    const url = new URL(request.url);
    const grade = url.searchParams.get("grade");
    const subject = url.searchParams.get("subject");

    let filteredLessons = mockLessons;

    if (grade) {
      filteredLessons = filteredLessons.filter(
        (lesson) => lesson.grade === grade,
      );
    }

    if (subject) {
      filteredLessons = filteredLessons.filter(
        (lesson) => lesson.subject === subject,
      );
    }

    return HttpResponse.json({
      success: true,
      lessons: filteredLessons,
    });
  }),

  http.get("/api/lessons/:id", ({ params }) => {
    const lesson = mockLessons.find((l) => l.id === params.id);

    if (!lesson) {
      return HttpResponse.json(
        { success: false, message: "Lesson not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      lesson,
    });
  }),

  http.post("/api/lessons/:id/progress", async ({ params, request }) => {
    const { progress } = (await request.json()) as ProgressUpdateRequest;

    return HttpResponse.json({
      success: true,
      message: "Progress updated",
      xpGained: progress === 100 ? 100 : 0,
    });
  }),

  // Quiz endpoints
  http.get("/api/quizzes", ({ request }) => {
    const url = new URL(request.url);
    const lessonId = url.searchParams.get("lessonId");

    let filteredQuizzes = mockQuizzes;

    if (lessonId) {
      filteredQuizzes = filteredQuizzes.filter(
        (quiz) => quiz.lessonId === lessonId,
      );
    }

    return HttpResponse.json({
      success: true,
      quizzes: filteredQuizzes,
    });
  }),

  http.get("/api/quizzes/:id", ({ params }) => {
    const quiz = mockQuizzes.find((q) => q.id === params.id);

    if (!quiz) {
      return HttpResponse.json(
        { success: false, message: "Quiz not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      quiz,
    });
  }),

  http.post("/api/quizzes/:id/submit", async ({ params, request }) => {
    const { answers } = (await request.json()) as QuizSubmissionRequest;
    const quiz = mockQuizzes.find((q) => q.id === params.id);

    if (!quiz) {
      return HttpResponse.json(
        { success: false, message: "Quiz not found" },
        { status: 404 },
      );
    }

    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;

    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      const correctOption = question.options.find((opt) => opt.isCorrect);

      if (userAnswer === correctOption?.id) {
        correctAnswers++;
        totalPoints += question.points;
      }
    });

    const score = (correctAnswers / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    return HttpResponse.json({
      success: true,
      result: {
        score,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        totalPoints,
        passed,
        xpGained: passed ? quiz.xpReward : 0,
      },
    });
  }),

  // Progress endpoints
  http.get("/api/progress", () => {
    return HttpResponse.json({
      success: true,
      progress: mockProgress,
    });
  }),

  http.get("/api/leaderboard", () => {
    return HttpResponse.json({
      success: true,
      leaderboard: [
        {
          rank: 1,
          name: "سارة أحمد",
          xp: 3200,
          avatar: "/avatars/student-2.jpg",
        },
        {
          rank: 2,
          name: "محمد علي",
          xp: 2800,
          avatar: "/avatars/student-3.jpg",
        },
        {
          rank: 3,
          name: "فاطمة حسن",
          xp: 2450,
          avatar: "/avatars/student-1.jpg",
        },
        {
          rank: 4,
          name: "أحمد محمد",
          xp: 2450,
          avatar: "/avatars/student-1.jpg",
        },
        {
          rank: 5,
          name: "نور الدين",
          xp: 2100,
          avatar: "/avatars/student-4.jpg",
        },
      ],
    });
  }),
];
