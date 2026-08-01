import { Site } from "@/components/site/Site";
import { SCENE_LAYERS } from "@/lib/png";

/* Pixel landscape as the hero wallpaper, modern UI over it, portfolio
 * below. The art is prerendered PNG layers; the wind is pure CSS. */
export default function Home() {
  return <Site layers={SCENE_LAYERS} />;
}
