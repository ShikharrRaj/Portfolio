/* Minimal PNG decoder (build-time only).
 *
 * Enough to read what `sips` produces from a JPEG: 8-bit, non-interlaced,
 * colour type 2 (RGB) or 6 (RGBA). Undoes the five per-scanline filters
 * defined by the spec; zlib does the rest.
 *
 * This exists so the reference photograph can be converted to pixel art at
 * build time without pulling in an image library.
 */

import { inflateSync } from "node:zlib";

export type Decoded = { data: Uint8ClampedArray; w: number; h: number };

export function decodePng(png: Buffer): Decoded {
  if (png.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");

  let pos = 8;
  let w = 0;
  let h = 0;
  let channels = 0;
  const idat: Buffer[] = [];

  while (pos < png.length) {
    const len = png.readUInt32BE(pos);
    const type = png.toString("ascii", pos + 4, pos + 8);
    const body = png.subarray(pos + 8, pos + 8 + len);

    if (type === "IHDR") {
      w = body.readUInt32BE(0);
      h = body.readUInt32BE(4);
      const depth = body[8];
      const colour = body[9];
      const interlace = body[12];
      if (depth !== 8) throw new Error(`unsupported bit depth ${depth}`);
      if (interlace !== 0) throw new Error("interlaced PNG unsupported");
      if (colour === 2) channels = 3;
      else if (colour === 6) channels = 4;
      else throw new Error(`unsupported colour type ${colour}`);
    } else if (type === "IDAT") {
      idat.push(body);
    } else if (type === "IEND") {
      break;
    }
    pos += 12 + len;
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = w * channels;
  const out = new Uint8ClampedArray(w * h * 4);
  const line = Buffer.alloc(stride);
  const prev = Buffer.alloc(stride);

  let p = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[p++];
    raw.copy(line, 0, p, p + stride);
    p += stride;

    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? line[i - channels] : 0; // left
      const b = prev[i]; // above
      const c = i >= channels ? prev[i - channels] : 0; // upper-left
      switch (filter) {
        case 0:
          break;
        case 1:
          line[i] = (line[i] + a) & 0xff;
          break;
        case 2:
          line[i] = (line[i] + b) & 0xff;
          break;
        case 3:
          line[i] = (line[i] + ((a + b) >> 1)) & 0xff;
          break;
        case 4: {
          // Paeth predictor
          const pp = a + b - c;
          const pa = Math.abs(pp - a);
          const pb = Math.abs(pp - b);
          const pc = Math.abs(pp - c);
          const pred = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          line[i] = (line[i] + pred) & 0xff;
          break;
        }
        default:
          throw new Error(`bad filter ${filter}`);
      }
    }

    for (let x = 0; x < w; x++) {
      const s = x * channels;
      const d = (y * w + x) * 4;
      out[d] = line[s];
      out[d + 1] = line[s + 1];
      out[d + 2] = line[s + 2];
      out[d + 3] = channels === 4 ? line[s + 3] : 255;
    }
    line.copy(prev);
  }

  return { data: out, w, h };
}
