"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Coffee,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Timer,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const POMODORO_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

export default function TasksCornerPage() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "مراجعة درس النحو", completed: false },
    { id: 2, text: "حل واجب البلاغة", completed: true },
  ]);
  const [newTask, setNewTask] = useState("");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = useCallback(() => setIsRunning((prev) => !prev), []);
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(isBreak ? BREAK_TIME : POMODORO_TIME);
  }, [isBreak]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (!isBreak) {
            setSessions((s) => s + 1);
            setIsBreak(true);
            return BREAK_TIME;
          } else {
            setIsBreak(false);
            return POMODORO_TIME;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isBreak]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        toggleTimer();
      }
      if (e.code === "KeyR" && e.shiftKey) resetTimer();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTimer, resetTimer]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: number) => setTasks(tasks.filter((t) => t.id !== id));

  const progress =
    (((isBreak ? BREAK_TIME : POMODORO_TIME) - timeLeft) /
      (isBreak ? BREAK_TIME : POMODORO_TIME)) *
    100;

  return (
    <div
      className="min-h-screen bg-background dark:bg-zinc-950 pb-24 lg:pb-8"
      dir="rtl"
    >
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/ar/corners">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  ركن المهام
                </h1>
                <p className="text-sm text-muted-foreground">
                  بومودورو + إدارة المهام
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pomodoro Timer */}
        <Card
          className={`border-2 ${isBreak ? "border-green-500/30 bg-green-50/50 dark:bg-green-950/20" : "border-orange-500/30 bg-orange-50/50 dark:bg-orange-950/20"}`}
        >
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-lg font-medium">
              {isBreak ? (
                <Coffee className="w-5 h-5 text-green-600" />
              ) : (
                <Zap className="w-5 h-5 text-orange-600" />
              )}
              <span
                className={
                  isBreak
                    ? "text-green-700 dark:text-green-400"
                    : "text-orange-700 dark:text-orange-400"
                }
              >
                {isBreak ? "وقت الراحة" : "وقت التركيز"}
              </span>
            </div>

            <motion.div
              className="relative w-48 h-48 mx-auto"
              animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
              transition={{ repeat: isRunning ? Infinity : 0, duration: 2 }}
            >
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className={isBreak ? "text-green-500" : "text-orange-500"}
                  strokeDasharray={553}
                  strokeDashoffset={553 - (553 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold tabular-nums text-foreground">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </motion.div>

            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={toggleTimer}
                className={
                  isBreak
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }
              >
                {isRunning ? (
                  <Pause className="w-5 h-5 ms-2" />
                ) : (
                  <Play className="w-5 h-5 ms-2" />
                )}
                {isRunning ? "إيقاف" : "ابدأ"}
              </Button>
              <Button size="lg" variant="outline" onClick={resetTimer}>
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              الجلسات المكتملة:{" "}
              <span className="font-bold text-foreground">{sessions}</span> •
              اضغط Space للتبديل، Shift+R للإعادة
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              قائمة المهام
            </h2>

            {/* Add Task */}
            <div className="flex gap-2">
              <Input
                placeholder="أضف مهمة جديدة... (اضغط Enter)"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="flex-1"
              />
              <Button onClick={addTask} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    task.completed
                      ? "bg-muted/50 border-muted"
                      : "bg-background border-border hover:border-orange-300"
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : "border-muted-foreground hover:border-orange-500"
                    }`}
                  >
                    {task.completed && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <span
                    className={`flex-1 ${
                      task.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد مهام. أضف مهمة للبدء!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
