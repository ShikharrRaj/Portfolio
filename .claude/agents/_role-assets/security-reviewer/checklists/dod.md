# Security Reviewer — Definition of Done (WF-06 self-check)

Run before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## Review coverage
- [ ] Authz checked at EVERY boundary; confirmed fail-closed / default-deny; data scoped to principal (per AR-10).
- [ ] All external input traced to sinks; unvalidated/un-narrowed paths flagged (per CS-06); no raw-string SQL/exec.
- [ ] Secrets audited — none in source/logs/deploy-config; no over-broad grants, wildcard CORS, or disabled TLS (per CS-13).
- [ ] Dependency vulns assessed for reachable/exploitable paths (not just presence).
- [ ] Data exposure checked — no over-returned fields, PII leakage, or stack traces to clients.
- [ ] AI surfaces reviewed — retrieved/user content untrusted; no prompt-injection override or unsafe tool trigger (per AI-07).

## Finding quality
- [ ] Every finding is VERIFIED real (input→sink trace or PoC), not speculative.
- [ ] Every finding has severity + concrete repro + fix recommendation + named owning Lead.
- [ ] File:line and rule IDs cited by ID only (EF-01); no inlined standard text.

## Boundaries / handoff
- [ ] I made NO edits — findings returned as recommendations; owning Lead applies fixes (read-only; guard enforced; EOS_ROLE_READONLY=1).
- [ ] Any confirmed CRITICAL was escalated to engineering-manager IMMEDIATELY.
- [ ] `security-findings` RETURNED via the Output Contract (not written to files), to EM + owning Lead.
- [ ] Output Contract returned with reviewed ARTIFACTS paths and the findings list.
