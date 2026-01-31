"use client";

/**
 * Avatar Context
 * Manages user avatar customization state
 */

import {
  AVATAR_PARTS,
  AvatarConfig,
  AvatarPartType,
  DEFAULT_AVATAR,
  getPartById,
} from "@/types/avatar";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// ============================================================================
// TYPES
// ============================================================================

interface AvatarContextType {
  // State
  config: AvatarConfig;
  ownedParts: string[];
  isLoading: boolean;

  // Actions
  updatePart: (type: AvatarPartType, partId: string) => void;
  purchasePart: (partId: string) => Promise<boolean>;
  unlockPart: (partId: string) => void;
  resetToDefault: () => void;

  // Helpers
  isOwned: (partId: string) => boolean;
  isEquipped: (partId: string) => boolean;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [ownedParts, setOwnedParts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved avatar state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedConfig = localStorage.getItem("avatar-config");
        const savedOwned = localStorage.getItem("avatar-owned");

        if (savedConfig) {
          setConfig(JSON.parse(savedConfig));
        }

        if (savedOwned) {
          setOwnedParts(JSON.parse(savedOwned));
        } else {
          // Default owned parts (free items)
          const freeParts = AVATAR_PARTS.filter(
            (part) => part.unlockMethod === "free",
          ).map((part) => part.id);
          setOwnedParts(freeParts);
        }
      } catch {
        // Use defaults
      }
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoading && typeof window !== "undefined") {
      localStorage.setItem("avatar-config", JSON.stringify(config));
      localStorage.setItem("avatar-owned", JSON.stringify(ownedParts));
    }
  }, [config, ownedParts, isLoading]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const updatePart = useCallback((type: AvatarPartType, partId: string) => {
    setConfig((prev) => ({
      ...prev,
      [type]: partId,
    }));
  }, []);

  const purchasePart = useCallback(
    async (partId: string): Promise<boolean> => {
      const part = getPartById(partId);
      if (!part || part.unlockMethod !== "gems") return false;

      // Check if already owned
      if (ownedParts.includes(partId)) return false;

      try {
        // Call API to deduct gems
        const res = await fetch("/api/gamification/gems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "spend",
            amount: part.gemCost,
            reason: `Purchased avatar part: ${part.name}`,
          }),
        });

        const data = await res.json();
        if (!data.success) {
          return false;
        }

        // Add to owned parts
        setOwnedParts((prev) => [...prev, partId]);
        return true;
      } catch {
        return false;
      }
    },
    [ownedParts],
  );

  const unlockPart = useCallback(
    (partId: string) => {
      if (!ownedParts.includes(partId)) {
        setOwnedParts((prev) => [...prev, partId]);
      }
    },
    [ownedParts],
  );

  const resetToDefault = useCallback(() => {
    setConfig(DEFAULT_AVATAR);
  }, []);

  // ============================================================================
  // HELPERS
  // ============================================================================

  const isOwned = useCallback(
    (partId: string) => ownedParts.includes(partId),
    [ownedParts],
  );

  const isEquipped = useCallback(
    (partId: string) => Object.values(config).includes(partId),
    [config],
  );

  // ============================================================================
  // VALUE
  // ============================================================================

  const value: AvatarContextType = {
    config,
    ownedParts,
    isLoading,
    updatePart,
    purchasePart,
    unlockPart,
    resetToDefault,
    isOwned,
    isEquipped,
  };

  return (
    <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useAvatar() {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("useAvatar must be used within AvatarProvider");
  }
  return context;
}
