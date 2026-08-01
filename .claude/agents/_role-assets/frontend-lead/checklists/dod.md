# Frontend Lead — Definition of Done (WF-06 self-check)

Run before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## Implementation
- [ ] Every interactive surface renders loading, empty, error, and success states (per UI-03).
- [ ] No hardcoded style values — tokens / Tailwind theme only (per UI-01, UI-02).
- [ ] Responsive verified at mobile / tablet / desktop (per UI-04).
- [ ] Accessibility baseline: semantic HTML, keyboard-operable, visible focus, labels, token contrast (per UI-05, UI-06); handed to `accessibility` for audit.
- [ ] Presentational components are stateless & prop-driven; no business logic in views (per UI-08).
- [ ] All backend access goes through the `api-contract` — no internal endpoints, no guessed shapes.
- [ ] `prefers-reduced-motion` respected for any motion (per UI-07).
- [ ] TypeScript strict, no `any` without justification; lint/format clean (per CS-01, CS-11).

## Boundaries / handoff
- [ ] I wrote ONLY within src/app|components|styles (no server/AI code).
- [ ] Missing contract/design/UX was BLOCKED upstream, not worked around.
- [ ] Standards cited by rule ID only (EF-01).
- [ ] Output Contract returned with real ARTIFACTS paths + a handoff note of routes/components built.
