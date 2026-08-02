# PRD — Personal OS (`personal-os`)

> Status: **approved** · Owner: product-manager · Stage 1/15 (`playbooks/software-factory.md`)
> Branch: `4th--Wall` · Raw request: CEO brief, 2026-08-01 (verbatim in `raw-request.md`)
> Consumed-by: research, engineering-manager, staff-architect, uiux-lead

---

## 1. Problem

Shikhar is evaluated for senior engineering-leadership and founding-engineer roles by people who
decide in under two minutes, using artifacts that show *what he has used* rather than *how he
decides*. The current portfolio is a single-scroll list of sections — role, skills, projects — which
is indistinguishable from thousands of others and answers none of the questions a CTO or founder
actually screens on: judgment under constraint, ownership of failure, and the ability to design
systems and organizations.

The business outcome: convert passive views into qualified inbound conversations, and convert
readers into forwarders. A portfolio that is *explored* for minutes and *sent to a colleague* is
worth more than one that is skimmed, because the forwarding recruiter or founder is a warm channel
into a hiring loop that a resume cannot open.

## 2. Target users

Named and bounded. The six entry modes map to P1–P6; P6 is deliberately included because amplifiers
drive reach, not conversion.

| ID | Persona | Bound | Screening intent | Typical first pass |
|---|---|---|---|---|
| **P1** | Technical recruiter / talent partner | Screening for senior, staff, or eng-leadership roles at product companies | Impact, scope, tenure, credible seniority signals | 60–120s |
| **P2** | Founder / hiring CEO (seed–Series B) | Evaluating for founding engineer or first eng leader | Ownership, execution velocity, product instinct | 2–4 min |
| **P3** | CTO / VP Engineering | Evaluating a report or peer at staff+ level | Architecture judgment, trade-off reasoning, how he leads | 4–10 min (deepest reader) |
| **P4** | Senior / staff engineer peer | Assessing technical credibility, often pre-interview | Technical depth, honesty about failure | 3–6 min; **highest share propensity** |
| **P5** | Investor / angel | Evaluating the person as a bet, usually via a warm intro | Judgment, track record, systems thinking | 2–5 min |
| **P6** | Curious human | Peer, student, ex-colleague; no hiring intent | Story, personality, craft | Highly variable; **amplifier** |

**Explicitly out of scope as users:** non-technical general public, agency/client procurement,
and SEO-driven anonymous search traffic. The site is optimized for a named, referred visitor —
not for organic discovery volume.

## 3. Goals & success metrics

The current site is **un-instrumented**, so R15 ships first and the 14 days of production traffic
immediately preceding launch establish baselines **B1–B4**. Where a capability does not exist today,
the baseline is 0 by definition. Targets are measured over the 60 days following launch.

| ID | Goal | Metric | Baseline | Target |
|---|---|---|---|---|
| **G1** | Visitors investigate rather than skim | Median engaged session duration (active tab, scroll/input in window) | **B1** — current site, 14-day median (planning assumption: 45–75s) | **≥ 4:00** for visitors who select a mode |
| **G2** | The portfolio gets forwarded | Share of sessions arriving via direct/unknown referrer within 7 days of a prior session from another network | **B2** — current site, 14-day rate | **≥ 2× B2** |
| **G3** | Qualified conversations start | Collaboration flows completed by P1–P3 and P5 visitors per 100 sessions | **0** (no adaptive contact flow exists) | **≥ 3 per 100** mode-selecting sessions |
| **G4** | Depth is reached, not just entered | Share of sessions opening ≥ 1 Case File **and** ≥ 1 Failure Archive entry | **0** (sections do not exist) | **≥ 25%** of mode-selecting sessions |
| **G5** | Every claim is defensible | Count of user-visible quantitative claims lacking a source annotation in the content layer | Unknown on current site; **measured and driven to 0 at launch** | **0**, enforced at every release |

### Failure metrics (tracked with equal weight — per the stage-1 business-alignment gate)

| ID | Failure signal | Threshold that triggers a rollback decision |
|---|---|---|
| **F1** | The entry gate repels | > 35% of sessions leave the mode screen without choosing, or within 15s |
| **F2** | The fourth wall reads as creepy or gimmicky | Any qualitative report from a P1–P3 visitor, or > 5% dismissal rate on observation messages |
| **F3** | Mobile collapses | Median mobile engaged duration < 50% of desktop |
| **F4** | Depth is theatre | ≥ 60% of sessions select a mode but open zero Case Files |
| **F5** | Weight kills it | Real-device LCP on mid-tier mobile > 2.5s at p75 |

**F2 is the defining risk of this product.** The brief's own instruction — "subtle, intelligent, and
never cringe" — is a quality bar, and it is the one bar that cannot be verified by a linter. It is
carried into R16 acceptance criteria and is a named design-guardian gate at stage 8.

## 4. Requirements

Each requirement is a user outcome. CEO-specified mechanisms (Cmd+K, terminal, Framer Motion, the
palette) are recorded in §6 as constraints, not restated here — per the prd-intake contract.
MoSCoW is a **sequencing recommendation**; nothing in the brief is deleted, and Should/Could items
remain in scope for the release unless the CEO or EM cuts them at stage 3.

---

### R1 — Declare your lens · **Must**
A visitor states who they are, and the system reorders itself so the evidence that matters to that
persona comes first.

- **Given** a first-time visitor, **when** the site loads, **then** they are asked how they want to
  know Shikhar, with the six modes (P1–P6) presented as equals and no default pre-selected.
- **Given** a visitor selects a mode, **when** the OS assembles, **then** the ordering of surfaces
  reflects that mode's screening intent, and the visitor can see which mode is active at all times.
- **Given** a visitor wants a different lens, **when** they switch mode, **then** the OS reorders
  without a full reload and without losing their place in the surface they were reading.
- **Empty:** a visitor who never chooses — the OS proceeds on a neutral ordering after a bounded
  wait; nothing is gated behind the choice.
- **Error:** stored preference is unreadable or corrupt — the OS falls back to neutral ordering
  silently, never a blank screen or an error dialog.
- **Edge:** returning visitor with a stored mode — restored without re-asking, and reversible in one
  action. Deep link into a surface — honored; the mode question never blocks the linked content.
- **Edge:** a visitor arrives with JavaScript disabled or failed — the full content is still
  readable in a linear order (per R13).

### R2 — Mission Control · **Must**
A visitor sees what Shikhar is doing *right now*, and can tell the difference between a living
signal and a static claim.

- **Given** any visitor, **when** they reach Mission Control, **then** they see current role, current
  focus, what is being built this week, what is being learned, availability, and most recent ship.
- **Given** any status value, **when** it is displayed, **then** it carries a visible "as of" date so
  freshness is self-evident rather than implied.
- **Empty:** a field with no current value renders as an honest absence, never a placeholder or a
  filler string.
- **Error:** if any field is ever sourced from a live feed that fails, the last known value is shown
  with its date; the surface never fabricates a value or shows a broken widget.
- **Edge:** content older than 30 days is visibly marked stale rather than presented as current.
- **Note (product decision, see §7 D2):** ambient-flavour fields such as energy level and coffee
  consumed are permitted **only** as manually curated, dated values. Simulated telemetry that implies
  live measurement is prohibited under G5.

### R3 — Timeline of Decisions · **Must**
A visitor reads the career as a sequence of decisions with costs, not a list of jobs.

- **Given** a visitor on the timeline, **when** they open any career step, **then** they see the
  decision taken, the trade-off accepted, and the outcome that followed.
- **Given** a step with a negative or mixed outcome, **when** it is shown, **then** it is stated as
  plainly as a positive one.
- **Empty:** a period with no defensible decision is omitted entirely rather than padded.
- **Error / edge:** the timeline reads correctly at any viewport and in linear DOM order for
  assistive technology; no step's meaning depends on its spatial position alone.

### R4 — Mental Models · **Must**
A visitor understands how Shikhar thinks before seeing what he has used.

- **Given** a visitor, **when** they reach this surface, **then** capabilities are organised by mode
  of thinking (build, scale, lead, automate, simplify, ship), not by technology.
- **Given** a visitor opens a model, **when** it expands, **then** it resolves to concrete evidence:
  named technologies, real projects, specific examples.
- **Empty:** a model with no supporting evidence is not shown.
- **Edge:** the surface never renders as a proficiency bar, percentage, or star rating — self-scored
  proficiency is prohibited under G5.

### R5 — Case Files · **Must**
A visitor can interrogate a real piece of work at the depth a hiring CTO would.

- **Given** a visitor opens a case file, **when** it renders, **then** it presents problem,
  constraints, architecture, decisions, what failed, what worked, business impact, and what he would
  do differently today.
- **Given** a case file under NDA, **when** it renders, **then** the confidentiality boundary is
  explicit and the reasoning is still legible without disclosing protected specifics.
- **Given** a quantitative impact claim, **when** it is shown, **then** it carries its measurement
  basis (per G5).
- **Empty:** a case file missing the failure or the trade-off section is not publishable — those two
  sections are the point of the surface.
- **Error:** an unavailable diagram degrades to its textual explanation; the case remains complete.
- **Edge:** deep-linkable and readable standalone, without the surrounding OS chrome.

### R6 — Failure Archive · **Must**
A visitor sees what went wrong and what was learned, told first-person and without deflection.

- **Given** a visitor, **when** they open the archive, **then** they find real failures across
  product, architecture, and leadership, each with the lesson that followed.
- **Given** any entry, **when** it is written, **then** it names the decision and its consequence
  without attributing the failure to a third party.
- **Empty:** fewer than three substantive entries means the surface ships hidden rather than thin —
  a token archive damages the credibility it exists to build.
- **Edge:** no entry may expose a former employer's confidential specifics or name an individual.

### R7 — Decision Journal · **Must**
A visitor can inspect the reasoning behind specific technical choices.

- **Given** a visitor, **when** they open an entry, **then** they see the question, the alternatives
  considered, the reasoning, and — where applicable — whether the decision still holds today.
- **Given** a decision later reversed, **when** it is shown, **then** the reversal and its cause are
  stated in the same entry.
- **Empty:** an entry without a real alternative considered is an opinion, not a decision, and is
  not published.
- **Edge:** entries are individually addressable so a single decision can be linked in a discussion.

### R8 — Grounded reflection · **Must**
A visitor asks open questions about Shikhar and receives answers drawn strictly from his own
published content, with the boundary made explicit.

- **Given** a visitor asks a question covered by the content, **when** it is answered, **then** the
  answer is traceable to the source surface and the visitor can navigate to it.
- **Given** a question outside the content, **when** it is asked, **then** the system says it does
  not know and offers the nearest covered topic — it never speculates about opinions, salary,
  availability terms, or third parties.
- **Given** any visitor, **when** they use the feature, **then** its nature is stated honestly; it is
  never dressed as a general-purpose chatbot (per §6 C4).
- **Empty:** an empty or single-character query prompts rather than searches.
- **Error:** retrieval failure states plainly that it failed and offers search (R9) as the fallback.
- **Edge:** adversarial input — prompt-injection-shaped text, abuse, or attempts to extract
  instructions — returns the standard no-answer response and is never echoed back into the page.

### R9 — Find anything from anywhere · **Must**
A visitor moves to any part of the system directly, without navigating a hierarchy.

- **Given** a visitor anywhere in the OS, **when** they invoke search, **then** they can reach
  surfaces, case files, decisions, technologies, external profiles, and Resume from one input.
- **Given** a query with no match, **when** results resolve, **then** an actionable empty state
  offers the closest available topics.
- **Error:** if the index fails to build, the entry point is hidden rather than shown broken.
- **Edge:** fully keyboard-operable end to end, and reachable on touch devices without a keyboard.

### R10 — Start a collaboration · **Must**
A visitor states what they want to build, and the response adapts to that intent.

- **Given** a visitor with intent, **when** they begin, **then** they are asked what they are
  building before being asked for their contact details.
- **Given** their stated intent, **when** the flow adapts, **then** what is asked next reflects that
  intent rather than a fixed form.
- **Given** a completed flow, **when** it is submitted, **then** the visitor gets an unambiguous
  confirmation and a direct fallback channel.
- **Empty:** a visitor who wants to skip straight to email always has a visible direct route.
- **Error:** submission failure preserves everything entered and surfaces the direct channel; input
  is never silently lost.
- **Edge:** the flow is completable on mobile in one hand.

### R11 — The closing statement · **Must**
A visitor leaves with a statement about what could be built together, not a contact form.

- **Given** a visitor reaching the end of any mode's arc, **when** the final surface renders,
  **then** it makes a forward-looking statement and offers exactly one primary way to begin.
- **Edge:** the ending is reachable in every mode, including one where the visitor jumped via search.

### R12 — Every claim is defensible · **Must**
A visitor encounters no number, testimonial, or credential that cannot be substantiated.

- **Given** any user-visible metric, **when** it is rendered, **then** its source or measurement
  basis exists in the content layer.
- **Given** a claim that cannot be sourced, **when** the release gate runs, **then** it blocks the
  release.
- **Empty:** no placeholder testimonials, no invented logos, no fabricated endorsements — at any
  point, including during development.
- **Edge:** tenure and seniority language must match verifiable history exactly.

### R13 — Usable by everyone, calm by default · **Must**
A visitor using assistive technology, a keyboard, or with motion sensitivity gets the same
information and the same narrative.

- **Given** a keyboard-only visitor, **when** they traverse the OS, **then** every interactive
  surface is reachable and operable with a visible focus state.
- **Given** a visitor with a reduced-motion preference, **when** the OS renders, **then** motion is
  reduced to state changes only, and no content is hidden or gated behind an animation.
- **Given** a screen-reader user, **when** modes reorder content, **then** the change is announced
  and reading order matches the visual order.
- **Empty / error:** no surface may depend on an animation completing in order to become readable.
- **Edge:** WCAG 2.2 AA contrast holds on every surface in the palette, including the accents.

### R14 — Fast on a real phone · **Must**
A visitor on mid-tier mobile hardware reaches meaningful content quickly.

- **Given** a mid-tier mobile device on a throttled connection, **when** the site loads, **then**
  first meaningful content appears without waiting for the full experience layer.
- **Given** any surface, **when** it animates, **then** it holds a smooth frame rate on that device.
- **Empty / error:** if the experience layer fails to load, the content layer still renders and is
  navigable.
- **Edge:** numeric budgets are set by staff-architect at stage 4 and enforced by performance at
  stage 10. See §7 A1 — the mandated motion stack is in tension with this requirement.

### R15 — The system can be judged · **Must** · *ships first*
The CEO can tell whether this rebuild worked.

- **Given** the current site, **when** instrumentation lands, **then** B1–B4 accumulate for 14 days
  before launch.
- **Given** the new site, **when** a visitor uses it, **then** mode selection, surface depth, case
  file opens, collaboration starts, and all F1–F5 failure signals are measurable.
- **Edge:** analytics must not require consent-gated tracking that would itself damage the
  experience; measurement is aggregate and non-identifying.

### R16 — The system notices you · **Must** *(CEO-selected: full behavioural mode)*
A visitor feels the interface is aware of their exploration, in a way that reads as intelligence
rather than surveillance.

- **Given** a visitor's exploration pattern, **when** the system observes something genuinely
  notable, **then** it may remark on it — informed by dwell, skipped surfaces, and revisits.
- **Given** any observation, **when** it is shown, **then** it is dismissible, never blocks content,
  and never repeats within a session.
- **Given** a visitor who dismisses two observations, **when** they continue, **then** the system
  stops observing for that session. Declining is permanent for that visitor.
- **Given** a reduced-motion or assistive-technology visitor, **when** observations occur, **then**
  they are delivered non-disruptively and never steal focus.
- **Empty:** when nothing notable has happened, the system says nothing. Silence is the default.
- **Error:** if the observation is based on ambiguous signal, it is not shown — a wrong observation
  is worse than no observation.
- **Edge:** observations must never state or imply that personal data is stored or transmitted; all
  signal stays on the device. Copy must survive the F2 test — reviewed as a named design-guardian
  gate before QA.

### R17 — Architecture Lab · **Should**
A visitor explores a system Shikhar designed and understands why it is shaped that way.

- **Given** a visitor in the lab, **when** they select a component, **then** they learn its purpose
  and the trade-off it represents.
- **Empty:** a diagram without explained trade-offs is decoration and is not shipped.
- **Error:** interactive failure degrades to a static diagram plus its text.
- **Edge:** every diagram has a textual equivalent conveying the same relationships (per R13).

### R18 — Terminal · **Could**
A visitor who prefers a command interface can navigate the OS that way.

- **Given** a visitor issuing a supported command, **when** it runs, **then** it returns real content
  from the system, not a scripted performance.
- **Empty / error:** unknown commands suggest valid ones; the terminal always offers a way out.
- **Edge:** it must not be the only route to any content (per R13). If it cannot be genuinely useful,
  it is cut rather than shipped as a gimmick — the brief's own standard: "Not a gimmick."

### Won't-now
- **Sound design** — brief marks it optional; excluded from this release. Revisit post-launch.
- **A server-backed LLM assistant** — CEO decision D1 (§7). R8 is retrieval-only.
- **Multi-language, CMS-authored content, blog engine** — not requested, not implied.

---

## 5. Non-goals

Restated from the brief and binding on every downstream role:

- Not a traditional portfolio, landing page, or resume website.
- Not an AI-startup clone; no AI-brand visual language.
- Not cyberpunk, neon, or gaming UI.
- No generic glassmorphism, no purple/blue AI gradients.
- No particle spheres, no floating code snippets.
- No conventional developer-portfolio patterns.
- Not optimized for anonymous organic search volume (§2).
- Not a general-purpose chatbot (R8).

## 6. Constraints & assumptions

**C1 — Visual direction.** Palette is CEO-fixed: background `#0F1115`, surface `#1A1D24`, elevated
`#232833`, primary text `#F8F7F4`, secondary `#9CA3AF`, muted `#6B7280`, primary accent `#2F855A`,
secondary accent `#68D391`, warm accent `#C08A5B`. Gradients used sparingly. Tokenised per UI-01 and
UI-02; no arbitrary values. **This supersedes the INK & OXIDE direction on `eos-setup`** — see §7 D3.

**C2 — Typography.** A modern grotesk for UI, a refined serif for storytelling, monospace for
engineering content. Selection and licensing belong to uiux-lead at stage 6, within the R14 budget.

**C3 — Motion.** CEO mandates Framer Motion, GSAP, and Lenis. Motion must communicate state, per
UI-07 for reduced-motion parity. Payload tension is flagged as A1.

**C4 — The assistant is retrieval, not generation.** CEO decision D1. No LLM call, no API key, no
server route. Client-side retrieval over the curated corpus only. It must be described to visitors
honestly; presenting retrieval as generative reasoning would violate G5 and the AI-* guidelines.

**C5 — Interaction states.** Every interactive surface covers loading, empty, error, and success,
per UI-03.

**C6 — Public-surface configuration.** Anything reaching the browser must use the public env prefix,
per TS-24. Nothing secret exists in this project by construction (C4).

**C7 — Analytics.** Instrumentation follows a typed event catalogue, per TS-36; ad-hoc events are
not permitted.

**C8 — Content lives in the data layer.** All copy in `src/data/`, never hardcoded in components —
per the project convention in `CLAUDE.md`.

**A1 — Assumption, flagged as the principal technical risk.** The mandated motion stack (C3) plus
interactive diagrams (R17) is in direct tension with R14. The prior build on `eos-setup` cut
first-load JS from 233kB to 128kB *by removing the motion layer entirely*. Reintroducing three
motion libraries will not fit that budget. Resolving this — which libraries genuinely earn their
weight, what loads lazily, what the numeric budget becomes — is a **staff-architect decision at
stage 4 with an ADR**, not a PM decision. It does not block PRD approval.

**A2.** Existing content on `eos-setup` covers a substantial share of R5, R7, R4, and R8's corpus
(`caseStudies`, `journey`, `principles`, `aiPractice`, `aiKnowledge`, `src/lib/askRetrieval.ts`).
The build branches from `main`, which does **not** contain it. Porting that content is a stage-7
input; content that does not survive the R12 gate is rewritten or dropped, not carried over.

**A3.** Baselines B1–B4 do not exist yet. If the CEO launches before the 14-day window completes,
G1–G4 become directional rather than measured, and that trade is the CEO's to make.

**A4.** `main` currently runs Next 14 / React 18 / Tailwind 3. Whether this rebuild upgrades that
stack is a staff-architect decision at stage 4, per TS-15.

## 7. Decisions taken (open-questions log — driven to zero)

| ID | Question | Resolution | Decided by |
|---|---|---|---|
| **D1** | Is the AI assistant a real LLM or client-side retrieval? | **Client-side retrieval**, reusing the existing corpus and retrieval library. No key, no backend, cannot hallucinate about the CEO. | CEO, 2026-08-01 |
| **D2** | Do Mission Control ambient fields imply live telemetry? | **No.** Manually curated and dated only. Simulated live data would violate G5 — the same integrity failure already remediated once on this project. | PM |
| **D3** | Does this supersede the approved INK & OXIDE / BOLD direction? | **Yes, visually.** The CEO specified a new palette in the brief. INK & OXIDE remains intact on `eos-setup`; nothing is deleted. | CEO, 2026-08-01 |
| **D4** | Which codebase is the base? | **`main`, rebuilt in place**, on branch `4th--Wall`. Prior work preserved in history at `4032166`. | CEO, 2026-08-01 |
| **D5** | How far does the fourth wall go? | **Full**: mode system plus behavioural observation, bounded by the R16 consent and silence rules. | CEO, 2026-08-01 |
| **D6** | Is a thin Failure Archive acceptable at launch? | **No.** Below three substantive entries it ships hidden. A token archive is worse than none. | PM |
| **D7** | Are Architecture Lab and Terminal in the release? | Both remain in scope; sequenced **Should** and **Could** so R1–R16 cannot be starved. EM may re-sequence at stage 3; only the CEO may cut. | PM |

*No open questions remain. Technical and design forks (A1, A4, C2) are recorded as constraints for
staff-architect and uiux-lead and do not block approval — per the prd-intake contract.*

## 8. Handoff

**Produces:** `prd-approved` → `projects/personal-os/prd/PRD.approved.md`

**HANDOFF-TO**, in playbook stage order:
1. `research` — validate A1 (motion payload vs R14) and C2 (typeface licensing/weight) before architecture commits.
2. `engineering-manager` — delivery-plan; arbitrate D7 sequencing; decide whether stage 2 is skipped.
3. `staff-architect` — architecture-spec + **ADR required for A1**, plus A4 (stack) and the R14 numeric budgets.
4. `uiux-lead` — ui-spec; owns C1/C2 realisation and the R16 copy register, which is the F2 risk surface.
5. `design-guardian` — R16 tone is a named gate at stage 8; no UI passes to QA unapproved.

**Gate note for EM:** this PRD is large. It is one product, but R1–R16 is not one increment. A
staged release — content and integrity layer first, experience layer second — is the recommended
delivery shape, and is the EM's call at stage 3.
