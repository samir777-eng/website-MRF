"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  Clock,
  Eye,
  Heart,
  Home,
  Lock,
  Play,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type GradeLevel = "1" | "2" | "3";
type LectureStatus = "upcoming" | "current" | "past" | "locked";
type LectureStep =
  | "pre-quiz"
  | "videos"
  | "post-quiz"
  | "homework"
  | "complete";
type AccessStatus = "not_purchased" | "purchased" | "activated" | "expired";

// Branch types for Arabic curriculum
type ArabicBranch = "النحو" | "البلاغة" | "الأدب" | "القراءة" | "التعبير";

interface LessonContent {
  id: string;
  title: string;
  branch: ArabicBranch;
  duration: number; // in minutes
}

interface LectureAccess {
  status: AccessStatus;
  daysRemaining?: number;
  hoursRemaining?: number;
  livesRemaining: number;
  maxLives: number;
  progress: number;
  preQuizPassed: boolean;
  preQuizRequired: boolean;
  currentStep: LectureStep;
  videosCompleted: number;
  totalVideos: number;
  postQuizPassed: boolean;
  homeworkCompleted: boolean;
}

interface Lecture {
  id: string;
  number: number; // Sequential lecture number
  gradeLevel: GradeLevel;
  scheduledDate: Date;
  status: LectureStatus;
  totalDuration: number; // in minutes
  // Content breakdown by branch
  lessons: LessonContent[];
  access?: LectureAccess;
}

// Branch colors and icons
const branchConfig: Record<
  ArabicBranch,
  { color: string; bgLight: string; bgDark: string }
> = {
  النحو: {
    color: "text-blue-600 dark:text-blue-400",
    bgLight: "bg-blue-100",
    bgDark: "dark:bg-blue-900/30",
  },
  البلاغة: {
    color: "text-purple-600 dark:text-purple-400",
    bgLight: "bg-purple-100",
    bgDark: "dark:bg-purple-900/30",
  },
  الأدب: {
    color: "text-amber-600 dark:text-amber-400",
    bgLight: "bg-amber-100",
    bgDark: "dark:bg-amber-900/30",
  },
  القراءة: {
    color: "text-green-600 dark:text-green-400",
    bgLight: "bg-green-100",
    bgDark: "dark:bg-green-900/30",
  },
  التعبير: {
    color: "text-pink-600 dark:text-pink-400",
    bgLight: "bg-pink-100",
    bgDark: "dark:bg-pink-900/30",
  },
};

export default function LecturesPage() {
  const userGrade: GradeLevel = "1";
  const [hoveredLecture, setHoveredLecture] = useState<string | null>(null);

  // Enhanced mock data with lesson content breakdown
  const lectures: Lecture[] = [
    {
      id: "1",
      number: 1,
      gradeLevel: "1",
      scheduledDate: new Date("2025-01-05"),
      status: "past",
      totalDuration: 120,
      lessons: [
        {
          id: "1-1",
          title: "الجملة الاسمية والفعلية",
          branch: "النحو",
          duration: 30,
        },
        { id: "1-2", title: "أركان الجملة", branch: "النحو", duration: 25 },
        {
          id: "1-3",
          title: "التشبيه وأركانه",
          branch: "البلاغة",
          duration: 35,
        },
        { id: "1-4", title: "قراءة نص أدبي", branch: "القراءة", duration: 30 },
      ],
      access: {
        status: "activated",
        daysRemaining: 5,
        hoursRemaining: 12,
        livesRemaining: 3,
        maxLives: 3,
        progress: 100,
        preQuizPassed: true,
        preQuizRequired: false,
        currentStep: "complete",
        videosCompleted: 4,
        totalVideos: 4,
        postQuizPassed: true,
        homeworkCompleted: true,
      },
    },
    {
      id: "2",
      number: 2,
      gradeLevel: "1",
      scheduledDate: new Date("2025-01-12"),
      status: "past",
      totalDuration: 150,
      lessons: [
        {
          id: "2-1",
          title: "الاستعارة المكنية",
          branch: "البلاغة",
          duration: 40,
        },
        {
          id: "2-2",
          title: "الاستعارة التصريحية",
          branch: "البلاغة",
          duration: 35,
        },
        { id: "2-3", title: "المبتدأ والخبر", branch: "النحو", duration: 40 },
        {
          id: "2-4",
          title: "الشعر الجاهلي - مقدمة",
          branch: "الأدب",
          duration: 35,
        },
      ],
      access: {
        status: "activated",
        daysRemaining: 2,
        hoursRemaining: 6,
        livesRemaining: 2,
        maxLives: 3,
        progress: 80,
        preQuizPassed: true,
        preQuizRequired: true,
        currentStep: "homework",
        videosCompleted: 4,
        totalVideos: 4,
        postQuizPassed: true,
        homeworkCompleted: false,
      },
    },
    {
      id: "3",
      number: 3,
      gradeLevel: "1",
      scheduledDate: new Date("2025-01-19"),
      status: "past",
      totalDuration: 180,
      lessons: [
        { id: "3-1", title: "معلقة امرئ القيس", branch: "الأدب", duration: 45 },
        {
          id: "3-2",
          title: "خصائص الشعر الجاهلي",
          branch: "الأدب",
          duration: 40,
        },
        {
          id: "3-3",
          title: "الكناية وأنواعها",
          branch: "البلاغة",
          duration: 35,
        },
        { id: "3-4", title: "تحليل نص شعري", branch: "القراءة", duration: 30 },
        {
          id: "3-5",
          title: "كتابة فقرة تحليلية",
          branch: "التعبير",
          duration: 30,
        },
      ],
      access: {
        status: "activated",
        daysRemaining: 0,
        hoursRemaining: 18,
        livesRemaining: 1,
        maxLives: 3,
        progress: 30,
        preQuizPassed: true,
        preQuizRequired: true,
        currentStep: "videos",
        videosCompleted: 2,
        totalVideos: 5,
        postQuizPassed: false,
        homeworkCompleted: false,
      },
    },
    {
      id: "4",
      number: 4,
      gradeLevel: "1",
      scheduledDate: new Date("2025-01-26"),
      status: "past",
      totalDuration: 135,
      lessons: [
        { id: "4-1", title: "الإعراب والبناء", branch: "النحو", duration: 45 },
        { id: "4-2", title: "علامات الإعراب", branch: "النحو", duration: 40 },
        { id: "4-3", title: "فهم المقروء", branch: "القراءة", duration: 50 },
      ],
      access: {
        status: "purchased",
        livesRemaining: 3,
        maxLives: 3,
        progress: 0,
        preQuizPassed: false,
        preQuizRequired: true,
        currentStep: "pre-quiz",
        videosCompleted: 0,
        totalVideos: 3,
        postQuizPassed: false,
        homeworkCompleted: false,
      },
    },
    {
      id: "5",
      number: 5,
      gradeLevel: "1",
      scheduledDate: new Date("2025-02-02"),
      status: "current",
      totalDuration: 165,
      lessons: [
        {
          id: "5-1",
          title: "التعبير الإبداعي",
          branch: "التعبير",
          duration: 40,
        },
        { id: "5-2", title: "كتابة المقال", branch: "التعبير", duration: 35 },
        { id: "5-3", title: "المجاز المرسل", branch: "البلاغة", duration: 45 },
        { id: "5-4", title: "أسلوب الشرط", branch: "النحو", duration: 45 },
      ],
      access: {
        status: "purchased",
        livesRemaining: 3,
        maxLives: 3,
        progress: 0,
        preQuizPassed: false,
        preQuizRequired: true,
        currentStep: "pre-quiz",
        videosCompleted: 0,
        totalVideos: 4,
        postQuizPassed: false,
        homeworkCompleted: false,
      },
    },
    {
      id: "6",
      number: 6,
      gradeLevel: "1",
      scheduledDate: new Date("2025-02-09"),
      status: "upcoming",
      totalDuration: 150,
      lessons: [
        { id: "6-1", title: "النواسخ الحرفية", branch: "النحو", duration: 40 },
        { id: "6-2", title: "النواسخ الفعلية", branch: "النحو", duration: 40 },
        { id: "6-3", title: "الصور البيانية", branch: "البلاغة", duration: 35 },
        { id: "6-4", title: "نص نثري حديث", branch: "الأدب", duration: 35 },
      ],
      access: {
        status: "not_purchased",
        livesRemaining: 0,
        maxLives: 3,
        progress: 0,
        preQuizPassed: false,
        preQuizRequired: true,
        currentStep: "pre-quiz",
        videosCompleted: 0,
        totalVideos: 4,
        postQuizPassed: false,
        homeworkCompleted: false,
      },
    },
  ];

  // Filter by user's grade
  const gradeLectures = lectures.filter((l) => l.gradeLevel === userGrade);

  // Get unique branches for a lecture
  const getBranches = (lessons: LessonContent[]): ArabicBranch[] => {
    return [...new Set(lessons.map((l) => l.branch))];
  };

  // Group lessons by branch
  const groupByBranch = (lessons: LessonContent[]) => {
    return lessons.reduce(
      (acc, lesson) => {
        if (!acc[lesson.branch]) acc[lesson.branch] = [];
        acc[lesson.branch].push(lesson);
        return acc;
      },
      {} as Record<ArabicBranch, LessonContent[]>
    );
  };

  // Convert number to Arabic numeral
  const toArabicNumeral = (num: number): string => {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((d) => arabicNumerals[parseInt(d)])
      .join("");
  };

  // Calculate overall course progress
  const completedLectures = gradeLectures.filter(
    (l) => l.access?.currentStep === "complete"
  ).length;
  const overallProgress = Math.round(
    (completedLectures / gradeLectures.length) * 100
  );

  const getGradeLabel = (grade: GradeLevel) => {
    const labels = { "1": "الأول", "2": "الثاني", "3": "الثالث" };
    return labels[grade];
  };

  // Circular progress component
  const CircularProgress = ({
    progress,
    size = 48,
  }: {
    progress: number;
    size?: number;
  }) => {
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="text-muted stroke-current"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-green-500 stroke-current transition-all duration-500"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold">{progress}%</span>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background pb-24" dir="rtl">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link
              href="/ar/dashboard"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Link>
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span className="text-foreground font-medium">المحاضرات</span>
          </nav>

          {/* Header */}
          <motion.header
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      المحاضرات
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      الصف {getGradeLabel(userGrade)} الثانوي
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/ar/store?tab=bundles">
                <Button variant="outline" size="sm" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  شراء باقة
                </Button>
              </Link>
            </div>

            {/* Overall Progress */}
            <Card className="mt-6 border-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      تقدمك الكلي
                    </p>
                    <p className="text-lg font-bold">
                      {completedLectures} من {gradeLectures.length} محاضرات
                      مكتملة
                    </p>
                  </div>
                  <CircularProgress progress={overallProgress} size={56} />
                </div>
                <Progress value={overallProgress} className="h-2 mt-3" />
              </CardContent>
            </Card>
          </motion.header>

          {/* Lectures List */}
          <div className="space-y-4">
            {gradeLectures.map((lecture, index) => {
              const branches = getBranches(lecture.lessons);
              const groupedLessons = groupByBranch(lecture.lessons);
              const isComplete = lecture.access?.currentStep === "complete";
              const isLocked = lecture.access?.status === "not_purchased";
              const isCurrent = lecture.status === "current";
              const isHovered = hoveredLecture === lecture.id;

              return (
                <motion.div
                  key={lecture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`relative overflow-hidden transition-all duration-300 ${
                      isCurrent
                        ? "border-2 border-indigo-500 shadow-lg shadow-indigo-500/10"
                        : isComplete
                          ? "border-green-500/30 bg-green-500/5"
                          : isLocked
                            ? "opacity-75"
                            : "hover:shadow-md hover:border-indigo-500/30"
                    }`}
                    onMouseEnter={() => setHoveredLecture(lecture.id)}
                    onMouseLeave={() => setHoveredLecture(null)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Lecture Number */}
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 ${
                            isComplete
                              ? "bg-green-500 text-white"
                              : isCurrent
                                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                                : isLocked
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle className="w-7 h-7" />
                          ) : isLocked ? (
                            <Lock className="w-6 h-6" />
                          ) : (
                            toArabicNumeral(lecture.number)
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <h3 className="text-lg font-bold">
                                محاضرة {toArabicNumeral(lecture.number)}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {lecture.totalDuration} دقيقة
                                </span>
                                <span className="flex items-center gap-1">
                                  <Video className="w-3.5 h-3.5" />
                                  {lecture.lessons.length} دروس
                                </span>
                              </div>
                            </div>

                            {/* Status Badge */}
                            {isCurrent && (
                              <Badge className="bg-indigo-500 text-white shrink-0">
                                المحاضرة الحالية
                              </Badge>
                            )}
                            {isComplete && (
                              <Badge className="bg-green-500 text-white shrink-0">
                                مكتملة
                              </Badge>
                            )}
                          </div>

                          {/* Branch badges */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {branches.map((branch) => {
                              const config = branchConfig[branch];
                              const lessonCount =
                                groupedLessons[branch]?.length || 0;
                              return (
                                <Tooltip key={branch}>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="secondary"
                                      className={`${config.bgLight} ${config.bgDark} ${config.color} text-xs cursor-help`}
                                    >
                                      {branch} ({lessonCount})
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="bottom"
                                    className="max-w-xs"
                                  >
                                    <div className="space-y-1">
                                      <p className="font-medium text-sm">
                                        {branch}
                                      </p>
                                      {groupedLessons[branch]?.map((lesson) => (
                                        <p
                                          key={lesson.id}
                                          className="text-xs text-muted-foreground"
                                        >
                                          • {lesson.title} ({lesson.duration} د)
                                        </p>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>

                          {/* Progress for activated lectures */}
                          {lecture.access &&
                            lecture.access.status === "activated" && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    التقدم
                                  </span>
                                  <span className="font-medium">
                                    {lecture.access.progress}%
                                  </span>
                                </div>
                                <Progress
                                  value={lecture.access.progress}
                                  className="h-1.5"
                                />

                                {/* Time & Lives */}
                                <div className="flex items-center justify-between mt-2">
                                  <div
                                    className={`flex items-center gap-1.5 text-xs ${
                                      lecture.access.daysRemaining === 0
                                        ? "text-rose-600"
                                        : lecture.access.daysRemaining &&
                                            lecture.access.daysRemaining <= 2
                                          ? "text-amber-600"
                                          : "text-muted-foreground"
                                    }`}
                                  >
                                    <Clock className="w-3.5 h-3.5" />
                                    {lecture.access.daysRemaining &&
                                    lecture.access.daysRemaining > 0
                                      ? `${lecture.access.daysRemaining} يوم متبقي`
                                      : `${lecture.access.hoursRemaining} ساعة متبقية`}
                                  </div>
                                  <div className="flex items-center gap-0.5">
                                    {[...Array(lecture.access.maxLives)].map(
                                      (_, i) => (
                                        <Heart
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < lecture.access!.livesRemaining
                                              ? "text-rose-500 fill-rose-500"
                                              : "text-muted-foreground/30"
                                          }`}
                                        />
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                          {/* Purchased but not started */}
                          {lecture.access?.status === "purchased" && (
                            <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                              <AlertCircle className="w-4 h-4" />
                              <span>جاهزة للتفعيل</span>
                            </div>
                          )}
                        </div>

                        {/* Action */}
                        <div className="shrink-0">
                          {isLocked ? (
                            <Link href="/ar/store?tab=bundles">
                              <Button variant="outline" size="sm">
                                شراء
                              </Button>
                            </Link>
                          ) : (
                            <Link href={`/ar/lectures/${lecture.id}`}>
                              <Button
                                size="sm"
                                className={
                                  isComplete
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                }
                              >
                                {isComplete ? (
                                  <>
                                    <Eye className="w-4 h-4 me-1" />
                                    مراجعة
                                  </>
                                ) : lecture.access?.progress &&
                                  lecture.access.progress > 0 ? (
                                  <>
                                    <Play className="w-4 h-4 me-1" />
                                    متابعة
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4 me-1" />
                                    ابدأ
                                  </>
                                )}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Expanded content preview on hover */}
                      <AnimatePresence>
                        {isHovered && !isLocked && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 mt-4 border-t border-border/50">
                              <p className="text-sm font-medium mb-3 text-muted-foreground">
                                محتوى المحاضرة:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.entries(groupedLessons).map(
                                  ([branch, lessons]) => {
                                    const config =
                                      branchConfig[branch as ArabicBranch];
                                    return (
                                      <div
                                        key={branch}
                                        className={`p-3 rounded-lg ${config.bgLight} ${config.bgDark}`}
                                      >
                                        <p
                                          className={`text-sm font-medium mb-2 ${config.color}`}
                                        >
                                          {branch}
                                        </p>
                                        <ul className="space-y-1">
                                          {lessons.map((lesson) => (
                                            <li
                                              key={lesson.id}
                                              className="text-xs text-muted-foreground flex items-center gap-1.5"
                                            >
                                              <span className="w-1 h-1 rounded-full bg-current shrink-0" />
                                              {lesson.title}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Stats */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              {gradeLectures.length} محاضرة • الصف {getGradeLabel(userGrade)}{" "}
              الثانوي
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
