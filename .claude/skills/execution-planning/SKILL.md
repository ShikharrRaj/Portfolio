---
name: execution-planning
description: Breaks an approved architecture into milestones → epics → features → tasks with a dependency graph, complexity/risk estimates, and maximal safe parallelization, producing execution-plan.md. Use after architecture-design, before build dispatch. Follows Knowledge/development-workflow.md#execution-loop.
when_to_use: execution plan, break down the architecture, milestones epics tasks, dependency graph, what runs in parallel, sequencing the build
allowed-tools: Read, Write, Edit, Grep, Glob
---
## Purpose & Preconditions
Turn `architecture-spec` + `delivery-plan` into a fine-grained, dependency-ordered execution plan the
EM dispatches from. Requires: approved architecture-spec (with build-order note) and research-report.

## Inputs / Outputs (contract)
Inputs: projects/<p>/arch/architecture-spec.md, projects/<p>/plan/delivery-plan.md.
Outputs: projects/<p>/plan/execution-plan.md (+ dependency-graph + milestones sections inside it).

## Steps (deterministic)
1. Extract every module/deliverable from the architecture-spec; map each to its owning role (one owner each).
2. Group into milestones (shippable increments) → epics → features → tasks (a task = one role, one artifact, ≤1 day).
3. Build the dependency graph: link a task to another ONLY for a real artifact dependency (api-contract, schema, ui-spec).
4. Mark parallel streams: everything not on a dependency edge runs concurrently (FE ∥ BE ∥ AI ∥ docs ∥ tests).
5. Estimate per task: complexity (S/M/L) + risk (low/med/high, from research risk register).
6. Order: critical path first; gate each phase on the RECEIVER's DoD (per WF-09).
7. Emit execution-plan.md with the phase table the EM dispatches from.

## Decision Points
- Two roles needed for one task → it is mis-decomposed: split it (EM FM-1).
- A task with no consumer for its artifact → cut it or justify it (YAGNI, per AR-01).
- High-risk task → schedule earliest (fail fast), never last.

## Quality Gate (inline)
- [ ] Every task: one owner, one artifact, declared inputs that exist upstream.
- [ ] Graph is acyclic; parallel streams explicitly marked.
- [ ] Every milestone independently shippable; gates reference receiver DoD.
- [ ] Complexity + risk on every task; critical path identified.

## References
Standards: per AR-01, WF-09; EM routing depth → agents/_role-assets/engineering-manager/reference.md.
