"use client";

/* The fourth wall (PRD R16).
 *
 * Rules, in order of importance:
 *   1. Silence is the default. When nothing notable has happened, say nothing.
 *   2. Never repeat an observation within a session.
 *   3. Two dismissals and it stops permanently, on this device, forever.
 *   4. Never steal focus; never block content; polite live region only.
 *   5. A wrong observation is worse than no observation — ambiguous signal
 *      produces silence.
 *
 * All signal is device-local. Nothing here is stored or transmitted.
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { observations, surfaceMeta } from "@/data/os";
import { useOs } from "./OsContext";

/** Dwell before the OS considers a lingering visitor "notable", in seconds. */
const DWELL_S = 75;

export function Observer() {
  const {
    activeSurface,
    openedCases,
    openedCorrections,
    elapsed,
    observerSilenced,
    silenceObserver,
  } = useOs();
  const reduce = useReducedMotion();

  const [message, setMessage] = useState<string | null>(null);
  const [dismissals, setDismissals] = useState(0);
  const fired = useRef<Set<string>>(new Set());
  const surfaceSince = useRef<{ id: string | null; at: number }>({ id: null, at: 0 });

  // Track how long the current surface has held attention.
  useEffect(() => {
    surfaceSince.current = { id: activeSurface, at: elapsed };
  }, [activeSurface]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (observerSilenced || message) return;

    const fire = (key: string, text: string) => {
      if (fired.current.has(key)) return false;
      fired.current.add(key);
      setMessage(text);
      return true;
    };

    // Went straight for what went wrong.
    if (openedCorrections >= 2 && fire("corrections", observations.readCorrections)) return;

    // Sustained dwell on one surface — only fires with unambiguous signal.
    const { id, at } = surfaceSince.current;
    if (id && elapsed - at >= DWELL_S) {
      if (fire(`dwell:${id}`, observations.dwell(surfaceMeta[id as keyof typeof surfaceMeta].title)))
        return;
    }

    // Reached the end without opening a single case file.
    if (activeSurface === "collab" && openedCases.size === 0) {
      fire("skipped-cases", observations.skippedCases);
    }
  }, [elapsed, activeSurface, openedCases, openedCorrections, observerSilenced, message]);

  const dismiss = () => {
    const next = dismissals + 1;
    setDismissals(next);
    if (next >= 2) {
      setMessage(observations.stopped);
      window.setTimeout(() => {
        silenceObserver();
        setMessage(null);
      }, 2200);
      return;
    }
    setMessage(null);
  };

  if (observerSilenced && !message) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-40 flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end"
    >
      <AnimatePresence>
        {message && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.32, ease: [0.2, 0.7, 0.3, 1] }}
            className="pointer-events-auto flex max-w-md items-start gap-4 border border-line/15 bg-elevated/95 p-4 shadow-xl backdrop-blur"
          >
            <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-soft" />
            <p className="flex-1 text-sm leading-relaxed text-muted">{message}</p>
            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-faint transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
