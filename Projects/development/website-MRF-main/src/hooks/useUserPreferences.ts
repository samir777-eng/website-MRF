"use client";

import { useState, useEffect } from "react";

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  accentColor: string;
  layout: "compact" | "comfortable";
  notifications: {
    email: boolean;
    push: boolean;
    achievements: boolean;
    reminders: boolean;
  };
  language: "ar" | "en";
}

const defaultPreferences: UserPreferences = {
  theme: "system",
  accentColor: "#1e40af",
  layout: "comfortable",
  notifications: {
    email: true,
    push: true,
    achievements: true,
    reminders: true,
  },
  language: "ar",
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load preferences from localStorage
    const stored = localStorage.getItem("user_preferences");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error("Failed to parse user preferences:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    localStorage.setItem("user_preferences", JSON.stringify(newPreferences));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.setItem("user_preferences", JSON.stringify(defaultPreferences));
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    isLoading,
  };
}

