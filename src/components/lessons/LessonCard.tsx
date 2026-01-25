"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Play,
  Star,
  Trophy,
  Users,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface LessonCardProps {
  lesson: {
    id: number;
    title: string;
    subject: string;
    duration: string;
    videoCount: number;
    exerciseCount: number;
    difficulty: string;
    completed: boolean;
    progress: number;
    rating: number;
    students: number;
    description: string;
    topics: string[];
    xpReward?: number;
  };
}

export function LessonCard({ lesson }: LessonCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate XP reward based on difficulty
  const xpReward =
    lesson.xpReward ||
    (lesson.difficulty === "متقدم"
      ? 150
      : lesson.difficulty === "متوسط"
        ? 100
        : 50);

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "مبتدئ":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "متوسط":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "متقدم":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Get subject gradient
  const getSubjectGradient = (subject: string) => {
    const gradients: Record<string, string> = {
      grammar: "from-blue-500 to-cyan-500",
      literature: "from-purple-500 to-pink-500",
      rhetoric: "from-pink-500 to-rose-500",
      reading: "from-green-500 to-emerald-500",
      writing: "from-orange-500 to-red-500",
      spelling: "from-cyan-500 to-blue-500",
    };
    return gradients[subject] || "from-gray-500 to-gray-600";
  };

  return (
    <Card
      className={`group border-0 shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl ${
        isHovered ? "scale-[1.02]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Thumbnail Preview */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getSubjectGradient(lesson.subject)} opacity-80`}
        />

        {/* Video Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
              isHovered ? "scale-110 bg-white/30" : ""
            }`}
          >
            <Play className="w-10 h-10 text-white" fill="white" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {lesson.completed && (
            <Badge className="bg-green-500 text-white border-0 shadow-lg">
              <CheckCircle className="w-3 h-3 ml-1" />
              مكتمل
            </Badge>
          )}
          <Badge className={getDifficultyColor(lesson.difficulty)}>
            {lesson.difficulty}
          </Badge>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm">
          <Clock className="w-4 h-4" />
          {lesson.duration}
        </div>

        {/* Video Count */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm">
          <Video className="w-4 h-4" />
          {lesson.videoCount} فيديو
        </div>

        {/* Hover Preview Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
            <div className="text-center text-white p-6">
              <h4 className="font-semibold text-lg mb-2">محتوى الدرس</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {lesson.topics.slice(0, 3).map((topic, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-white/20 text-white border-0"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        {/* Title and Rating */}
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-foreground mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {lesson.title}
          </h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-foreground">{lesson.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{lesson.students.toLocaleString("ar-EG")} طالب</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {lesson.description}
        </p>

        {/* Progress Bar (if started) */}
        {lesson.progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">التقدم</span>
              <span className="font-bold text-foreground">
                {lesson.progress}%
              </span>
            </div>
            <Progress value={lesson.progress} className="h-2" />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-bold text-foreground">
                {lesson.exerciseCount}
              </div>
              <div className="text-sm text-muted-foreground">تمرين</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="font-bold text-foreground">{xpReward} XP</div>
              <div className="text-sm text-muted-foreground">مكافأة</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/ar/lectures/${lesson.id}`} className="block">
          <Button
            className={`w-full ${
              lesson.completed
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                : lesson.progress > 0
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            } text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
            aria-label={
              lesson.completed
                ? `مراجعة الدرس - ${lesson.title}`
                : lesson.progress > 0
                  ? `متابعة التعلم - ${lesson.title}`
                  : `ابدأ الدرس - ${lesson.title}`
            }
          >
            {lesson.completed ? (
              <>
                <Trophy className="w-4 h-4 ml-2" aria-hidden="true" />
                مراجعة الدرس
                <ArrowLeft
                  className="w-4 h-4 mr-2 rtl:-scale-x-100"
                  aria-hidden="true"
                />
              </>
            ) : lesson.progress > 0 ? (
              <>
                <Play className="w-4 h-4 ml-2" aria-hidden="true" />
                متابعة التعلم
                <ArrowLeft
                  className="w-4 h-4 mr-2 rtl:-scale-x-100"
                  aria-hidden="true"
                />
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 ml-2" aria-hidden="true" />
                ابدأ الدرس
                <ArrowLeft
                  className="w-4 h-4 mr-2 rtl:-scale-x-100"
                  aria-hidden="true"
                />
              </>
            )}
          </Button>
        </Link>

        {/* Completion Badge */}
        {lesson.completed && (
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">أحسنت! لقد أكملت هذا الدرس</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LessonCard;
