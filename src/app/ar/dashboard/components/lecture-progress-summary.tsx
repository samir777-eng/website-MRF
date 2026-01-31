"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ClipboardList,
  FileQuestion,
  Trophy,
  Video,
} from "lucide-react";
import Link from "next/link";

// Mock data - will be replaced with real API data
const getMockProgressData = () => ({
  totalLectures: 6,
  completedLectures: 2,
  inProgressLectures: 2,
  lockedLectures: 2,
  overallProgress: 45,
  stepStats: {
    preQuizPassed: 4,
    videosCompleted: 18,
    totalVideos: 28,
    postQuizPassed: 2,
    homeworkCompleted: 2,
  },
  xpEarned: 1250,
  totalXpAvailable: 3000,
});

export function LectureProgressSummary() {
  const data = getMockProgressData();

  return (
    <Card className="border-emerald-500/20 bg-card/50 backdrop-blur">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">تقدم المحاضرات</h3>
              <p className="text-sm text-muted-foreground">
                {data.completedLectures} من {data.totalLectures} محاضرات مكتملة
              </p>
            </div>
          </div>
          <Link href="/ar/lectures">
            <Button variant="ghost" size="sm" className="gap-1">
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">التقدم الإجمالي</span>
            <span className="font-bold text-emerald-600">
              {data.overallProgress}%
            </span>
          </div>
          <Progress value={data.overallProgress} className="h-3" />
        </div>

        {/* Step Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-amber-500/10 rounded-lg text-center">
            <FileQuestion className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-amber-600">
              {data.stepStats.preQuizPassed}
            </div>
            <div className="text-xs text-muted-foreground">اختبار قبلي</div>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg text-center">
            <Video className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-600">
              {data.stepStats.videosCompleted}/{data.stepStats.totalVideos}
            </div>
            <div className="text-xs text-muted-foreground">فيديوهات</div>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg text-center">
            <ClipboardList className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-600">
              {data.stepStats.postQuizPassed}
            </div>
            <div className="text-xs text-muted-foreground">اختبار بعدي</div>
          </div>
          <div className="p-3 bg-green-500/10 rounded-lg text-center">
            <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-600">
              {data.stepStats.homeworkCompleted}
            </div>
            <div className="text-xs text-muted-foreground">واجبات</div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium">نقاط الخبرة المكتسبة</span>
            </div>
            <span className="text-lg font-bold text-yellow-600">
              {data.xpEarned.toLocaleString("ar-EG")} XP
            </span>
          </div>
          <Progress
            value={(data.xpEarned / data.totalXpAvailable) * 100}
            className="h-2"
          />
          <p className="text-xs text-muted-foreground mt-1 text-left">
            من أصل {data.totalXpAvailable.toLocaleString("ar-EG")} XP متاحة
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
