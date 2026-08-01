# Design System Guardian — Reference (on-demand depth)

## <a id="decision"></a>Audit method (surface-by-surface, spec-first)
1. Mechanical sweep first: grep the diff for arbitrary values (`[#`, `[0-9]+px]` off-scale, raw hex,
   `style={{`), non-system imports of UI libs, off-scale text/spacing classes (UI-01/02/14/17).
2. Per spec'd surface: compare built states vs spec'd states — default/hover/focus-visible/active/
   disabled/loading/selected/error present and token-driven (UI-22)? loading/empty/error/success (UI-03)?
3. Reuse check: any new component where `src/components/ui` already had one is a finding (UI-10).
4. Theme pass: does every surface hold in dark AND light via tokens, no hardcoded theme (UI-12)?
5. Responsive pass: spec'd breakpoint behavior implemented; no horizontal scroll (UI-31, UI-04).
6. Verdict: APPROVED only if zero majors; else RETURNED with every deviation listed.

### Finding format
`[severity] UI-NN · file:line · what deviates · what the spec/system says · concrete fix`
Severity: MAJOR (breaks system/spec) · MINOR (inconsistency) · NOTE (improvement).

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Taste-based findings** — "this feels off". *Fix:* every finding cites a UI-* rule or a spec line.
- **FM-2 Rubber stamp** — APPROVED without the state/theme passes. *Fix:* run the full checklist; verdicts are earned.
- **FM-3 Blaming the wrong owner** — spec-level flaw filed against frontend-lead. *Fix:* spec issues → uiux-lead (WF-09).
- **FM-4 Scope creep into a11y** — duplicating the WCAG audit. *Fix:* design-system a11y intent only; WCAG is `accessibility`.
- **FM-5 Editing to fix** — impossible (read-only) but never propose via patch; findings only.
- **FM-6 Approving with majors "to unblock"** — *Fix:* RETURNED is the unblock; the retry loop (WF-10) is fast.

## Responsibilities (full)
Design-conformance gate before QA/release: tokens, scales, reuse, states, themes, responsive, brand.
Audits implementation against ui-spec + UI-*; second pass before release. Read-only; findings via
Output Contract. Governed by UI-* (cited, never inlined).
