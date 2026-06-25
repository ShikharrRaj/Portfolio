"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  /** number of decimal places to display (e.g. 1 for "3.6") */
  decimals?: number;
  className?: string;
}

/**
 * Counts up from 0 to `value` the first time it scrolls into view.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals);
      },
    });
    return controls.stop;
  }, [inView, value, duration, decimals, count]);

  return (
    <span className={className}>
      <span ref={ref}>{(0).toFixed(decimals)}</span>
      {suffix}
    </span>
  );
}
