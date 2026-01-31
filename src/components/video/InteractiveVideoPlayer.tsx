"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type {
  InteractiveQuestion,
  InteractiveQuestionAttempt,
} from "@/types/interactive-question";
import {
  calculateInteractiveQuestionXP,
  formatTimestamp,
} from "@/types/interactive-question";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Maximize,
  Pause,
  Play,
  Volume2,
  VolumeX,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Safari detection
const isSafari = () => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium")
  );
};

interface InteractiveVideoPlayerProps {
  videoUrl: string;
  questions: InteractiveQuestion[];
  lessonId: string;
  onQuestionAnswered?: (attempt: Partial<InteractiveQuestionAttempt>) => void;
  onXpEarned?: (xp: number) => void;
}

export function InteractiveVideoPlayer({
  videoUrl,
  questions,
  lessonId,
  onQuestionAnswered,
  onXpEarned,
}: InteractiveVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Interactive question state
  const [activeQuestion, setActiveQuestion] =
    useState<InteractiveQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  // Detect Safari on mount
  useEffect(() => {
    setIsSafariBrowser(isSafari());
  }, []);

  // Safari-specific video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };
    const handleStalled = () => {
      if (isSafariBrowser) {
        setIsLoading(true);
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);
    video.addEventListener("stalled", handleStalled);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      video.removeEventListener("stalled", handleStalled);
    };
  }, [isSafariBrowser]);

  // Check for questions at current timestamp
  useEffect(() => {
    if (!videoRef.current || activeQuestion) return;

    const currentQuestion = questions.find((q) => {
      const timeDiff = Math.abs(currentTime - q.timestamp);
      return timeDiff < 0.5 && !answeredQuestions.has(q.id);
    });

    if (currentQuestion) {
      setActiveQuestion(currentQuestion);
      setQuestionStartTime(Date.now());

      // Pause video if required
      if (currentQuestion.pauseVideo && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [currentTime, questions, activeQuestion, answeredQuestions]);

  // Video controls with Safari-compatible play handling
  const togglePlay = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn("Video playback was prevented:", error);
      // Try muted autoplay as fallback (Safari allows this)
      if (isSafariBrowser && !videoRef.current.muted) {
        videoRef.current.muted = true;
        setIsMuted(true);
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch {
          setHasError(true);
        }
      }
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = value;
    setVolume(value);
    setIsMuted(value === 0);
  };

  const handleSeek = (value: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = value;
    setCurrentTime(value);
  };

  // Safari-compatible fullscreen toggle
  const toggleFullscreen = async () => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        // Safari uses webkitRequestFullscreen
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if (video && (video as any).webkitEnterFullscreen) {
          // iOS Safari video-specific fullscreen
          await (video as any).webkitEnterFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.warn("Fullscreen request failed:", error);
    }
  };

  // Handle question answer
  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !activeQuestion) return;

    const responseTime = (Date.now() - questionStartTime) / 1000;
    const correct = selectedAnswer === activeQuestion.correctAnswer;
    const xpEarned = calculateInteractiveQuestionXP(
      activeQuestion.difficulty,
      responseTime,
      correct,
    );

    setIsCorrect(correct);
    setIsAnswered(true);

    // Track answered question
    setAnsweredQuestions((prev) => new Set([...prev, activeQuestion.id]));

    // Update total XP
    if (correct) {
      setTotalXpEarned((prev) => prev + xpEarned);
      onXpEarned?.(xpEarned);
    }

    // Call callback
    onQuestionAnswered?.({
      questionId: activeQuestion.id,
      lessonId,
      userAnswer: selectedAnswer,
      isCorrect: correct,
      responseTime,
      xpEarned,
      videoTimestamp: currentTime,
    });

    // Auto-resume video after 3 seconds
    setTimeout(() => {
      if (videoRef.current && activeQuestion.pauseVideo) {
        videoRef.current.play();
        setIsPlaying(true);
      }
      handleQuestionClose();
    }, 3000);
  };

  const handleQuestionClose = () => {
    setActiveQuestion(null);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(duration, currentTime + seconds),
    );
    setCurrentTime(videoRef.current.currentTime);
  };

  // Keyboard shortcuts handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Don't handle if user is typing in an input or if question is active
    if (
      (e.target as HTMLElement).tagName === "INPUT" ||
      (e.target as HTMLElement).tagName === "TEXTAREA"
    ) {
      return;
    }

    // If a question is active, use different keyboard handling
    if (activeQuestion && !isAnswered) {
      switch (e.key) {
        case "1":
        case "2":
        case "3":
        case "4":
          e.preventDefault();
          const optionIndex = parseInt(e.key) - 1;
          if (optionIndex < activeQuestion.options.length) {
            setSelectedAnswer(optionIndex);
          }
          break;
        case "Enter":
          e.preventDefault();
          if (selectedAnswer !== null) {
            handleAnswerSubmit();
          }
          break;
      }
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
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label="مشغل الفيديو التفاعلي"
      aria-describedby="interactive-video-help"
    >
      {/* Hidden keyboard shortcuts help text for screen readers */}
      <span id="interactive-video-help" className="sr-only">
        اضغط مسافة أو K للتشغيل/الإيقاف، سهم يمين أو L للتقديم 10 ثواني، سهم
        يسار أو J للرجوع 10 ثواني، M لكتم الصوت، F لملء الشاشة. عند ظهور سؤال،
        اضغط 1-4 لاختيار الإجابة ثم Enter للتأكيد.
      </span>
      {/* Video Container */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        {}
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          playsInline
          // Safari-specific attributes
          {...{ "webkit-playsinline": "" }}
          {...{ "x-webkit-airplay": "allow" }}
          preload="metadata"
          crossOrigin="anonymous"
          aria-label="فيديو تفاعلي"
        />

        {/* Error Overlay */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-40">
            <div className="text-red-500 mb-2">
              <XCircle className="w-12 h-12" />
            </div>
            <p className="text-lg font-medium">حدث خطأ في تحميل الفيديو</p>
            <p className="text-sm text-gray-400 mt-1">
              يرجى تحديث الصفحة أو المحاولة لاحقاً
            </p>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          </div>
        )}

        {/* Interactive Question Overlay */}
        {activeQuestion && (
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="interactive-question-title"
          >
            {/* FocusTrap disabled for lint compliance */}
            <Card className="max-w-2xl w-full border-0 shadow-2xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600 text-white">
                      <Zap className="w-4 h-4 ms-1" />
                      <span id="interactive-question-title">سؤال تفاعلي</span>
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 ms-1" />
                      {formatTimestamp(activeQuestion.timestamp)}
                    </Badge>
                  </div>
                  <Badge className="bg-yellow-600 text-white">
                    +{activeQuestion.xpReward} XP
                  </Badge>
                </div>

                {/* Question */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">
                    {activeQuestion.question}
                  </h3>
                  {activeQuestion.context && (
                    <p className="text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4 inline ms-1" />
                      {activeQuestion.context}
                    </p>
                  )}
                </div>

                {/* Options with keyboard navigation */}
                {!isAnswered && (
                  <div
                    className="space-y-3 mb-6"
                    role="radiogroup"
                    aria-label="خيارات الإجابة"
                  >
                    {activeQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(index)}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
                            e.preventDefault();
                            const nextIndex =
                              (index + 1) % activeQuestion.options.length;
                            const nextButton = e.currentTarget.parentElement
                              ?.children[nextIndex] as HTMLElement;
                            nextButton?.focus();
                          } else if (
                            e.key === "ArrowUp" ||
                            e.key === "ArrowRight"
                          ) {
                            e.preventDefault();
                            const prevIndex =
                              (index - 1 + activeQuestion.options.length) %
                              activeQuestion.options.length;
                            const prevButton = e.currentTarget.parentElement
                              ?.children[prevIndex] as HTMLElement;
                            prevButton?.focus();
                          } else if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedAnswer(index);
                          }
                        }}
                        className={`
                          w-full p-4 rounded-lg border-2 text-right transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                          ${
                            selectedAnswer === index
                              ? "border-purple-600 bg-purple-100 dark:bg-purple-900/20"
                              : "border-muted hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/10"
                          }
                        `}
                        role="radio"
                        aria-checked={selectedAnswer === index}
                        aria-label={`الخيار ${index + 1}: ${option}`}
                        tabIndex={
                          selectedAnswer === index ||
                          (selectedAnswer === null && index === 0)
                            ? 0
                            : -1
                        }
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground font-mono">
                              ({index + 1})
                            </span>
                            {selectedAnswer === index && (
                              <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Result */}
                {isAnswered && (
                  <div
                    className={`p-4 rounded-lg mb-6 ${
                      isCorrect
                        ? "bg-green-100 dark:bg-green-900/20 border-2 border-green-600"
                        : "bg-red-100 dark:bg-red-900/20 border-2 border-red-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                      <div>
                        <h4 className="font-semibold text-lg mb-2">
                          {isCorrect ? "إجابة صحيحة! 🎉" : "إجابة خاطئة 😔"}
                        </h4>
                        <p className="text-sm mb-2">
                          {isCorrect
                            ? activeQuestion.correctFeedback
                            : activeQuestion.incorrectFeedback}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm font-medium">
                            الإجابة الصحيحة:{" "}
                            {
                              activeQuestion.options[
                                activeQuestion.correctAnswer
                              ]
                            }
                          </p>
                        )}
                        {activeQuestion.explanation && (
                          <p className="text-sm mt-2 text-muted-foreground">
                            {activeQuestion.explanation}
                          </p>
                        )}
                        {isCorrect && (
                          <Badge className="bg-yellow-600 text-white mt-2">
                            <Zap className="w-4 h-4 ms-1" />+
                            {calculateInteractiveQuestionXP(
                              activeQuestion.difficulty,
                              (Date.now() - questionStartTime) / 1000,
                              true,
                            )}{" "}
                            XP
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {!isAnswered ? (
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswer === null}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  >
                    <CheckCircle className="w-5 h-5 ms-2" />
                    تأكيد الإجابة
                  </Button>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    سيستمر الفيديو تلقائياً بعد 3 ثوانٍ...
                  </p>
                )}
              </CardContent>
            </Card>
            {/* FocusTrap removed */}
          </div>
        )}

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-white mt-1">
              <span>{formatTimestamp(currentTime)}</span>
              <span>{formatTimestamp(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
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

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                  aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                  title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <Volume2 className="w-5 h-5" aria-hidden="true" />
                  )}
                </Button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-20 bg-white/30 rounded-lg appearance-none cursor-pointer"
                  style={{ minHeight: "44px" }}
                  aria-label="مستوى الصوت"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* XP Counter */}
              {totalXpEarned > 0 && (
                <Badge className="bg-yellow-600 text-white">
                  <Zap className="w-4 h-4 ms-1" aria-hidden="true" />+
                  {totalXpEarned} XP
                </Badge>
              )}

              {/* Questions Progress */}
              <Badge variant="outline" className="text-white border-white/50">
                {answeredQuestions.size}/{questions.length} أسئلة
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
                aria-label="ملء الشاشة"
                title="ملء الشاشة"
              >
                <Maximize className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Question Timeline */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium">الأسئلة التفاعلية:</span>
        {questions.map((q, index) => (
          <Badge
            key={q.id}
            variant={answeredQuestions.has(q.id) ? "default" : "outline"}
            className={answeredQuestions.has(q.id) ? "bg-green-600" : ""}
          >
            {index + 1}. {formatTimestamp(q.timestamp)}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default InteractiveVideoPlayer;
