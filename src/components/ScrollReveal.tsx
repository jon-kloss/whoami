"use client";

import { useEffect, useRef } from "react";

type Animation = "fade-up" | "fade-left" | "fade-right" | "fade-in" | "scale-in";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: Animation;
  delay?: number;
  stagger?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  stagger = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (stagger) {
            const items = el.querySelectorAll("[data-stagger]");
            items.forEach((item, i) => {
              (item as HTMLElement).style.transitionDelay = `${i * 100}ms`;
              item.classList.add("visible");
            });
          }
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, stagger]);

  return (
    <div ref={ref} className={`reveal reveal--${animation} ${className}`}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-stagger className={`stagger-item ${className}`}>
      {children}
    </div>
  );
}
