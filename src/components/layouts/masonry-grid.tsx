"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MasonryGridProps {
  children: React.ReactNode[];
  columns?: number;
  gap?: number;
  className?: string;
}

export function MasonryGrid({
  children,
  columns = 3,
  gap = 16,
  className,
}: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnHeights, setColumnHeights] = useState<number[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const heights = Array(columns).fill(0);
    const container = containerRef.current;
    const items = Array.from(container.children) as HTMLElement[];

    items.forEach((item, index) => {
      const columnIndex = index % columns;
      const top = heights[columnIndex];

      item.style.position = "absolute";
      item.style.top = `${top}px`;
      item.style.left = `${(100 / columns) * columnIndex}%`;
      item.style.width = `calc(${100 / columns}% - ${gap}px)`;

      heights[columnIndex] += item.offsetHeight + gap;
    });

    setColumnHeights(heights);
  }, [children, columns, gap]);

  const maxHeight = Math.max(...columnHeights, 0);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ height: maxHeight }}
    >
      {children}
    </div>
  );
}

export default MasonryGrid;
