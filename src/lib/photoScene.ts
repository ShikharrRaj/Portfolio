/* =====================================================================
 *  PHOTO → PIXEL ART
 *  ---------------------------------------------------------------------
 *  Converts the Central Park reference photograph into the scene, at
 *  build time, with no image library.
 *
 *  The conversion is a palette quantisation with ordered dithering, not a
 *  downscale-and-blur. Each pixel is nudged by a Bayer threshold before
 *  being snapped to the nearest palette colour, which is what produces
 *  stippled gradients instead of flat posterised bands.
 *
 *  Four departures from the photograph, all requested:
 *    1. The cast shadow across the bottom third is discarded and replaced
 *       with the procedural sunlit meadow.
 *    2. A sun is added into the open sky (occluded by buildings, since it
 *       sits on the layer behind them).
 *    3. Clouds are added — the reference sky is cloudless — and drift
 *       BEHIND the skyline, so buildings occlude them correctly.
 *    4. The overhanging bough in the top-right is removed from the photo
 *       and redrawn as its own layer so it can move in the wind.
 * ===================================================================== */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { decodePng } from "./pngDecode";
import { H, W, cloud, makeBuf, sun, type Buf, type RGB } from "./pixelScene";

/* ------------------------------------------------------------------ */
/*  Geometry, derived by probing the reference                         */
/* ------------------------------------------------------------------ */

/** Row where the photograph's lawn hands over to the procedural meadow.
 *  Below ~180 the reference is in deep shade (mean luminance 98 → 9). */
export const MEADOW_SPLIT = 168;

/**
 * The overhanging bough is cleared as a geometric wedge anchored to the
 * top-right corner, not by darkness alone.
 *
 * Masking on darkness was the first attempt and it failed badly: window
 * reveals and shadowed masonry match the leaves' luminance, so the mask
 * became speckled and inpainting it by scanning left smeared long
 * horizontal streaks across the whole right-hand side. A wedge costs a few
 * real building tops behind the leaves and buys a clean corner.
 */
const WEDGE_X0 = 186;
const WEDGE_Y0 = 10;
const WEDGE_Y1 = 68;

/** Wobble on the wedge boundary, so it never reads as a ruled line. */
function edgeNoise(x: number) {
  const r = (n: number) => {
    const v = Math.sin(n * 91.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const i = Math.floor(x / 9);
  const f = x / 9 - i;
  const u = f * f * (3 - 2 * f);
  return (r(i) * (1 - u) + r(i + 1) * u - 0.5) * 13;
}

/**
 * How strongly the wedge claims this pixel: 1 well inside, 0 well outside,
 * with a soft band between. The band is dissolved with the Bayer matrix
 * rather than cut, so the join stipples out instead of drawing an edge.
 */
function wedgeAmount(x: number, y: number) {
  if (x < WEDGE_X0) return 0;
  const t = (x - WEDGE_X0) / (W - WEDGE_X0);
  const edge = WEDGE_Y0 + t * (WEDGE_Y1 - WEDGE_Y0) + edgeNoise(x);
  return Math.max(0, Math.min(1, (edge - y) / 11));
}

function inWedge(x: number, y: number) {
  const a = wedgeAmount(x, y);
  return a > 0 && a > (BAYER[y & 3][x & 3] + 0.5) / 16;
}

/* ------------------------------------------------------------------ */
/*  Palette — sampled from the reference, extended for the added grass  */
/* ------------------------------------------------------------------ */

const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

/** Deliberately small. A wide palette makes a photo look like a photo. */
export const PHOTO_PALETTE: RGB[] = [
  // sky, deep at the zenith down to pale at the horizon
  hex("#2F6FA8"),
  hex("#3D82BE"),
  hex("#5197D2"),
  hex("#6FAFE0"),
  hex("#93C7EA"),
  hex("#BCDDF2"),
  // masonry, glass and stone
  hex("#7A6A5E"),
  hex("#9C8776"),
  hex("#BCA791"),
  hex("#D8C8B2"),
  hex("#8B96A4"),
  hex("#A9B4C0"),
  hex("#C7D0D9"),
  hex("#5E6A76"),
  // treeline
  hex("#16290F"),
  hex("#21391A"),
  hex("#2E4C21"),
  hex("#3C5F28"),
  hex("#4C7431"),
  hex("#5D8B3A"),
  // lawn
  hex("#6FA33F"),
  hex("#82B94A"),
  hex("#96CE55"),
  hex("#A9DF63"),
  hex("#BCEC77"),
  // warm accents (sun, windows)
  hex("#FFE9A8"),
  hex("#FFF6E0"),
  hex("#FFFFFF"),
];

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** Nearest palette colour, in plain RGB distance. */
function nearest(r: number, g: number, b: number): RGB {
  let best = PHOTO_PALETTE[0];
  let bestD = Infinity;
  for (const c of PHOTO_PALETTE) {
    const d = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
}

/** Quantise with an ordered-dither offset — the step that sells the style. */
function quantise(x: number, y: number, r: number, g: number, b: number): RGB {
  const t = ((BAYER[y & 3][x & 3] + 0.5) / 16 - 0.5) * 40;
  return nearest(r + t, g + t, b + t);
}

/* ------------------------------------------------------------------ */
/*  Source                                                             */
/* ------------------------------------------------------------------ */

type Src = { data: Uint8ClampedArray; w: number; h: number };

let src: Src | null = null;

function source(): Src {
  if (!src) {
    src = decodePng(readFileSync(join(process.cwd(), "src/assets/park-384.png")));
  }
  return src;
}

const lum = (d: Uint8ClampedArray, i: number) =>
  0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];

/**
 * Sky detection by FLOOD FILL from the top edge, not by colour alone.
 *
 * A pure colour test ("blue-ish and bright") also matches the blue-tinted
 * glass running up the towers on the left, which punched vertical stripes
 * of sky straight through the buildings. Real sky is connected to the top
 * of the frame; a window is enclosed by masonry. Flooding down from row 0
 * separates the two exactly, with no thresholds to tune.
 */
function skyish(d: Uint8ClampedArray, i: number) {
  return d[i + 2] - d[i] > 16 && lum(d, i) > 96;
}

let skyMask: Uint8Array | null = null;

function sky(): Uint8Array {
  if (skyMask) return skyMask;
  const s = source();
  const m = new Uint8Array(s.w * s.h);
  const stack: number[] = [];

  for (let x = 0; x < s.w; x++) {
    if (skyish(s.data, x * 4)) {
      m[x] = 1;
      stack.push(x);
    }
  }

  while (stack.length) {
    const p = stack.pop()!;
    const x = p % s.w;
    const y = (p / s.w) | 0;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= s.w || ny >= s.h) continue;
      const q = ny * s.w + nx;
      if (m[q]) continue;
      if (!skyish(s.data, q * 4)) continue;
      m[q] = 1;
      stack.push(q);
    }
  }

  skyMask = m;
  return m;
}

function isSky(_d: Uint8ClampedArray, i: number, _y: number) {
  return sky()[i >> 2] === 1;
}



function put(b: Buf, x: number, y: number, c: RGB) {
  if (x < 0 || y < 0 || x >= b.w || y >= b.h) return;
  const i = (y * b.w + x) * 4;
  b.data[i] = c[0];
  b.data[i + 1] = c[1];
  b.data[i + 2] = c[2];
  b.data[i + 3] = 255;
}

/* ------------------------------------------------------------------ */
/*  Layers                                                             */
/* ------------------------------------------------------------------ */

/**
 * The sky, rebuilt as a clean gradient from the photograph's own sky
 * pixels. Reconstructing it (rather than punching a hole in the photo)
 * means clouds have something continuous to drift across.
 */
export function photoSky(): Buf {
  const b = makeBuf();
  const s = source();

  // Median sky colour per row, so the natural gradient is preserved.
  const rows: RGB[] = [];
  for (let y = 0; y < H; y++) {
    const rs: number[] = [];
    const gs: number[] = [];
    const bs: number[] = [];
    for (let x = 0; x < s.w; x++) {
      const i = (y * s.w + x) * 4;
      if (isSky(s.data, i, y) && !inWedge(x, y)) {
        rs.push(s.data[i]);
        gs.push(s.data[i + 1]);
        bs.push(s.data[i + 2]);
      }
    }
    if (rs.length > 6) {
      const mid = (a: number[]) => a.sort((p, q) => p - q)[a.length >> 1];
      rows.push([mid(rs), mid(gs), mid(bs)]);
    } else {
      rows.push(rows[y - 1] ?? [110, 150, 190]);
    }
  }

  for (let y = 0; y < H; y++) {
    const [r, g, bl] = rows[y];
    for (let x = 0; x < W; x++) put(b, x, y, quantise(x, y, r, g, bl));
  }
  return b;
}

/** The city, treeline and sunlit lawn — sky punched out, bough wedge cleared. */
export function photoFront(): Buf {
  const b = makeBuf();
  const s = source();

  for (let y = 0; y < MEADOW_SPLIT; y++) {
    for (let x = 0; x < W; x++) {
      if (inWedge(x, y)) continue; // cleared — the sky layer shows through
      const i = (y * s.w + x) * 4;
      if (isSky(s.data, i, y)) continue; // sky shows through from behind
      put(b, x, y, quantise(x, y, s.data[i], s.data[i + 1], s.data[i + 2]));
    }
  }

  // The reference's bottom third is in deep shade (mean luminance 9). It is
  // discarded and the sunlit meadow carries the foreground instead.
  meadow(b);
  return b;
}

/* ------------------------------------------------------------------ */
/*  The replacement meadow                                             */
/* ------------------------------------------------------------------ */

const LAWN_LIT = hex("#A9DF63");
const LAWN = hex("#96CE55");
const LAWN_MID = hex("#82B94A");
const LAWN_DEEP = hex("#6FA33F");
const LAWN_DARK = hex("#5D8B3A");
const LAWN_SHADE = hex("#4C7431");

function ditherPair(x: number, y: number, t: number, lo: RGB, hi: RGB): RGB {
  return t > (BAYER[y & 3][x & 3] + 0.5) / 16 ? hi : lo;
}

/**
 * Sunlit turf running from the photograph's lawn down to the viewer. The
 * top rows are blended into the photo so the handover has no seam.
 */
function meadow(b: Buf) {
  const s = source();
  const span = H - MEADOW_SPLIT;
  for (let y = MEADOW_SPLIT; y < H; y++) {
    const t = (y - MEADOW_SPLIT) / span;
    for (let x = 0; x < W; x++) {
      let c: RGB;
      if (t < 0.34) c = ditherPair(x, y, 1 - t / 0.34, LAWN, LAWN_LIT);
      else if (t < 0.7) c = ditherPair(x, y, (0.7 - t) * 2.8, LAWN_MID, LAWN);
      else c = ditherPair(x, y, (1 - t) * 3.2, LAWN_DEEP, LAWN_MID);

      // Feather the first few rows into the photograph's own lawn colour so
      // the handover from photo to procedural turf has no visible seam.
      if (y < MEADOW_SPLIT + 7) {
        const i = ((y - 4) * s.w + x) * 4;
        const k = (y - MEADOW_SPLIT) / 7;
        c = quantise(
          x,
          y,
          s.data[i] * (1 - k) + c[0] * k,
          s.data[i + 1] * (1 - k) + c[1] * k,
          s.data[i + 2] * (1 - k) + c[2] * k,
        );
      }
      put(b, x, y, c);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Animated layers                                                    */
/* ------------------------------------------------------------------ */

export const GRASS_FRAMES = 4;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Wind through the foreground turf. Frames cycle; the lean travels as a wave. */
export function photoGrass(frame: number): Buf {
  const b = makeBuf();
  const rnd = mulberry32(90210);
  const LEAN = [0, 1, 0, -1];
  const top = MEADOW_SPLIT - 4;
  for (let i = 0; i < 3000; i++) {
    const x = Math.floor(rnd() * W);
    const depth = Math.pow(rnd(), 0.55);
    const y = top + Math.floor(depth * (H - top));
    const len = 1 + Math.floor(rnd() * (1 + depth * 3));
    const c = depth > 0.7 ? (rnd() > 0.45 ? LAWN_SHADE : LAWN_DARK) : rnd() > 0.5 ? LAWN_LIT : LAWN_DEEP;
    const lean = LEAN[(frame + Math.floor(x / 26)) & 3] * (depth > 0.45 ? 1 : 0);
    for (let k = 0; k < len; k++) {
      const dx = len > 1 ? Math.round((lean * k) / len) : 0;
      put(b, x + dx, y - k, c);
    }
  }
  return b;
}

/** Clouds. The reference sky is cloudless, so these are additions. */
export function photoClouds(): Buf {
  const b = makeBuf();
  cloud(b, 58, 26, 1.25, 21);
  cloud(b, 176, 14, 1.0, 84);
  cloud(b, 236, 34, 0.85, 133);
  cloud(b, 330, 12, 0.7, 512);
  return b;
}

/* ------------------------------------------------------------------ */
/*  The overhanging bough                                              */
/* ------------------------------------------------------------------ */

// Near-silhouette, as it reads in the reference: backlit against the sky.
const LEAF = [hex("#0E1C0A"), hex("#16290F"), hex("#1E3715"), hex("#27461C"), hex("#325A24")];
const LIMB = hex("#0B1408");

type Pt = { x: number; y: number };

/** Straight limb of tapering thickness. */
function limb(b: Buf, a: Pt, z: Pt, w0: number, w1: number) {
  const steps = Math.ceil(Math.hypot(z.x - a.x, z.y - a.y));
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const x = a.x + (z.x - a.x) * t;
    const y = a.y + (z.y - a.y) * t;
    const w = w0 + (w1 - w0) * t;
    for (let o = -w; o <= w; o++) put(b, Math.round(x), Math.round(y + o), LIMB);
  }
}

/** Leaf cluster — a dithered blob, darker at its underside. */
function clump(b: Buf, cx: number, cy: number, r: number, seed: number) {
  const rnd = mulberry32(seed);
  // Many small lobes rather than a few big ones — a handful of large discs
  // reads as balloons, which is exactly how the first attempt looked.
  const lobes = Array.from({ length: 9 }, () => ({
    x: cx + (rnd() - 0.5) * r * 2.2,
    y: cy + (rnd() - 0.5) * r * 1.7,
    r: r * (0.26 + rnd() * 0.32),
  }));
  for (let y = cy - r * 1.4; y <= cy + r * 1.4; y++) {
    for (let x = cx - r * 1.6; x <= cx + r * 1.6; x++) {
      let best = -1;
      for (const l of lobes) {
        const d = Math.hypot(x - l.x, y - l.y);
        if (d < l.r) best = Math.max(best, 1 - d / l.r);
      }
      if (best < 0) continue;
      // Ragged rim: drop some outermost pixels so the silhouette is lacy
      // and sky shows through the foliage, as it does in the reference.
      if (best < 0.22 && (BAYER[y & 3][x & 3] + 0.5) / 16 > best * 4) continue;
      const v = (y - (cy - r * 1.4)) / (r * 2.8);
      const idx = Math.min(4, Math.max(0, Math.round(v * 2.4 + best * 1.6)));
      const c = ditherPair(x, y, 0.5, LEAF[idx], LEAF[Math.min(4, idx + 1)]);
      put(b, Math.round(x), Math.round(y), c);
    }
  }
}

/**
 * The bough hanging into the top-right corner, redrawn so it can move.
 * Each frame displaces the foliage further the further it hangs from the
 * corner — the anchor barely moves, the tips move most.
 */
export function photoBough(frame: number): Buf {
  const b = makeBuf();
  const SWAY = [0, 1, 2, 1];
  const s = SWAY[frame & 3];

  // Distance-weighted offset: 0 at the corner, full sway at the far tip.
  const off = (anchorDist: number) => Math.round((s * anchorDist) / 100);

  limb(b, { x: W + 2, y: 6 }, { x: 300 + off(90), y: 26 + off(60) }, 3, 1.5);
  limb(b, { x: W + 2, y: 22 }, { x: 322 + off(64), y: 52 + off(50) }, 2.5, 1);
  limb(b, { x: 356, y: 14 }, { x: 292 + off(96), y: 8 + off(40) }, 1.5, 1);
  limb(b, { x: 340, y: 30 }, { x: 246 + off(140), y: 34 + off(70) }, 1.5, 1);

  const clumps: [number, number, number, number][] = [
    [378, 6, 9, 11], [368, 18, 8, 17], [358, 4, 7, 22], [352, 28, 8, 28],
    [344, 12, 7, 33], [336, 34, 7, 39], [330, 6, 6, 44], [326, 22, 7, 50],
    [318, 40, 6, 55], [312, 14, 6, 61], [306, 30, 6, 66], [300, 46, 5, 72],
    [296, 8, 5, 77], [290, 24, 5, 83], [284, 38, 5, 88], [278, 12, 5, 94],
    [272, 28, 4, 99], [264, 18, 4, 105], [258, 34, 4, 110], [250, 10, 4, 116],
    [244, 26, 4, 121], [236, 16, 3, 127], [228, 30, 3, 132], [220, 12, 3, 138],
    [212, 22, 3, 143], [202, 14, 3, 149], [194, 8, 2, 154],
    [372, 34, 8, 160], [362, 48, 7, 165], [350, 58, 6, 171], [340, 46, 6, 176],
    [330, 60, 5, 182], [318, 54, 5, 187],
  ];
  for (const [cx, cy, r, seed] of clumps) {
    const d = W - cx; // how far the clump hangs from the anchor corner
    clump(b, cx + off(d), cy + Math.round(off(d) * 0.35), r, seed);
  }
  return b;
}

export const BOUGH_FRAMES = 4;

/** Sky, with the added sun. Buildings occlude it, since they sit in front. */
export function photoSkyWithSun(): Buf {
  const b = photoSky();
  // Placed in the gap between the left towers and the centre cluster —
  // the only stretch of genuinely open sky in the reference.
  sun(b, 112, 26);
  return b;
}
