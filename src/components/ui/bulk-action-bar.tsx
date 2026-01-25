import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline";
}

interface BulkActionBarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClear: () => void;
  className?: string;
}

export function BulkActionBar({
  selectedCount,
  actions,
  onClear,
  className,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "bg-background border rounded-lg shadow-lg p-4",
        "flex items-center gap-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{selectedCount} محدد</span>
        <Button variant="ghost" size="icon" onClick={onClear}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="h-6 w-px bg-border" />

      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "default"}
            size="sm"
            onClick={action.onClick}
            className="gap-2"
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
