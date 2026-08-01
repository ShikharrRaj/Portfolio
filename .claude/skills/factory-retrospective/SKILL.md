---
name: factory-retrospective
description: Runs the post-feature factory retrospective — what slowed delivery, which handoffs/prompts failed, what can parallelize or automate, which roles/standards need amending — producing factory-retrospective.md with owned action items. Use after every shipped feature or release. Follows Knowledge/development-workflow.md#execution-loop.
when_to_use: retrospective, post-mortem, what slowed us down, factory improvement, after release review
allowed-tools: Read, Write, Edit, Grep, Glob
---
## Purpose & Preconditions
Continuous improvement of the FACTORY itself (throughput, cycle time, quality), not of the feature.
Requires: the feature's Output Contracts, escalations, retry counts, and gate outcomes.

## Inputs / Outputs (contract)
Inputs: projects/<p>/ artifacts (plan, contracts, escalations/), analytics-summary if available.
Outputs: projects/<p>/plan/factory-retrospective.md (artifact: retro-report) + memory via knowledge-capture.

## Steps (deterministic)
1. Reconstruct the timeline from Output Contracts: per stage — duration, retries (WF-10 counts), blocks.
2. Identify the bottleneck stage and the most-retried handoff; find the ROOT cause (bad input? vague DoD? missing skill?).
3. Answer the improvement questions: what slowed delivery · which handoffs/prompts failed · what could have parallelized · which steps could automate/merge · which standard/role file caused ambiguity.
4. Propose ≤5 concrete improvements, each: change + owner + where (role file / skill / standard rule ID / matrix).
5. Route standard amendments to the file Owner; role/skill edits to the CEO (protected infra).
6. Invoke knowledge-capture for durable lessons; return the Output Contract with the top 3 actions.

## Decision Points
- A failure that repeats across ≥2 retros → escalate from "lesson" to a standard/rule change.
- An improvement needing new tooling → spawn it as a task for the EM to route, not a wish in a doc.

## Quality Gate (inline)
- [ ] Timeline + retry counts reconstructed from artifacts, not memory.
- [ ] Root causes named (not symptoms); ≤5 improvements, each with an owner and a target file.
- [ ] Lessons pushed to docs/memory via knowledge-capture; repeat-failures promoted to rule changes.

## References
per WF-09, WF-10, EF-*; amendments per each standard's Exceptions section.
