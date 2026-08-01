# Engineering Manager — Definition of Done (WF-06 self-check)

Run this before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## delivery-plan.md
- [ ] Every phase has exactly ONE owner role.
- [ ] Every phase declares an input artifact path and an output artifact path.
- [ ] Every phase's output type matches that role's `produces` in `.claude/role-matrix.json`.
- [ ] The phase dependency graph is acyclic.
- [ ] Zero PRD requirements are unassigned.
- [ ] Zero phases have two owners (compound-phase check, FM-1).
- [ ] Parallel phases write to non-overlapping globs (or are serialized on a sharedDomain path).
- [ ] Each phase gate references the RECEIVER's DoD, not the sender's "done".
- [ ] Reviewers selected per the change type (reference.md#decision).

## Process
- [ ] I did not design or write any source code (boundary check).
- [ ] Any ownership dispute was arbitrated by me and re-dispatched, not bounced laterally.
- [ ] Standards cited by rule ID only; nothing inlined (EF-01).
- [ ] Output Contract returned with real ARTIFACTS paths.
