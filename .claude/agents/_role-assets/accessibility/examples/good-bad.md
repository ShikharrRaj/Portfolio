## Accessibility Specialist — Good vs Bad findings (on-demand)

This role is READ-ONLY: a finding is RETURNED in the Output Contract, never written to a file, and never
"fixed" by the auditor. Below: one GOOD vs one BAD finding for the same issue.

## Issue: the primary "Save" control in `<DocumentToolbar>` is an icon-only `<div>`

### ✅ GOOD — located, criterion-cited, severity-ranked, concrete fix, correctly routed
```
[Blocker] Icon-only Save control is not keyboard-operable or named
Location: src/components/toolbar/DocumentToolbar.tsx — the Save <div onClick={…}>
WCAG 2.2: 2.1.1 Keyboard (A) + 4.1.2 Name, Role, Value (A); also UI-06 (visible focus).
Observed (manual): Tab never lands on it — a mouse-only control; screen reader announces nothing
  (no role, no accessible name). No focus ring.
Fix (frontend-lead): replace the <div> with <button type="button" aria-label="Save document">;
  it then gets native focus, Enter/Space activation, and a role. Ensure the token focus ring shows.
Route: frontend-lead (implementation defect — the design intended a labeled button).
```
Why good: frontend-lead can apply this without re-diagnosing — exact file, exact criteria, exact fix,
severity for prioritization, and semantic-HTML-first (a real `<button>`, not `role="button"` on the div).

### ❌ BAD — vague, no criterion, ARIA-first, auditor overreaches
```
"The toolbar has some accessibility problems, the save button isn't very accessible.
 Add role='button' and tabindex='0' and some aria to it. I've gone ahead and patched it in the file."
```
Why bad: no location precision, no WCAG criterion, no severity (FM-2); recommends `role="button"`/`tabindex`
bolted onto a `<div>` instead of a native `<button>` — ARIA-first where semantics win (FM-3); and claims to
have edited the code, which a read-only auditor must never do (FM-4 — the guard denies the write regardless).
Correct move: rewrite as the GOOD finding above and RETURN it via the Output Contract for frontend-lead to apply.

## Routing example: a token pair that can never meet AA
✅ Finding: "Body text uses `color.text.muted` on `color.surface.raised` = 3.1:1 (WCAG 1.4.3 fails, needs
4.5:1). This is not fixable in the component — the token pair itself fails. Route: uiux-lead (design-level
a11y, per UI-05)." Correctly sent to the design owner, not frontend-lead who cannot change the token contract.
❌ Anti-pattern: filing the same contrast gap against frontend-lead with "darken the text" (FM-6) — they'd
hardcode a non-token color to satisfy the audit, breaking the token system. Route design-impossible AA to uiux-lead.
