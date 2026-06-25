# Premium Personal Portfolio

A world-class, cinematic portfolio built to feel like a high-end digital
product — inspired by Apple, Stripe, Vercel, Linear and modern AI startups.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (custom design-token system, dark default + light theme)
- **Framer Motion** — micro-interactions, reveals, stagger, carousels
- **GSAP + ScrollTrigger** — synchronized with **Lenis** smooth scrolling
- **React Three Fiber / Three.js** — interactive 3D hero crystal
- Custom cursor, magnetic buttons, animated particle field, gradient blobs
- Fully responsive, SEO-optimized, accessible, reduced-motion aware

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Customizing content

**All content lives in one file:** [`src/data/portfolio.ts`](src/data/portfolio.ts).
Edit your profile, stats, experience, projects, skills, testimonials and
achievements there — no component changes required.

Add these assets to `/public`:

| File          | Purpose                          |
| ------------- | -------------------------------- |
| `avatar.jpg`  | Hero profile photo (square)      |
| `resume.pdf`  | Linked by the "Download Resume" CTA |
| `og.png`      | 1200×630 social share image      |
| `icon.png`    | 512×512 PWA / favicon            |

Also update the domain in [`app/layout.tsx`](app/layout.tsx),
[`app/robots.ts`](app/robots.ts) and [`app/sitemap.ts`](app/sitemap.ts).

## Structure

```
app/                     # Next App Router (layout, page, SEO routes)
src/
  components/
    layout/              # Navbar, PageShell
    providers/           # Lenis smooth scroll, theme
    sections/            # Hero, About, Experience, Projects, …
    three/               # React Three Fiber hero scene
    ui/                  # Reusable primitives (cursor, buttons, reveals…)
  data/portfolio.ts      # ← single source of truth for all content
  hooks/                 # typewriter, reduced-motion
  lib/utils.ts
```

## Design system

Colors, gradients, shadows and animations are defined as CSS variables in
[`app/globals.css`](app/globals.css) and surfaced through Tailwind tokens in
[`tailwind.config.ts`](tailwind.config.ts). Toggle dark/light via the navbar.

## Performance & accessibility

- WebGL scene and particles are lazy-loaded and pause when offscreen.
- `prefers-reduced-motion` disables smooth scroll, particles and heavy motion.
- Semantic HTML, keyboard-navigable controls, and ARIA labels throughout.
