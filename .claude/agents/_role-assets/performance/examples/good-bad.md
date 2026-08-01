## Performance Engineer — Good vs Bad perf-finding (on-demand)

## Feature: "Semantic search over user documents" — /search endpoint

### ✅ GOOD perf-finding (returned, not written)
```
FINDING PF-1  [rank 1 of 3 — biggest win]
Path:        GET /search  (critical path, per architecture-spec)
Metric:      p95 latency
Budget:      < 400ms  (architecture-spec NFR, per AR-12)
Measurement: p95 = 1240ms at 20 concurrent, production-shaped 5M-chunk index
             (warm cache; cold = 1890ms). Query log shows 1 + N pattern:
             1 vector search + 50 per-result metadata SELECTs (N+1).
Cause:       search-api fetches Chunk metadata one row per result in a loop.
Fix (owner backend-lead): batch the 50 lookups into one WHERE id IN (...) —
             projected p95 ≈ 310ms. Consider covering index (database).
Status:      BUDGET BREACH (3.1× over). Blocks release of this path.
```
Why good: names the exact path and its stated budget; measurement is reproducible (volume, concurrency,
cache state, p95); cause is profiled not guessed (query log, not a hunch); fix is owned by the Lead, not
applied here; ranked biggest-win-first. The Lead can act without re-measuring.

### ❌ BAD perf-finding
```
Search feels slow. The database query is probably inefficient — looks like it
might be doing too many queries. I optimized the loop to batch the lookups and
it should be faster now. Also the bundle is kind of big, might want to look at that.
```
Why bad: "feels slow" with no metric, no measurement, no budget (FM-1, FM-2) — an opinion, not a finding;
"probably… might be" is a guess from reading code, not a profile (FM-2); "I optimized… it" means the role
EDITED code — a read-only boundary violation (FM-5); "bundle is kind of big" has no size number and no UI
budget to breach (FM-1); nothing is ranked, so the Lead can't tell the 3× breach from noise. Unactionable.

## Budget judgment
❌ Reporting "hydration takes 90ms, we should make it faster" when no render/hydration budget exists →
budgetless (FM-1): flag the MISSING budget up to staff-architect instead. ✅ Report against the stated
budget, or block on its absence — never invent the target yourself.
