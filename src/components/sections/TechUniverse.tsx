"use client";

import { motion } from "framer-motion";
import { techUniverse } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Distribute the tech list across three concentric orbits.
const ORBITS = [
  { radius: 130, count: 6, duration: 38, reverse: false },
  { radius: 210, count: 7, duration: 52, reverse: true },
  { radius: 290, count: 7, duration: 66, reverse: false },
];

export function TechUniverse() {
  const reduced = usePrefersReducedMotion();
  let cursor = 0;

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Tech Universe"
          title="The constellation I build with."
          description="Every technology I reach for, orbiting a single core."
          className="mx-auto"
        />
      </div>

      <div className="relative mx-auto mt-16 flex h-[640px] w-full max-w-[640px] items-center justify-center">
        {/* core */}
        <motion.div
          className="absolute z-10 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-accent to-ember shadow-glow-lg"
          animate={reduced ? {} : { scale: [1, 1.06, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-display text-sm font-semibold text-white">Core</span>
        </motion.div>

        {ORBITS.map((orbit, oi) => {
          const items = techUniverse.slice(cursor, cursor + orbit.count);
          cursor += orbit.count;
          return (
            <div
              key={oi}
              className="absolute rounded-full border border-line/[0.08]"
              style={{ width: orbit.radius * 2, height: orbit.radius * 2 }}
            >
              <motion.div
                className="relative h-full w-full"
                animate={reduced ? {} : { rotate: orbit.reverse ? -360 : 360 }}
                transition={{ duration: orbit.duration, repeat: Infinity, ease: "linear" }}
              >
                {items.map((tech, i) => {
                  const angle = (i / orbit.count) * Math.PI * 2;
                  const x = Math.cos(angle) * orbit.radius;
                  const y = Math.sin(angle) * orbit.radius;
                  return (
                    <div
                      key={tech}
                      className="absolute left-1/2 top-1/2"
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                      {/* counter-rotate so labels stay upright */}
                      <motion.span
                        className="flex -translate-x-1/2 -translate-y-1/2 cursor-default items-center whitespace-nowrap rounded-full glass px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-accent/20 hover:text-accent-soft"
                        data-cursor=""
                        animate={reduced ? {} : { rotate: orbit.reverse ? 360 : -360 }}
                        transition={{
                          duration: orbit.duration,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        whileHover={{ scale: 1.15 }}
                      >
                        {tech}
                      </motion.span>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          );
        })}

        {/* ambient glow */}
        <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-accent/15 blur-[100px]" />
      </div>
    </section>
  );
}
