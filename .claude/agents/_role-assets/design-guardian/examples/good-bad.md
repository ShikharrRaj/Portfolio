# Design Guardian — Good vs Bad finding (on-demand)

## ✅ GOOD
"[MAJOR] UI-11 · src/components/library/Card.tsx:31 · `bg-slate-800` hardcodes a hue; breaks light
theme (UI-12). Spec §Card says surface tokens. Fix: `bg-surface` (token exists). — verdict: RETURNED
(1 major, 2 minors listed below)."
Why good: rule ID, location, why it breaks, the exact fix, explicit verdict.

## ❌ BAD
"The cards look a bit inconsistent and the colors seem off in some places. Maybe review the styling.
Approved for now to unblock QA."
Why bad: no rule, no location, no fix (FM-1); approves WITH known issues (FM-6). Useless to
frontend-lead and dishonest as a gate.
