# Software Factory — Operating Playbook (v2.0)

> Status: canonical · Owner: engineering-manager · Read by the EM when routing any feature.
> Extends the constitution (`docs/engineering-os-standard.md`); replaces nothing. The mission is NOT
> to generate code — it is to autonomously deliver production-ready software with minimal human
> intervention. Every stage owns quality, validates its input (WF-09), and can reject work (WF-10).

## The pipeline (stage order — no stage skips another)

```
CEO request
  1. product-manager        → prd-approved            [gate: PM DoD; business alignment ↓]
  2. research               → research-report          [gate: assumptions checked, deps vetted]
  3. engineering-manager    → delivery-plan            [gate: single-owner phases]
  4. staff-architect        → architecture-spec + adr  [gate: validates research; NFR budgets set]
  5. EM (execution-planning)→ execution-plan           [gate: acyclic DAG, parallel streams marked]
  6. uiux-lead              → ui-spec                  [gate: states + tokens + a11y-by-design]
  7. BUILD (parallel per execution-plan):
       frontend-lead ∥ backend-lead ∥ ai-platform-lead ∥ database ∥ prompt-engineer
  8. design-guardian        → design-findings          [gate: APPROVED before QA — no UI passes unapproved]
  9. qa-automation          → test-suite + qa-report   [gate: PRD acceptance criteria verified]
 10. REVIEW (parallel): code-reviewer ∥ security-reviewer ∥ performance ∥ accessibility ∥ seo ∥ animation
       + devops (dependency-audit) + performance (cost-review)
 11. devops (observability-setup) → deploy-config      [gate: monitoring + rollback ready]
 12. documentation          → docs-artifact            [gate: docs updated WITH the change]
 13. EM (release-readiness) → release-decision         [gate: full checklist below] → CEO approval
 14. git-operations         → release-notes + tag + changelog
 15. POST-RELEASE: analytics-review (when data provided) → EM (factory-retrospective) → retro-report
       → documentation (knowledge-capture) → docs/memory updated
```
**Fast-path (EF-07) still applies:** trivial single-domain tasks skip to the owning role + its reviewer.
Stages 2/5/8 are skippable ONLY by explicit EM decision recorded in the delivery-plan (with reason).

## Business alignment (gate on stage 1)
No feature enters the factory without the PRD answering: why build it · which KPI improves · who
benefits · how success AND failure are measured. Unmeasurable features require explicit PM approval
recorded in the PRD.

## Validation chain (WF-09)
Every stage validates its INPUT against the producer's DoD before working: Research validates the PRD's
assumptions · Architecture validates research · Planning validates architecture · Build validates the
plan/specs · design-guardian + QA validate the build · reviewers validate QA'd work · Release validates
everything. A defective input is REJECTED to its owner (WF-10) — never silently patched downstream.

## Retry loop (WF-10)
On any gate failure: STOP → return to the owner with {problem · owner · suggested fix · retry count}.
Fix → re-validate. 3 retries on the same gate → escalate to EM (process problem, not a work problem).
Never silently continue.

## Change events (no downstream surprises)
A role whose change breaks or alters a published artifact (api-contract, schema, ui-spec, prompt-spec)
MUST list every consumer in its Output Contract `HANDOFF-TO` and the EM re-dispatches to each affected
role. Downstream teams never discover breaking changes themselves.

## Release gate (stage 13 checklist — all required)
- [ ] Research complete · architecture approved · execution-plan complete
- [ ] Implementation complete; design-guardian APPROVED; QA passed vs PRD criteria
- [ ] code/security/performance/accessibility findings resolved or explicitly waived by CEO
- [ ] dependency-report healthy (no unresolved critical CVEs) · cost within budget (cost-findings)
- [ ] Documentation updated · observability + alerts configured · rollback rehearsed (per AR-36)
- [ ] docs/memory updated (knowledge-capture) · analytics instrumentation in place (per TS-36)
Only then: request CEO approval. **Release ≠ deployment** — deployment is devops executing an approved release.

## Post-release
When the user provides prod data: analytics-review → regressions become defects routed to owning
Leads → factory-retrospective after every feature → knowledge-capture updates docs/memory/.
HONEST LIMIT: the factory cannot watch production or run daily jobs by itself — analytics-review and
dependency-audit are payloads for schedules the CEO sets (cron / scheduled tasks).

## Factory memory
`docs/memory/` (INDEX.md + topic entries) is consulted at WF-03 by every role. Written only via
knowledge-capture. Never solve the same problem twice; repeat failures across ≥2 retros are promoted
to standard-rule amendments via the file Owner.

## Factory status (EM reports this block whenever asked "where are we?")
```
FEATURE:      <name> · STAGE: <n/15 name> · OWNER: <role> · PROGRESS: <n>%
GATES:        <passed>/<total> · BLOCKED-BY: <none | item+owner> · RISK: low|med|high
RETRIES:      <gate: count …> · PARALLEL: <streams running>
PENDING:      <approvals needed> · NEXT: <stage + role>
```

## EM factory duties (beyond routing)
Manage retries + dependencies · approve parallelization + stage skips · monitor bottlenecks/cycle time
via retros · coordinate releases · report the factory status block · collect retrospectives.
