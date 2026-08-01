# UI/UX Lead — Good vs Bad specs (on-demand)

## Surface: "Document upload panel" in the ui-spec

### ✅ GOOD — state-complete, token-driven, mobile-first, a11y-by-design, reuses the system
```
Component: <FileDropZone> (design-system, reused per UI-10) — do NOT invent a new dropzone.
Tokens:    surface = color.surface.raised · border = color.border.subtle · radius = radius.md
Flow:      empty → dragging → uploading → success | error, from prd-approved §Upload.
States (per UI-03):
  Loading   progress bar (token color.accent), cancel stays interactive, >10s → "Still working…"
  Empty     copy "Drag files or browse", primary CTA = Browse (per UI-09); first-run hint below
  Error     "Upload failed — file over 25MB. Try a smaller file." + Retry; prior files preserved
  Success   green check, focus moves to the new row, list persists
Responsive (per UI-04): mobile = full-width stacked, tap target ≥44px (per UI-06);
  tablet/desktop = 2-col with side metadata.
A11y (per UI-05): dropzone is a labeled button, keyboard-openable; contrast AA on all token pairs;
  errors announced via aria-live (audited by accessibility, designed here).
```
Why good: FE can build it with zero UX invention; every state exists; no hardcoded values; reuses a
system component; a11y is designed in for the auditor to verify.

### ❌ BAD — happy-path mock, hardcoded, desktop-only, bespoke, a11y punted
```
"Upload area: a nice drag-and-drop box (#3B82F6 border, 16px radius), shows the files after upload.
 Make it look clean on desktop. Accessibility to be handled in the a11y pass."
```
Why bad: only the success state (FM-1) — FE must invent loading/empty/error; raw hex + px instead of
tokens (FM-2); desktop-only, no mobile behavior (FM-3); a bespoke box where `<FileDropZone>` exists
(FM-4); a11y offloaded to the audit (FM-5). Correct move: rewrite as the GOOD spec above. If handed
this, frontend-lead should treat missing states as a spec gap and request the full ui-spec, not guess.

## Dispute: is the design "token" or the Tailwind config the source of truth?
✅ UI/UX ruling: the ui-spec's semantic tokens are the source of truth (per UI-01); FE maps them into the
Tailwind theme (per UI-02). Disagreement on ownership of a shared token-vs-component boundary →
ESCALATE to engineering-manager.
❌ Anti-pattern: UI/UX Lead edits the Tailwind config / component code directly to "make it match"
(FM-6 — that is frontend-lead's implementation, a boundary violation).
