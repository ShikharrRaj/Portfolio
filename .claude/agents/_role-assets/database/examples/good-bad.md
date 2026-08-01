# Database Engineer — Good vs Bad migration (on-demand)

## Task: make `orders.customer_email` non-null and add a lookup index on a large live table

### ✅ GOOD
```sql
-- Migration A (expand): additive, safe on live data
ALTER TABLE "orders" ADD COLUMN "customer_email_tmp" text; -- nullable, tolerant
-- backfill in batches (separate step / job), then validate no NULLs remain

-- Migration B (index): to the REAL access pattern from the api-contract (lookup by customer_email)
CREATE INDEX CONCURRENTLY "orders_customer_email_idx" ON "orders" ("customer_email"); -- no write lock

-- Migration C (contract): only AFTER backfill + validation confirm zero NULLs
ALTER TABLE "orders" ALTER COLUMN "customer_email" SET NOT NULL;
```
Three forward-only migrations (per AR-08): expand → backfill → contract, each deploys independently and is safe to
stop between. Index created CONCURRENTLY (no write lock) and matches the api-contract's lookup predicate (per AR-05).
The model field itself was defined by backend-lead; this only implements the migration. EXPLAIN ANALYZE confirmed
the index is used before it shipped.
Why good: forward-only + reversible-by-design (AR-08, no FM-1/FM-3); index to real access pattern (AR-05, no FM-2);
constraint enforced in DB after backfill (TS-02, no FM-6); no model redefinition (no FM-4).

### ❌ BAD
```sql
-- one destructive step on a live, populated table; also redefines the model and guesses an index
ALTER TABLE "orders" ALTER COLUMN "customer_email" SET NOT NULL;   -- FM-3: fails on existing NULL rows
ALTER TABLE "orders" RENAME COLUMN "customer_email" TO "email";    -- FM-4: redefining backend's model
CREATE INDEX "orders_status_idx" ON "orders" ("status");           -- FM-2: no query behind it, blocks writes
```
Then hand-editing the previous migration file to "fix" the failure.
Why bad: single-shot NOT NULL breaks on live NULLs with no expand/backfill (FM-3 → AR-08); renames a model field
that belongs to backend-lead (FM-4 → AR-05); adds a guessed, unmeasured index that locks writes (FM-2); and
rewriting an applied migration destroys forward-only history (FM-1 → AR-08). Fails review and DoD.
