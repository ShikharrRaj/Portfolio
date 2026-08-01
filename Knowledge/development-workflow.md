# Development Workflow — Standard Execution Loop

> Status: canonical · Owner: engineering-manager · Consumed-by: ALL roles, ALL skills
> This file defines the ONE execution loop and the ONE handoff format every role uses.
> Roles reference it by anchor (e.g. `Knowledge/development-workflow.md#execution-loop`); they never restate it.

---

## <a id="execution-loop"></a>The Execution Loop (WF-01 … WF-08)

Every role runs this deterministic loop. Think before acting; never skip WF-02 or WF-06.

| ID | Step | Rule |
|----|------|------|
| **WF-01** | CLARIFY | Restate the task + acceptance criteria in ≤3 bullets. Missing or ambiguous input → escalate (WF-08); never assume. |
| **WF-02** | SCOPE-CHECK | Confirm the task is inside your `Owns` domain. Out-of-domain or overlapping → ESCALATE to Engineering Manager. Do no work yet. |
| **WF-03** | GROUND | Grep/Glob only the relevant files. Load the ONE procedure skill you need. Cite governing Knowledge rule IDs. Never load the whole repo. |
| **WF-04** | PLAN | Produce a numbered plan + decision points. For non-trivial work, return the plan as an interim summary for approval BEFORE acting. |
| **WF-05** | ACT | Execute the procedure. Stay inside your write-scope (hook-enforced). Emit artifacts to owned paths / `projects/<p>/handoffs/`. |
| **WF-06** | SELF-CHECK | Read your `checklists/dod.md` BY NAME and run it. Fix or flag every failed item. You are not done until it passes. |
| **WF-07** | SUMMARIZE | Return the Output Contract (below). Verbose logs stay in your isolated context. |
| **WF-08** | ESCALATE | If overlap or a blocker surfaced, emit the escalation artifact instead of forcing the work. |
| **WF-09** | VALIDATE-UPSTREAM | Before acting, check the input artifact against ITS producer's DoD. A defective input is REJECTED back to its owner (WF-10) — never silently patched downstream. |
| **WF-10** | RETRY | A rejection returns: problem · owner · suggested fix · retry count. Work bounces to the owner, is fixed, and re-validates. Never silently continue past a failed gate; 3 retries → escalate to EM. |

**Hook-backed steps:** WF-02 (write-scope guard) and WF-06 (self-check Stop hook) are the two points models most often cheat — working out of domain, skipping self-review — so they are mechanically defended.
**Factory pipeline:** the full stage order, quality gates, change-event rule, and factory status format live in `playbooks/software-factory.md`. WF-03 GROUND also consults `docs/memory/` (factory memory) — never solve the same problem twice.

---

## <a id="output-contract"></a>The Output Contract

Every role returns EXACTLY this envelope upward. Nothing else crosses a role boundary.
Fixed shape = the parent can act without replaying your context. Five specialist contracts
compress into one Lead contract before reaching the Architect, so parent context stays flat
as the org grows deeper.

```
STATUS:     DONE | BLOCKED | ESCALATE
DOMAIN:     <my role>
DID:        <≤3 bullets of what changed>
ARTIFACTS:  <paths written>
CHECKLIST:  <n/N passed; list any failures>
HANDOFF-TO: <next role> — <one line of what they need>
OPEN:       <risks / assumptions, ≤3 bullets>
```

Rules:
- `STATUS: ESCALATE` is only ever emitted for an ownership/overlap collision (routes to EM).
- `STATUS: BLOCKED` means a missing input/dependency (routes UP the build chain).
- `ARTIFACTS` paths must be real and match your declared `produces` types in `.claude/role-matrix.json`.
- Never return a transcript. If the receiver needs detail, point them at an artifact path.

---

## <a id="efficiency"></a>Efficiency Rules (token & execution discipline)

- **EF-01 Pointer, never paste.** Cite standards by file + rule ID (`per CS-07`). Reproducing >5 consecutive lines of a Knowledge file is a lint failure.
- **EF-02 Pull, don't preload.** Invoke a procedure skill at execution time; carry it in your always-loaded body only if you are useless without it.
- **EF-03 Relevant files only.** Grep/Glob to the target; never whole-repo reads.
- **EF-04 Summarize upward, retain downward.** Return the Output Contract; keep verbose exploration in your isolated context.
- **EF-05 Batch clarifications.** Ask all open questions in one block, not drip-fed.
- **EF-06 Budget is law.** Any always-loaded artifact over its §4 ceiling fails `scripts/budget-check.mjs`.
- **EF-07 Fast-path.** The EM may dispatch a trivial single-domain task straight to one specialist, skipping the full chain. Coordination cost only amortizes on real features.

---

## <a id="handoff"></a>Handoff Contract

- Handoffs are **artifacts, not conversation** (survives context isolation). One writer per artifact.
- Reviewers emit structured findings; they never edit code.
- Idempotent: a summary must let the receiver act without replaying the sender's context (EF-04).
- Each handoff artifact records the Knowledge rule-ID versions that governed it, for reproducibility.
- `scripts/lint-handoff-chain.mjs` fails CI if any role's declared `consumes` has no matching `produces` upstream.

---

## <a id="escalation"></a>Escalation Protocol

- **Ownership collision** (two roles claim a task, or neither does): the receiving role does NOT guess. It writes `projects/<p>/escalations/<id>.md` with `STATUS: ESCALATE` and returns. The **Engineering Manager is the sole arbiter** and never does the work itself.
- **Ambiguous input / missing dependency:** escalate UP the build chain (specialist → Lead → Architect → PM), not to EM.
- **Standard conflict:** escalate to the standard's `Owner` (see the provenance header of the Knowledge file), who grants a scoped exception or amends the rule.
- **Depth limit:** nested subagent spawning ≤5 levels; coordinators budget their spawns explicitly.
