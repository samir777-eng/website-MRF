"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MagnetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
}

export function MagnetButton({
  children,
  strength = 20,
  className,
  ...props
}: MagnetButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = Math.max(rect.width, rect.height);

    if (distance < maxDistance) {
      const factor = (1 - distance / maxDistance) * strength;
      setPosition({
        x: (deltaX / maxDistance) * factor,
        y: (deltaY / maxDistance) * factor,
      });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("transition-transform duration-200", className)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      {...props}
    >
      {children}
    </button>
  );
}


export default MagnetButton;
