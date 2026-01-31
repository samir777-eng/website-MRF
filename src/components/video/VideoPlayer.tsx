"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useOfflineVideo, useVideoProgress } from "@/hooks/useOfflineVideo";
import {
  Bookmark,
  Download,
  FileText,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  Subtitles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  videoId: string;
  src: string;
  title: string;
  subtitles?: {
    language: string;
    src: string;
    label: string;
  }[];
  chapters?: {
    timestamp: number;
    title: string;
    description?: string;
  }[];
  onProgress?: (currentTime: number, duration: number) => void;
  onBookmark?: (timestamp: number) => void;
  onNote?: (timestamp: number, note: string) => void;
  bookmarks?: number[];
  notes?: { timestamp: number; note: string }[];
}

export default function VideoPlayer({
  videoId,
  src,
  title,
  subtitles = [],
  chapters = [],
  onProgress,
  onBookmark,
  onNote,
  bookmarks = [],
  notes = [],
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSubtitle] = useState("ar");
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteTimestamp, setNoteTimestamp] = useState(0);

  // Offline video functionality
  const {
    isVideoAvailable,
    isDownloading,
    downloadProgress,
    videoUrl,
    downloadVideo,
    removeVideo,
    isOnline,
  } = useOfflineVideo(videoId, src, title);

  // Video progress tracking
  const { progress, saveProgress } = useVideoProgress(videoId);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
      onProgress?.(video.currentTime, video.duration || 0);

      // Save progress for offline tracking
      if (video.duration > 0) {
        saveProgress(video.currentTime, video.duration);
      }
    };

    const updateBuffer = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (duration > 0) {
          setBuffered((bufferedEnd / duration) * 100);
        }
      }
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateTime);
    video.addEventListener("progress", updateBuffer);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateTime);
      video.removeEventListener("progress", updateBuffer);
    };
  }, [onProgress]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (percentage: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const newTime = (percentage / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const addBookmark = () => {
    onBookmark?.(currentTime);
  };

  const openNoteDialog = () => {
    setNoteTimestamp(currentTime);
    setNoteText("");
    setShowNoteDialog(true);
  };

  const saveNote = () => {
    if (noteText.trim()) {
      onNote?.(noteTimestamp, noteText.trim());
      setShowNoteDialog(false);
      setNoteText("");
    }
  };

  const jumpToChapter = (timestamp: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = timestamp;
    setCurrentTime(timestamp);
  };

  const getCurrentChapter = () => {
    if (chapters.length === 0) return null;

    for (let i = chapters.length - 1; i >= 0; i--) {
      if (currentTime >= chapters[i].timestamp) {
        return chapters[i];
      }
    }
    return chapters[0];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  // Keyboard shortcuts handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Don't handle if user is typing in an input
    if (
      (e.target as HTMLElement).tagName === "INPUT" ||
      (e.target as HTMLElement).tagName === "TEXTAREA"
    ) {
      return;
    }

    switch (e.key) {
      case " ":
      case "k":
        e.preventDefault();
        togglePlay();
        break;
      case "ArrowLeft":
      case "j":
        e.preventDefault();
        skipTime(-10);
        break;
      case "ArrowRight":
      case "l":
        e.preventDefault();
        skipTime(10);
        break;
      case "ArrowUp":
        e.preventDefault();
        handleVolumeChange(Math.min(1, volume + 0.1));
        break;
      case "ArrowDown":
        e.preventDefault();
        handleVolumeChange(Math.max(0, volume - 0.1));
        break;
      case "m":
        e.preventDefault();
        toggleMute();
        break;
      case "f":
        e.preventDefault();
        toggleFullscreen();
        break;
      case "b":
        e.preventDefault();
        addBookmark();
        break;
      case "n":
        e.preventDefault();
        openNoteDialog();
        break;
      case "Home":
        e.preventDefault();
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
        break;
      case "End":
        e.preventDefault();
        if (videoRef.current) {
          videoRef.current.currentTime = duration;
        }
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        e.preventDefault();
        if (videoRef.current) {
          videoRef.current.currentTime = (parseInt(e.key) / 10) * duration;
        }
        break;
    }
  };

  return (
    <div
      className="relative bg-black rounded-2xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label={`مشغل الفيديو: ${title}`}
      aria-describedby="video-keyboard-help"
    >
      {/* Hidden keyboard shortcuts help text for screen readers */}
      <span id="video-keyboard-help" className="sr-only">
        اضغط مسافة أو K للتشغيل/الإيقاف، سهم يمين أو L للتقديم 10 ثواني، سهم
        يسار أو J للرجوع 10 ثواني، M لكتم الصوت، F لملء الشاشة، B لإضافة علامة،
        N لإضافة ملاحظة
      </span>
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl || src}
        className="w-full aspect-video"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        onLoadedMetadata={() => {
          // Restore saved progress
          if (progress && videoRef.current) {
            videoRef.current.currentTime = progress.currentTime;
          }
        }}
        aria-label={title}
      >
        {subtitles.map((subtitle) => (
          <track
            key={subtitle.language}
            kind="subtitles"
            src={subtitle.src}
            srcLang={subtitle.language}
            label={subtitle.label}
            default={subtitle.language === selectedSubtitle}
          />
        ))}
      </video>

      {/* Bookmarks Overlay */}
      <div className="absolute top-0 left-0 right-0 h-1">
        {bookmarks.map((bookmark, index) => (
          <div
            key={index}
            className="absolute top-0 w-1 h-full bg-yellow-400 cursor-pointer"
            style={{ left: `${(bookmark / duration) * 100}%` }}
            onClick={() => jumpToChapter(bookmark)}
            title={`إشارة مرجعية في ${formatTime(bookmark)}`}
          />
        ))}
      </div>

      {/* Chapter Markers */}
      <div className="absolute top-2 left-0 right-0 h-1">
        {chapters.map((chapter, index) => (
          <div
            key={index}
            className="absolute top-0 w-2 h-2 bg-blue-500 rounded-full cursor-pointer transform -translate-y-1/2"
            style={{ left: `${(chapter.timestamp / duration) * 100}%` }}
            onClick={() => jumpToChapter(chapter.timestamp)}
            title={chapter.title}
          />
        ))}
      </div>

      {/* Notes Overlay */}
      {notes.map((note, index) => (
        <div
          key={index}
          className="absolute top-4 bg-blue-600 text-white px-2 py-1 rounded text-sm max-w-xs opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${(note.timestamp / duration) * 100}%` }}
        >
          {note.note}
        </div>
      ))}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        {/* Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/50"
              aria-label="تشغيل الفيديو"
              title="تشغيل"
            >
              <Play className="w-10 h-10 text-white ms-1" aria-hidden="true" />
            </Button>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isOnline && (
              <Badge className="bg-orange-600 text-white">
                وضع عدم الاتصال
              </Badge>
            )}
            {getCurrentChapter() && (
              <Badge className="bg-blue-600 text-white">
                {getCurrentChapter()?.title}
              </Badge>
            )}
            <span className="text-white text-sm font-medium">{title}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowSubtitles(!showSubtitles)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Subtitles className="w-5 h-5" />
            </Button>

            <Button
              onClick={addBookmark}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              title="إضافة إشارة مرجعية"
            >
              <Bookmark className="w-5 h-5" />
            </Button>

            <Button
              onClick={openNoteDialog}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              title="إضافة ملاحظة"
            >
              <FileText className="w-5 h-5" />
            </Button>

            {!isVideoAvailable ? (
              <Button
                onClick={downloadVideo}
                disabled={isDownloading || !isOnline}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                title={
                  isOnline
                    ? "تحميل للمشاهدة دون اتصال"
                    : "يتطلب اتصال بالإنترنت"
                }
              >
                {isDownloading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">
                      {Math.round(downloadProgress)}%
                    </span>
                  </div>
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600 text-white text-sm">
                  متاح دون اتصال
                </Badge>
                <Button
                  onClick={removeVideo}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  title="حذف من التخزين المحلي"
                >
                  <Download className="w-5 h-5 rotate-180" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="relative">
              {/* Buffer Bar */}
              <div className="absolute inset-0 bg-white/20 rounded-full h-1">
                <div
                  className="bg-white/40 h-full rounded-full transition-all duration-300"
                  style={{ width: `${buffered}%` }}
                />
              </div>

              {/* Progress Bar */}
              <Progress
                value={getProgressPercentage()}
                className="h-1 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percentage =
                    ((e.clientX - rect.left) / rect.width) * 100;
                  handleSeek(percentage);
                }}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-white/80 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Play className="w-5 h-5" aria-hidden="true" />
                )}
              </Button>

              <Button
                onClick={() => skipTime(-10)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                aria-label="رجوع 10 ثواني"
                title="رجوع 10 ثواني"
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm ms-1">10</span>
              </Button>

              <Button
                onClick={() => skipTime(10)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                aria-label="تقديم 10 ثواني"
                title="تقديم 10 ثواني"
              >
                <RotateCw className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm me-1">10</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                  title={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Volume2 className="w-5 h-5" aria-hidden="true" />
                  )}
                </Button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) =>
                    handleVolumeChange(parseFloat(e.target.value))
                  }
                  className="w-20 bg-white/20 rounded-full appearance-none cursor-pointer"
                  style={{ minHeight: "44px" }}
                  aria-label="مستوى الصوت"
                  title="مستوى الصوت"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  onClick={() => setShowSettings(!showSettings)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  aria-label="إعدادات الفيديو"
                  aria-expanded={showSettings}
                  title="الإعدادات"
                >
                  <Settings className="w-5 h-5" aria-hidden="true" />
                </Button>

                {showSettings && (
                  <div
                    className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-xl p-4 min-w-48"
                    role="menu"
                    aria-label="إعدادات الفيديو"
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white text-sm font-semibold mb-2">
                          سرعة التشغيل
                        </h4>
                        <div
                          className="grid grid-cols-4 gap-1"
                          role="group"
                          aria-label="سرعة التشغيل"
                        >
                          {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                            <Button
                              key={speed}
                              variant={speed === 1 ? "default" : "ghost"}
                              size="sm"
                              className="text-sm"
                              aria-label={`سرعة ${speed}x`}
                            >
                              {speed}x
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white text-sm font-semibold mb-2">
                          الجودة
                        </h4>
                        <div
                          className="space-y-1"
                          role="group"
                          aria-label="جودة الفيديو"
                        >
                          {["360p", "480p", "720p", "1080p"].map((quality) => (
                            <Button
                              key={quality}
                              variant={quality === "720p" ? "default" : "ghost"}
                              size="sm"
                              className="w-full justify-start text-sm"
                              aria-label={`جودة ${quality}`}
                            >
                              {quality}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                aria-label={
                  isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"
                }
                title={isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"}
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
      </div>

      {/* Note Dialog */}
      {showNoteDialog && (
        <div
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="note-dialog-title"
          onClick={() => setShowNoteDialog(false)}
        >
          {/* FocusTrap disabled for lint compliance */}
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <h3
              id="note-dialog-title"
              className="text-lg font-bold text-foreground mb-4"
            >
              إضافة ملاحظة
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              الوقت: {formatTime(noteTimestamp)}
            </p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="اكتب ملاحظتك هنا..."
              className="w-full h-32 p-3 border border-muted/50 rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex items-center gap-3 mt-4">
              <Button
                onClick={saveNote}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                حفظ الملاحظة
              </Button>
              <Button
                onClick={() => setShowNoteDialog(false)}
                variant="outline"
                className="focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                إلغاء
              </Button>
            </div>
          </div>
          {/* FocusTrap removed */}
        </div>
      )}
    </div>
  );
}

export { VideoPlayer };
