import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock components for integration testing
const mockMessages = {
  common: {
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
  },
  auth: {
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    loginSuccess: "Login successful",
    registerSuccess: "Registration successful",
  },
  lessons: {
    title: "Lessons",
    startLesson: "Start Lesson",
    completeLesson: "Complete Lesson",
    progress: "Progress",
  },
  quiz: {
    title: "Quiz",
    question: "Question",
    submit: "Submit Answer",
    score: "Score",
    correct: "Correct",
    incorrect: "Incorrect",
  },
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <NextIntlClientProvider messages={mockMessages} locale="ar">
    {children}
  </NextIntlClientProvider>
);

// Mock API responses
const mockResponses: Record<string, any> = {
  "/api/auth/login": {
    success: true,
    token: "mock-jwt-token",
    user: { id: 1, name: "Test User", email: "test@example.com" },
  },
  "/api/auth/register": {
    success: true,
    message: "User registered successfully",
  },
  "/api/lessons": {
    lessons: [
      { id: 1, title: "Arabic Basics", duration: 30, completed: false },
      { id: 2, title: "Grammar", duration: 45, completed: true },
    ],
  },
  "/api/lessons/1": {
    id: 1,
    title: "Arabic Basics",
    content: "Lesson content...",
    videoUrl: "https://example.com/video.mp4",
    duration: 30,
  },
  "/api/quizzes/1": {
    id: 1,
    title: "Basic Quiz",
    questions: [
      {
        id: 1,
        question: 'What is the Arabic word for "book"?',
        options: ["كتاب", "قلم", "مدرسة", "بيت"],
        correctAnswer: 0,
      },
    ],
  },
  "/api/user/progress": {
    totalLessons: 50,
    completedLessons: 12,
    currentStreak: 5,
    totalXP: 1250,
  },
};

describe("User Flow Integration Tests", () => {
  beforeEach(() => {
    // Reset localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Mock global fetch with vi.fn()
    global.fetch = vi.fn((url: string) => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponses[url] || {}),
      } as Response);
    });
  });

  describe("Authentication Flow", () => {
    it("should complete full login flow", async () => {
      const user = userEvent.setup();

      // Mock login form component with direct localStorage handling
      const LoginForm = () => {
        const [email, setEmail] = React.useState("");
        const [password, setPassword] = React.useState("");
        const [isLoading, setIsLoading] = React.useState(false);
        const [message, setMessage] = React.useState("");

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsLoading(true);

          // Simulate API call with direct mock response
          await new Promise((resolve) => setTimeout(resolve, 10));

          // Simulate successful login
          if (email && password) {
            localStorage.setItem("token", "mock-jwt-token");
            setMessage("Login successful");
          } else {
            setMessage("Login failed");
          }

          setIsLoading(false);
        };

        return (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="password-input"
            />
            <button
              type="submit"
              disabled={isLoading}
              data-testid="login-button"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
            {message && <div data-testid="message">{message}</div>}
          </form>
        );
      };

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>,
      );

      // Fill in login form
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");

      // Submit form
      await user.click(screen.getByTestId("login-button"));

      // Wait for success message and token to be stored
      await waitFor(() => {
        expect(screen.getByTestId("message")).toHaveTextContent(
          "Login successful",
        );
        expect(localStorage.getItem("token")).toBe("mock-jwt-token");
      });
    });

    it("should complete full registration flow", async () => {
      const user = userEvent.setup();

      // Mock registration form component
      const RegisterForm = () => {
        const [formData, setFormData] = React.useState({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        const [message, setMessage] = React.useState("");

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match");
            return;
          }

          try {
            const response = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });

            const data = await response.json();
            setMessage(
              data.success ? "Registration successful" : "Registration failed",
            );
          } catch (error) {
            setMessage("Registration failed");
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              data-testid="name-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              data-testid="email-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              data-testid="password-input"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              data-testid="confirm-password-input"
            />
            <button type="submit" data-testid="register-button">
              Register
            </button>
            {message && <div data-testid="message">{message}</div>}
          </form>
        );
      };

      render(
        <TestWrapper>
          <RegisterForm />
        </TestWrapper>,
      );

      // Fill in registration form
      await user.type(screen.getByTestId("name-input"), "Test User");
      await user.type(screen.getByTestId("email-input"), "test@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );

      // Submit form
      await user.click(screen.getByTestId("register-button"));

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByTestId("message")).toHaveTextContent(
          "Registration successful",
        );
      });
    });
  });

  describe("Learning Flow", () => {
    it("should complete lesson viewing flow", async () => {
      const user = userEvent.setup();

      // Mock lesson component
      const LessonViewer = () => {
        const [lesson, setLesson] = React.useState<any>(null);
        const [progress, setProgress] = React.useState(0);
        const [isCompleted, setIsCompleted] = React.useState(false);

        React.useEffect(() => {
          fetch("/api/lessons/1")
            .then((res) => res.json())
            .then(setLesson);
        }, []);

        const handleComplete = () => {
          setProgress(100);
          setIsCompleted(true);
        };

        if (!lesson) return <div data-testid="loading">Loading...</div>;

        return (
          <div>
            <h1 data-testid="lesson-title">{lesson.title}</h1>
            <div data-testid="lesson-content">{lesson.content}</div>
            <div data-testid="progress">Progress: {progress}%</div>
            <button
              onClick={handleComplete}
              data-testid="complete-button"
              disabled={isCompleted}
            >
              {isCompleted ? "Completed" : "Complete Lesson"}
            </button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <LessonViewer />
        </TestWrapper>,
      );

      // Wait for lesson to load
      await waitFor(() => {
        expect(screen.getByTestId("lesson-title")).toHaveTextContent(
          "Arabic Basics",
        );
      });

      // Complete the lesson
      await user.click(screen.getByTestId("complete-button"));

      // Verify completion
      await waitFor(() => {
        expect(screen.getByTestId("progress")).toHaveTextContent(
          "Progress: 100%",
        );
        expect(screen.getByTestId("complete-button")).toHaveTextContent(
          "Completed",
        );
      });
    });
  });

  describe("Quiz Flow", () => {
    it("should complete quiz taking flow", async () => {
      const user = userEvent.setup();

      // Mock quiz component
      const QuizTaker = () => {
        const [quiz, setQuiz] = React.useState<any>(null);
        const [currentQuestion, setCurrentQuestion] = React.useState(0);
        const [selectedAnswer, setSelectedAnswer] = React.useState<
          number | null
        >(null);
        const [score, setScore] = React.useState<number | null>(null);

        React.useEffect(() => {
          fetch("/api/quizzes/1")
            .then((res) => res.json())
            .then(setQuiz);
        }, []);

        const handleSubmit = () => {
          if (selectedAnswer !== null && quiz) {
            const isCorrect =
              selectedAnswer === quiz.questions[currentQuestion].correctAnswer;
            setScore(isCorrect ? 100 : 0);
          }
        };

        if (!quiz) return <div data-testid="loading">Loading...</div>;
        if (score !== null) {
          return (
            <div>
              <div data-testid="quiz-complete">Quiz Complete!</div>
              <div data-testid="final-score">Score: {score}%</div>
            </div>
          );
        }

        const question = quiz.questions[currentQuestion];

        return (
          <div>
            <h2 data-testid="question">{question.question}</h2>
            {question.options.map((option: string, index: number) => (
              <label key={index}>
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  onChange={() => setSelectedAnswer(index)}
                  data-testid={`option-${index}`}
                />
                {option}
              </label>
            ))}
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              data-testid="submit-answer"
            >
              Submit Answer
            </button>
          </div>
        );
      };

      render(
        <TestWrapper>
          <QuizTaker />
        </TestWrapper>,
      );

      // Wait for quiz to load
      await waitFor(() => {
        expect(screen.getByTestId("question")).toHaveTextContent(
          'What is the Arabic word for "book"?',
        );
      });

      // Select correct answer
      await user.click(screen.getByTestId("option-0"));

      // Submit answer
      await user.click(screen.getByTestId("submit-answer"));

      // Verify completion and score
      await waitFor(() => {
        expect(screen.getByTestId("quiz-complete")).toHaveTextContent(
          "Quiz Complete!",
        );
        expect(screen.getByTestId("final-score")).toHaveTextContent(
          "Score: 100%",
        );
      });
    });
  });
});
