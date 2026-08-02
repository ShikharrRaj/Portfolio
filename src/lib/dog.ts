/* =====================================================================
 *  THE DOG
 *  ---------------------------------------------------------------------
 *  It walks in from the left, stops beside him to be scratched behind the
 *  ear, then carries on out the right of frame.
 *
 *  Two sets, because the pause is the point:
 *    WALK  four frames of a trot, legs crossing, body bobbing
 *    SIT   two frames on its haunches, tail going, looking up at him
 *
 *  It faces right the whole time. That is not a detail — it walks in from
 *  the left and stops on his left, so facing right is both the direction
 *  of travel and the direction of the person it has come to see. A dog
 *  that arrived facing away would read as leaving.
 *
 *  Painted at the left of its run. CSS carries the layer across, and
 *  SceneStage hands the CSS the exact pixel offsets — see the custom
 *  properties in SceneStage, which redo the object-cover maths so the dog
 *  stops beside him at every viewport rather than only on a wide one.
 * ===================================================================== */

import { makeBuf, type Buf, type RGB } from "./pixelScene";

const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

const C = {
  coatLit: hex("#DCAC6B"),
  coat: hex("#C08C50"),
  coatDark: hex("#8F6636"),
  coatDeep: hex("#6A4926"),
  muzzle: hex("#EBD6B2"),
  nose: hex("#241A14"),
  eye: hex("#1B1310"),
  tongue: hex("#D9615E"),
  collar: hex("#C0392B"),
  tag: hex("#E8C158"),
  shade: hex("#37601F"),
} as const;

function put(b: Buf, x: number, y: number, c: RGB) {
  if (x < 0 || y < 0 || x >= b.w || y >= b.h) return;
  const i = (y * b.w + x) * 4;
  b.data[i] = c[0];
  b.data[i + 1] = c[1];
  b.data[i + 2] = c[2];
  b.data[i + 3] = 255;
}

function rect(b: Buf, x: number, y: number, w: number, h: number, c: RGB) {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(b, x + i, y + j, c);
}

/** Where its run starts. Feet land on the same ground line as the figure. */
export const DOG_AT = { x: 24, y: 192 };

export const DOG_FRAMES = 4;
export const DOG_SIT_FRAMES = 2;

/** Dashed smudge under it, the same stipple the figure sits in. */
function shadow(b: Buf, ox: number, oy: number, w: number) {
  for (let i = 0; i < w; i++) if (i % 2 === 0) put(b, ox + i, oy + 12, C.shade);
}

/** The head, facing right. Shared by both sets so the dog does not change
 *  breed when it sits down. */
function head(b: Buf, hx: number, hy: number, panting: boolean) {
  rect(b, hx, hy + 1, 5, 5, C.coat); // skull
  rect(b, hx, hy + 1, 5, 1, C.coatLit);
  rect(b, hx, hy + 5, 5, 1, C.coatDark);
  rect(b, hx + 4, hy + 3, 3, 3, C.muzzle); // muzzle
  rect(b, hx + 4, hy + 5, 3, 1, C.coatDark);
  put(b, hx + 6, hy + 3, C.nose);
  put(b, hx + 3, hy + 2, C.eye);
  // one ear, folded forward and darker than the coat
  rect(b, hx, hy - 1, 2, 4, C.coatDark);
  put(b, hx, hy + 2, C.coatDeep);
  if (panting) put(b, hx + 5, hy + 6, C.tongue);
  // collar, with the tag hanging off it
  rect(b, hx - 1, hy + 4, 1, 3, C.collar);
  put(b, hx - 1, hy + 7, C.tag);
}

/**
 * One beat of the trot. The legs cross, and the body bobs a pixel on the
 * off-beats — without the bob a four-frame walk reads as a cardboard
 * cut-out being slid along.
 */
export function paintDog(frame: number): Buf {
  const b = makeBuf();
  const ox = DOG_AT.x;
  const oy = DOG_AT.y;

  const bob = frame % 2 === 1 ? 1 : 0;
  // Fore and hind legs swing in opposition, as they do on a real trot.
  const fore = [0, 1, 2, 1][frame];
  const hind = [2, 1, 0, 1][frame];
  const wag = frame % 2 === 0 ? 0 : 1;

  shadow(b, ox + 2, oy, 13);

  // tail, up and curled over the back
  rect(b, ox, oy + 2 + wag, 2, 1, C.coatDark);
  rect(b, ox + 1, oy + 3 + wag, 2, 2, C.coat);

  // body
  rect(b, ox + 2, oy + 4 + bob, 10, 5, C.coat);
  rect(b, ox + 2, oy + 4 + bob, 10, 1, C.coatLit); // sun along its back
  rect(b, ox + 2, oy + 8 + bob, 10, 1, C.coatDark); // belly in shade
  rect(b, ox + 10, oy + 3 + bob, 3, 5, C.coat); // shoulders, a little higher

  head(b, ox + 12, oy + bob, false);

  // legs — hind pair behind the body, fore pair in front of it
  rect(b, ox + 3 + hind, oy + 8 + bob, 2, 4 - bob, C.coatDark);
  rect(b, ox + 6 - hind, oy + 8 + bob, 2, 4 - bob, C.coatDeep);
  rect(b, ox + 9 + fore, oy + 8 + bob, 2, 4 - bob, C.coat);
  rect(b, ox + 12 - fore, oy + 8 + bob, 2, 4 - bob, C.coatDark);

  return b;
}

/**
 * Sitting, looking up. Two frames, and the only thing that moves is the
 * tail — a dog being scratched holds very still apart from that.
 */
export function paintDogSit(frame: number): Buf {
  const b = makeBuf();
  const ox = DOG_AT.x;
  const oy = DOG_AT.y;
  const wag = frame === 0 ? 0 : 2;

  shadow(b, ox + 3, oy, 11);

  // tail, sweeping the grass behind it
  rect(b, ox, oy + 9 - wag, 3, 1, C.coatDark);
  put(b, ox + 2, oy + 10 - wag, C.coat);

  // haunches, then the chest rising off them
  rect(b, ox + 2, oy + 7, 6, 5, C.coatDark);
  rect(b, ox + 3, oy + 8, 4, 3, C.coat);
  rect(b, ox + 6, oy + 3, 6, 9, C.coat);
  rect(b, ox + 6, oy + 3, 6, 1, C.coatLit);
  rect(b, ox + 6, oy + 11, 6, 1, C.coatDeep);

  // front legs, straight down under the chest
  rect(b, ox + 8, oy + 8, 2, 4, C.coatLit);
  rect(b, ox + 11, oy + 8, 2, 4, C.coat);
  put(b, ox + 8, oy + 11, C.coatDark); // paws
  put(b, ox + 11, oy + 11, C.coatDark);

  // head up, and panting, because it is being scratched
  head(b, ox + 11, oy - 1, true);

  return b;
}
