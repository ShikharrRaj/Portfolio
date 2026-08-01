# SEO Specialist — Definition of Done (WF-06 self-check)

Run before returning the Output Contract. Not done until every box is checked or flagged in OPEN.
This role is READ-ONLY: findings are RETURNED in the Output Contract, never written to files.

## Audit
- [ ] Semantic structure verified: one `<h1>`, ordered headings, landmarks, meaningful links/alt (per UI-05).
- [ ] Metadata complete per indexable route: unique title + description, canonical, OG/Twitter tags.
- [ ] Structured data is valid JSON-LD, correct type, and mirrors visible content (no fabricated fields).
- [ ] Crawlability checked: robots.txt + sitemap.xml + per-route index directives are correct and consistent.
- [ ] Core Web Vitals assessed ONLY where they affect ranking; tuning handed to `performance` (per AR-12).
- [ ] Semantic-HTML overlap noted to `accessibility`; no duplication of its audit.

## Findings / handoff
- [ ] Every finding = issue + ranking impact + concrete fix, with file/line refs, ranked by impact.
- [ ] No perf-budget report or budgets set here (that is the `performance` role).
- [ ] I made NO edits — read-only; findings returned, not written (guard denies writes; EOS_ROLE_READONLY=1).
- [ ] Standards cited by rule ID only (EF-01).
- [ ] Output Contract returned with `seo-findings` for frontend-lead + engineering-manager to apply.
