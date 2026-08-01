# Knowledge Index — Rule-ID Map

> Status: canonical · Owner: staff-architect · Consumed-by: ALL roles (loaded via `.claude/CLAUDE.md`)
> The single map of every standard and its stable rule-ID prefix. Roles cite rules by ID
> (`per CS-07`) instead of restating them — the core anti-duplication mechanism (EF-01).

## Standards & their ID prefixes

| Prefix | File | Owner | Covers |
|--------|------|-------|--------|
| `WF-` / `EF-` | [development-workflow.md](development-workflow.md) | engineering-manager | Execution loop, Output Contract, efficiency, escalation |
| `TS-` | [tech-stack.md](tech-stack.md) | staff-architect | Approved languages, frameworks, services, versions |
| `CS-` | [coding-standards.md](coding-standards.md) | staff-architect | Style, typing, errors, testing conventions |
| `AR-` | [architecture-principles.md](architecture-principles.md) | staff-architect | System design, boundaries, data, scaling |
| `UI-` | [ui-guidelines.md](ui-guidelines.md) | uiux-lead | Design system, a11y, responsive, states |
| `AI-` | [ai-guidelines.md](ai-guidelines.md) | ai-platform-lead | LLM usage, prompts, RAG, evals, safety |

## Citation rules
- Cite as `per <ID>` (e.g. `per AR-03`). Never paste the rule body into a role or skill.
- IDs are STABLE. Never renumber a rule; deprecate it (`~~CS-04~~ deprecated → see CS-12`) instead — dangling citations are a lint failure.
- A rule conflict escalates to the file's `Owner` (see each file's provenance header).

## Status
All standard files below are **v0.1 seeds** — structurally complete with stable IDs, to be expanded
by their owners. Rule IDs are contractual from v0.1; content deepens over time.
