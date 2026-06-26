"use client";

import { useMemo } from "react";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const init = async (engine: Engine) => {
  await loadSlim(engine);
};

interface TsParticlesProps {
  id?: string;
  className?: string;
}

/**
 * Ambient interactive particle field powered by tsParticles (v4 provider
 * API). Amber/coral dots that link to neighbours and react to the cursor.
 * Skipped entirely under reduced-motion.
 */
export function TsParticles({ id = "tsparticles", className }: TsParticlesProps) {
  const reduced = usePrefersReducedMotion();

  const options = useMemo<ISourceOptions>(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 36, density: { enable: true } },
        color: { value: ["#4f46e5", "#38bdf8", "#818cf8"] },
        // No connecting lines — quieter, more minimal field of drifting dots.
        links: { enable: false },
        move: {
          enable: true,
          speed: 0.35,
          outModes: { default: "out" },
        },
        opacity: { value: { min: 0.08, max: 0.32 } },
        size: { value: { min: 1, max: 2 } },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "bubble" },
        },
        modes: {
          bubble: { distance: 140, size: 3, opacity: 0.5, duration: 1 },
        },
      },
    }),
    [],
  );

  if (reduced) return null;

  return (
    <ParticlesProvider init={init}>
      <Particles id={id} options={options} className={className} />
    </ParticlesProvider>
  );
}
