/* =====================================================================
 *  PERSONAL OS — content layer
 *  ---------------------------------------------------------------------
 *  Every surface of the OS reads from this file. Edit content HERE,
 *  never in components (per CLAUDE.md convention 1).
 *
 *  INTEGRITY RULE (PRD R12/G5): every quantitative claim below traces to
 *  src/data/portfolio.ts, which traces to Shikhar's real record. Nothing
 *  here is invented. Fields awaiting his input are marked TODO and render
 *  as honest absences rather than placeholders.
 * ===================================================================== */

import { engineeringDecisions, experiences, profile, projects } from "./portfolio";

/* ------------------------------------------------------------------ */
/*  Modes — the visitor declares a lens (PRD R1)                        */
/* ------------------------------------------------------------------ */

export type SurfaceId =
  | "mission"
  | "timeline"
  | "models"
  | "cases"
  | "journal"
  | "corrections"
  | "collab";

export type ModeId =
  | "recruiter"
  | "founder"
  | "cto"
  | "engineer"
  | "investor"
  | "curious";

export type Mode = {
  id: ModeId;
  label: string;
  /** Shown on the boot screen — what this lens optimises for. */
  blurb: string;
  /** Mono line under the label. */
  meta: string;
  /** Surface order for this lens. Every mode ends on `collab`. */
  order: SurfaceId[];
};

export const modes: Mode[] = [
  {
    id: "recruiter",
    label: "Recruiter",
    blurb: "Impact, scope and trajectory first. The evidence a screen needs.",
    meta: "60–120s read",
    order: ["mission", "timeline", "cases", "models", "journal", "corrections", "collab"],
  },
  {
    id: "founder",
    label: "Founder",
    blurb: "What he has shipped, owned and had to defend under constraint.",
    meta: "products · execution · ownership",
    order: ["cases", "mission", "timeline", "corrections", "models", "journal", "collab"],
  },
  {
    id: "cto",
    label: "CTO",
    blurb: "Architecture judgment and the reasoning behind each call.",
    meta: "the deepest read",
    order: ["journal", "models", "cases", "corrections", "timeline", "mission", "collab"],
  },
  {
    id: "engineer",
    label: "Engineer",
    blurb: "Systems, trade-offs and technical depth. No proficiency bars.",
    meta: "peer review",
    order: ["models", "journal", "cases", "corrections", "timeline", "mission", "collab"],
  },
  {
    id: "investor",
    label: "Investor",
    blurb: "Track record and judgment — the person as the bet.",
    meta: "signal over surface",
    order: ["mission", "cases", "timeline", "corrections", "journal", "models", "collab"],
  },
  {
    id: "curious",
    label: "Curious Human",
    blurb: "No agenda. Start at the beginning and wander.",
    meta: "take your time",
    order: ["mission", "timeline", "corrections", "cases", "models", "journal", "collab"],
  },
];

export const surfaceMeta: Record<SurfaceId, { index: string; title: string; kicker: string }> = {
  mission: { index: "01", title: "Mission Control", kicker: "Live status" },
  timeline: { index: "02", title: "Timeline of Decisions", kicker: "Career as engineering choices" },
  models: { index: "03", title: "Mental Models", kicker: "How he thinks, not what he uses" },
  cases: { index: "04", title: "Case Files", kicker: "Work, opened up" },
  journal: { index: "05", title: "Decision Journal", kicker: "The reasoning, preserved" },
  corrections: { index: "06", title: "Corrections", kicker: "What he would do differently" },
  collab: { index: "07", title: "Start a Collaboration", kicker: "What are we building?" },
};

/* ------------------------------------------------------------------ */
/*  Boot sequence (PRD R1) — no hero                                    */
/* ------------------------------------------------------------------ */

export const boot = {
  lines: [
    "Connection established.",
    `Initializing ${profile.firstName} OS…`,
    "Indexing 9 shipped systems, 6 decisions, 2 institutions.",
    "Ready.",
  ],
  prompt: "Choose how you want to know me.",
  skip: "Skip — show me everything",
} as const;

/* ------------------------------------------------------------------ */
/*  Mission Control (PRD R2)                                            */
/*  CURATED AND DATED. Not live telemetry — see PRD decision D2.        */
/*  Update `asOf` whenever you touch these values.                      */
/* ------------------------------------------------------------------ */

export type Readout = {
  label: string;
  value: string;
  /** Optional second line. */
  note?: string;
  /** `signal` renders with the live indicator; `curated` is a static fact. */
  kind: "signal" | "curated";
};

export const missionControl = {
  asOf: "2026-08-01",
  cadence: "Updated weekly, by hand.",
  readouts: [
    {
      label: "Current role",
      value: experiences[0].role,
      note: experiences[0].company,
      kind: "curated",
    },
    {
      label: "Availability",
      value: "Open",
      note: profile.availability,
      kind: "signal",
    },
    {
      label: "Current obsession",
      value: "AI-assisted engineering",
      note: "Keeping engineers in the loop for taste and correctness.",
      kind: "curated",
    },
    {
      label: "Building this week",
      value: "Design-to-code pipeline",
      note: "Claude × Figma MCP — extending it past first-draft screens.",
      kind: "curated",
    },
    {
      label: "Learning",
      value: "Engineering management",
      note: "Moving from leading delivery to designing the org around it.",
      kind: "curated",
    },
    {
      label: "Latest ship",
      value: projects[0].title,
      note: projects[0].tagline,
      kind: "curated",
    },
    {
      label: "Energy",
      value: "High",
      note: "Self-reported. Not a sensor.",
      kind: "curated",
    },
    {
      label: "Based in",
      value: profile.location,
      note: profile.timezone,
      kind: "curated",
    },
  ] satisfies Readout[],
} as const;

/* ------------------------------------------------------------------ */
/*  Timeline of Decisions (PRD R3)                                      */
/*  Every step = decision + trade-off accepted + outcome.               */
/* ------------------------------------------------------------------ */

export type TimelineEntry = {
  year: string;
  title: string;
  decision: string;
  tradeoff: string;
  outcome: string;
};

export const timeline: TimelineEntry[] = [
  {
    year: "2018",
    title: "Chose Electronics over Computer Science",
    decision:
      "Read Electronics & Telecommunication at the University of Mumbai rather than take the direct software route.",
    tradeoff:
      "Four years without a formal software curriculum — every line of code had to be self-taught alongside the degree.",
    outcome:
      "A systems-level mental model of how machines actually work, and the habit of learning a discipline without being taught it.",
  },
  {
    year: "2022",
    title: "Built for the road, not the grade",
    decision:
      "Made the final-year project a real-time adaptive traffic system with YOLOv4 object detection instead of a safe academic exercise.",
    tradeoff:
      "Far more risk than a conventional project, in a domain — computer vision — that was not on the syllabus.",
    outcome:
      "Selected by CIIA (Institution's Innovation Council, MHRD, Government of India) as an innovation model.",
  },
  {
    year: "2022",
    title: "Entered banking technology first",
    decision:
      "Joined Axis Bank as Deputy Manager (IT) to learn large-scale, regulated systems before going near a startup.",
    tradeoff:
      "Slower innovation cycles and heavier process, deliberately accepted in exchange for fundamentals under real stakes.",
    outcome:
      "Shipped corporate banking modules where correctness and auditability are non-negotiable — Payments Maker/Checker, Payvantage, GIFT City, NCRP fraud.",
  },
  {
    year: "2023",
    title: "Crossed into the backend",
    decision:
      "Refused to stay a frontend specialist; took ownership of NestJS services and API integrations on Axis Neo.",
    tradeoff:
      "Gave up depth-in-one-thing for range, at the point where specialising would have been the easier career move.",
    outcome: "Backend performance improved by up to 36%; full-stack ownership of the platform.",
  },
  {
    year: "2024",
    title: "Automated the delivery path",
    decision:
      "Invested in automation testing and Jenkins CI/CD instead of shipping more features that quarter.",
    tradeoff:
      "Upfront pipeline cost paid from feature time — an unpopular trade in the moment.",
    outcome: "Testing efficiency up 18%; releases became routine rather than events.",
  },
  {
    year: "2025",
    title: "Left the bank for the agency floor",
    decision:
      "Moved to Rock Paper Scissors Studio as Tech Lead — from one large platform to many clients at speed.",
    tradeoff:
      "Traded institutional stability for delivery pressure across concurrent enterprise clients.",
    outcome:
      "Led delivery for Nuvama Wealth and Bajaj; team delivery consistency up 15–20%, turnaround 20–25% faster.",
  },
  {
    year: "2025",
    title: "Bet on AI as leverage, not replacement",
    decision:
      "Built a Claude × Figma MCP design-to-code pipeline rather than adopting AI tools ad hoc.",
    tradeoff:
      "Ongoing pipeline maintenance instead of one-off speed — only pays back across many screens.",
    outcome:
      "Development productivity up 25–30%, with engineers kept in the loop for correctness.",
  },
  {
    year: "Now",
    title: "Building toward engineering leadership",
    decision:
      "Moving deliberately from leading delivery to designing the organisation that delivers.",
    tradeoff:
      "Less time writing the hardest code personally; leverage measured through other people.",
    outcome: "In progress — this is the decision currently being made.",
  },
];

/* ------------------------------------------------------------------ */
/*  Mental Models (PRD R4) — organised by thinking, not technology.     */
/*  No proficiency scores: self-scored levels are banned under G5.      */
/* ------------------------------------------------------------------ */

export type MentalModel = {
  id: string;
  verb: string;
  premise: string;
  practice: string[];
  evidence: string;
  tools: string[];
};

export const mentalModels: MentalModel[] = [
  {
    id: "build",
    verb: "Build",
    premise: "Ship the smallest thing that proves the idea and can survive production.",
    practice: [
      "Start from the outcome — what problem, for whom, why now.",
      "Constraints shape the right architecture, not the ideal one.",
      "Optimise for change, not cleverness.",
    ],
    evidence:
      "Nine enterprise products shipped across banking, wealth and insurance in 3.6 years.",
    tools: ["TypeScript", "React", "Next.js", "Angular", "NestJS", "Java / Spring Boot"],
  },
  {
    id: "scale",
    verb: "Scale",
    premise: "Deliberate boundaries, independent scaling, and safety under failure.",
    practice: [
      "Modular services mapped onto real domains, not folders.",
      "Idempotent APIs; controls like maker/checker as first-class primitives.",
      "Isolate blast radius before optimising throughput.",
    ],
    evidence: "Backend performance up to +36% on Axis Neo, corporate banking.",
    tools: ["NestJS", "MySQL", "AWS", "Docker"],
  },
  {
    id: "lead",
    verb: "Lead",
    premise: "Multiply the team rather than maximise personal output.",
    practice: [
      "Architecture decisions, code review and sprint planning as the leadership surface.",
      "Mentor toward independence, not dependence.",
      "Align stakeholders before writing code, not after.",
    ],
    evidence:
      "Team delivery consistency +15–20%; production issues −15–20% through mentoring and standards.",
    tools: ["Code review", "Sprint planning", "Stakeholder alignment"],
  },
  {
    id: "automate",
    verb: "Automate",
    premise: "Turn the repeatable into pipelines so the team compounds its leverage.",
    practice: [
      "Automate the bottleneck, not the interesting part.",
      "AI accelerates; humans decide.",
      "Standardise pipelines as templates so every new service inherits them.",
    ],
    evidence:
      "Claude × Figma MCP pipeline: +25–30% productivity. Jenkins CI/CD: +18% testing efficiency.",
    tools: ["Claude", "Figma MCP", "Jenkins", "CI/CD"],
  },
  {
    id: "simplify",
    verb: "Simplify",
    premise: "Boring and predictable beats clever and fragile.",
    practice: [
      "Fewer moving parts to self-manage, especially under regulation.",
      "Choose the opinionated tool where standardisation matters more than freedom.",
      "Reduce iteration cycles by removing ambiguity, not by working faster.",
    ],
    evidence: "Iteration cycles cut ~15–18% by translating requirements before building.",
    tools: ["Angular", "Design systems", "Documentation"],
  },
  {
    id: "ship",
    verb: "Ship",
    premise: "Measure it, then improve the paths that actually matter.",
    practice: [
      "Instrument before optimising — let data decide what is next.",
      "Own the deploy; delivery is part of engineering.",
      "Latency, reliability and developer velocity are the paths worth tuning.",
    ],
    evidence:
      "UI and workflow efficiency up 12–33% across Axis Neo modules; end-to-end ownership of frontend deployments.",
    tools: ["Jenkins", "AWS", "Linux", "Git"],
  },
];

/* ------------------------------------------------------------------ */
/*  Case Files (PRD R5)                                                 */
/*  Derived from the real project record. `confidential` projects show  */
/*  the reasoning without disclosing protected specifics.               */
/* ------------------------------------------------------------------ */

export type CaseFile = {
  id: string;
  title: string;
  client?: string;
  year: string;
  classification: "NDA" | "OPEN";
  tagline: string;
  problem: string;
  constraints: string;
  architecture: string;
  decision: string;
  failed: string;
  worked: string;
  impact: string;
  today: string;
  stack: string[];
};

export const caseFiles: CaseFile[] = [
  {
    id: "axis-neo",
    title: "Axis Neo",
    client: "Axis Bank",
    year: "2022–2025",
    classification: "NDA",
    tagline: "Corporate banking platform — payments, cross-border and fraud.",
    problem:
      "Corporate banking needed scalable, reliable modules for payments, fraud and cross-border flows, where a wrong number is not a bug but an incident.",
    constraints:
      "Regulated environment. Correctness, auditability and reliability non-negotiable. Multiple concurrent modules, small team, continuous release pressure.",
    architecture:
      "Modular NestJS services mapped onto payment domains rather than technical layers. Idempotent APIs so retries are safe. Maker/checker modelled as a first-class primitive, not a UI convention. Jenkins CI/CD across every module.",
    decision:
      "Structure over speed. NestJS is heavier than a bare Express service, and that weight was the point — dependency injection and hard module boundaries let several people work on payment domains without colliding.",
    failed:
      "Pipeline investment was made later than it should have been. Releases were treated as events before they were treated as routine, and the cost of that showed up as manual verification time.",
    worked:
      "Domain-shaped module boundaries. When new requirements arrived, they landed inside an existing boundary instead of cutting across all of them.",
    impact:
      "Backend performance up to +36%. UI and workflow efficiency +12–33% across key modules. Testing efficiency +18%.",
    today:
      "Standardise the CI/CD pipelines as reusable templates from day one so every new service inherits them, rather than each module earning its pipeline separately.",
    stack: ["React", "NestJS", "TypeScript", "Jenkins", "CI/CD"],
  },
  {
    id: "claude-figma",
    title: "Claude × Figma Pipeline",
    year: "2025",
    classification: "OPEN",
    tagline: "Design-to-code automation across concurrent client projects.",
    problem:
      "Translating Figma designs into production code was the repetitive bottleneck across every client project — high volume, low judgment, expensive in engineer hours.",
    constraints:
      "Agency delivery pressure. Multiple clients in parallel. Output had to be production-grade, not a demo, and engineers had to stay accountable for what shipped.",
    architecture:
      "Claude integrated with Figma over MCP, automating the design-to-code path while holding engineers in the loop at the review boundary — the pipeline drafts, humans decide.",
    decision:
      "Automate the bottleneck, not the interesting part. The repetitive translation step was targeted deliberately; architecture and taste stayed human.",
    failed:
      "Pipeline maintenance is a real, ongoing cost. On a project with few screens it does not pay back — the economics only work across volume, which was not obvious at the start.",
    worked:
      "The 'AI accelerates, humans decide' boundary. Keeping review with engineers meant velocity rose without correctness falling.",
    impact: "Development productivity and efficiency up 25–30%.",
    today:
      "Extend the same pattern further across the SDLC rather than stopping at design-to-code — the boundary generalises better than the specific integration does.",
    stack: ["Claude", "Figma MCP", "TypeScript", "Automation"],
  },
  {
    id: "nuvama-rta",
    title: "Nuvama RTA",
    client: "Nuvama Wealth",
    year: "2025",
    classification: "NDA",
    tagline: "HNI portfolio tracking for a leading wealth manager.",
    problem:
      "Relationship teams needed a fast, reliable way to track High Net-worth Individual portfolios and activity, where latency directly costs client trust.",
    constraints:
      "Enterprise wealth client. Pixel-precision expectations from the design side, agency turnaround expectations from the delivery side, simultaneously.",
    architecture:
      "Responsive Angular application with a tight design-engineering loop and frontend deployment owned end-to-end by the engineering side.",
    decision:
      "Angular over React. For a large, long-lived app with multiple contributors and enterprise governance, opinionated structure and strong typing were worth more than iteration speed.",
    failed:
      "Early rounds still produced UI rework — the design-engineering loop was tightened reactively rather than being designed in from the first sprint.",
    worked:
      "Partnering with designers directly instead of receiving handoffs. Once the loop closed, rework dropped ~15%.",
    impact: "~20–25% faster turnaround; UI rework reduced by ~15%.",
    today:
      "Set up the design system and the review loop before the first screen, not after the first round of rework.",
    stack: ["Angular", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "green-corridor",
    title: "Green Corridor",
    year: "2022",
    classification: "OPEN",
    tagline: "Adaptive traffic regulation and emergency green corridors.",
    problem:
      "Emergency vehicles lose critical time in congested, statically-timed traffic — a scheduling problem with a human cost.",
    constraints:
      "Final-year project with no computer-vision curriculum behind it. Real-time inference on constrained hardware.",
    architecture:
      "YOLOv4 object detection over live traffic feeds, driving signal timing adaptively and clearing corridors on demand; Python data and ML stack.",
    decision:
      "Chose a genuinely hard, unfamiliar domain over a safe academic exercise — the point of the project was to learn something that was not being taught.",
    failed:
      "Real-time inference on unconstrained road footage was substantially harder than the controlled test cases implied. Detection quality degraded exactly where it mattered most.",
    worked:
      "The core insight — adapt signal timing to observed demand rather than to a fixed schedule — held up, and carried the project.",
    impact:
      "Selected by CIIA (Institution's Innovation Council, MHRD, Government of India) as an innovation model.",
    today:
      "Validate on messy real-world input before optimising the model. The gap between test footage and real roads was the whole problem.",
    stack: ["Python", "YOLOv4", "OpenCV", "scikit-learn", "NumPy"],
  },
];

/* ------------------------------------------------------------------ */
/*  Decision Journal (PRD R7) — sourced from the real decision log.     */
/* ------------------------------------------------------------------ */

export const journal = engineeringDecisions;

/* ------------------------------------------------------------------ */
/*  Corrections (PRD R6 — the Failure Archive surface)                  */
/*  ------------------------------------------------------------------ */
/*  INTEGRITY NOTE: these are real, self-authored revisions drawn from  */
/*  the decision log and case files. They are corrections, not the      */
/*  full failure archive the brief asks for.                           */
/*                                                                      */
/*  TODO (Shikhar): the archive earns its credibility from failures     */
/*  only you can write — a production incident, a leadership call that  */
/*  went wrong, a hire or a project that did not work. Add them to      */
/*  `failures` below. Per PRD D6 the surface stays in "corrections"     */
/*  mode until there are at least three substantive entries; a token    */
/*  archive is worse than none.                                        */
/* ------------------------------------------------------------------ */

export type Correction = {
  scope: "Architecture" | "Delivery" | "Product" | "Leadership";
  context: string;
  wouldChange: string;
};

export const corrections: Correction[] = [
  {
    scope: "Delivery",
    context: "Axis Neo — CI/CD was built per module, as each one needed it.",
    wouldChange:
      "Standardise pipelines as reusable templates from the start so every new service inherits them.",
  },
  {
    scope: "Architecture",
    context: "AWS — infrastructure grew before the guardrails did.",
    wouldChange:
      "Invest in IaC and cost guardrails earlier, so infrastructure stays boring and predictable.",
  },
  {
    scope: "Product",
    context: "Nuvama RTA — the design-engineering loop tightened only after rework appeared.",
    wouldChange: "Establish the design system and review loop before the first screen ships.",
  },
  {
    scope: "Architecture",
    context: "Green Corridor — the model was tuned against clean test footage.",
    wouldChange:
      "Validate against messy real-world input first; the gap between the two was the actual problem.",
  },
  {
    scope: "Architecture",
    context: "React work — architecture decisions were made per project.",
    wouldChange:
      "Lean harder into RSC/streaming and a design-system-first setup from day one instead of deciding each time.",
  },
];

/** Real failures, authored by Shikhar. Empty until he writes them — see the note above. */
export const failures: { title: string; what: string; learned: string }[] = [];

/* ------------------------------------------------------------------ */
/*  Collaboration (PRD R10) — intent first, contact second.             */
/* ------------------------------------------------------------------ */

export const collaborate = {
  question: "What are we building?",
  intents: [
    {
      id: "hire",
      label: "A team that needs leading",
      follow: "Engineering leadership, delivery ownership, or a first eng leader.",
    },
    {
      id: "product",
      label: "A product that needs building",
      follow: "Full-stack delivery, from architecture through to deployment.",
    },
    {
      id: "ai",
      label: "An AI workflow that needs to be real",
      follow: "Pipelines where AI accelerates and engineers stay accountable.",
    },
    {
      id: "talk",
      label: "Something else entirely",
      follow: "Say what it is. That works too.",
    },
  ],
  direct: profile.socials,
} as const;

/* ------------------------------------------------------------------ */
/*  The ending (PRD R11) — a statement, not a contact form.             */
/* ------------------------------------------------------------------ */

export const ending = {
  statement: "This portfolio is a snapshot.",
  counter: "The real product is what we could build together.",
  cta: "Start a conversation",
} as const;

/* ------------------------------------------------------------------ */
/*  Fourth wall (PRD R16)                                               */
/*  Rules encoded here, not in the component: silence is the default,   */
/*  never repeat within a session, stop permanently after two dismisses.*/
/* ------------------------------------------------------------------ */

export type Observation = {
  id: string;
  /** Only fires when this returns true. Ambiguous signal → no observation. */
  text: string;
};

export const observations = {
  /** Fires once, after sustained dwell on a single surface. */
  dwell: (surface: string) =>
    `You have been on ${surface} a while. Most people move faster than this.`,
  /** Fires when the visitor reaches the end without opening a case file. */
  skippedCases: "You reached the end without opening a case file. Bold move.",
  /** Fires when the visitor opens two or more corrections. */
  readCorrections:
    "You went straight for what went wrong. That is usually an engineering manager.",
  /** Fires when a visitor switches lens. */
  switchedMode: (label: string) => `Re-sorted for ${label}. Same facts, different order.`,
  /** Shown once if the visitor dismisses twice. */
  stopped: "Understood — I'll stop narrating.",
} as const;
