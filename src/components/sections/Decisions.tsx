"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { engineeringDecisions } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/**
 * Engineering Decision Log — the "why" behind the stack. A commit-log-style
 * list of technical decisions; selecting one reveals the context, the call,
 * the tradeoff, and what I'd reconsider today. Signals engineering maturity.
 */
export function Decisions() {
  const [open, setOpen] = useState(0);

  return (
    <section id="decisions" className="relative py-28 md:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Engineering Decisions"
          title="Every stack choice was a decision."
          description="Not a list of tools — the reasoning, tradeoffs, and what I'd do differently today."
        />

        <div className="mt-12 overflow-hidden rounded-3xl glass">
          {engineeringDecisions.map((d, i) => {
            const isOpen = open === i;
            return (
              <div
                key={d.tech}
                className={cn(
                  "border-b border-line/10 last:border-b-0",
                  isOpen && "bg-line/[0.02]",
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  data-cursor=""
                  className="flex w-full items-center gap-4 px-5 py-4 text-left md:px-7 md:py-5"
                >
                  <span className="font-mono text-xs text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="w-28 shrink-0 font-mono text-sm font-medium text-accent-soft md:w-40">
                    {d.tech}
                  </span>
                  <span className="flex-1 text-sm text-ink md:text-base">
                    {d.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    className="shrink-0 text-lg text-muted"
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-5 px-5 pb-6 md:grid-cols-2 md:px-7 md:pl-[calc(2.5rem+11rem)]">
                        <Field label="Context" value={d.context} />
                        <Field label="Decision" value={d.decision} accent />
                        <Field label="Tradeoff" value={d.tradeoff} />
                        <Field label="What I'd reconsider today" value={d.reconsider} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-faint">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-sm leading-relaxed",
          accent ? "text-ink" : "text-muted",
        )}
      >
        {value}
      </p>
    </div>
  );
}
