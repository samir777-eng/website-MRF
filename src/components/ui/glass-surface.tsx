import { cn } from "@/lib/utils";

interface GlassSurfaceProps {
  children: React.ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
  border?: boolean;
}

const blurClasses = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

export function GlassSurface({
  children,
  className,
  blur = "md",
  opacity = 0.1,
  border = true,
}: GlassSurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-lg",
        blurClasses[blur],
        border && "border border-white/20",
        className,
      )}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      }}
    >
      {children}
    </div>
  );
}
