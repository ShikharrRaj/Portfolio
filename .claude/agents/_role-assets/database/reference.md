# Database Engineer — Reference (on-demand depth)

Loaded only when the Database Engineer needs deep migration/index/tuning logic or hits a failure mode.

## <a id="decision"></a>Migration, index & tuning patterns

### Migrations (forward-only, reversible-by-design)
- Every schema change is a NEW forward-only migration; never edit or delete an already-applied migration (per AR-08).
- "Reversible-by-design" means you know the down path even when Prisma runs forward-only in prod: keep a documented
  rollback (a compensating migration or a restore point), and prefer additive steps that can be abandoned safely.
- Zero-downtime uses **expand → backfill → contract**: (1) add the new column/table/index (nullable/tolerant),
  (2) backfill data in batches, (3) switch reads/writes, (4) a later migration drops the old shape. Each phase
  deploys independently and is safe to stop between (per AR-08).
- Guard destructive steps: adding a NOT NULL or unique constraint on a populated table first requires a backfill +
  validation step, or it fails on live data.

### Indexes (to the REAL access pattern)
- Index the query that actually runs — read it from the `api-contract` access patterns, don't guess (per AR-05).
- Match column order to the predicate + sort (equality columns first, then range/sort). Add partial/covering
  indexes only when EXPLAIN shows they pay off. Every index is a write cost — justify it.
- Create indexes CONCURRENTLY on large live tables to avoid locking writes.

### Constraints & source of truth
- Enforce integrity in the DB: FK, unique, check, NOT NULL — not just in app code. The database is the last line
  of defense (per TS-02).
- One source of truth per datum; do not duplicate writeable state across tables/services (per AR-05).

### Tuning (measure first)
- Never tune on a hunch. Reproduce with `EXPLAIN (ANALYZE, BUFFERS)`, confirm the plan, then change ONE thing and
  re-measure. Keep the before/after plan in the handoff.

### The shared schema
- Backend-lead OWNS the application models (entities, fields, relations). You do NOT redefine them. When a model
  change needs a migration/index/constraint, backend emits the model change and you implement the migration —
  you never edit models concurrently (sharedDomain; EM arbitrates).

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Editing an applied migration** — mutating a migration already run in an environment. *Fix:* add a NEW forward-only migration; never rewrite history (AR-08).
- **FM-2 Guessed index** — adding an index with no query behind it, or the wrong column order. *Fix:* read the api-contract access pattern, EXPLAIN it, index to the real predicate/sort (AR-05).
- **FM-3 Destructive one-shot migration** — dropping/renaming/NOT-NULL-ing a live column in a single step. *Fix:* expand → backfill → contract, each step reversible (AR-08).
- **FM-4 Redefining app models** — inventing/renaming entities or fields instead of coordinating. *Fix:* hand the model change back to backend-lead; implement only the migration (AR-05).
- **FM-5 Tuning without measuring** — adding indexes/changing plans on a hunch. *Fix:* EXPLAIN ANALYZE first, change one thing, re-measure.
- **FM-6 Integrity in app-only** — relying on app code for uniqueness/FK/nullability. *Fix:* enforce with DB constraints as the last line of defense (TS-02, AR-05).

## Responsibilities (full)
Own the data layer within the architecture: schema migrations, indexes, data-integrity constraints, and query/DB
tuning on Postgres/Prisma. Implement forward-only, reversible-by-design migrations against backend-lead's models
(shared schema), plan zero-downtime rollouts, and index/tune to measured access patterns. Hand `schema-migration`
to backend-lead (wiring) and devops (deploy). Governed by AR-05, AR-08, TS-02 (cited, never inlined).
