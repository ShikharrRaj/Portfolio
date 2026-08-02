/* Minimal PNG encoder (server-side only).
 *
 * The scene is deterministic, so each layer is painted and encoded once at
 * build time and served as a static PNG from app/scene/[layer]. The art is
 * a plain <img> in the server HTML — it cannot fail to appear because a
 * client effect did not run, and it renders with JavaScript disabled.
 *
 * Node's zlib is the only dependency; no image library needed for a
 * truecolour non-interlaced PNG.
 */

import { deflateSync } from "node:zlib";
import { DOG_FRAMES, DOG_SIT_FRAMES } from "./dog";
import { BODY_FRAMES, HEAD_DIRS, PACK_FRAMES, WAVE_FRAMES } from "./person";
import { BOUGH_FRAMES, GRASS_FRAMES } from "./photoScene";
import { type Buf } from "./pixelScene";

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Buffer) {
  let c = 0xffffffff;
  for (const v of buf) c = CRC_TABLE[(c ^ v) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typed = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typed));
  return Buffer.concat([len, typed, crc]);
}

export function encodePng(b: Buf): Buffer {
  // Each scanline is prefixed with filter type 0 (None).
  const raw = Buffer.alloc(b.h * (b.w * 4 + 1));
  let o = 0;
  for (let y = 0; y < b.h; y++) {
    raw[o++] = 0;
    const start = y * b.w * 4;
    raw.set(b.data.subarray(start, start + b.w * 4), o);
    o += b.w * 4;
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(b.w, 0);
  ihdr.writeUInt32BE(b.h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  // 10,11,12 = compression, filter, interlace — all 0

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/**
 * The figure is four separate sets rather than one.
 *
 * `body` and `head` compose — the body types, the head turns, and they are
 * stacked. That is what keeps three head directions from multiplying the
 * four typing frames into twelve sprites. `pack` and `wave` change the
 * silhouette too much to compose, so those are whole figures.
 */
export type SceneLayers = {
  sky: string;
  clouds: string;
  front: string;
  grass: string[];
  body: string[];
  /** Indexed by HEAD_DIRS: shaded side, level, lit side. */
  head: string[];
  pack: string[];
  wave: string[];
  dog: string[];
  dogSit: string[];
  bough: string[];
};

/** URLs of the prerendered layers. Served by app/scene/[layer]/route.ts. */
export const SCENE_LAYERS: SceneLayers = {
  sky: "/scene/sky.png",
  clouds: "/scene/clouds.png",
  front: "/scene/front.png",
  grass: Array.from({ length: GRASS_FRAMES }, (_, f) => `/scene/grass-${f}.png`),
  body: Array.from({ length: BODY_FRAMES }, (_, f) => `/scene/body-${f}.png`),
  head: HEAD_DIRS.map((d) => `/scene/head-${d}.png`),
  pack: Array.from({ length: PACK_FRAMES }, (_, f) => `/scene/pack-${f}.png`),
  wave: Array.from({ length: WAVE_FRAMES }, (_, f) => `/scene/wave-${f}.png`),
  dog: Array.from({ length: DOG_FRAMES }, (_, f) => `/scene/dog-${f}.png`),
  dogSit: Array.from({ length: DOG_SIT_FRAMES }, (_, f) => `/scene/dogsit-${f}.png`),
  bough: Array.from({ length: BOUGH_FRAMES }, (_, f) => `/scene/bough-${f}.png`),
};
