import type { Metadata, Viewport } from "next";
import {
  Inter,
  JetBrains_Mono,
  Newsreader,
  Press_Start_2P,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { profile } from "@/data/portfolio";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Storytelling voice — used only where the OS stops reporting and starts
// speaking (boot prompt, decision narration, the closing statement).
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
  // Newsreader ships no override metrics in this Next version; supplying the
  // fallback explicitly keeps the build quiet and the swap stable.
  adjustFontFallback: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// The world's voice. One weight, 8px native — never scale it off a
// multiple of its own grid or the letterforms go soft.
const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

const siteUrl = "https://your-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.roles[0]}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.tagline,
  keywords: [
    profile.name,
    "Software Engineer",
    "Tech Lead",
    "Full-Stack Developer",
    "Portfolio",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${profile.name} — ${profile.roles[0]}`,
    description: profile.tagline,
    siteName: `${profile.name} · Portfolio`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: profile.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.roles[0]}`,
    description: profile.tagline,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#7FD3F7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured data for rich search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.roles[0],
    email: profile.email,
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    url: siteUrl,
    sameAs: profile.socials.map((s) => s.href),
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ${newsreader.variable} ${pressStart.variable}`}
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
