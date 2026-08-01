# Staff Architect — Good vs Bad architecture-spec (on-demand)

## Feature: "Add semantic search over user documents"

### ✅ GOOD architecture-spec (excerpt)
```
## Modules (owner Lead)
- ingest-service (backend-lead)   : accepts docs, chunks, enqueues embedding jobs. Owns Document, Chunk.
- embedding-worker (ai-platform-lead): consumes jobs, calls provider abstraction, writes vectors. Owns nothing durable except vector rows.
- search-api (backend-lead)       : query -> vector search + rerank -> results. Owns nothing; reads Chunk + vectors.
- search-ui (frontend-lead)       : query box + result states. Consumes search-api contract.

## Data ownership
- Document, Chunk        -> owned by ingest-service (single writer, per AR-05)
- vector index           -> owned by embedding-worker (write) / search-api (read only)

## Contracts
- POST /ingest {file} -> 202 {documentId}        (versioned v1)
- GET  /search {q,k}  -> 200 {results[]}          (versioned v1)

## Cross-cutting
- authz: every endpoint behind session guard (per AR-10)
- observability: LLM calls traced via Langfuse (per AI-04)
- error taxonomy: retryable vs terminal; idempotency key on /ingest (per AR-06)

## NFR budgets (gate: performance)
- /search p95 < 400ms; cost < $0.002/query; error budget 0.1%

## Decisions
- ADR-001 pgvector vs dedicated vector DB -> pgvector (fits scale; revisit at >5M chunks)
- ADR-002 rerank in search-api vs worker  -> search-api (latency)
```
Why good: each module has ONE owner Lead; data has a single writer; boundaries have versioned contracts;
NFRs are explicit and gated; every real choice is an ADR. The EM can sequence directly from this; Leads
can build without re-deciding structure.

### ❌ BAD architecture-spec
```
Build a search feature. Use a microservice for search. Add embeddings. Make it fast and scalable.
Frontend calls the backend. Store vectors somewhere. We'll figure out reranking later.
```
Why bad: no module→owner mapping (EM can't route); no data ownership (invites two-writer bugs, violates
AR-05); no contracts (Leads will invent incompatible ones); "fast and scalable" with no NFR budget
(FM-5); zero ADRs for real decisions (FM-6); "figure out later" leaves a design question implicit (DoD fail).
This is a wish, not an architecture.

## Boundary judgment
❌ Splitting `search-api` and a separate `rerank-service` that only rerank-then-return → anemic boundary
(FM-2): pure network cost, no independent ownership. ✅ Keep rerank inside search-api unless an ADR shows a
distinct scaling need.
