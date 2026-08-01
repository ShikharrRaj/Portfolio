---
name: design-architecture
description: >
  Produces an architecture-spec plus ADRs for a scoped feature or system: module
  decomposition with one owning Lead each, single-writer data ownership, versioned
  contracts, cross-cutting policies, NFR budgets, and a build-order graph. Use when a
  PRD or cross-team task needs a technical design before implementation. Follows
  Knowledge/architecture-principles.md#AR-01.
when_to_use: architecture spec, technical design, ADR, module decomposition, data ownership, service contracts, dependency graph, NFR budgets, break a feature into modules
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

## Purpose & Preconditions
Turn an approved PRD (or a well-scoped design task) into a decision-complete
architecture-spec and its supporting ADRs, so Leads can implement in parallel without
re-deciding boundaries. Preconditions: a PRD or scope statement exists with acceptance
criteria; the target `projects/<slug>/` exists; the current actor holds architecture
write-scope. Missing scope or contradictory requirements → escalate (WF-08); do not guess.

## Inputs / Outputs (contract)
Inputs:
- PRD / scope doc — `projects/<slug>/prd/*` or an inline task with acceptance criteria.
- Existing standards — cited by ID, not re-read wholesale (per EF-01, EF-03).
- Existing arch (if any) — `projects/<slug>/arch/` for deltas.

Outputs (all under `projects/<slug>/arch/`):
- `architecture-spec.md` — modules, owners, data ownership, contracts, cross-cutting,
  NFR budgets, and the build-order graph.
- `adr/NNNN-<slug>.md` — one ADR per architecturally significant decision (per AR-09).
- Handoff note → `projects/<slug>/handoffs/` pointing Leads at their module + contracts.

## Steps (deterministic)
1. **Restate scope.** Read the PRD; write the goal + acceptance criteria as ≤3 bullets at
   the top of `architecture-spec.md`. If ambiguous, stop and escalate (WF-08).
2. **Ground.** Grep/Glob only the relevant existing arch + code; list constraints
   (existing datastores, contracts, deadlines). Cite governing rule IDs; never inline them.
3. **Decompose into modules.** Split the system into cohesive modules with clear
   boundaries and inward-pointing dependencies (per AR-02, AR-03). Prefer the simplest
   decomposition that meets the requirement (per AR-01). Record each module: name, one-line
   responsibility, and exactly **one owning Lead** (frontend/backend/ai-platform/database).
   A module with no single owner is a failure — split or merge until each has one.
4. **Assign data ownership.** For every persistent datum, name the **single writing
   module** (per AR-05). Other modules read via contract only — never write across a
   boundary. Produce a datum → owner table; any datum with two writers must be resolved.
5. **Define versioned contracts.** For each cross-module interface, specify a typed,
   explicitly versioned contract (name, version, request/response shape, error cases) per
   AR-07. Note that breaking changes require a version bump + migration path.
6. **Address cross-cutting concerns.** Add a section fixing policy for: **authz** at every
   boundary, **observability** (traces/metrics/logs), and **error handling** (timeouts,
   retries, idempotency), designed in rather than bolted on (per AR-10, AR-06).
7. **Set NFR budgets.** State explicit latency, throughput, and cost budgets per module or
   critical path (per AR-12); mark them as gated by the `performance` role.
8. **Record ADRs.** For each significant or non-obvious decision (chosen boundary, tech
   choice, contract style, any deviation), write one ADR in `adr/NNNN-<slug>.md`:
   Context → Decision → Alternatives → Consequences (per AR-09). Novel tech needs its own
   ADR (per AR-11).
9. **Emit the build-order graph.** Produce a dependency graph (modules as nodes, contract
   dependencies as edges) and a topologically sorted build order. If a cycle exists, break
   it by introducing an interface/queue and record the fix as an ADR.
10. **Write handoff.** Emit a note to `projects/<slug>/handoffs/` mapping each owning Lead
    to their module(s), the contracts they must honor, and their NFR budgets.
11. **Run the Quality Gate** below. Fix or flag every failed item before returning.

## Decision Points
- If a module has no single owning Lead → re-decompose (step 3); do not ship shared
  ownership.
- If two modules want to write the same datum → pick one writer, expose a read contract to
  the other (per AR-05), and record an ADR.
- If the dependency graph has a cycle → break it with an interface or async boundary; log
  an ADR (step 8).
- If a requirement forces novel/non-standard tech (per AR-11) or violates a standard →
  write an ADR requesting the exception; if it crosses another domain, escalate to
  engineering-manager (WF-08) instead of deciding unilaterally.
- If NFR budgets look infeasible on the chosen design → revisit decomposition, don't just
  loosen the budget silently.

## Quality Gate (inline)
- [ ] Scope restated at top of spec; matches PRD acceptance criteria.
- [ ] Every module has exactly one owning Lead (no shared/no-owner modules) — per AR-02.
- [ ] Dependencies point inward; no module reaches into another's internals — per AR-03.
- [ ] Every persistent datum has exactly one writer (single-writer table complete) — per AR-05.
- [ ] Every cross-module contract is typed and carries an explicit version — per AR-07.
- [ ] Authz, observability, and error/retry policy each have a cross-cutting section — per AR-10, AR-06.
- [ ] Latency + cost NFR budgets stated and marked performance-gated — per AR-12.
- [ ] One ADR per significant decision, Context→Decision→Alternatives→Consequences — per AR-09.
- [ ] Build-order graph is acyclic and topologically sorted; any cycle-break has an ADR.
- [ ] Handoff note maps each Lead → module + contracts + budgets.
- [ ] No Knowledge rule pasted inline; all cited by ID — per EF-01.

## References
- Standards → cite by rule ID: AR-01, AR-02, AR-03, AR-05, AR-07, AR-12 (also AR-06,
  AR-09, AR-10, AR-11 where referenced above); workflow EF-01, EF-03, WF-08. Never inline.
- Execution loop + Output Contract → `Knowledge/development-workflow.md`.
- ADR location convention → `projects/<slug>/arch/adr/` (per AR-09).
