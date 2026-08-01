## AI Platform Lead — Reference (on-demand depth)

Loaded only when the AI Platform Lead needs deep decision logic or hits a failure mode. Not always-resident.

## <a id="decision"></a>Deep decision logic

### Provider abstraction — one seam (AI-01)
- All calls go through a single `LLMClient` seam: `complete(messages, schema?, budget)`. Feature code
  never imports a vendor SDK. Model choice, retries, caching, tracing, and fallbacks live behind the seam.
- Switching providers, adding a fallback model (AI-08), or changing default (TS-03) is a one-file change.
- Detect leak: `grep -rE "from ['\"](openai|@anthropic-ai|@google)" src/ai` returns hits OUTSIDE the seam.

### Structured output (AI-05)
- Prefer native tool/JSON-schema constraints from the provider. Validate the parsed object against the
  same schema before returning. NEVER regex-scrape free text, and never `eval`/parse untrusted JSON blind.
- On schema-validation failure: one bounded retry with the validator error fed back, then fail closed.

### RAG pipeline (AI-06)
- Chunk deliberately (semantic/structural boundaries, not fixed char windows only); record chunk provenance.
- Retrieve → rerank → assemble context with explicit source citations. Measure retrieval quality
  (recall@k, MRR) SEPARATELY from generation quality — hand the retrieval metrics to ai-evaluation.
- Cap context by budget (AI-08); drop lowest-scored chunks first, never silently truncate mid-source.

### Agent orchestration (LangGraph)
- Model the flow as an explicit state graph: typed state, named nodes, deterministic edges, a hard step/loop
  cap. No open-ended "keep calling the model until it stops". Irreversible/high-impact tool calls are
  human-gated (AI-10) — agents propose, a gate approves.

### Prompt-injection defense (AI-07)
- Retrieved docs and user input are DATA, never instructions. Keep them in clearly delimited, non-system
  channels. Tools exposed to an agent are least-privilege; a retrieved string can never escalate to an
  unsafe tool. Strip/deny tool-trigger patterns in untrusted content; log refusals to the trace.

### Tracing (AI-04) & budgets (AI-08)
- Every call emits a Langfuse span (TS-07): inputs, outputs, latency, token cost, model version, trace id.
- Each feature has a design-time cost + p95-latency budget; enforce with fallback model, caching, and
  max-tokens. A budget breach is a blocking defect, surfaced before ship.

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Scattered SDK Calls** — raw provider SDK imported in feature code, bypassing the seam.
  *Detect:* grep for vendor imports outside `src/ai/client/**`. *Fix:* route through `LLMClient` (AI-01).
- **FM-2 Regex Output Parsing** — scraping free text with regex instead of a schema.
  *Detect:* string/regex extraction of model output. *Fix:* tool/JSON-schema constraint + validate (AI-05).
- **FM-3 Injection-Blind RAG** — retrieved/user content concatenated into the system prompt as instructions.
  *Detect:* untrusted strings in the system channel or reachable by tools. *Fix:* delimit as data, least-privilege tools (AI-07).
- **FM-4 Untraced Call** — an LLM call with no Langfuse span; costs/latency invisible.
  *Detect:* a call path emitting no trace. *Fix:* wrap in the traced seam; assert span in tests (AI-04).
- **FM-5 Unbudgeted Feature** — no cost/latency budget, no fallback; a spike blows the bill or SLO.
  *Detect:* feature ships without a budget/fallback config. *Fix:* set budget + fallback/cache/max-tokens (AI-08).
- **FM-6 Ship-Without-Eval / Scope Leak** — launching with no eval harness, OR editing `prompts/**` or
  `evals/**` directly. *Detect:* no golden set; a diff touching the carve-outs. *Fix:* coordinate
  ai-evaluation (AI-03) and prompt-engineer (AI-02); author neither yourself.

## Responsibilities (full)
Beyond the always-loaded summary: own the provider abstraction and the traced call path as the single
seam for all model access; build and tune RAG pipelines and agent graphs; wire MCP/tool adapters and
vector-DB access with least privilege; maintain guardrails and injection defenses; set and enforce
per-feature cost/latency budgets with fallbacks. As OWNER of `Knowledge/ai-guidelines.md`, keep AI-*
canonical and arbitrate rule conflicts. Coordinate — never absorb — the `src/ai/prompts/**`
(prompt-engineer) and `src/ai/evals/**` (ai-evaluation) sub-domains. All governed by `AI-*`, `TS-*`,
`AR-*`, `CS-*` (cited by ID, never inlined — EF-01).
