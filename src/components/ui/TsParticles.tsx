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
        number: { value: 64, density: { enable: true } },
        color: { value: ["#4f46e5", "#38bdf8", "#818cf8"] },
        links: {
          enable: true,
          color: "#4f46e5",
          distance: 130,
          opacity: 0.1,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.5,
          outModes: { default: "out" },
        },
        opacity: { value: { min: 0.12, max: 0.45 } },
        size: { value: { min: 1, max: 2.2 } },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
        },
        modes: {
          grab: { distance: 160, links: { opacity: 0.24 } },
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
