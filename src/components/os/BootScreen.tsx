"use client";

/* The entry gate (PRD R1). Not a hero — a question.
 *
 * The whole gate is present in the server HTML and revealed by CSS, so a
 * visitor whose JS never arrives still sees the boot log, the prompt and all
 * six lenses. The staged reveal is decoration; the content is not gated
 * behind it (PRD R1 edge / R13).
 */

import { boot, modes, type ModeId } from "@/data/os";
import { profile } from "@/data/portfolio";

/** Stagger, in seconds. Boot lines first, then the prompt, then the lenses. */
const LINE_STEP = 0.42;
const PROMPT_AT = boot.lines.length * LINE_STEP;

export function BootScreen({ onEnter }: { onEnter: (m: ModeId | null) => void }) {
  return (
    <div className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 py-16 sm:px-10">
      {/* Instrument grid — precision software, not marketing. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-fade opacity-[0.25]"
        style={{ backgroundSize: "72px 72px" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Boot log */}
        <div className="mb-14 font-mono text-xs sm:text-sm">
          {boot.lines.map((l, i) => (
            <p
              key={l}
              className="os-boot flex items-baseline gap-3 py-1 text-muted"
              style={{ animationDelay: `${i * LINE_STEP}s` }}
            >
              <span className="text-accent">›</span>
              <span className={i === boot.lines.length - 1 ? "text-accent-soft" : undefined}>
                {l}
              </span>
            </p>
          ))}
        </div>

        <div className="os-boot" style={{ animationDelay: `${PROMPT_AT}s` }}>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-faint">
            {profile.name} · Personal OS
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
            {boot.prompt}
          </h1>
        </div>

        <ul className="mt-12 grid gap-px border border-line/10 bg-line/10 sm:grid-cols-2 lg:grid-cols-3">
          {modes.map((m, i) => (
            <li
              key={m.id}
              className="os-boot"
              style={{ animationDelay: `${PROMPT_AT + 0.16 + i * 0.07}s` }}
            >
              <button
                type="button"
                onClick={() => onEnter(m.id)}
                className="group flex h-full w-full flex-col items-start gap-2 bg-bg p-6 text-left transition-colors duration-300 hover:bg-surface focus-visible:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent"
              >
                <span className="flex w-full items-baseline justify-between">
                  <span className="font-display text-lg text-ink">{m.label}</span>
                  <span
                    aria-hidden
                    className="font-mono text-xs text-faint transition-colors group-hover:text-accent-soft"
                  >
                    ↵
                  </span>
                </span>
                <span className="text-sm leading-relaxed text-muted">{m.blurb}</span>
                <span className="mt-auto pt-3 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-faint">
                  {m.meta}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => onEnter(null)}
          className="os-boot mt-8 font-mono text-xs text-faint underline-offset-4 transition-colors hover:text-muted hover:underline focus-visible:text-muted focus-visible:underline focus-visible:outline-none"
          style={{ animationDelay: `${PROMPT_AT + 0.7}s` }}
        >
          {boot.skip}
        </button>
      </div>
    </div>
  );
}
