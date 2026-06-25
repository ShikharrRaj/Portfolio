"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { navLinks, profile } from "@/data/portfolio";
import { scrollToSection } from "@/components/providers/SmoothScrollProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const { theme, toggle } = useTheme();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  // lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    scrollToSection(href);
  };

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          className={cn(
            "flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500",
            scrolled ? "glass-strong shadow-lg" : "border border-transparent",
          )}
        >
          <button
            onClick={() => scrollToSection("#top")}
            data-cursor="Home"
            className="flex items-center gap-2.5 pl-2"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-accent to-ember text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="font-display text-sm font-semibold tracking-tight">
              {profile.name}
            </span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className="relative rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
              data-cursor="Search"
              aria-label="Open command palette"
              className="hidden items-center gap-2 rounded-full border border-line/10 bg-line/[0.03] px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink sm:flex"
            >
              <span>Search</span>
              <kbd className="rounded border border-line/15 px-1 py-0.5 font-sans text-[10px]">
                ⌘K
              </kbd>
            </button>
            <button
              onClick={toggle}
              data-cursor="Theme"
              aria-label="Toggle theme"
              className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-line/[0.06] hover:text-ink"
            >
              {theme === "dark" ? "☾" : "☀"}
            </button>
            <button
              onClick={() => go("#contact")}
              className="hidden rounded-full bg-accent px-5 py-2 text-sm font-medium text-white shadow-glow transition-shadow hover:shadow-glow-lg md:block"
            >
              Let's talk
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              className="grid h-9 w-9 place-items-center rounded-full text-ink md:hidden"
            >
              <div className="flex flex-col gap-1.5">
                <motion.span
                  animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-5 bg-ink"
                />
                <motion.span
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  className="block h-0.5 w-5 bg-ink"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-5 bg-ink"
                />
              </div>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-bg/95 backdrop-blur-xl md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                onClick={() => go(link.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="font-display text-3xl font-semibold text-ink"
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
