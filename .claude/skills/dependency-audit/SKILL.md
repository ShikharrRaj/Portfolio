---
name: dependency-audit
description: Audits a project's dependencies for CVEs, deprecations, breaking changes, license drift, and staleness, producing a dependency-report with prioritized upgrade/migration recommendations. Use before release, on a schedule the user crons, or when adding dependencies. Follows Knowledge/tech-stack.md#TS-17.
when_to_use: audit dependencies, check for vulnerabilities, outdated packages, license check, npm audit, upgrade plan, before release dependency health
allowed-tools: Read, Bash, Grep, Glob, Write
---
## Purpose & Preconditions
Dependency health check per TS-17..TS-20. Requires a lockfile. NOTE: "runs daily" requires an external
scheduler (cron / scheduled task) — this skill is the payload, not the scheduler.

## Inputs / Outputs (contract)
Inputs: package.json + lockfile (and any workspace manifests).
Outputs: dependency-report → projects/<p>/handoffs/dependency-report.md (artifact: dependency-report).

## Steps (deterministic)
1. `npm audit --json` (or pnpm equivalent) → collect CVEs with severity + fix availability.
2. `npm outdated --json` → current vs latest; flag majors separately (breaking risk, per TS-15).
3. License scan: diff each package license against the allowlist (per TS-18); flag copyleft/unknown.
4. Deprecation scan: registry deprecation notices + repos archived/unmaintained >12mo (per TS-18).
5. Rank findings: CVE-critical > CVE-high > deprecated > license > major-behind > minor-behind.
6. For each top finding: recommendation (upgrade / replace / pin + monitor) with the migration note.
7. Write the report; return the Output Contract with counts by severity.

## Decision Points
- Critical CVE with fix → recommend immediate patch (security SLA per TS-19), notify security-reviewer.
- Major-version-behind on a framework → ADR territory (per TS-15); flag to staff-architect, don't just bump.
- Unmaintained load-bearing dep → replacement plan, not a wish.

## Quality Gate (inline)
- [ ] Audit + outdated + license + deprecation passes ALL run (not just npm audit).
- [ ] Every finding has severity, evidence, and a concrete recommendation.
- [ ] Zero silent omissions: report states scan date + lockfile hash.

## References
per TS-11..TS-20, AR-11. Security escalation: security-reviewer / EM.
