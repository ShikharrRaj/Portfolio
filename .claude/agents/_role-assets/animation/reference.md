## <a id="decision"></a>Decision trees

### Keep or cut this motion? (per UI-07)
Motion must earn its place; cut it unless it passes:
1. Does it communicate state, causality, or spatial continuity (where a thing came from / went)? Keep.
2. Does it give feedback for a user action (press, drag, submit)? Keep.
3. Is it purely ornamental — motion for "delight" with no informational payload? Cut it.
4. Does it delay the user reaching content (long entrances on load)? Cut or shorten to <300ms.
"It looks cool" is NOT a reason. Motion that doesn't communicate is decoration and gets removed.

### Timing & easing model (per UI-07)
| Interaction | Duration | Easing intent |
|---|---|---|
| Micro (hover, toggle, focus, button press) | 200–300ms | ease-out (fast-in, settle) |
| Enter (element appears) | 200–300ms | ease-out / decelerate |
| Exit (element leaves) | 150–200ms | ease-in / accelerate — exits are quicker than entrances |
| Larger transition (route/panel) | 300–500ms | ease-in-out; justify anything >500ms |
Avoid linear easing for UI (feels mechanical). Springs are fine when the settle communicates weight.

### Performance model — 60fps (per UI-07)
Animate only compositor-friendly properties; never thrash layout:
| Prefer (cheap) | Avoid (layout/paint thrash) |
|---|---|
| `transform` (translate/scale/rotate), `opacity` | `width`, `height`, `top`, `left`, `margin` |
| `will-change` sparingly on the animated element | animating `box-shadow`/`filter` on large areas |
Budget: one frame ≈ 16.6ms at 60fps. If motion drops frames, the spec is wrong — respecify with
transform/opacity or reduce simultaneous animations. Flag any animation that forces synchronous reflow.

### Reduced-motion path (per UI-07)
EVERY animated surface MUST specify a `prefers-reduced-motion: reduce` fallback:
- Replace movement/parallax with an instant state change or a short (<100ms) opacity fade.
- Never fully remove feedback — a reduced-motion user still needs to know an action registered.
- Disable auto-playing, looping, and large-translate motion entirely under reduce.
A spec without a reduced-motion path is incomplete and blocks handoff.

### State-completeness for motion (per UI-03)
For each animated surface specify: **enter**, **exit**, and **gesture/interaction** (hover, drag,
press, swipe). A surface that only defines the enter animation is an incomplete spec — exit and
interaction states must be declared so frontend-lead never invents them.

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Decorative motion** — animation with no informational payload. *Detect:* motion that doesn't map
  to state/feedback/continuity. *Fix:* cut it or repurpose it to communicate (per UI-07).
- **FM-2 No reduced-motion path** — surface animates unconditionally. *Detect:* no `prefers-reduced-motion`
  branch. *Fix:* specify an instant/short-fade fallback that preserves feedback (per UI-07).
- **FM-3 Layout-thrashing animation** — animating width/top/left/margin. *Detect:* non-transform/opacity
  properties in the motion. *Fix:* respecify with `transform`/`opacity` to hold 60fps (per UI-07).
- **FM-4 Wrong timing** — micro-interaction at 800ms or a 50ms flash. *Detect:* duration outside 200–300ms
  for micro-interactions. *Fix:* bring into 200–300ms; justify any deliberate longer transition (per UI-07).
- **FM-5 Incomplete motion states** — only the enter animation defined. *Detect:* no exit or gesture state.
  *Fix:* specify enter/exit/gesture for the surface so FE invents nothing (per UI-03).
- **FM-6 Scope/impl drift** — spec dictates React/CSS implementation (frontend-lead's), redesigns UX/visual
  (uiux-lead's), or audits general perf/bundle (performance's). *Fix:* STOP; keep to the motion spec, hand
  implementation intent (not code) to FE, escalate design/perf overlap to engineering-manager.

## Responsibilities (full)
Beyond the always-loaded summary: review all motion in `src/components/**` against the `ui-spec` and
`frontend-impl`; author the `animation-spec` as the motion contract — per-surface timing (ms), easing
curves, choreography and sequencing, enter/exit/gesture states, the 60fps performance strategy
(transform/opacity, no thrash), and a mandatory `prefers-reduced-motion` path for every surface;
distinguish meaningful motion from decoration and recommend cuts; return findings and the spec via the
Output Contract (never edit — frontend-lead implements); escalate motion-vs-visual-design or
motion-vs-general-perf overlaps to engineering-manager. Governed by UI-07 (owned motion rule) and UI-03
where motion has states, with CS-*/AR-* cited where implementation or structure bounds the motion — all
by rule ID, never inlined (EF-01). Read-only: run with `EOS_ROLE_READONLY=1`; the guard denies all writes.
