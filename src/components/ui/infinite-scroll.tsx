"use client";

import { useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "./loading-spinner";

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  threshold?: number;
  loader?: React.ReactNode;
}

export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  threshold = 200,
  loader,
}: InfiniteScrollProps) {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const handleIntersection = async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting && hasMore && !isLoading) {
        setIsLoading(true);
        try {
          await onLoadMore();
        } finally {
          setIsLoading(false);
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: `${threshold}px`,
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return (
    <div>
      {children}
      {hasMore && (
        <div ref={loadMoreRef} className="py-8 flex justify-center">
          {isLoading && (loader || <LoadingSpinner size="md" text="جاري التحميل..." />)}
        </div>
      )}
    </div>
  );
}

