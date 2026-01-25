import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardNavItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
}

interface CardNavProps {
  items: CardNavItem[];
  className?: string;
}

export function CardNav({ items, className }: CardNavProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "group relative overflow-hidden rounded-lg border p-6",
            "hover:shadow-lg transition-all duration-300",
            "hover:-translate-y-1"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity",
              item.color || "bg-primary"
            )}
          />

          <div className="relative">
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                item.color ? `${item.color}/10` : "bg-primary/10"
              )}
            >
              <div className={cn(item.color || "text-primary")}>{item.icon}</div>
            </div>

            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

