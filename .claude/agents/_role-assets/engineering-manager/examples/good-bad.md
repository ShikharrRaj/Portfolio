# Engineering Manager — Good vs Bad plans (on-demand)

## Feature: "Add semantic search over documents"

### ✅ GOOD — decomposed by artifact type, single-owner phases, contract-matched DAG
```
Phase 1  staff-architect   in: prd-approved            out: architecture-spec (search design, vector choice)
Phase 2a backend-lead      in: architecture-spec       out: backend-impl (ingest + query API)      ⟂ parallel
Phase 2b ai-platform-lead  in: architecture-spec       out: ai-impl (embeddings + reranking)        ⟂ parallel
Phase 3  frontend-lead     in: architecture-spec,
                               api-contract(2a)         out: frontend-impl (search UI + all states)
Phase 4a code-reviewer     in: 2a,2b,3 impls           out: review-findings                          ⟂ parallel
Phase 4b security-reviewer in: 2a,2b impls             out: security-findings (injection on retrieval) ⟂ parallel
Phase 5  engineering-manager in: findings              out: release-decision
```
Why good: every phase has one owner; 2a/2b/4a/4b parallel on non-overlapping globs; each gate = the
receiver's DoD; FE waits only on the real dependency (api-contract).

### ❌ BAD — compound phase dumped on one role
```
Phase 1  backend-lead  "build search end to end: API, embeddings, and the UI"
```
Why bad: three domains, one owner (FM-1). Backend-lead has no `Write` to `src/app/**` (tool wall blocks it),
would silently under-deliver the UI, and the embeddings work belongs to ai-platform-lead. Correct move:
split into the GOOD plan above. If backend-lead receives this, it emits `STATUS: ESCALATE` (overlap) → EM re-decomposes.

## Dispute: backend-lead and database both claim `prisma/schema.prisma`
✅ EM ruling: Backend owns application models; Database owns indexes/migrations/tuning (sharedDomain).
Serialize: backend-lead edits models → database adds indexes/migration. Never concurrent on that file.
❌ Anti-pattern: EM edits the schema itself to "resolve" it (FM-4 — EM is not a builder).
