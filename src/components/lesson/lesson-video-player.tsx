"use client";

import { VideoPlayer } from "@/components/video/video-player";

interface LessonVideoPlayerProps {
  src: string;
  title: string;
  startTime?: number;
  lessonId?: string;
}

export function LessonVideoPlayer({
  src,
  title,
  startTime = 0,
  lessonId,
}: LessonVideoPlayerProps) {
  const handleProgress = (progress: number) => {
    // Save progress to local storage or send to API
    if (lessonId) {
      localStorage.setItem(`lesson-progress-${lessonId}`, progress.toString());
    }
  };

  const handleComplete = () => {
    // Handle lesson completion
    if (lessonId) {
      localStorage.setItem(`lesson-completed-${lessonId}`, "true");
    }
  };

  return (
    <VideoPlayer
      src={src}
      title={title}
      startTime={startTime}
      onProgress={handleProgress}
      onComplete={handleComplete}
    />
  );
}
