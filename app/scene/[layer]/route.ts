/* The pixel-art layers, served as real PNG files.
 *
 * Inlining them as data URIs cost double: React Server Components serialise
 * the rendered tree into the flight payload as well as the HTML, so every
 * base64 string shipped twice. As routes they are prerendered to static
 * files at build time, fetched once, and cached immutably by the browser.
 */

import {
  BOUGH_FRAMES,
  GRASS_FRAMES,
  photoBough,
  photoClouds,
  photoFront,
  photoGrass,
  photoSkyWithSun,
} from "@/lib/photoScene";
import { DOG_FRAMES, DOG_SIT_FRAMES, paintDog, paintDogSit } from "@/lib/dog";
import {
  BODY_FRAMES,
  HEAD_DIRS,
  PACK_FRAMES,
  WAVE_FRAMES,
  paintBody,
  paintHead,
  paintPack,
  paintWave,
} from "@/lib/person";
import { type Buf } from "@/lib/pixelScene";
import { encodePng } from "@/lib/png";

export const dynamic = "force-static";

const PAINTERS: Record<string, () => Buf> = {
  sky: photoSkyWithSun,
  clouds: photoClouds,
  front: photoFront,
  ...Object.fromEntries(
    Array.from({ length: GRASS_FRAMES }, (_, f) => [`grass-${f}`, () => photoGrass(f)]),
  ),
  ...Object.fromEntries(
    Array.from({ length: BOUGH_FRAMES }, (_, f) => [`bough-${f}`, () => photoBough(f)]),
  ),
  // The figure: body and head compose, the two other poses are whole.
  ...Object.fromEntries(
    Array.from({ length: BODY_FRAMES }, (_, f) => [`body-${f}`, () => paintBody(f)]),
  ),
  ...Object.fromEntries(HEAD_DIRS.map((d) => [`head-${d}`, () => paintHead(d)])),
  ...Object.fromEntries(
    Array.from({ length: PACK_FRAMES }, (_, f) => [`pack-${f}`, () => paintPack(f)]),
  ),
  ...Object.fromEntries(
    Array.from({ length: WAVE_FRAMES }, (_, f) => [`wave-${f}`, () => paintWave(f)]),
  ),
  ...Object.fromEntries(
    Array.from({ length: DOG_FRAMES }, (_, f) => [`dog-${f}`, () => paintDog(f)]),
  ),
  ...Object.fromEntries(
    Array.from({ length: DOG_SIT_FRAMES }, (_, f) => [`dogsit-${f}`, () => paintDogSit(f)]),
  ),
};

export function generateStaticParams() {
  return Object.keys(PAINTERS).map((layer) => ({ layer: `${layer}.png` }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ layer: string }> }) {
  const { layer } = await ctx.params;
  const paint = PAINTERS[layer.replace(/\.png$/, "")];
  if (!paint) return new Response("Not found", { status: 404 });

  const png = encodePng(paint());
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
