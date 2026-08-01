"use client";

import { motion } from "framer-motion";
import { philosophy } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * "How I Think" — the engineering process as a connected pipeline. Each step
 * reveals on scroll with a flowing connector, communicating a repeatable,
 * outcome-driven way of working rather than ad-hoc coding.
 */
export function Philosophy() {
  return (
    <section id="philosophy" className="relative py-28 md:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="How I Think"
          title="A repeatable path from problem to leverage."
          description="The same loop, whether it's a banking module or an AI pipeline."
        />

        <div className="relative mt-16">
          {/* connecting rail (desktop) */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-line/10 lg:block" />

          <div className="space-y-4 lg:space-y-0">
            {philosophy.map((p, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={p.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative lg:flex lg:w-1/2 ${
                    left ? "lg:mr-auto lg:justify-end lg:pr-10" : "lg:ml-auto lg:justify-start lg:pl-10"
                  }`}
                >
                  {/* node dot on the rail */}
                  <span
                    className={`absolute top-6 hidden h-3 w-3 rounded-full border-2 border-bg bg-accent lg:block ${
                      left ? "right-[-6px]" : "left-[-6px]"
                    }`}
                  />
                  <div className="group w-full rounded-2xl glass p-5 transition-shadow hover:shadow-glow lg:max-w-md">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 font-mono text-xs text-accent-soft">
                        {p.step}
                      </span>
                      <h3 className="font-display text-base font-semibold text-ink">
                        {p.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
