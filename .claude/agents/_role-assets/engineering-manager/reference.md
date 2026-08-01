# Engineering Manager — Reference (on-demand depth)

Loaded only when the EM needs deep routing logic or hits a failure mode. Not always-resident.

## <a id="decision"></a>Routing Matrix — decomposition heuristics

### Splitting a compound task by artifact type
| Feature smell | Split into (owner) |
|---|---|
| "Add search" | index/query (backend-lead) · embeddings/reranking (ai-platform-lead) · search UI + states (frontend-lead) |
| "Add auth" | authz model + endpoints (backend-lead) · session/schema (database) · login UI (frontend-lead) · threat model (security-reviewer) |
| "Add dashboard" | data API (backend-lead) · charts/UI (frontend-lead) · a11y pass (accessibility) · perf budget (performance) |
| "Ship an AI agent" | agent graph (ai-platform-lead) · prompts (prompt-engineer) · eval harness (ai-evaluation) · tracing/infra (devops) |

### Parallelize vs serialize
- Serialize ONLY across a hard dependency (Architect spec → any build; api-contract → frontend consumption).
- Everything else fans out concurrently. Two builders on non-overlapping write-globs run in parallel.
- Same-file domains (see `role-matrix.json` sharedDomains) never run concurrently on that file — serialize
  and let the owner apply advisor findings.

### Reviewer selection by change type
| Change | Reviewers to dispatch |
|---|---|
| Any src change | code-reviewer |
| Auth / data / external input / secrets | + security-reviewer |
| Hot path / large payload / N+1 risk | + performance |
| User-facing UI | + accessibility (+ seo if public, + animation if motion) |
| LLM feature | + ai-evaluation (evals) |

### Gating rule
A phase's gate = the **receiver's** DoD checklist, not the sender's "done". If phase B consumes phase
A's artifact, B's entry gate asserts A's Output Contract `STATUS: DONE` AND A's `ARTIFACTS` exist.

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Compound Phase** — one phase, two owners. *Detect:* two roles both need `Write` to deliver it.
  *Fix:* split by artifact type until each phase is single-owner.
- **FM-2 Premature Parallelization** — dispatched a builder before its input artifact exists.
  *Detect:* consumer's declared input has no upstream `STATUS: DONE`. *Fix:* serialize behind the producer.
- **FM-3 Sender-Done Gating** — gated on the builder's claim instead of the receiver's DoD.
  *Fix:* rewrite the gate to reference the receiver's checklist.
- **FM-4 Scope Creep into Design** — EM starts specifying architecture. *Fix:* STOP; route to staff-architect.
- **FM-5 Escalation Ping-Pong** — an ownership dispute bounced laterally between two roles.
  *Fix:* it must sink to EM; EM assigns one owner and re-dispatches, never negotiates.
- **FM-6 Whole-repo Load** — reading full role bodies or the whole tree to plan. *Fix:* read only PRD,
  phase state, and Input/Output contracts (EF-03).

## Responsibilities (full)
Beyond the always-loaded summary: maintain `projects/<p>/plan/delivery-plan.md` as the living plan;
own the phase dependency graph; assemble the final `release-decision` from reviewer findings; keep an
escalation log in `projects/<p>/escalations/`. All governed by `AR-*`, `WF-*`, `EF-*` (cited, not inlined).
