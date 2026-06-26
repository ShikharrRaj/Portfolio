"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { techUniverse, techClusters } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

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
                  {/* GPU-composited CSS rotation (no per-frame JS) */}
                  <div
                    className="relative h-full w-full [will-change:transform]"
                    style={
                      reduced
                        ? undefined
                        : {
                            animation: `orbit-spin ${orbit.duration}s linear infinite${
                              orbit.reverse ? " reverse" : ""
                            }`,
                          }
                    }
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
                          {/* counter-rotation wrapper keeps labels upright.
                              origin-top-left pivots at the orbit point so the
                              badge rides exactly on the ring (no wobble). */}
                          <div
                            className="origin-top-left [will-change:transform]"
                            style={
                              reduced
                                ? undefined
                                : {
                                    animation: `orbit-spin ${orbit.duration}s linear infinite${
                                      orbit.reverse ? "" : " reverse"
                                    }`,
                                  }
                            }
                          >
                            <span
                              className="flex -translate-x-1/2 -translate-y-1/2 cursor-default items-center whitespace-nowrap rounded-full glass px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-accent/20 hover:text-accent-soft"
                              data-cursor=""
                            >
                              {tech}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* ambient glow */}
            <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-accent/15 blur-[100px]" />
          </div>
        </div>
      </div>

      {/* interactive cluster explorer */}
      <div className="container-page mt-16 md:mt-24">
        <ClusterExplorer />
      </div>
    </section>
  );
}

/**
 * Click a cluster, then a technology, to reveal years used, projects shipped
 * with it, and the business impact it drove.
 */
function ClusterExplorer() {
  const [cluster, setCluster] = useState(0);
  const [node, setNode] = useState(0);
  const active = techClusters[cluster];
  const tech = active.nodes[node];

  const selectCluster = (i: number) => {
    setCluster(i);
    setNode(0);
  };

  return (
    <div>
      {/* cluster tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {techClusters.map((c, i) => (
          <button
            key={c.name}
            onClick={() => selectCluster(i)}
            data-cursor=""
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
              i === cluster
                ? "border-accent/40 bg-accent/10 text-accent-soft"
                : "border-line/10 text-muted hover:text-ink",
            )}
          >
            <span className="text-accent-soft">{c.icon}</span>
            {c.name}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-[1fr_1fr]">
        {/* tech chips */}
        <div className="flex flex-wrap content-start gap-2 rounded-3xl glass p-6">
          {active.nodes.map((n, i) => (
            <button
              key={n.name}
              onClick={() => setNode(i)}
              data-cursor=""
              className={cn(
                "rounded-full border px-3.5 py-2 text-sm transition-all",
                i === node
                  ? "border-accent/40 bg-accent/15 text-ink"
                  : "border-line/10 text-muted hover:border-line/20 hover:text-ink",
              )}
            >
              {n.name}
            </button>
          ))}
        </div>

        {/* detail */}
        <div className="rounded-3xl glass p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${cluster}-${node}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-display text-xl font-semibold text-ink">
                {tech.name}
              </h4>
              <div className="mt-4 flex gap-6">
                <div>
                  <p className="font-display text-2xl font-semibold text-gradient">
                    {tech.years}
                    <span className="text-base">y</span>
                  </p>
                  <p className="text-xs text-muted">Experience</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-gradient">
                    {tech.projects}
                  </p>
                  <p className="text-xs text-muted">Projects</p>
                </div>
              </div>
              <div className="mt-4 border-t border-line/10 pt-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-faint">
                  Business impact
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {tech.impact}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
