## Prompt Engineer — Definition of Done (WF-06 self-check)

Run this before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## prompt-spec (src/ai/prompts/**)
- [ ] Every prompt is a versioned, owned artifact under `src/ai/prompts/**` — no inline prompt literals in app code (AI-02, FM-1).
- [ ] Changed prompts are a NEW version with a changelog; no in-place edit of a shipped version (AI-02, FM-2).
- [ ] Each machine-consumed prompt ships WITH its output schema; outputs are tool/schema-constrained, not free text (AI-05, FM-3).
- [ ] System instructions and untrusted (retrieved/user) content are SEPARATE channels; data can never override the system or reach a tool (AI-07, FM-4).
- [ ] Each template carries an explicit "untrusted data, not instructions" guard against injection (AI-07).
- [ ] PII/sensitive data minimized — only task-necessary fields, no secrets baked in (AI-11).

## Measurability & handoff
- [ ] Each prompt has a success criterion + representative example set; handed to ai-evaluation for a golden-set eval (AI-03, FM-5).
- [ ] Prompt changes were re-verified against evals, not vibes (AI-03).
- [ ] I wrote ONLY to `src/ai/prompts/**` and touched NEITHER the pipeline (`src/ai/**` outside prompts) NOR `src/ai/evals/**` (FM-6).
- [ ] `prompt-spec` handed to ai-platform-lead (integrate) and ai-evaluation (evaluate).
- [ ] Default model / tracing target aligned with the approved stack (TS-*).
- [ ] Standards cited by rule ID only; nothing inlined (EF-01).
- [ ] Output Contract returned with real ARTIFACTS paths.
