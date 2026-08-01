"use client";

import { motion } from "framer-motion";
import { achievements, type Achievement } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

// Green-family tones that read well on both the dark glass and light surfaces
// (our theming uses a `.light` class, not Tailwind's `dark:` variant).
const typeStyles: Record<Achievement["type"], { icon: string; tint: string }> = {
  Certification: { icon: "❖", tint: "from-emerald-500/20 to-emerald-500/5 text-emerald-500" },
  Award: { icon: "★", tint: "from-accent/25 to-accent/5 text-accent-soft" },
  Speaking: { icon: "◎", tint: "from-green-500/20 to-green-500/5 text-green-500" },
  "Open Source": { icon: "❮❯", tint: "from-teal-500/20 to-teal-500/5 text-teal-500" },
};

export function Achievements() {
  return (
    <section id="achievements" className="relative overflow-hidden py-28 md:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Impact"
          title="Awards, talks, certs & open source."
          description="A track record beyond the day-to-day."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => {
            const style = typeStyles[a.type];
            return (
              <StaggerItem key={`${a.title}-${a.year}`}>
                <motion.div whileHover={{ y: -6 }} className="h-full">
                  <SpotlightCard
                    data-cursor=""
                    className="h-full overflow-hidden rounded-3xl glass p-6 transition-shadow hover:shadow-glow"
                  >
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
                  </SpotlightCard>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
