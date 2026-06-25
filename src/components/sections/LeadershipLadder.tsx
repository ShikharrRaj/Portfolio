"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { careerLadder } from "@/data/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Interactive career progression — Developer → Future CTO. Each stage is a
 * node on a vertical rail; selecting one reveals responsibilities, impact and
 * the leadership lesson learned. Rendered inside the Leadership Journey.
 */
export function LeadershipLadder() {
  const [active, setActive] = useState(careerLadder.length - 3); // default: Tech Lead

  return (
    <div className="mt-20">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-faint">
          Career Progression
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
          From first commit to the CTO seat.
        </h3>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* rail of stages */}
        <div className="relative">
          <div className="absolute left-[18px] top-2 h-[calc(100%-1rem)] w-px bg-line/10" />
          <div className="space-y-2">
            {careerLadder.map((stage, i) => {
              const isActive = i === active;
              return (
                <motion.button
                  key={stage.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  onClick={() => setActive(i)}
                  data-cursor=""
                  className={cn(
                    "relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300",
                    isActive
                      ? "glass-strong border-accent/30"
                      : "border-transparent hover:bg-line/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border font-mono text-xs transition-colors",
                      isActive
                        ? "border-accent/50 bg-accent/20 text-accent-soft"
                        : stage.future
                          ? "border-dashed border-line/20 text-faint"
                          : "border-line/15 bg-surface text-muted",
                    )}
                  >
                    {stage.level}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-display text-sm font-semibold text-ink">
                        {stage.title}
                      </span>
                      {stage.current && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-accent-soft">
                          Now
                        </span>
                      )}
                      {stage.future && (
                        <span className="rounded-full border border-line/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-faint">
                          Next
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-muted">{stage.period}</span>
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform",
                      isActive ? "rotate-90 text-accent-soft lg:rotate-0" : "text-faint",
                    )}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* detail panel */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl glass p-7"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="font-display text-xl font-semibold text-ink">
                  {careerLadder[active].title}
                </h4>
                <span className="font-mono text-xs text-muted">
                  {careerLadder[active].period}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-accent-soft">
                {careerLadder[active].focus}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Detail title="Responsibilities" items={careerLadder[active].responsibilities} />
                <Detail title="Impact" items={careerLadder[active].impact} accent />
              </div>

              <div className="mt-5 rounded-2xl border border-line/10 bg-line/[0.03] p-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-faint">
                  Leadership lesson
                </p>
                <p className="mt-1 text-sm italic text-ink">
                  “{careerLadder[active].lesson}”
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Detail({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-faint">
        {title}
      </p>
      <ul className="mt-2 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
            <span
              className={cn(
                "mt-2 h-1 w-1 shrink-0 rounded-full",
                accent ? "bg-ember" : "bg-accent",
              )}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
