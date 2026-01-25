"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Play,
  Star,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CompactLessonCardProps {
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
    xpReward?: number;
  };
}

export function CompactLessonCard({ lesson }: CompactLessonCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const xpReward =
    lesson.xpReward ||
    (lesson.difficulty === "متقدم"
      ? 150
      : lesson.difficulty === "متوسط"
        ? 100
        : 50);

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
    <Link href={`/ar/lectures/${lesson.id}`}>
      <Card
        className={`group border-0 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
          isHovered ? "scale-[1.01]" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            <div
              className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br ${getSubjectGradient(lesson.subject)}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                    isHovered ? "scale-110 bg-white/30" : ""
                  }`}
                >
                  <Play className="w-5 h-5 text-white" fill="white" />
                </div>
              </div>
              {lesson.completed && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-5 h-5 text-white fill-green-500" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {lesson.title}
                </h2>
                <Badge
                  className={getDifficultyColor(lesson.difficulty)}
                  variant="secondary"
                >
                  {lesson.difficulty}
                </Badge>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lesson.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" />
                  <span>{lesson.videoCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{lesson.exerciseCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-foreground">
                    {lesson.rating}
                  </span>
                </div>
              </div>

              {/* Progress or XP */}
              {lesson.progress > 0 ? (
                <div className="flex items-center gap-2">
                  <Progress value={lesson.progress} className="h-1.5 flex-1" />
                  <span className="text-sm font-bold text-foreground">
                    {lesson.progress}%
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-purple-600">
                    {xpReward} XP
                  </span>
                  <span className="text-muted-foreground">مكافأة</span>
                </div>
              )}
            </div>

            {/* Arrow */}
            <ChevronRight
              className={`w-6 h-6 text-muted-foreground transition-all duration-300 rtl:-scale-x-100 ${
                isHovered
                  ? "translate-x-[-4px] rtl:translate-x-[4px] text-blue-600"
                  : ""
              }`}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default CompactLessonCard;
