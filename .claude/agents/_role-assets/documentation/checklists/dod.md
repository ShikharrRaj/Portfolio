# Documentation Engineer — Definition of Done (WF-06 self-check)

Run before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## Documentation
- [ ] Every public function / exported type in scope is documented with its contract + failure modes (per CS-14).
- [ ] Docs explain WHY (decision/tradeoff/invariant), not a line-by-line narration of the code (per CS-12).
- [ ] Every example was executed (or traced against real signatures) and runs as written (per CS-14).
- [ ] Docs are co-located with what they describe — no orphaned pages far from their subject (per CS-12).
- [ ] Reconciled against the delivered behavior (`frontend-impl` / `backend-impl` / diff) — nothing stale (per CS-14).
- [ ] Unclear intent/behavior was ASKED of the owning Lead, not invented (per WF-05).
- [ ] Breaking changes and public-surface changes are called out (changelog / release notes) where relevant.

## Boundaries / handoff
- [ ] I wrote ONLY within `docs/**` — no source code touched (hook enforced).
- [ ] Where a doc and the code disagreed, I BLOCKED to the code owner and re-documented — I did not edit source.
- [ ] Standards cited by rule ID only (EF-01); I did not load the whole repo (EF-03).
- [ ] Output Contract returned with real ARTIFACTS paths + a handoff note listing docs written/updated and examples verified.
