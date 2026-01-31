"use client";

import { useState, useCallback } from "react";
import { useToast } from "./useToast";

interface UndoAction<T> {
  data: T;
  action: () => Promise<void>;
  undoAction: () => Promise<void>;
  message: string;
}

export function useUndo<T>() {
  const [history, setHistory] = useState<UndoAction<T>[]>([]);
  const { toast } = useToast();

  const executeWithUndo = useCallback(
    async (
      data: T,
      action: () => Promise<void>,
      undoAction: () => Promise<void>,
      message: string,
    ) => {
      // Execute the action
      await action();

      // Add to history
      const undoItem: UndoAction<T> = { data, action, undoAction, message };
      setHistory((prev) => [...prev, undoItem]);

      // Show toast with undo button
      toast({
        title: message,
        description: "تم التنفيذ بنجاح",
        duration: 5000,
      });
    },
    [toast],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    executeWithUndo,
    history,
    clearHistory,
  };
}
