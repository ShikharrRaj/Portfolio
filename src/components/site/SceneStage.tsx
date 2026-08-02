"use client";

/* =====================================================================
 *  SCENE STAGE — the only client code in the hero
 *  ---------------------------------------------------------------------
 *  The landscape itself stays server-rendered and CSS-driven. This adds
 *  the parts that genuinely need to know about the visitor, and nothing
 *  else:
 *
 *    · which way he looks      — pointer position, three head sprites
 *    · how fast he types       — pointer nearby, or the page scrolling
 *    · what he says            — tap him, one line per tap
 *    · standing up to wave     — every fifth tap
 *    · time of day             — the visitor's own clock, tinting the scene
 *
 *  Everything is expressed as data-* attributes on one wrapper, and the
 *  stylesheet does the rest. No layer is animated from JavaScript, so the
 *  flipbooks stay on the compositor and the whole thing still works —
 *  frozen, facing forward, at noon — if this component never hydrates.
 *
 *  THE GEOMETRY PROBLEM. The scene is a 384×216 image drawn with
 *  object-cover, so it is scaled AND cropped, and where the figure lands
 *  on screen is not a fixed percentage of anything. The tap target has to
 *  be placed by redoing the cover maths (below) against the live box.
 *  Guessing with percentages puts the hotspot on his knees at one width
 *  and off him entirely at another.
 * ===================================================================== */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** The scene's own coordinate system — see lib/pixelScene.ts. */
const SCENE_W = 384;
const SCENE_H = 216;

/** The figure's bounding box in those coordinates: hair top to the far
 *  edge of his contact shadow. Keep in step with PERSON_AT in lib/person.ts. */
const FIG = { x: 209, y: 136, w: 47, h: 71 };

/**
 * How far the dog travels, in scene pixels, from where it is painted.
 *
 * It has to STOP beside him — that is the whole point of the walk — and
 * the stylesheet cannot express that. Those layers are object-cover, so a
 * percentage of the element is only a percentage of the scene at one
 * aspect ratio; anywhere else the dog would halt short of him or walk
 * through him. Multiplying these by the live cover scale gives pixel
 * stops that land correctly at every viewport.
 *
 * `stop` parks it just off his left elbow, close enough to read as company
 * without overlapping him; the other two are far enough out to be
 * off-frame, so the loop's snap back happens unseen.
 */
const DOG_RUN = { from: -60, stop: 166, to: 400 };

type Look = "l" | "c" | "r";
type Act = "idle" | "wave";
type Tod = "dawn" | "day" | "dusk" | "night";

/** Typing speeds, seconds per four-beat cycle. */
const BEAT_IDLE = 0.72;
const BEAT_NEAR = 0.5;
const BEAT_RUSH = 0.34;

/** Scroll speed, px/ms, past which he starts hammering the keyboard. */
const RUSH_AT = 1.1;
/** Taps before he gets up and waves. */
const TAPS_TO_WAVE = 5;
const WAVE_MS = 3400;
const BUBBLE_MS = 6000;

function timeOfDay(hour: number): Tod {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

type Box = { left: number; top: number; width: number; height: number };

/** Where the figure actually lands, given object-cover on this box. */
function figureBox(r: DOMRect): Box {
  const scale = Math.max(r.width / SCENE_W, r.height / SCENE_H);
  const offX = (r.width - SCENE_W * scale) / 2;
  const offY = (r.height - SCENE_H * scale) / 2;
  return {
    left: offX + FIG.x * scale,
    top: offY + FIG.y * scale,
    width: FIG.w * scale,
    height: FIG.h * scale,
  };
}

export function SceneStage({
  lines,
  children,
}: {
  lines: readonly string[];
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Rendered state. Deliberately coarse — these change a handful of times
  // a session, not per frame.
  const [box, setBox] = useState<Box | null>(null);
  const [look, setLook] = useState<Look>("c");
  const [act, setAct] = useState<Act>("idle");
  const [tod, setTod] = useState<Tod>("day");
  const [said, setSaid] = useState<string | null>(null);
  /** Whether a pointer is currently steering him. When it is not, he falls
   *  back to the idle glance that follows the pigeon across the lawn. */
  const [tracking, setTracking] = useState(false);

  // Per-frame state. Kept in refs and written straight to a custom
  // property, so pointer and scroll traffic never re-renders the tree.
  const nearRef = useRef(false);
  const rushRef = useRef(false);
  const tapsRef = useRef(0);

  const applyBeat = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const beat = rushRef.current ? BEAT_RUSH : nearRef.current ? BEAT_NEAR : BEAT_IDLE;
    el.style.setProperty("--px-beat", `${beat}s`);
  }, []);

  /* ---- where he is on screen ------------------------------------- */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      setBox(figureBox(r));
      // Same cover scale the box uses, handed to the dog's keyframes so it
      // stops beside him rather than at a percentage that only happens to
      // be right on a 16:9 hero.
      const scale = Math.max(r.width / SCENE_W, r.height / SCENE_H);
      // One scene pixel, in screen pixels. The nod is a one-pixel dip and
      // has to be exactly that at any viewport — a percentage is only the
      // right number of pixels at one aspect ratio.
      el.style.setProperty("--px-px", `${scale}px`);
      el.style.setProperty("--px-dog-from", `${DOG_RUN.from * scale}px`);
      el.style.setProperty("--px-dog-at", `${DOG_RUN.stop * scale}px`);
      el.style.setProperty("--px-dog-to", `${DOG_RUN.to * scale}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ---- the visitor's clock ---------------------------------------- */
  useEffect(() => {
    // Set after mount, never during render: the server has no idea what
    // time it is where the visitor is, and guessing would mismatch.
    const tick = () => setTod(timeOfDay(new Date().getHours()));
    tick();
    const id = window.setInterval(tick, 10 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  /* ---- he looks at the pointer ------------------------------------ */
  useEffect(() => {
    // A head that tracks a finger is a head that snaps around on every
    // tap, so this is for real pointers only. Touch keeps the idle turn.
    if (!window.matchMedia("(hover: hover)").matches) return;

    let raf = 0;
    let last: { x: number; y: number } | null = null;

    const flush = () => {
      raf = 0;
      const el = rootRef.current;
      const p = last;
      if (!el || !p) return;
      const r = el.getBoundingClientRect();

      const inside = p.y >= r.top && p.y <= r.bottom && p.x >= r.left && p.x <= r.right;
      if (!inside) {
        if (nearRef.current) {
          nearRef.current = false;
          applyBeat();
          setTracking(false);
          setLook("c");
        }
        return;
      }
      if (!nearRef.current) {
        nearRef.current = true;
        applyBeat();
        setTracking(true);
      }

      const f = figureBox(r);
      const centre = r.left + f.left + f.width / 2;
      const dx = p.x - centre;
      // A dead zone a little wider than he is, so he is not flicking
      // between sprites while the pointer sits over his own head.
      const dead = f.width * 0.6;
      setLook(dx < -dead ? "l" : dx > dead ? "r" : "c");
    };

    const onMove = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [applyBeat]);

  /* ---- and types faster while the page is moving ------------------- */
  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;
    let idle = 0;

    const flush = () => {
      raf = 0;
      const now = performance.now();
      const dt = now - lastT;
      if (dt < 1) return;
      const speed = Math.abs(window.scrollY - lastY) / dt;
      lastY = window.scrollY;
      lastT = now;

      const rushing = speed > RUSH_AT;
      if (rushing !== rushRef.current) {
        rushRef.current = rushing;
        applyBeat();
      }
      // Scrolling stops without firing an event, so the rush has to time
      // itself out rather than wait for a "stopped" signal that never comes.
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (rushRef.current) {
          rushRef.current = false;
          applyBeat();
        }
      }, 260);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(flush);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [applyBeat]);

  /* ---- tap him ----------------------------------------------------- */
  const waveTimer = useRef(0);
  const bubbleTimer = useRef(0);

  useEffect(
    () => () => {
      window.clearTimeout(waveTimer.current);
      window.clearTimeout(bubbleTimer.current);
    },
    [],
  );

  const tap = useCallback(() => {
    const n = tapsRef.current + 1;
    tapsRef.current = n;

    setSaid(lines.length ? lines[(n - 1) % lines.length] : null);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setSaid(null), BUBBLE_MS);

    if (n % TAPS_TO_WAVE === 0) {
      setAct("wave");
      window.clearTimeout(waveTimer.current);
      waveTimer.current = window.setTimeout(() => setAct("idle"), WAVE_MS);
    }
  }, [lines]);

  const dismiss = useCallback(() => {
    window.clearTimeout(bubbleTimer.current);
    setSaid(null);
  }, []);

  return (
    <div
      ref={rootRef}
      className="px-stage absolute inset-0"
      data-look={look}
      data-track={tracking ? "on" : "off"}
      data-act={act}
      data-tod={tod}
      onKeyDown={(e) => {
        if (e.key === "Escape") dismiss();
      }}
    >
      {children}

      {/* Time of day, as a wash over the finished scene. Re-rendering every
          layer four times over would have cost four times the PNGs for a
          shift a tint reproduces almost exactly. */}
      <div aria-hidden className="px-tint pointer-events-none absolute inset-0 -z-10" />

      {/* Above the art, below the hero copy: it must be clickable without
          swallowing selection on the headline. */}
      <div className="pointer-events-none absolute inset-0">
        {box && (
          <button
            type="button"
            onClick={tap}
            aria-expanded={said !== null}
            aria-controls="scene-says"
            className="pointer-events-auto absolute cursor-pointer rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            style={{
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
            }}
          >
            <span className="sr-only">
              Shikhar, working on the lawn. Activate to hear what he is working on.
            </span>
          </button>
        )}

        <div
          id="scene-says"
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute"
          style={
            box
              ? { left: box.left + box.width / 2, top: Math.max(8, box.top - 10) }
              : { left: "50%", top: 0 }
          }
        >
          {said && (
            <p className="px-says -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900/85 px-3.5 py-2 text-center text-sm leading-snug text-white shadow-lg backdrop-blur-md">
              {said}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
