"use client";

import { ShoppingCart } from "lucide-react";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface FlyingItem {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface Celebration {
  id: string;
  x: number;
  y: number;
}

interface FlyToCartContextType {
  triggerAnimation: (sourceElement: HTMLElement) => void;
  setCartRef: (element: HTMLElement | null) => void;
}

const FlyToCartContext = createContext<FlyToCartContextType | undefined>(
  undefined
);

export function useFlyToCart() {
  const context = useContext(FlyToCartContext);
  if (!context) {
    throw new Error("useFlyToCart must be used within FlyToCartProvider");
  }
  return context;
}

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [cartElement, setCartElement] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setCartRef = useCallback((element: HTMLElement | null) => {
    setCartElement(element);
  }, []);

  const triggerAnimation = useCallback(
    (sourceElement: HTMLElement) => {
      let target = cartElement;
      if (!target) {
        // Try to find cart button by class name
        target = document.querySelector(".cart-button-target") as HTMLElement;
        if (!target) {
          return;
        }
        setCartElement(target);
      }

      const sourceRect = sourceElement.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const itemId = `fly-${Date.now()}-${Math.random()}`;
      const newItem: FlyingItem = {
        id: itemId,
        startX: sourceRect.left + sourceRect.width / 2,
        startY: sourceRect.top + sourceRect.height / 2,
        endX: targetRect.left + targetRect.width / 2,
        endY: targetRect.top + targetRect.height / 2,
      };

      // Celebration at the button (source) - immediate
      const sourceCelebrationId = `celebrate-source-${Date.now()}-${Math.random()}`;
      const sourceX = sourceRect.left + sourceRect.width / 2;
      const sourceY = sourceRect.top + sourceRect.height / 2;

      // Celebration at the cart (target) - after flying animation
      const targetCelebrationId = `celebrate-target-${Date.now()}-${Math.random()}`;
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;

      setFlyingItems((prev) => [...prev, newItem]);

      // Add celebration at button immediately
      setCelebrations((prev) => [
        ...prev,
        {
          id: sourceCelebrationId,
          x: sourceX,
          y: sourceY,
        },
      ]);

      // Remove source celebration after animation
      setTimeout(() => {
        setCelebrations((prev) =>
          prev.filter((c) => c.id !== sourceCelebrationId)
        );
      }, 1000);

      // Add celebration at cart when flying animation completes (after 600ms)
      setTimeout(() => {
        setCelebrations((prev) => [
          ...prev,
          {
            id: targetCelebrationId,
            x: targetX,
            y: targetY,
          },
        ]);
      }, 550);

      // Remove target celebration after animation
      setTimeout(() => {
        setCelebrations((prev) =>
          prev.filter((c) => c.id !== targetCelebrationId)
        );
      }, 2050); // 550ms delay + 1500ms animation

      // Remove flying item after animation completes
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((item) => item.id !== itemId));
      }, 700);
    },
    [cartElement]
  );

  return (
    <FlyToCartContext.Provider value={{ triggerAnimation, setCartRef }}>
      {children}
      {mounted &&
        createPortal(
          <div
            className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
            data-flying={flyingItems.length}
            data-celebrations={celebrations.length}
          >
            {flyingItems.map((item) => (
              <FlyingItemComponent key={item.id} item={item} />
            ))}
            {celebrations.map((celebration) => (
              <CelebrationBurst
                key={celebration.id}
                celebration={celebration}
              />
            ))}
          </div>,
          document.body
        )}
    </FlyToCartContext.Provider>
  );
}

function FlyingItemComponent({ item }: { item: FlyingItem }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Start animation after mount with a small delay for visual effect
    const timeout = setTimeout(() => {
      setAnimating(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  const deltaX = item.endX - item.startX;
  const deltaY = item.endY - item.startY;

  // Create a curved path using CSS
  const midY = Math.min(item.startY, item.endY) - 100; // Arc above the line

  return (
    <div
      className="absolute"
      style={{
        left: item.startX,
        top: item.startY,
        transform: "translate(-50%, -50%)",
        transition: animating
          ? "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          : "none",
        ...(animating && {
          left: item.endX,
          top: item.endY,
          transform: "translate(-50%, -50%) scale(0.2) rotate(360deg)",
          opacity: 0,
        }),
      }}
    >
      <div
        className={`
          flex items-center justify-center
          w-14 h-14 rounded-full
          bg-gradient-to-br from-green-500 to-emerald-600
          text-white shadow-2xl
          border-2 border-white/50
        `}
        style={{
          boxShadow:
            "0 0 20px rgba(16, 185, 129, 0.6), 0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <ShoppingCart className="w-7 h-7" />
      </div>
    </div>
  );
}

// Celebration burst animation with sparkles and confetti
function CelebrationBurst({ celebration }: { celebration: Celebration }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Start animation after mount
    const timer = setTimeout(() => setAnimating(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Generate particles with pre-calculated end positions
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 + Math.random() * 15) * (Math.PI / 180);
    const distance = 40 + Math.random() * 30;
    return {
      id: i,
      endX: Math.cos(angle) * distance,
      endY: Math.sin(angle) * distance,
      size: 6 + Math.random() * 6,
      color: ["#10b981", "#34d399", "#fbbf24", "#f59e0b", "#ec4899", "#8b5cf6"][
        i % 6
      ],
      delay: Math.random() * 100,
    };
  });

  return (
    <div
      className="absolute"
      style={{
        left: celebration.x,
        top: celebration.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Central burst glow */}
      <div
        className="absolute animate-ping"
        style={{
          width: 60,
          height: 60,
          left: -30,
          top: -30,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, transparent 70%)",
        }}
      />

      {/* Sparkle particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            width: particle.size,
            height: particle.size,
            left: 0,
            top: 0,
            borderRadius: "50%",
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            transform: animating
              ? `translate(${particle.endX}px, ${particle.endY}px) scale(0)`
              : "translate(0, 0) scale(1)",
            opacity: animating ? 0 : 1,
            transition: `all 0.5s ease-out ${particle.delay}ms`,
          }}
        />
      ))}

      {/* Success checkmark */}
      <div
        className="absolute flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white"
        style={{
          left: -20,
          top: -20,
          transform: animating ? "scale(1)" : "scale(0)",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: "0 0 20px rgba(16, 185, 129, 0.8)",
        }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>
  );
}
