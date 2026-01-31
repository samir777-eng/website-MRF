"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  color?: string;
}

export function StarBorder({
  children,
  className,
  speed = 2,
  color = "gold",
}: StarBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    container.appendChild(canvas);

    let animationId: number;
    let offset = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, "transparent");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;

      // Draw animated border
      ctx.save();
      ctx.translate(offset, 0);
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      offset += speed;
      if (offset > canvas.width) offset = 0;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      container.removeChild(canvas);
    };
  }, [speed, color]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      {children}
    </div>
  );
}

export default StarBorder;
