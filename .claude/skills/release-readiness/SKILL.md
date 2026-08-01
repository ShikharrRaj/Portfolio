---
name: assemble-release-gate
description: >
  Produces a go/no-go release-decision by collecting every reviewer's findings
  (code/security/perf/a11y/qa), verifying each phase met its receiver DoD, listing
  blockers, and summarizing outstanding risk. Use when a change set is code-complete
  and needs a single release gate before ship. Follows Knowledge/development-workflow.md#WF-06.
when_to_use: release gate, go/no-go, ship decision, release readiness, are we clear to release, assemble reviewer findings, DoD verification, outstanding-risk summary, blocker roll-up
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

## Purpose & Preconditions
Assemble one authoritative **release gate**: roll up every reviewer's findings, confirm each
phase actually met the receiver's Definition of Done (per WF-06), enumerate blockers, and emit a
decision-complete `release-decision` (go / no-go / go-with-conditions) plus an outstanding-risk
summary. This is a **synthesis** procedure — it aggregates prior verdicts and does not re-run or
re-litigate a review; a reviewer's confirmed finding is taken as given.
Preconditions: the change set is code-complete with a bounded scope; the expected reviewer
outputs and the receiver's DoD checklist(s) are locatable. If any expected review is missing or
the DoD for a phase is unknown, that is itself a no-go input — record it, do not fabricate a pass.

## Inputs / Outputs (contract)
Inputs:
- Change set — the PR / diff range / release candidate under gate, with its scope.
- Reviewer findings — code-review, security, perf, a11y, and qa outputs (verdict + findings each).
  Any expected-but-absent review is treated as an unmet gate, not an implicit pass.
- Receiver DoD — the per-phase Definition-of-Done checklist(s) each phase had to satisfy (WF-06).
- Optional context — the PRD/spec and architecture-spec the release claims to satisfy.

Outputs (returned in the Output Contract per WF-07; summarize upward, retain detail — EF-04):
- `release-decision` — one verdict: **go** / **no-go** / **go-with-conditions**, each condition
  named and owned.
- Blocker list — every open blocker as `source → finding → owner → why-blocking`, ordered by
  severity.
- DoD verification table — per phase: `met` / `unmet` / `unknown`, citing the checklist item.
- Outstanding-risk summary — accepted (non-blocking) risks the CEO signs off on, each with impact
  and rationale.

## Steps (deterministic, numbered)
1. **Fix scope.** Resolve the exact release candidate (PR / `git diff <range>` / tag) and list what
   ships. If scope is unbounded or empty, stop and ask — do not gate the whole repo.
2. **Locate inputs.** Collect the five reviewer outputs (code/security/perf/a11y/qa) and the
   receiver DoD checklist(s). Record each as present-or-absent; an absent expected review is an
   unmet gate carried forward to step 6, never silently skipped.
3. **Extract findings per reviewer.** For each present review, capture its verdict and every open
   (unresolved) finding with severity. Do not re-run or re-judge the review — take confirmed
   findings as given (this skill synthesizes; it does not re-review).
4. **Verify DoD per phase.** Walk each phase's receiver DoD checklist item by item (per WF-06) and
   mark `met` / `unmet` / `unknown`, citing the specific item. `unknown` (evidence not locatable)
   is treated as `unmet` for the gate.
5. **Roll up blockers.** A finding blocks if it is severity-blocking, a security/correctness defect,
   or maps to an `unmet`/`unknown` DoD item. Record each blocker as `source → finding → owner →
   why-blocking`, ordered most-severe first.
6. **Decide the verdict.** Apply the gate rule (see Decision Points) over the blocker list and DoD
   table to set `no-go`, `go-with-conditions`, or `go`. Every condition on a conditional go names
   its owner and the exact exit criterion.
7. **Summarize outstanding risk.** List every non-blocking accepted risk with its impact and the
   rationale for accepting it, so the CEO decides with the full picture (not a buried footnote).
8. **Emit and self-check.** Write the `release-decision` with blocker list, DoD table, and risk
   summary in the Output Contract (per WF-07). Run the Quality Gate below; fix any failed item
   before returning.

## Decision Points
- Any confirmed blocking finding OR any `unmet`/`unknown` DoD item → **no-go** (or
  go-with-conditions only if the CEO explicitly accepts the condition with a named owner + exit
  criterion). Never auto-clear a blocker.
- Expected review missing → treat as an unmet gate (no-go input); do not infer a pass from silence.
- A finding you think is wrong / over-stated → this is not the place to overturn it; record it as
  open and escalate the disagreement to engineering-manager (WF-08). Do not re-review here.
- The right resolution reopens design or crosses a domain → note it and escalate to
  engineering-manager; do not redesign inside the gate.
- Tempted to fix code to clear a blocker → stop. This skill decides; it does not implement. Route
  the fix to the owning role and re-gate after.

## Quality Gate (inline pass/fail before returning)
- [ ] Scope was bounded to the release candidate; the whole repo was not gated.
- [ ] All five reviews (code/security/perf/a11y/qa) are accounted for as present or explicitly absent; no absent review was treated as a pass.
- [ ] Every phase's receiver DoD was verified item-by-item and marked met/unmet/unknown, citing the item — per WF-06.
- [ ] Every blocker is recorded as `source → finding → owner → why-blocking`, ordered most-severe first.
- [ ] The verdict follows the gate rule: no confirmed blocker and no unmet/unknown DoD item was cleared without an explicit CEO-accepted condition (named owner + exit criterion).
- [ ] The outstanding-risk summary lists every non-blocking accepted risk with impact and rationale.
- [ ] No review was re-run or overturned here; disagreements were escalated (WF-08), not silently resolved.
- [ ] No code was edited; output is a decision plus its evidence only.
- [ ] Output is the Output Contract, summarized upward with detail retained — per WF-07, EF-04.
- [ ] No Knowledge rule pasted inline; all cited by ID.

## References (pointers by rule ID; never inline a standard)
- Standards → cite by rule ID: WF-06 (SELF-CHECK / receiver DoD), WF-07 (SUMMARIZE / Output
  Contract), EF-04 (summarize upward, retain downward). Never inline a rule body.
- Execution loop + Output Contract + escalation (WF-08) → `Knowledge/development-workflow.md`.
- Rule-ID map → `Knowledge/_index.md`.
