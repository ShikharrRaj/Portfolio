# Security Reviewer — Good vs Bad finding (on-demand)

A finding is the artifact this role produces. It is RETURNED in the Output Contract, never written to
a file. A good finding is *verified, severity-ranked, reproducible, and paired with a fix rec* — the
owning Lead can act without re-investigating.

## Task: review a document-search endpoint in `backend-impl`

### ✅ GOOD
```
[CRITICAL] SQL injection + missing authz — GET /search
File:    src/server/search/search.controller.ts:24
Rule:    CS-06 (unvalidated input), AR-10 (no authz / not fail-closed)
Repro:   GET /search?q=%27%20OR%201%3D1--  → returns every user's chunks.
         `q` is interpolated into $queryRawUnsafe with no validation and no principal scope;
         input reaches the SQL sink with no authz assert on the path (verified by trace).
Impact:  Full cross-tenant data exfiltration + arbitrary read via injection.
Fix rec: Parameterize (bound query / ORM), validate `q` with a schema at the edge (CS-06),
         and assert principal-scoped authz before the query, default deny (AR-10).
Owner:   backend-lead
```
Why good: verified (input→sink traced, PoC given); severity + concrete repro + impact + actionable
fix rec + named owner; cites AR-10/CS-06 by ID; recommends the fix, does not apply it.
A confirmed CRITICAL like this is escalated to the engineering-manager immediately.

### ❌ BAD
```
Possible security issue in search — the query looks unsafe, might allow injection.
Should probably sanitize inputs and add auth. Also I refactored the controller to fix it.
```
Why bad: no severity, no repro/PoC, no file:line, no rule ID, unverified ("looks"/"might") — pure
speculation (FM-1); vague "sanitize" instead of a concrete fix; names no owner; and it EDITED the
code (FM-2) — security-reviewer is read-only and returns recommendations only. Fails DoD.
