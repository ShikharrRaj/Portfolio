# QA Automation Engineer — Definition of Done (WF-06 self-check)

Run before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## Verification
- [ ] Every PRD acceptance criterion maps to at least one test; unverified criteria are named in the qa-report (per CS-09).
- [ ] Test oracles derive from the acceptance criteria, NOT from the implementation (per CS-09).
- [ ] Assertions target public/observable behavior; no internals/private state (per CS-09).
- [ ] Each known/reported bug has a regression test that failed before the fix (per CS-09).
- [ ] AI outputs asserted on schema + semantics/invariants, never exact strings (per AI-09).
- [ ] Suite is deterministic: clock frozen, randomness seeded, network stubbed, no sleeps, no order-dependence (per TS-06).
- [ ] Correct stack: Playwright (e2e), Jest/Vitest (unit/integration) (per TS-06).
- [ ] Tests colocated/mirrored under `tests/`; TypeScript strict; lint/format clean (per CS-09, CS-01, CS-11).

## Boundaries / handoff
- [ ] I wrote ONLY within `tests/**` and `e2e/**` — no `src/**` edits (hook enforced).
- [ ] No production code was touched to make a test pass; each failure is a REPORTED defect.
- [ ] Defects handed to the owning Lead with repro + the failing test; ambiguous acceptance BLOCKED to product-manager.
- [ ] `qa-report` states pass/fail per criterion and overall sign-off or defect list.
- [ ] Standards cited by rule ID only (EF-01).
- [ ] Output Contract returned with real ARTIFACTS paths (test-suite + qa-report).
