/* =====================================================================
 *  THE FIGURE — Shikhar, sitting on the lawn, typing
 *  ---------------------------------------------------------------------
 *  Drawn rather than traced. The reference photograph is a standing shot
 *  under a warm restaurant lamp, so pixelating it directly would give a
 *  standing man in orange light against a park at midday. What carries
 *  over are the features that identify him — the tall swept volume of
 *  dark hair, the black sunglasses, the stubble, the white oversized tee,
 *  the black crossbody sling, the steel watch — with the palette sampled
 *  from the photo and corrected from tungsten back toward daylight.
 *
 *  Drawn at the scene's own pixel grid, never scaled. Doubling a small
 *  sprite would give him fatter pixels than everything around him, which
 *  is the fastest way to make composited pixel art look pasted on.
 *
 *  What makes a sprite read as solid rather than flat, in order of value:
 *    1. FOUR tones per material, not two — a lit face, a mid, a shadow
 *       and a deep occlusion under the chin, the sleeves and the lap.
 *    2. Contact shadows everywhere two things meet.
 *    3. Asymmetry. The hair sweeps one way; the shoulders are not level.
 *    4. Selective outlining — dark where the form turns away from the
 *       light, absent where it faces into it.
 * ===================================================================== */

import { makeBuf, type Buf, type RGB } from "./pixelScene";

const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

/* Sampled from my1/my2/my3.jpeg and white-balanced to daylight. The
 * reference shots are a warm cafe and two sunsets, so the raw samples come
 * back orange (skin read #a75439, shirt #b7bee2); these are those hues
 * corrected back to midday. */
const C = {
  hairDeep: hex("#0A0706"),
  hairDark: hex("#171010"),
  hair: hex("#241A16"),
  hairLit: hex("#3F2D22"),

  skinDeep: hex("#7E4A2C"),
  skinShade: hex("#AB6C43"),
  skin: hex("#D9976B"),
  skinLit: hex("#F0BC92"),

  beard: hex("#33231A"),
  beardLit: hex("#4E3626"),
  tooth: hex("#F6EFE4"),

  /* The striped shirt — the single most identifiable thing he wears. */
  shirtLit: hex("#F4F7FC"),
  shirt: hex("#E4EBF5"),
  shirtStripe: hex("#A9C0DC"),
  shirtShade: hex("#C4D1E2"),
  shirtDeep: hex("#9FB0C6"),

  slingDeep: hex("#0C0A09"),
  slingDark: hex("#161211"),
  sling: hex("#282120"),

  jeansDeep: hex("#26303D"),
  jeans: hex("#38455A"),
  jeansLit: hex("#4E6076"),

  steel: hex("#D6DBE0"),
  steelDark: hex("#8A929B"),

  metalLit: hex("#D2D8DE"),
  metal: hex("#B3BAC3"),
  metalMid: hex("#868E99"),
  metalDark: hex("#5C646E"),

  screen: hex("#BFE6F7"),
  screenGlow: hex("#EAF8FF"),
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

/** Where the figure sits in the 384×216 scene — clear of the headline on
 *  the left and the status cards on the right. */
export const PERSON_AT = { x: 210, y: 142 };

export const PERSON_FRAMES = 4;

/** One frame of the seated figure. Origin is the top-left of his hair. */
export function paintPerson(frame: number): Buf {
  const b = makeBuf();
  const ox = PERSON_AT.x;
  const oy = PERSON_AT.y;

  // The head dips a pixel on two of four beats — the nod of someone typing.
  const nod = frame === 1 || frame === 3 ? 1 : 0;
  // Hands alternate; the glow pulses with them.
  const leftDown = frame === 0 || frame === 1;

  /* ---- contact shadow, dithered so it sits down in the grass ---------- */
  for (let i = 0; i < 44; i++) {
    for (let j = 0; j < 4; j++) {
      if ((i + j) % 2 === 0) continue;
      put(b, ox + 1 + i, oy + 61 + j, C.shadow);
    }
  }

  /* ---- crossed legs ---------------------------------------------------- */
  rect(b, ox + 4, oy + 54, 38, 7, C.jeans);
  rect(b, ox + 4, oy + 54, 38, 2, C.jeansLit);
  rect(b, ox + 4, oy + 60, 38, 1, C.jeansDeep);
  rect(b, ox + 2, oy + 56, 3, 5, C.jeansDeep); // knees turning away
  rect(b, ox + 41, oy + 56, 3, 5, C.jeansDeep);
  rect(b, ox + 13, oy + 59, 20, 2, C.jeansLit); // near shin folded across

  /* ---- torso: the light blue striped shirt ------------------------------ */
  const TORSO_X = 6;
  const TORSO_W = 34;
  const TORSO_Y = oy + 26;
  const TORSO_H = 30;

  for (let j = 0; j < TORSO_H; j++) {
    for (let i = 0; i < TORSO_W; i++) {
      const x = ox + TORSO_X + i;
      const y = TORSO_Y + j;
      // Vertical pinstripes every third column — the shirt's signature, and
      // stripes are the one garment detail that survives at this pixel size.
      const striped = i % 3 === 1;
      let c: RGB = striped ? C.shirtStripe : C.shirt;
      if (j < 3) c = striped ? C.shirtStripe : C.shirtLit; // light off the shoulders
      if (j > TORSO_H - 6) c = striped ? C.shirtDeep : C.shirtShade; // hem in shade
      if (i < 2 || i > TORSO_W - 3) c = striped ? C.shirtDeep : C.shirtShade; // turning edges
      put(b, x, y, c);
    }
  }
  // open collar, a shallow V
  rect(b, ox + 17, oy + 26, 12, 1, C.shirtShade);
  for (let k = 0; k < 5; k++) {
    put(b, ox + 20 + k, oy + 27 + k, C.shirtDeep);
    put(b, ox + 26 - k, oy + 27 + k, C.shirtDeep);
  }
  rect(b, ox + 22, oy + 27, 3, 4, C.skinShade); // a little chest in the opening
  // placket + two buttons
  rect(b, ox + 22, oy + 32, 1, 20, C.shirtDeep);
  put(b, ox + 22, oy + 38, C.shirtLit);
  put(b, ox + 22, oy + 46, C.shirtLit);

  /* ---- the black crossbody sling ---------------------------------------- */
  for (let s2 = 0; s2 < 20; s2++) {
    const sx = ox + 15 + Math.round(s2 * 0.62);
    put(b, sx, oy + 27 + s2, C.slingDark);
    put(b, sx + 1, oy + 27 + s2, C.sling);
    put(b, sx + 2, oy + 27 + s2, C.slingDeep);
  }
  rect(b, ox + 21, oy + 45, 15, 8, C.sling); // the pouch, worn low and centre
  rect(b, ox + 21, oy + 45, 15, 2, C.slingDark);
  rect(b, ox + 21, oy + 52, 15, 1, C.slingDeep);
  rect(b, ox + 23, oy + 48, 11, 1, C.slingDeep); // zip
  put(b, ox + 34, oy + 48, C.steelDark); // zip pull

  /* ---- arms -------------------------------------------------------------- */
  for (let j = 0; j < 14; j++) {
    for (let i = 0; i < 5; i++) {
      const striped = i % 3 === 1;
      const c: RGB = j < 2 ? (striped ? C.shirtStripe : C.shirtLit) : striped ? C.shirtStripe : C.shirt;
      put(b, ox + 2 + i, oy + 29 + j, c);
      put(b, ox + 39 + i, oy + 30 + j, c);
    }
  }
  rect(b, ox + 2, oy + 41, 5, 2, C.shirtShade); // rolled cuffs
  rect(b, ox + 39, oy + 42, 5, 2, C.shirtShade);

  // Forearms angle in toward the keyboard; one sits a pixel lower per beat.
  const lY = oy + 43 + (leftDown ? 1 : 0);
  const rY = oy + 44 + (leftDown ? 0 : 1);
  rect(b, ox + 3, lY, 4, 7, C.skin);
  rect(b, ox + 3, lY, 4, 1, C.skinLit);
  rect(b, ox + 3, lY + 6, 4, 1, C.skinShade);
  rect(b, ox + 40, rY, 4, 7, C.skin);
  rect(b, ox + 40, rY, 4, 1, C.skinLit);
  rect(b, ox + 40, rY + 6, 4, 1, C.skinShade);

  // steel watch, on the wrist that faces us
  rect(b, ox + 40, rY + 3, 4, 3, C.steel);
  rect(b, ox + 41, rY + 4, 2, 1, C.slingDeep); // dark dial
  rect(b, ox + 40, rY + 5, 4, 1, C.steelDark);

  // wrists turning in toward the keys
  rect(b, ox + 6, lY + 5, 5, 3, C.skinShade);
  rect(b, ox + 36, rY + 5, 5, 3, C.skinShade);
  // hands
  rect(b, ox + 10, lY + 6, 6, 3, C.skin);
  rect(b, ox + 10, lY + 6, 6, 1, C.skinLit);
  rect(b, ox + 31, rY + 6, 6, 3, C.skin);
  rect(b, ox + 31, rY + 6, 6, 1, C.skinLit);
  for (const k of [0, 2, 4]) {
    put(b, ox + 11 + k, lY + 8, C.skinShade);
    put(b, ox + 32 + k, rY + 8, C.skinShade);
  }

  /* ---- head --------------------------------------------------------------- */
  /* Face visible and smiling, per my1/my3 — no sunglasses. The stripes, the
   * sling and the hair volume carry the likeness; hiding the eyes behind a
   * black bar made the earlier sprite read as anonymous. */
  const hy = oy + nod;

  rect(b, ox + 18, oy + 24 + nod, 10, 4, C.skinShade); // neck
  rect(b, ox + 18, oy + 24 + nod, 10, 1, C.skinDeep);

  rect(b, ox + 14, hy + 6, 18, 20, C.skin); // face
  rect(b, ox + 15, hy + 6, 15, 2, C.skinLit); // forehead
  rect(b, ox + 31, hy + 9, 1, 15, C.skinShade); // far cheek turns away
  rect(b, ox + 13, hy + 10, 1, 12, C.skinShade);
  rect(b, ox + 16, hy + 24, 14, 2, C.skinShade); // under-jaw

  // brows, then eyes — two pixels each is all a 18px face can carry
  rect(b, ox + 17, hy + 11, 4, 1, C.beard);
  rect(b, ox + 25, hy + 11, 4, 1, C.beard);
  rect(b, ox + 18, hy + 13, 2, 1, C.hairDeep);
  rect(b, ox + 26, hy + 13, 2, 1, C.hairDeep);

  rect(b, ox + 22, hy + 16, 2, 2, C.skinShade); // nose
  put(b, ox + 24, hy + 17, C.skinLit);

  // the smile, with a hint of teeth
  rect(b, ox + 19, hy + 20, 7, 1, C.beard);
  rect(b, ox + 20, hy + 21, 5, 1, C.tooth);
  put(b, ox + 18, hy + 19, C.beard);
  put(b, ox + 26, hy + 19, C.beard);

  // full beard along the jaw, moustache above the smile
  for (let y = hy + 17; y <= hy + 25; y++) {
    for (let x = ox + 15; x <= ox + 30; x++) {
      if (y >= hy + 20 && y <= hy + 21 && x > ox + 18 && x < ox + 26) continue; // mouth
      const dense = y > hy + 21 || x < ox + 18 || x > ox + 27;
      if (!dense && (x + y) % 2 === 1) continue; // thins out at the cheeks
      put(b, x, y, y > hy + 22 ? C.beard : C.beardLit);
    }
  }
  rect(b, ox + 19, hy + 18, 8, 1, C.beard); // moustache

  // hair — thick, wavy, high volume. A flat cap reads as a helmet, so the
  // crown is built from three offset lobes with notches between them.
  rect(b, ox + 11, hy, 24, 9, C.hair);
  rect(b, ox + 13, hy - 3, 9, 3, C.hair);
  rect(b, ox + 23, hy - 4, 10, 4, C.hair);
  rect(b, ox + 18, hy - 5, 8, 2, C.hair);
  rect(b, ox + 15, hy - 2, 6, 2, C.hairLit); // sheen across the waves
  rect(b, ox + 24, hy - 3, 7, 2, C.hairLit);
  put(b, ox + 22, hy - 4, C.hairLit);
  rect(b, ox + 10, hy + 3, 3, 9, C.hairDark); // sideburns into the beard
  rect(b, ox + 33, hy + 3, 3, 9, C.hairDark);
  rect(b, ox + 11, hy + 6, 2, 3, C.hairDeep);
  rect(b, ox + 34, hy + 6, 2, 3, C.hairDeep);
  // wave notches, so the silhouette is not a solid dome
  for (const [wx, wy] of [
    [14, -1],
    [20, -2],
    [27, -2],
    [31, 0],
  ] as const) {
    put(b, ox + wx, hy + wy, C.hairLit);
    put(b, ox + wx + 1, hy + wy + 1, C.hairDeep);
  }
  rect(b, ox + 12, hy + 9, 9, 1, C.hairDark); // uneven hairline
  rect(b, ox + 25, hy + 9, 9, 1, C.hairDark);

  /* ---- laptop --------------------------------------------------------------- */
  // lid, tilted back — screen faces away, we see the shell
  rect(b, ox + 12, oy + 42, 23, 14, C.metalMid);
  rect(b, ox + 13, oy + 43, 21, 12, C.metal);
  rect(b, ox + 13, oy + 43, 21, 1, C.metalDark); // top edge in shadow
  rect(b, ox + 13, oy + 44, 21, 3, C.metalLit); // light rakes across the shell
  rect(b, ox + 12, oy + 42, 1, 14, C.metalDark);
  rect(b, ox + 34, oy + 42, 1, 14, C.metalDark);
  // base, wider at the front
  rect(b, ox + 9, oy + 55, 29, 3, C.metal);
  rect(b, ox + 7, oy + 57, 33, 2, C.metalMid);
  rect(b, ox + 7, oy + 58, 33, 1, C.metalDark);
  // it presses into the lap
  rect(b, ox + 9, oy + 59, 29, 1, C.jeansDeep);

  // glow spilling over the top edge — pulses on the beat
  const glow = leftDown ? C.screenGlow : C.screen;
  rect(b, ox + 13, oy + 41, 21, 1, glow);
  put(b, ox + 12, oy + 41, C.screen);
  put(b, ox + 34, oy + 41, C.screen);
  // and bouncing back onto the underside of his jaw
  rect(b, ox + 19, hy + 25, 8, 1, C.skinLit);

  return b;
}
