"use client";

/* Decision Journal (PRD R7).
 *
 * Question → context → decision → trade-off → whether it still holds.
 * An entry with no real alternative considered is an opinion, not a
 * decision, and does not belong here.
 */

import { journal } from "@/data/os";
import { Label, Surface } from "../Surface";

export function Journal() {
  return (
    <Surface id="journal" aside={<Label>{journal.length} entries</Label>}>
      <div className="grid gap-px border border-line/10 bg-line/10 md:grid-cols-2">
        {journal.map((d) => (
          <article key={d.tech} className="flex flex-col gap-5 bg-bg p-6">
            <header>
              <Label>{d.tech}</Label>
              <h3 className="mt-2 font-serif text-xl leading-snug text-ink">{d.question}</h3>
            </header>

            <p className="text-sm leading-relaxed text-muted">{d.context}</p>

            <div>
              <Label>Decision</Label>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">{d.decision}</p>
            </div>

            <div>
              <Label>Trade-off</Label>
              <p className="mt-1.5 text-sm leading-relaxed text-warm/90">{d.tradeoff}</p>
            </div>

            <div className="mt-auto border-t border-line/[0.06] pt-4">
              <Label>Does it still hold?</Label>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.reconsider}</p>
            </div>
          </article>
        ))}
      </div>
    </Surface>
  );
}
