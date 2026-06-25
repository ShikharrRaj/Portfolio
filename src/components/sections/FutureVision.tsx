"use client";

import { motion } from "framer-motion";
import { futureVision } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Future Vision — where the journey is heading. A statement of intent plus
 * the pillars that define the kind of technology leader being built toward.
 */
export function FutureVision() {
  return (
    <section id="future" className="relative overflow-hidden py-28 md:py-36">
      {/* soft ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/[0.12] blur-[150px]"
      />

      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Future Vision"
          title="Building toward the CTO seat."
          className="mx-auto"
        />

        <Reveal className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-muted md:text-xl">
            {futureVision.statement}
          </p>
        </Reveal>

        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {futureVision.pillars.map((p, i) => (
            <StaggerItem key={p.title}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group h-full rounded-3xl glass p-6 transition-shadow hover:shadow-glow"
              >
                <span className="font-mono text-xs text-accent-soft">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-base font-semibold text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
