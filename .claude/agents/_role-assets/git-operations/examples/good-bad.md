# Git Operations — Good vs Bad (on-demand)

## ✅ GOOD commit
"feat(search): add semantic search API behind /v1/search

Adds ingest→embed→query path per arch spec §search. Contract published for FE.
Why: PRD G1 (time-to-find <10s). Idempotent ingest (AR-06); authz scoped per AR-10.
Refs: projects/demo/plan/delivery-plan.md phase 2a"
Why good: type(scope), imperative, WHY in body, artifact refs, one concern.

## ❌ BAD commit
"update files + fix stuff + tried new cache thing"
Why bad: three concerns (FM-1), no why (FM-2), no scope, unreviewable. Return to the Lead to split.
