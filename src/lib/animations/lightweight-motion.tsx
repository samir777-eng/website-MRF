"use client";

import React, { useEffect, useRef, useState } from "react";

// Lightweight animation utilities to replace framer-motion for basic animations

interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  fill?: "forwards" | "backwards" | "both" | "none";
}

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

interface SlideInProps extends FadeInProps {
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

interface ScaleInProps extends FadeInProps {
  scale?: number;
}

// CSS-based fade in animation
export function FadeIn({
  children,
  duration = 300,
  delay = 0,
  className = ""}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}ms ease-out ${delay}ms`}}
    >
      {children}
    </div>
  );
}

// CSS-based slide in animation
export function SlideIn({
  children,
  direction = "up",
  distance = 20,
  duration = 300,
  delay = 0,
  className = ""}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)";

    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`;
      case "down":
        return `translate3d(0, -${distance}px, 0)`;
      case "left":
        return `translate3d(${distance}px, 0, 0)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)`;
      default:
        return `translate3d(0, ${distance}px, 0)`;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`}}
    >
      {children}
    </div>
  );
}

// CSS-based scale in animation
export function ScaleIn({
  children,
  scale = 0.95,
  duration = 300,
  delay = 0,
  className = ""}: ScaleInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : `scale(${scale})`,
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`}}
    >
      {children}
    </div>
  );
}

// Stagger children animations
interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function Stagger({
  children,
  staggerDelay = 100,
  className = ""}: StaggerProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={index * staggerDelay}>{child}</FadeIn>
      ))}
    </div>
  );
}

// Simple hover animations using CSS
export const hoverAnimations = {
  scale: "transition-transform duration-200 hover:scale-105",
  lift: "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
  glow: "transition-all duration-200 hover:shadow-md hover:shadow-primary/20",
  fade: "transition-opacity duration-200 hover:opacity-80",
  slideRight: "transition-transform duration-200 hover:translate-x-1",
  slideUp: "transition-transform duration-200 hover:-translate-y-1"};

// Loading animations
export function Pulse({
  children,
  className = ""}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`animate-pulse ${className}`}>{children}</div>;
}

export function Spin({
  children,
  className = ""}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`animate-spin ${className}`}>{children}</div>;
}

export function Bounce({
  children,
  className = ""}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`animate-bounce ${className}`}>{children}</div>;
}

// Custom keyframe animations
export const keyframes = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 30px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  
  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translate3d(0, -30px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 20px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

// Utility function to inject keyframes
export function injectAnimationStyles() {
  if (typeof document === "undefined") return;

  const styleId = "lightweight-motion-styles";
  if (document.getElementById(styleId)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = keyframes;
  document.head.appendChild(style);
}

// Animation classes for direct CSS usage
export const animationClasses = {
  fadeInUp: "animate-[fadeInUp_0.3s_ease-out]",
  slideInUp: "animate-[slideInUp_0.3s_ease-out]",
  slideInDown: "animate-[slideInDown_0.3s_ease-out]",
  scaleIn: "animate-[scaleIn_0.3s_ease-out]"};
