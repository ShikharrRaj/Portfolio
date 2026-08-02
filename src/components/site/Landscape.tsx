/* The animated pixel landscape.
 *
 * Server-rendered layers stacked in one box and moved entirely by CSS — no
 * client JS, no canvas, no animation loop. Every layer is the same size and
 * uses the same object-fit, so they stay in register at any viewport.
 *
 * Stacking order is load-bearing:
 *
 *   sky     the reference's own sky, rebuilt as a clean gradient, plus a sun
 *   clouds  DRIFTS — behind the city, so buildings occlude them
 *   front   skyline, treeline, lawn, and the meadow replacing the shadow
 *   grass   CYCLES — four frames of wind in the foreground turf
 *   me      CYCLES — the figure on the lawn, typing
 *   bough   CYCLES — the overhanging branch, nearest the viewer
 *
 * The layers are additionally grouped into four depth planes that drift at
 * different rates as the hero scrolls away. Parallax is applied to the
 * GROUP wrappers, never to the images: the images already carry their own
 * flipbook animations, and an element can only have one animation-timeline
 * per animation slot without the shorthand becoming unreadable.
 */

import type { SceneLayers } from "@/lib/png";

const L = "pointer-events-none absolute inset-0 h-full w-full object-cover select-none";
const px = { imageRendering: "pixelated" as const };

export function Landscape({ layers }: { layers: SceneLayers }) {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-clip bg-[#5197D2]">
      {/* far — sky and clouds barely move */}
      <div className={`${L} px-depth-far`}>
        <img src={layers.sky} alt="" className={L} style={px} />
        <img src={layers.clouds} alt="" className={`${L} px-drift`} style={px} />
      </div>

      {/* mid — the city, treeline and lawn */}
      <div className={`${L} px-depth-mid`}>
        <img src={layers.front} alt="" className={L} style={px} />
      </div>

      <div className={`${L} px-depth-near`}>

      {layers.grass.map((src, i) => (
        <img
          key={`g${i}`}
          src={src}
          alt=""
          className={`${L} px-grass${i === 0 ? " px-frame-first" : ""}`}
          // Negative delays so the cycle is already staggered on frame one,
          // rather than every layer sitting hidden for the first second.
          style={{ ...px, animationDelay: `${(-i * 0.25).toFixed(2)}s` }}
        />
      ))}

      {layers.me.map((src, i) => (
        <img
          key={`m${i}`}
          src={src}
          alt=""
          className={`${L} px-person${i === 0 ? " px-frame-first" : ""}`}
          style={{ ...px, animationDelay: `${(-i * 0.18).toFixed(2)}s` }}
        />
      ))}

      </div>

      {/* foreground — the bough overhead moves most */}
      <div className={`${L} px-depth-fore`}>
      {layers.bough.map((src, i) => (
        <img
          key={`b${i}`}
          src={src}
          alt=""
          className={`${L} px-bough${i === 0 ? " px-frame-first" : ""}`}
          style={{ ...px, animationDelay: `${(-i * 0.7).toFixed(2)}s` }}
        />
      ))}
      </div>
    </div>
  );
}
