"use client";

/* Shared chrome for every OS surface: a numbered instrument header plus the
 * intersection reporting the fourth wall reads from.
 *
 * The reveal is CSS-armed: content is visible by default and only animates
 * once the observer confirms it can run. If IntersectionObserver never fires
 * — backgrounded tab, prerender, no JS — the content still renders (PRD R13).
 */

import { useEffect, useRef } from "react";
import { surfaceMeta, type SurfaceId } from "@/data/os";
import { useOs } from "./OsContext";

export function Surface({
  id,
  children,
  aside,
}: {
  id: SurfaceId;
  children: React.ReactNode;
  /** Optional right-hand marginalia in the header row. */
  aside?: React.ReactNode;
}) {
  const meta = surfaceMeta[id];
  const ref = useRef<HTMLElement>(null);
  const { setActiveSurface } = useOs();

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSurface(id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, setActiveSurface]);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-20 border-t border-line/10 py-20 sm:py-28"
    >
      <header className="mb-12 flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-5">
          <span
            aria-hidden
            className="font-mono text-xs tabular-nums text-accent"
          >
            {meta.index}
          </span>
          <div>
            <h2
              id={`${id}-title`}
              className="font-display text-2xl tracking-tight text-ink sm:text-3xl"
            >
              {meta.title}
            </h2>
            <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-faint">
              {meta.kicker}
            </p>
          </div>
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}

/** Hairline instrument panel. The OS's only container primitive. */
export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`border border-line/10 bg-surface/60 ${className}`}>{children}</div>;
}

/** Uppercase mono label — the OS's metadata voice. */
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-faint">
      {children}
    </span>
  );
}
