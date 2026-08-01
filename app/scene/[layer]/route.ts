/* The pixel-art layers, served as real PNG files.
 *
 * Inlining them as data URIs cost double: React Server Components serialise
 * the rendered tree into the flight payload as well as the HTML, so every
 * base64 string shipped twice. As routes they are prerendered to static
 * files at build time, fetched once, and cached immutably by the browser.
 */

import {
  GRASS_FRAMES,
  paintCanopy,
  paintClouds,
  paintGrass,
  paintLand,
  paintProps,
  paintSky,
  type Buf,
} from "@/lib/pixelScene";
import { encodePng } from "@/lib/png";

export const dynamic = "force-static";

const PAINTERS: Record<string, () => Buf> = {
  sky: paintSky,
  clouds: paintClouds,
  land: paintLand,
  props: paintProps,
  "canopy-l": () => paintCanopy("left"),
  "canopy-r": () => paintCanopy("right"),
  ...Object.fromEntries(
    Array.from({ length: GRASS_FRAMES }, (_, f) => [`grass-${f}`, () => paintGrass(f)]),
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
