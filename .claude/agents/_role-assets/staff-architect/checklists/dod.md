# Staff Architect — Definition of Done (WF-06 self-check)

Run before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## architecture-spec.md
- [ ] Every module/service maps to exactly ONE owning Lead.
- [ ] Every datum has a single writer / source of truth (per AR-05).
- [ ] Every boundary has a typed, versioned contract (per AR-07).
- [ ] Every service boundary is justified by a real constraint, not aesthetics (per AR-01; see reference.md#decision).
- [ ] Cross-cutting concerns addressed: authz, observability, error taxonomy, idempotency (per AR-06, AR-10).
- [ ] Non-functional budgets stated for each critical path and handed to `performance` (per AR-12).
- [ ] Tech choices are within the approved stack (per TS-*) or covered by an ADR.
- [ ] A dependency/build-order note is included for the EM and Leads.
- [ ] No design question left implicit ("figure out later" is a fail).

## ADRs
- [ ] Every significant decision has an ADR in `arch/adr/` (context, decision, alternatives, trade-off).
- [ ] Each ADR is referenced from the spec where the decision applies.

## Process / boundaries
- [ ] I did not define product scope (that is product-manager) or write feature code (that is a Lead).
- [ ] Standards cited by rule ID only; nothing inlined (EF-01).
- [ ] Output Contract returned with real ARTIFACTS paths (`projects/<p>/arch/**`).
