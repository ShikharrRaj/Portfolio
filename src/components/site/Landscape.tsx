/* The animated pixel landscape.
 *
 * Server-rendered layers stacked in one box and moved entirely by CSS — no
 * client JS, no canvas, no animation loop. Every layer is the same size and
 * uses the same object-fit, so they stay in register at any viewport.
 *
 * Motion is deliberately quantised. Sub-pixel drift on pixel art reads as
 * mush, so the trees and grass move in whole-pixel steps; only the clouds
 * glide continuously, and at their speed the shift is invisible frame to
 * frame.
 *
 * Stacking order is load-bearing — see the note in pixelScene.ts. In
 * particular the props layer must sit ABOVE the grass, or tufts speckle
 * straight across the laptop.
 */

import type { SceneLayers } from "@/lib/png";

const L = "pointer-events-none absolute inset-0 h-full w-full object-cover select-none";
const px = { imageRendering: "pixelated" as const };

export function Landscape({ layers }: { layers: SceneLayers }) {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-[#66B8EE]">
      {/* 1 — sky + sun */}
      <img src={layers.sky} alt="" className={L} style={px} />

      {/* 2 — clouds drift, slowly and continuously */}
      <img src={layers.clouds} alt="" className={`${L} px-drift`} style={px} />

      {/* 3 — skyline, ridges, turf (occludes the clouds behind it) */}
      <img src={layers.land} alt="" className={L} style={px} />

      {/* 4 — four frames of wind; one visible at a time */}
      {layers.grass.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className={`${L} px-grass${i === 0 ? " px-grass-first" : ""}`}
          // Negative delays so the cycle is already staggered on frame one,
          // rather than every layer sitting hidden for the first second.
          style={{ ...px, animationDelay: `${(-i * 0.25).toFixed(2)}s` }}
        />
      ))}

      {/* 5 — trunks and props, above the grass */}
      <img src={layers.props} alt="" className={L} style={px} />

      {/* 6 — canopies sway in whole pixels, out of phase with each other */}
      <img src={layers.canopyL} alt="" className={`${L} px-sway-a`} style={px} />
      <img src={layers.canopyR} alt="" className={`${L} px-sway-b`} style={px} />
    </div>
  );
}
