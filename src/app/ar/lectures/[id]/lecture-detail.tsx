"use client";

import {
  LectureCompletionModal,
  LectureProgressTracker,
  type LectureProgress,
} from "@/components/lectures";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLectureProgress } from "@/hooks/useLectureProgress";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Heart,
  Lock,
  Play,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type GradeLevel = "1" | "2" | "3";
type VideoStatus = "locked" | "available" | "in-progress" | "completed";

interface VideoItem {
  id: string;
  title: string;
  duration: number;
  status: VideoStatus;
  progress: number;
}

interface LectureData {
  id: string;
  title: string;
  description: string;
  lectureNumber: number;
  gradeLevel: GradeLevel;
  scheduledDate: Date;
  videos: VideoItem[];
  xpReward: number;
  // Access state
  daysRemaining: number;
  hoursRemaining: number;
  livesRemaining: number;
  maxLives: number;
}

// Function to get mock lecture data (to avoid hydration mismatch with Date)
function getMockLecture(): LectureData {
  return {
    id: "5",
    title: "النحو والصرف - المبتدأ والخبر",
    description: "شرح مفصل للمبتدأ والخبر وأنواعهما وإعرابهما",
    lectureNumber: 5,
    gradeLevel: "1",
    scheduledDate: new Date("2024-12-09"),
    xpReward: 150,
    daysRemaining: 5,
    hoursRemaining: 12,
    livesRemaining: 3,
    maxLives: 3,
    videos: [
      {
        id: "v1",
        title: "مقدمة في المبتدأ والخبر",
        duration: 15,
        status: "completed",
        progress: 100,
      },
      {
        id: "v2",
        title: "أنواع المبتدأ",
        duration: 20,
        status: "completed",
        progress: 100,
      },
      {
        id: "v3",
        title: "أنواع الخبر",
        duration: 25,
        status: "in-progress",
        progress: 45,
      },
      {
        id: "v4",
        title: "تقديم الخبر على المبتدأ",
        duration: 18,
        status: "available",
        progress: 0,
      },
      {
        id: "v5",
        title: "تمارين تطبيقية",
        duration: 22,
        status: "locked",
        progress: 0,
      },
    ],
  };
}

export default function LectureDetailPage() {
  const params = useParams();
  const lectureId = params.id as string;
  const userGrade: GradeLevel = "1";

  const lecture = getMockLecture();
  const totalVideos = lecture.videos.length;

  // Use the lecture progress hook
  const {
    progress: lectureProgressData,
    isLoaded,
    getCompletionPercentage,
    isLectureCompleted,
    resetProgress: resetLectureProgress,
  } = useLectureProgress(lectureId, totalVideos);

  // Convert hook progress to LectureProgress format for the tracker component
  const [progress, setProgress] = useState<LectureProgress>({
    preQuizPassed: false,
    videosCompleted: 0,
    videosTotal: totalVideos,
    postQuizPassed: false,
    homeworkCompleted: false,
  });

  // Update progress when lectureProgressData changes
  useEffect(() => {
    if (isLoaded) {
      setProgress({
        preQuizPassed: lectureProgressData.preQuizCompleted,
        videosCompleted: lectureProgressData.videosWatched.length,
        videosTotal: totalVideos,
        postQuizPassed: lectureProgressData.postQuizCompleted,
        homeworkCompleted: lectureProgressData.homeworkCompleted,
      });
    }
  }, [lectureProgressData, isLoaded, totalVideos]);

  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Check grade access
  const hasGradeAccess = lecture.gradeLevel === userGrade;

  // Calculate overall progress from actual localStorage data
  const completedVideos = lectureProgressData.videosWatched.length;
  const allVideosCompleted =
    lectureProgressData.allVideosCompleted || completedVideos >= totalVideos;
  const overallProgress = Math.round(
    (progress.preQuizPassed ? 25 : 0) +
      (completedVideos / totalVideos) * 25 +
      (progress.postQuizPassed ? 25 : 0) +
      (progress.homeworkCompleted ? 25 : 0),
  );

  // Check if lecture is complete
  const isLectureComplete =
    progress.preQuizPassed &&
    allVideosCompleted &&
    progress.postQuizPassed &&
    progress.homeworkCompleted;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getVideoStatusBadge = (status: VideoStatus) => {
    const badges = {
      locked: {
        label: "مغلق",
        icon: Lock,
        className:
          "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      },
      available: {
        label: "متاح",
        icon: Play,
        className:
          "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      },
      "in-progress": {
        label: "جاري",
        icon: Clock,
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      },
      completed: {
        label: "مكتمل",
        icon: CheckCircle,
        className:
          "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
      },
    };
    return badges[status];
  };

  // Grade mismatch
  if (!hasGradeAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              غير مصرح بالوصول
            </h2>
            <p className="text-muted-foreground mb-6">
              هذه المحاضرة مخصصة لصف آخر.
            </p>
            <Link href="/ar/lectures">
              <Button className="w-full">
                <ChevronRight className="w-4 h-4 ms-2" />
                العودة إلى المحاضرات
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-8 md:py-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/ar/lectures"
            className="hover:text-foreground transition-colors"
          >
            المحاضرات
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-foreground">
            محاضرة {lecture.lectureNumber}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  محاضرة {lecture.lectureNumber}
                </Badge>
                <Badge variant="outline">
                  الصف{" "}
                  {userGrade === "1"
                    ? "الأول"
                    : userGrade === "2"
                      ? "الثاني"
                      : "الثالث"}{" "}
                  الثانوي
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {lecture.title}
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {lecture.description}
              </p>
            </div>
          </div>

          {/* Access Info - Lives & Timer */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {formatDate(lecture.scheduledDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {lecture.daysRemaining} أيام و {lecture.hoursRemaining} ساعة
                متبقية
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(lecture.maxLives)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 ${i < lecture.livesRemaining ? "text-rose-500 fill-rose-500" : "text-muted-foreground/30"}`}
                />
              ))}
              <span className="text-sm me-2">
                {lecture.livesRemaining} أرواح
              </span>
            </div>
          </div>
        </div>

        {/* 4-Step Progress Tracker */}
        <Card className="mb-8 border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  تقدمك في المحاضرة
                </h3>
                <p className="text-sm text-muted-foreground">
                  {overallProgress}% مكتمل
                </p>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {overallProgress}%
              </div>
            </div>
            <Progress value={overallProgress} className="h-3 mb-6" />
            <LectureProgressTracker progress={progress} />
          </CardContent>
        </Card>

        {/* Step 1: Pre-Quiz */}
        <Card
          className={`mb-4 border-0 shadow-lg ${progress.preQuizPassed ? "bg-green-50/50 dark:bg-green-950/10" : "bg-orange-50/50 dark:bg-orange-950/10"}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${progress.preQuizPassed ? "bg-green-500" : "bg-orange-500"}`}
                >
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    الخطوة 1: الاختبار القبلي
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {progress.preQuizPassed
                      ? "تم اجتياز الاختبار بنجاح ✓"
                      : "يجب اجتياز الاختبار لفتح الفيديوهات"}
                  </p>
                </div>
              </div>
              {progress.preQuizPassed ? (
                <Badge className="bg-green-500 text-white">مكتمل</Badge>
              ) : (
                <Link href={`/ar/lectures/${lectureId}/pre-quiz`}>
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                    <Play className="w-4 h-4 ms-2" />
                    ابدأ الاختبار
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Videos */}
        <Card
          className={`mb-4 border-0 shadow-lg ${!progress.preQuizPassed ? "opacity-60" : ""}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${allVideosCompleted ? "bg-green-500" : progress.preQuizPassed ? "bg-blue-500" : "bg-muted"}`}
                >
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">الخطوة 2: الفيديوهات</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedVideos}/{totalVideos} فيديو مكتمل
                  </p>
                </div>
              </div>
              {allVideosCompleted && (
                <Badge className="bg-green-500 text-white">مكتمل</Badge>
              )}
            </div>

            {/* Videos List */}
            {progress.preQuizPassed && (
              <div className="space-y-3 mt-4">
                {lecture.videos.map((video, idx) => {
                  // Determine video status based on actual progress
                  const isVideoWatched =
                    lectureProgressData.videosWatched.includes(video.id);
                  const actualStatus: VideoStatus = isVideoWatched
                    ? "completed"
                    : "available";
                  const badge = getVideoStatusBadge(actualStatus);
                  const StatusIcon = badge.icon;
                  const canWatch = progress.preQuizPassed;

                  return (
                    <div
                      key={video.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${canWatch ? "border-border hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer" : "border-muted opacity-60"}`}
                    >
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-sm font-medium">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{video.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Video className="w-3 h-3" />
                          <span>{video.duration} دقيقة</span>
                        </div>
                      </div>
                      <Badge className={badge.className}>
                        <StatusIcon className="w-3 h-3 ms-1" />
                        {badge.label}
                      </Badge>
                      {canWatch && (
                        <Link
                          href={`/ar/lectures/${lectureId}/videos/${video.id}`}
                        >
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          >
                            {isVideoWatched ? "مراجعة" : "شاهد"}
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Post-Quiz */}
        <Card
          className={`mb-4 border-0 shadow-lg ${!allVideosCompleted ? "opacity-60" : progress.postQuizPassed ? "bg-green-50/50 dark:bg-green-950/10" : "bg-blue-50/50 dark:bg-blue-950/10"}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${progress.postQuizPassed ? "bg-green-500" : allVideosCompleted ? "bg-blue-500" : "bg-muted"}`}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    الخطوة 3: الاختبار البعدي
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {progress.postQuizPassed
                      ? "تم اجتياز الاختبار ✓"
                      : !allVideosCompleted
                        ? `أكمل جميع الفيديوهات أولاً (${completedVideos}/${totalVideos})`
                        : "اختبر فهمك للمحاضرة"}
                  </p>
                </div>
              </div>
              {progress.postQuizPassed ? (
                <Badge className="bg-green-500 text-white">مكتمل</Badge>
              ) : allVideosCompleted ? (
                <Link href={`/ar/lectures/${lectureId}/post-quiz`}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Play className="w-4 h-4 ms-2" />
                    ابدأ الاختبار
                  </Button>
                </Link>
              ) : (
                <Badge variant="outline">
                  <Lock className="w-3 h-3 ms-1" />
                  مغلق
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Homework */}
        <Card
          className={`mb-8 border-0 shadow-lg ${!progress.postQuizPassed ? "opacity-60" : progress.homeworkCompleted ? "bg-green-50/50 dark:bg-green-950/10" : "bg-emerald-50/50 dark:bg-emerald-950/10"}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${progress.homeworkCompleted ? "bg-green-500" : progress.postQuizPassed ? "bg-emerald-500" : "bg-muted"}`}
                >
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    الخطوة 4: الواجب المنزلي
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {progress.homeworkCompleted
                      ? "تم إكمال الواجب ✓"
                      : !progress.postQuizPassed
                        ? "أكمل الاختبار البعدي أولاً"
                        : "أكمل الواجب لإتمام المحاضرة"}
                  </p>
                </div>
              </div>
              {progress.homeworkCompleted ? (
                <Badge className="bg-green-500 text-white">مكتمل</Badge>
              ) : progress.postQuizPassed ? (
                <Link href={`/ar/lectures/${lectureId}/homework`}>
                  <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
                    <Play className="w-4 h-4 ms-2" />
                    ابدأ الواجب
                  </Button>
                </Link>
              ) : (
                <Badge variant="outline">
                  <Lock className="w-3 h-3 ms-1" />
                  مغلق
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Completion Card */}
        {isLectureComplete && (
          <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-400">
                    أحسنت! أكملت المحاضرة بنجاح
                  </h3>
                  <p className="text-green-600/80 dark:text-green-300/80">
                    حصلت على {lecture.xpReward} XP
                  </p>
                </div>
                <Link href="/ar/lectures">
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                    المحاضرة التالية
                    <ChevronLeft className="w-4 h-4 me-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Development: Reset Progress Button */}
        {process.env.NODE_ENV === "development" && (
          <Card className="mt-4 border-dashed border-2 border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  <strong>وضع التطوير:</strong> إعادة تعيين تقدم المحاضرة
                  للاختبار
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetLectureProgress}
                  className="border-orange-400 text-orange-700 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/30"
                >
                  إعادة تعيين التقدم
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completion Modal */}
      <LectureCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        lectureTitle={lecture.title}
        lectureNumber={lecture.lectureNumber}
        xpEarned={lecture.xpReward}
        nextLectureId="6"
        nextLectureTitle="المفعول به"
      />
    </div>
  );
}
