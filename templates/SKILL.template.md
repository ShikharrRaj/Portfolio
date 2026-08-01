---
# ============================================================================
# SKILL (PROCEDURE) TEMPLATE  →  copy to .claude/skills/<verb-noun>/SKILL.md
# A procedure is ROLE-AGNOSTIC and reusable. Do NOT bake a role name into it.
# ON-DEMAND budget: SKILL.md body ≤ 400 lines. Deeper detail → reference/ , examples/ , scripts/.
# ============================================================================
name: <verb-noun>                       # e.g. scaffold-nestjs-endpoint, react-component
description: >                          # ALWAYS in the skill listing. ≤2 sentences. The trigger.
  <What this produces> when <condition>. Follows Knowledge/<file>#<rule-id>.
when_to_use: <matching phrases>         # combined with description ≤ 1536 chars
allowed-tools: <procedure needs>        # minimal
# paths: ["<glob>"]                     # optional: auto-surface only when working on matching files
---

## Purpose & Preconditions               # ~10 ln
<What this procedure does and what must be true before running it.>

## Inputs / Outputs (contract)           # ~15 ln
Inputs:  <shape + source>
Outputs: <shape + destination>

## Steps (deterministic)                  # ≤200 ln — the actual "how"
1. ...
2. ...

## Decision Points                        # ~40 ln — branch logic
- If <condition> → <path>. See reference/<x>.md.

## Quality Gate (inline)                  # ~30 ln — pass/fail before returning
- [ ] <check> ...

## References                             # pointers only
- Deep detail → reference/<x>.md
- Standards   → cite by rule ID (e.g. `per CS-08`); never inline.
