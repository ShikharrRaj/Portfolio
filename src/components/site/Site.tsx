"use client";

/* The site.
 *
 * Structure follows the reference: a full-bleed pixel landscape as the hero
 * wallpaper, with entirely modern UI floating over it — a translucent pill
 * nav, a clean sans headline, and soft status cards. The pixel art is the
 * world; the interface is not pixel art. Mixing the two registers is what
 * made the previous attempt read as a retro game instead of a product.
 *
 * Below the fold it becomes a portfolio: real work, real decisions.
 */

import { useEffect, useState } from "react";
import { caseFiles, corrections, timeline } from "@/data/os";
import { experiences, profile } from "@/data/portfolio";
import { SceneCanvas } from "./SceneCanvas";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Journey", href: "#journey" },
  { label: "Decisions", href: "#decisions" },
  { label: "Contact", href: "#contact" },
];

/* Floating status cards — the reference's "Task completed" chips, but
 * carrying facts instead of fictional agent activity. */
const CARDS = [
  { tone: "live", label: "Now", value: "Tech Lead · Rock Paper Scissors Studio" },
  { tone: "done", label: "Shipped", value: "Axis Neo — corporate banking platform" },
  { tone: "done", label: "Built", value: "Claude × Figma pipeline · +25–30% velocity" },
];

function Hero() {
  const [lift, setLift] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setLift(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <header className="relative isolate min-h-[100svh] overflow-hidden bg-[#66B8EE]">
      <div className="absolute inset-0 -z-10">
        <SceneCanvas />
      </div>

      {/* Nav — frosted pill, floating over the art */}
      <nav className="relative z-20 mx-auto flex max-w-6xl items-center gap-3 px-5 pt-5 sm:px-8 sm:pt-7">
        <a
          href="#top"
          className="rounded-full bg-white/85 px-4 py-2 text-sm font-semibold tracking-tight text-slate-900 shadow-sm backdrop-blur"
        >
          {profile.firstName}
        </a>
        <div className="ml-auto hidden items-center gap-1 rounded-full bg-white/70 p-1 shadow-sm backdrop-blur sm:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-4 py-1.5 text-sm text-slate-700 transition-colors hover:bg-white hover:text-slate-900"
            >
              {n.label}
            </a>
          ))}
        </div>
        <a
          href={profile.resumeUrl}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5 sm:ml-1"
        >
          Résumé
        </a>
      </nav>

      {/* Headline block */}
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div
          className={`max-w-2xl transition-all duration-700 ${
            lift ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(15,40,70,0.45)] sm:text-5xl lg:text-6xl">
            I build systems banks trust
            <br className="hidden sm:block" /> and teams can maintain.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 drop-shadow-[0_1px_8px_rgba(15,40,70,0.5)] sm:text-lg">
            Tech Lead and AI Product Engineer. Three and a half years across banking, wealth and
            insurance — architecture, delivery, and the AI pipelines that made the team meaningfully
            faster.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:-translate-y-0.5"
            >
              See the work
            </a>
            <a
              href="#contact"
              className="rounded-full bg-white/85 px-6 py-3 text-sm font-medium text-slate-900 shadow-lg backdrop-blur transition-transform hover:-translate-y-0.5"
            >
              Start a conversation
            </a>
          </div>
        </div>

        {/* Status cards */}
        <ul className="flex w-full flex-col gap-2.5 lg:w-[19rem]">
          {CARDS.map((c, i) => (
            <li
              key={c.label + c.value}
              className={`rounded-xl bg-slate-900/45 px-4 py-3 shadow-lg backdrop-blur-md transition-all duration-700 ${
                lift ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: `${160 + i * 120}ms` }}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    c.tone === "live" ? "animate-pulse bg-emerald-300" : "bg-white/70"
                  }`}
                />
                <span className="text-[0.7rem] font-medium uppercase tracking-wider text-white/70">
                  {c.label}
                </span>
              </span>
              <p className="mt-1.5 text-sm leading-snug text-white">{c.value}</p>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 border-t border-slate-200/80 py-20 sm:py-24">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-emerald-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function Site() {
  return (
    <div id="top" className="bg-[#F7FAF7] text-slate-800">
      <Hero />

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        <Section id="work" eyebrow="Case files" title="Things he built, opened up.">
          <div className="grid gap-4 sm:grid-cols-2">
            {caseFiles.map((c) => (
              <article
                key={c.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                    {c.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider ${
                      c.classification === "NDA"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {c.classification}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {c.client ? `${c.client} · ` : ""}
                  {c.year}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{c.tagline}</p>
                <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                  <div>
                    <dt className="text-[0.7rem] font-medium uppercase tracking-wider text-slate-400">
                      What failed
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-slate-600">{c.failed}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] font-medium uppercase tracking-wider text-slate-400">
                      Impact
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-slate-900">{c.impact}</dd>
                  </div>
                </dl>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {c.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-md bg-slate-100 px-2 py-1 text-[0.7rem] text-slate-600"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section id="journey" eyebrow="Timeline" title="Every step was a decision with a cost.">
          <ol className="space-y-8">
            {timeline.map((t) => (
              <li key={t.title} className="grid gap-3 sm:grid-cols-[5rem_1fr] sm:gap-8">
                <span className="text-sm font-medium tabular-nums text-emerald-700">{t.year}</span>
                <div>
                  <h3 className="font-semibold tracking-tight text-slate-900">{t.title}</h3>
                  <div className="mt-3 grid gap-4 sm:grid-cols-3">
                    {(
                      [
                        ["Decision", t.decision],
                        ["Trade-off", t.tradeoff],
                        ["Outcome", t.outcome],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[0.7rem] font-medium uppercase tracking-wider text-slate-400">
                          {k}
                        </p>
                        <p
                          className={`mt-1 text-sm leading-relaxed ${
                            k === "Trade-off" ? "text-amber-800" : "text-slate-600"
                          }`}
                        >
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="decisions" eyebrow="Corrections" title="What he would do differently.">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {corrections.map((c) => (
              <li key={c.context} className="rounded-2xl border border-slate-200 bg-white p-5">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-slate-600">
                  {c.scope}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{c.context}</p>
                <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-900">
                  {c.wouldChange}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="contact" eyebrow="Where he's been" title="Two institutions, one agency floor.">
          <div className="grid gap-4 sm:grid-cols-2">
            {experiences.map((e) => (
              <div key={e.company} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-semibold tracking-tight text-slate-900">{e.company}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {e.role} · {e.period}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{e.summary}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-slate-900 p-8 sm:p-10">
            <p className="max-w-xl text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
              This is a snapshot. The real product is what we could build together.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
              {profile.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-sm text-slate-300 underline-offset-4 transition-colors hover:text-emerald-300 hover:underline"
                >
                  <span className="text-slate-500">{s.label}</span> {s.handle}
                </a>
              ))}
            </div>
          </div>
        </Section>
      </main>

      <footer className="mx-auto max-w-6xl px-5 pb-12 text-sm text-slate-400 sm:px-8">
        {profile.name} · {profile.location}
      </footer>
    </div>
  );
}
