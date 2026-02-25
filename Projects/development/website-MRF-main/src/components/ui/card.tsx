import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border shadow-soft-sm",
        elevated: "border-border shadow-soft",
        outline: "border-border bg-transparent",
        ghost: "border-transparent bg-transparent shadow-none",
        muted: "border-transparent bg-muted shadow-none",
        // Interactive variant with hover feedback
        interactive:
          "border-border shadow-soft-sm cursor-pointer hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
        // Special effect variants
        glass: "glass shadow-soft",
        gradient:
          "bg-gradient-to-br from-violet-600 to-purple-600 text-white border-transparent shadow-violet",
      },
      padding: {
        none: "",
        sm: "[&>*:first-child]:p-4 [&>*:not(:first-child)]:px-4 [&>*:not(:first-child)]:pb-4",
        default:
          "[&>*:first-child]:p-6 [&>*:not(:first-child)]:px-6 [&>*:not(:first-child)]:pb-6",
        lg: "[&>*:first-child]:p-8 [&>*:not(:first-child)]:px-8 [&>*:not(:first-child)]:pb-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  },
);

interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Enable hover lift animation */
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, padding }),
        hover &&
          "cursor-pointer hover:-translate-y-1 hover:shadow-soft-lg active:translate-y-0 active:shadow-soft active:transition-all active:duration-75",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-tight tracking-tight text-foreground font-display",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
};
