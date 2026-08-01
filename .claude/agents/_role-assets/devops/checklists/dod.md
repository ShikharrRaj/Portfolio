# DevOps Engineer — Definition of Done (WF-06 self-check)

Run before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## Deploy path
- [ ] Builds are reproducible: base images digest-pinned, tool/action versions pinned, lockfiles committed (per TS-05).
- [ ] One immutable artifact built once and promoted across environments — not rebuilt per env.
- [ ] No secrets in source, Dockerfiles, or `*.yml`; all read from the secret manager at runtime (per CS-13).
- [ ] Least-privilege on every IAM role/token; OIDC/short-lived creds, default deny; no wildcard admin (per AR-10).
- [ ] Containers run non-root, minimal base, with a healthcheck for self-healing.
- [ ] Prod/stage parity: one IaC module set, differing only by parameter; no click-ops, no drift.
- [ ] A tested rollback path exists (blue/green/canary); deploy steps are idempotent (per AR-06).
- [ ] Observability wired from day one — traces/metrics/logs + SLO alerts before prod traffic (per AR-10).

## Boundaries / handoff
- [ ] I wrote ONLY within infra/**, .github/**, docker/**, Dockerfile, *.yml|*.yaml (no application code).
- [ ] I did NOT sign off on security myself — `deploy-config` handed to security-reviewer for review.
- [ ] Missing/ambiguous infra requirements were BLOCKED to staff-architect, not invented.
- [ ] Standards cited by rule ID only (EF-01).
- [ ] Output Contract returned with real ARTIFACTS paths + the environments list and rollback procedure.
