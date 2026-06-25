"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, projectCategories, type Project } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BorderBeam } from "@/components/ui/border-beam";
import { Badge } from "@/components/ui/badge";

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative py-28 md:py-36">
      <div className="container-page">
        <SectionHeading
          eyebrow="Selected Work"
          title="Case studies, not screenshots."
          description="A look at the problems, the solutions, and the measurable impact."
        />

        {/* filter pills */}
        <div className="mt-10 flex flex-wrap gap-2">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              data-cursor=""
              className="relative rounded-full px-4 py-2 text-sm font-medium transition-colors"
            >
              {filter === cat && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-accent shadow-glow"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  filter === cat ? "text-white" : "text-muted hover:text-ink"
                }`}
              >
                {cat}
              </span>
            </button>
          ))}
        </div>

        {/* grid */}
        <motion.div layout className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hover, setHover] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -py * 8, y: px * 8 });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setRotate({ x: 0, y: 0 });
      }}
      onMouseMove={onMove}
      className="group perspective"
      data-cursor="View"
    >
      <motion.article
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="preserve-3d relative h-full overflow-hidden rounded-4xl glass p-6 transition-shadow duration-500 group-hover:shadow-glow-lg"
      >
        {hover && <BorderBeam duration={6} size={160} />}
        {/* animated mockup header */}
        <div
          className="relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl"
          style={{
            backgroundImage: `linear-gradient(135deg, ${project.accent[0]}, ${project.accent[1]})`,
          }}
        >
          {/* faux browser chrome */}
          <div className="absolute left-0 right-0 top-0 flex items-center gap-1.5 bg-black/20 px-4 py-2.5 backdrop-blur-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
          </div>
          {/* drifting glints */}
          <motion.div
            className="absolute -inset-1 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]"
            animate={hover ? { opacity: 0.9, scale: 1.1 } : { opacity: 0.5, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <div
            className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/10 p-3 backdrop-blur-md"
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="h-2 w-2/3 rounded-full bg-white/50" />
            <div className="mt-2 h-2 w-1/3 rounded-full bg-white/30" />
          </div>
          <span className="absolute right-4 top-12 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
            {project.category} · {project.year}
          </span>
        </div>

        <div style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-xl font-semibold text-ink">
              {project.title}
            </h3>
            {project.client && (
              <span className="shrink-0 rounded-full border border-line/10 bg-line/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted">
                {project.client}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-accent-soft">{project.tagline}</p>

          {/* case-study detail */}
          <dl className="mt-4 space-y-3 text-sm">
            <CaseRow label="Problem" value={project.problem} />
            <CaseRow label="Solution" value={project.solution} />
            <div>
              <dt className="text-xs uppercase tracking-wider text-faint">Impact</dt>
              <dd className="mt-1 font-medium text-ember">{project.impact}</dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent-soft"
              >
                Live Demo <span aria-hidden>↗</span>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                GitHub <span aria-hidden>↗</span>
              </a>
            )}
            {project.confidential && !project.demo && !project.github && (
              <span className="inline-flex items-center gap-1.5 text-sm text-faint">
                <span aria-hidden>🔒</span> Enterprise · under NDA
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

function CaseRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-faint">{label}</dt>
      <dd className="mt-1 leading-relaxed text-muted">{value}</dd>
    </div>
  );
}
