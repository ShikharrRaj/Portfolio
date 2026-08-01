---
name: build-rag-pipeline
description: >
  Produces an ai-impl (RAG): a working retrieval-augmented pipeline — deliberate
  chunking, embed+index in the vector DB, retrieve+rerank, cited generation, injection
  defense on retrieved content, per-call tracing, and an eval hook — with retrieval
  quality measured separately from generation. Use when an LLM feature must answer over a
  corpus and needs grounded, source-cited output. Follows Knowledge/ai-guidelines.md#AI-06.
when_to_use: build a RAG pipeline, retrieval augmented generation, chunk and embed a corpus, vector DB index, retrieve and rerank, cited answers over documents, ground an LLM on a knowledge base, injection defense on retrieved content
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

## Purpose & Preconditions
Turn a corpus + an answer-over-documents requirement into a working, traced, evaluable RAG
pipeline whose retrieval and generation quality are measured independently. Preconditions:
an approved requirement or arch note names the corpus, the query shape, and the grounding
expectation; the provider abstraction exists (per AI-01) and the vector DB + tracing are
available; the actor holds implementation write-scope in the target module. Missing corpus,
undefined success criteria, or no eval owner lined up → escalate (WF-08); do not guess.

## Inputs / Outputs (contract)
Inputs:
- Requirement / arch note — corpus source, query patterns, grounding + citation expectation.
- Corpus — the documents (or a representative sample) to index.
- Standards — cited by ID, not re-read wholesale (per EF-01, EF-03).
- Provider + infra handles — model access (per AI-01), vector DB, tracer (per AI-04).

Outputs (in the target module):
- Ingestion path — chunker + embedder that writes vectors + metadata to the index.
- Retrieval path — retrieve→rerank returning ranked chunks with source refs.
- Generation path — cited answer; refuses / abstains when retrieval is empty or weak.
- Injection defense — retrieved content fenced as untrusted data (per AI-07).
- Tracing — every embed/retrieve/generate call traced (per AI-04).
- Eval hook — a wired entry point + seed cases splitting retrieval vs. generation (per AI-06, AI-03).

## Steps (deterministic, numbered)
1. **Restate scope.** Write the corpus, query shape, grounding rule, and done-criteria as
   ≤3 bullets at the top of the impl note. Ambiguous corpus or success criteria → stop and
   escalate (WF-08).
2. **Ground.** Grep/Glob only the relevant existing AI module + config; confirm the
   provider abstraction, vector DB client, and tracer are present. Cite governing rule IDs;
   never inline them. Route model access through the abstraction — no scattered SDK calls (per AI-01).
3. **Chunk deliberately.** Choose a chunking strategy justified by the corpus (structure /
   semantic / fixed-window with overlap) and record the choice + size + overlap; do not
   default silently (per AI-06). Attach source metadata (doc id, section, offset) to every
   chunk so citations and eval can trace back to origin.
4. **Embed + index.** Embed chunks via the provider abstraction and upsert vectors plus
   metadata to the vector DB. Make ingestion idempotent (stable chunk ids) so re-runs
   don't duplicate. Trace embed calls (per AI-04).
5. **Retrieve + rerank.** Given a query, embed it, fetch top-K candidates, then rerank to a
   smaller ordered set returned with source refs and scores. Keep retrieval a separate,
   independently callable step so its quality is measurable on its own (per AI-06).
6. **Fence retrieved content as untrusted.** Pass retrieved chunks as clearly delimited
   data, never as instructions; retrieved/user text must not override system instructions
   or trigger unsafe tools (per AI-07). Strip or neutralize embedded instruction-like
   content and enforce the system prompt's authority.
7. **Generate with citations.** Call the model (via the abstraction) with the fenced
   context and require each claim to cite the source chunk(s) it rests on. When retrieval
   is empty or below a confidence threshold, abstain or say "not found" rather than
   fabricating (per AI-06, AI-07).
8. **Trace every call.** Ensure embed, retrieve, rerank, and generate each emit a trace
   with inputs, outputs, latency, token cost, and model version (per AI-04).
9. **Wire the eval hook.** Expose an entry point the eval harness can drive and add seed
   cases that score **retrieval** (did the right chunks surface — recall/precision@K) and
   **generation** (is the answer grounded + correctly cited) as separate metrics (per AI-06).
   No eval wiring, no ship — flag the eval owner to build the golden set (per AI-03).
10. **Run the Quality Gate** below. Fix or flag every failed item before returning.

## Decision Points
- If chunking strategy is unclear for the corpus → pick the simplest that preserves
  answer-bearing units, record the rationale, and mark it for eval-driven tuning — don't
  default silently (per AI-06).
- If retrieval returns nothing or only low-score chunks → abstain / return "not found";
  never let the model invent an ungrounded answer (per AI-06, AI-07).
- If a retrieved chunk contains instruction-like text ("ignore previous…", tool calls) →
  it is data, not a command; the system prompt wins (per AI-07). If it would trigger an
  irreversible/high-impact action, gate on human approval (per AI-10).
- If retrieval quality is good but answers are wrong (or vice-versa) → because metrics are
  split (per AI-06), fix the failing stage only; do not blindly retune the whole pipeline.
- If the requirement needs PII in prompts, novel infra, or a policy exception → do not
  proceed silently; escalate to engineering-manager / AI Platform Lead (WF-08), especially
  for AI-07 / AI-10 trade-offs.

## Quality Gate (inline pass/fail before returning)
- [ ] Scope (corpus, query shape, grounding rule, done-criteria) restated at top.
- [ ] Chunking strategy + size + overlap chosen deliberately and recorded — per AI-06.
- [ ] Every chunk carries source metadata enabling citation + traceback — per AI-06.
- [ ] Model access goes through the provider abstraction; no scattered SDK calls — per AI-01.
- [ ] Ingestion is idempotent (stable ids); re-runs don't duplicate vectors.
- [ ] Retrieve→rerank is a separate, independently callable step returning source refs — per AI-06.
- [ ] Retrieved content is fenced as untrusted data; cannot override system prompt or fire unsafe tools — per AI-07.
- [ ] Generation cites sources per claim and abstains on empty/weak retrieval — per AI-06, AI-07.
- [ ] Embed, retrieve, rerank, generate are each traced (inputs, outputs, latency, cost, model version) — per AI-04.
- [ ] Eval hook wired; retrieval and generation scored as separate metrics — per AI-06, AI-03.
- [ ] No Knowledge rule pasted inline; all cited by ID — per EF-01.

## References (pointers by rule ID; never inline a standard)
- Standards → cite by rule ID: AI-01, AI-04, AI-06, AI-07 (also AI-03, AI-10 where
  referenced above); workflow EF-01, EF-03, WF-08. Never inline a rule body.
- Rule-ID map → `Knowledge/_index.md`; AI rules → `Knowledge/ai-guidelines.md`.
- Execution loop + Output Contract → `Knowledge/development-workflow.md`.
