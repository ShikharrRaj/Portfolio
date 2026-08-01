---
name: author-ui-spec
description: >
  Produces a ui-spec (design/ui-spec.md) — user flows, token usage, all interaction states per surface, responsive behavior, and WCAG-AA-by-design — precise enough that frontend-lead implements without inventing UX. Use when a feature has approved requirements and needs a designer-owned spec before UI code.
when_to_use: ui spec, design spec, interaction states, responsive behavior, token usage, WCAG AA design, handoff to frontend
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

## Purpose & Preconditions
Turn approved requirements into an implementation-ready ui-spec so the implementer writes UI
code without inventing UX. Preconditions before running:
- Requirements/PRD (or equivalent acceptance criteria) exist and are stable.
- The design-system token source and component inventory are locatable in-repo.
- The set of surfaces (screens/views/components) in scope is known or derivable from the flow.
If any precondition is missing → stop and escalate (do not assume UX).

## Inputs / Outputs (contract)
Inputs:
- Requirements/PRD + acceptance criteria — from `projects/<slug>/prd/` or the task brief.
- Token source of truth (theme/config) — grep the repo, do NOT hardcode values.
- Existing component inventory — the design system, for reuse-before-define.

Outputs:
- `design/ui-spec.md` — one document covering every in-scope surface. Structure:
  1. **Flows** — entry → steps → exit, incl. branch/error paths, per user goal.
  2. **Surfaces** — one section each; layout intent + responsive behavior + states.
  3. **Token usage** — the exact token names used (reuse before define), per surface.
  4. **States matrix** — every interaction state for every surface (see Steps).
  5. **Accessibility** — per-surface WCAG-AA decisions baked in, not deferred.
  6. **Open questions** — anything the implementer must NOT guess.

## Steps (deterministic, numbered)
1. **Read requirements.** Extract user goals + acceptance criteria as a bullet list. Any
   ambiguity that affects UX → add to Open questions; do not resolve by assumption.
2. **Locate tokens & components.** Grep/Glob the token source (color/spacing/type/radius/shadow)
   and the component inventory. Record exact names you will reference. Never invent style values.
3. **Enumerate surfaces.** List every screen/view/component in scope. Give each a stable ID
   (e.g. `S1-checkout-form`) used consistently across flows, states, and accessibility.
4. **Write flows.** For each user goal, document entry point → ordered steps → success exit,
   plus every branch (validation failure, empty data, permission-denied, cancel/back).
5. **Specify token usage per surface.** For each surface, list the tokens it consumes by name.
   Prefer an existing token/component; only propose a new one with an explicit rationale line
   (reuse before define — cite UI-10). Flag every proposed addition for design-system review.
6. **Fill the states matrix.** For EVERY surface, specify ALL of: default/idle, hover, focus,
   active/pressed, disabled, loading, empty, error, success, and (if applicable) selected and
   read-only. State what the user sees and what triggers the transition. No surface may omit a
   state without an explicit "N/A because…" note (cite UI-03). No dead ends.
7. **Specify responsive behavior.** For each surface describe layout mobile → tablet → desktop:
   what reflows, stacks, hides, or changes target size at each breakpoint. Mobile-first framing;
   define the smallest viewport first, then how it adapts up (cite UI-04).
8. **Bake in accessibility per surface.** For each surface record: semantic structure/landmarks,
   heading order, focus order + visible focus, keyboard operability, target sizing, contrast
   intent against the chosen tokens, and required ARIA/labels. WCAG-AA is a design input, not a
   later audit (cite UI-05). Note anything owned by the accessibility specialist for follow-up.
9. **Write ui-spec.md** in the Outputs structure. Reference surfaces by their stable IDs so
   flows, states, tokens, and a11y cross-link unambiguously.
10. **Run the Quality Gate** below. Fix or flag every failing item before returning.

## Decision Points
- If a needed token/component does not exist → propose an addition inline with rationale and
  flag it for design-system review; do NOT silently hardcode a raw value (UI-01/UI-10).
- If a surface legitimately lacks a state (e.g. no empty state for a static label) → write
  "N/A because …" explicitly rather than omitting it (keeps UI-03 auditable).
- If requirements are ambiguous or a UX decision has no basis in the brief → record it in Open
  questions and escalate; never invent UX to fill the gap.
- If scope spans surfaces owned by another design track → escalate for boundary resolution
  before writing, rather than speccing outside your lane.

## Quality Gate (inline pass/fail before returning)
- [ ] Every in-scope surface has a stable ID and appears in flows, states, tokens, and a11y.
- [ ] Every user goal has a flow with entry, ordered steps, exit, AND branch/error paths.
- [ ] States matrix covers default, hover, focus, active, disabled, loading, empty, error,
      success for every surface; any omission carries an explicit "N/A because…" (UI-03).
- [ ] Token usage lists tokens by name; no raw/hardcoded style values; each proposed new
      token/component has a rationale and a review flag (UI-01, UI-10).
- [ ] Responsive behavior defined mobile → tablet → desktop for every surface (UI-04).
- [ ] Per-surface accessibility decisions recorded (semantics, focus order, keyboard, targets,
      contrast intent, ARIA) — WCAG-AA by design, not deferred (UI-05).
- [ ] Open questions captured for every unresolved UX decision; none left to implementer guess.
- [ ] Output written to `design/ui-spec.md`.
Any unchecked box → fix it or move the item to Open questions and mark the return BLOCKED/ESCALATE.

## References (pointers by rule ID; never inline a standard)
- Token single-source-of-truth, no hardcoded values → cite `UI-01`.
- All interaction states per surface, no dead ends → cite `UI-03`.
- Mobile-first responsive behavior → cite `UI-04`.
- WCAG-AA accessibility as a design input → cite `UI-05`.
- Reuse existing components/tokens before defining new → cite `UI-10`.
- Rule text lives in `Knowledge/ui-guidelines.md`; reference by ID, never paste.
