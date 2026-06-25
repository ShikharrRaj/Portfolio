"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Aceternity-style Meteors — diagonal shooting streaks across a section.
 * Positions/timings are randomized on mount (client-only to avoid hydration
 * mismatch). Decorative; skipped under reduced-motion.
 */
export function Meteors({ number = 18, className }: { number?: number; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [meteors, setMeteors] = useState<
    { left: string; delay: string; duration: string }[]
  >([]);

  useEffect(() => {
    setMeteors(
      Array.from({ length: number }).map(() => ({
        left: `${Math.floor(Math.random() * 100)}%`,
        delay: `${Math.random() * 4}s`,
        duration: `${Math.random() * 4 + 4}s`,
      })),
    );
  }, [number]);

  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {meteors.map((m, i) => (
        <span
          key={i}
          className={cn(
            "absolute top-0 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-accent shadow-[0_0_0_1px_rgba(245,176,66,0.1)]",
            "before:absolute before:top-1/2 before:h-px before:w-[60px] before:-translate-y-1/2 before:bg-gradient-to-r before:from-accent before:to-transparent before:content-['']",
            className,
          )}
          style={
            {
              left: m.left,
              "--angle": "215deg",
              "--meteor-duration": m.duration,
              animationDelay: m.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
