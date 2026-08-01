"use client";

/* Mental Models (PRD R4).
 *
 * Organised by mode of thinking, never by technology, and deliberately with
 * no proficiency scores — a self-assigned "React 92%" is unfalsifiable, and
 * unfalsifiable numbers are banned on this site (PRD G5).
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { mentalModels } from "@/data/os";
import { Label, Surface } from "../Surface";

export function MentalModels() {
  const [open, setOpen] = useState<string>(mentalModels[0].id);
  const reduce = useReducedMotion();

  return (
    <Surface id="models">
      <div className="grid gap-px border border-line/10 bg-line/10">
        {mentalModels.map((m) => {
          const isOpen = open === m.id;
          return (
            <div key={m.id} className="bg-bg">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`model-${m.id}`}
                  onClick={() => setOpen(isOpen ? "" : m.id)}
                  className="group flex w-full items-baseline gap-5 px-6 py-5 text-left transition-colors hover:bg-surface/60 focus-visible:bg-surface/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent"
                >
                  <span
                    className={`font-display text-2xl tracking-tight transition-colors sm:text-3xl ${
                      isOpen ? "text-accent-soft" : "text-ink group-hover:text-accent-soft"
                    }`}
                  >
                    {m.verb}
                  </span>
                  <span className="flex-1 text-sm leading-relaxed text-muted">{m.premise}</span>
                  <span
                    aria-hidden
                    className={`font-mono text-xs text-faint transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`model-${m.id}`}
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.2, 0.7, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 border-t border-line/[0.06] px-6 py-6 md:grid-cols-[1.2fr_1fr]">
                      <div>
                        <Label>In practice</Label>
                        <ul className="mt-3 space-y-2.5">
                          {m.practice.map((p) => (
                            <li
                              key={p}
                              className="flex gap-3 text-sm leading-relaxed text-muted"
                            >
                              <span aria-hidden className="mt-[0.45rem] h-px w-4 shrink-0 bg-accent/60" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <Label>Evidence</Label>
                          <p className="mt-2 text-sm leading-relaxed text-ink">{m.evidence}</p>
                        </div>
                        <div>
                          <Label>Reaches for</Label>
                          <ul className="mt-2 flex flex-wrap gap-1.5">
                            {m.tools.map((t) => (
                              <li
                                key={t}
                                className="border border-line/10 px-2 py-1 font-mono text-[0.65rem] text-muted"
                              >
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Surface>
  );
}
