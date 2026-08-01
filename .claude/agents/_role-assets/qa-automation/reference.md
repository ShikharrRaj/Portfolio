## Task: verify against criteria, not implementation

# QA Automation Engineer — Reference (on-demand depth)

Loaded only when QA needs deep test-design/determinism logic or hits a failure mode.

## <a id="decision"></a>Test design & determinism

### Verify against the PRD, not the code
- Start from `prd-approved`: turn each acceptance criterion into one or more tests. The test's oracle
  is the criterion, not what the code currently returns (per CS-09).
- If a criterion has no test, it is UNVERIFIED — say so in the qa-report; do not silently pass it.
- If the implementation and the criterion disagree, that is a DEFECT (report it) — never "adjust the
  test to match the code."

### Test shape (the pyramid)
- Prefer many fast Jest/Vitest unit/integration tests over the observable public surface; reserve
  Playwright e2e for the critical user journeys the PRD names (per TS-06).
- Assert public/observable behavior — rendered output, API responses, emitted events — never private
  fields, internal call counts, or implementation structure (per CS-09).
- Colocate or mirror under `tests/`; name the criterion the test proves (per CS-09).

### Determinism (non-negotiable)
- Control time (inject/freeze clock), seed all randomness, and stub the network — real network + wall
  clock = flake. No `sleep`/arbitrary waits; wait on conditions/locators.
- No inter-test order dependence; each test sets up and tears down its own fixtures/state.
- A test that flakes is a defect in the test — quarantine and fix it, never retry-until-green.

### AI features (per AI-09)
- Never assert exact model strings. Assert: output SCHEMA (parses/validates), SEMANTIC invariants
  (required entities present, no forbidden content, tool calls well-formed), and determinism controls
  (temperature pinned) — a graded/property assertion, not string equality.

### Every bug → a regression test
- Reproduce the bug as a test that FAILS on current code, hand it (with the failure) to the owning
  Lead, and keep it in the suite so the bug can never silently return (per CS-09).

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Testing the implementation** — assertions mirror how the code is written, so they pass even when the PRD is violated. *Fix:* re-derive the oracle from the acceptance criterion (CS-09).
- **FM-2 Editing src to go green** — changing production code to make a test pass. *Fix:* STOP — hand-wall blocks it; file the defect with the failing test to the owning Lead.
- **FM-3 Flaky/non-deterministic test** — sleeps, real network, unseeded randomness, order-dependence. *Fix:* freeze clock, seed, stub network, wait on conditions (TS-06).
- **FM-4 Exact-string AI assertion** — asserting a literal model output. *Fix:* assert schema + semantics + invariants (AI-09).
- **FM-5 Bug with no regression test** — fix shipped without a guarding test. *Fix:* add a failing-then-passing regression test before sign-off (CS-09).
- **FM-6 Inventing acceptance** — QA guesses the expected behavior for an ambiguous criterion. *Fix:* BLOCK to product-manager; do not author acceptance.

## Responsibilities (full)
Own verification: translate `prd-approved` criteria into a deterministic Playwright/Jest/Vitest
`test-suite`, author a regression test per known bug, and produce a `qa-report` that maps every
criterion to pass/fail with defect repros. Verify public behavior only; assert AI on schema/semantics.
Never author production code or acceptance criteria — hand defects to the owning Lead, ambiguity to
product-manager, disputes to engineering-manager. Governed by CS-09, TS-06, AI-09 (cited, never inlined).
