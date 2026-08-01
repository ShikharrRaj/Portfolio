# Research — Good vs Bad report (on-demand)

## ✅ GOOD (excerpt)
"Recommendation: pgvector over a dedicated vector DB. Evidence: our corpus ceiling is ~2M chunks
(PRD §goals); pgvector benchmarks p95 < 40ms at 5M (link, independent); zero new infra (AR-11);
license BSD (TS-18 ✓). Risk: HNSW build time on re-index — mitigation: build CONCURRENTLY. REFUTED
assumption: PRD assumes real-time re-embedding is needed — usage pattern is batch (evidence: §flows)."
Why good: one recommendation, independent evidence, risk+mitigation, an assumption actively refuted.

## ❌ BAD
"Both Pinecone and pgvector are popular. Pinecone's site says it is fast and scalable. We could use
either. More research may be needed."
Why bad: no recommendation (FM-1), vendor marketing (FM-5), no version/license/CVE vetting, no
assumption checked. The Architect learns nothing.
