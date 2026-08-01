"use client";

/* Start a Collaboration (PRD R10) + the ending (PRD R11).
 *
 * Intent first, contact second. The direct route is always visible — a
 * visitor who wants to skip straight to email never has to play along.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { collaborate, ending } from "@/data/os";
import { profile } from "@/data/portfolio";
import { Label, Surface } from "../Surface";

export function Collaborate() {
  const [intent, setIntent] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const chosen = collaborate.intents.find((i) => i.id === intent);

  const mailto = chosen
    ? `mailto:${profile.email}?subject=${encodeURIComponent(chosen.label)}`
    : `mailto:${profile.email}`;

  return (
    <Surface id="collab">
      <h3 className="max-w-2xl font-serif text-3xl leading-tight text-ink sm:text-4xl">
        {collaborate.question}
      </h3>

      <div className="mt-10 grid gap-px border border-line/10 bg-line/10 sm:grid-cols-2">
        {collaborate.intents.map((i) => {
          const active = intent === i.id;
          return (
            <button
              key={i.id}
              type="button"
              aria-pressed={active}
              onClick={() => setIntent(active ? null : i.id)}
              className={`group flex flex-col gap-2 p-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent ${
                active ? "bg-surface" : "bg-bg hover:bg-surface/60"
              }`}
            >
              <span
                className={`font-display text-lg ${active ? "text-accent-soft" : "text-ink"}`}
              >
                {i.label}
              </span>
              <span className="text-sm leading-relaxed text-muted">{i.follow}</span>
            </button>
          );
        })}
      </div>

      {/* The response adapts to the stated intent. */}
      <motion.div
        initial={false}
        animate={{ opacity: chosen ? 1 : 0.55 }}
        transition={{ duration: reduce ? 0 : 0.3 }}
        className="mt-8 border border-line/10 bg-surface/60 p-6"
      >
        {chosen ? (
          <>
            <Label>Then the next step is simple</Label>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              Tell him what you are building and the constraint you are up against. That is the
              part he will want to think about before the call.
            </p>
            <a
              href={mailto}
              className="mt-5 inline-flex items-center gap-2 border border-accent/50 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-accent-soft transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              Write to him <span aria-hidden>→</span>
            </a>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Pick one above and this adapts — or skip it entirely and use a direct channel below.
          </p>
        )}
      </motion.div>

      {/* Direct routes — always available (PRD R10 empty state). */}
      <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
        {collaborate.direct.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              className="group font-mono text-xs text-muted transition-colors hover:text-accent-soft focus-visible:text-accent-soft focus-visible:outline-none"
            >
              <span className="text-faint">{s.label}</span>{" "}
              <span className="underline-offset-4 group-hover:underline">{s.handle}</span>
            </a>
          </li>
        ))}
      </ul>

      {/* The ending — a statement, not a contact form (PRD R11). */}
      <div className="mt-24 border-t border-line/10 pt-16">
        <p className="max-w-3xl font-serif text-3xl leading-[1.18] tracking-tight text-muted sm:text-4xl md:text-5xl">
          {ending.statement}
          <br />
          <span className="text-ink">{ending.counter}</span>
        </p>
      </div>
    </Surface>
  );
}
