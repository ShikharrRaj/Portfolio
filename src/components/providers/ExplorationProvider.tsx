"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { badges, journeySections, type Badge } from "@/data/portfolio";

interface ExplorationState {
  /** ids of journey sections the visitor has reached */
  visited: Set<string>;
  /** 0–100 percentage of the journey explored */
  progress: number;
  /** label that reflects the current progress milestone */
  milestone: string;
  /** badges with their unlocked state, in display order */
  badges: (Badge & { unlocked: boolean })[];
  /** number of unlocked badges */
  unlockedCount: number;
  /** register that a section entered the viewport */
  markVisited: (id: string) => void;
}

const ExplorationContext = createContext<ExplorationState | null>(null);

const TOTAL = journeySections.length;

function milestoneFor(progress: number) {
  if (progress >= 100) return "Leadership Journey Complete";
  if (progress >= 80) return "Almost there";
  if (progress >= 45) return "Deep diving";
  if (progress > 0) return "Exploring";
  return "Begin the journey";
}

/**
 * Tracks which "Leadership Journey" sections the visitor has reached, exposing
 * exploration progress and unlocked discovery badges. Purely additive — no
 * popups, no blocking; components opt in via useSectionView / useExploration.
 */
export function ExplorationProvider({ children }: { children: React.ReactNode }) {
  const [visited, setVisited] = useState<Set<string>>(new Set());

  const markVisited = useCallback((id: string) => {
    setVisited((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const value = useMemo<ExplorationState>(() => {
    const progress = Math.round((visited.size / TOTAL) * 100);
    const allExplored = visited.size >= TOTAL;
    const decorated = badges.map((b) => ({
      ...b,
      unlocked: b.section === "*" ? allExplored : visited.has(b.section),
    }));
    return {
      visited,
      progress,
      milestone: milestoneFor(progress),
      badges: decorated,
      unlockedCount: decorated.filter((b) => b.unlocked).length,
      markVisited,
    };
  }, [visited, markVisited]);

  return (
    <ExplorationContext.Provider value={value}>
      {children}
    </ExplorationContext.Provider>
  );
}

export function useExploration() {
  const ctx = useContext(ExplorationContext);
  if (!ctx) throw new Error("useExploration must be used within ExplorationProvider");
  return ctx;
}
