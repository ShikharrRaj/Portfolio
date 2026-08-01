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

/* ---- scene layers -------------------------------------------------- */

const HORIZON = 122;

function sky(b: Buf) {
  // Painted past the horizon so a high hill crest can never expose bare
  // buffer; the ridges are drawn over the top of this.
  for (let y = 0; y < HORIZON + 16; y++) {
    // Four-stop vertical ramp, dithered so the bands never show as stripes.
    const t = Math.min(1, y / HORIZON);
    let lo: RGB, hi: RGB, k: number;
    if (t < 0.34) {
      lo = P.skyTop;
      hi = P.skyMid;
      k = t / 0.34;
    } else if (t < 0.68) {
      lo = P.skyMid;
      hi = P.skyLow;
      k = (t - 0.34) / 0.34;
    } else {
      lo = P.skyLow;
      hi = P.skyHaze;
      k = (t - 0.68) / 0.32;
    }
    for (let x = 0; x < b.w; x++) set(b, x, y, dither(x, y, k, lo, hi));
  }
}

function sun(b: Buf) {
  const cx = 246;
  const cy = 28;
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
function cloud(b: Buf, cx: number, cy: number, scale: number, seed: number) {
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
      // vertical position within the cloud drives the shading
      const v = (y - minY) / (maxY - minY);
      let c: RGB;
      if (v < 0.34) c = dither(x, y, 1 - v * 2, P.cloudMid, P.cloudLit);
      else if (v < 0.62) c = dither(x, y, (0.62 - v) * 3, P.cloudShade, P.cloudMid);
      else c = dither(x, y, (1 - v) * 2.2, P.cloudDeep, P.cloudShade);
      // rim light on the sun side
      if (depth < 0.12 && x > cx) c = P.cloudLit;
      set(b, x, y, c);
    }
  }
}

function skyline(b: Buf) {
  const rnd = mulberry32(7734);
  let x = 44;
  while (x < 214) {
    const w = 5 + Math.floor(rnd() * 11);
    const h = 14 + Math.floor(rnd() * 40);
    const top = HORIZON - h;
    const far = rnd() > 0.55;
    const body = far ? P.cityFar : rnd() > 0.5 ? P.cityMid : P.cityNear;
    for (let yy = top; yy < HORIZON; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        // haze: buildings fade toward the horizon colour near their base
        const fade = Math.max(0, 1 - (HORIZON - yy) / 46);
        set(b, xx, yy, dither(xx, yy, fade * 0.55, body, P.skyHaze));
      }
    }
    // sunlit right edge
    for (let yy = top; yy < HORIZON; yy++) set(b, x + w - 1, yy, P.cityLit);
    // windows
    for (let yy = top + 3; yy < HORIZON - 2; yy += 3) {
      for (let xx = x + 1; xx < x + w - 1; xx += 2) {
        if ((xx * 7 + yy * 13) % 5 === 0) set(b, xx, yy, P.window);
      }
    }
    x += w + 1 + Math.floor(rnd() * 3);
  }

  // one landmark spire, left of centre
  const sx = 120;
  for (let yy = HORIZON - 74; yy < HORIZON; yy++) {
    const taper = Math.max(1, Math.floor((yy - (HORIZON - 74)) / 9));
    for (let xx = sx - taper; xx <= sx + taper; xx++) set(b, xx, yy, P.cityMid);
    set(b, sx + taper, yy, P.cityLit);
  }
}

/** Two octaves of noise — one broad roll, one smaller undulation. */
function ridge(x: number, big: number, small: number, s1: number, s2: number) {
  return noise1(x / big, s1) * 1.0 + noise1(x / small, s2) * 0.34;
}

function hills(b: Buf) {
  // Far ridge — the rolling crest that gives the horizon its shape.
  for (let x = 0; x < b.w; x++) {
    const crest = Math.floor(HORIZON - 12 + ridge(x, 78, 29, 3, 9) * 17);
    // Runs well past the mid ridge's highest crest so the two always overlap.
    for (let y = crest; y < HORIZON + 52; y++) {
      const t = (y - crest) / 24;
      set(b, x, y, dither(x, y, t, P.hillFar, P.hillFarShade));
    }
  }
  // Mid ridge, rolling the other way so the two crests read as separate land.
  for (let x = 0; x < b.w; x++) {
    const crest = Math.floor(HORIZON + 4 + ridge(x, 96, 37, 11, 23) * 21);
    for (let y = crest; y < HORIZON + 50; y++) {
      const t = (y - crest) / 36;
      set(b, x, y, dither(x, y, t, P.hillMid, P.hillMidShade));
    }
  }
}

function meadow(b: Buf) {
  const rnd = mulberry32(90210);
  const base = HORIZON + 34;
  for (let x = 0; x < b.w; x++) {
    // The meadow's top edge follows its own gentle curve rather than a
    // ruler-straight line, so it reads as land instead of a colour band.
    const start = Math.floor(base + ridge(x, 110, 41, 31, 47) * 9 - 5);
    for (let y = start; y < b.h; y++) {
      const t = (y - start) / (b.h - start);
      // Lit near the top of the meadow, deepening toward the viewer, with
      // broad patches of lighter and darker turf laid over the top.
      const patch = noise1(x / 34, 61) * 0.5 + noise1(y / 19, 73) * 0.5;
      const tt = Math.min(1, Math.max(0, t + (patch - 0.5) * 0.34));
      let c: RGB;
      if (tt < 0.3) c = dither(x, y, 1 - tt / 0.3, P.grass, P.grassLit);
      else if (tt < 0.66) c = dither(x, y, (0.66 - tt) * 2.8, P.grassShade, P.grass);
      else c = dither(x, y, (1 - tt) * 2.6, P.grassDeep, P.grassShade);
      set(b, x, y, c);
    }
  }
  // Tufts — short vertical strokes, denser and darker toward the foreground.
  for (let i = 0; i < 3400; i++) {
    const x = Math.floor(rnd() * b.w);
    const depth = Math.pow(rnd(), 0.55);
    const y = base - 6 + Math.floor(depth * (b.h - base + 6));
    const len = 1 + Math.floor(rnd() * (1 + depth * 3));
    const c =
      depth > 0.72
        ? rnd() > 0.45
          ? P.grassDark
          : P.grassDeep
        : rnd() > 0.55
          ? P.grassLit
          : P.grassDeep;
    for (let k = 0; k < len; k++) set(b, x, y - k, c);
  }
}

/** Big canopy tree, lit from the upper right. */
function tree(b: Buf, cx: number, cy: number, scale: number, seed: number) {
  const rnd = mulberry32(seed);
  const clumps: { x: number; y: number; r: number }[] = [];
  const n = 14;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = scale * (0.45 + rnd() * 0.5);
    clumps.push({
      x: cx + Math.cos(a) * scale * (0.55 + rnd() * 0.35),
      y: cy + Math.sin(a) * scale * (0.42 + rnd() * 0.3),
      r: rr,
    });
  }
  clumps.push({ x: cx, y: cy, r: scale * 0.95 });

  // trunk first, so foliage overlaps it
  const trunkTop = cy + scale * 0.5;
  const trunkBottom = cy + scale * 2.05;
  for (let y = trunkTop; y < trunkBottom; y++) {
    const t = (y - trunkTop) / (trunkBottom - trunkTop);
    const halfW = scale * (0.07 + t * 0.1);
    for (let x = cx - halfW; x <= cx + halfW; x++) {
      const rel = (x - (cx - halfW)) / (halfW * 2);
      set(b, Math.round(x), Math.round(y), rel > 0.55 ? P.bark : P.barkShade);
    }
  }
  // roots flaring into the grass
  for (let k = 0; k < 5; k++) {
    const dir = k % 2 ? 1 : -1;
    const len = scale * (0.2 + rnd() * 0.25);
    for (let s = 0; s < len; s++) {
      const x = cx + dir * s;
      const y = trunkBottom - 1 + Math.floor(s * 0.25);
      set(b, Math.round(x), Math.round(y), P.barkShade);
    }
  }

  for (let y = cy - scale * 1.6; y <= cy + scale * 1.3; y++) {
    for (let x = cx - scale * 1.7; x <= cx + scale * 1.7; x++) {
      let best = -1;
      for (const c of clumps) {
        const d = Math.hypot(x - c.x, y - c.y);
        if (d < c.r) best = Math.max(best, 1 - d / c.r);
      }
      if (best < 0) continue;
      // light from upper-right
      const lx = (x - cx) / (scale * 1.7);
      const ly = (y - cy) / (scale * 1.6);
      const lit = 0.5 + (lx - ly) * 0.42 + best * 0.25;
      let c: RGB;
      if (lit > 0.86) c = dither(x, y, (lit - 0.86) * 5, P.leaf, P.leafLit);
      else if (lit > 0.55) c = dither(x, y, (lit - 0.55) * 3.2, P.leafShade, P.leaf);
      else c = dither(x, y, lit * 1.6, P.leafDeep, P.leafShade);
      set(b, Math.round(x), Math.round(y), c);
    }
  }
}

/** The laptop in the grass — the scene's focal object. */
function laptop(b: Buf, ox: number, oy: number) {
  const screenW = 54;
  const screenH = 34;

  // lid
  for (let y = 0; y < screenH; y++) {
    for (let x = 0; x < screenW; x++) {
      const edge = x < 2 || x > screenW - 3 || y < 2 || y > screenH - 3;
      if (edge) {
        set(b, ox + x, oy + y, x > screenW - 4 || y < 2 ? P.metal : P.metalShade);
        continue;
      }
      // screen showing sky — a small window onto the same world
      const t = (y - 2) / (screenH - 5);
      // Sky in the screen: pale at the top, deeper blue lower down.
      const c =
        t < 0.45
          ? dither(ox + x, oy + y, 1 - t / 0.45, P.screen, P.cloudMid)
          : dither(ox + x, oy + y, (1 - t) * 1.4, P.skyMid, P.screen);
      set(b, ox + x, oy + y, c);
    }
  }
  // a couple of drifting clouds on the screen
  for (let x = 6; x < 22; x++) set(b, ox + x, oy + 10, P.cloudLit);
  for (let x = 8; x < 19; x++) set(b, ox + x, oy + 11, P.cloudLit);
  for (let x = 30; x < 44; x++) set(b, ox + x, oy + 19, P.cloudMid);

  // hinge
  for (let x = 0; x < screenW; x++) set(b, ox + x, oy + screenH, P.metalDark);

  // base, drawn in perspective — wider at the front
  const baseH = 11;
  for (let y = 0; y < baseH; y++) {
    const spread = Math.floor(y * 1.1);
    const t = y / baseH;
    for (let x = -spread; x < screenW + spread; x++) {
      const c = t < 0.25 ? P.metal : t < 0.7 ? P.metalShade : P.metalDark;
      set(b, ox + x, oy + screenH + 1 + y, c);
    }
  }
  // keyboard well
  for (let y = 2; y < 6; y++) {
    for (let x = 6; x < screenW - 6; x++) {
      if ((x + y) % 3 === 0) continue;
      set(b, ox + x, oy + screenH + 1 + y, P.metalDark);
    }
  }
  // trackpad
  for (let y = 7; y < 9; y++)
    for (let x = screenW / 2 - 7; x < screenW / 2 + 7; x++)
      set(b, ox + Math.round(x), oy + screenH + 1 + y, P.metalShade);

  // contact shadow in the grass
  for (let x = -6; x < screenW + 16; x++) {
    for (let y = 0; y < 3; y++) {
      if ((x + y) % 2 === 0) continue;
      set(b, ox + x, oy + screenH + baseH + 1 + y, P.grassDark);
    }
  }
}

/** Picnic blanket with a notebook — softens the tech object beside it. */
function blanket(b: Buf, ox: number, oy: number) {
  const w = 46;
  const h = 20;
  for (let y = 0; y < h; y++) {
    const spread = Math.floor(y * 0.55);
    for (let x = -spread; x < w + spread; x++) {
      const check = (Math.floor(x / 5) + Math.floor(y / 4)) % 2 === 0;
      const lit = y < 4;
      set(b, ox + x, oy + y, lit ? P.clothLit : check ? P.cloth : P.clothShade);
    }
  }
  // notebook resting on it
  for (let y = 4; y < 12; y++)
    for (let x = 8; x < 26; x++)
      set(b, ox + x, oy + y, y < 6 ? P.paper : y > 10 ? P.metalShade : P.paper);
  for (let x = 10; x < 24; x += 3) set(b, ox + x, oy + 8, P.metalShade);
}

function flower(b: Buf, ox: number, oy: number) {
  for (let y = 0; y < 16; y++) set(b, ox, oy + y, P.stem);
  set(b, ox - 3, oy + 6, P.stem);
  set(b, ox - 4, oy + 5, P.stem);
  set(b, ox + 3, oy + 9, P.stem);
  set(b, ox + 4, oy + 8, P.stem);
  const petals = [
    [0, -4],
    [-2, -3],
    [2, -3],
    [-3, -1],
    [3, -1],
    [-2, 1],
    [2, 1],
    [0, 2],
  ];
  for (const [dx, dy] of petals) set(b, ox + dx, oy + dy, P.petalY);
  set(b, ox, oy - 1, P.petalW);
  set(b, ox - 1, oy, P.petalY);
  set(b, ox + 1, oy, P.petalY);
}

/* ---- compose ------------------------------------------------------- */

export function paintScene(): Buf {
  const b = makeBuf();

  sky(b);
  sun(b);

  cloud(b, 62, 40, 1.5, 21);
  cloud(b, 168, 26, 1.9, 84);
  cloud(b, 268, 52, 1.2, 133);
  cloud(b, 348, 20, 1.0, 512);
  cloud(b, 12, 74, 0.9, 640);

  skyline(b);
  hills(b);
  meadow(b);

  // A small tree on the left for depth, the hero tree on the right.
  tree(b, 46, 92, 20, 4242);
  tree(b, 336, 74, 46, 1337);

  blanket(b, 286, 168);
  laptop(b, 196, 140);
  flower(b, 96, 176);
  flower(b, 118, 190);

  return b;
}
