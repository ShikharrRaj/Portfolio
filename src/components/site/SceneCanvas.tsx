"use client";

/* Paints the pixel landscape once into a 384x216 canvas and lets CSS scale
 * it up. `image-rendering: pixelated` keeps every pixel square — without it
 * the browser smooths the upscale and the art turns to mush.
 *
 * The scene is deterministic, so this runs exactly once. No animation loop,
 * no resize redraw: scaling is the browser's job, not ours.
 */

import { useEffect, useRef } from "react";
import { H, W, paintScene } from "@/lib/pixelScene";

export function SceneCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const buf = paintScene();
    // Built via createImageData rather than `new ImageData(buf.data, ...)` so
    // the backing buffer type always matches what the 2D context expects.
    const img = ctx.createImageData(buf.w, buf.h);
    img.data.set(buf.data);
    ctx.putImageData(img, 0, 0);
  }, []);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      aria-hidden
      className={className}
      style={{
        imageRendering: "pixelated",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
}
