"use client";

/* The world.
 *
 * The park fills the screen. Clicking a signpost opens a card — styled as a
 * game dialogue box, not a document. Content is real, pulled from
 * src/data/portfolio.ts.
 */

import { useEffect, useState } from "react";
import { HOTSPOTS, SCENE, type Hotspot } from "@/data/world";
import {
  corrections as osCorrections,
  caseFiles,
  timeline as osTimeline,
} from "@/data/os";
import { experiences, profile } from "@/data/portfolio";
import { ParkScene } from "./ParkScene";

/* ---- content per place ------------------------------------------- */

function panelFor(id: string): { title: string; lines: { h: string; b: string }[] } {
  switch (id) {
    case "hello":
      return {
        title: "The Entrance",
        lines: [
          { h: profile.name, b: profile.tagline },
          { h: "Based in", b: `${profile.location} · ${profile.availability}` },
        ],
      };
    case "bridge":
      return {
        title: "Bow Bridge — the crossings",
        lines: osTimeline
          .slice(0, 5)
          .map((t) => ({ h: `${t.year} · ${t.title}`, b: t.tradeoff })),
      };
    case "skyline":
      return {
        title: "The Skyline — where he's worked",
        lines: experiences.map((e) => ({
          h: `${e.company} · ${e.role}`,
          b: `${e.period} — ${e.summary}`,
        })),
      };
    case "lawn":
      return {
        title: "The Great Lawn — things he built",
        lines: caseFiles.map((c) => ({
          h: `${c.title}${c.client ? ` · ${c.client}` : ""}`,
          b: c.tagline,
        })),
      };
    case "bench":
      return {
        title: "A Bench — what he'd redo",
        lines: osCorrections.map((c) => ({ h: c.scope, b: c.wouldChange })),
      };
    default:
      return { title: "", lines: [] };
  }
}

export function PixelWorld() {
  const [active, setActive] = useState<Hotspot | null>(null);
  const [walkerX, setWalkerX] = useState(20);

  // The walker strolls the path and turns around at the edges.
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let dir = 1;
    const t = window.setInterval(() => {
      setWalkerX((x) => {
        const next = x + dir;
        if (next > SCENE.w - 14) dir = -1;
        if (next < 6) dir = 1;
        return next;
      });
    }, 220);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const panel = active ? panelFor(active.id) : null;

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-[#7FD3F7]">
      {/* The park */}
      <div className="absolute inset-0">
        <ParkScene active={active?.id ?? null} onSelect={setActive} walkerX={walkerX} />
      </div>

      {/* Title plate — a game HUD, not a masthead */}
      <div className="pointer-events-none relative z-10 px-5 pt-6 sm:px-10 sm:pt-10">
        <div className="world-panel pointer-events-auto inline-block px-4 py-3">
          <p className="font-pixel text-[0.6rem] leading-none text-[#8A5628]">
            SHIKHAR RAJ
          </p>
          <p className="mt-2 font-pixel text-[0.5rem] leading-relaxed text-[#5A4632]">
            TECH LEAD · CENTRAL PARK, 4PM
          </p>
        </div>
      </div>

      {/* Signpost legend */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-6 sm:px-10 sm:pb-8">
        <div className="world-panel pointer-events-auto mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3">
          <span className="font-pixel text-[0.5rem] text-[#8A5628]">VISIT ›</span>
          {HOTSPOTS.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setActive(h)}
              className="font-pixel text-[0.5rem] text-[#3E6B2C] transition-transform hover:-translate-y-0.5 hover:text-[#E8574A] focus-visible:-translate-y-0.5 focus-visible:text-[#E8574A] focus-visible:outline-none"
            >
              {h.place.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Dialogue box */}
      {active && panel && (
        <div
          className="absolute inset-0 z-20 flex items-end justify-center bg-[#1B3A2E]/30 p-4 sm:items-center"
          onClick={() => setActive(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={panel.title}
            onClick={(e) => e.stopPropagation()}
            className="world-panel world-pop w-full max-w-2xl p-5 sm:p-7"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[0.45rem] text-[#8A5628]">
                  {active.label.toUpperCase()}
                </p>
                <h2 className="mt-2 font-pixel text-[0.7rem] leading-relaxed text-[#2F4A22]">
                  {panel.title.toUpperCase()}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="shrink-0 border-2 border-[#8A5628] bg-[#F5E6C8] px-2 py-1 font-pixel text-[0.5rem] text-[#8A5628] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8574A]"
              >
                ESC
              </button>
            </div>

            <ul className="max-h-[52vh] space-y-4 overflow-y-auto pr-1">
              {panel.lines.map((l, i) => (
                <li key={i} className="border-l-4 border-[#79C45C] pl-3">
                  <p className="font-pixel text-[0.5rem] leading-relaxed text-[#2F4A22]">
                    {l.h}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#4A4034]">{l.b}</p>
                </li>
              ))}
            </ul>

            <p className="mt-5 border-t-2 border-dashed border-[#C3B597] pt-3 font-pixel text-[0.45rem] text-[#8A5628]">
              CLICK ANYWHERE TO WALK AWAY
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
