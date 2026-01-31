import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SwipeNavigationOptions {
  enabled?: boolean;
  threshold?: number; // Minimum distance for swipe (px)
  velocity?: number; // Minimum velocity for swipe (px/ms)
  routes?: {
    left?: string; // Route to navigate when swiping left
    right?: string; // Route to navigate when swiping right
  };
}

export function useSwipeNavigation(options: SwipeNavigationOptions = {}) {
  const {
    enabled = true,
    threshold = 50,
    velocity = 0.3,
    routes = {},
  } = options;

  const router = useRouter();
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
      touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      const deltaX = touchEndX.current - touchStartX.current;
      const deltaY = touchEndY.current - touchStartY.current;
      const deltaTime = Date.now() - touchStartTime.current;

      // Calculate velocity
      const velocityX = Math.abs(deltaX) / deltaTime;

      // Check if horizontal swipe is dominant
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 2;

      if (!isHorizontalSwipe) return;

      // Check if swipe meets threshold and velocity requirements
      if (Math.abs(deltaX) > threshold && velocityX > velocity) {
        // Haptic feedback
        if ("vibrate" in navigator) {
          navigator.vibrate(15);
        }

        // Swipe right (navigate back or to previous route)
        if (deltaX > 0 && routes.right) {
          router.push(routes.right);
        }
        // Swipe left (navigate forward or to next route)
        else if (deltaX < 0 && routes.left) {
          router.push(routes.left);
        }
      }
    };

    // Add event listeners
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);

    // Cleanup
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, threshold, velocity, routes, router]);
}
