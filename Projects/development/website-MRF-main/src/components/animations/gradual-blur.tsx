import { cn } from "@/lib/utils";

interface GradualBlurProps {
  children: React.ReactNode;
  className?: string;
  direction?: "top" | "bottom" | "left" | "right";
  blurAmount?: number;
}

export function GradualBlur({
  children,
  className,
  direction = "bottom",
  blurAmount = 10,
}: GradualBlurProps) {
  const maskImages = {
    top: "linear-gradient(to bottom, transparent, black)",
    bottom: "linear-gradient(to top, transparent, black)",
    left: "linear-gradient(to right, transparent, black)",
    right: "linear-gradient(to left, transparent, black)",
  };

  return (
    <div
      className={cn("relative", className)}
      style={{
        maskImage: maskImages[direction],
        WebkitMaskImage: maskImages[direction],
      }}
    >
      <div style={{ filter: `blur(${blurAmount}px)` }}>{children}</div>
    </div>
  );
}


export default GradualBlur;
