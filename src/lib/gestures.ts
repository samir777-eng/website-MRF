/**
 * Mobile Gesture Support
 * Implements swipe, pinch, long-press, and other touch gestures
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// Gesture types
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';
export type GestureType = 'swipe' | 'pinch' | 'longpress' | 'tap' | 'doubletap';

// Gesture configuration
export interface GestureConfig {
  threshold?: number; // Minimum distance for swipe (default: 50px)
  timeout?: number; // Timeout for long press (default: 500ms)
  preventScroll?: boolean; // Prevent default scroll behavior
}

// Gesture event data
export interface SwipeEvent {
  direction: SwipeDirection;
  distance: number;
  velocity: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface PinchEvent {
  scale: number;
  distance: number;
  center: { x: number; y: number };
}

export interface LongPressEvent {
  x: number;
  y: number;
  duration: number;
}

// Swipe gesture hook
export function useSwipe(
  onSwipe: (event: SwipeEvent) => void,
  config: GestureConfig = {}
) {
  const { threshold = 50, preventScroll = false } = config;
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const startX = touchStart.current.x;
    const startY = touchStart.current.y;
    const startTime = touchStart.current.time;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - startTime;
    const velocity = distance / duration;

    // Determine swipe direction
    if (distance >= threshold) {
      let direction: SwipeDirection;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        // Vertical swipe
        direction = deltaY > 0 ? 'down' : 'up';
      }

      onSwipe({
        direction,
        distance,
        velocity,
        startX,
        startY,
        endX,
        endY,
      });
    }

    touchStart.current = null;
  }, [onSwipe, threshold]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventScroll && touchStart.current) {
      e.preventDefault();
    }
  }, [preventScroll]);

  useEffect(() => {
    const element = document;
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchMove, preventScroll]);
}

// Pinch gesture hook
export function usePinch(
  onPinch: (event: PinchEvent) => void,
  config: GestureConfig = {}
) {
  const initialDistance = useRef<number>(0);
  const initialScale = useRef<number>(1);

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenter = (touch1: Touch, touch2: Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches[0], e.touches[1]);
      initialScale.current = 1;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && initialDistance.current > 0) {
      e.preventDefault();
      
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialDistance.current;
      const center = getCenter(e.touches[0], e.touches[1]);

      onPinch({
        scale,
        distance: currentDistance,
        center,
      });
    }
  }, [onPinch]);

  const handleTouchEnd = useCallback(() => {
    initialDistance.current = 0;
    initialScale.current = 1;
  }, []);

  useEffect(() => {
    const element = document;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);
}

// Long press gesture hook
export function useLongPress(
  onLongPress: (event: LongPressEvent) => void,
  config: GestureConfig = {}
) {
  const { timeout = 500 } = config;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    timerRef.current = setTimeout(() => {
      if (touchStart.current) {
        onLongPress({
          x: touchStart.current.x,
          y: touchStart.current.y,
          duration: Date.now() - touchStart.current.time,
        });
      }
    }, timeout);
  }, [onLongPress, timeout]);

  const handleTouchEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    touchStart.current = null;
  }, []);

  const handleTouchMove = useCallback(() => {
    // Cancel long press if finger moves
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const element = document;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchMove]);
}

// Pull to refresh hook
export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  config: GestureConfig = {}
) {
  const { threshold = 80 } = config;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStart = useRef<number>(0);
  const scrollTop = useRef<number>(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    scrollTop.current = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop.current === 0) {
      touchStart.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (scrollTop.current === 0 && !isRefreshing) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStart.current;
      
      if (distance > 0) {
        setPullDistance(Math.min(distance, threshold * 1.5));
        if (distance > 10) {
          e.preventDefault();
        }
      }
    }
  }, [isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
    touchStart.current = 0;
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    const element = document;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { isRefreshing, pullDistance };
}

// Usage examples:
// 
// Swipe navigation:
// useSwipe((event) => {
//   if (event.direction === 'left') router.push('/next');
//   if (event.direction === 'right') router.back();
// });
//
// Pinch to zoom:
// usePinch((event) => {
//   setZoom(event.scale);
// });
//
// Long press menu:
// useLongPress((event) => {
//   showContextMenu(event.x, event.y);
// });
//
// Pull to refresh:
// const { isRefreshing, pullDistance } = usePullToRefresh(async () => {
//   await fetchData();
// });

