"use client";

import { useEffect, useRef } from "react";

interface LiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive" | "off";
  clearAfter?: number;
}

export function LiveRegion({
  message,
  politeness = "polite",
  clearAfter = 5000,
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message || !regionRef.current) return;

    const timer = setTimeout(() => {
      if (regionRef.current) {
        regionRef.current.textContent = "";
      }
    }, clearAfter);

    return () => clearTimeout(timer);
  }, [message, clearAfter]);

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

export function useAnnounce() {
  const announce = (message: string, politeness: "polite" | "assertive" = "polite") => {
    const region = document.createElement("div");
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", politeness);
    region.setAttribute("aria-atomic", "true");
    region.className = "sr-only";
    region.textContent = message;

    document.body.appendChild(region);

    setTimeout(() => {
      document.body.removeChild(region);
    }, 5000);
  };

  return { announce };
}

