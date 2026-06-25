"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { experiences } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  // Progress line that fills as you scroll through the timeline.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const lineHeight = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
  });

  const [open, setOpen] = useState<number>(0);

  return (
    <section id="experience" className="relative py-28 md:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Experience"
          title="A journey of impact, not job titles."
          description="Hover or tap any role to expand the achievements that defined it."
        />

        <div ref={ref} className="relative mt-16 pl-8 md:pl-12">
          {/* timeline track */}
          <div className="absolute left-[10px] top-2 h-full w-px bg-line/10 md:left-[14px]" />
          <motion.div
            className="absolute left-[10px] top-2 w-px origin-top bg-gradient-to-b from-accent to-ember md:left-[14px]"
            style={{ height: "100%", scaleY: lineHeight }}
          />

          <div className="space-y-6">
            {experiences.map((exp, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                  className="relative"
                  onMouseEnter={() => setOpen(i)}
                >
                  {/* node */}
                  <span className="absolute -left-[30px] top-6 grid h-5 w-5 place-items-center md:-left-[42px]">
                    <span className="absolute h-5 w-5 rounded-full bg-accent/20" />
                    <motion.span
                      className="h-2.5 w-2.5 rounded-full bg-accent"
                      animate={{ scale: isOpen ? 1.3 : 1 }}
                    />
                  </span>

                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    data-cursor=""
                    className={`w-full rounded-3xl border p-6 text-left transition-all duration-500 ${
                      isOpen
                        ? "glass-strong border-accent/30 shadow-glow"
                        : "glass border-line/10 hover:border-line/20"
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-ink">
                          {exp.role}
                        </h3>
                        <p className="text-sm text-accent-soft">{exp.company}</p>
                      </div>
                      <div className="text-right text-xs text-muted">
                        <p className="font-mono">{exp.period}</p>
                        <p>{exp.location}</p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {exp.summary}
                    </p>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-4 space-y-2 border-t border-line/10 pt-4">
                            {exp.impact.map((item, j) => (
                              <motion.li
                                key={j}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + j * 0.07 }}
                                className="flex gap-3 text-sm text-ink/90"
                              >
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ember" />
                                {item}
                              </motion.li>
                            ))}
                          </ul>

                          {exp.clients && exp.clients.length > 0 && (
                            <div className="mt-5 border-t border-line/10 pt-4">
                              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-faint">
                                Clients & Projects
                              </p>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {exp.clients.map((c) => (
                                  <div
                                    key={c.project}
                                    className="rounded-2xl border border-line/10 bg-line/[0.03] p-3"
                                  >
                                    <p className="text-sm font-semibold text-ink">
                                      {c.project}
                                    </p>
                                    <p className="text-[11px] uppercase tracking-wider text-accent-soft">
                                      {c.name}
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-muted">
                                      {c.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            {exp.stack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full border border-line/10 bg-line/[0.04] px-3 py-1 text-xs text-muted"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
