"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skillCategories } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";

export function Skills() {
  const [active, setActive] = useState(0);
  const category = skillCategories[active];

  return (
    <section id="skills" className="relative py-28 md:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Engineering Expertise"
          title="A full-stack toolkit, deep where it counts."
          description="Select a discipline to explore proficiency across the stack."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          {/* category selector */}
          <div className="flex flex-col gap-2">
            {skillCategories.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setActive(i)}
                data-cursor=""
                className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-400 ${
                  active === i
                    ? "glass-strong border-accent/30"
                    : "glass border-line/10 hover:border-line/20"
                }`}
              >
                {active === i && (
                  <motion.span
                    layoutId="skill-active"
                    className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-ember"
                  />
                )}
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl text-xl transition-colors ${
                    active === i ? "bg-accent/15 text-accent-soft" : "bg-line/[0.05] text-muted"
                  }`}
                >
                  {cat.icon}
                </span>
                <div>
                  <p className="font-display font-semibold text-ink">{cat.name}</p>
                  <p className="text-xs text-muted">{cat.skills.length} skills</p>
                </div>
              </button>
            ))}
          </div>

          {/* proficiency bars */}
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl glass p-8"
          >
            <Stagger className="space-y-6">
              {category.skills.map((skill) => (
                <StaggerItem key={skill.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{skill.name}</span>
                    <span className="font-mono text-xs text-muted">{skill.level}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-line/[0.06]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-ember"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
