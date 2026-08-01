/* Sprite renderer.
 *
 * Turns a character grid into SVG rects, merging horizontal runs of the
 * same colour so a tree costs ~30 nodes instead of ~140. Everything lands
 * on integer coordinates and the parent <svg> uses shapeRendering
 * "crispEdges", which is what keeps the art looking drawn rather than
 * resized.
 */

import { PALETTE, type Sprite as SpriteGrid } from "@/data/world";

type Run = { x: number; y: number; w: number; fill: string };

/** Flatten a grid into merged horizontal runs. */
export function runsOf(grid: SpriteGrid, ox = 0, oy = 0, flip = false): Run[] {
  const runs: Run[] = [];

  grid.forEach((rawRow, y) => {
    const row = flip ? [...rawRow].reverse().join("") : rawRow;
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === "." || ch === " ") {
        x += 1;
        continue;
      }
      let len = 1;
      while (x + len < row.length && row[x + len] === ch) len += 1;
      const fill = PALETTE[ch];
      if (fill) runs.push({ x: ox + x, y: oy + y, w: len, fill });
      x += len;
    }
  });

  return runs;
}

export function Sprite({
  grid,
  x = 0,
  y = 0,
  flip = false,
  opacity,
}: {
  grid: SpriteGrid;
  x?: number;
  y?: number;
  flip?: boolean;
  opacity?: number;
}) {
  const runs = runsOf(grid, x, y, flip);
  return (
    <g opacity={opacity}>
      {runs.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </g>
  );
}
