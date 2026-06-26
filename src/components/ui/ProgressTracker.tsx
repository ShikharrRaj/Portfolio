"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Lock,
  Compass,
  Boxes,
  Layers,
  Network,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useExploration } from "@/components/providers/ExplorationProvider";
import { journeySections } from "@/data/portfolio";
import { scrollToSection } from "@/components/providers/SmoothScrollProvider";
import { cn } from "@/lib/utils";

// Explicit map so we only bundle the icons we actually use.
const BADGE_ICONS: Record<string, LucideIcon> = {
  Compass,
  Boxes,
  Layers,
  Network,
  Sparkles,
  Trophy,
};

/**
 * A subtle, executive progress indicator pinned bottom-left. Shows journey
 * exploration % as a ring; clicking expands an elegant panel with the
 * section checklist and discovery badges. No popups, no auto-interrupts.
 */
export function ProgressTracker() {
  const { progress, milestone, badges, unlockedCount, visited } = useExploration();
  const [open, setOpen] = useState(false);

  const R = 16;
  const C = 2 * Math.PI * R;

  return (
    <div className="fixed bottom-5 left-5 z-40 hidden md:block">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-14 left-0 w-72 overflow-hidden rounded-2xl glass-strong p-4 shadow-glow-lg"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Leadership Journey</p>
              <span className="font-mono text-xs text-accent-soft">{progress}%</span>
            </div>
            <p className="mt-0.5 text-xs text-muted">{milestone}</p>

            {/* journey checklist */}
            <div className="mt-3 space-y-1">
              {journeySections.map((s) => {
                const done = visited.has(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(`#${s.id}`)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-line/[0.05]"
                  >
                    <span
                      className={cn(
                        "grid h-4 w-4 place-items-center rounded-full border text-[9px]",
                        done
                          ? "border-accent/40 bg-accent/20 text-accent-soft"
                          : "border-line/15 text-faint",
                      )}
                    >
                      {done ? <Check className="h-2.5 w-2.5" /> : ""}
                    </span>
                    <span className={done ? "text-ink" : "text-muted"}>{s.title}</span>
                  </button>
                );
              })}
            </div>

            {/* discovery badges */}
            <div className="mt-3 border-t border-line/10 pt-3">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-faint">
                Discovery badges · {unlockedCount}/{badges.length}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {badges.map((b) => {
                  const Icon = BADGE_ICONS[b.icon] ?? Lock;
                  return (
                    <div
                      key={b.id}
                      title={b.unlocked ? b.label : b.hint}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all",
                        b.unlocked
                          ? "border-accent/30 bg-accent/[0.07]"
                          : "border-line/10 opacity-50",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          b.unlocked ? "text-accent-soft" : "text-faint",
                        )}
                      />
                      <span className="text-[9px] leading-tight text-muted">
                        {b.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* the ring trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        data-cursor="Journey"
        aria-label="Toggle journey progress"
        className="flex items-center gap-2.5 rounded-full glass-strong px-3 py-2 transition-shadow hover:shadow-glow"
      >
        <span className="relative grid h-9 w-9 place-items-center">
          <svg className="absolute -rotate-90" width="38" height="38" viewBox="0 0 38 38">
            <circle cx="19" cy="19" r={R} fill="none" stroke="rgb(var(--line) / 0.12)" strokeWidth="3" />
            <motion.circle
              cx="19"
              cy="19"
              r={R}
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={C}
              animate={{ strokeDashoffset: C - (C * progress) / 100 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <span className="font-mono text-[10px] font-semibold text-ink">{progress}</span>
        </span>
        <span className="pr-1 text-left">
          <span className="block text-xs font-medium text-ink">Explored</span>
          <span className="block text-[10px] text-muted">{unlockedCount} badges</span>
        </span>
      </button>
    </div>
  );
}
