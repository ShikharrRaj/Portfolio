"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { architecture } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Architecture Lab — explore real system designs. Pick a case study, then
 * click any node in its data-flow diagram to inspect the decision behind it.
 * Decisions and tradeoffs are surfaced alongside, communicating depth.
 */
export function Architecture() {
  const [caseIdx, setCaseIdx] = useState(0);
  const [nodeId, setNodeId] = useState(architecture[0].nodes[0].id);

  const active = architecture[caseIdx];
  const node = active.nodes.find((n) => n.id === nodeId) ?? active.nodes[0];

  const selectCase = (i: number) => {
    setCaseIdx(i);
    setNodeId(architecture[i].nodes[0].id);
  };

  return (
    <section id="architecture" className="relative py-28 md:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Architecture Lab"
          title="How the systems are actually built."
          description="Real designs, the decisions behind them, and the tradeoffs I made. Click any node to inspect it."
        />

        {/* case selector */}
        <div className="mt-10 flex flex-wrap gap-2">
          {architecture.map((c, i) => (
            <button
              key={c.id}
              onClick={() => selectCase(i)}
              data-cursor=""
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                i === caseIdx
                  ? "border-accent/40 bg-accent/10 text-accent-soft"
                  : "border-line/10 text-muted hover:text-ink",
              )}
            >
              {c.title}
            </button>
          ))}
        </div>

        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr]"
        >
          {/* diagram */}
          <div className="rounded-3xl glass p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="rounded-full bg-line/[0.05] px-2.5 py-1">{active.domain}</span>
              <span className="rounded-full bg-line/[0.05] px-2.5 py-1">{active.scale}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{active.context}</p>

            {/* node flow */}
            <div className="mt-6 flex flex-col gap-2">
              {active.nodes.map((n, i) => (
                <div key={n.id} className="flex flex-col gap-2">
                  <button
                    onClick={() => setNodeId(n.id)}
                    data-cursor=""
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300",
                      n.id === nodeId
                        ? "border-accent/40 bg-accent/10 shadow-glow"
                        : "border-line/10 hover:border-line/20 hover:bg-line/[0.04]",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-lg font-mono text-xs",
                        n.id === nodeId
                          ? "bg-accent/20 text-accent-soft"
                          : "bg-line/[0.06] text-muted",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        n.id === nodeId ? "text-ink" : "text-muted",
                      )}
                    >
                      {n.label}
                    </span>
                  </button>
                  {i < active.nodes.length - 1 && (
                    <span className="ml-[26px] h-3 w-px bg-line/15" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* inspector */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl glass p-6">
              <p className="text-[10px] font-medium uppercase tracking-wider text-faint">
                Node
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="mt-1 font-display text-lg font-semibold text-ink">
                    {node.label}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{node.detail}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="rounded-3xl glass p-6">
              <p className="text-[10px] font-medium uppercase tracking-wider text-faint">
                Key decisions
              </p>
              <ul className="mt-2 space-y-2">
                {active.decisions.map((d, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink/90">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[10px] font-medium uppercase tracking-wider text-faint">
                Tradeoffs
              </p>
              <ul className="mt-2 space-y-2">
                {active.tradeoffs.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ember" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
