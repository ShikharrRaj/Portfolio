"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { profile, dashboardMetrics, dashboardStatus } from "@/data/portfolio";
import { useTypewriter } from "@/hooks/useTypewriter";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GradientBlobs } from "@/components/ui/GradientBlobs";
import { Avatar } from "@/components/ui/Avatar";
import { Spotlight } from "@/components/ui/spotlight";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { scrollToSection } from "@/components/providers/SmoothScrollProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

// Lazy-load the WebGL scene so three.js stays out of the initial bundle.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-full bg-accent/10 blur-2xl" />
  ),
});

// Defer the tsParticles engine out of the initial bundle too.
const TsParticles = dynamic(
  () => import("@/components/ui/TsParticles").then((m) => m.TsParticles),
  { ssr: false },
);

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const typed = useTypewriter(profile.roles);
  const { theme } = useTheme();
  const reduced = usePrefersReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const sceneInView = useInView(sceneRef, { margin: "120px" });

  // Gentle scroll parallax: copy drifts up + fades, sphere moves faster,
  // giving the hero cinematic depth as you scroll away.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -70]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -130]);

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28"
    >
      <GradientBlobs />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-52" />
      <TsParticles className="absolute inset-0 -z-10 opacity-70" />
      {/* subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-fade bg-[size:72px_72px] opacity-[0.06] mask-fade-b"
      />

      <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: copy */}
        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="flex flex-col items-start">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
            className="eyebrow"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            {profile.availability}
          </motion.span>

          {/* headline with word-by-word mask reveal */}
          <h1 className="mt-6 font-display text-fluid-xl font-semibold leading-[0.98] tracking-tight">
            <Line delay={0.4}>Hi, I'm {profile.firstName}.</Line>
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease, delay: 0.55 }}
              >
                <AnimatedGradientText>I build the future.</AnimatedGradientText>
              </motion.span>
            </span>
          </h1>

          {/* typewriter role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 flex h-8 items-center font-mono text-lg text-accent-soft md:text-xl"
          >
            <span className="text-faint">&gt;&nbsp;</span>
            <span>{typed}</span>
            <span className="ml-0.5 inline-block h-5 w-[2px] animate-blink bg-accent-soft" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          {/* executive dashboard — system readouts, not marketing counters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.1 }}
            className="mt-8 w-full max-w-xl overflow-hidden rounded-2xl glass"
          >
            <div className="flex items-center justify-between border-b border-line/10 px-4 py-2.5">
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-accent-soft">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-soft opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-soft" />
                </span>
                {dashboardStatus.availability}
              </span>
              <span className="font-mono text-[11px] text-faint">
                {dashboardStatus.location}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-4 sm:grid-cols-3">
              {dashboardMetrics.map((m) => (
                <div key={m.label}>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-faint">
                    {m.label}
                  </p>
                  <p className="mt-0.5 font-display text-base font-semibold text-ink">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-line/10 px-4 py-2.5 font-mono text-[11px] text-muted">
              <span className="text-accent-soft">focus</span> · {dashboardStatus.focus}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.2 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <MagneticButton
              variant="primary"
              cursorLabel="View"
              onClick={() => scrollToSection("#projects")}
            >
              View Projects
              <span aria-hidden>→</span>
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              href={profile.resumeUrl}
              download
              cursorLabel="PDF"
            >
              Download Resume
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              cursorLabel="Say hi"
              onClick={() => scrollToSection("#contact")}
            >
              Contact Me
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Right: 3D crystal + profile card */}
        <motion.div
          style={{ y: sceneY }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease, delay: 0.5 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div ref={sceneRef} className="absolute inset-0">
            <HeroScene theme={theme} active={sceneInView} />
          </div>

          {/* floating glass profile card */}
          <motion.div
            className="glass absolute -bottom-2 left-1/2 w-[78%] -translate-x-1/2 rounded-3xl p-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl text-lg">
                <Avatar position="center 20%" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{profile.name}</p>
                <p className="truncate text-xs text-muted">{profile.location}</p>
              </div>
              <div className="ml-auto rounded-full bg-green-400/10 px-2.5 py-1 text-[10px] font-medium text-green-400">
                Online
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-line/20 p-1">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-accent"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

/** Single masked headline line. */
function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
