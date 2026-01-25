"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useUnsavedChanges(hasUnsavedChanges: boolean) {
    const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const confirmNavigation = (callback: () => void) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "لديك تغييرات غير محفوظة. هل أنت متأكد من المغادرة؟"
      );
      if (confirmed) {
        callback();
      }
    } else {
      callback();
    }
  };

  return { confirmNavigation, showWarning, setShowWarning };
}

