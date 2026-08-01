"use client";

/* Case Files (PRD R5).
 *
 * Each file opens as a dossier: problem, constraints, architecture, decision,
 * what failed, what worked, impact, and what he would do differently today.
 * The "what failed" field is mandatory — a case file without it is marketing,
 * and is not publishable under R5.
 *
 * NDA files show the reasoning without the protected specifics.
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { caseFiles, type CaseFile } from "@/data/os";
import { useOs } from "../OsContext";
import { Label, Surface } from "../Surface";

const DOSSIER: { key: keyof CaseFile; label: string; tone?: "warm" | "ink" }[] = [
  { key: "problem", label: "Problem" },
  { key: "constraints", label: "Constraints" },
  { key: "architecture", label: "Architecture" },
  { key: "decision", label: "Decision" },
  { key: "failed", label: "What failed", tone: "warm" },
  { key: "worked", label: "What worked" },
  { key: "impact", label: "Business impact", tone: "ink" },
  { key: "today", label: "What I'd do differently today", tone: "warm" },
];

export function CaseFiles() {
  const [open, setOpen] = useState<string | null>(null);
  const { noteCaseOpen } = useOs();
  const reduce = useReducedMotion();

  const toggle = (id: string) => {
    const next = open === id ? null : id;
    setOpen(next);
    if (next) noteCaseOpen(next);
  };

  return (
    <Surface
      id="cases"
      aside={<Label>{caseFiles.length} files · 2 classifications</Label>}
    >
      <div className="grid gap-px border border-line/10 bg-line/10">
        {caseFiles.map((c) => {
          const isOpen = open === c.id;
          return (
            <article key={c.id} className="bg-bg">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`case-${c.id}`}
                  onClick={() => toggle(c.id)}
                  className="group flex w-full flex-col gap-3 px-6 py-6 text-left transition-colors hover:bg-surface/60 focus-visible:bg-surface/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent sm:flex-row sm:items-center sm:gap-6"
                >
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-xl tracking-tight text-ink">
                        {c.title}
                      </span>
                      <span
                        className={`border px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.18em] ${
                          c.classification === "NDA"
                            ? "border-warm/40 text-warm"
                            : "border-accent/40 text-accent-soft"
                        }`}
                      >
                        {c.classification}
                      </span>
                    </span>
                    <span className="text-sm leading-relaxed text-muted">{c.tagline}</span>
                  </span>
                  <span className="flex items-center gap-5">
                    {c.client && (
                      <span className="font-mono text-[0.65rem] text-faint">{c.client}</span>
                    )}
                    <span className="font-mono text-xs tabular-nums text-muted">{c.year}</span>
                    <span
                      aria-hidden
                      className={`font-mono text-xs text-faint transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`case-${c.id}`}
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.36, ease: [0.2, 0.7, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-line/[0.06] px-6 py-7">
                      {c.classification === "NDA" && (
                        <p className="mb-6 border-l-2 border-warm/40 pl-4 text-sm leading-relaxed text-warm/80">
                          Delivered under NDA. The reasoning is here in full; the protected
                          specifics are not.
                        </p>
                      )}

                      <dl className="grid gap-x-10 gap-y-6 md:grid-cols-2">
                        {DOSSIER.map(({ key, label, tone }) => (
                          <div key={label}>
                            <dt className="mb-2">
                              <Label>{label}</Label>
                            </dt>
                            <dd
                              className={`text-sm leading-relaxed ${
                                tone === "warm"
                                  ? "text-warm/90"
                                  : tone === "ink"
                                    ? "text-ink"
                                    : "text-muted"
                              }`}
                            >
                              {c[key] as string}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <ul className="mt-7 flex flex-wrap gap-1.5 border-t border-line/[0.06] pt-5">
                        {c.stack.map((s) => (
                          <li
                            key={s}
                            className="border border-line/10 px-2 py-1 font-mono text-[0.65rem] text-muted"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </Surface>
  );
}
