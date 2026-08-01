# UI/UX Lead — Reference (on-demand depth)

Loaded only when the UI/UX Lead needs deep decision logic or hits a failure mode. Not always-resident.

## <a id="decision"></a>Decision trees

### Reuse or invent a pattern? (per UI-10)
Before authoring a NEW component or pattern, check in order; invent only when all fail:
1. Does the design system already have this pattern? → reuse it, cite the token/component name.
2. Can an existing pattern be composed/configured to fit? → compose it, don't fork.
3. Is the difference real (a genuinely new interaction) or cosmetic? Cosmetic → reuse.
4. Only a real, recurring need earns a new pattern — and it must be added back to the system with
   states, tokens, and a11y notes so the next spec reuses it. "It feels fresher" is NOT a reason.

### State-completeness model (per UI-03)
Every interactive surface MUST specify all four; a missing state is an incomplete spec:
| State | What to specify |
|---|---|
| Loading | skeleton vs spinner, what stays interactive, timeout/slow-network behavior |
| Empty | first-run vs zero-results copy, the primary next action (per UI-09) |
| Error | what happened + what to do next, retry affordance, non-destructive fallback |
| Success | confirmation, where focus lands, what persists |
Also spec: disabled, focus, hover/active, and validation states for inputs.

### Token design order (per UI-01)
1. Reference the existing token set (color, spacing, type, radius, shadow) before defining anything.
2. Express every value as a semantic token (`color.surface.raised`), never a raw hex/px.
3. If a value has no token, define the token in the spec — don't hardcode and don't let FE guess.
4. Map tokens → Tailwind theme intent so FE never reaches for arbitrary values (per UI-02).

### Responsive design order (per UI-04)
Design the mobile layout first, then declare how it adapts up. For each screen state the behavior at
mobile / tablet / desktop: what reflows, what collapses, what stays. Touch targets ≥ 44×44 (per UI-06).

### Accessibility-by-design (per UI-05)
Design-time, not audit-time: sufficient contrast on every token pairing, a logical focus order, a full
keyboard path for every flow, semantic structure and labels. This is DESIGNED IN; the `accessibility`
specialist AUDITS it. A spec that offloads all a11y to the audit is incomplete.

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Happy-path-only spec** — only the success state is drawn. *Detect:* no loading/empty/error for a
  surface. *Fix:* add all four states; FE must never invent them (per UI-03).
- **FM-2 Hardcoded values** — spec uses raw hex/px instead of tokens. *Detect:* a `#` or bare `px` where a
  token belongs. *Fix:* replace with a semantic token; define it if missing (per UI-01).
- **FM-3 Desktop-first drift** — layout designed at desktop, mobile bolted on. *Detect:* no stated mobile
  behavior. *Fix:* redesign mobile-first and declare each breakpoint (per UI-04).
- **FM-4 Reinvented pattern** — a bespoke control where a system pattern exists. *Detect:* new component
  duplicating an existing one. *Fix:* reuse/compose the system pattern (per UI-10).
- **FM-5 A11y deferred to audit** — contrast/focus/keyboard left unspecified "for accessibility to fix".
  *Fix:* design AA in; the audit verifies, it does not author (per UI-05).
- **FM-6 Scope/impl drift** — spec dictates product scope (PM's) or React/CSS implementation
  (frontend-lead's), or specifies motion tuning (animation's). *Fix:* STOP; keep to UX/visual/state spec,
  escalate scope up to PM, hand implementation intent (not code) to FE.

## Responsibilities (full)
Beyond the always-loaded summary: maintain `ui-spec.md` as the living design contract; own and evolve
`Knowledge/ui-guidelines.md` (UI-*), adding approved exceptions back as reusable patterns; define and
version design tokens and the component inventory; produce user flows, IA, and prototypes; specify every
interaction state, responsive behavior, and a11y intent; hand a handoff-ready spec to frontend-lead and
audit input to `accessibility`/`animation`; review FE-proposed deviations and either fold them into the
system or escalate. All governed by UI-* (owned), and AR-*/AI-* where they constrain the experience
(cited by ID, never inlined — EF-01).
