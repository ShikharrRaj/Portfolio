"use client";

import { profile } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LiveClock } from "@/components/ui/LiveClock";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-36">
      {/* interactive map/globe-style backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-grid-fade bg-[size:44px_44px] opacity-[0.04] [mask-image:radial-gradient(circle,black,transparent_70%)]" />
        <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[130px]" />
      </div>

      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Let's Build Together"
            title="Let's build something exceptional."
            description="Have a role, a project, or just an idea? My inbox is always open."
            className="mx-auto"
          />

          <Reveal delay={0.1} className="mt-8 flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-3 rounded-full glass px-5 py-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>
              <span className="text-sm font-medium text-ink">{profile.availability}</span>
            </div>
            <LiveClock className="rounded-full glass px-5 py-3 text-sm text-ink" />
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
            {profile.socials.map((s, i) => (
              <Reveal key={s.label} delay={0.15 + i * 0.06}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  data-cursor="Open"
                  className="group flex items-center justify-between rounded-2xl glass px-5 py-4 transition-all hover:border-accent/30 hover:shadow-glow"
                >
                  <span className="font-medium text-ink">{s.label}</span>
                  <span className="flex items-center gap-2 text-sm text-muted transition-colors group-hover:text-accent-soft">
                    {s.handle}
                    <span className="transition-transform group-hover:translate-x-1">↗</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
