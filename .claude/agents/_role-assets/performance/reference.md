## Performance Engineer — Reference (on-demand depth)

Loaded only when the Performance Engineer needs deep profiling logic or hits a failure mode. Not always-resident.

## <a id="decision"></a>Decision trees

### Is there a budget to measure against?
Before profiling anything, locate the NFR budget for the path under review (per AR-12):
- Budget stated in `architecture-spec` → measure against it; a breach is a finding, a pass is noted and skipped.
- No budget for a critical path → STOP profiling that path; flag to staff-architect (BLOCKED). Do not invent a number.
- Budget exists but the path isn't critical → deprioritize; note it, do not spend the audit on it.

### Profiling ladder (profile, do not guess)
1. Reproduce the workload realistically (representative data volume, concurrency, cold vs warm cache).
2. Measure end-to-end first (p50/p95/p99 latency, throughput, error rate) — find WHICH path breaches.
3. Only then drill: flamegraph / query log / bundle analyzer / heap snapshot on the breaching path.
4. Attribute the cost to a concrete cause (N+1 query, unindexed scan, oversized bundle, sync render, leak).
5. Re-state as metric + measurement + budget + biggest-win fix, owned by the relevant Lead.

### Where to look, by budget class
| Budget class | Signal to measure | Common cause | Fix owner |
|---|---|---|---|
| Latency (p95) | end-to-end + per-span timing | N+1, unindexed query, blocking I/O | backend-lead / database |
| Throughput | req/s at target concurrency | lock contention, non-stateless handler (per AR-04) | backend-lead |
| Bundle size | analyzer output vs UI budget | unsplit vendor, no tree-shake (per UI-*) | frontend-lead |
| Render/hydration | TTI, hydration time, re-render count | client-heavy tree, no memo, waterfall | frontend-lead |
| Query efficiency | query count + rows scanned | N+1, missing index, over-fetch | backend-lead / database |
| Memory | heap growth over sustained load | retained closures, unbounded cache, leak | owning Lead |

### Biggest-win-first ranking
Rank by (budget-breach magnitude × path criticality), never by ease of fix. A 3× p95 breach on the
checkout path outranks a 10% bundle overage on an admin page. State the ranking rationale in the return.

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Budgetless audit** — measuring with no stated NFR target, so "slow" is an opinion. *Detect:* no p95/throughput/size budget for the path. *Fix:* flag to staff-architect; do not invent a number (per AR-12).
- **FM-2 Guessing instead of profiling** — asserting a cause from reading code. *Detect:* a finding with no measurement. *Fix:* reproduce, profile, attach the number before it counts as a finding.
- **FM-3 Premature micro-optimization** — flagging a nanosecond loop that breaches nothing. *Detect:* finding with no budget breach and off the critical path. *Fix:* drop it; audit only what breaches a budget (per AR-01).
- **FM-4 Unrepresentative measurement** — profiling on toy data / warm cache / single user. *Detect:* numbers that won't hold at real volume/concurrency. *Fix:* reproduce with production-shaped load, cold and warm.
- **FM-5 Scope drift into fixing** — editing code or rewriting the query. *Detect:* about to Write/Edit. *Fix:* STOP — you are read-only; hand the fix to the owning Lead via the finding.
- **FM-6 Local-only lens** — optimizing one span while the real breach is elsewhere. *Detect:* drilling before end-to-end timing. *Fix:* measure end-to-end first, then drill the breaching span; verify scale/resilience assumptions hold (per AR-04, AR-06).

## Responsibilities (full)
Beyond the always-loaded summary: for each `*-impl` received, reproduce the workload, measure every
critical path against its NFR budget, and produce a ranked `perf-findings` set where each finding is
metric + measurement + breached budget + biggest-win fix with a named owner Lead. Verify stateless /
horizontal-scale (AR-04) and resilience (AR-06) assumptions hold under load. Flag any critical path that
has no budget up to staff-architect. Never apply a fix, never set a budget, never edit code — all findings
are RETURNED via the Output Contract (the guard denies writes for this role). Governed by AR-* (cited, never inlined).
