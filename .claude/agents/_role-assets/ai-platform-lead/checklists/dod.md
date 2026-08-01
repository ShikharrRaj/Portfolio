## AI Platform Lead — Definition of Done (WF-06 self-check)

Run this before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## ai-impl (src/ai/**)
- [ ] Every model call routes through the provider abstraction — zero raw vendor SDK imports in feature code (AI-01, FM-1).
- [ ] Structured outputs use tool/JSON-schema constraints and are validated; no regex parsing of free text (AI-05, FM-2).
- [ ] Retrieved/user content is a delimited DATA channel — never in the system channel, never able to trigger unsafe tools (AI-07, FM-3).
- [ ] Every LLM call emits a trace (inputs, outputs, latency, token cost, model version) (AI-04, FM-4).
- [ ] Each feature has a design-time cost + p95-latency budget enforced with fallback/caching/max-tokens (AI-08, FM-5).
- [ ] RAG: deliberate chunking, cited sources, retrieval quality measured separately from generation (AI-06).
- [ ] Agent graphs have typed state, a hard step/loop cap, and human gates on irreversible actions (AI-10).
- [ ] Default model / tracing per the approved stack (TS-*).

## Scope & handoff
- [ ] I wrote ONLY to `src/ai/**` and touched NEITHER `src/ai/prompts/**` nor `src/ai/evals/**` (FM-6).
- [ ] Coordinated with ai-evaluation — a golden-set eval exists before launch; no eval, no launch (AI-03).
- [ ] Prompts consumed from prompt-engineer's `prompt-spec`, not authored inline (AI-02).
- [ ] Handed the `ai-impl` to code-reviewer + security-reviewer + backend-lead (integration).
- [ ] Standards cited by rule ID only; nothing inlined (EF-01).
- [ ] Output Contract returned with real ARTIFACTS paths.
