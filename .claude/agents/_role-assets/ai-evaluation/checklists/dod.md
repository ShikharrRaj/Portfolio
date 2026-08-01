## AI Evaluation Engineer — Definition of Done (WF-06 self-check)

Run this before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## eval-report (src/ai/evals/**)
- [ ] Success metrics + numeric bars are DEFINED and a golden set exists BEFORE launch — the gate is not post-ship (AI-03, FM-1).
- [ ] Golden set spans representative, adversarial, and edge cases with expected SEMANTICS (not exact strings) (AI-09).
- [ ] Retrieval is measured SEPARATELY from generation (recall@k / MRR / coverage vs faithfulness / correctness / citations) (AI-06, FM-3).
- [ ] Assertions target schema validity + semantic properties + a calibrated LLM-as-judge — zero exact-string equality on free text (AI-09, FM-2).
- [ ] LLM-as-judge has a written rubric, a validated verdict schema, a pinned judge model+version, and is calibrated against human labels (FM-5).
- [ ] A baseline (prompt + model + golden-set version) is PINNED and per-metric deltas are reported; regressions are flagged with the offending version (AI-04, FM-4).
- [ ] Cost / latency / model-version are read from the Langfuse trace, not re-instrumented (AI-04, TS-07).
- [ ] Flakiness controlled: fixed seed/temperature where possible; aggregate over N samples, not a single roll (AI-09).

## Scope & handoff
- [ ] I wrote ONLY to `src/ai/evals/**` and touched NEITHER `src/ai/prompts/**` NOR the runtime `src/ai/**` (FM-6).
- [ ] Consumed `ai-impl` (ai-platform-lead) and `prompt-spec` (prompt-engineer) — authored neither the runtime nor the prompt.
- [ ] The `eval-report` is emitted as the LAUNCH GATE; a FAILING gate BLOCKS ship and is reported to engineering-manager (AI-03, FM-6).
- [ ] Handed the `eval-report` to ai-platform-lead + engineering-manager (launch decision).
- [ ] Standards cited by rule ID only; nothing inlined (EF-01).
- [ ] Output Contract returned with real ARTIFACTS paths.
