"use client";

import { Button } from "@/components/ui/button";
import {
  Captions,
  CaptionsOff,
  Loader,
  Maximize,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "@/components/ui/icons";
import { Slider } from "@/components/ui/slider";
import { FadeIn } from "@/lib/animations/lightweight-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

// Safari detection
const isSafari = () => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium")
  );
};

// Check for HLS support (Safari native, others need HLS.js)
const supportsHLS = () => {
  if (typeof window === "undefined") return false;
  const video = document.createElement("video");
  return video.canPlayType("application/vnd.apple.mpegurl") !== "";
};

// LocalStorage key for caption preferences
const CAPTION_PREFERENCE_KEY = "mrf-video-caption-preference";

// Caption track interface for accessibility support
export interface CaptionTrack {
  src: string;
  srcLang: string;
  label: string;
  kind: "captions" | "subtitles" | "descriptions";
  default?: boolean;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
  startTime?: number;
  captions?: CaptionTrack[];
}

export function VideoPlayer({
  src,
  poster,
  title,
  className,
  onProgress,
  onComplete,
  autoPlay = false,
  startTime = 0,
  captions = [],
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const captionMenuRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [activeCaptionTrack, setActiveCaptionTrack] = useState<string | null>(null);
  const [showCaptionMenu, setShowCaptionMenu] = useState(false);

  // Detect Safari on mount
  useEffect(() => {
    setIsSafariBrowser(isSafari());
  }, []);

  // Load caption preferences from localStorage and initialize captions
  useEffect(() => {
    if (typeof window === "undefined" || captions.length === 0) return;

    // Load saved preference
    const savedPreference = localStorage.getItem(CAPTION_PREFERENCE_KEY);
    if (savedPreference) {
      try {
        const { enabled, trackLang } = JSON.parse(savedPreference);
        setCaptionsEnabled(enabled);
        if (trackLang) {
          setActiveCaptionTrack(trackLang);
        }
      } catch {
        // Invalid saved preference, use defaults
      }
    }

    // If no saved preference, check for default track
    const defaultTrack = captions.find((track) => track.default);
    if (defaultTrack && !savedPreference) {
      setActiveCaptionTrack(defaultTrack.srcLang);
    }
  }, [captions]);

  // Update text tracks when caption settings change
  useEffect(() => {
    const video = videoRef.current;
    if (!video || captions.length === 0) return;

    // Update all text track modes
    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (captionsEnabled && track.language === activeCaptionTrack) {
        track.mode = "showing";
      } else {
        track.mode = "hidden";
      }
    }

    // Save preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        CAPTION_PREFERENCE_KEY,
        JSON.stringify({
          enabled: captionsEnabled,
          trackLang: activeCaptionTrack,
        })
      );
    }
  }, [captionsEnabled, activeCaptionTrack, captions]);

  // Close caption menu when clicking outside
  useEffect(() => {
    if (!showCaptionMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        captionMenuRef.current &&
        !captionMenuRef.current.contains(event.target as Node)
      ) {
        setShowCaptionMenu(false);
      }
    };

    // Handle Escape key to close menu
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCaptionMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showCaptionMenu]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      if (startTime > 0) {
        video.currentTime = startTime;
      }
    };

    // Safari-specific: handle stalled/waiting events
    const handleStalled = () => {
      if (isSafariBrowser) {
        setIsLoading(true);
      }
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    // Handle video errors
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onProgress) {
        onProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) {
        onComplete();
      }
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    // Add all event listeners
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("stalled", handleStalled);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
    };
  }, [onProgress, onComplete, startTime, isSafariBrowser]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        // Safari requires user interaction for autoplay
        // Use play() promise to handle autoplay restrictions
        await video.play();
        setIsPlaying(true);
      }
    } catch (error) {
      // Handle autoplay restriction - common in Safari
      console.warn("Video playback was prevented:", error);
      // Try muted autoplay as fallback (Safari allows this)
      if (isSafariBrowser && !video.muted) {
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
          setIsPlaying(true);
        } catch {
          setHasError(true);
        }
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      video.muted = false;
      setIsMuted(false);
    } else {
      video.volume = 0;
      video.muted = true;
      setIsMuted(true);
    }
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

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(
      0,
      Math.min(duration, video.currentTime + seconds)
    );
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  // Toggle captions on/off
  const toggleCaptions = () => {
    if (captions.length === 0) return;

    if (!captionsEnabled) {
      // Enable captions - use active track or first available
      setCaptionsEnabled(true);
      if (!activeCaptionTrack && captions.length > 0) {
        setActiveCaptionTrack(captions[0].srcLang);
      }
    } else {
      setCaptionsEnabled(false);
    }
  };

  // Select a specific caption track
  const selectCaptionTrack = (srcLang: string) => {
    setActiveCaptionTrack(srcLang);
    setCaptionsEnabled(true);
    setShowCaptionMenu(false);
  };

  // Turn off captions
  const turnOffCaptions = () => {
    setCaptionsEnabled(false);
    setShowCaptionMenu(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

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
        skip(-10);
        break;
      case "ArrowRight":
      case "l":
        e.preventDefault();
        skip(10);
        break;
      case "ArrowUp":
        e.preventDefault();
        handleVolumeChange([Math.min(100, volume * 100 + 10)]);
        break;
      case "ArrowDown":
        e.preventDefault();
        handleVolumeChange([Math.max(0, volume * 100 - 10)]);
        break;
      case "m":
        e.preventDefault();
        toggleMute();
        break;
      case "f":
        e.preventDefault();
        toggleFullscreen();
        break;
      case "c":
        e.preventDefault();
        toggleCaptions();
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
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-lg overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label={title ? `مشغل الفيديو: ${title}` : "مشغل الفيديو"}
      aria-describedby="video-keyboard-shortcuts"
    >
      {/* Hidden keyboard shortcuts help text for screen readers */}
      <span id="video-keyboard-shortcuts" className="sr-only">
        اضغط مسافة أو K للتشغيل/الإيقاف، سهم يمين أو L للتقديم 10 ثواني، سهم
        يسار أو J للرجوع 10 ثواني، M لكتم الصوت، F لملء الشاشة، C لتفعيل/إيقاف الترجمة
      </span>
      { }
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        playsInline
        // Safari-specific attributes
        {...{ "webkit-playsinline": "" }}
        {...{ "x-webkit-airplay": "allow" }}
        preload="metadata"
        crossOrigin="anonymous"
        aria-label={title || "فيديو"}
      >
        {/* Caption/Subtitle tracks for accessibility */}
        {captions.map((track) => (
          <track
            key={`${track.srcLang}-${track.kind}`}
            src={track.src}
            kind={track.kind}
            srcLang={track.srcLang}
            label={track.label}
            default={track.default}
          />
        ))}
      </video>

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
          <div className="text-red-500 mb-2">
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader className="w-8 h-8 text-white" />
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && (
        <FadeIn duration={300}>
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Button
              size="lg"
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
              onClick={togglePlay}
            >
              <Play className="w-8 h-8 text-white fill-current" />
            </Button>
          </div>
        </FadeIn>
      )}

      {/* Controls */}
      <div
        className={cn(
          "absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-all duration-300",
          showControls || !isPlaying
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-5"
        )}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => skip(-10)}
              aria-label="رجوع 10 ثواني"
              title="رجوع 10 ثواني"
            >
              <SkipBack className="w-4 h-4" aria-hidden="true" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={togglePlay}
              aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
              title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Play className="w-4 h-4" aria-hidden="true" />
              )}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => skip(10)}
              aria-label="تقديم 10 ثواني"
              title="تقديم 10 ثواني"
            >
              <SkipForward className="w-4 h-4" aria-hidden="true" />
            </Button>

            <div className="flex items-center gap-2 ms-4">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={toggleMute}
                aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                title={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                )}
              </Button>

              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  aria-label="مستوى الصوت"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white text-sm">
            <span aria-live="polite" aria-atomic="true">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <select
              value={playbackRate}
              onChange={(e) => changePlaybackRate(Number(e.target.value))}
              className="bg-transparent text-white text-sm border-none outline-none"
              style={{ minHeight: "44px" }}
              aria-label="سرعة التشغيل"
              title="سرعة التشغيل"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>

            {/* Caption/Subtitle Controls */}
            {captions.length > 0 && (
              <div className="relative" ref={captionMenuRef}>
                <Button
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "text-white hover:bg-white/20",
                    captionsEnabled && "bg-white/20"
                  )}
                  onClick={() => {
                    if (captions.length === 1) {
                      toggleCaptions();
                    } else {
                      setShowCaptionMenu(!showCaptionMenu);
                    }
                  }}
                  aria-label={captionsEnabled ? "إيقاف الترجمة" : "تفعيل الترجمة"}
                  aria-expanded={showCaptionMenu}
                  aria-haspopup={captions.length > 1 ? "menu" : undefined}
                  title={captionsEnabled ? "إيقاف الترجمة (C)" : "تفعيل الترجمة (C)"}
                >
                  {captionsEnabled ? (
                    <Captions className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <CaptionsOff className="w-4 h-4" aria-hidden="true" />
                  )}
                </Button>

                {/* Caption track selection menu */}
                {showCaptionMenu && captions.length > 1 && (
                  <div
                    className="absolute bottom-full mb-2 end-0 bg-black/90 backdrop-blur-sm rounded-lg shadow-lg py-2 min-w-[160px] z-50"
                    role="menu"
                    aria-label="اختر لغة الترجمة"
                  >
                    <button
                      className={cn(
                        "w-full px-4 py-2 text-start text-sm text-white hover:bg-white/20 transition-colors",
                        !captionsEnabled && "bg-white/10"
                      )}
                      role="menuitem"
                      onClick={turnOffCaptions}
                    >
                      إيقاف الترجمة
                    </button>
                    <div className="border-t border-white/20 my-1" role="separator" />
                    {captions.map((track) => (
                      <button
                        key={`${track.srcLang}-${track.kind}`}
                        className={cn(
                          "w-full px-4 py-2 text-start text-sm text-white hover:bg-white/20 transition-colors",
                          captionsEnabled &&
                            activeCaptionTrack === track.srcLang &&
                            "bg-white/10"
                        )}
                        role="menuitem"
                        onClick={() => selectCaptionTrack(track.srcLang)}
                        aria-current={
                          captionsEnabled && activeCaptionTrack === track.srcLang
                            ? "true"
                            : undefined
                        }
                      >
                        <span className="flex items-center gap-2">
                          {captionsEnabled &&
                            activeCaptionTrack === track.srcLang && (
                              <span aria-hidden="true">&#10003;</span>
                            )}
                          <span>
                            {track.label}
                            {track.kind === "descriptions" && (
                              <span className="text-xs text-white/70 ms-1">
                                (وصف صوتي)
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={toggleFullscreen}
              aria-label="ملء الشاشة"
              title="ملء الشاشة"
            >
              <Maximize className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {/* Title Overlay */}
      {title && (
        <div className="absolute top-4 inset-x-4">
          <h3 className="text-white font-semibold text-lg drop-shadow-lg">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
}
