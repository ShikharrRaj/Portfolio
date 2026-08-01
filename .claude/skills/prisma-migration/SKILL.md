---
name: author-prisma-migration
description: >
  Authors a forward-only Prisma migration from a backend-lead model change:
  expand→backfill→contract for zero-downtime, indexes matched to the real access
  pattern, DB-level integrity constraints, and a documented reversible plan — never
  editing an applied migration. Use when a schema change needs a safe, deployable
  migration. Follows Knowledge/architecture-principles.md#AR-08.
when_to_use: prisma migration, schema change, add/drop column, zero-downtime migration, backfill, add index, add constraint, forward-only migration, expand-contract
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

## Purpose & Preconditions
Turn a requested model change into one or more forward-only Prisma migrations that deploy
without downtime and preserve data integrity at the DB level. Preconditions: a concrete model
change exists (from backend-lead — the desired `schema.prisma` delta or an equivalent
description); the repo's Prisma setup is present (`prisma/schema.prisma`, `prisma/migrations/`);
the actor holds migration write-scope. Migrations are forward-only and reversible-by-design
where feasible (per AR-08) on the approved Prisma/Postgres stack (per TS-02). Missing model
change, ambiguous intent, or a requirement to edit an already-applied migration → stop and
escalate (WF-08); do not guess.

## Inputs / Outputs (contract)
Inputs:
- **Model change** — desired `schema.prisma` delta or field/table spec from backend-lead.
- **Access pattern** — the queries/filters/joins this data will serve (drives indexing).
- **Data reality** — current row counts, nullability, existing values (informs backfill + risk).
- Standards — cited by ID, never re-read wholesale (per EF-01, EF-03).

Outputs (under `prisma/`):
- Updated `prisma/schema.prisma` reflecting the target model.
- One or more timestamped migrations in `prisma/migrations/<ts>_<slug>/migration.sql`,
  generated (never hand-invented filenames) and reviewed before commit.
- A **migration plan note** (in the handoff or PR body): phase (expand/backfill/contract),
  ordering, backfill strategy, index rationale, constraints added, and the documented
  reversal path for each phase.

## Steps (deterministic, numbered)
1. **Restate the change.** Read the incoming model delta; write in ≤3 bullets what tables/columns
   change and why. If intent is ambiguous or crosses a data-ownership boundary, stop and escalate
   (WF-08). Confirm exactly one module owns each affected datum (per AR-05).
2. **Ground.** `Read` `prisma/schema.prisma`; `Grep`/`Glob` `prisma/migrations/` for the latest
   applied migration and any related tables. Never edit or rename an already-applied migration
   directory — it is immutable history; corrections go in a *new* forward migration.
3. **Classify the change.** Decide: additive-only (new nullable column/table/index) vs.
   destructive/tightening (drop, rename, NOT NULL on existing, type change). Additive → single
   migration. Destructive/tightening → plan an **expand→backfill→contract** sequence (step 4).
4. **Plan phases for zero-downtime** (per AR-08):
   - **Expand:** add the new column/table as **nullable / with a default**, plus new indexes and
     constraints that don't block writes. Old and new app code must both run against this shape.
   - **Backfill:** populate new columns in **batches** (bounded row counts, not one giant UPDATE)
     so locks stay short; make the backfill idempotent and re-runnable.
   - **Contract:** only after backfill completes and old code is retired — enforce `NOT NULL`,
     drop the old column, add the final foreign key. Each phase is its own migration; never
     collapse expand and contract into one deploy.
5. **Index to the real access pattern.** For each query the data serves, add the matching index:
   composite column **order = equality columns first, then range/sort**; partial index for a hot
   filtered subset; unique index to enforce uniqueness. Do **not** add speculative indexes — each
   index must trace to a stated query. On large tables prefer `CREATE INDEX CONCURRENTLY`
   (outside a transaction) to avoid write locks.
6. **Add DB-level integrity constraints.** Push invariants into the database, not just app code:
   `NOT NULL`, `UNIQUE`, `FOREIGN KEY` with explicit `ON DELETE` behavior, and `CHECK`
   constraints for value/domain rules. These are the real source of truth for the datum's
   integrity (per AR-05).
7. **Generate, don't hand-write, the skeleton.** Update `schema.prisma`, then run the project's
   Prisma migrate command in **create-only** mode (e.g. `prisma migrate dev --create-only` or the
   repo's script) to emit the migration directory. Read the generated `migration.sql` and edit it
   to add batched backfills, `CONCURRENTLY`, and any SQL Prisma won't infer.
8. **Document the reversal path.** For each migration, write how to move forward-off the change
   without an in-place `DOWN` (forward-only per AR-08): the compensating forward migration, and
   for the destructive phase, the pre-drop safeguard (e.g. keep the old column one release, snapshot
   before drop). "Irreversible" is only acceptable when explicitly justified in the note.
9. **Dry-run / validate.** Run the migration against a scratch/shadow DB if available; confirm it
   applies cleanly, `prisma validate` passes, and the client generates. Capture failures; do not
   return a migration that hasn't been applied at least once.
10. **Run the Quality Gate** below. Fix or flag every failed item before returning; emit the
    migration plan note in the handoff/PR body.

## Decision Points
- **Additive vs. destructive** → additive-only ships as one migration; any drop/rename/tighten
  must use expand→backfill→contract across separate deploys (step 4). Never `NOT NULL` a populated
  column in the same migration that adds it.
- **Big backfill** → if the affected table is large, batch the backfill and use
  `CREATE INDEX CONCURRENTLY`; a single blocking statement on a hot table is a fail, not a style nit.
- **Rename a column** → treat as add-new + backfill + drop-old across releases, never an in-place
  rename that breaks the running app.
- **Asked to edit an applied migration** → refuse; write a new forward migration instead (per AR-08).
- **Constraint would reject existing rows** → backfill/clean data first, add the constraint in the
  contract phase; if data can't satisfy it, escalate to backend-lead (WF-08) — don't drop the
  constraint silently.
- **Truly irreversible step** (e.g. destructive drop with no snapshot) → call it out explicitly in
  the note and confirm it's intended; default to reversible-by-design (per AR-08).

## Quality Gate (inline pass/fail before returning)
- [ ] Change restated; each affected datum has exactly one owning module — per AR-05.
- [ ] No applied migration was edited or renamed; corrections are new forward migrations — per AR-08.
- [ ] Destructive/tightening changes are split into expand→backfill→contract across deploys.
- [ ] New columns land nullable/defaulted first; `NOT NULL` only after backfill completes.
- [ ] Backfill is batched, idempotent, and re-runnable (no single unbounded UPDATE on a big table).
- [ ] Every index traces to a stated query; composite order = equality-then-range; no speculative indexes.
- [ ] Large-table indexes use `CONCURRENTLY`; no long write-blocking statements on hot tables.
- [ ] DB-level constraints (`NOT NULL`/`UNIQUE`/`FK` with `ON DELETE`/`CHECK`) enforce the invariants — per AR-05.
- [ ] `migration.sql` was Prisma-generated, then reviewed; `prisma validate` + client generation pass.
- [ ] Migration applied at least once against a scratch/shadow DB (or blocker flagged).
- [ ] Reversal path documented per phase; any irreversible step is explicitly justified — per AR-08.
- [ ] Stack is Prisma + Postgres per TS-02; no Knowledge rule pasted inline — per EF-01.

## References (pointers by rule ID; never inline a standard)
- Standards → cite by ID: AR-08 (forward-only, reversible-by-design migrations, database-owned),
  AR-05 (single source of truth per datum), TS-02 (Prisma + PostgreSQL stack); workflow EF-01,
  EF-03, WF-08. Never inline the rule body.
- Execution loop + Output Contract → `Knowledge/development-workflow.md`.
- Migration location convention → `prisma/migrations/<timestamp>_<slug>/migration.sql`.
