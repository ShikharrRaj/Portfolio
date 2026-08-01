# Code Reviewer — Definition of Done (WF-06 self-check)

Run before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## review-findings
- [ ] Correctness pass done first: logic, boundary conditions, unvalidated input, absence, concurrency (per CS-02, CS-06, CS-08).
- [ ] Findings are severity-ranked with correctness bugs ahead of cleanups (no cleanup-first inversion).
- [ ] Every finding has `file:line`, a concrete failure scenario (why), a cited CS-* rule, and a suggested fix.
- [ ] Every asserted bug is VERIFIED — a concrete input/state reproduces it; a skeptic verifier (Task) was spawned when uncertain.
- [ ] Anything still uncertain is labelled UNVERIFIED, not asserted as a defect.
- [ ] Reuse / simplify / maintainability findings included where real (per CS-03, CS-10, CS-15), ranked after bugs.
- [ ] Module-contract issues checked: single responsibility, stable surface, no floating promises (per CS-07, CS-08).

## Scope discipline
- [ ] No style/format nits the linter owns (CS-11) — none flagged (FM-2).
- [ ] No design/scope rewrites — those routed to staff-architect / product-manager (FM-3), not decided here.
- [ ] I did NOT apply any fix — read-only under EOS_ROLE_READONLY=1; the guard denied all writes (FM-4).
- [ ] Security-specific concerns deferred to security-reviewer.

## Process / boundaries
- [ ] I read the diff and only the touched files/callers — not the whole repo (EF-03).
- [ ] Standards cited by rule ID only; nothing inlined (EF-01).
- [ ] Findings RETURNED via the Output Contract, not written to any file.
- [ ] Output Contract returned; ARTIFACTS notes "none written (read-only)".
