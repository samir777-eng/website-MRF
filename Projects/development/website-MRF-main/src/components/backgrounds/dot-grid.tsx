import { cn } from "@/lib/utils";

interface DotGridProps {
  className?: string;
  dotSize?: number;
  dotColor?: string;
  gap?: number;
}

export function DotGrid({
  className,
  dotSize = 1,
  dotColor = "rgba(0, 0, 0, 0.1)",
  gap = 20,
}: DotGridProps) {
  return (
    <div
      className={cn("absolute inset-0 -z-10", className)}
      style={{
        backgroundImage: `radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${gap}px ${gap}px`,
      }}
    />
  );
}


export default DotGrid;
