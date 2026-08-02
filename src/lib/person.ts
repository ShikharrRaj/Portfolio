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

/* Sampled from public/my.jpeg, then white-balanced out of the lamp light. */
const C = {
  hairDeep: hex("#080605"),
  hairDark: hex("#130D0B"),
  hair: hex("#241914"),
  hairLit: hex("#3E2C22"),

  skinDeep: hex("#7E4A2C"),
  skinShade: hex("#A8663C"),
  skin: hex("#D18E61"),
  skinLit: hex("#EFBA8D"),

  beard: hex("#3E2619"),
  beardLit: hex("#5A3B27"),

  glass: hex("#0A0808"),
  glassLit: hex("#3A3634"),

  teeDeep: hex("#A79E92"),
  teeShade: hex("#CAC2B6"),
  tee: hex("#EAE5DC"),
  teeLit: hex("#FCFAF5"),

  slingDeep: hex("#0E0B0A"),
  slingDark: hex("#191413"),
  sling: hex("#2E2622"),

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

function px(b: Buf, x: number, y: number, c: RGB) {
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
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(b, x + i, y + j, c);
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
      px(b, ox + 1 + i, oy + 61 + j, C.shadow);
    }
  }

  /* ---- crossed legs ---------------------------------------------------- */
  rect(b, ox + 4, oy + 54, 38, 7, C.jeans);
  rect(b, ox + 4, oy + 54, 38, 2, C.jeansLit);
  rect(b, ox + 4, oy + 60, 38, 1, C.jeansDeep);
  rect(b, ox + 2, oy + 56, 3, 5, C.jeansDeep); // knees turning away
  rect(b, ox + 41, oy + 56, 3, 5, C.jeansDeep);
  rect(b, ox + 13, oy + 59, 20, 2, C.jeansLit); // near shin folded across

  /* ---- torso: oversized white tee --------------------------------------- */
  rect(b, ox + 6, oy + 26, 34, 30, C.tee);
  // shoulders slope — the near one sits a pixel lower
  rect(b, ox + 6, oy + 26, 16, 2, C.teeLit);
  rect(b, ox + 22, oy + 27, 18, 2, C.teeLit);
  rect(b, ox + 5, oy + 29, 1, 25, C.teeShade); // turning edges
  rect(b, ox + 40, oy + 29, 1, 25, C.teeShade);
  rect(b, ox + 6, oy + 50, 34, 4, C.teeShade); // hem in shadow
  rect(b, ox + 7, oy + 53, 32, 1, C.teeDeep);
  // occlusion where the sleeves meet the body
  rect(b, ox + 7, oy + 31, 2, 13, C.teeDeep);
  rect(b, ox + 38, oy + 31, 2, 13, C.teeDeep);
  // a couple of fabric folds, so the tee reads as cloth not card
  rect(b, ox + 14, oy + 40, 1, 9, C.teeShade);
  rect(b, ox + 29, oy + 43, 1, 7, C.teeShade);
  rect(b, ox + 18, oy + 28, 10, 2, C.teeShade); // collar

  /* ---- crossbody sling --------------------------------------------------- */
  for (let s = 0; s < 21; s++) {
    const sx = ox + 15 + Math.round(s * 0.52);
    px(b, sx, oy + 27 + s, C.slingDark);
    px(b, sx + 1, oy + 27 + s, C.sling);
    px(b, sx + 2, oy + 27 + s, C.slingDeep);
  }
  rect(b, ox + 22, oy + 45, 14, 8, C.sling); // pouch
  rect(b, ox + 22, oy + 45, 14, 2, C.slingDark);
  rect(b, ox + 22, oy + 52, 14, 1, C.slingDeep);
  rect(b, ox + 24, oy + 48, 10, 1, C.slingDeep); // zip
  px(b, ox + 34, oy + 48, C.steelDark); // zip pull

  /* ---- arms --------------------------------------------------------------- */
  rect(b, ox + 2, oy + 29, 5, 14, C.tee); // sleeves
  rect(b, ox + 39, oy + 30, 5, 14, C.tee);
  rect(b, ox + 2, oy + 29, 5, 2, C.teeLit);
  rect(b, ox + 39, oy + 30, 5, 2, C.teeLit);
  rect(b, ox + 2, oy + 41, 5, 2, C.teeShade); // cuff shadow
  rect(b, ox + 39, oy + 42, 5, 2, C.teeShade);

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
  rect(b, ox + 40, rY + 4, 4, 2, C.steel);
  rect(b, ox + 40, rY + 5, 4, 1, C.steelDark);

  // wrists turning in toward the keys
  rect(b, ox + 6, lY + 5, 5, 3, C.skinShade);
  rect(b, ox + 36, rY + 5, 5, 3, C.skinShade);
  // hands — three visible knuckles each
  rect(b, ox + 10, lY + 6, 6, 3, C.skin);
  rect(b, ox + 10, lY + 6, 6, 1, C.skinLit);
  rect(b, ox + 31, rY + 6, 6, 3, C.skin);
  rect(b, ox + 31, rY + 6, 6, 1, C.skinLit);
  for (const k of [0, 2, 4]) {
    px(b, ox + 11 + k, lY + 8, C.skinShade);
    px(b, ox + 32 + k, rY + 8, C.skinShade);
  }

  /* ---- head ---------------------------------------------------------------- */
  /* At this size the face is 18px wide. Detail fights legibility here, so
   * the rule is few clean shapes: one hair mass, one glasses band, one
   * stubble field, one mouth. An earlier pass hatched the stubble with a
   * hash and drew a stepped fringe; both read as scribble at 1:1. */
  const hy = oy + nod;

  // neck, shaded by the jaw above it
  rect(b, ox + 18, oy + 24 + nod, 10, 4, C.skinShade);
  rect(b, ox + 18, oy + 24 + nod, 10, 1, C.skinDeep);

  // face
  rect(b, ox + 14, hy + 6, 18, 20, C.skin);
  rect(b, ox + 31, hy + 9, 1, 15, C.skinShade); // far cheek turns away
  rect(b, ox + 13, hy + 10, 1, 12, C.skinShade); // near cheek edge
  rect(b, ox + 15, hy + 24, 16, 2, C.skinShade); // under-jaw
  rect(b, ox + 17, hy + 25, 12, 1, C.skinDeep);

  // sunglasses — one clean band, sitting a third of the way down the face
  rect(b, ox + 13, hy + 11, 20, 3, C.glass);
  rect(b, ox + 15, hy + 12, 4, 1, C.glassLit); // glints
  rect(b, ox + 26, hy + 12, 4, 1, C.glassLit);
  px(b, ox + 12, hy + 12, C.glass); // temple arms
  px(b, ox + 33, hy + 12, C.glass);
  rect(b, ox + 15, hy + 10, 16, 1, C.skinShade); // brow shadow above the frame

  // nose, then mouth
  rect(b, ox + 22, hy + 16, 2, 2, C.skinShade);
  px(b, ox + 24, hy + 17, C.skinLit);
  rect(b, ox + 20, hy + 21, 6, 1, C.beard);

  /* Stubble: a plain checkerboard so skin shows through evenly. A modulo
   * hash looked like diagonal hatching; a solid fill looked like a mask. */
  for (let y = hy + 18; y <= hy + 24; y++) {
    for (let x = ox + 15; x <= ox + 30; x++) {
      if ((x + y) % 2 === 1) continue;
      if (y < hy + 20 && (x < ox + 17 || x > ox + 28)) continue; // thin at the cheeks
      if (y === hy + 21 && x > ox + 19 && x < ox + 26) continue; // keep the mouth
      px(b, x, y, C.beard);
    }
  }
  rect(b, ox + 18, hy + 23, 10, 1, C.beard); // firmer along the jaw

  // hair — one tall swept mass, highlight along the sweep, no stepped fringe
  rect(b, ox + 11, hy, 24, 9, C.hair);
  rect(b, ox + 13, hy - 3, 20, 3, C.hair);
  rect(b, ox + 16, hy - 4, 14, 1, C.hair);
  rect(b, ox + 15, hy - 3, 15, 2, C.hairLit); // sheen
  rect(b, ox + 18, hy - 4, 9, 1, C.hairLit);
  rect(b, ox + 10, hy + 3, 3, 9, C.hairDark); // sideburns
  rect(b, ox + 33, hy + 3, 3, 9, C.hairDark);
  rect(b, ox + 11, hy + 6, 2, 3, C.hairDeep); // deepest at the temples
  rect(b, ox + 34, hy + 6, 2, 3, C.hairDeep);
  // the hairline dips slightly to one side rather than sitting level
  rect(b, ox + 12, hy + 9, 8, 1, C.hairDark);
  rect(b, ox + 26, hy + 9, 8, 1, C.hairDark);

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
  px(b, ox + 12, oy + 41, C.screen);
  px(b, ox + 34, oy + 41, C.screen);
  // and bouncing back onto the underside of his jaw
  rect(b, ox + 19, hy + 25, 8, 1, C.skinLit);

  return b;
}
