import { cn } from "@/lib/utils";
import { ChevronLeft, Home } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="مسار التنقل"
      className={cn("flex items-center gap-2 text-sm", className)}
      dir="rtl"
    >
      <Link
        href="/ar"
        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {/* In RTL, ChevronLeft naturally points in the forward direction */}
            <ChevronLeft className="w-4 h-4 text-muted-foreground/50" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-2"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
