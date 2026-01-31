"use client";

import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./button";

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
}

export function Carousel({
  children,
  className,
  autoplay = false,
  autoplayDelay = 3000,
  loop = true,
  showDots = true,
  showArrows = true,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, direction: "rtl" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!autoplay || !emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, emblaApi]);

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription="عرض شرائح"
      aria-label="عرض الشرائح"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex" role="list">
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0"
              role="listitem"
              aria-roledescription="شريحة"
              aria-label={`شريحة ${index + 1} من ${children.length}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 end-4 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={scrollPrev}
            aria-label="الشريحة السابقة"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 start-4 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={scrollNext}
            aria-label="الشريحة التالية"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </>
      )}

      {showDots && (
        <div
          className="flex items-center justify-center gap-2 mt-4"
          role="tablist"
          aria-label="شرائح العرض"
        >
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`انتقل إلى الشريحة ${index + 1} من ${scrollSnaps.length}`}
              className={cn(
                "h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                index === selectedIndex
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-muted hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
