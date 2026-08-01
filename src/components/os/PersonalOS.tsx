"use client";

/* Personal OS — root shell.
 *
 * Boot gate → status bar → surfaces in the order the declared lens asks for.
 * The visitor is not navigating sections; the OS re-sorts itself around them.
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { modes, surfaceMeta, type ModeId, type SurfaceId } from "@/data/os";
import { profile } from "@/data/portfolio";
import { BootScreen } from "./BootScreen";
import { CommandBar } from "./CommandBar";
import { Observer } from "./Observer";
import { OsProvider, useOs } from "./OsContext";
import { CaseFiles } from "./surfaces/CaseFiles";
import { Collaborate } from "./surfaces/Collaborate";
import { Corrections } from "./surfaces/Corrections";
import { Journal } from "./surfaces/Journal";
import { MentalModels } from "./surfaces/MentalModels";
import { MissionControl } from "./surfaces/MissionControl";
import { Timeline } from "./surfaces/Timeline";

const SURFACES: Record<SurfaceId, () => JSX.Element> = {
  mission: MissionControl,
  timeline: Timeline,
  models: MentalModels,
  cases: CaseFiles,
  journal: Journal,
  corrections: Corrections,
  collab: Collaborate,
};

function StatusBar() {
  const { mode, order, activeSurface, setMode, reset } = useOs();
  const current = modes.find((m) => m.id === mode);
  const [time, setTime] = useState<string>("");

  // Local time where he actually is — a small live signal that is genuinely live.
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: profile.timezone,
        }).format(new Date()),
      );
    tick();
    const t = window.setInterval(tick, 30_000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-line/10 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3 sm:px-10">
        <button
          type="button"
          onClick={reset}
          className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted transition-colors hover:text-accent-soft focus-visible:text-accent-soft focus-visible:outline-none"
        >
          {profile.firstName} OS
        </button>

        <span aria-hidden className="hidden h-3 w-px bg-line/15 sm:block" />

        {/* Active lens — switchable without losing the session (PRD R1). */}
        <label className="hidden items-center gap-2 sm:flex">
          <span className="sr-only">Active lens</span>
          <select
            value={mode ?? ""}
            onChange={(e) => setMode((e.target.value || null) as ModeId | null)}
            className="cursor-pointer border border-line/15 bg-transparent px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-accent-soft outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <option value="">Neutral</option>
            {modes.map((m) => (
              <option key={m.id} value={m.id} className="bg-elevated text-ink">
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <span className="ml-auto hidden font-mono text-[0.65rem] text-faint md:inline">
          {activeSurface ? surfaceMeta[activeSurface].title : current?.meta ?? "Ready"}
        </span>
        <span className="hidden font-mono text-[0.65rem] tabular-nums text-faint lg:inline">
          {time} IST
        </span>
        <span className="font-mono text-[0.65rem] text-faint">
          {order.indexOf(activeSurface ?? order[0]) + 1}/{order.length}
        </span>

        <CommandBar />
      </div>
    </header>
  );
}

function Shell() {
  const { booted, boot, order, mode } = useOs();
  const reduce = useReducedMotion();

  return (
    <>
      <a
        href="#mission"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-accent focus:bg-elevated focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>

      <AnimatePresence mode="wait">
        {!booted ? (
          <motion.div
            key="boot"
            exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.4 }}
          >
            <BootScreen onEnter={(m) => boot(m)} />
          </motion.div>
        ) : (
          <motion.div
            key="os"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <StatusBar />
            <main className="mx-auto max-w-6xl px-6 pb-32 sm:px-10">
              {/* Surfaces render in the order the declared lens asks for. */}
              {order.map((id) => {
                const Component = SURFACES[id];
                return <Component key={`${mode ?? "neutral"}-${id}`} />;
              })}
            </main>
            <Observer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function PersonalOS() {
  return (
    <OsProvider>
      <Shell />
    </OsProvider>
  );
}
