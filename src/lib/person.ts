/* =====================================================================
 *  THE FIGURE — Shikhar, sitting on the lawn, typing
 *  ---------------------------------------------------------------------
 *  Drawn rather than traced. The reference photograph is a standing shot
 *  under a warm restaurant lamp, so pixelating it directly would give a
 *  standing man in orange light against a park at midday. What carries
 *  over instead are the features that actually identify him — the tall
 *  volume of dark hair, the black sunglasses, the white oversized tee,
 *  the black crossbody sling — with the palette sampled from the photo
 *  and corrected from tungsten back toward daylight.
 *
 *  Drawn at the scene's own pixel grid, never scaled up. Doubling a small
 *  sprite would give him fatter pixels than everything around him, which
 *  is the fastest way to make composited pixel art look pasted on.
 *
 *  Four frames of typing: hands alternate, the head nods on the beat, and
 *  the screen glow pulses with it.
 * ===================================================================== */

import { makeBuf, type Buf, type RGB } from "./pixelScene";

const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

/* Sampled from public/my.jpeg, then white-balanced out of the lamp light. */
const C = {
  hairDark: hex("#0D0908"),
  hair: hex("#1C1310"),
  hairLit: hex("#38271F"),
  skinShade: hex("#A3663E"),
  skin: hex("#D08C60"),
  skinLit: hex("#EDB78A"),
  beard: hex("#432B20"),
  glass: hex("#0B0909"),
  glassLit: hex("#33302F"),
  teeShade: hex("#CBC3B7"),
  tee: hex("#EBE6DD"),
  teeLit: hex("#FBF8F2"),
  slingDark: hex("#161110"),
  sling: hex("#2B2320"),
  jeans: hex("#38455670"),
  jeansLit: hex("#4C5D72"),
  metal: hex("#BFC6CF"),
  metalMid: hex("#8F97A2"),
  metalDark: hex("#666E79"),
  screen: hex("#BFE6F7"),
  screenGlow: hex("#EAF8FF"),
  shadow: hex("#3D6B27"),
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
export const PERSON_AT = { x: 212, y: 146 };

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

  /* ---- contact shadow, dithered so it sits in the grass --------------- */
  for (let i = 0; i < 42; i++) {
    for (let j = 0; j < 3; j++) {
      if ((i + j) % 2 === 0) continue;
      px(b, ox + 1 + i, oy + 56 + j, C.shadow);
    }
  }

  /* ---- crossed legs --------------------------------------------------- */
  rect(b, ox + 4, oy + 50, 36, 6, C.jeans);
  rect(b, ox + 4, oy + 50, 36, 2, C.jeansLit);
  rect(b, ox + 2, oy + 52, 3, 4, C.jeans); // knee left
  rect(b, ox + 39, oy + 52, 3, 4, C.jeans); // knee right
  rect(b, ox + 12, oy + 55, 20, 2, C.jeansLit); // shin folded in front

  /* ---- torso: oversized white tee -------------------------------------- */
  rect(b, ox + 6, oy + 22, 32, 29, C.tee);
  rect(b, ox + 6, oy + 22, 32, 3, C.teeLit); // light off the shoulders
  rect(b, ox + 5, oy + 25, 1, 24, C.teeShade);
  rect(b, ox + 38, oy + 25, 1, 24, C.teeShade);
  rect(b, ox + 7, oy + 47, 30, 4, C.teeShade); // hem falls into shadow
  // collar
  rect(b, ox + 17, oy + 22, 10, 2, C.teeShade);

  /* ---- crossbody sling -------------------------------------------------- */
  for (let s = 0; s < 20; s++) {
    const sx = ox + 14 + Math.round(s * 0.5);
    px(b, sx, oy + 23 + s, C.sling);
    px(b, sx + 1, oy + 23 + s, C.slingDark);
    px(b, sx + 2, oy + 23 + s, C.sling);
  }
  rect(b, ox + 21, oy + 41, 13, 7, C.sling); // the pouch
  rect(b, ox + 21, oy + 41, 13, 2, C.slingDark);
  rect(b, ox + 23, oy + 44, 9, 1, C.slingDark); // zip line

  /* ---- arms ------------------------------------------------------------- */
  rect(b, ox + 2, oy + 25, 5, 12, C.tee); // left sleeve
  rect(b, ox + 37, oy + 25, 5, 12, C.tee); // right sleeve
  rect(b, ox + 2, oy + 25, 5, 2, C.teeLit);
  rect(b, ox + 37, oy + 25, 5, 2, C.teeLit);

  // Forearms angle in toward the keyboard; one sits a pixel lower per beat.
  const lY = oy + 37 + (leftDown ? 1 : 0);
  const rY = oy + 37 + (leftDown ? 0 : 1);
  rect(b, ox + 3, lY, 4, 6, C.skin);
  rect(b, ox + 37, rY, 4, 6, C.skin);
  rect(b, ox + 3, lY, 4, 1, C.skinLit);
  rect(b, ox + 37, rY, 4, 1, C.skinLit);
  rect(b, ox + 6, lY + 4, 4, 3, C.skinShade); // wrist turning in
  rect(b, ox + 34, rY + 4, 4, 3, C.skinShade);
  // hands on the keys
  rect(b, ox + 9, lY + 5, 5, 3, C.skinLit);
  rect(b, ox + 30, rY + 5, 5, 3, C.skinLit);

  /* ---- head -------------------------------------------------------------- */
  const hy = oy + nod;
  rect(b, ox + 18, oy + 18 + nod, 8, 5, C.skinShade); // neck

  rect(b, ox + 13, hy + 4, 18, 16, C.skin); // face
  rect(b, ox + 13, hy + 4, 18, 3, C.skinLit);
  rect(b, ox + 30, hy + 6, 1, 12, C.skinShade); // far cheek turns away
  rect(b, ox + 12, hy + 7, 1, 8, C.skinShade); // near cheek edge

  // stubble along the jaw
  rect(b, ox + 14, hy + 15, 16, 4, C.beard);
  rect(b, ox + 16, hy + 19, 12, 1, C.beard);
  rect(b, ox + 19, hy + 14, 6, 1, C.beard); // moustache

  // sunglasses — the single most recognisable thing in the photo
  rect(b, ox + 12, hy + 9, 20, 4, C.glass);
  rect(b, ox + 14, hy + 10, 5, 1, C.glassLit); // glint, left lens
  rect(b, ox + 25, hy + 10, 5, 1, C.glassLit); // glint, right lens
  rect(b, ox + 21, hy + 10, 2, 1, C.glass); // bridge
  px(b, ox + 11, hy + 10, C.glass); // temple arm
  px(b, ox + 32, hy + 10, C.glass);

  // hair: tall, thick, falling forward over the brow
  rect(b, ox + 11, hy - 2, 22, 8, C.hair);
  rect(b, ox + 13, hy - 4, 18, 2, C.hair);
  rect(b, ox + 15, hy - 5, 13, 1, C.hairLit);
  rect(b, ox + 14, hy - 3, 15, 2, C.hairLit); // sheen across the top
  rect(b, ox + 10, hy + 2, 2, 10, C.hairDark); // sideburns
  rect(b, ox + 32, hy + 2, 2, 10, C.hairDark);
  // messy fringe breaking the hairline
  for (const fx of [13, 16, 20, 24, 28, 31]) {
    px(b, ox + fx, hy + 6, C.hairDark);
    if (fx % 2 === 0) px(b, ox + fx, hy + 7, C.hairDark);
  }

  /* ---- laptop ------------------------------------------------------------ */
  // lid, tilted back — screen faces away, we see its shell and the spill
  rect(b, ox + 11, oy + 38, 22, 13, C.metalMid);
  rect(b, ox + 12, oy + 39, 20, 11, C.metal);
  rect(b, ox + 12, oy + 39, 20, 1, C.metalDark); // hinge shadow at the top
  // Apple-less: a plain lit bevel down the near edge
  rect(b, ox + 11, oy + 38, 1, 13, C.metalDark);
  rect(b, ox + 32, oy + 38, 1, 13, C.metalDark);
  // base in perspective, wider at the front
  rect(b, ox + 8, oy + 50, 28, 3, C.metal);
  rect(b, ox + 6, oy + 52, 32, 2, C.metalMid);
  rect(b, ox + 6, oy + 53, 32, 1, C.metalDark);

  // the glow spilling over the top edge of the screen — pulses on the beat
  const glow = leftDown ? C.screenGlow : C.screen;
  rect(b, ox + 12, oy + 37, 20, 1, glow);
  px(b, ox + 11, oy + 37, C.screen);
  px(b, ox + 32, oy + 37, C.screen);
  // and a faint bounce onto the underside of his jaw
  rect(b, ox + 18, hy + 20, 8, 1, C.skinLit);

  return b;
}
