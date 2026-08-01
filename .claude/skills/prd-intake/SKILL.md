---
name: prd-intake
description: >
  Turns a raw request into an approved PRD (problem, users, goals+metrics, prioritized
  testable requirements, explicit non-goals) with the open-questions log driven to zero.
  Use when intake begins on a new feature/PRD and the caller must emit PRD.approved.md.
when_to_use: new PRD, feature intake, "write a PRD", raw request to approved requirements, acceptance criteria, scope & non-goals
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

## Purpose & Preconditions
Convert an unstructured request into a decision-ready, approvable PRD. The output is
requirements-only: user outcomes, not technology, architecture, or screen designs.
Preconditions:
- A raw request exists (prose, ticket, or verbal brief) and a project slug is known.
- Caller has write access to `projects/<slug>/prd/`.
- Clarify the task first (per WF-01); if the request is empty or the project is undefined, escalate — do not invent scope.

## Inputs / Outputs (contract)
Inputs:
- Raw request text + `<slug>` (from the caller / orchestrator).
- Any linked context the request names (existing docs, tickets) — read only what is cited (do not load the whole repo).

Outputs:
- `projects/<slug>/prd/PRD.approved.md` — sections: Problem · Target users · Goals & success metrics · Requirements (each: ID, user outcome, MoSCoW, testable acceptance criteria incl. empty/error/edge states) · Non-goals · Constraints & assumptions · Open questions (must be empty at approval).
- Status marker: file is only titled `.approved` when the Quality Gate passes; otherwise write `PRD.draft.md` and return with OPEN items.

## Steps (deterministic, numbered)
1. Restate the request as problem + intended outcome in ≤3 bullets (per WF-01). Confirm the `<slug>`.
2. Read only the sources the request explicitly cites. Extract facts; list every ambiguity as an Open Question.
3. Write **Problem**: tie a user need to a business outcome in 2–4 sentences.
4. Write **Target users**: name and bound each persona/segment. No "all users".
5. Write **Goals & success metrics**: each goal gets one measurable metric with a baseline and a target.
6. Draft **Requirements**. For each: assign an ID (R1, R2, …); state it as a user outcome, never a mechanism/technology.
7. For every requirement, write **testable acceptance criteria** in Given/When/Then form, and include the empty, error, and edge-case states (per UI-03). A requirement with no failure/empty path is not done.
8. Assign **MoSCoW priority** (Must/Should/Could/Won't-now) to each requirement.
9. Write **Non-goals**: explicitly list what is out of scope, including tempting-but-excluded items.
10. Write **Constraints & assumptions**: cite any product-level UI-*/AI-* constraints by rule ID only (never inline).
11. Resolve the **Open questions** log: answer each from cited sources, or decide it, or escalate a genuine product fork to the CEO with a recommendation. Drive the log to zero.
12. Run the Quality Gate below. If all pass, save as `PRD.approved.md`; else save `PRD.draft.md` and list unresolved items in the return.

## Decision Points
- Open question is a **product** fork (what/why/for-whom) → decide it or escalate to CEO with a recommendation; never leave it open at approval.
- Open question is a **technical/design** fork (how/stack/screens) → record it as an explicit assumption or hand-off note; it does not block PRD approval and is not yours to decide.
- Request mixes product + implementation detail → keep the user outcome in the requirement; move the mechanism to Constraints/assumptions or drop it.
- Any Open question remains unanswered → output `PRD.draft.md`, not approved.

## Quality Gate (inline pass/fail before returning)
- [ ] Problem statement links a user need AND a business outcome.
- [ ] Every target user/persona is named and bounded (no "everyone").
- [ ] Every goal has a measurable metric with baseline + target.
- [ ] Every requirement is a user outcome, not a technology/mechanism.
- [ ] Every requirement has testable acceptance criteria including empty/error/edge states (per UI-03).
- [ ] Every requirement carries a MoSCoW priority.
- [ ] Non-goals / out-of-scope are explicit.
- [ ] Constraints cite standards by rule ID only; nothing inlined.
- [ ] Open-questions log is EMPTY.
- [ ] Full PM DoD checklist satisfied.
- [ ] Output written to `projects/<slug>/prd/PRD.approved.md`.
> Any unchecked box → save as `PRD.draft.md` and return the failing items as OPEN, not approved.

## References (pointers by rule ID; never inline a standard)
- Clarify-first & Output Contract → per WF-01, `Knowledge/development-workflow.md`.
- Loading/empty/error/success states → per UI-03, `Knowledge/ui-guidelines.md`.
- PM Definition of Done → `.claude/agents/_role-assets/product-manager/checklists/dod.md`.
