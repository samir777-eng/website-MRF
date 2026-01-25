"use client";

import { LivesPurchaseModal } from "@/components/lectures";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Heart,
  Lock,
  Maximize,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type VideoStatus = "locked" | "available" | "in-progress" | "completed";

interface VideoData {
  id: string;
  title: string;
  duration: number; // in seconds
  status: VideoStatus;
  thumbnailUrl?: string;
}

interface LectureAccess {
  lectureId: string;
  daysRemaining: number;
  hoursRemaining: number;
  livesRemaining: number;
  maxLives: number;
  isFirstWatch: boolean; // True if within first 7 days
  requiresLife: boolean; // True if rewatching after 7 days
}

// Mock video data
function getMockVideo(videoId: string): VideoData {
  const videos: Record<string, VideoData> = {
    v1: {
      id: "v1",
      title: "مقدمة في المبتدأ والخبر",
      duration: 900,
      status: "completed",
    },
    v2: {
      id: "v2",
      title: "أنواع المبتدأ",
      duration: 1200,
      status: "completed",
    },
    v3: {
      id: "v3",
      title: "أنواع الخبر",
      duration: 1500,
      status: "in-progress",
    },
    v4: {
      id: "v4",
      title: "تقديم الخبر على المبتدأ",
      duration: 1080,
      status: "available",
    },
    v5: { id: "v5", title: "تمارين تطبيقية", duration: 1320, status: "locked" },
  };
  return videos[videoId] || videos.v1;
}

// Mock lecture access data
function getMockAccess(lectureId: string): LectureAccess {
  return {
    lectureId,
    daysRemaining: 5,
    hoursRemaining: 12,
    livesRemaining: 2,
    maxLives: 3,
    isFirstWatch: false, // Set to false to show lives system
    requiresLife: true,
  };
}

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params.id as string;
  const videoId = params.videoId as string;

  const [video, setVideo] = useState<VideoData | null>(null);
  const [access, setAccess] = useState<LectureAccess | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showLifeWarning, setShowLifeWarning] = useState(false);
  const [lifeUsed, setLifeUsed] = useState(false);
  const [noLivesLeft, setNoLivesLeft] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Load data on mount
  useEffect(() => {
    const videoData = getMockVideo(videoId);
    const accessData = getMockAccess(lectureId);
    setVideo(videoData);
    setAccess(accessData);

    // Check if life is required and show warning
    if (accessData.requiresLife && !accessData.isFirstWatch) {
      if (accessData.livesRemaining <= 0) {
        setNoLivesLeft(true);
      } else {
        setShowLifeWarning(true);
      }
    }
  }, [lectureId, videoId]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handleUseLife = () => {
    if (access && access.livesRemaining > 0) {
      setAccess({ ...access, livesRemaining: access.livesRemaining - 1 });
      setLifeUsed(true);
      setShowLifeWarning(false);
    }
  };

  const handleCancel = () => {
    router.push(`/ar/lectures/${lectureId}`);
  };

  const handlePurchaseLives = (livesAdded: number) => {
    if (access) {
      setAccess({
        ...access,
        livesRemaining: access.livesRemaining + livesAdded,
      });
      setNoLivesLeft(false);
      setShowPurchaseModal(false);
      // Show life warning to use one of the newly purchased lives
      setShowLifeWarning(true);
    }
  };

  if (!video || !access) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const progress =
    video.duration > 0 ? (currentTime / video.duration) * 100 : 0;

  // No lives left - blocked
  if (noLivesLeft) {
    return (
      <div
        className="min-h-screen page-bg-purple flex items-center justify-center p-6"
        dir="rtl"
      >
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-10 h-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">نفدت الأرواح</h2>
              <p className="text-muted-foreground">
                لا يمكنك مشاهدة الفيديو لأنه لا توجد أرواح متبقية. يمكنك شراء
                أرواح إضافية للاستمرار.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
              >
                العودة للمحاضرة
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600"
                onClick={() => setShowPurchaseModal(true)}
              >
                <Heart className="w-4 h-4 ml-2" />
                شراء أرواح
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lives Purchase Modal */}
        <LivesPurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          onPurchaseComplete={handlePurchaseLives}
          lectureId={lectureId}
          currentLives={access.livesRemaining}
          maxLives={access.maxLives}
          userCoins={150}
        />
      </div>
    );
  }

  // Life warning modal
  if (showLifeWarning && !lifeUsed) {
    return (
      <div
        className="min-h-screen page-bg-purple flex items-center justify-center p-6"
        dir="rtl"
      >
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">إعادة مشاهدة الفيديو</h2>
              <p className="text-muted-foreground">
                انتهت فترة المشاهدة المجانية (7 أيام). مشاهدة هذا الفيديو
                ستستهلك روحًا واحدة.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">
                الأرواح المتبقية:
              </span>
              {[...Array(access.maxLives)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 ${
                    i < access.livesRemaining
                      ? "text-rose-500 fill-rose-500"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
              >
                إلغاء
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600"
                onClick={handleUseLife}
              >
                <Heart className="w-4 h-4 ml-2" />
                استخدم روح للمشاهدة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main video player
  return (
    <div className="min-h-screen bg-black" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <Link href={`/ar/lectures/${lectureId}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للمحاضرة
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
              {[...Array(access.maxLives)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${
                    i < access.livesRemaining
                      ? "text-rose-500 fill-rose-500"
                      : "text-white/30"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full text-white text-sm">
              <Clock className="w-4 h-4" />
              <span>
                {access.daysRemaining}د {access.hoursRemaining}س
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Area */}
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="w-full max-w-5xl aspect-video bg-zinc-900 rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <Play className="w-20 h-20 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-medium mb-2">{video.title}</h2>
            <p className="text-white/60">{formatTime(video.duration)} دقيقة</p>
          </div>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
          <div className="max-w-5xl mx-auto mb-4">
            <div className="flex items-center gap-3 text-white text-sm mb-2">
              <span>{formatTime(currentTime)}</span>
              <Progress value={progress} className="flex-1 h-1.5" />
              <span>{formatTime(video.duration)}</span>
            </div>
          </div>
          <div className="max-w-5xl mx-auto flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 w-12 h-12"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-white/20 text-white text-sm rounded px-3 py-2 border-none"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
