/* =====================================================================
 *  THE FIGURE — Shikhar on the lawn
 *  ---------------------------------------------------------------------
 *  Drawn from the brick-built render (public/pixel.png). The room and its
 *  tungsten light do not survive the trip to a midday park, but the things
 *  that identify him do: the tall heavy sweep of dark hair, black
 *  sunglasses under the fringe, a full beard joined to the sideburns, the
 *  WHITE oversized tee with drop shoulders, the black crossbody sling with
 *  its gold wordmark, and the steel watch on the nearer forearm.
 *
 *  Drawn as PIXEL ART at the scene's own grid, never scaled and never
 *  snapped to a coarser one. The reference is voxels, but the scene it
 *  lands in is a dithered photograph; rebuilding both on a chunky brick
 *  grid was tried and looked worse than either. The reference supplies the
 *  likeness and the wardrobe. The medium stays 2-D.
 *
 *  ---------------------------------------------------------------------
 *  WHY THIS FILE IS SPLIT THE WAY IT IS
 *
 *  He is now interactive: he turns to follow the pointer, packs up as the
 *  hero scrolls away, and stands up to wave. Painted naively that is
 *  (3 head directions × 4 typing frames × poses) sprites, and every sprite
 *  is a full 384×216 layer that ships as its own <img>.
 *
 *  So the seated figure is split in two. The BODY carries the typing
 *  cycle; the HEAD carries the direction. Stacked, they compose — 4 + 3
 *  layers instead of 12.
 *
 *  This file used to claim that the split cost the old one-pixel nod,
 *  because a nod could not be synchronised to the body's beat without
 *  going multiplicative again. That was wrong, and losing the nod is most
 *  of why the figure stopped reading as typing: the head is the largest,
 *  highest-contrast shape on him, and it was the one holding still. A nod
 *  is a one-pixel TRANSLATE, not a redraw, so the stylesheet does it on a
 *  wrapper for nothing — see .px-nod in globals.css. He nods and tracks
 *  you, on 4 + 3 sprites.
 *
 *  The two whole-figure poses (packing up, standing and waving) change
 *  the silhouette too much to compose, so those are painted entire.
 *
 *  Everything shares the part-painters below, which take the row their
 *  form starts on. That is what lets the standing pose reuse the seated
 *  tee, sling and head unchanged, just higher up the canvas.
 *
 *  The scene's sun is upper-right, so every highlight is on the right of a
 *  form and every turning shadow on its left.
 * ===================================================================== */

import { makeBuf, type Buf, type RGB } from "./pixelScene";

const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

/* Sampled from the render and from my1/my3, white-balanced to daylight.
 * The references are a warm room and two sunsets, so the raw samples come
 * back orange (skin reads #ac6432, the white tee reads #d1c2a3); these are
 * those hues corrected back to midday. */
const C = {
  hairDeep: hex("#080605"),
  hairDark: hex("#150E0C"),
  hair: hex("#241813"),
  hairLit: hex("#412B1D"),

  skinDeep: hex("#7E4A2C"),
  skinShade: hex("#AB6C43"),
  skin: hex("#D9976B"),
  skinLit: hex("#F0BC92"),

  beard: hex("#2A1B13"),
  beardLit: hex("#41291B"),

  /* The oversized white tee — the biggest shape on him, so it carries the
   * most tones. Cool greys, because white cloth in daylight takes the sky. */
  teeLit: hex("#FFFFFF"),
  tee: hex("#F0EFEA"),
  teeSeam: hex("#DCDBD5"),
  teeShade: hex("#C9CAC7"),
  teeDeep: hex("#A6A9A9"),

  slingDeep: hex("#0C0A09"),
  slingDark: hex("#161211"),
  sling: hex("#2A2322"),
  gold: hex("#C9A02E"),
  goldLit: hex("#E9C868"),

  lensDeep: hex("#08080A"),
  lens: hex("#17171C"),
  frame: hex("#2C2C33"),
  glint: hex("#7E8996"),

  jeansDeep: hex("#26303D"),
  jeans: hex("#38455A"),
  jeansLit: hex("#4E6076"),
  shoe: hex("#1D2530"),

  steel: hex("#D6DBE0"),
  steelDark: hex("#8A929B"),

  metalLit: hex("#D2D8DE"),
  metal: hex("#B3BAC3"),
  metalMid: hex("#868E99"),
  metalDark: hex("#5C646E"),

  /* The lid is a SEPARATE, much darker set from the deck, and the split is
   * not decorative. The deck lies across dark jeans, where silver reads;
   * the lid stands against the oversized white tee, where it did not read
   * at all. Space grey also happens to be true to the machine, and the
   * back of a raised lid genuinely is the one face turned away from an
   * upper-right sun. */
  shellLit: hex("#7F8792"),
  shell: hex("#565E69"),
  shellMid: hex("#3E454E"),
  shellDark: hex("#282D34"),
  logo: hex("#AEB6C0"),

  /* The spill over the top edge of the screen, on and off the beat. These
   * are FAR apart on purpose: at #BFE6F7 against #EAF8FF the two beats were
   * within a few percent of each other, which over twenty-five pixels of
   * edge is a difference nobody sees. The screen is the largest thing on
   * him that is allowed to change every beat, so it has to actually
   * change. */
  screen: hex("#EAF8FF"),
  screenDim: hex("#6E9FC0"),
  screenGlow: hex("#FFFFFF"),
  shadow: hex("#37601F"),
} as const;

function put(b: Buf, x: number, y: number, c: RGB) {
  const xi = Math.round(x);
  const yi = Math.round(y);
  if (xi < 0 || yi < 0 || xi >= b.w || yi >= b.h) return;
  const i = (yi * b.w + xi) * 4;
  b.data[i] = c[0];
  b.data[i + 1] = c[1];
  b.data[i + 2] = c[2];
  b.data[i + 3] = 255;
}

function rect(b: Buf, x: number, y: number, w: number, h: number, c: RGB) {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(b, x + i, y + j, c);
}

/**
 * A limb: stepped along its length so a diagonal never breaks, and
 * thickened ACROSS that length rather than always downward.
 *
 * The distinction matters. Thickening downward is right for a forearm
 * reaching out to a keyboard, where the run is mostly horizontal — you
 * get a band `thick` deep. Do the same to an arm raised to wave and the
 * run is mostly vertical, so all `thick` does is add length: the arm
 * comes out as wide as its own horizontal drift, which was two pixels,
 * and reads as a stick. So a mostly-vertical limb thickens sideways.
 *
 * The light is upper-right, so the lit edge is the top of a horizontal
 * limb and the right of a vertical one.
 *
 * `across` overrides the guess, and the seated forearms need it. They run
 * six pixels out and eight down, so the guess calls them vertical and
 * thickens them sideways — which slides the arm clear of the sleeve it is
 * supposed to be coming out of and opens a gap of grass at the shoulder.
 * They are forearms reaching forward; they thicken downward.
 */
function limb(
  b: Buf,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  thick: number,
  across?: "x" | "y",
) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const n = Math.max(Math.abs(dx), Math.abs(dy));
  const upright = across ? across === "x" : Math.abs(dy) >= Math.abs(dx);

  const tone = (k: number): RGB =>
    k === 0 ? C.skinLit : k === thick - 1 ? C.skinDeep : k === thick - 2 ? C.skinShade : C.skin;

  for (let s = 0; s <= n; s++) {
    const x = x0 + (dx * s) / n;
    const y = y0 + (dy * s) / n;
    for (let j = 0; j < thick; j++) {
      if (upright) put(b, x + j, y, tone(thick - 1 - j));
      else put(b, x, y + j, tone(j));
    }
  }
}

/** Where the figure sits in the 384×216 scene — clear of the headline on
 *  the left and the status cards on the right. */
export const PERSON_AT = { x: 210, y: 142 };

/** Ground line. Everything that touches grass resolves to this row. */
const GROUND = 61;

/* ==================================================================== */
/*  PARTS                                                                */
/*  Each takes the row its form starts on, so the standing pose reuses    */
/*  the seated one's tee, sling and head without redrawing them.          */
/* ==================================================================== */

/** Dithered contact shadow, so he sits down IN the grass and not on it. */
function groundShadow(b: Buf, ox: number, oy: number, x0: number, w: number) {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < 4; j++) {
      if ((i + j) % 2 === 0) continue;
      put(b, ox + x0 + i, oy + GROUND + j, C.shadow);
    }
  }
}

function legsCrossed(b: Buf, ox: number, oy: number) {
  rect(b, ox + 5, oy + 53, 38, 8, C.jeans);
  rect(b, ox + 5, oy + 53, 38, 2, C.jeansLit);
  rect(b, ox + 5, oy + 60, 38, 1, C.jeansDeep);
  rect(b, ox + 3, oy + 55, 3, 6, C.jeansDeep); // knees turning away
  rect(b, ox + 42, oy + 55, 3, 6, C.jeansDeep);
  rect(b, ox + 14, oy + 58, 20, 2, C.jeansLit); // near shin folded across
}

/**
 * Legs under him, for the standing pose. `len` is the jeans; the shoes go
 * on the end of them and land on GROUND.
 *
 * Long on purpose. The first standing pass gave him legs the same length
 * as his torso, which is roughly a toddler's proportion and read as
 * stumpy next to the seated figure. On an adult the legs are the longest
 * of the three blocks, so here they are — head 29% of him, torso 30%,
 * legs 39%.
 */
function legsStanding(b: Buf, ox: number, top: number, len: number) {
  const h = top + len; // where the jeans end and the shoes start
  for (const lx of [ox + 16, ox + 25]) {
    rect(b, lx, top, 7, len, C.jeans);
    rect(b, lx, top, 2, len, C.jeansLit); // light down the outer face
    rect(b, lx + 5, top, 2, len, C.jeansDeep);
    rect(b, lx, h - 4, 7, 1, C.jeansDeep); // turn-up
  }
  rect(b, ox + 23, top, 2, len - 3, C.jeansDeep); // the gap between them
  // shoes
  rect(b, ox + 15, h, 8, 3, C.shoe);
  rect(b, ox + 25, h, 8, 3, C.shoe);
  rect(b, ox + 15, h, 8, 1, C.jeansLit);
  rect(b, ox + 25, h, 8, 1, C.jeansLit);
}

/**
 * The oversized white tee. Its silhouette is the whole point of the
 * garment: shoulders that drop past where his own shoulders are, sleeves
 * that hang wide and stop mid-arm, and a body that comes back in beneath
 * them. `top` is the shoulder row.
 *
 * `inset` pulls the sleeves in. Seated, with his arms out around a laptop,
 * the full width is right. Standing it is not: forty-one pixels of tee on
 * a ninety-pixel figure is nearly half as wide as he is tall, and reads
 * squat however long the legs are. Standing pulls it in by six.
 *
 * `cutR` ends the LIT sleeve early, at that many rows below `top`. Raising
 * an arm rides its sleeve up; without the cut the wave left a full-length
 * sleeve hanging off a shoulder whose arm was somewhere above it.
 */
function tee(b: Buf, ox: number, top: number, inset = 0, cutR = 0) {
  const SLEEVE_TOP = top + 3;
  const SLEEVE_BOT = top + 15;
  const BOT = top + 28;
  const half = Math.round(inset / 2);

  /* How far the body comes back in UNDER the sleeves — four pixels a side,
   * always, whatever the sleeve inset.
   *
   * This used to be `half`, which made the standing tee a straight tube:
   * inset pulled the sleeves in by six and the body in by three, so the
   * two edges landed within a pixel of each other. A tube leaves an arm
   * nowhere to hang but across his own chest, which is exactly where the
   * standing arm was ending up. The overhang IS the channel the arm drops
   * through, and it is the silhouette the garment is bought for. */
  const body = inset + 4;

  /** Row the lit sleeve ends on — early when that arm is raised. */
  const hemR = cutR ? top + cutR : SLEEVE_BOT;

  /** Left and right edge of the tee on a given row. */
  const span = (y: number): [number, number] => {
    let l: number;
    let r: number;
    // the shoulder seam drops away rather than stepping out square
    if (y === top) [l, r] = [ox + 12, ox + 34];
    else if (y === top + 1) [l, r] = [ox + 9 + half, ox + 37 - half];
    else if (y === top + 2) [l, r] = [ox + 6 + inset, ox + 40 - inset];
    else if (y < SLEEVE_BOT) [l, r] = [ox + 3 + inset, ox + 43 - inset]; // sleeves, full width
    else if (y === SLEEVE_BOT) [l, r] = [ox + 4 + inset, ox + 42 - inset]; // rolled at the corners
    else if (y === SLEEVE_BOT + 1) [l, r] = [ox + 2 + body, ox + 44 - body]; // one row of taper
    else [l, r] = [ox + 3 + body, ox + 43 - body]; // body below the sleeves
    // below the raised arm's short hem there is no sleeve, only body
    if (cutR && y > hemR && y <= SLEEVE_BOT + 1) r = ox + 43 - body;
    return [l, r];
  };

  for (let y = top; y <= BOT; y++) {
    const [l, r] = span(y);
    for (let x = l; x <= r; x++) {
      let c: RGB = C.tee;
      if (y < top + 3) c = C.teeLit; // light lands across the shoulders
      if (x > r - 4 && y < top + 13) c = C.teeLit; // and rakes down the lit side
      if (x < l + 3) c = C.teeShade; // the left of every form turns away
      if (x === l) c = C.teeDeep;
      if (y > BOT - 3) c = C.teeShade; // hem, in the lap's shade
      if (y === BOT) c = C.teeDeep;
      put(b, x, y, c);
    }
  }

  // armhole seams — where the sleeve is set on, and where the body reads
  // as a separate plane from it
  for (let y = SLEEVE_TOP; y <= SLEEVE_BOT; y++) {
    put(b, ox + 10 + half, y, C.teeSeam);
    if (y <= hemR) put(b, ox + 36 - half, y, C.teeSeam);
  }
  // sleeve hems, heavy and turned under — the lit one rides up with cutR
  rect(b, ox + 4 + inset, SLEEVE_BOT - 1, 7, 1, C.teeShade);
  rect(b, ox + 36 - inset, hemR - 1, 7, 1, C.teeShade);
  rect(b, ox + 4 + inset, SLEEVE_BOT, 7, 1, C.teeDeep);
  rect(b, ox + 36 - inset, hemR, 7, 1, C.teeDeep);
  // the sleeve on the shaded side sits in front of the body, so the body
  // takes a soft shadow behind it
  rect(b, ox + 11 + half, SLEEVE_TOP + 2, 1, 10, C.teeSeam);

  /* Two long folds, so the cloth falls rather than lying flat. They live on
   * the body rows, so they move in with the body — pinned at the seated
   * width they sat on the standing tee's outer edge and read as an outline
   * rather than as cloth. */
  const drawIn = body - 4;
  for (const [fx, fy, fh] of [
    [14, 19, 8],
    [32, 18, 9],
  ] as const) {
    const x = ox + (fx < 22 ? fx + drawIn : fx - drawIn);
    rect(b, x, top + fy, 1, fh, C.teeSeam);
    rect(b, x - 1, top + fy + 1, 1, fh - 2, C.teeShade);
  }

  // crew collar, ribbed, with the neck opening dark inside it
  rect(b, ox + 17, top, 12, 2, C.teeShade);
  rect(b, ox + 18, top, 10, 1, C.skinDeep);
  rect(b, ox + 17, top + 2, 12, 1, C.teeSeam);
}

/**
 * The black crossbody sling: over the shoulder on the lit side, down
 * across the chest, to a pouch worn high on the belly. The gold wordmark
 * on the webbing is the one piece of colour on him.
 */
function sling(b: Buf, ox: number, top: number) {
  rect(b, ox + 31, top, 4, 2, C.slingDark); // where it crosses the shoulder
  for (let s = 0; s <= 12; s++) {
    const sx = ox + 32 - s * 0.66;
    const sy = top + s * 0.6;
    put(b, sx + 1, sy, C.slingDeep);
    put(b, sx, sy, C.slingDark);
    put(b, sx - 1, sy, C.sling);
    if (s % 3 === 1) put(b, sx, sy, s % 6 === 1 ? C.goldLit : C.gold); // wordmark
  }
  // The pouch rides high — the laptop lid tops out three rows under it, so
  // any lower and the bag and its wordmark are behind the screen.
  rect(b, ox + 17, top + 7, 14, 7, C.slingDark);
  rect(b, ox + 18, top + 8, 12, 1, C.sling); // sheen off the top face
  rect(b, ox + 17, top + 13, 14, 1, C.slingDeep);
  rect(b, ox + 19, top + 11, 10, 1, C.slingDeep); // zip
  put(b, ox + 29, top + 11, C.steelDark); // zip pull
  rect(b, ox + 16, top + 8, 1, 6, C.teeShade); // the tee shaded beside it
}

/**
 * The mark on the back of the lid: five pixels across, which is close to
 * the proportion it takes on a real fifteen-inch machine, and the single
 * detail that NAMES the object at this size. Without it a dark rectangle
 * on a lap is a book, a folder, or nothing.
 *
 * Round at BOTH ends. The first pass carried the real logo's cleft at the
 * bottom — two pixels of foot with a gap between them — and at five across
 * a gap that size is not a cleft, it is a pair of legs: the mark read as a
 * tiny person standing on his chest. The leaf is the only asymmetry small
 * enough to survive here, and it is the one the eye actually uses.
 */
const APPLE = [
  "...#.",
  ".###.",
  "#####",
  "#####",
  "#####",
  ".###.",
] as const;

/* THE MACHINE'S HORIZON — the row the lid's bottom edge meets the deck.
 *
 * Everything about the laptop resolves from this one row, and the split
 * either side of it is the whole difference between a machine being typed
 * on and a machine being held. Above it: ten rows of lid. Below it: eight
 * rows of keyboard, which is the first version of this figure with enough
 * deck to actually put a hand on. */
const DECK_ROWS = 8;
/** Rows below the figure's origin where the deck's back edge sits. */
const DECK_AT = 51;
/** Lid height with the machine open. Four rows shorter than it was, and
 *  those four rows are now keyboard. A lid tilted back is foreshortened
 *  anyway, so this is the more honest drawing as well as the useful one. */
const LID_OPEN = 10;

/** Left and right edge of the deck on its `j`th row, widening toward us. */
function deckEdge(ox: number, j: number): [number, number] {
  const t = j / (DECK_ROWS - 1);
  return [Math.round(ox + 9 - t * 5), Math.round(ox + 39 + t * 5)];
}

/**
 * The MacBook on his lap. `lid` is how far the screen is still raised, in
 * pixels — 14 is wide open, 0 is shut — which is the whole packing-up
 * animation in one parameter.
 *
 * The lid is painted in the dark shell rather than the deck's silver.
 * Facing us we see its BACK, and its back stands against the oversized
 * white tee: silver on white left a machine that was technically drawn and
 * practically invisible, which took the typing with it — hands bobbing
 * over nothing do not read as typing. Contrast is what makes it exist.
 */
function laptop(
  b: Buf,
  ox: number,
  oy: number,
  lid: number,
  glow: RGB | null,
  strike = -1,
) {
  const DECK = oy + DECK_AT;

  if (lid > 1) {
    const topY = DECK - lid;

    rect(b, ox + 11, topY, 27, lid, C.shell);
    rect(b, ox + 12, topY, 25, 1, C.shellMid); // top edge, turning over
    rect(b, ox + 35, topY + 1, 2, lid - 1, C.shellLit); // light down the lit side
    rect(b, ox + 11, topY, 1, lid, C.shellDark);
    rect(b, ox + 12, topY + 1, 1, lid - 1, C.shellMid);
    rect(b, ox + 37, topY, 1, lid, C.shellDark); // outer edge

    // the tee, shaded either side of a lid standing off it
    rect(b, ox + 10, topY + 1, 1, lid, C.teeShade);
    rect(b, ox + 38, topY + 1, 1, lid, C.teeShade);

    if (lid > 8) {
      const lx = ox + 22;
      const ly = topY + Math.round((lid - APPLE.length) / 2);
      APPLE.forEach((row, j) =>
        row.split("").forEach((cell, i) => {
          if (cell === "#") put(b, lx + i, ly + j, C.logo);
        }),
      );
    }

    /* The spill over the top of the screen — and the one thing on him that
     * can carry the beat.
     *
     * It used to be a single row of pale blue laid on the white tee, which
     * is invisible: at the size this figure is actually drawn, that is one
     * light pixel on light cloth. Two rows, and aimed at the SLING POUCH,
     * which is the darkest thing on his chest and sits directly above the
     * lid. Light on near-black is a change you can see from across the
     * hero; light on white is not. The second row is dithered so the halo
     * falls off instead of ending on a ruled line. */
    if (glow) {
      rect(b, ox + 11, topY - 1, 27, 1, glow);
      /* The bright part of the spill MOVES along the edge rather than the
       * whole band changing brightness.
       *
       * Alternating the entire band bright/dim did carry the beat, but at
       * one hundred and eighty milliseconds a hard swing across
       * twenty-seven pixels is a strobe, and it read as a broken monitor
       * rather than a working one. A highlight travelling along the edge
       * reads as content changing on a screen you cannot see, which is
       * what is actually happening. */
      if (strike >= 0) {
        const gx = ox + 12 + [1, 3, 0, 2][strike] * 6;
        rect(b, gx, topY - 1, 9, 1, C.screenGlow);
      }
      for (let x = ox + 14; x <= ox + 34; x++) {
        if ((x + topY) % 2 === 0) put(b, x, topY - 2, glow);
      }
    }
  } else {
    // shut: a slab, with the lid seam along its edge
    rect(b, ox + 9, DECK - 3, 30, 3, C.shell);
    rect(b, ox + 9, DECK - 3, 30, 1, C.shellLit);
    rect(b, ox + 9, DECK - 1, 30, 1, C.shellDark);
  }

  /* THE DECK — the keyboard, in perspective, and the reason any of this
   * reads as typing.
   *
   * There was no keyboard here before. The lid took fourteen rows and the
   * base got five, which is one row less than a hand is tall: his hands
   * had nowhere to be except pressed against the left and right EDGES of a
   * slab, so what the figure actually showed was a man holding a closed
   * object. No amount of animation fixes that, and this is what every
   * attempt above was really failing to work around.
   *
   * So the lid gives up four rows and the deck takes them. Eight rows of
   * deck is enough for a plane: it widens toward the viewer, carries a
   * recessed well of keys his fingers can rest ON, and leaves a trackpad
   * showing in the gap between his hands.
   */
  for (let j = 0; j < DECK_ROWS; j++) {
    const y = DECK + j;
    const [l, r] = deckEdge(ox, j);
    // front lip and bevel turn away from an upper-right sun; the top face
    // catches it
    const face = j === 0 ? C.metalMid : j === 6 ? C.metalMid : j === 7 ? C.metalDark : C.metal;
    rect(b, l, y, r - l + 1, 1, face);
    put(b, l, y, C.metalMid);
    put(b, r, y, C.metalLit);
  }

  /* The well of keys, recessed into the deck. Two lit pixels then one dark
   * gives key tops with a gap between; the phase shifts a pixel each row so
   * the columns stagger the way a real keyboard's do rather than ruling
   * four straight lines down the deck. */
  for (let j = 1; j <= 4; j++) {
    const y = DECK + j;
    const [l, r] = deckEdge(ox, j);
    const kl = l + 3;
    const kr = r - 3;
    rect(b, kl, y, kr - kl + 1, 1, C.metalDark);
    for (let x = kl; x <= kr; x++) {
      if ((x - kl + j) % 3 !== 2) put(b, x, y, C.metalMid);
    }
  }

  // the trackpad, in the one part of the deck his hands leave clear
  rect(b, ox + 20, DECK + 5, 9, 2, C.metal);
  rect(b, ox + 20, DECK + 5, 9, 1, C.metalLit);
  rect(b, ox + 20, DECK + 5, 1, 2, C.metalMid);

  /* A key lit on this beat, in the gap between his hands.
   *
   * His own fingers cover the keys they strike — that is true of a real
   * keyboard seen from the front too — so the strike also shows here,
   * where nothing occludes it. Scattered, not left to right: in order it
   * reads as a progress bar filling rather than as someone typing. */
  if (strike >= 0) {
    const kx = ox + 18 + [2, 0, 3, 1][strike] * 3;
    const ky = DECK + 1 + (strike % 3);
    rect(b, kx, ky, 2, 1, C.screen);
  }
}

/**
 * A hand on the keys. `tap` is which of the three fingers is down on this
 * beat; that finger reaches a row further and darkens under the tip.
 *
 * The fingers are the whole point. A hand that only moves as a block gives
 * you a one-pixel bob that nobody reads as typing — the eye wants to see
 * something strike.
 */
function hand(b: Buf, x: number, y: number, tap: number) {
  // back of the hand, arched over the keys
  rect(b, x, y, 7, 3, C.skin);
  rect(b, x, y, 7, 1, C.skinLit); // knuckles, square to the sun
  rect(b, x, y + 2, 7, 1, C.skinShade);
  put(b, x, y, C.skinShade);
  put(b, x + 6, y, C.skinLit);

  /* Fingers standing DOWN off the knuckles onto the key well, one pixel
   * wide with a pixel of gap between them.
   *
   * They used to be three shaded pixels nicked out of the bottom edge of a
   * solid block — which is all they could be, because there was no deck
   * underneath for a finger to reach. Now there is one, and a finger is a
   * pale column on a dark well: the highest contrast on the whole machine,
   * and the only place a keystroke can actually be seen happening. */
  for (let f = 0; f < 3; f++) {
    const fx = x + 1 + f * 2;
    const down = f === tap;
    const len = down ? 4 : 3;
    rect(b, fx, y + 3, 1, len, C.skin);
    put(b, fx, y + 3, C.skinLit);
    put(b, fx, y + 2 + len, C.skinDeep); // the tip, pressed into the key
    if (down) put(b, fx + 1, y + 2 + len, C.screen); // the key lighting under it
  }
}

/**
 * The open hand at the top of the wave. Three fingers standing off a palm,
 * middle one longest, thumb out on the shaded side; `x`,`y` is the top-left
 * of the fingers, and the palm bottom lands on `y + 7`.
 *
 * The fingers are not a detail. The wave used to end in a flat six-by-five
 * block of skin with three dark pixels carved INTO it, which reads as a
 * mitten held up beside his ear. Standing the fingers proud of the palm is
 * what turns the shape into a hand. Three of them, not four, so it matches
 * the count on the seated typing hand and the two poses stay the same man.
 */
function openHand(b: Buf, x: number, y: number) {
  for (const [fx, len] of [
    [0, 3],
    [2, 4],
    [4, 3],
  ] as const) {
    const fy = y + 4 - len;
    rect(b, x + fx, fy, 2, len, C.skin);
    rect(b, x + fx, fy, 1, len, C.skinShade); // each finger turns away on its left
    put(b, x + fx + 1, fy, C.skinLit);
  }

  rect(b, x, y + 4, 6, 4, C.skin);
  rect(b, x, y + 4, 6, 1, C.skinLit); // knuckles, square to the sun
  rect(b, x, y + 4, 1, 4, C.skinShade);
  rect(b, x + 5, y + 4, 1, 4, C.skinLit);
  rect(b, x, y + 7, 6, 1, C.skinShade);
  rect(b, x - 1, y + 5, 1, 2, C.skinShade); // thumb
}

/**
 * A forearm as a solid tapering wedge, given its left and right edge at
 * the top and at the bottom.
 *
 * It has to be a wedge and not a stroked line. The sleeve opening is seven
 * pixels wide and the wrist is narrower and set inward, so a line of fixed
 * thickness leaves the rest of the opening empty — which is precisely the
 * band of grass that showed between the tee and the arm. Interpolating
 * both edges fills the opening at the top and arrives at the wrist.
 */
function forearm(b: Buf, ax0: number, bx0: number, ax1: number, bx1: number, y0: number, y1: number) {
  for (let y = y0; y <= y1; y++) {
    const t = (y - y0) / (y1 - y0);
    const l = Math.round(ax0 + (ax1 - ax0) * t);
    const r = Math.round(bx0 + (bx1 - bx0) * t);
    for (let x = l; x <= r; x++) {
      const c =
        y === y0 ? C.skinLit : x === l ? C.skinShade : x === r ? C.skinLit : C.skin;
      put(b, x, y, c);
    }
  }
}

/** Forearms out of the sleeve hems and down onto the keyboard band.
 *
 * The hands sit a row lower than they used to. Against a silver lid it did
 * not matter where they landed; against the dark one it does, and at the
 * old height they were level with the SCREEN rather than the deck — which
 * read as him holding the lid rather than typing on the machine. */
function armsForward(b: Buf, ox: number, oy: number, lDrop: number, rDrop: number, tap: number) {
  /* The WRIST travels with the hand, not just the hand.
   *
   * Moving the hand alone left the forearm nailed in place and the wrist
   * stretching and squashing under it, which is both wrong and — worse —
   * almost invisible: twenty-eight pixels out of fourteen hundred changed
   * per beat. Carrying the forearm's bottom edge along doubles the moving
   * area for nothing, and it is what an arm actually does. */
  /* The hands come to rest ON the key well now rather than beside the lid,
   * and they leave a gap between them — ox+16..ox+29 — so the keyboard and
   * the trackpad are visible between his wrists instead of the machine
   * reading as one closed slab. */
  forearm(b, ox + 4, ox + 10, ox + 9, ox + 15, oy + 42, oy + DECK_AT - 1 + lDrop);
  forearm(b, ox + 36, ox + 42, ox + 30, ox + 36, oy + 42, oy + DECK_AT + rDrop);

  // Both hands off the same row: the fingertip has to land INSIDE the key
  // well, and the well is only four rows deep.
  hand(b, ox + 9, oy + DECK_AT - 3 + lDrop, tap);
  hand(b, ox + 30, oy + DECK_AT - 3 + rDrop, (tap + 2) % 3);

  // the steel watch, on the forearm nearer to us
  rect(b, ox + 36, oy + 45, 5, 4, C.steelDark);
  rect(b, ox + 36, oy + 46, 5, 2, C.steel);
  rect(b, ox + 37, oy + 46, 3, 1, C.slingDeep); // dark dial
}

/**
 * The head. `dir` is -1, 0 or 1 — turned toward the shaded side, level, or
 * toward the lit side. `hy` is the brow line: the hair starts six rows
 * above it and the neck ends twenty-seven below, which is exactly where a
 * tee collar drawn at `hy + 27` meets it.
 *
 * A turn at this size is not a redraw. Shifting the features two pixels
 * and moving the deep side-shadow across is enough — the silhouette barely
 * changes on a real head at three-quarter either, and holding it still
 * keeps the three sprites from popping against each other.
 */
function head(b: Buf, ox: number, hy: number, dir: -1 | 0 | 1) {
  const d = dir * 2; // how far the features swing
  const cx = ox + 22 + d; // centre line of the face, after the turn

  rect(b, ox + 19, hy + 21, 9, 7, C.skinShade); // neck
  rect(b, ox + 19, hy + 21, 9, 1, C.skinDeep);
  rect(b, ox + 26, hy + 22, 2, 5, C.skinDeep); // the head's shadow down one side

  // face, tapering into the jaw
  for (let j = 0; j <= 20; j++) {
    const inset = j <= 1 ? 1 : j === 19 ? 1 : j === 20 ? 2 : 0;
    for (let x = ox + 14 + inset; x <= ox + 31 - inset; x++) {
      let c: RGB = C.skin;
      if (x >= ox + 29) c = C.skinLit; // lit side
      if (x <= ox + 15) c = C.skinShade; // turning side
      put(b, x, hy + 4 + j, c);
    }
  }
  rect(b, ox + 16, hy + 23, 14, 2, C.skinShade); // under-jaw
  // Turning deepens the shadow on the trailing cheek and opens the leading
  // one. Without this the three heads read as the same head, nudged.
  if (dir !== 0) {
    const trail = dir > 0 ? ox + 14 : ox + 29;
    rect(b, trail, hy + 6, 2, 16, C.skinShade);
    rect(b, dir > 0 ? ox + 30 : ox + 15, hy + 8, 2, 12, C.skinLit);
  }

  /* sunglasses — black, rectangular, sitting just under the fringe. Two
   * lenses with a bridge and a lit top rail, never one solid bar: the bar
   * is what made an earlier sprite read as anonymous. */
  rect(b, cx - 7, hy + 11, 7, 3, C.lens);
  rect(b, cx + 2, hy + 11, 7, 3, C.lens);
  rect(b, cx - 7, hy + 11, 7, 1, C.frame);
  rect(b, cx + 2, hy + 11, 7, 1, C.frame);
  rect(b, cx, hy + 11, 2, 1, C.frame); // bridge
  rect(b, cx - 7, hy + 13, 7, 1, C.lensDeep); // lenses darken downward
  rect(b, cx + 2, hy + 13, 7, 1, C.lensDeep);
  put(b, cx - 6, hy + 12, C.glint); // the sky, caught in each lens
  put(b, cx - 5, hy + 12, C.glint);
  put(b, cx + 4, hy + 12, C.glint);
  put(b, cx - 9, hy + 12, C.frame); // temples, back toward the ears
  put(b, cx + 10, hy + 12, C.frame);
  rect(b, cx - 7, hy + 14, 7, 1, C.skinShade); // and their shadow on the cheeks
  rect(b, cx + 2, hy + 14, 7, 1, C.skinShade);

  // nose
  rect(b, cx, hy + 15, 2, 2, C.skinShade);
  put(b, cx + 2, hy + 16, C.skinLit);
  put(b, cx, hy + 17, C.skinDeep);

  /* The beard follows the jaw: high in front of the ears, dropping to the
   * chin, so the cheeks stay skin. Kept deliberately short — a wide dark
   * band across the bottom of an 18-pixel face swallows it, and at this
   * size a trimmed beard reads more like a beard than a full one does. */
  for (let x = ox + 14; x <= ox + 31; x++) {
    const t = Math.abs(x - (cx + 0.5)) / 8.5; // 0 at the chin, 1 at the ears
    const top = hy + 21 - Math.round(t * t * 4);
    const bot = hy + 24 - Math.round(t * t * 5);
    for (let y = top; y <= bot; y++) put(b, x, y, y >= hy + 21 ? C.beard : C.beardLit);
  }
  // a little stubble in front of each ear, dithered so its edge is soft
  for (let y = hy + 16; y <= hy + 18; y++) {
    for (const x of [ox + 15, ox + 30]) {
      if ((x + y) % 2 === 1) continue;
      put(b, x, y, C.beardLit);
    }
  }
  rect(b, cx - 3, hy + 17, 9, 2, C.beard); // moustache, out to the smile lines
  rect(b, cx - 2, hy + 19, 5, 1, C.hairDeep); // the mouth, closed
  put(b, cx + 3, hy + 18, C.hairDeep); // lifted at one corner
  rect(b, ox + 19, hy + 25, 8, 1, C.skinDeep); // occlusion where beard meets neck

  /* hair — heavy and wavy, sweeping toward the lit side, but cropped
   * close to the skull. An earlier pass piled it three rows higher and it
   * dominated the sprite: at this scale the hair is a third of the whole
   * head, so every row added to the top is a row taken off the face. */
  const h = dir; // the mass leans a pixel with the turn
  rect(b, ox + 12 + h, hy + 1, 22, 9, C.hair);
  rect(b, ox + 13 + h, hy - 1, 21, 2, C.hair);
  rect(b, ox + 16 + h, hy - 3, 15, 2, C.hair);
  rect(b, ox + 28 + h, hy - 3, 6, 4, C.hair); // the sweep, piled to one side
  rect(b, ox + 33 + h, hy - 1, 3, 7, C.hairDark);
  rect(b, ox + 11 + h, hy + 2, 2, 7, C.hairDark);
  rect(b, ox + 11 + h, hy + 2, 1, 6, C.hairDeep); // deep shadow down the far side

  // sheen along the waves, all of it on the lit side
  rect(b, ox + 22 + h, hy - 3, 6, 1, C.hairLit);
  rect(b, ox + 26 + h, hy - 1, 6, 1, C.hairLit);
  rect(b, ox + 29 + h, hy + 1, 4, 1, C.hairLit);
  rect(b, ox + 15 + h, hy, 4, 1, C.hairLit);

  // notches, so the silhouette is not one solid mass
  for (const [wx, wy] of [
    [14, 1],
    [18, -1],
    [24, -3],
    [31, -2],
  ] as const) {
    put(b, ox + wx + h, hy + wy, C.hairDeep);
    put(b, ox + wx + 1 + h, hy + wy + 1, C.hairDeep);
  }

  // fringe, ending unevenly just above the glasses
  rect(b, ox + 13, hy + 9, 20, 1, C.hairDark);
  for (const fx of [15, 20, 21, 27, 30]) put(b, ox + fx, hy + 10, C.hairDark);
  // sideburns, short, running down to meet the beard
  rect(b, ox + 12, hy + 9, 2, 5, C.hairDark);
  rect(b, ox + 32, hy + 9, 2, 5, C.hairDark);
  rect(b, ox + 12, hy + 10, 1, 3, C.hairDeep);

  // light bouncing off the laptop, back onto the underside of his jaw
  rect(b, cx - 2, hy + 25, 6, 1, C.skinLit);
}

/* ==================================================================== */
/*  THE SPRITES                                                          */
/* ==================================================================== */

/** Row the seated tee's shoulders sit on. The head resolves from it. */
const SEATED_TEE = 27;

export const BODY_FRAMES = 4;

/**
 * The seated body: everything but the head, so the head can turn
 * independently. Four beats of typing — the hands alternate and the screen
 * glow pulses with them.
 */
export function paintBody(frame: number): Buf {
  const b = makeBuf();
  const ox = PERSON_AT.x;
  const oy = PERSON_AT.y;

  /* All four beats must differ, or the flipbook is not a flipbook.
   *
   * The first version keyed everything off one `leftDown` boolean, which
   * made frames 0 and 1 byte-identical and frames 2 and 3 likewise — two
   * states shown twice each, so what you got was a slow twitch rather than
   * hands typing. These three tables never line up: the hands ride on a
   * four-beat pattern, the fingers strike on a three-beat one, and the
   * screen flickers on two. */
  /* One row of travel for the hand — the FINGERS carry the beat now, and
   * they can, because there is finally a key well under them to reach
   * into. Two rows was a stopgap from when the whole tell was a hand
   * bobbing against a slab, and it now overshoots: it drops the fingertips
   * off the keys and onto the trackpad. */
  const lDrop = [0, 1, 1, 0][frame];
  const rDrop = [1, 1, 0, 0][frame];
  const tap = frame % 3;

  groundShadow(b, ox, oy, -1, 48);
  legsCrossed(b, ox, oy);
  tee(b, ox, oy + SEATED_TEE);
  sling(b, ox, oy + SEATED_TEE);
  laptop(b, ox, oy, LID_OPEN, C.screen, frame);
  armsForward(b, ox, oy, lDrop, rDrop, tap);

  return b;
}

/** The three directions the head can face, shaded side first. */
export const HEAD_DIRS = ["l", "c", "r"] as const;
export type HeadDir = (typeof HEAD_DIRS)[number];

/** The seated head on its own, so it can turn without redrawing the body. */
export function paintHead(dir: HeadDir): Buf {
  const b = makeBuf();
  head(b, PERSON_AT.x, PERSON_AT.y, dir === "l" ? -1 : dir === "r" ? 1 : 0);
  return b;
}

export const PACK_FRAMES = 4;

/**
 * Packing up, driven by scroll rather than by the clock: the lid comes
 * down over four beats and his hands come off it and onto his knees. Frame
 * 0 deliberately matches the typing pose, so the crossfade into this
 * sequence has nothing to jump over.
 */
export function paintPack(frame: number): Buf {
  const b = makeBuf();
  const ox = PERSON_AT.x;
  const oy = PERSON_AT.y;
  const lid = [LID_OPEN, 7, 3, 0][frame];

  groundShadow(b, ox, oy, -1, 48);
  legsCrossed(b, ox, oy);
  tee(b, ox, oy + SEATED_TEE);
  sling(b, ox, oy + SEATED_TEE);
  laptop(b, ox, oy, lid, frame === 0 ? C.screen : null);

  if (frame < 2) {
    armsForward(b, ox, oy, 0, 0, 1);
  } else {
    // hands off the machine, resting on his knees — same wedge, dropped
    // almost straight down rather than angled in
    forearm(b, ox + 4, ox + 10, ox + 4, ox + 10, oy + 43, oy + 51);
    forearm(b, ox + 36, ox + 42, ox + 36, ox + 42, oy + 43, oy + 51);
    rect(b, ox + 4, oy + 51, 7, 4, C.skin);
    rect(b, ox + 4, oy + 51, 7, 1, C.skinLit);
    rect(b, ox + 4, oy + 54, 7, 1, C.skinShade);
    rect(b, ox + 36, oy + 51, 7, 4, C.skin);
    rect(b, ox + 36, oy + 51, 7, 1, C.skinLit);
    rect(b, ox + 36, oy + 54, 7, 1, C.skinShade);
    rect(b, ox + 36, oy + 47, 5, 3, C.steelDark); // watch
    rect(b, ox + 36, oy + 48, 5, 1, C.steel);
  }

  head(b, ox, oy, 0);
  return b;
}

export const WAVE_FRAMES = 4;

/* Standing proportions, measured off the ground line up.
 *
 *   legs   37 rows (34 of jeans + 3 of shoe)   40% of him
 *   torso  28 rows of tee                      30%
 *   head   27 rows, hair to chin               29%
 *
 * The legs being the longest block is the whole difference between an
 * adult and a toddler at this size, and the first pass had them tying
 * with the torso. The tee is pulled in six pixels a side as well: seated
 * he needs the width for his arms, standing it just made him squat.
 *
 * The jeans are 34 and not 33 because 33 put the soles on oy+59 while
 * groundShadow starts at oy+61 — he stood two pixels off his own shadow,
 * which at this scale is the difference between standing and hovering. */
const STANDING_TEE = -2;
const STANDING_LEGS = 34;
const STANDING_INSET = 6;

/* Row the raised arm's sleeve ends on, relative to the tee's shoulders.
 *
 * Short — a cap, not a sleeve. Cutting it at nine left most of a sleeve
 * still hanging on the side whose arm was in the air, and the step where
 * it ended read as a bite out of the shirt. Five puts the hem up on the
 * shoulder, which is where an oversized sleeve actually goes when you
 * raise that arm, and gives the arm a cap to come out from under. */
const WAVE_SLEEVE_CUT = 5;

/**
 * On his feet, waving. The whole silhouette changes, so unlike the seated
 * figure this one is painted entire — but it still reuses the same tee,
 * sling and head, just higher up the canvas.
 */
export function paintWave(frame: number): Buf {
  const b = makeBuf();
  const ox = PERSON_AT.x;
  const oy = PERSON_AT.y;
  const top = oy + STANDING_TEE;
  // The waving hand swings out and back; the body rocks a pixel with it.
  const swing = [0, 2, 3, 2][frame];
  const rock = frame === 1 || frame === 2 ? 1 : 0;
  const t = top - rock;

  groundShadow(b, ox, oy, 12, 24);
  legsStanding(b, ox, top + 26, STANDING_LEGS);

  /* The UPPER arm of the wave goes down FIRST, before the tee, and that
   * ordering is the whole fix.
   *
   * The arm has to hinge at the shoulder, not at the ribs. Painted after
   * the tee it could only ever start below the sleeve, which put the joint
   * at his waist and left the arm looking snapped on. Painted before it,
   * the sleeve cap lands over the root and the arm reads as coming out
   * from under cloth — which is what a shoulder looks like. The forearm
   * and hand are clear of the tee entirely, so they go on afterwards. */
  limb(b, ox + 32, t + 5, ox + 38, t - 2, 5);

  tee(b, ox, t, STANDING_INSET, WAVE_SLEEVE_CUT);
  sling(b, ox, t);

  /* The arm hanging at his side, OUTSIDE the body of the tee.
   *
   * It used to run down ox+11..ox+14, and the standing body ran ox+10..
   * ox+36 — so the whole arm was inside the shirt, and what you saw was a
   * hand growing out of his stomach. Now the sleeves overhang the body by
   * four pixels a side and the arm drops through that channel: clear of
   * the body, tucked under the sleeve hem it comes out of.
   *
   * It also hangs FURTHER. Fingertips reach the top of the thigh on a
   * standing adult, which is below the hem of a tee this size; stopping
   * two rows short of the hem read as arms held stiffly clear of himself. */
  limb(b, ox + 10, t + 15, ox + 10, t + 25, 4);
  rect(b, ox + 9, t + 24, 5, 5, C.skin);
  rect(b, ox + 9, t + 24, 5, 1, C.skinLit);
  rect(b, ox + 9, t + 24, 1, 5, C.skinShade);
  for (const fx of [10, 12]) put(b, ox + fx, t + 29, C.skinShade); // fingers, just parted
  rect(b, ox + 9, t + 28, 5, 1, C.skinDeep);

  /* The forearm, up from an elbow that is above his own shoulder, and the
   * open hand beside his face.
   *
   * The old pose bent the elbow at the hip and topped out at t-3 — chin
   * height. A hand held at your own chin is not a wave, it is a man
   * checking his beard. This one puts the palm level with the glasses and
   * the fingers up past the brow, which is the height the gesture is read
   * at. The palm also OVERLAPS the wrist row: the old one left a blank row
   * between forearm and hand, and at this size a blank row is amputation. */
  limb(b, ox + 38, t - 2, ox + 38 + swing, t - 16, 5);
  openHand(b, ox + 37 + swing, t - 23);

  // the watch, now on show, riding up the forearm with the swing
  const wx = ox + 38 + Math.round(swing * 0.6);
  rect(b, wx, t - 11, 5, 3, C.steelDark);
  rect(b, wx, t - 10, 5, 1, C.steel);
  rect(b, wx + 1, t - 10, 3, 1, C.slingDeep); // dark dial

  head(b, ox, t - 27, 0);
  return b;
}
