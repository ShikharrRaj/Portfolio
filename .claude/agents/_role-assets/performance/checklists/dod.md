## Performance Engineer — Definition of Done (WF-06 self-check)

Run before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## perf-findings (returned, never written to files)
- [ ] Every critical path in the impl was measured against its stated NFR budget (per AR-12).
- [ ] Each finding pairs a metric + a reproducible measurement (volume, concurrency, cache state, p95/p99).
- [ ] Each finding names the breached budget explicitly (or notes a clean pass).
- [ ] Each finding attributes a profiled cause — not a guess from reading code (see reference.md#decision).
- [ ] Each finding carries a biggest-win-first fix with a named owner Lead; I applied none of them.
- [ ] Findings are ranked by budget-breach impact × path criticality, not by ease of fix.
- [ ] Any critical path with NO budget is flagged up to staff-architect, not measured against an invented number.
- [ ] Stateless/horizontal-scale (AR-04) and resilience (AR-06) assumptions verified under representative load.
- [ ] No premature micro-optimization: nothing flagged that breaches no budget and is off the critical path.

## Process / boundaries
- [ ] I edited no code and set no budget (that is the owning Lead / staff-architect); I stayed read-only.
- [ ] Ran with `EOS_ROLE_READONLY=1`; no Write/Edit attempted (the guard would deny it).
- [ ] Standards cited by rule ID only; nothing inlined (EF-01).
- [ ] Output Contract returned with `perf-findings` in FINDINGS (RETURNED, not written to files); ARTIFACTS lists none authored.
