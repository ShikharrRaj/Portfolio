"use client";

import { motion } from "framer-motion";
import { achievements, type Achievement } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Meteors } from "@/components/ui/meteors";

const typeStyles: Record<Achievement["type"], { icon: string; tint: string }> = {
  Certification: { icon: "❖", tint: "from-sky-400/20 to-sky-400/5 text-sky-300" },
  Award: { icon: "★", tint: "from-accent/25 to-accent/5 text-accent-soft" },
  Speaking: { icon: "◎", tint: "from-blue-400/20 to-blue-400/5 text-blue-300" },
  "Open Source": { icon: "❮❯", tint: "from-cyan-400/20 to-cyan-400/5 text-cyan-300" },
};

export function Achievements() {
  return (
    <section id="achievements" className="relative overflow-hidden py-28 md:py-36">
      <Meteors number={14} />
      <div className="container-page">
        <SectionHeading
          eyebrow="Recognition"
          title="Awards, talks, certs & open source."
          description="A track record beyond the day-to-day."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => {
            const style = typeStyles[a.type];
            return (
              <StaggerItem key={`${a.title}-${a.year}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  data-cursor=""
                  className="group relative h-full overflow-hidden rounded-3xl glass p-6 transition-shadow hover:shadow-glow"
                >
                  {/* hover sheen */}
                  <span className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover:translate-x-[300%]" />
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-xl ${style.tint}`}
                  >
                    {style.icon}
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-wider text-faint">
                    {a.type} · {a.year}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-ink">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{a.org}</p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
