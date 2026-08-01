"use client";

/* Corrections — the Failure Archive surface (PRD R6).
 *
 * These are real, self-authored revisions pulled from the decision log and
 * the case files. They are corrections, not the full failure archive the
 * brief asks for: that one needs incidents only Shikhar can write.
 *
 * Per PRD decision D6 the surface stays honest about which it is rather than
 * padding to look complete. A token archive damages the credibility it
 * exists to build.
 */

import { corrections, failures } from "@/data/os";
import { useOs } from "../OsContext";
import { Label, Panel, Surface } from "../Surface";

const SCOPE_TONE: Record<string, string> = {
  Architecture: "border-accent/40 text-accent-soft",
  Delivery: "border-warm/40 text-warm",
  Product: "border-line/25 text-muted",
  Leadership: "border-line/25 text-muted",
};

export function Corrections() {
  const { noteCorrectionOpen } = useOs();

  return (
    <Surface
      id="corrections"
      aside={<Label>{failures.length > 0 ? "Full archive" : "Corrections only"}</Label>}
    >
      <p className="mb-10 max-w-2xl font-serif text-lg leading-relaxed text-muted">
        Every entry below is a decision he would make differently now, in his own words.
        Credibility is built by the things that did not work.
      </p>

      <ul className="grid gap-px border border-line/10 bg-line/10 md:grid-cols-2">
        {corrections.map((c) => (
          <li
            key={c.context}
            className="bg-bg p-6"
            onMouseEnter={noteCorrectionOpen}
            onFocus={noteCorrectionOpen}
          >
            <span
              className={`inline-block border px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.18em] ${
                SCOPE_TONE[c.scope] ?? "border-line/25 text-muted"
              }`}
            >
              {c.scope}
            </span>
            <p className="mt-4 text-sm leading-relaxed text-muted">{c.context}</p>
            <div className="mt-4 border-t border-line/[0.06] pt-4">
              <Label>Would change</Label>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">{c.wouldChange}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Honest absence, not a placeholder (PRD R6 empty state). */}
      {failures.length === 0 && (
        <Panel className="mt-6 p-6">
          <Label>Not yet written</Label>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            The harder archive — a production incident, a leadership call that went wrong, a
            project that did not work — is deliberately empty rather than filled with something
            safe. It publishes when there are real entries to publish.
          </p>
        </Panel>
      )}
    </Surface>
  );
}
