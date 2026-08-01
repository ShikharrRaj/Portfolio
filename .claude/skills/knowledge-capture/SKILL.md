---
name: knowledge-capture
description: Captures a completed task's durable knowledge into docs/memory/ — decisions, lessons learned, failed vs successful approaches, runbook updates, known issues — so no problem is solved twice. Use at the end of every feature/incident. Follows Knowledge/development-workflow.md#execution-loop.
when_to_use: capture lessons, update factory memory, record decision, post-incident notes, knowledge base update, never solve twice
allowed-tools: Read, Write, Edit, Grep, Glob
---
## Purpose & Preconditions
The factory-memory write path. WF-03 GROUND reads `docs/memory/` before new work; this skill is what
makes that read worth doing. Requires: the completed task's Output Contracts / retro / incident notes.

## Inputs / Outputs (contract)
Inputs: Output Contracts, retro-report, incident reports, ADR links from the finished work.
Outputs: docs/memory/<topic>.md entries + docs/memory/INDEX.md line (artifact: knowledge-update).

## Steps (deterministic)
1. Harvest: what was decided (→ link the ADR, don't restate), what failed and WHY, what worked, what surprised.
2. De-duplicate: search docs/memory/ first; UPDATE an existing entry over creating a near-duplicate.
3. Write per entry: Context (1 line) · Lesson (the reusable rule) · Evidence (link) · Applies-when.
4. Update runbooks touched by the work (docs/runbooks/) with any new failure mode.
5. Known-issues: record open sharp edges with owner + workaround.
6. Add one INDEX.md line per new entry (entry files hold content; the index holds pointers only).

## Decision Points
- Lesson generalizes across projects → propose a rule amendment to the standard's Owner instead of a memory note.
- Contradicts an existing entry → reconcile (update/deprecate the old one); never leave both.

## Quality Gate (inline)
- [ ] Every entry: context + reusable lesson + evidence link + applies-when.
- [ ] Zero duplicates (searched first); INDEX.md updated; stale entries reconciled.
- [ ] Nothing restated that an ADR/standard already records — linked instead (EF-01).

## References
per EF-01, WF-03; standards amendments → the file Owner per its Exceptions section.
