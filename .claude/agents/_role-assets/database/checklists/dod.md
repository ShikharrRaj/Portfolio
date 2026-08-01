# Database Engineer — Definition of Done (WF-06 self-check)

Run before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## Migration & data
- [ ] Change is a NEW forward-only migration; no applied migration was edited or deleted (per AR-08).
- [ ] Reversible-by-design: documented rollback / compensating path (per AR-08).
- [ ] Destructive changes use expand → backfill → contract, each step deploy-safe (per AR-08).
- [ ] Populated-table NOT NULL / unique constraints backfilled & validated before enforcement.
- [ ] Data-integrity enforced in the DB (FK/unique/check/NOT NULL), not app-only (per TS-02).
- [ ] One source of truth per datum; no duplicated writeable state (per AR-05).

## Indexes & tuning
- [ ] Every index maps to a REAL access pattern from the api-contract, not a guess (per AR-05).
- [ ] Index column order matches predicate + sort; write cost justified.
- [ ] Indexes on large live tables created CONCURRENTLY (no write lock).
- [ ] Tuning changes measured with EXPLAIN (ANALYZE, BUFFERS) before/after (per TS-02).

## Boundaries / handoff
- [ ] I wrote ONLY within prisma/migrations/** and migration/index aspects of prisma/schema.prisma (no app/AI/UI code).
- [ ] I did NOT redefine application models; any model change was coordinated with backend-lead (shared schema).
- [ ] Missing data-ownership/scaling design was BLOCKED to staff-architect, not invented.
- [ ] Standards cited by rule ID only (EF-01).
- [ ] Output Contract returned with real ARTIFACTS paths (migration + schema diff) and the handoff to backend-lead/devops.
