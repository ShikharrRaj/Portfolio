# UI Guidelines

> Status: canonical (v0.2) · Owner: uiux-lead · Consumed-by: frontend-lead, accessibility, animation, seo
> Cited as `per UI-NN`.

## Rules

### Tokens & theming
- **UI-01** Design tokens are the single source of truth for color, spacing, type, radius, shadow. No hardcoded style values in components.
- **UI-02** Tailwind utilities map to tokens (theme config); arbitrary values (`[#f00]`) are a review failure.
- **UI-11** Color tokens are semantic, not literal: reference by role (`bg-surface`, `text-danger`), never by hue (`bg-slate-800`). Raw palette values live only in the token layer.
- **UI-12** Dark and light themes are both first-class. Every semantic color token defines a value in each theme; components never hardcode a theme. Theme switches via a single root attribute/class, no per-component branching.
- **UI-13** Elevation is a token scale (`shadow-0..4`), not ad-hoc box-shadows; higher elevation = higher surface in the z-hierarchy, consistent across themes.

### Typography & spacing
- **UI-14** Type follows a fixed modular scale (token per step, e.g. `text-xs..4xl`); no off-scale font sizes. Each step pairs a line-height and weight token.
- **UI-15** One display/body typeface family per surface (heading + body max); font families are tokens loaded with `font-display: swap` and a fallback stack.
- **UI-16** Body text ≥ 16px, line-height ≥ 1.5, measure 45–80ch; never justify body copy.
- **UI-17** Spacing uses one base unit (4px) scale; all margin/padding/gap are token steps. No off-scale pixel spacing.
- **UI-18** Layout uses flex/grid with token gaps for rhythm; avoid margin-based spacing between siblings where a gap applies.

### Iconography
- **UI-19** Icons come from one approved set at token sizes; no mixing icon libraries. SVG only, `currentColor` fill so they inherit text color.
- **UI-20** Icons are decorative or meaningful, declared as such: decorative icons are `aria-hidden`; meaningful icons carry an accessible label. Icon-only controls always have an accessible name.

### Components & states
- **UI-03** Every interactive surface has explicit **loading, empty, error, and success** states. No dead ends.
- **UI-08** Components are composable, prop-driven, and stateless where possible; no business logic in presentation components.
- **UI-10** Consistency over novelty: reuse existing design-system components before creating new ones.
- **UI-21** Component APIs are predictable: variant/size are enumerated props (not booleans that combine ambiguously), controlled inputs pair `value`+`onChange`, and every component forwards `className` and `...rest` to its root for composition.
- **UI-22** Interactive components implement every applicable state — default, hover, focus-visible, active, disabled, loading, selected/checked, error — visually distinct and token-driven. No state is left to the browser default.
- **UI-23** Loading uses skeletons that match final layout (not spinners) for content regions; preserve layout to prevent cumulative layout shift. Spinners only for indeterminate in-place actions.
- **UI-24** Empty states are designed, not blank: they explain the absence and offer the primary next action.
- **UI-25** Error states are recoverable and scoped: surface at the failure point (inline > toast > page), state cause + remedy, and offer retry. Never a raw stack trace or opaque code alone.

### Forms & validation
- **UI-26** Every input has a persistent visible `<label>` (placeholders are never labels); related fields are grouped with `fieldset`/`legend`.
- **UI-27** Validate on blur and on submit, not on every keystroke; show success/error inline adjacent to the field, tied via `aria-describedby`, with error text plus a non-color cue.
- **UI-28** Submit actions disable + show progress to prevent double-submit; on failure, preserve user input and focus the first errored field.

### Motion & accessibility
- **UI-05** Accessibility is non-negotiable: WCAG 2.2 AA minimum — contrast, focus states, keyboard nav, semantic HTML, ARIA where needed (owned by `accessibility`).
- **UI-06** Touch targets ≥ 44×44px; visible focus ring on all focusable elements.
- **UI-07** Motion respects `prefers-reduced-motion`; micro-interactions 200–300ms; motion communicates, never decorates (owned by `animation`).
- **UI-29** Motion uses token durations + easing curves; entrances ease-out, exits ease-in. Animate only compositor-friendly properties (transform/opacity); never animate layout properties in loops.
- **UI-30** Focus is managed on route/modal/drawer changes: move focus to the new context, trap it within modals, restore it to the trigger on close. No focus loss to `<body>`.

### Responsive & i18n
- **UI-04** Mobile-first and responsive by default; verified at mobile / tablet / desktop breakpoints.
- **UI-09** Copy is clear, consistent, and action-oriented; error messages say what happened and what to do next.
- **UI-31** Breakpoints are shared tokens; design to content, not device names. Layouts reflow (no horizontal scroll, no fixed pixel widths that overflow small viewports).
- **UI-32** i18n-ready: all user-facing strings are externalized (no concatenation), layouts tolerate ±40% text expansion, and directional CSS uses logical properties (`inline-start`/`block-end`) so RTL works without rewrites. Format dates/numbers/currency via locale APIs.

## Rationale
A token-driven, themeable, accessible, state-complete, localizable UI system is reusable across
products and keeps FE, a11y, animation, and SEO specialists working from one contract. Semantic
tokens and enumerated component APIs make design changes and dark-mode/RTL support mechanical
rather than manual, and complete state/validation coverage removes the dead ends and layout shift
that erode trust.

## Exceptions & how to request one
No rule is waived silently. To request an exception:
1. Open an escalation to the UI/UX Lead citing the rule ID, the specific case, and why compliance is infeasible or harmful here.
2. Propose the narrowest scoped alternative (one component/surface, not a blanket carve-out) and its migration/removal path.
3. On approval, the exception is recorded with an owner and expiry; if the pattern is broadly useful it is promoted into the design system and this standard, superseding the exception.
Unapproved deviations (arbitrary values, off-scale type/spacing, missing states, placeholder-as-label, unmanaged focus) are review failures, not judgment calls.
