---
name: cost-review
description: Reviews AI token spend, cloud/database/storage/bandwidth costs, and build-time cost against budgets, producing cost-findings with ranked optimization recommendations. Use before release or when spend drifts. Follows Knowledge/ai-guidelines.md#AI-08.
when_to_use: cost review, token usage, cloud spend, reduce inference cost, cost optimization, budget check
allowed-tools: Read, Grep, Glob, Bash
---
## Purpose & Preconditions
Read-only cost audit against the budgets set at design time (per AR-12, AI-08). Requires: stated
budgets (architecture-spec NFR section) and cost data (billing exports, Langfuse token traces, build
logs) PROVIDED to the session — this skill cannot fetch live billing itself.

## Inputs / Outputs (contract)
Inputs: NFR budgets + provided cost data (exports/traces/logs).
Outputs: cost-findings RETURNED via the Output Contract (artifact: cost-findings).

## Steps (deterministic)
1. Extract the budgets (per-feature cost, p95 latency, infra ceilings) from the architecture-spec.
2. Map provided data to budget lines; compute actual vs budget per line.
3. AI spend: per-task model tier vs need (per AI-12), cache hit-rate (AI-19/20), max-token settings, fallback usage.
4. Infra: over-provisioned instances, egress hotspots, storage growth, build minutes.
5. Rank by savings size; each finding = metric + measured + budget + concrete change + estimated saving.
6. Flag any missing budget line to staff-architect (a cost with no budget is an AR-12 gap).

## Decision Points
- No budget stated → that IS the finding (route to staff-architect), don't invent one.
- Savings that degrade quality below an eval gate (AI-14/29) → rejected; note the constraint.

## Quality Gate (inline)
- [ ] Every finding: measured value + budget + delta + concrete change + estimated saving.
- [ ] AI findings respect eval gates; no "use a smaller model" without the eval caveat.
- [ ] Biggest-win-first ordering; no micro-optimizations above real leaks.

## References
per AI-08, AI-12, AI-19, AI-20, AI-30, AR-12, AR-37.
