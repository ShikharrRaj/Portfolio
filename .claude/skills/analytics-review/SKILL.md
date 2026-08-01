---
name: analytics-review
description: Analyzes provided production analytics (feature usage, funnels, drop-offs, crash/error rates, performance) into an analytics-summary with actionable findings routed to owners. Use post-release when analytics exports are available. Follows Knowledge/tech-stack.md#TS-36.
when_to_use: analyze analytics, usage report, funnel drop-off, crash rates, post-release review, what are users doing
allowed-tools: Read, Grep, Glob, Bash, Write
---
## Purpose & Preconditions
Post-release insight loop. HONEST LIMIT: Claude cannot autonomously watch production — this skill
analyzes DATA YOU PROVIDE (PostHog/Sentry exports, logs). Requires: the release's success metrics
(from the PRD) + exported data.

## Inputs / Outputs (contract)
Inputs: PRD success metrics + exported analytics/error data.
Outputs: projects/<p>/handoffs/analytics-summary.md (artifact via handoffs; feeds retro + EM).

## Steps (deterministic)
1. Load the PRD's success metrics (baseline + target) — the report is structured AROUND them.
2. Compute actual vs target per metric; state confidence (sample size, window).
3. Funnels: locate the biggest drop-off step; correlate with errors/perf at that step.
4. Stability: crash/error rates vs pre-release; new error signatures → route to the owning Lead.
5. Performance: CWV/latency vs NFR budgets (per AR-12) → route regressions to performance.
6. Emit findings each with: metric, evidence, owner role, recommended action.
7. Feed conclusions to factory-retrospective + docs/memory (via knowledge-capture).

## Decision Points
- Metric unmeasurable from provided data → say so + specify the missing instrumentation (per TS-36).
- Regression vs baseline → open a defect line for the owning Lead, not a vague note.

## Quality Gate (inline)
- [ ] Every PRD metric addressed: actual vs target or "unmeasurable + what's missing".
- [ ] Every finding has an owner role and an action.
- [ ] No fabricated numbers: only what the provided data supports, with windows stated.

## References
per TS-33..TS-37, AR-12, AR-42; PRD metrics from prd-intake.
