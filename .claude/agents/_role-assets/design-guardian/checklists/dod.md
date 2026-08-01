# Design Guardian — Definition of Done (WF-06 self-check)
- [ ] Mechanical sweep run (arbitrary values / raw hex / off-scale / non-system UI imports).
- [ ] Every spec'd surface checked for full state coverage (UI-22, UI-03).
- [ ] Reuse verified: no one-off components where system components fit (UI-10).
- [ ] Dark + light theme integrity via tokens (UI-12); elevation/type/spacing on scale (UI-13/14/17).
- [ ] Responsive behavior matches spec at all breakpoints (UI-31, UI-04).
- [ ] Every finding = severity + UI-* ID + location + concrete fix; owner correctly assigned (spec→uiux, impl→FE).
- [ ] Verdict explicit: APPROVED (zero majors) or RETURNED (all deviations listed).
- [ ] Read-only respected; findings returned via Output Contract, nothing written.
