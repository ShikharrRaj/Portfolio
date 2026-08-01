---
name: build-eval-harness
description: >
  Produces an eval-report plus a runnable eval harness under src/ai/evals for an LLM
  feature: success metrics + a golden set defined before launch, LLM-as-judge where
  scoring is subjective, schema/semantic assertions, retrieval scored separately from
  generation, and version regression — with a failing gate that blocks launch. Use when
  an LLM/RAG/agent feature needs evals before it ships. Follows Knowledge/ai-guidelines.md#AI-03.
when_to_use: eval harness, golden set, LLM-as-judge, eval report, RAG retrieval eval, prompt/model regression, no eval no launch, evaluate LLM feature before shipping
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

## Purpose & Preconditions
Turn an LLM/RAG/agent feature into a decision-complete, runnable eval harness plus an
eval-report, so a launch decision rests on measured quality — not vibes. Preconditions:
the feature's intended behavior and inputs are known; the target repo exposes a place for
`src/ai/evals`; the current actor holds write-scope for AI code. The golden set and success
metrics MUST be defined **before** launch (per AI-03) — if the feature has already shipped
without evals, that is itself a finding to report, not a reason to skip. Ambiguous success
criteria or missing feature spec → stop and escalate (WF-08); do not invent metrics.

## Inputs / Outputs (contract)
Inputs:
- Feature spec / prompt + model config — what the feature is supposed to do, its inputs
  and expected output shape. From the PRD, arch-spec, or the prompt/agent under test.
- Existing evals (if any) — `src/ai/evals/` for deltas and prior golden cases.
- Standards — cited by ID, never re-read wholesale (per EF-01, EF-03).

Outputs (under `src/ai/evals/`):
- `golden/*.{json,jsonl}` — the golden set: input + expected-property/reference per case,
  covering happy paths, edge cases, and known failure modes.
- `metrics.md` — named success metrics, each with a pass threshold and how it is measured.
- Harness code (`*.eval.*` or runner) — loads the golden set, runs the feature, scores it,
  and exits non-zero when a metric is below threshold (per AI-03).
- `eval-report.md` — per-metric scores, retrieval-vs-generation breakdown, regression vs the
  prior prompt/model version, and an explicit **launch: pass/block** verdict.

## Steps (deterministic)
1. **Restate the feature + scope.** Read the spec/prompt; write the feature's job and its
   expected output shape as ≤3 bullets at the top of `eval-report.md`. If success is
   undefined or contradictory, stop and escalate (WF-08); do not guess metrics.
2. **Define success metrics BEFORE building.** In `metrics.md`, name each metric (e.g.
   task-accuracy, schema-validity, retrieval-recall@k, groundedness, refusal-correctness),
   its measurement method, and a numeric **pass threshold**. Thresholds are set now, before
   seeing scores — not tuned afterward to make the run pass (per AI-03).
3. **Build the golden set.** Create `golden/` cases covering happy paths, edge cases, and
   known failure modes. Each case carries an input and an expected *property* or reference
   answer — never a brittle exact-string expectation (per AI-09). Aim for coverage of every
   metric; a metric with no golden case is a gap to fix here.
4. **Separate retrieval from generation.** If the feature retrieves (RAG/tools), score
   retrieval on its own — recall/precision@k, cited-source correctness — independently from
   generation quality (per AI-06). Never let good generation hide bad retrieval, or vice
   versa; report the two as distinct metrics.
5. **Assert schema + semantics, not strings.** For each output, validate structure/schema
   and semantic correctness (per AI-09). Deterministic checks (schema, required fields,
   value ranges) run as code. Set/record temperature deliberately so runs are comparable.
6. **Add LLM-as-judge only where needed.** For subjective/open-ended dimensions that a
   deterministic check can't score, use an LLM-as-judge with a fixed rubric and a stable
   judge model+prompt. Keep judge config versioned; do not use a judge where a schema or
   exact-property assertion would do.
7. **Wire regression across versions.** Record the prompt version and model id with each
   run. Compare current scores against the prior version's baseline and flag any metric
   that regressed, so a prompt/model change can't silently degrade quality.
8. **Make the harness a gate.** The runner exits non-zero when any metric is below its
   threshold (step 2). Keep it invocable from CI/one command; note that command in the
   report. A failing gate **blocks launch** — it is not advisory (per AI-03).
9. **Run it.** Execute the harness against the current feature version; capture per-metric
   scores, the retrieval/generation split, and the version-regression delta.
10. **Write eval-report.md.** Record per-metric score vs threshold, retrieval-vs-generation
    breakdown, regression vs prior version, unresolved gaps, and a single explicit
    **launch: pass/block** verdict driven by the gate — never override a red gate with prose.
11. **Run the Quality Gate** below. Fix or flag every failed item before returning.

## Decision Points
- If success criteria are undefined/contradictory → escalate (WF-08); do not invent metrics.
- If the feature retrieves context → add a separate retrieval metric + golden cases (per
  AI-06); a RAG feature with only end-to-end scoring is incomplete.
- If a dimension is subjective and no deterministic check fits → LLM-as-judge with a fixed
  rubric (step 6). If a schema/property assertion *would* fit → prefer it; skip the judge.
- If any metric is below threshold → verdict is **block**; report it, do not launch (per
  AI-03). Never retune a threshold after the run to force a pass.
- If a new prompt/model version regresses a metric vs baseline → flag it; a regression is a
  block condition unless the CEO explicitly accepts the trade-off.
- If a golden case expects an exact string → rewrite it as a schema/semantic assertion (per
  AI-09) before it lands.

## Quality Gate (inline)
- [ ] Feature job + output shape restated at top of `eval-report.md`.
- [ ] Every success metric has a numeric threshold set before the run — per AI-03.
- [ ] Golden set exists and covers happy paths, edge cases, and known failure modes.
- [ ] No golden case asserts an exact output string; all assert schema/semantics — per AI-09.
- [ ] Temperature is set deliberately and recorded — per AI-09.
- [ ] If the feature retrieves, retrieval is scored separately from generation — per AI-06.
- [ ] LLM-as-judge (if used) has a fixed rubric and versioned judge model+prompt.
- [ ] Prompt version + model id recorded; scores compared against prior-version baseline.
- [ ] Harness exits non-zero below threshold and blocks launch — per AI-03.
- [ ] `eval-report.md` states one explicit launch: pass/block verdict driven by the gate.
- [ ] No Knowledge rule pasted inline; all cited by ID — per EF-01.

## References
- Standards → cite by rule ID: AI-03 (eval harness + golden set before launch, no eval no
  launch), AI-06 (measure retrieval separately from generation), AI-09 (deliberate
  temperature; assert schema/semantics, never exact strings); workflow EF-01, EF-03, WF-08.
  Never inline.
- Execution loop + Output Contract → `Knowledge/development-workflow.md`.
- Eval location convention → `src/ai/evals/` (golden set, metrics, harness, report).
