/* =====================================================================
 *  PIXEL SCENE PAINTER
 *  ---------------------------------------------------------------------
 *  Paints a detailed pixel-art landscape into an RGBA buffer at a fixed
 *  logical resolution. The canvas is then scaled up with
 *  `image-rendering: pixelated`, so every pixel stays square and hard.
 *
 *  Detail at this density comes from three things, not from more colours:
 *    1. ORDERED DITHERING between adjacent shades (Bayer 4x4). This is
 *       what reads as painterly rather than flat.
 *    2. A consistent light direction — sun is upper-right, so every
 *       canopy, cloud and hill is lit top-right and shadowed lower-left.
 *    3. Deterministic noise. Everything is seeded, so the scene is
 *       byte-identical on every render, every reload, server and client.
 * ===================================================================== */

export const W = 384;
export const H = 216;

/* ---- deterministic RNG ------------------------------------------- */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth 1-D value noise — used for hill crests and cloud edges. */
function noise1(x: number, seed: number) {
  const i = Math.floor(x);
  const f = x - i;
  const r = (n: number) => {
    const s = Math.sin((n + seed) * 127.1) * 43758.5453;
    return s - Math.floor(s);
  };
  const u = f * f * (3 - 2 * f);
  return r(i) * (1 - u) + r(i + 1) * u;
}

/* ---- palette ------------------------------------------------------ */

export type RGB = readonly [number, number, number];

const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

export const P = {
  skyTop: hex("#3E9BE0"),
  skyMid: hex("#66B8EE"),
  skyLow: hex("#9AD4F5"),
  skyHaze: hex("#CDEBFB"),

  cloudLit: hex("#FFFFFF"),
  cloudMid: hex("#E8F2FB"),
  cloudShade: hex("#C2D8EC"),
  cloudDeep: hex("#A3BFDA"),

  cityFar: hex("#8FA9C4"),
  cityMid: hex("#7891B0"),
  cityNear: hex("#61799B"),
  cityLit: hex("#B7C9DC"),
  window: hex("#FFE9A8"),

  hillFar: hex("#7FB45C"),
  hillFarShade: hex("#6BA24E"),
  hillMid: hex("#6FAE4A"),
  hillMidShade: hex("#5B963C"),
  grassLit: hex("#9BD05F"),
  grass: hex("#7CBB4C"),
  grassShade: hex("#63A03C"),
  grassDeep: hex("#4E8531"),
  grassDark: hex("#3D6B27"),

  leafLit: hex("#8FD05A"),
  leaf: hex("#5FA83F"),
  leafShade: hex("#417F2E"),
  leafDeep: hex("#2E5F22"),
  bark: hex("#7A5433"),
  barkShade: hex("#573A22"),

  metal: hex("#C9CFD8"),
  metalShade: hex("#9AA3AF"),
  metalDark: hex("#6E7681"),
  screen: hex("#8FD3F5"),
  screenDark: hex("#1F2A37"),

  cloth: hex("#E86A5A"),
  clothShade: hex("#C24A3C"),
  clothLit: hex("#F2907F"),
  paper: hex("#F6EEDC"),

  petalY: hex("#FFD24A"),
  petalW: hex("#FFF6E0"),
  stem: hex("#4E8531"),
} as const;

/* ---- buffer ------------------------------------------------------- */

export type Buf = { data: Uint8ClampedArray; w: number; h: number };

export function makeBuf(w = W, h = H): Buf {
  return { data: new Uint8ClampedArray(w * h * 4), w, h };
}

function set(b: Buf, xf: number, yf: number, c: RGB) {
  // Several layers loop over fractional bounds. Typed arrays silently drop
  // fractional indices, so coordinates are floored here rather than at
  // every call site.
  const x = Math.floor(xf);
  const y = Math.floor(yf);
  if (x < 0 || y < 0 || x >= b.w || y >= b.h) return;
  const i = (y * b.w + x) * 4;
  b.data[i] = c[0];
  b.data[i + 1] = c[1];
  b.data[i + 2] = c[2];
  b.data[i + 3] = 255;
}

/** Bayer 4x4 — the ordered-dither threshold matrix. */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/**
 * Pick between two shades using the dither matrix. `t` is 0..1; at 0 you
 * get `lo`, at 1 you get `hi`, and in between you get a stable stipple.
 */
function dither(x: number, y: number, t: number, lo: RGB, hi: RGB): RGB {
  // Coordinates can be fractional or negative here; wrap them into 0..3 so
  // the matrix lookup is always defined.
  const bx = ((Math.floor(x) % 4) + 4) % 4;
  const by = ((Math.floor(y) % 4) + 4) % 4;
  const threshold = (BAYER[by][bx] + 0.5) / 16;
  return t > threshold ? hi : lo;
}

/* ---- scene elements still in use ----------------------------------- */
/*
 *  The procedural park this file used to draw has been replaced by the
 *  photograph conversion in photoScene.ts. What remains are the two
 *  elements that are ADDED to the reference — a sun and clouds — plus the
 *  buffer, palette and dithering primitives they share.
 */

export function sun(b: Buf, cx = 246, cy = 28) {
  for (let y = cy - 16; y <= cy + 16; y++) {
    for (let x = cx - 16; x <= cx + 16; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d < 9) set(b, x, y, P.cloudLit);
      else if (d < 16) {
        // soft dithered halo
        const t = 1 - (d - 9) / 7;
        if (dither(x, y, t * 0.75, P.skyMid, P.cloudLit) === P.cloudLit)
          set(b, x, y, P.cloudMid);
      }
    }
  }
}

/** One cumulus: a union of discs, shaded by height within the cloud. */
export function cloud(b: Buf, cx: number, cy: number, scale: number, seed: number) {
  const rnd = mulberry32(seed);
  const lobes: { x: number; y: number; r: number }[] = [];
  const n = 5 + Math.floor(rnd() * 3);
  for (let i = 0; i < n; i++) {
    lobes.push({
      x: cx + (i - n / 2) * scale * 7 + (rnd() - 0.5) * scale * 6,
      y: cy + (rnd() - 0.5) * scale * 5,
      r: scale * (7 + rnd() * 6),
    });
  }
  // a fat base lobe keeps the bottom flat, like real cumulus
  lobes.push({ x: cx, y: cy + scale * 4, r: scale * 12 });

  const minY = cy - scale * 14;
  const maxY = cy + scale * 10;

  for (let y = minY; y <= maxY; y++) {
    for (let x = cx - scale * 30; x <= cx + scale * 30; x++) {
      let inside = false;
      let depth = 0;
      for (const l of lobes) {
        const d = Math.hypot(x - l.x, y - l.y);
        if (d < l.r) {
          inside = true;
          depth = Math.max(depth, 1 - d / l.r);
        }
      }
      if (!inside) continue;
      const v = (y - minY) / (maxY - minY);
      let c: RGB;
      if (v < 0.34) c = dither(x, y, 1 - v * 2, P.cloudMid, P.cloudLit);
      else if (v < 0.62) c = dither(x, y, (0.62 - v) * 3, P.cloudShade, P.cloudMid);
      else c = dither(x, y, (1 - v) * 2.2, P.cloudDeep, P.cloudShade);
      if (depth < 0.12 && x > cx) c = P.cloudLit;
      set(b, x, y, c);
    }
  }
}
