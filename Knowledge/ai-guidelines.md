# AI Guidelines

> Status: canonical (v1.0) · Owner: ai-platform-lead · Consumed-by: prompt-engineer, ai-evaluation, backend-lead
> Cited as `per AI-NN`. One enforceable rule per bullet; IDs are stable and never reused or renumbered.

## Rules

### Provider, prompts & tracing
- **AI-01** Model access goes through a provider abstraction; no direct SDK calls scattered in feature code. Default model per TS-03.
- **AI-02** Every prompt is versioned, owned (`prompt-engineer`), and stored under `src/ai/prompts/`; no inline prompt literals in app code.
- **AI-03** Every LLM feature has an eval harness (`ai-evaluation`) with a golden set before it ships; no eval, no launch.
- **AI-04** All LLM calls are traced (Langfuse, per TS-07): inputs, outputs, latency, token cost, model version.
- **AI-05** Structured outputs use tool/schema constraints, not regex parsing of free text.
- **AI-06** RAG: chunk deliberately, cite sources, and measure retrieval quality separately from generation quality.
- **AI-07** Guard against prompt injection: treat retrieved/user content as untrusted; never let it override system instructions or trigger unsafe tools.
- **AI-08** Cost & latency budgets per feature are set at design time and enforced (fallback models, caching, max-tokens).
- **AI-09** Non-determinism is handled: set temperature deliberately, and never depend on exact output strings in tests — assert on schema/semantics.
- **AI-10** Human-in-the-loop for high-impact actions; agents propose, humans (or gated policies) approve irreversible operations.
- **AI-11** PII and sensitive data are minimized in prompts and never sent to a provider without a data-processing basis.

### Model routing & fallbacks
- **AI-12** Model selection is declared per task (capability tier, not a hardcoded string) in one routing config; feature code names the task, not the model.
- **AI-13** Every production call path defines an ordered fallback chain (cheaper/alternate model or provider) that engages on error, timeout, or rate-limit; a total failure returns a typed error, never a silent empty result.
- **AI-14** Model/version upgrades are gated by re-running the eval suite (AI-03); no swap ships on a regression above the agreed threshold.
- **AI-15** Retries use bounded exponential backoff with jitter and a hard attempt cap; non-retryable errors (4xx except 429) are never retried.

### Context management
- **AI-16** Context assembly is explicit and budgeted: token counts for system, history, retrieved, and user segments are computed before the call and must fit the model window with headroom.
- **AI-17** Long histories are compacted via summarization or truncation with a documented, deterministic strategy; never blindly overflow or drop the system prompt.
- **AI-18** System instructions and role boundaries are pinned at the top of context and are never displaceable by user or retrieved content (reinforces AI-07).

### Caching & streaming
- **AI-19** Prompt/context caching is used where inputs are stable (system prompts, few-shot, large fixed context); cache keys are versioned with the prompt (AI-02) so a prompt change invalidates the cache.
- **AI-20** Response caching for identical requests is opt-in per task, keyed on normalized inputs + model + prompt version, with an explicit TTL; never cache personalized or PII-bearing outputs across users.
- **AI-21** User-facing generation streams tokens; stream handlers tolerate mid-stream cancellation and errors, always finalizing traces (AI-04) and releasing resources.

### Structured output & tool-use safety
- **AI-22** Every structured/tool output is validated against its schema server-side; on validation failure, repair or reject deterministically — never pass unvalidated model output downstream.
- **AI-23** Tools exposed to models are least-privilege, declaratively described, and side-effecting tools are idempotent or guarded; destructive tools require the AI-10 gate.
- **AI-24** Tool arguments are validated and authorized against the caller's permissions before execution; the model never escalates privilege by requesting a tool.
- **AI-25** Agent/tool loops have a hard step ceiling and wall-clock timeout; on exhaustion the loop halts with a typed outcome, never runs unbounded.

### RAG chunking & citation
- **AI-26** Chunking strategy (size, overlap, boundary) is documented per corpus and tuned via retrieval eval (AI-06); embeddings are versioned and re-indexed on model change.
- **AI-27** Generated claims cite retrieved source IDs; answers unsupported by retrieval are refused or flagged, not fabricated.
- **AI-28** Retrieval respects access control: a user only retrieves chunks they are authorized to see; tenancy/permission filters apply at query time, not post-hoc.

### Eval gates, budgets & observability
- **AI-29** Eval gates run in CI on prompt, model, retrieval, or tool changes; quality, safety, and regression thresholds are blocking, not advisory.
- **AI-30** Per-feature cost and p95 latency budgets (AI-08) are monitored in production with alerts; sustained breach triggers rollback or downgrade to a fallback tier.
- **AI-31** Safety and refusal behavior is eval-covered: jailbreak, injection, and toxic-input suites run alongside quality evals before launch and on change.

### PII & human-in-the-loop
- **AI-32** PII sent to providers (when AI-11's basis exists) is redacted or tokenized where the task allows, and zero-retention/no-training terms are confirmed for the endpoint.
- **AI-33** Prompts, completions, and traces (AI-04) inherit the data's retention and deletion policy; PII in logs is masked and honors deletion requests.
- **AI-34** Human-in-the-loop decisions (AI-10) are auditable: the approving identity, inputs, model output, and outcome are recorded and retained per policy.

## Rationale
Versioned prompts, mandatory evals, and full tracing turn LLM features from demos into maintainable,
measurable production systems where AI specialists collaborate through contracts. The added rules make
that guarantee hold under real load: routing and fallbacks keep features available when a model fails;
context, caching, and streaming rules keep them fast and affordable; tool-use, RAG, and PII rules keep
them safe and compliant; and blocking eval gates keep every change honest. Together they make LLM
behavior predictable, attributable, and reversible — the same bar we hold all production code to.

## Exceptions & how to request one
Raise with the AI Platform Lead with a written risk trade-off, an owner, and an expiry date; log it in the
project escalation folder. Exceptions to safety- and cost-critical rules — **AI-03, AI-07, AI-10, AI-13,
AI-22, AI-24, AI-28, AI-29, AI-31, AI-32** — additionally require CEO sign-off and a time-boxed remediation
plan; they are never granted as a standing default. All other rules may be waived per-feature at design
time when the trade-off is documented and the eval suite (AI-03) still passes.
