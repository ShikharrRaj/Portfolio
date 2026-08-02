/* The site.
 *
 * Structure follows the reference: a full-bleed pixel landscape as the hero
 * wallpaper, with entirely modern UI floating over it — a translucent pill
 * nav, a clean sans headline, and soft status cards. The pixel art is the
 * world; the interface is not pixel art.
 *
 * Below the fold it is a developer portfolio, written in first person.
 *
 * Fully server-rendered. The landscape arrives as <img> layers already in
 * the HTML and the entrance animation is CSS, so nothing here depends on a
 * client effect having run.
 */

import type { SceneLayers } from "@/lib/png";
import { caseFiles, timeline } from "@/data/work";
import {
  achievements,
  experiences,
  profile,
  sceneLines,
  skillCategories,
  stats,
} from "@/data/portfolio";
import { Landscape } from "./Landscape";
import { SceneStage } from "./SceneStage";

/** Chevron that becomes an arrow on hover. Pure CSS — the link sets the
 *  custom properties, the SVG reads them. Costs nothing and reads as craft. */
function Arrow() {
  return (
    <svg className="arrow inline-block" width="12" height="12" viewBox="0 0 10 10" aria-hidden>
      <g className="arrow-line">
        <path d="M0 5 h7" />
      </g>
      <g className="arrow-tip">
        <path d="M1 1 l4 4 l-4 4" />
      </g>
    </svg>
  );
}

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Journey", href: "#journey" },
  { label: "Skills", href: "#skills" },
  { label: "Recognition", href: "#recognition" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

/* Floating status cards — the reference's "Task completed" chips, carrying
 * facts rather than fictional agent activity. */
const CARDS = [
  { tone: "live", label: "Now", value: "Tech Lead · Rock Paper Scissors Studio" },
  { tone: "done", label: "Shipped", value: "Axis Neo — corporate banking platform" },
  { tone: "done", label: "Built", value: "Claude × Figma pipeline · +25–30% velocity" },
];

/**
 * Fixed rather than in-flow: the nav used to live inside <header> and
 * scrolled away for good, so from Recognition onward there was no way back
 * to Work — and below `md` the link group was hidden entirely, leaving
 * mobile with no section navigation at all. On small screens the same links
 * become a scroll-snapping chip row.
 */
function Nav() {
  return (
    <div className="fixed inset-x-0 top-0 z-40 px-5 pt-4 sm:px-8 sm:pt-5">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <a
          href="#top"
          className="shrink-0 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold tracking-tight text-slate-900 shadow-sm backdrop-blur"
        >
          {profile.firstName}
        </a>

        <nav
          aria-label="Sections"
          className="no-scrollbar navrail ml-auto flex min-w-0 snap-x snap-mandatory items-center gap-1 overflow-x-auto rounded-full bg-white/75 p-1 shadow-sm backdrop-blur"
        >
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="navlink shrink-0 snap-start rounded-full px-3.5 py-1.5 text-sm text-slate-700 transition-colors hover:bg-white hover:text-slate-900 sm:px-4"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <a
          href={profile.resumeUrl}
          className="pressable hidden shrink-0 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm sm:block"
        >
          Resume
        </a>
      </div>
    </div>
  );
}

function Hero({ layers }: { layers: SceneLayers }) {
  return (
    <header className="relative isolate min-h-[100svh] overflow-clip bg-[#5197D2]">
      {/* The stage is the only client code in the hero. Landscape is passed
          as children so the thirty-odd <img> layers stay server-rendered and
          never enter the client bundle. */}
      <SceneStage lines={sceneLines}>
        <Landscape layers={layers} />
      </SceneStage>


      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="site-rise max-w-2xl">
          {/* No hard-coded <br>: a fixed break fights a fluid type ramp and
              lands wrong at every intermediate width. balance does it properly. */}
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(15,40,70,0.5)] sm:text-5xl lg:text-6xl">
            I build systems banks trust and teams can maintain.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/95 drop-shadow-[0_1px_8px_rgba(15,40,70,0.6)] sm:text-lg">
            Tech Lead and AI Product Engineer. Three and a half years across banking, wealth and
            insurance — architecture, delivery, and the AI pipelines that made my team meaningfully
            faster.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="pressable inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg"
            >
              See my work
              <Arrow />
            </a>
            <a
              href="#contact"
              className="pressable inline-flex items-center rounded-full bg-white/90 px-6 py-3 text-sm font-medium text-slate-900 shadow-lg backdrop-blur"
            >
              Get in touch
              <Arrow />
            </a>
          </div>
        </div>

        <ul className="flex w-full flex-col gap-2.5 lg:w-[19rem]">
          {CARDS.map((c, i) => (
            <li
              key={c.label + c.value}
              className="site-slide rounded-xl bg-slate-900/50 px-4 py-3 shadow-lg backdrop-blur-md"
              style={{ animationDelay: `${160 + i * 120}ms` }}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    c.tone === "live" ? "animate-pulse bg-emerald-300" : "bg-white/70"
                  }`}
                />
                <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-white/70">
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
  lede,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="reveal scroll-mt-16 border-t border-slate-200/80 py-20 sm:py-24">
      <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-emerald-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 max-w-2xl text-balance text-[2rem] font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-[2.75rem]">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 max-w-[62ch] text-pretty text-base leading-relaxed text-slate-600">
          {lede}
        </p>
      )}
      <div className="mt-10">{children}</div>
    </section>
  );
}

/* ---- sections ------------------------------------------------------ */

function Stats() {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
      {stats.map((s) => (
        <li key={s.label} className="bg-white px-5 py-6">
          <p className="text-[2.5rem] font-semibold leading-none tracking-tight text-slate-900">
            {s.decimals ? s.value.toFixed(s.decimals) : s.value}
            <span className="text-emerald-600">{s.suffix ?? ""}</span>
          </p>
          <p className="mt-1.5 text-sm leading-snug text-slate-500">{s.label}</p>
        </li>
      ))}
    </ul>
  );
}

function Work() {
  return (
    <div className="workgrid grid gap-4 sm:grid-cols-2">
      {caseFiles.map((c) => (
        <article
          key={c.id}
          className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">{c.title}</h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] ${
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
          <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-600">{c.tagline}</p>

          <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4">
            <div>
              <dt className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-slate-400">
                What I built
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-slate-600">{c.architecture}</dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-slate-400">
                Impact
              </dt>
              <dd className="mt-1 text-sm font-medium leading-relaxed text-slate-900">
                {c.impact}
              </dd>
            </div>
          </dl>

          <ul className="mt-5 flex flex-wrap gap-1.5 pt-1">
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
  );
}

function Journey() {
  return (
    <ol className="space-y-10">
      {timeline.map((t) => (
        <li key={t.title} className="grid items-start gap-3 sm:grid-cols-[5rem_1fr] sm:gap-8">
          {/* Sticky, so the year stays on screen while its decision is read.
              Deliberately no rail, no dots, no zigzag — that shape is the most
              template-coded component in the genre. */}
          <span className="text-sm font-medium tabular-nums text-emerald-700 sm:sticky sm:top-24">
            {t.year}
          </span>
          <div>
            <h3 className="font-semibold tracking-tight text-slate-900">{t.title}</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["Decision", t.decision],
                  ["Outcome", t.outcome],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-slate-400">
                    {k}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Skills() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skillCategories.map((cat) => {
        // Sorted strongest-first, top three emphasised. No percentage bars:
        // a self-assigned "React 94%" is unfalsifiable and would undercut
        // the measured numbers elsewhere on the page.
        const sorted = [...cat.skills].sort((a, b) => b.level - a.level);
        return (
          <div key={cat.name} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="text-emerald-600">
                {cat.icon}
              </span>
              <h3 className="font-semibold tracking-tight text-slate-900">{cat.name}</h3>
            </div>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {sorted.map((s, i) => (
                <li
                  key={s.name}
                  className={`rounded-md px-2.5 py-1 text-[0.78rem] ${
                    i < 3
                      ? "bg-emerald-50 font-medium text-emerald-900 ring-1 ring-emerald-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

const TYPE_TONE: Record<string, string> = {
  Award: "bg-amber-100 text-amber-900",
  Certification: "bg-slate-100 text-slate-700",
  Speaking: "bg-sky-100 text-sky-900",
  "Open Source": "bg-emerald-100 text-emerald-900",
};

function Recognition() {
  const awards = achievements.filter((a) => a.type === "Award");
  const rest = achievements.filter((a) => a.type !== "Award");
  return (
    <div className="space-y-8">
      <ul className="grid gap-4 sm:grid-cols-2">
        {awards.map((a) => (
          <li
            key={a.title}
            className="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-6"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-amber-900">
                {a.type}
              </span>
              <span className="text-xs tabular-nums text-slate-500">{a.year}</span>
            </div>
            <h3 className="mt-3 font-semibold leading-snug tracking-tight text-slate-900">
              {a.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{a.org}</p>
            {a.note && <p className="mt-1 text-sm text-amber-800">{a.note}</p>}
          </li>
        ))}
      </ul>

      <ul className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
        {rest.map((a) => (
          <li key={a.title} className="flex flex-col gap-1 bg-white px-5 py-4">
            <span
              className={`w-fit rounded-full px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] ${
                TYPE_TONE[a.type] ?? "bg-slate-100 text-slate-700"
              }`}
            >
              {a.type}
            </span>
            <p className="mt-1 text-sm font-medium leading-snug text-slate-900">{a.title}</p>
            <p className="text-sm text-slate-500">
              {a.org}
              {a.year !== "—" ? ` · ${a.year}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- page ---------------------------------------------------------- */

export function Site({ layers }: { layers: SceneLayers }) {
  return (
    <div id="top" className="bg-[#F7FAF7] text-slate-800">
      <Nav />
      <Hero layers={layers} />

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        <Section
          id="work"
          eyebrow="Selected work"
          title="What I've built."
          lede="Enterprise platforms across banking, wealth and insurance, plus the automation that speeds my team up. Client work is under NDA — the reasoning is here in full, the protected specifics are not."
        >
          <div className="space-y-10">
            <Stats />
            <Work />
          </div>
        </Section>

        <Section
          id="journey"
          eyebrow="Journey"
          title="How I got here."
          lede="Every step as a decision, and what it produced."
        >
          <Journey />
        </Section>

        <Section
          id="skills"
          eyebrow="Toolkit"
          title="What I work with."
          lede="Grouped by where I use them. Highlighted are the ones I reach for first."
        >
          <Skills />
        </Section>

        <Section id="recognition" eyebrow="Recognition" title="Awards and certifications.">
          <Recognition />
        </Section>

        <Section id="experience" eyebrow="Experience" title="Where I've worked.">
          <div className="grid gap-4 sm:grid-cols-2">
            {experiences.map((e) => (
              <div key={e.company} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="font-semibold tracking-tight text-slate-900">{e.company}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {e.role} · {e.period}
                </p>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-600">{e.summary}</p>
                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  {e.impact.slice(0, 3).map((line) => (
                    <li
                      key={line}
                      className="flex gap-2.5 text-[0.95rem] leading-relaxed text-slate-600"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-500"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="contact" eyebrow="Contact" title="Let's build something.">
          {/* Forest, not slate. This is the page's one dark surface, and pulling
              its colour from the treeline in the hero ties the two ends of the
              page together. Neutral grey read as a default — because it was one.
              Lifted several steps from the near-black it started at, so it now
              reads as green rather than as black with a tint. */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1C4433] p-8 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_12%_0%,#2A6B4B_0%,#1E5138_45%,#123626_100%)]"
            />
            <div className="relative">
              <p className="max-w-xl text-balance text-2xl font-semibold leading-tight tracking-tight text-[#F1FAF4] sm:text-3xl">
                This is a snapshot. The real product is what we could build together.
              </p>
              <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-[#C8E3D3]">
                {profile.availability}. Based in {profile.location}.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="pressable inline-flex items-center rounded-full bg-[#7BD8A4] px-6 py-3 text-sm font-semibold text-[#0B1C15]"
                >
                  Email me
                  <Arrow />
                </a>
                <a
                  href={profile.resumeUrl}
                  className="pressable inline-flex items-center rounded-full border border-[#56876E] px-6 py-3 text-sm font-medium text-[#DCEFE4] transition-colors hover:border-[#7FB79A] hover:text-white"
                >
                  Resume
                  <Arrow />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#3A6550] pt-6">
                {profile.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="text-sm text-[#C3DCCE] underline-offset-4 transition-colors hover:text-[#7BD8A4] hover:underline"
                  >
                    <span className="text-[#A5C6B2]">{s.label}</span> {s.handle}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Section>

      </main>

      <footer className="mx-auto max-w-6xl px-5 pb-12 text-sm text-slate-400 sm:px-8">
        {profile.name} · {profile.location} · {profile.availability}
      </footer>
    </div>
  );
}
