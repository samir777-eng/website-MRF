import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  /** Center the spinner in parent container */
  centered?: boolean;
  /** Visual variant */
  variant?: "default" | "dots" | "pulse";
}

const sizeClasses = {
  sm: { spinner: "w-4 h-4", text: "text-xs", gap: "gap-2" },
  md: { spinner: "w-6 h-6", text: "text-sm", gap: "gap-3" },
  lg: { spinner: "w-8 h-8", text: "text-base", gap: "gap-3" },
  xl: { spinner: "w-12 h-12", text: "text-lg", gap: "gap-4" },
};

// SVG Spinner component
function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Dots loading animation
function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// Pulse loading animation
function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
      <span className="relative block rounded-full bg-primary w-full h-full" />
    </div>
  );
}

export function LoadingSpinner({
  size = "md",
  className,
  text,
  centered = false,
  variant = "default",
}: LoadingSpinnerProps) {
  const sizeConfig = sizeClasses[size];

  return (
    <div
      role="status"
      aria-label={text || "جاري التحميل"}
      className={cn(
        "flex flex-col items-center justify-center",
        sizeConfig.gap,
        centered && "absolute inset-0",
        className,
      )}
    >
      {variant === "default" && (
        <SpinnerIcon className={cn("text-primary", sizeConfig.spinner)} />
      )}
      {variant === "dots" && <DotsLoader className={sizeConfig.spinner} />}
      {variant === "pulse" && <PulseLoader className={sizeConfig.spinner} />}
      {text && (
        <p
          className={cn(
            "text-muted-foreground font-medium animate-pulse-gentle",
            sizeConfig.text,
          )}
        >
          {text}
        </p>
      )}
      <span className="sr-only">جاري التحميل</span>
    </div>
  );
}
