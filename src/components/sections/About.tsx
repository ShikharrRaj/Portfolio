"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { about, stats, education, profile } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Avatar } from "@/components/ui/Avatar";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // parallax for the decorative number column
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="about" ref={ref} className="relative py-28 md:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Mission Briefing"
          title={about.heading}
          description="A decade of turning hard problems into products people love."
        />

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr]">
          {/* story */}
          <div className="space-y-5">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-lg leading-relaxed text-muted">{p}</p>
              </Reveal>
            ))}

            {/* principle cards */}
            <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {about.principles.map((pr) => (
                <StaggerItem key={pr.title}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    data-cursor=""
                    className="group h-full rounded-2xl glass p-5 transition-shadow hover:shadow-glow"
                  >
                    <h3 className="font-display text-base font-semibold text-ink">
                      {pr.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {pr.body}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* portrait + animated stat counters */}
          <motion.div style={{ y }} className="flex flex-col gap-4 self-start">
            <Reveal direction="left">
              <div className="group relative overflow-hidden rounded-[2rem] glass p-2">
                {/* glow ring */}
                <div className="pointer-events-none absolute -inset-px rounded-[2rem] bg-gradient-to-br from-accent/40 via-transparent to-ember/40 opacity-60" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
                  <Avatar
                    rounded="rounded-[1.6rem]"
                    position="center 20%"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* warm gradient wash to blend with the palette */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div>
                      <p className="font-display text-base font-semibold text-white">
                        {profile.name}
                      </p>
                      <p className="text-xs text-white/70">{profile.location}</p>
                    </div>
                    <span className="rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                      {profile.roles[0]}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 0.1}
                className="rounded-3xl glass p-6 text-center"
              >
                <div className="font-display text-4xl font-semibold text-gradient md:text-5xl">
                  <AnimatedCounter
                    value={s.value}
                    suffix={s.suffix}
                    decimals={s.decimals}
                  />
                </div>
                <p className="mt-2 text-xs uppercase tracking-wider text-muted">
                  {s.label}
                </p>
              </Reveal>
            ))}
            </div>
          </motion.div>
        </div>

        {/* education */}
        <div className="mt-16">
          <Reveal>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-faint">
              Education
            </h3>
          </Reveal>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {education.map((ed, i) => (
              <Reveal
                key={ed.school}
                delay={i * 0.08}
                className="flex items-start justify-between gap-4 rounded-3xl glass p-6"
              >
                <div>
                  <p className="font-display text-lg font-semibold text-ink">
                    {ed.degree}
                  </p>
                  <p className="mt-0.5 text-sm text-accent-soft">{ed.field}</p>
                  <p className="mt-1 text-sm text-muted">{ed.school}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {ed.period}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
