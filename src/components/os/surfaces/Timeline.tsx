"use client";

/* Timeline of Decisions (PRD R3).
 *
 * Not a job history. Every step is decision → trade-off accepted → outcome,
 * and the trade-off column is the point: it is where judgment is visible.
 */

import { timeline } from "@/data/os";
import { Label, Surface } from "../Surface";

export function Timeline() {
  return (
    <Surface id="timeline">
      <ol className="relative">
        {/* Spine */}
        <span
          aria-hidden
          className="absolute left-[4.5rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-line/10 md:block"
        />
        {timeline.map((t, i) => {
          const current = t.year === "Now";
          return (
            <li key={t.title} className="relative pb-12 last:pb-0 md:pl-[7.5rem]">
              {/* Year rail */}
              <div className="mb-3 flex items-center gap-3 md:absolute md:left-0 md:top-1 md:mb-0 md:w-[4.5rem] md:justify-end">
                <span
                  className={`font-mono text-sm tabular-nums ${
                    current ? "text-accent-soft" : "text-muted"
                  }`}
                >
                  {t.year}
                </span>
              </div>
              <span
                aria-hidden
                className={`absolute left-[4.5rem] top-2 hidden h-1.5 w-1.5 -translate-x-1/2 rounded-full md:block ${
                  current ? "bg-accent-soft ring-4 ring-accent/20" : "bg-faint"
                }`}
              />

              <h3 className="font-display text-lg leading-snug text-ink sm:text-xl">
                {t.title}
              </h3>

              <dl className="mt-4 grid gap-5 sm:grid-cols-3">
                <div>
                  <dt className="mb-1.5">
                    <Label>Decision</Label>
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted">{t.decision}</dd>
                </div>
                <div className="border-l border-line/10 pl-5 sm:border-l-0 sm:pl-0">
                  <dt className="mb-1.5">
                    <Label>Trade-off accepted</Label>
                  </dt>
                  <dd className="text-sm leading-relaxed text-warm/90">{t.tradeoff}</dd>
                </div>
                <div>
                  <dt className="mb-1.5">
                    <Label>Outcome</Label>
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted">{t.outcome}</dd>
                </div>
              </dl>

              {i < timeline.length - 1 && (
                <span aria-hidden className="mt-12 block h-px w-full bg-line/[0.06] md:hidden" />
              )}
            </li>
          );
        })}
      </ol>
    </Surface>
  );
}
