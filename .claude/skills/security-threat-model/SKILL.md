---
name: security-threat-model
description: >
  Produces security-findings for a scoped surface: enumerate authz gaps, injection
  (SQL/XSS/prompt), secrets exposure, dependency vulns, and data over-exposure, each
  as severity + repro + fix under assume-breach/least-privilege. Use when a change or
  surface needs a read-only threat model before merge or release. Follows
  Knowledge/architecture-principles.md#AR-10.
when_to_use: threat model, security review, find vulnerabilities, authz gaps, injection (SQL/XSS/prompt), secrets exposure, dependency vulns, data over-exposure, assume-breach, pre-release security pass
allowed-tools: Read, Grep, Glob, Bash
---

## Purpose & Preconditions
Produce a decision-complete set of `security-findings` for a scoped surface (a diff, an
endpoint, a data flow, a prompt/tool boundary) so the owner can close real exposures fast.
Reason from **assume-breach** (a boundary is already crossed — what then?) and **least-
privilege** (does each actor hold only what it needs?). This is a **read-only** pass: the
actor returns findings and NEVER edits code or config. Preconditions: a bounded scope exists
(diff range or named files/surface); the actor can read the repo and run read-only commands
(`git diff`, `grep`, the dependency-audit tool). If scope is undefined or empty, stop and ask
— never scan the whole repo (per EF-03).

## Inputs / Outputs (contract)
Inputs:
- Scope — a `git diff` range, PR, or explicit file/endpoint/data-flow list to threat-model.
- Trust boundaries — where untrusted input enters (HTTP params, headers, DB rows, retrieved
  RAG content, LLM/tool output) and where privileged actions or data exit.
- Governing standards — cited by rule ID, never re-read wholesale (per EF-01, EF-03).

Outputs (returned in the Output Contract, not written to files):
- `security-findings` — a list ordered **most-severe first**. Each finding =
  **severity** (Critical/High/Medium/Low) + **repro** (concrete attacker input/state → the
  unauthorized outcome) + **fix** (concrete, described — you do not edit) + **cited rule ID**.
- Verdict line — `pass` / `block`, with the count of Critical/High findings.
- Escalation note — if any **confirmed Critical** exists, emit an escalation to
  engineering-manager (per WF-08) alongside the findings; do not sit on it.

## Steps (deterministic, numbered)
1. **Fix scope.** Resolve the exact diff (`git diff <range>`) or named surface. List changed
   files/endpoints and the trust boundaries they touch. If scope is empty or unbounded, stop
   and ask (per EF-03).
2. **Map trust boundaries once.** Read only the in-scope code plus the minimum context needed
   to trace each untrusted-input source to each sink (query, response, log, template, tool
   call). Note governing rules by ID; never paste a rule body (per EF-01).
3. **Authz pass.** For every privileged operation and every boundary, verify an authz check
   exists and is enforced server-side (per AR-10). Hunt: missing/weak checks, IDOR
   (object references not scoped to the caller), role/tenant confusion, and trust of
   client-supplied identity. Assume-breach: if this boundary is reached, what is exposed?
4. **Injection pass.** Trace untrusted input into each sink. SQL/NoSQL → unparameterized
   queries or string-built filters. XSS → unescaped output into HTML/DOM/templates. Prompt
   injection → retrieved or user content that can override system instructions or trigger
   unsafe tools (per AI-07). Flag the source→sink path, not a vague "unsanitized input".
5. **Secrets pass.** Scan for credentials/keys/tokens in source, config, or fixtures, and for
   secrets written to logs or error messages (per CS-13). Confirm secrets are read from
   env/secret-manager, not hardcoded.
6. **Dependency pass.** Run the read-only audit (`npm audit`/`pnpm audit --prod` or the repo's
   tool) scoped to what the change pulls in. Flag known-vuln packages that are actually
   reachable from in-scope code; note the advisory ID and safe version.
7. **Data-exposure pass.** Check responses, logs, and error bodies for over-exposure: PII or
   internal fields returned beyond need, stack traces/verbose errors leaked to clients,
   over-broad SELECT/serialization. Apply least-privilege to the data shape (per CS-06 on
   boundary validation; per AR-10 on designed-in security).
8. **VERIFY each finding before flagging.** Construct a concrete repro: attacker input/state →
   the unauthorized read/write/exec/leak. If you cannot construct one, it is not a confirmed
   finding — downgrade to a hardening note or drop it. Prefer a cheap check (re-read the path,
   run the audit) over guessing. Do NOT emit unverified "this might be exploitable".
9. **Score, order, verdict.** Assign severity by impact × exploitability. Sort most-severe
   first. Set verdict: `block` if any Critical/High is confirmed, else `pass`. If any Critical
   is confirmed, attach the escalation note to engineering-manager (per WF-08). Run the
   Quality Gate; drop or fix any finding that fails it.

## Decision Points
- Suspected exposure you cannot repro → do not flag it as a finding; downgrade to a hardening
  note or drop it.
- Dependency advisory on a package not reachable from in-scope code → note as informational,
  do not score as an exploitable finding.
- Prompt-injection vs. ordinary input-validation → if the sink is an LLM/tool boundary, cite
  AI-07; if it is a query/DOM sink, treat as injection under AR-10/CS-06.
- Confirmed Critical (unauthorized privileged access, secret leak, RCE, mass data exposure) →
  escalate to engineering-manager immediately (per WF-08); do not defer it to the report tail.
- The fix reopens a design decision or crosses domains → note it and escalate (WF-08); do not
  redesign inside a review.
- Tempted to edit code/config to "just patch it" → stop. This pass is read-only; return the
  fix as a described suggestion, never an edit.

## Quality Gate (inline pass/fail before returning)
- [ ] Scope was bounded to the diff/named surface; the whole repo was not scanned — per EF-03.
- [ ] All five passes ran: authz, injection (SQL/XSS/prompt), secrets, dependency, data-exposure.
- [ ] Every finding has severity + a concrete repro (attacker input/state → unauthorized outcome).
- [ ] Every finding has a described fix and a cited rule ID (AR-10 / CS-06 / CS-13 / AI-07).
- [ ] Findings ordered most-severe first; verdict (`pass`/`block`) + Critical/High count included.
- [ ] Any confirmed Critical carries an escalation to engineering-manager — per WF-08.
- [ ] No unverified "might be exploitable" left in; each finding has a real repro.
- [ ] No code or config edited; output is findings only.
- [ ] No Knowledge rule pasted inline; all cited by ID — per EF-01.

## References (pointers by rule ID; never inline a standard)
- Standards → cite by rule ID: AR-10 (security designed-in, authz at every boundary),
  CS-06 (fail-fast boundary validation of external input), CS-13 (secrets never in source or
  logs), AI-07 (untrusted content must not override instructions or trigger unsafe tools);
  workflow EF-01, EF-03, WF-08. Never inline.
- Rule-ID map → `Knowledge/_index.md`. Execution loop + Output Contract → `Knowledge/development-workflow.md`.
