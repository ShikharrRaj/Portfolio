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
 *   dog     WALKS  — crosses the near lawn, sits a while beside him, moves on
 *   figure  the man himself; see the three groups below
 *   bough   CYCLES — the overhanging branch, nearest the viewer
 *
 * The layers are additionally grouped into four depth planes that drift at
 * different rates as the hero scrolls away. Parallax is applied to the
 * GROUP wrappers, never to the images: the images already carry their own
 * flipbook animations, and an element can only have one animation-timeline
 * per animation slot without the shorthand becoming unreadable.
 *
 * THE FIGURE is three groups, only one of which is ever visible:
 *
 *   type  the default, and the one that runs almost all the time. A body
 *         carrying the typing cycle plus one of three heads, kept as
 *         separate layers so that turning his head does not multiply the
 *         typing frames. The typing never stops; the dog arriving is
 *         something he looks at, not something he breaks off for.
 *   pack  he closes the laptop as the hero scrolls away. Driven by
 *         animation-timeline, so it is scrub-accurate and costs no JS.
 *   wave  he stands up. Switched on by SceneStage after the fifth tap.
 *
 * Everything here is decorative and marked aria-hidden. The one thing a
 * screen reader or a keyboard should reach — the tap target — is not in
 * this file; it lives in SceneStage, outside the hidden subtree.
 */

import type { SceneLayers } from "@/lib/png";

const L = "pointer-events-none absolute inset-0 h-full w-full object-cover select-none";
const px = { imageRendering: "pixelated" as const };

/* Written out rather than built with `px-head-${dir}`. The stylesheet's
 * hand-written rules live in @layer utilities, which Tailwind tree-shakes
 * against the source text — a class name assembled at runtime is not in
 * the source text, so the rule is dropped and the head silently vanishes.
 * Index order matches SceneLayers.head and .pack. */
const HEAD_CLASS = ["px-head-l", "px-head-c", "px-head-r"];
const PACK_CLASS = ["px-pack-0", "px-pack-1", "px-pack-2", "px-pack-3"];

/* The typing frames stagger by a QUARTER OF THE BEAT, not by a fixed
 * number of seconds — and the beat is a custom property the stage rewrites
 * when the pointer is near or the page is scrolling hard. Inline delays of
 * -0.18s are only a quarter of the default 0.72s; the moment the beat drops
 * to 0.34s those same delays stop lining up and frames overlap or none show
 * at all. The stylesheet expresses each as calc() against the live beat. */
const BODY_CLASS = ["px-b0", "px-b1", "px-b2", "px-b3"];

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

        {/* The dog. The walk lives on the wrapper and the legs on the
            frames, so neither has to share an animation slot. Walking and
            sitting are separate sets swapped on the same 26s cycle that
            moves the wrapper — that is what makes it sit down at the exact
            moment it stops moving. */}
        <div className={`${L} px-dog-walk`}>
          <div className={`${L} px-dog-going`}>
            {layers.dog.map((src, i) => (
              <img
                key={`d${i}`}
                src={src}
                alt=""
                className={`${L} px-dog${i === 0 ? " px-frame-first" : ""}`}
                style={{ ...px, animationDelay: `${(-i * 0.14).toFixed(2)}s` }}
              />
            ))}
          </div>
          <div className={`${L} px-dog-stopped`}>
            {layers.dogSit.map((src, i) => (
              <img
                key={`s${i}`}
                src={src}
                alt=""
                className={`${L} px-dogsit`}
                style={{ ...px, animationDelay: `${(-i * 0.3).toFixed(2)}s` }}
              />
            ))}
          </div>
        </div>

        {/* The seated figure, typing. Nothing interrupts this cycle — the
            dog coming and going is his to watch, not to stop work for. */}
        <div className={`${L} px-fig-type`}>
          {layers.body.map((src, i) => (
            <img
              key={`b${i}`}
              src={src}
              alt=""
              className={`${L} px-body ${BODY_CLASS[i]}${i === 0 ? " px-frame-first" : ""}`}
              style={px}
            />
          ))}
          {/* head.length is HEAD_DIRS: shaded side, level, lit side.
              The NOD lives on this wrapper and the direction on the frames,
              so neither has to share an animation slot — the same split the
              dog's walk uses. It has to be a wrapper: the three heads
              already spend their own slot on the idle glance. */}
          <div className={`${L} px-nod`}>
            {layers.head.map((src, i) => (
              <img
                key={`h${i}`}
                src={src}
                alt=""
                className={`${L} px-head ${HEAD_CLASS[i]}`}
                style={px}
              />
            ))}
          </div>
        </div>

        {/* the figure, packing up — scroll-driven */}
        <div className={`${L} px-fig-pack`}>
          {layers.pack.map((src, i) => (
            <img key={`p${i}`} src={src} alt="" className={`${L} ${PACK_CLASS[i]}`} style={px} />
          ))}
        </div>

        {/* the figure, on his feet */}
        <div className={`${L} px-fig-wave`}>
          {layers.wave.map((src, i) => (
            <img
              key={`w${i}`}
              src={src}
              alt=""
              className={`${L} px-wave${i === 0 ? " px-frame-first" : ""}`}
              style={{ ...px, animationDelay: `${(-i * 0.11).toFixed(2)}s` }}
            />
          ))}
        </div>
      </div>

      {/* foreground — the bough overhead moves most */}
      <div className={`${L} px-depth-fore`}>
        {layers.bough.map((src, i) => (
          <img
            key={`o${i}`}
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
