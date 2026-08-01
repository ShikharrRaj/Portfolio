---
name: build-react-component
description: >
  Produces a typed, presentational React/Tailwind component under the FE write-globs
  (src/app|src/components|src/styles) — design-system-reused, token-driven, with all
  interaction states and a colocated test. Use when a UI surface needs a new or reworked
  component. Follows Knowledge/ui-guidelines.md#UI-01.
when_to_use: build/add/rework a React component, Tailwind UI, presentational component, prop interface, loading/empty/error/success states, colocated component test
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

## Purpose & Preconditions
Build one React/Tailwind component that is presentational, prop-driven, and design-system
consistent. Preconditions:
- A ui-spec (or equivalent surface description) exists: states, tokens, and a11y intent are known.
- The invoking role has write access to the FE write-globs (`src/app/**`, `src/components/**`,
  `src/styles/**`). If the component needs data-fetching or business logic, that belongs to the
  caller/container — this skill produces the presentational layer only (per UI-08).
- Do NOT run when the work is server, data-access, or AI code — that is out of the FE write scope.

## Inputs / Outputs (contract)
Inputs:
- Component name + surface it lives on (from ui-spec / handoff).
- Required states and prop data shape (what the parent passes down).
- Design tokens to use (color, spacing, type, radius, shadow) — names, not raw values.

Outputs (all under FE write-globs):
- `ComponentName.tsx` — the component + exported typed prop interface.
- `ComponentName.test.tsx` — colocated test covering each rendered state.
- Optional `index.ts` re-export if the folder convention uses one.
- A one-line note back to the caller listing the file paths and props exposed.

## Steps (deterministic)
1. **Reuse-check first.** `Glob` `src/components/**` and `src/app/**`, then `Grep` for the
   component name and near-synonyms. If a matching component or primitive exists, STOP creating a
   new one — extend it, add a variant/prop, or compose it. Record what you reused or why nothing fit.
2. **Locate tokens.** `Grep` the token source (`src/styles/**`, `tailwind.config.*`) for the token
   names from the input. Confirm every color/spacing/type/radius/shadow you need has a token. If a
   needed token is missing, escalate to the token/design owner — do NOT hardcode a raw value (per UI-01).
3. **Define the prop interface.** Write an exported `interface ComponentNameProps` with explicit
   types for every input and each state trigger (e.g. `isLoading`, `error`, `items`). No `any`
   without an inline justification comment; prefer `unknown` + narrowing (per CS-01).
4. **Render all four states.** Implement `loading`, `empty`, `error`, and `success` render paths —
   no dead ends, no silent null-return for a real state (per UI-03).
5. **Apply tokens only.** Style with token-mapped Tailwind classes / CSS variables. No arbitrary
   values (no `w-[137px]`, no `#3b82f6`, no inline hex) (per UI-01).
6. **Keep it presentational.** No fetch, no store writes, no routing side-effects, no business
   rules. State is limited to local UI state (open/hover); data and handlers arrive via props (per UI-08).
7. **A11y baseline.** Semantic elements first; a real `<button>` for actions; label every control
   (`aria-label`/associated `<label>`); keyboard reachable + visible focus; `aria-live` for the
   error/success announcements; images have `alt`.
8. **Colocate a test.** Write `ComponentName.test.tsx` asserting each of the four states renders and
   the key a11y roles/labels are present.
9. **Run the Quality Gate** below. Fix any failing check before returning.
10. **Report** the created/edited file paths and the exported props to the caller.

## Decision Points
- Existing component covers the need → extend/compose it; do not duplicate (Step 1). Note the reuse.
- Needed token is missing → escalate to the design-system/token owner; block on it. Never inline a raw value.
- State cannot be represented statelessly (needs data logic) → push that logic up to the container/caller;
  this component receives resolved props (per UI-08).
- Design-system vs. token conflict, or scope creeps into server/AI files → escalate to engineering-manager.

## Quality Gate (inline)
- [ ] Reuse-check done; no duplicate of an existing component (per UI-08).
- [ ] Exported typed prop interface; no unjustified `any` (per CS-01).
- [ ] `loading`, `empty`, `error`, `success` all rendered — no dead end (per UI-03).
- [ ] Only design tokens used; zero arbitrary/hardcoded style values (per UI-01).
- [ ] Presentational only — no data-fetching / business logic (per UI-08).
- [ ] A11y baseline met: semantic markup, labeled controls, keyboard + visible focus.
- [ ] Colocated test covers all four states; `Bash` runs typecheck + test and both pass.
- [ ] All output paths fall inside `src/app|src/components|src/styles`.

## References
- Standards → cite by rule ID: `per UI-01`, `per UI-03`, `per UI-08`, `per CS-01`. Never inline them.
- Rule-ID map → `Knowledge/_index.md`.
- FE write-globs → `.claude/role-matrix.json` (`frontend-lead.writeGlobs`).
