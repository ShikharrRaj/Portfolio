import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://your-domain.com",
      lastModified: new Date("2026-06-25"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
