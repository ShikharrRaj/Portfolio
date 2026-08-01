---
name: review-code-pass
description: >
  Produces review-findings for a scoped diff: correctness bugs first, then
  reuse/simplify/efficiency, each as file:line + why + suggested fix + cited CS
  rule, with every bug verified real before it is flagged. Use when a change set
  needs a read-only review before merge. Follows Knowledge/coding-standards.md#CS-06.
when_to_use: review this diff, code review, find bugs, correctness pass, reuse/simplification review, pre-merge review, verify a change before merge
allowed-tools: Read, Grep, Glob, Bash
---

## Purpose & Preconditions
Produce a decision-complete set of review-findings for a scoped change set, ordered
correctness-first, so the author can fix real defects fast without wading through noise.
This is a **read-only** pass: the actor returns findings and NEVER edits code. Preconditions:
a diff or explicit file/line scope exists; the actor can read the repo and run read-only
commands (`git diff`, `git log`, tests, the linter). If scope is undefined or the diff is
empty, stop and ask for the scope — do not review the whole repo (per EF-03).

## Inputs / Outputs (contract)
Inputs:
- Change set — a `git diff` range, PR, or explicit file:line list defining what to review.
- Governing standards — cited by rule ID, never re-read wholesale (per EF-01, EF-03).
- Optional context — the PRD/spec or architecture-spec the change claims to satisfy.

Outputs (returned in the Output Contract, not written to files):
- `review-findings` — an ordered list; **correctness bugs first**, then reuse/simplify/
  efficiency. Each finding = `file:line` + **why it is wrong** + **suggested fix** + **cited
  CS rule ID**. Each correctness bug also states the concrete trigger that makes it fail.
- Verdict line — `approve` / `request-changes`, with the count of blocking (correctness)
  findings.

## Steps (deterministic, numbered)
1. **Fix scope.** Resolve the exact diff (`git diff <range>` or the named files). List the
   changed files and hunks. If scope is empty or unbounded, stop and ask (per EF-03).
2. **Ground once.** Read only the changed hunks plus the minimum surrounding context needed
   to judge them (callers, the type, the contract). Note the standards that govern this code
   by ID; never paste a rule body (per EF-01).
3. **Correctness pass (FIRST).** Hunt real defects: unhandled null/undefined and error paths
   (per CS-06), floating/unawaited promises and races (per CS-08), boundary/edge cases (empty,
   off-by-one, wrong operator), broken invariants, and misused contracts. This pass has
   priority over all style/quality findings.
4. **VERIFY each suspected bug before flagging.** Trace the actual code path and state a
   concrete trigger (inputs/state → wrong output or crash). If you cannot construct a trigger,
   it is not a confirmed bug — downgrade to a question or drop it. Prefer a cheap check
   (re-read the path, run the test) over guessing. Do NOT emit unverified "this might break".
5. **Reuse / simplify / efficiency pass (SECOND).** Only after correctness: flag duplicated
   logic that should reuse an existing helper, single-responsibility violations and leaky
   module surfaces (per CS-07), and needless complexity or wasteful work. Keep these ranked
   below correctness findings.
6. **Skip linter-covered nits.** Do not report formatting, import order, or anything the
   configured linter/formatter/type-checker already enforces. Run the linter to confirm rather
   than hand-flag style. Spend findings only on what a machine cannot catch.
7. **Write each finding in contract form.** For every kept finding record: `file:line` ·
   why it is wrong (one sentence) · suggested fix (concrete, but described — you do not edit)
   · cited CS rule ID (e.g. CS-06). Correctness findings additionally carry the verified
   trigger from step 4.
8. **Order and verdict.** Sort correctness bugs first (most severe first), then quality
   findings. Set the verdict: `request-changes` if any confirmed correctness bug exists,
   else `approve`. Run the Quality Gate below; drop or fix any finding that fails it.

## Decision Points
- Suspected bug you cannot trigger → do not flag it as a bug; downgrade to a question or drop.
- Finding the linter/type-checker already catches → drop it (step 6); do not spend a finding.
- Correctness vs. style tension → correctness always sorts first; never bury a bug under nits.
- The right fix crosses into another domain or reopens a design decision → note it and
  escalate to engineering-manager (WF-08); do not redesign inside a review.
- Tempted to edit the code to "just fix it" → stop. This pass is read-only; return the fix as
  a suggestion, never an edit.

## Quality Gate (inline pass/fail before returning)
- [ ] Scope was bounded to the diff/named files; the whole repo was not loaded — per EF-03.
- [ ] Correctness findings are listed FIRST, ordered most-severe first.
- [ ] Every correctness finding has a concrete verified trigger (inputs/state → failure) — per CS-06.
- [ ] Every finding has `file:line` + why + suggested fix + a cited CS rule ID.
- [ ] No finding duplicates something the linter/formatter/type-checker already enforces.
- [ ] Reuse/simplify/efficiency findings cite CS-07 (or the applicable CS rule) and rank below correctness.
- [ ] No async finding left as a guess — floating-promise/race claims are traced, not assumed — per CS-08.
- [ ] No code was edited; output is findings only.
- [ ] No Knowledge rule pasted inline; all cited by ID — per EF-01.
- [ ] A verdict (`approve` / `request-changes`) with the blocking-finding count is included.

## References (pointers by rule ID; never inline a standard)
- Standards → cite by rule ID: CS-06 (errors/boundaries), CS-07 (single responsibility /
  stable surface), CS-08 (async/no floating promises); workflow EF-01, EF-03, WF-08. Never inline.
- Coding standards catalog → `Knowledge/coding-standards.md` (CS-*). Rule-ID map → `Knowledge/_index.md`.
- Execution loop + Output Contract → `Knowledge/development-workflow.md`.
