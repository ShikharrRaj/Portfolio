---
name: audit-wcag
description: >
  Produces a11y-findings for a scoped UI surface: a WCAG 2.2 AA audit combining an
  automated scan, manual keyboard walk, screen-reader semantics, contrast, focus order,
  touch targets, and reduced-motion — each finding = WCAG criterion + severity + concrete
  fix. Use when a surface needs an accessibility audit before merge or handoff. Follows Knowledge/ui-guidelines.md#UI-05.
when_to_use: audit accessibility, WCAG audit, a11y review, check contrast, keyboard nav, screen-reader semantics, focus order, touch targets, reduced-motion, is this accessible
allowed-tools: Read, Grep, Glob, Bash
---

## Purpose & Preconditions
Produce a decision-complete set of `a11y-findings` for a scoped UI surface, so the owning
Lead can fix real WCAG 2.2 AA defects fast. This is a **read-only** pass: the actor returns
findings and NEVER edits code, markup, or styles. Preconditions: a concrete scope exists
(a route, component, page, or file:line list) and the actor can read the source and run
read-only commands (the a11y linter/scanner, `grep`, the build). If scope is undefined,
stop and ask — do not audit the whole app (per EF-03). Every finding maps to a specific
WCAG 2.2 success criterion; "feels off" without a criterion is not a finding.

## Inputs / Outputs (contract)
Inputs:
- Surface under audit — a route/URL, component, or explicit file:line list defining scope.
- Governing standards — cited by rule ID, never re-read wholesale (per EF-01, EF-03):
  UI-05 (WCAG 2.2 AA baseline: contrast, focus, keyboard, semantics), UI-06 (touch targets
  ≥ 44×44px, visible focus ring), UI-07 (`prefers-reduced-motion`, motion timing).
- Optional context — the ui-spec or design tokens the surface claims to satisfy.

Outputs (returned in the Output Contract, not written to files):
- `a11y-findings` — an ordered list; **blockers first** (keyboard traps, no-name controls,
  contrast failures on text), then major, then minor. Each finding =
  `file:line` (or DOM selector) + **WCAG 2.2 criterion** (e.g. 1.4.3 Contrast (Minimum)) +
  **severity** (blocker/major/minor) + **why it fails** (one sentence) + **concrete fix**.
- Verdict line — `pass` / `fail`, with the count of blocking findings.

## Steps (deterministic, numbered)
1. **Fix scope.** Resolve the exact surface (route, component, or named files) and list what
   is in scope. If scope is empty or unbounded, stop and ask (per EF-03). Note the governing
   rules by ID (UI-05/06/07); never paste a rule body (per EF-01).
2. **Automated scan (baseline).** Run the project's a11y linter/scanner over the scope
   (e.g. `eslint-plugin-jsx-a11y`, `axe`, or the configured equivalent). Record violations
   with their rule and WCAG mapping. This catches missing alt text, invalid ARIA, missing
   form labels — treat it as the floor, not the audit.
3. **Screen-reader semantics.** Read the markup: every control has an accessible name
   (WCAG 4.1.2); landmarks/headings form a correct outline (1.3.1, 2.4.6); images have
   meaningful `alt` or are marked decorative (1.1.1); ARIA is valid and only used where
   native semantics are insufficient. Flag `div`/`span` acting as buttons without role +
   keyboard handling.
4. **Keyboard walk (manual).** Trace tab order through every interactive element: all are
   reachable and operable by keyboard (2.1.1), nothing traps focus (2.1.2), and no
   positive `tabindex` reorders flow. Confirm Enter/Space/Escape/arrow behavior matches the
   control's role. Flag any control reachable only by pointer.
5. **Focus order & visibility.** Verify DOM/tab order is a meaningful sequence (2.4.3) and
   every focusable element has a visible focus indicator (2.4.7) meeting the focus-ring
   requirement (per UI-06). Flag `outline:none` with no replacement and focus lost after
   route/modal changes.
6. **Contrast.** Compute contrast ratios for text and meaningful UI: normal text ≥ 4.5:1,
   large text (≥ 24px, or ≥ 19px bold) ≥ 3:1 (1.4.3), and UI components/graphical objects
   ≥ 3:1 (1.4.11). Resolve colors from tokens/CSS; state the measured ratio in the finding.
7. **Touch targets.** Check interactive targets meet ≥ 44×44px with adequate spacing
   (WCAG 2.2 2.5.8 Target Size (Minimum); per UI-06). Flag icon-only buttons, dense list
   actions, and links whose hit area is smaller than the visual affordance.
8. **Reduced-motion.** Confirm animation/transition/parallax honors
   `prefers-reduced-motion: reduce` (2.3.3; per UI-07) and no essential content relies on
   motion alone. Flag auto-playing/looping motion with no reduced-motion path or pause.
9. **VERIFY each finding before flagging.** Point to the exact source/selector and name the
   concrete failure (which element, which state, which criterion). If you cannot pin the
   element and criterion, drop it or downgrade to a question — do not emit "might not be
   accessible". Prefer re-reading the markup or re-running the scanner over guessing.
10. **Write, order, verdict.** Record each kept finding in contract form (step "Inputs/
    Outputs"). Sort blockers → major → minor. Set verdict: `fail` if any blocker or any
    text-contrast/keyboard-trap/unnamed-control finding exists, else `pass`. Run the
    Quality Gate; drop or fix any finding that fails it.

## Decision Points
- Finding you cannot tie to a specific WCAG 2.2 criterion → drop it or raise as a question;
  every finding must name a criterion.
- Automated scanner flags something you cannot reproduce in the markup → verify manually
  (step 9); do not forward a false positive.
- Fix requires a token/palette or motion-system change beyond this surface → note it and
  escalate to the owning Lead / engineering-manager (WF-08); do not redesign in the audit.
- AAA-level nicety vs. AA requirement → audit to AA (UI-05); mark AAA suggestions as
  optional, never as blockers.
- Tempted to edit the markup/styles to "just fix it" → stop. This pass is read-only; return
  the fix as a described suggestion, never an edit.

## Quality Gate (inline pass/fail before returning)
- [ ] Scope was bounded to the named surface; the whole app was not loaded — per EF-03.
- [ ] All seven checks ran: automated scan, semantics, keyboard, focus order/visibility,
      contrast, touch targets, reduced-motion.
- [ ] Every finding names a specific WCAG 2.2 criterion + severity — per UI-05.
- [ ] Every finding has `file:line`/selector + why it fails + a concrete fix.
- [ ] Contrast findings state the measured ratio and threshold (4.5:1 / 3:1) — per UI-05.
- [ ] Touch-target findings cite the ≥ 44×44px requirement — per UI-06.
- [ ] Reduced-motion checked against `prefers-reduced-motion` — per UI-07.
- [ ] Findings ordered blockers → major → minor; no finding is an unverified guess.
- [ ] No code, markup, or styles were edited; output is findings only.
- [ ] No Knowledge rule pasted inline; all cited by ID — per EF-01.
- [ ] A verdict (`pass` / `fail`) with the blocking-finding count is included.

## References (pointers by rule ID; never inline a standard)
- Standards → cite by rule ID: UI-05 (WCAG 2.2 AA baseline: contrast, focus, keyboard,
  semantics), UI-06 (touch targets ≥ 44×44px, visible focus ring), UI-07 (reduced-motion,
  motion timing); workflow EF-01, EF-03, WF-08. Never inline.
- UI standards catalog → `Knowledge/ui-guidelines.md` (UI-*). Rule-ID map → `Knowledge/_index.md`.
- Execution loop + Output Contract → `Knowledge/development-workflow.md`.
