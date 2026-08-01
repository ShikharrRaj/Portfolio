"use client";

/* Mission Control (PRD R2).
 *
 * Curated and dated — never simulated telemetry. The "as of" stamp is not
 * decoration: it is the honesty mechanism that lets a visitor tell a live
 * signal from a static claim (PRD decision D2).
 */

import { missionControl } from "@/data/os";
import { Label, Panel, Surface } from "../Surface";

export function MissionControl() {
  return (
    <Surface
      id="mission"
      aside={
        <div className="text-right">
          <Label>as of {missionControl.asOf}</Label>
          <p className="mt-1 font-mono text-[0.6rem] text-faint">{missionControl.cadence}</p>
        </div>
      }
    >
      <div className="grid gap-px border border-line/10 bg-line/10 sm:grid-cols-2 lg:grid-cols-4">
        {missionControl.readouts.map((r) => (
          <div key={r.label} className="flex flex-col gap-3 bg-bg p-6">
            <div className="flex items-center gap-2">
              {r.kind === "signal" && (
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-soft opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-soft" />
                </span>
              )}
              <Label>{r.label}</Label>
            </div>
            <p className="font-display text-xl leading-tight text-ink">{r.value}</p>
            {r.note && <p className="mt-auto text-sm leading-relaxed text-muted">{r.note}</p>}
          </div>
        ))}
      </div>

      <Panel className="mt-6 p-5">
        <p className="text-sm leading-relaxed text-muted">
          <span className="text-ink">Every value above is entered by hand.</span> Nothing here is
          a sensor, a feed, or a simulation — a dashboard that fakes being live would undermine
          every real number next to it.
        </p>
      </Panel>
    </Surface>
  );
}
