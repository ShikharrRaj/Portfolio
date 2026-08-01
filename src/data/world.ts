/* =====================================================================
 *  PIXEL WORLD — Central Park
 *  ---------------------------------------------------------------------
 *  A hand-authored 2D pixel scene. Every sprite below is drawn as a grid
 *  of characters; each character maps to a colour in PALETTE. The renderer
 *  turns runs of identical characters into SVG rects, so the art stays
 *  crisp at any zoom and weighs almost nothing.
 *
 *  Logical canvas is 240 × 135 "pixels". Everything sits on integer
 *  coordinates — that is what keeps it reading as pixel art rather than
 *  as a blurry illustration.
 * ===================================================================== */

/* ------------------------------------------------------------------ */
/*  Palette — bright spring afternoon                                  */
/* ------------------------------------------------------------------ */

export const PALETTE: Record<string, string> = {
  // foliage
  a: "#2F7D3A", // deep leaf shadow
  b: "#48A551", // mid leaf
  c: "#6FC96A", // lit leaf
  d: "#9BE38C", // highlight
  // trunks / wood
  t: "#6B4423",
  u: "#8A5A2E",
  e: "#C08A4E", // bench wood light
  f: "#8A5628", // bench wood dark
  // stone
  s: "#EDE3CB",
  r: "#C3B597",
  // water
  v: "#2E86C1",
  w: "#4FA8DE",
  x: "#8AD1F2",
  // ground
  g: "#79C45C",
  h: "#5FA845",
  i: "#96DC74",
  p: "#F0D79C",
  q: "#D9B87C",
  // city
  B: "#D8DEE9",
  C: "#AEB7C6",
  D: "#8590A2",
  Y: "#FFD46B",
  // character
  k: "#F4C9A0",
  m: "#E8574A",
  n: "#3A2A1E",
  o: "#2A2320",
  // misc
  W: "#FFFFFF",
  1: "#F2647A",
  2: "#FFD84D",
  3: "#B57BE0",
};

/* ------------------------------------------------------------------ */
/*  Sprites                                                            */
/* ------------------------------------------------------------------ */

export type Sprite = string[];

export const TREE_BIG: Sprite = [
  "....aaa....",
  "..aabbbaa..",
  ".abbbcbbba.",
  "abbbcccbbba",
  "abbccdccbba",
  "abbcccccbba",
  ".abbcccbba.",
  "..abbbbba..",
  "...aabaa...",
  "....tu.....",
  "....tu.....",
  "...ttuu....",
  "...ttuu....",
];

export const TREE_SMALL: Sprite = [
  "..aaa..",
  ".abbba.",
  "abbcbba",
  "abcccba",
  ".abcba.",
  "..aba..",
  "...tu..",
  "...tu..",
  "..ttuu.",
];

export const TREE_BLOSSOM: Sprite = [
  "..111..",
  ".13331.",
  "1331331",
  "1333331",
  ".13331.",
  "..1a1..",
  "...tu..",
  "...tu..",
  "..ttuu.",
];

export const BENCH: Sprite = [
  ".eeeeeee.",
  ".f.....f.",
  ".eeeeeee.",
  ".f.....f.",
  "feeeeeeef",
  ".f.....f.",
];

export const LAMP: Sprite = [
  ".ooo.",
  ".oYo.",
  ".ooo.",
  "..o..",
  "..o..",
  "..o..",
  "..o..",
  "..o..",
  ".ooo.",
  "ooooo",
];

export const CLOUD: Sprite = [
  "....WWWW......",
  "..WWWWWWWW....",
  ".WWWWWWWWWWW..",
  "WWWWWWWWWWWWWW",
  ".WWWWWWWWWWWW.",
];

export const CLOUD_SMALL: Sprite = [
  "..WWW...",
  ".WWWWWW.",
  "WWWWWWWW",
  ".WWWWWW.",
];

/** Bow Bridge — the one landmark everyone recognises. */
export const BRIDGE: Sprite = [
  "........ssssssss........",
  ".....ssssssssssssss.....",
  "..ssssssssssssssssssss..",
  "ssssssssssssssssssssssss",
  "rrrrrrrrrrrrrrrrrrrrrrrr",
  "ssss................ssss",
  "sss..................sss",
  "sss..................sss",
  "ss....................ss",
];

export const CHARACTER: Sprite = [
  "..nnnn..",
  ".nnnnnn.",
  ".nkkkkn.",
  ".kokkok.",
  ".kkkkkk.",
  "..mmmm..",
  ".mmmmmm.",
  "kmmmmmmk",
  ".mmmmmm.",
  "..mmmm..",
  "..t..t..",
  "..t..t..",
  ".oo..oo.",
];

export const DUCK: Sprite = [
  "..2..",
  ".WW2.",
  "WWWW.",
  ".WW..",
];

export const SIGN: Sprite = [
  "eeeeeee",
  "eYYYYYe",
  "eYYYYYe",
  "eeeeeee",
  "...f...",
  "...f...",
  "...f...",
];

export const BUSH: Sprite = [
  "..aaa..",
  ".abcba.",
  "abcccba",
  "aabbbaa",
];

export const FLOWERS: Sprite = ["1.2.1", ".hhh.", "..h.."];

/* ------------------------------------------------------------------ */
/*  Scene layout — 240 × 135 logical pixels                            */
/* ------------------------------------------------------------------ */

export const SCENE = { w: 240, h: 135 } as const;

/** Horizon bands, painted back to front. */
export const BANDS = [
  { y: 0, h: 26, fill: "#7FD3F7" }, // upper sky
  { y: 26, h: 14, fill: "#9BE0FA" }, // lower sky
  { y: 40, h: 6, fill: "#BEEBFF" }, // haze at the treeline
  { y: 46, h: 20, fill: "#6FB84E" }, // mid-ground parkland behind the lake
  { y: 66, h: 8, fill: "#5FA845" }, // far bank
  { y: 74, h: 8, fill: "#8AD1F2" }, // far lake shimmer
  { y: 82, h: 10, fill: "#4FA8DE" }, // lake
  { y: 92, h: 6, fill: "#2E86C1" }, // lake depth
  { y: 98, h: 12, fill: "#5FA845" }, // near bank shadow
  { y: 110, h: 25, fill: "#79C45C" }, // foreground lawn
] as const;

/** Manhattan over the treeline. Bright, not a silhouette. */
export const SKYLINE: { x: number; w: number; h: number; shade: "B" | "C" | "D" }[] = [
  { x: 4, w: 12, h: 18, shade: "C" },
  { x: 18, w: 8, h: 26, shade: "B" },
  { x: 28, w: 14, h: 14, shade: "D" },
  { x: 44, w: 10, h: 30, shade: "B" },
  { x: 56, w: 16, h: 20, shade: "C" },
  { x: 74, w: 9, h: 34, shade: "B" }, // a tall one
  { x: 85, w: 13, h: 16, shade: "D" },
  { x: 100, w: 11, h: 24, shade: "C" },
  { x: 113, w: 18, h: 12, shade: "D" },
  { x: 133, w: 10, h: 28, shade: "B" },
  { x: 145, w: 14, h: 18, shade: "C" },
  { x: 161, w: 9, h: 32, shade: "B" },
  { x: 172, w: 15, h: 15, shade: "D" },
  { x: 189, w: 11, h: 22, shade: "C" },
  { x: 202, w: 16, h: 17, shade: "D" },
  { x: 220, w: 12, h: 26, shade: "B" },
];

export type Placement = { sprite: Sprite; x: number; y: number; flip?: boolean };

/** Distant treeline that hides the base of the city. */
export const TREELINE: Placement[] = [
  { sprite: TREE_SMALL, x: 2, y: 40 },
  { sprite: TREE_SMALL, x: 14, y: 42 },
  { sprite: TREE_SMALL, x: 26, y: 40 },
  { sprite: TREE_SMALL, x: 38, y: 43 },
  { sprite: TREE_SMALL, x: 50, y: 41 },
  { sprite: TREE_SMALL, x: 62, y: 42 },
  { sprite: TREE_SMALL, x: 74, y: 40 },
  { sprite: TREE_SMALL, x: 86, y: 43 },
  { sprite: TREE_SMALL, x: 98, y: 41 },
  { sprite: TREE_SMALL, x: 110, y: 42 },
  { sprite: TREE_SMALL, x: 122, y: 40 },
  { sprite: TREE_SMALL, x: 134, y: 43 },
  { sprite: TREE_SMALL, x: 146, y: 41 },
  { sprite: TREE_SMALL, x: 158, y: 42 },
  { sprite: TREE_SMALL, x: 170, y: 40 },
  { sprite: TREE_SMALL, x: 182, y: 43 },
  { sprite: TREE_SMALL, x: 194, y: 41 },
  { sprite: TREE_SMALL, x: 206, y: 42 },
  { sprite: TREE_SMALL, x: 218, y: 40 },
  { sprite: TREE_SMALL, x: 230, y: 42 },
];

export const CLOUDS: Placement[] = [
  { sprite: CLOUD, x: 18, y: 8 },
  { sprite: CLOUD_SMALL, x: 74, y: 16 },
  { sprite: CLOUD, x: 120, y: 6 },
  { sprite: CLOUD_SMALL, x: 186, y: 14 },
  { sprite: CLOUD, x: 208, y: 22 },
];

/** Everything on the near side of the lake. */
/* Bases are tuned so every trunk lands on the lawn (y ≥ 98), never in the
 * water, and nothing sits on the path (y 118–124) except the walker. */
export const FOREGROUND: Placement[] = [
  { sprite: TREE_BIG, x: 6, y: 95 }, // base 108
  { sprite: TREE_BLOSSOM, x: 24, y: 101 }, // base 110
  { sprite: BUSH, x: 38, y: 110 },
  { sprite: TREE_BIG, x: 46, y: 97 }, // base 110
  { sprite: BENCH, x: 64, y: 111 }, // base 117, just above the path
  { sprite: LAMP, x: 86, y: 106 }, // base 116
  { sprite: TREE_BLOSSOM, x: 100, y: 103 }, // base 112
  { sprite: BUSH, x: 118, y: 112 },
  { sprite: BENCH, x: 134, y: 112 }, // base 118
  { sprite: TREE_BIG, x: 156, y: 96 }, // base 109
  { sprite: LAMP, x: 180, y: 108 }, // base 118
  { sprite: BUSH, x: 194, y: 113 },
  { sprite: TREE_BIG, x: 204, y: 99 }, // base 112
  { sprite: TREE_BLOSSOM, x: 224, y: 104 }, // base 113
  // Planting below the path, in front of the walker.
  { sprite: FLOWERS, x: 30, y: 127 },
  { sprite: FLOWERS, x: 92, y: 129 },
  { sprite: FLOWERS, x: 150, y: 126 },
  { sprite: FLOWERS, x: 212, y: 129 },
];

export const DUCKS: Placement[] = [
  { sprite: DUCK, x: 52, y: 86 },
  { sprite: DUCK, x: 60, y: 90 },
  { sprite: DUCK, x: 168, y: 88 },
];

export const BRIDGE_AT = { x: 96, y: 74 };

/* ------------------------------------------------------------------ */
/*  Hotspots — the park IS the navigation                              */
/* ------------------------------------------------------------------ */

export type Hotspot = {
  id: string;
  /** Where the marker sits, in scene pixels. */
  x: number;
  y: number;
  place: string;
  label: string;
  blurb: string;
};

export const HOTSPOTS: Hotspot[] = [
  {
    id: "hello",
    x: 30,
    y: 108,
    place: "The Entrance",
    label: "Say hello",
    blurb: "Who he is, in his own words.",
  },
  {
    id: "bridge",
    x: 108,
    y: 70,
    place: "Bow Bridge",
    label: "The crossings",
    blurb: "Every career step as a decision with a cost.",
  },
  {
    id: "skyline",
    x: 74,
    y: 34,
    place: "The Skyline",
    label: "Where he's worked",
    blurb: "Banking floors, wealth platforms, an agency.",
  },
  {
    id: "lawn",
    x: 176,
    y: 116,
    place: "The Great Lawn",
    label: "Things he built",
    blurb: "Nine shipped systems, opened up.",
  },
  {
    id: "bench",
    x: 66,
    y: 100,
    place: "A Bench",
    label: "What he'd redo",
    blurb: "The decisions he would make differently.",
  },
];
