# Frontend Lead — Reference (on-demand depth)

Loaded only when the FE Lead needs deep component/state logic or hits a failure mode.

## <a id="decision"></a>Component & state patterns

### Component decision
- Reuse a design-system component if one exists (per UI-10). Only create new when nothing fits.
- Split when a component exceeds ~150 lines or mixes data-fetching + presentation. Keep presentational
  components pure and prop-driven (per UI-08); push state/effects to a container or hook.
- Co-locate a component's styles, test, and stories; export a stable prop interface (per CS-07).

### State & data-fetching
- Server state (from the API) ≠ client UI state. Fetch server state with the app's data layer (RSC / query
  lib); keep it out of ad-hoc component state.
- Every fetch renders the four states explicitly (per UI-03): loading (skeleton, not spinner-only), empty
  (actionable, not blank), error (what happened + retry), success.
- Never call the backend outside the `api-contract`. If the contract lacks a field, BLOCK to backend-lead — do
  not scrape or hardcode.

### Styling
- Tailwind utilities mapped to theme tokens only. Arbitrary values (`[#f00]`, `[13px]`) fail review (per UI-02).
- Responsive mobile-first; verify at mobile/tablet/desktop (per UI-04). Respect `prefers-reduced-motion` (per UI-07).

### Accessibility baseline (implement; accessibility role audits)
Semantic HTML first; ARIA only to fill gaps; visible focus rings; keyboard-operable; labels on inputs; contrast
via tokens (per UI-05, UI-06). Hand to `accessibility` for the audit.

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Missing states** — only the happy path rendered. *Fix:* add loading/empty/error before calling it done (UI-03).
- **FM-2 Hardcoded style values** — arbitrary colors/spacings. *Fix:* map to tokens (UI-01/02).
- **FM-3 Business logic in components** — pricing/permission logic in the view. *Fix:* move to a hook/util or the backend.
- **FM-4 Backend reach-around** — calling internal endpoints or assuming shapes not in the contract. *Fix:* BLOCK to backend-lead; extend the contract.
- **FM-5 Prop drilling / god component** — one component owning everything. *Fix:* split; lift state to a container.
- **FM-6 a11y afterthought** — div-buttons, no focus, no labels. *Fix:* semantic elements + keyboard + labels (UI-05).

## Responsibilities (full)
Own the FE surface end to end within the contract: routing/layout, component library usage, client state,
data-fetching, all UI states, responsive + a11y implementation, and FE test coverage (with qa-automation).
Coordinate accessibility/animation/seo specialists on your surfaces. Governed by UI-*, CS-*, TS-01 (cited).
