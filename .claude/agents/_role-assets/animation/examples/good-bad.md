## Surface: entrance + hover motion on a `<Card>` in `src/components/Card.tsx`

### ✅ GOOD — a finding that is meaningful, reduced-motion-safe, 60fps, correctly timed, state-complete
```
Finding (animation-spec, Card entrance + hover):
  Surface:   <Card> list, enter on mount + hover lift.
  Meaning:   enter communicates new items arriving; hover confirms interactivity (per UI-07). Keep both.
  Timing:    enter 240ms ease-out · hover 200ms ease-out · exit 160ms ease-in (per UI-07).
  Perf:      animate transform: translateY(8px→0) + opacity 0→1; hover = transform: scale(1.02).
             NO width/top/box-shadow animation — holds 60fps (per UI-07).
  States (per UI-03): enter (stagger 40ms), exit (fade+translate down 160ms), gesture (hover scale, focus ring).
  Reduced-motion: prefers-reduced-motion:reduce → skip translate/stagger, 80ms opacity fade only;
             hover feedback stays (border/opacity), no scale (per UI-07).
  Handoff:   frontend-lead implements; this is spec, not code.
```
Why good: motion is justified (communicates arrival/interactivity), timed to 200–300ms, transform/opacity
only (60fps), every state specified, and a reduced-motion path preserves feedback. FE builds with zero
motion invention. Returned via the Output Contract — not written to a file.

### ❌ BAD — a finding that is decorative, unconditional, thrashy, mistimed, and half-specified
```
Finding: "The cards should animate in nicely — maybe a fun 900ms bounce that grows their width from 0,
 with a looping shimmer so it feels alive. Looks great, ship it."
```
Why bad: decorative "feels alive" motion with no informational payload (FM-1); no reduced-motion path —
the loop will nauseate motion-sensitive users (FM-2); animates `width` from 0, forcing layout thrash and
dropped frames (FM-3); 900ms is far outside the 200–300ms micro-interaction window (FM-4); only the
entrance is defined — no exit or hover/focus state (FM-5). Correct move: rewrite as the GOOD finding above.

## Dispute: is a hover "lift" a motion concern or a visual-design concern?
✅ Animation ruling: the *visual* lift (shadow token, elevation) is uiux-lead's design; the *timing, easing,
performance, and reduced-motion behavior* of the lift is the `animation-spec` (per UI-07). I spec the motion;
uiux-lead owns the visual token. Boundary dispute → ESCALATE to engineering-manager.
❌ Anti-pattern: I edit `Card.tsx` to "just fix the transition myself" — that is frontend-lead's
implementation and a read-only violation (FM-6); the guard denies the write. I return the spec instead.
