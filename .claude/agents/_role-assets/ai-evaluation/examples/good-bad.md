## AI Evaluation Engineer — Good vs Bad eval-report (on-demand)

## Feature: "Answer questions over uploaded docs" (RAG + summarization)

### ✅ GOOD — gate-before-launch, retrieval vs generation split, semantic assertions, versioned baseline
```ts
// src/ai/evals/answer.eval.ts — the launch gate (AI-03)
const GOLDEN = loadGolden("answer-v3");            // representative + adversarial + edge, expected SEMANTICS
const BASELINE = { prompt: "answer@v2", model: "sonnet@2025-06", suite: "answer-v3" };  // pinned (AI-04)

// --- RETRIEVAL, scored separately (AI-06) ---
const r = await scoreRetrieval(GOLDEN);            // recall@5, MRR, source coverage on labeled query→doc
expect(r.recallAt5).toBeGreaterThanOrEqual(0.85);  // bar from product success criteria

// --- GENERATION, scored separately (AI-06) ---
for (const c of GOLDEN) {
  const out = await runAnswer(c.query);            // exercises ai-impl call path; reads Langfuse trace (AI-04)
  expect(() => AnswerSchema.parse(out)).not.toThrow();        // AI-09: schema, not exact string
  expect(out.citations.every(id => c.validSourceIds.includes(id))).toBe(true);  // semantic property
  expect(await judge(out, c.rubric)).toMatchObject({ faithful: true });         // calibrated LLM-as-judge
}
const report = summarize({ baseline: BASELINE, GOLDEN });     // per-metric delta vs baseline
expect(report.regressedMetrics).toHaveLength(0);   // a regression BLOCKS launch
```
```
eval-report: answer@v3 vs baseline answer@v2
  retrieval  recall@5 0.89 (+0.02)  MRR 0.81 (+0.01)      PASS
  generation faithfulness 0.94 (-0.01)  citation-valid 1.00  PASS
  cost/call $0.011 (budget $0.02)  p95 1.9s (budget 3s)   PASS   [from trace, AI-04]
  VERDICT: PASS — cleared to launch
```
Why good: metrics + golden set exist before ship (FM-1 avoided); retrieval and generation reported on
separate axes (FM-3 avoided); assertions target schema + semantics + a calibrated judge, never exact
strings (FM-2 avoided); a pinned baseline yields per-version deltas so a regression is caught (FM-4
avoided); cost/latency read from the trace, not re-instrumented; the harness lives in `src/ai/evals/**`
only — prompt owned by prompt-engineer, runtime by ai-platform-lead (FM-6 avoided).

### ❌ BAD — eval after ship, blended metric, exact-string assert, no baseline, gate waved
```ts
// src/ai/evals/answer.eval.ts
test("answer is correct", async () => {
  const out = await runAnswer("What is the refund window?");
  expect(out).toBe("The refund window is 30 days.");   // FM-2: exact-string assert on non-deterministic output (AI-09)
  // no retrieval score, no generation score split                // FM-3: blended/absent metric (AI-06)
  // no golden set, no bar, added the week after launch           // FM-1: eval-after-ship (AI-03)
  // no baseline/version pin, so no regression signal             // FM-4: regression-blind (AI-04)
});
// ...and when it failed on a wording drift, we shipped anyway.    // FM-6: gate waved on a red result (AI-03)
```
Why bad: the gate arrived after launch, so nothing blocked a bad ship; a single exact-string assertion
flakes on any legitimate rewording; retrieval and generation are conflated into nothing; with no pinned
baseline a silent regression is invisible; and passing a launch on a failing eval defeats the entire
role. Correct move: the GOOD version above — gate before launch, split axes, semantic assertions,
versioned baseline, and BLOCK ship + report to engineering-manager on any red result.

### Scope carve-out: fixing the prompt or runtime yourself
❌ Anti-pattern: the AI Evaluation Engineer edits `src/ai/prompts/answer.ts` or the RAG code in
`src/ai/rag/answer.ts` to "make the eval green" (FM-6). ✅ Correct: file the failing case to
prompt-engineer (prompt) or ai-platform-lead (runtime); you own ONLY `src/ai/evals/**` and the verdict.
