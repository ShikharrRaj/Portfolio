"use client";

import { useEffect } from "react";
import { journeySections } from "@/data/portfolio";
import { useExploration } from "@/components/providers/ExplorationProvider";

/**
 * Watches every journey section by id and marks it visited once it scrolls
 * into view. Centralized here so individual sections need no extra wiring
 * beyond their existing `id` attribute.
 */
export function JourneyTracker() {
  const { markVisited } = useExploration();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            markVisited(entry.target.id);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.25 },
    );

    journeySections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [markVisited]);

  return null;
}
