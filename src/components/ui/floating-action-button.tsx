import { Button } from "./button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  /** Accessible label - required for icon-only buttons */
  label: string;
  /** Show label text on larger screens */
  showLabel?: boolean;
  position?: "bottom-start" | "bottom-end" | "bottom-center";
  className?: string;
}

// Using logical properties for RTL support
const positionClasses = {
  "bottom-start": "bottom-6 start-6",
  "bottom-end": "bottom-6 end-6",
  "bottom-center": "bottom-6 inset-x-0 mx-auto w-fit",
};

export function FloatingActionButton({
  icon,
  onClick,
  label,
  showLabel = false,
  position = "bottom-end",
  className,
}: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "fixed z-50 rounded-full shadow-lg",
        showLabel ? "h-12 px-5 gap-2" : "h-14 w-14 p-0",
        positionClasses[position],
        className,
      )}
      aria-label={label}
      title={label}
    >
      <span className="shrink-0" aria-hidden="true">
        {icon}
      </span>
      {showLabel && (
        <span className="text-sm font-medium hidden sm:inline">{label}</span>
      )}
    </Button>
  );
}
