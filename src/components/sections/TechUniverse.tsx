"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { techUniverse } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Marquee } from "@/components/ui/marquee";
import { Badge } from "@/components/ui/badge";

// Three concentric orbits, designed at a fixed "stage" size and then scaled
// down to fit whatever width is available (mobile → desktop).
const ORBITS = [
  { radius: 130, count: 6, duration: 38, reverse: false },
  { radius: 210, count: 7, duration: 52, reverse: true },
  { radius: 290, count: 7, duration: 66, reverse: false },
];

// Outer orbit (290) + badge → the design needs ~640px to breathe.
const STAGE = 640;

export function TechUniverse() {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  let cursor = 0;

  // Measure available width and scale the whole orbit stage so it always
  // fits — no clipping or horizontal overflow on small screens.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setScale(Math.min(1, w / STAGE));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Tech Universe"
          title="The constellation I build with."
          description="Every technology I reach for, orbiting a single core."
          className="mx-auto"
        />
      </div>

      {/* responsive wrapper: height tracks the scaled stage */}
      <div ref={wrapRef} className="container-page mt-12 md:mt-16">
        <div
          className="relative mx-auto"
          style={{ width: STAGE * scale, height: STAGE * scale, maxWidth: "100%" }}
        >
          <div
            className="absolute left-1/2 top-1/2 flex items-center justify-center"
            style={{
              width: STAGE,
              height: STAGE,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            {/* core */}
            <motion.div
              className="absolute z-10 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-accent to-ember shadow-glow-lg"
              animate={reduced ? {} : { scale: [1, 1.06, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="font-display text-sm font-semibold text-white">
                Core
              </span>
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
                    transition={{
                      duration: orbit.duration,
                      repeat: Infinity,
                      ease: "linear",
                    }}
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
        </div>
      </div>

      {/* marquee strip of the full stack */}
      <div className="relative mt-12 md:mt-20">
        <Marquee className="[--duration:38s]">
          {techUniverse.map((t) => (
            <Badge key={t} variant="outline" className="px-4 py-2 text-sm">
              {t}
            </Badge>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
      </div>
    </section>
  );
}
