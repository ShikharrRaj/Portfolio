"use client";

import { motion } from "framer-motion";
import { profile, navLinks } from "@/data/portfolio";
import { scrollToSection } from "@/components/providers/SmoothScrollProvider";
import { Reveal } from "@/components/ui/Reveal";

export function Footer() {
  const year = 2026; // keep deterministic for SSR; update yearly or read from data

  return (
    <footer className="relative overflow-hidden border-t border-line/10 py-16">
      <div className="container-page">
        {/* inspirational quote */}
        <Reveal>
          <p className="mx-auto max-w-3xl text-center font-display text-2xl font-medium leading-snug text-gradient md:text-3xl">
            &ldquo;Simplicity is the ultimate sophistication. Build things that
            feel inevitable.&rdquo;
          </p>
        </Reveal>

        {/* back to top */}
        <div className="mt-12 flex justify-center">
          <motion.button
            onClick={() => scrollToSection("#top")}
            whileHover={{ y: -4 }}
            data-cursor="Top"
            className="group flex flex-col items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full glass transition-shadow group-hover:shadow-glow">
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                ↑
              </motion.span>
            </span>
            Back to top
          </motion.button>
        </div>

        <div className="mt-12 hairline" />

        <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-muted">
            © {year} {profile.name}. Crafted with care.
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-sm text-muted transition-colors hover:text-accent-soft"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* oversized watermark name */}
      <div
        aria-hidden
        className="pointer-events-none mt-10 select-none text-center font-display text-[18vw] font-bold leading-none text-line/[0.03]"
      >
        {profile.firstName}
      </div>
    </footer>
  );
}
