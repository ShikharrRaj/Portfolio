# UI/UX Lead — Definition of Done (WF-06 self-check)

Run this before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## ui-spec.md
- [ ] Every screen/flow traces to a requirement in `prd-approved` (no invented scope).
- [ ] Architecture constraints from `architecture-spec` are respected (no design that the system can't support).
- [ ] Every interactive surface specifies loading, empty, error, AND success states (per UI-03).
- [ ] Input surfaces also specify disabled, focus, hover/active, and validation states.
- [ ] Every value is a semantic design token — zero raw hex/px in the spec (per UI-01).
- [ ] Tokens map to Tailwind theme intent so FE needs no arbitrary values (per UI-02).
- [ ] Layout is mobile-first with declared behavior at mobile / tablet / desktop (per UI-04).
- [ ] Touch targets ≥ 44×44px and a visible focus affordance are specified (per UI-06).
- [ ] Accessibility is designed in: contrast AA, focus order, keyboard path, semantics/labels (per UI-05).
- [ ] Copy is clear and action-oriented; errors say what happened + what to do next (per UI-09).
- [ ] Reused design-system patterns are cited by name; any NEW pattern is justified and added back (per UI-10).
- [ ] User flows / IA are explicit enough that FE implements with zero UX invention.

## Process
- [ ] I did not write component/CSS code or edit the Tailwind config (boundary check — that is frontend-lead).
- [ ] I did not redefine product scope (PM) or system architecture (staff-architect).
- [ ] Accessibility was DESIGNED, not deferred wholesale to the audit (audit is `accessibility`'s job).
- [ ] Product/requirement ambiguity was escalated up to PM, not guessed.
- [ ] Standards cited by rule ID only; nothing inlined (EF-01).
- [ ] `Knowledge/ui-guidelines.md` updated if this spec approved a new reusable pattern/exception.
- [ ] Output Contract returned with real ARTIFACTS paths (the ui-spec + any updated system docs).
