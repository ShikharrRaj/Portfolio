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
        number: { value: 70, density: { enable: true } },
        color: { value: ["#f5b042", "#ff6b4a", "#ffd27a"] },
        links: {
          enable: true,
          color: "#f5b042",
          distance: 130,
          opacity: 0.12,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.6,
          outModes: { default: "out" },
        },
        opacity: { value: { min: 0.15, max: 0.6 } },
        size: { value: { min: 1, max: 2.4 } },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
        },
        modes: {
          grab: { distance: 170, links: { opacity: 0.3 } },
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
