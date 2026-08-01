"use client";

/* The park itself.
 *
 * One SVG, drawn back to front: sky bands → clouds → Manhattan → treeline
 * → lake → Bow Bridge → lawn → foreground planting → ducks → walker.
 * The whole thing scales to its container, so the art is identical on a
 * phone and a 5K display — just bigger pixels.
 */

import {
  BANDS,
  BRIDGE,
  BRIDGE_AT,
  CHARACTER,
  CLOUDS,
  DUCKS,
  FOREGROUND,
  HOTSPOTS,
  SCENE,
  SKYLINE,
  TREELINE,
  PALETTE,
  type Hotspot,
} from "@/data/world";
import { Sprite } from "./Sprite";

/** Warm windows, scattered deterministically so the render is stable. */
function windowsFor(b: { x: number; w: number; h: number }, top: number) {
  const out: { x: number; y: number }[] = [];
  for (let row = 2; row < b.h - 1; row += 3) {
    for (let col = 1; col < b.w - 1; col += 3) {
      // Deterministic pseudo-scatter — no Math.random, so SSR and client agree.
      if ((b.x * 7 + row * 13 + col * 5) % 5 !== 0) continue;
      out.push({ x: b.x + col, y: top + row });
    }
  }
  return out;
}

export function ParkScene({
  active,
  onSelect,
  walkerX,
}: {
  active: string | null;
  onSelect: (h: Hotspot) => void;
  walkerX: number;
}) {
  const skylineBase = 46;

  return (
    <svg
      viewBox={`0 0 ${SCENE.w} ${SCENE.h}`}
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="crispEdges"
      className="h-full w-full"
      role="img"
      aria-label="A pixel-art afternoon in Central Park, with the Manhattan skyline over the treeline and signposts marking places to explore."
    >
      {/* Sky, water and lawn as flat bands */}
      {BANDS.map((b, i) => (
        <rect key={i} x={0} y={b.y} width={SCENE.w} height={b.h} fill={b.fill} />
      ))}

      {/* Sun */}
      <g>
        <rect x={198} y={10} width={12} height={12} fill="#FFF3B0" />
        <rect x={200} y={8} width={8} height={16} fill="#FFF3B0" />
        <rect x={196} y={12} width={16} height={8} fill="#FFF3B0" />
        <rect x={200} y={12} width={8} height={8} fill="#FFFFFF" />
      </g>

      {CLOUDS.map((c, i) => (
        <Sprite key={`cl${i}`} grid={c.sprite} x={c.x} y={c.y} opacity={0.95} />
      ))}

      {/* Manhattan over the trees */}
      <g>
        {SKYLINE.map((b, i) => {
          const top = skylineBase - b.h;
          return (
            <g key={`sk${i}`}>
              <rect x={b.x} y={top} width={b.w} height={b.h} fill={PALETTE[b.shade]} />
              {/* lit edge */}
              <rect x={b.x} y={top} width={1} height={b.h} fill="#EFF3F9" opacity={0.5} />
              {windowsFor(b, top).map((w, j) => (
                <rect key={j} x={w.x} y={w.y} width={1} height={1} fill={PALETTE.Y} />
              ))}
            </g>
          );
        })}
      </g>

      {/* Treeline hides the base of the city */}
      {TREELINE.map((t, i) => (
        <Sprite key={`tl${i}`} grid={t.sprite} x={t.x} y={t.y} />
      ))}

      {/* Far bank */}
      <rect x={0} y={66} width={SCENE.w} height={8} fill="#5FA845" />
      <rect x={0} y={72} width={SCENE.w} height={2} fill="#4A8F36" />

      {/* Lake shimmer — a few lighter streaks */}
      {[
        [12, 84, 18],
        [40, 88, 12],
        [78, 86, 22],
        [130, 90, 16],
        [176, 84, 20],
        [206, 89, 14],
      ].map(([x, y, w], i) => (
        <rect key={`sh${i}`} x={x} y={y} width={w} height={1} fill={PALETTE.x} opacity={0.85} />
      ))}

      <Sprite grid={BRIDGE} x={BRIDGE_AT.x} y={BRIDGE_AT.y} />

      {DUCKS.map((d, i) => (
        <Sprite key={`dk${i}`} grid={d.sprite} x={d.x} y={d.y} />
      ))}

      {/* Winding path across the lawn */}
      <g>
        <rect x={0} y={118} width={SCENE.w} height={6} fill={PALETTE.p} />
        <rect x={0} y={118} width={SCENE.w} height={1} fill={PALETTE.q} />
        <rect x={0} y={123} width={SCENE.w} height={1} fill={PALETTE.q} />
      </g>

      {/* Grass texture — sparse tufts, deterministic */}
      {Array.from({ length: 46 }, (_, i) => {
        const x = (i * 17 + 5) % SCENE.w;
        const y = 100 + ((i * 29) % 34);
        if (y > 116 && y < 126) return null; // keep the path clear
        return <rect key={`gt${i}`} x={x} y={y} width={1} height={1} fill={PALETTE.i} />;
      })}

      {FOREGROUND.map((f, i) => (
        <Sprite key={`fg${i}`} grid={f.sprite} x={f.x} y={f.y} />
      ))}

      {/* The walker — strolls the path */}
      <Sprite grid={CHARACTER} x={walkerX} y={108} />

      {/* Hotspot markers */}
      {HOTSPOTS.map((h) => {
        const on = active === h.id;
        return (
          <g
            key={h.id}
            transform={`translate(${h.x} ${h.y})`}
            className="cursor-pointer"
            onClick={() => onSelect(h)}
            role="button"
            tabIndex={0}
            aria-label={`${h.place} — ${h.label}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(h);
              }
            }}
          >
            {/* generous invisible hit area */}
            <rect x={-6} y={-10} width={16} height={22} fill="transparent" />
            <g className="world-bob" style={{ animationDelay: `${h.x * 13 % 900}ms` }}>
              <rect x={0} y={0} width={5} height={7} fill={on ? "#FFFFFF" : PALETTE[2]} />
              <rect x={-1} y={-1} width={7} height={9} fill="none" stroke={PALETTE.o} strokeWidth={1} />
              <rect x={2} y={7} width={1} height={5} fill={PALETTE.f} />
              <rect x={1} y={2} width={3} height={1} fill={PALETTE.o} />
              <rect x={1} y={4} width={2} height={1} fill={PALETTE.o} />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
