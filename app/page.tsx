import { Site } from "@/components/site/Site";
import { sceneDataUri } from "@/lib/png";

/* The landscape is painted and encoded on the server, so it ships inside
 * the HTML as an <img>. Pixel wallpaper, modern UI, portfolio below. */
export default function Home() {
  return <Site sceneSrc={sceneDataUri()} />;
}
