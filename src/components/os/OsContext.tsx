"use client";

/* Personal OS — shared state.
 *
 * Holds the visitor's declared lens (PRD R1) and the behavioural signal the
 * fourth wall reads from (PRD R16). Every signal stays on this device: the
 * context is memory-only except for the mode, which persists so a returning
 * visitor is not re-interrogated.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { modes, type ModeId, type SurfaceId } from "@/data/os";

const MODE_KEY = "shikhar-os.mode";
const OBSERVER_KEY = "shikhar-os.observer";

type OsState = {
  /** null until the visitor chooses, or takes the neutral route. */
  mode: ModeId | null;
  booted: boolean;
  order: SurfaceId[];
  setMode: (m: ModeId | null) => void;
  boot: (m: ModeId | null) => void;
  reset: () => void;

  /* --- fourth-wall signal (device-local, never transmitted) --- */
  openedCases: Set<string>;
  noteCaseOpen: (id: string) => void;
  openedCorrections: number;
  noteCorrectionOpen: () => void;
  activeSurface: SurfaceId | null;
  setActiveSurface: (s: SurfaceId | null) => void;
  observerSilenced: boolean;
  silenceObserver: () => void;
  elapsed: number;
};

const Ctx = createContext<OsState | null>(null);

/** Neutral order used when the visitor declines to choose (PRD R1 empty state). */
const NEUTRAL_ORDER: SurfaceId[] = [
  "mission",
  "timeline",
  "cases",
  "models",
  "journal",
  "corrections",
  "collab",
];

export function OsProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ModeId | null>(null);
  const [booted, setBooted] = useState(false);
  const [openedCases, setOpenedCases] = useState<Set<string>>(new Set());
  const [openedCorrections, setOpenedCorrections] = useState(0);
  const [activeSurface, setActiveSurface] = useState<SurfaceId | null>(null);
  const [observerSilenced, setObserverSilenced] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef<number>(0);

  // Restore a returning visitor's lens. A corrupt value falls back to the
  // neutral ordering silently — never a blank screen (PRD R1 error state).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(MODE_KEY);
      if (stored && modes.some((m) => m.id === stored)) {
        setModeState(stored as ModeId);
        setBooted(true);
      }
      if (window.localStorage.getItem(OBSERVER_KEY) === "off") {
        setObserverSilenced(true);
      }
    } catch {
      /* storage unavailable — proceed unbooted, nothing is gated behind it */
    }
  }, []);

  // Engaged time, paused when the tab is hidden so the observer never
  // claims someone "spent 28 seconds here" while the tab sat in the background.
  useEffect(() => {
    started.current = Date.now();
    let raf = 0;
    const tick = () => {
      if (!document.hidden) {
        setElapsed(Math.floor((Date.now() - started.current) / 1000));
      } else {
        started.current = Date.now() - elapsed * 1000;
      }
      raf = window.setTimeout(tick, 1000) as unknown as number;
    };
    tick();
    return () => window.clearTimeout(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMode = useCallback((m: ModeId | null) => {
    setModeState(m);
    try {
      if (m) window.localStorage.setItem(MODE_KEY, m);
      else window.localStorage.removeItem(MODE_KEY);
    } catch {
      /* non-fatal */
    }
  }, []);

  const boot = useCallback(
    (m: ModeId | null) => {
      setMode(m);
      setBooted(true);
    },
    [setMode],
  );

  const reset = useCallback(() => {
    setMode(null);
    setBooted(false);
  }, [setMode]);

  const silenceObserver = useCallback(() => {
    setObserverSilenced(true);
    try {
      window.localStorage.setItem(OBSERVER_KEY, "off");
    } catch {
      /* non-fatal */
    }
  }, []);

  const noteCaseOpen = useCallback((id: string) => {
    setOpenedCases((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const noteCorrectionOpen = useCallback(() => setOpenedCorrections((n) => n + 1), []);

  const order = useMemo(
    () => modes.find((m) => m.id === mode)?.order ?? NEUTRAL_ORDER,
    [mode],
  );

  const value = useMemo<OsState>(
    () => ({
      mode,
      booted,
      order,
      setMode,
      boot,
      reset,
      openedCases,
      noteCaseOpen,
      openedCorrections,
      noteCorrectionOpen,
      activeSurface,
      setActiveSurface,
      observerSilenced,
      silenceObserver,
      elapsed,
    }),
    [
      mode,
      booted,
      order,
      setMode,
      boot,
      reset,
      openedCases,
      noteCaseOpen,
      openedCorrections,
      noteCorrectionOpen,
      activeSurface,
      observerSilenced,
      silenceObserver,
      elapsed,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOs() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOs must be used inside <OsProvider>");
  return ctx;
}
