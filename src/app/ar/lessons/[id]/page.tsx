"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SafeHtmlContent } from "@/components/ui/safe-html-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Lock,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type GradeLevel = "1" | "2" | "3";
type LessonStatus = "locked" | "available" | "in-progress" | "completed";
type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

interface Lesson {
  id: string;
  lectureId: string;
  title: string;
  description: string;
  order: number;
  videoDuration: number;
  notes: string;
  status: LessonStatus;
}

interface Lecture {
  id: string;
  title: string;
  weekNumber: number;
  gradeLevel: GradeLevel;
}

interface LessonProgress {
  lastWatchedPosition: number;
  watchedPercentage: number;
  isCompleted: boolean;
}

function LessonContent() {
  const params = useParams();
  const lessonId = (params?.id as string) || "1";
  const videoRef = useRef<HTMLDivElement>(null);
  const userGrade: GradeLevel = "1";
  const [isMounted, setIsMounted] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Prevent state updates after unmount
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const lesson: Lesson = {
    id: lessonId,
    lectureId: "5",
    title: "مقدمة في الكتابة الإبداعية",
    description: "التعرف على أساسيات الكتابة الإبداعية وأنواعها المختلفة",
    order: 1,
    videoDuration: 1500,
    notes: `# مقدمة في الكتابة الإبداعية\n\n## ما هي الكتابة الإبداعية؟\n\nالكتابة الإبداعية هي فن التعبير عن الأفكار والمشاعر بطريقة فنية جميلة.\n\n### أنواع الكتابة الإبداعية:\n\n1. **القصة القصيرة**\n2. **الرواية**\n3. **الشعر**\n4. **المقال الأدبي**`,
    status: "available",
  };

  const lecture: Lecture = {
    id: "5",
    title: "التعبير والإنشاء - الكتابة الإبداعية",
    weekNumber: 5,
    gradeLevel: "1",
  };

  const progress: LessonProgress = {
    lastWatchedPosition: 0,
    watchedPercentage: 0,
    isCompleted: false,
  };

  const navigation: {
    previousLesson: { id: string; title: string; status: LessonStatus } | null;
    nextLesson: { id: string; title: string; status: LessonStatus } | null;
  } = {
    previousLesson: null,
    nextLesson: {
      id: "2",
      title: "عناصر القصة القصيرة",
      status: "locked" as LessonStatus,
    },
  };

  useEffect(() => {
    setDuration(lesson.videoDuration);
    setCurrentTime(progress.lastWatchedPosition);
  }, [lesson.videoDuration, progress.lastWatchedPosition]);

  useEffect(() => {
    if (isPlaying && isMounted) {
      const timer = setTimeout(() => {
        if (isMounted) {
          setShowControls(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowControls(true);
    }
  }, [isPlaying, showControls, isMounted]);

  useEffect(() => {
    if (isPlaying && isMounted) {
      const interval = setInterval(() => {
        if (isMounted) {
          setCurrentTime((prev) => Math.min(prev + 1, duration));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration, isMounted]);

  useEffect(() => {
    if (duration <= 0) return;
    const watchedPercentage = (currentTime / duration) * 100;
    if (watchedPercentage >= 80 && !progress.isCompleted) {
      console.log("Lesson completed!");
    }
  }, [currentTime, duration, progress.isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(percentage * duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const skipForward = () =>
    setCurrentTime(Math.min(currentTime + 10, duration));
  const skipBackward = () => setCurrentTime(Math.max(currentTime - 10, 0));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasGradeAccess = lecture.gradeLevel === userGrade;
  const canAccessLesson = hasGradeAccess && lesson.status !== "locked";

  if (!hasGradeAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <Lock className="w-20 h-20 text-red-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">غير مصرح بالوصول</h2>
            <p className="text-muted-foreground mb-6">
              هذا الدرس غير متاح لصفك الدراسي
            </p>
            <Link
              href="/ar/lectures"
              className="block w-full"
              style={{ minHeight: "44px" }}
            >
              <Button className="w-full h-full">العودة إلى المحاضرات</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canAccessLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <Lock className="w-20 h-20 text-orange-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">الدرس مغلق</h2>
            <p className="text-muted-foreground mb-6">
              يجب إكمال الدرس السابق أولاً للوصول إلى هذا الدرس
            </p>
            <Link
              href={`/ar/lectures/${lesson.lectureId}`}
              className="block w-full"
              style={{ minHeight: "44px" }}
            >
              <Button className="w-full h-full">العودة إلى المحاضرة</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/ar/lectures"
            className="hover:text-foreground transition-colors"
          >
            المحاضرات
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <Link
            href={`/ar/lectures/${lecture.id}`}
            className="hover:text-foreground transition-colors"
          >
            الأسبوع {lecture.weekNumber}
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-foreground">الدرس {lesson.order}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div
                ref={videoRef}
                className="relative bg-black aspect-video cursor-pointer"
                onMouseMove={() => setShowControls(true)}
                onClick={handlePlayPause}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                  <div className="text-center">
                    {isPlaying ? (
                      <Pause className="w-20 h-20 text-white opacity-80 mx-auto mb-4" />
                    ) : (
                      <Play className="w-20 h-20 text-white opacity-80 mx-auto mb-4" />
                    )}
                    <p className="text-white text-lg">مشغل الفيديو</p>
                    <p className="text-white/60 text-sm mt-2">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </p>
                  </div>
                </div>

                {showControls && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4">
                    <div className="mb-4">
                      <div
                        className="w-full h-1 bg-white/30 rounded-full cursor-pointer hover:h-2 transition-all"
                        onClick={handleSeek}
                      >
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause();
                          }}
                          aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                          title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6" aria-hidden="true" />
                          ) : (
                            <Play className="w-6 h-6" aria-hidden="true" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            skipBackward();
                          }}
                          aria-label="رجوع 10 ثواني"
                          title="رجوع 10 ثواني"
                        >
                          <SkipBack className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            skipForward();
                          }}
                          aria-label="تقديم 10 ثواني"
                          title="تقديم 10 ثواني"
                        >
                          <SkipForward className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMute();
                            }}
                            aria-label={
                              isMuted || volume === 0
                                ? "تشغيل الصوت"
                                : "كتم الصوت"
                            }
                            title={
                              isMuted || volume === 0
                                ? "تشغيل الصوت"
                                : "كتم الصوت"
                            }
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX className="w-5 h-5" aria-hidden="true" />
                            ) : (
                              <Volume2 className="w-5 h-5" aria-hidden="true" />
                            )}
                          </Button>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            onClick={(e) => e.stopPropagation()}
                            className="w-20 bg-white/30 rounded-lg appearance-none cursor-pointer"
                            style={{ minHeight: "44px" }}
                            aria-label="مستوى الصوت"
                          />
                        </div>
                        <span className="text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowSettings(!showSettings);
                            }}
                            aria-label="الإعدادات"
                            title="الإعدادات"
                            aria-expanded={showSettings}
                          >
                            <Settings className="w-5 h-5" aria-hidden="true" />
                          </Button>
                          {showSettings && (
                            <div
                              className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-3 min-w-[150px]"
                              role="menu"
                            >
                              <div className="text-sm space-y-2">
                                <div className="font-bold mb-2">السرعة</div>
                                {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(
                                  (speed) => (
                                    <button
                                      key={speed}
                                      className={`block w-full text-right px-2 py-1 rounded hover:bg-white/20 ${playbackSpeed === speed ? "bg-white/20" : ""}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPlaybackSpeed(
                                          speed as PlaybackSpeed
                                        );
                                      }}
                                      role="menuitem"
                                      aria-label={`سرعة ${speed}x`}
                                    >
                                      {speed}x
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFullscreen();
                          }}
                          aria-label={
                            isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"
                          }
                          title={
                            isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"
                          }
                        >
                          {isFullscreen ? (
                            <Minimize className="w-5 h-5" aria-hidden="true" />
                          ) : (
                            <Maximize className="w-5 h-5" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge>الدرس {lesson.order}</Badge>
                      <Badge variant="outline">
                        {formatTime(lesson.videoDuration)}
                      </Badge>
                      {progress.isCompleted && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="w-3 h-3 ml-1" />
                          مكتمل
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                    <p className="text-muted-foreground mt-2">
                      {lesson.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">التقدم</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <Tabs defaultValue="notes" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="notes">
                    <BookOpen className="w-4 h-4 ml-2" />
                    ملاحظات الدرس
                  </TabsTrigger>
                  <TabsTrigger value="materials">
                    <FileText className="w-4 h-4 ml-2" />
                    المواد
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="notes" className="p-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <SafeHtmlContent html={lesson.notes} />
                  </div>
                </TabsContent>
                <TabsContent value="materials" className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">ملخص الدرس.pdf</div>
                          <div className="text-sm text-muted-foreground">
                            2.5 MB
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 ml-2" />
                        تحميل
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">التنقل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {navigation.previousLesson ? (
                  <Link href={`/ar/lessons/${navigation.previousLesson.id}`}>
                    <Button variant="outline" className="w-full justify-start">
                      <ChevronRight className="w-4 h-4 ml-2" />
                      الدرس السابق
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    disabled
                  >
                    <ChevronRight className="w-4 h-4 ml-2" />
                    لا يوجد درس سابق
                  </Button>
                )}
                {navigation.nextLesson ? (
                  navigation.nextLesson.status === "locked" ? (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled
                    >
                      <Lock className="w-4 h-4 ml-2" />
                      الدرس التالي (مغلق)
                    </Button>
                  ) : (
                    <Link href={`/ar/lessons/${navigation.nextLesson.id}`}>
                      <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        الدرس التالي
                        <ChevronLeft className="w-4 h-4 mr-2" />
                      </Button>
                    </Link>
                  )
                ) : (
                  <Link
                    href={`/ar/lectures/${lesson.lectureId}`}
                    className="block w-full"
                    style={{ minHeight: "44px" }}
                  >
                    <Button className="w-full h-full justify-start bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                      <CheckCircle className="w-4 h-4 ml-2" />
                      إنهاء المحاضرة
                    </Button>
                  </Link>
                )}
                <Link
                  href={`/ar/lectures/${lesson.lectureId}`}
                  className="block w-full"
                  style={{ minHeight: "44px" }}
                >
                  <Button variant="ghost" className="w-full h-full">
                    العودة إلى المحاضرة
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">إحصائيات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">وقت المشاهدة</span>
                  </div>
                  <span className="font-bold">{formatTime(currentTime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">نسبة الإكمال</span>
                  </div>
                  <span className="font-bold">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LessonPage() {
  return (
    <ErrorBoundary>
      <LessonContent />
    </ErrorBoundary>
  );
}
