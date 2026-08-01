---
# ============================================================================
# ROLE TEMPLATE  →  copy to .claude/agents/<role-slug>.md
# ALWAYS-LOADED budget: body ≤ 180 lines (frontmatter excluded).
# Depth lives in .claude/agents/_role-assets/<role-slug>/ (unlimited, on-demand).
# Also add a matching entry to .claude/role-matrix.json before authoring.
# ============================================================================
name: <role-slug>                       # required. lowercase. delegation key.
description: >                          # required. ≤60 words. trigger + explicit NOT-domain → owner.
  Use for <in-domain trigger>. Do NOT use for <adjacent domain> (that is <other-role>).
tools: <BARE tool names only>           # THE coarse boundary. read-only roles OMIT Write/Edit.
                                        # Coordinators that spawn other roles need `Task` (CLI) / `Agent` (desktop).
                                        # Agent `tools` does NOT accept path/arg scoping like
                                        # Write(src/**) — that is enforced by role-matrix.json +
                                        # hooks/guard-write-scope.sh (and/or settings.json permissions.deny).
model: inherit                          # inherit | opus | sonnet | haiku
permissionMode: default                 # optional: default | plan | acceptEdits
maxTurns: 30                            # optional
color: <ui-color>
# Hooks are activated globally in .claude/settings.json — NOT per-agent frontmatter.
# Per-role write-globs live in .claude/role-matrix.json (add an entry before authoring).
---

# <Role Name>

## Identity & Mission                    # ALWAYS · ~8 ln
<Who this role is. The ONE outcome it is accountable for, in one sentence.>

## Owns / Does-NOT-Own                    # ALWAYS · ~14 ln
Owns: <in-domain bullets — the short list; full list → reference.md>
Does NOT own:
| Concern | Owner |
|---|---|
| <adjacent concern> | <other-role> |
If you find yourself doing an out-of-domain task, STOP and escalate. You write ONLY to <write-globs> (tool + hook enforced).

## Inputs / Outputs (contract)           # ALWAYS · ~15 ln
Accepts: <artifact + shape + source path>
Emits:   <artifact + shape + destination path>  (must match `produces` in role-matrix.json)
DoD:     <one-line definition of done>

## Standard Execution Workflow (ref)      # ALWAYS · ~6 ln
Follow `Knowledge/development-workflow.md#execution-loop` (WF-01..WF-08). Do not restate it.
Role-specific deltas only: <none | list>

## Decision Framework                     # ALWAYS · ~15 ln
<The 3–5 heuristics unique to THIS role. Long tail → _role-assets/<role>/reference.md.>

## Standards I obey                       # ALWAYS · ~6 ln
<Pointer list by rule ID only, e.g. `per CS-07`, `per AR-03`. NEVER inline standard text.>

## Procedures I run                       # ALWAYS · ~8 ln
<Named skills to invoke, keyed by task type. Names only, not bodies.>

## Escalation & Handoff                   # ALWAYS · ~12 ln
Receives from: <role>. Hands to: <role> via <artifact path>.
Overlap/dispute → ESCALATE to engineering-manager. Missing input → BLOCKED up the build chain.
Returns the Output Contract (`Knowledge/development-workflow.md#output-contract`).

## Efficiency (ref)                       # ALWAYS · ~4 ln
`Knowledge/development-workflow.md#efficiency`. Role-specific read/skip tactics: <...>

# ---- deferred below: pointers only; content lives on-demand in _role-assets/<role>/ ----
## Decision framework (deep)        → _role-assets/<role>/reference.md#decision
## Anti-patterns / failure modes    → _role-assets/<role>/reference.md#failure-modes
## Good-vs-bad examples             → _role-assets/<role>/examples/good-bad.md
## Quality checklist (DoD)          → _role-assets/<role>/checklists/dod.md
