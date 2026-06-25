"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const paginate = useCallback((d: number) => {
    setDir(d);
    setIndex((i) => (i + d + testimonials.length) % testimonials.length);
  }, []);

  // auto-advance
  useEffect(() => {
    const t = setInterval(() => paginate(1), 6000);
    return () => clearInterval(t);
  }, [paginate]);

  const t = testimonials[index];

  return (
    <section className="relative py-28 md:py-36">
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Recommendations"
          title="What leaders I've worked with say."
          className="mx-auto"
        />

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div className="relative min-h-[280px] overflow-hidden rounded-4xl glass p-8 md:p-12">
            {/* big quote mark */}
            <span className="absolute right-8 top-4 font-display text-8xl leading-none text-accent/15">
              &rdquo;
            </span>

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-xl font-medium leading-relaxed text-ink md:text-2xl">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-accent to-ember font-semibold text-white">
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{t.name}</p>
                    <p className="text-sm text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => paginate(-1)}
              data-cursor="Prev"
              aria-label="Previous testimonial"
              className="grid h-10 w-10 place-items-center rounded-full glass text-ink transition-colors hover:bg-line/[0.08]"
            >
              ←
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDir(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === index ? 28 : 8,
                    background:
                      i === index
                        ? "rgb(var(--accent))"
                        : "rgb(var(--line) / 0.2)",
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => paginate(1)}
              data-cursor="Next"
              aria-label="Next testimonial"
              className="grid h-10 w-10 place-items-center rounded-full glass text-ink transition-colors hover:bg-line/[0.08]"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
