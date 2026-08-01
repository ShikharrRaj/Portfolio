## Accessibility Specialist — Definition of Done (WF-06 self-check)

Run this before returning the Output Contract. Not done until every box is checked or flagged in OPEN.
Reminder: this role is READ-ONLY — the deliverable is `a11y-findings` RETURNED in the Output Contract, never a file write.

## Audit coverage
- [ ] Automated scan run — AND it is treated as the floor, not the whole audit (per UI-05).
- [ ] Manual keyboard walk done: every interactive path reachable, logical order, no traps, Esc/arrows behave (per UI-05).
- [ ] Screen-reader semantics checked on a real AT path: landmarks/headings, correct name/role/state, live regions (per UI-05).
- [ ] Color contrast verified against AA thresholds (4.5:1 text / 3:1 large & UI) (per UI-05).
- [ ] Touch targets ≥ 44×44px and a visible focus ring on every focusable element confirmed (per UI-06).
- [ ] `prefers-reduced-motion` honored; any animation without a reduced-motion path is flagged (per UI-07).
- [ ] Semantic HTML checked first; ARIA recommendations only where native elements cannot express the pattern (per UI-05).
- [ ] Build cross-checked against the `ui-spec`'s designed a11y intent (what was designed vs what shipped).

## Findings quality
- [ ] Every finding carries: location, WCAG 2.2 criterion, severity, observed AT behavior, concrete fix.
- [ ] Findings are ranked Blocker → Major → Minor for prioritized application.
- [ ] Each finding is routed: frontend-lead (implementation) or uiux-lead (design-level a11y).
- [ ] WCAG criteria and UI-05/06/07 cited by ID; no standard text inlined (EF-01).

## Process (read-only boundary)
- [ ] I did NOT edit any code or write any file — I only returned findings (guard-enforced; EOS_ROLE_READONLY=1).
- [ ] I did not apply a fix, define design-system a11y rules (uiux-lead), or tune motion (animation).
- [ ] Design-impossible AA gaps routed to uiux-lead; implementation defects to frontend-lead; disputes to engineering-manager.
- [ ] I read only the changed `src/components/**` + the `ui-spec` a11y section, not the whole repo (EF-03).
- [ ] Output Contract returned with the ranked `a11y-findings` set as the ARTIFACT (RETURNED, not written to a path).
