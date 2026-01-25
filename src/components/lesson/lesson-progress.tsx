"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  CheckCircle,
  Clock,
  Play,
  Target,
  TrendingUp,
} from "lucide-react";

interface LessonProgressProps {
  progress: number;
  duration: string;
  completedTime: string;
  isCompleted?: boolean;
}

export function LessonProgress({
  progress,
  duration,
  completedTime,
  isCompleted = false,
}: LessonProgressProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "text-green-600";
    if (progress >= 75) return "text-blue-600";
    if (progress >= 50) return "text-yellow-600";
    return "text-gray-600";
  };

  const getProgressMessage = (progress: number) => {
    if (progress >= 100) return "مكتملة";
    if (progress >= 75) return "تقدم ممتاز";
    if (progress >= 50) return "تقدم جيد";
    if (progress >= 25) return "بداية جيدة";
    return "ابدأ الآن";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5" />
          تقدم المحاضرة
        </CardTitle>
        <CardDescription>تتبع تقدمك في هذه المحاضرة</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Circle */}
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24">
            <svg
              className="w-24 h-24 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted-foreground/20"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                className={`transition-all duration-500 ${getProgressColor(progress)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className={`text-lg font-bold ${getProgressColor(progress)}`}
                >
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">التقدم</span>
            <Badge variant={progress >= 100 ? "default" : "secondary"}>
              {getProgressMessage(progress)}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Time Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium">{completedTime}</div>
            <div className="text-sm text-muted-foreground">مكتمل</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium">{duration}</div>
            <div className="text-sm text-muted-foreground">المدة الكاملة</div>
          </div>
        </div>

        {/* Achievement */}
        {progress >= 100 && (
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Award className="h-5 w-5" />
              <span className="font-medium">تهانينا!</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              لقد أكملت هذه المحاضرة بنجاح
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          {progress < 100 ? (
            <Button className="w-full">
              <Play className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {progress > 0 ? "متابعة المشاهدة" : "بدء المشاهدة"}
            </Button>
          ) : (
            <Button variant="outline" className="w-full">
              <CheckCircle className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
              إعادة المشاهدة
            </Button>
          )}

          <Button variant="outline" className="w-full" size="sm">
            <TrendingUp className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
            عرض الإحصائيات التفصيلية
          </Button>
        </div>

        {/* Study Tips */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            نصائح للدراسة
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• خذ استراحة كل 20 دقيقة</li>
            <li>• اكتب الملاحظات المهمة</li>
            <li>• راجع المحاضرة مرة أخرى</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
