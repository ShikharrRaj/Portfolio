/* Minimal PNG encoder (server-side only).
 *
 * The scene is deterministic, so it is painted and encoded once at build
 * time and inlined as a data URI. That makes the art a real <img> in the
 * server HTML — it cannot fail to appear because a client effect did not
 * run, and it renders with JavaScript disabled.
 *
 * Node's zlib is the only dependency; no image library needed for a
 * truecolour non-interlaced PNG.
 */

import { deflateSync } from "node:zlib";
import { paintScene, type Buf } from "./pixelScene";

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

let cached: string | null = null;

/** The scene as a `data:` URI. Painted and encoded once. */
export function sceneDataUri(): string {
  if (!cached) cached = `data:image/png;base64,${encodePng(paintScene()).toString("base64")}`;
  return cached;
}
