"use client";

import { useFocusTrap } from "@/hooks/use-focus-trap";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
  dir?: "ltr" | "rtl";
}

interface DialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  // ACCESSIBILITY: Focus trap for keyboard navigation
  const focusTrapRef = useFocusTrap(!!open, {
    returnFocus: true,
    onEscape: () => onOpenChange?.(false),
  });

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop with fade animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange?.(false)}
            aria-hidden="true"
          />
          {/* Content with scale + fade animation */}
          <motion.div
            ref={focusTrapRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg mx-4"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const DialogContent = ({ className, children, dir }: DialogContentProps) => {
  return (
    <div
      dir={dir}
      className={cn(
        "relative bg-background border rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

const DialogHeader = ({ className, children }: DialogHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-start mb-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const DialogTitle = ({ className, children }: DialogTitleProps) => {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
    >
      {children}
    </h2>
  );
};

const DialogDescription = ({ className, children }: DialogDescriptionProps) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
};

interface DialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

const DialogFooter = ({ className, children }: DialogFooterProps) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
};
