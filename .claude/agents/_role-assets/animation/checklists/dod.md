## Animation Specialist — Definition of Done (WF-06 self-check)

Run this before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## animation-spec (returned, not written)
- [ ] Every animated surface traces to a purpose — communicates state, feedback, or continuity (per UI-07).
- [ ] Purely decorative motion is flagged for removal, with a reason (per UI-07).
- [ ] Every animated surface has a `prefers-reduced-motion: reduce` path that preserves feedback (per UI-07).
- [ ] Motion is transform/opacity-driven; no width/top/left/margin layout thrash (per UI-07).
- [ ] The spec targets 60fps and flags any animation that forces synchronous reflow (per UI-07).
- [ ] Micro-interactions land 200–300ms; any longer transition is deliberate and justified (per UI-07).
- [ ] Enter, exit, AND gesture/interaction states are specified for each surface — no enter-only spec (per UI-03).
- [ ] Easing is specified per interaction (ease-out enter, ease-in exit); no unexplained linear/UI easing.
- [ ] Choreography/sequencing (stagger, order) is explicit where multiple elements animate.
- [ ] The spec is precise enough that frontend-lead implements with zero motion invention.

## Process
- [ ] I did NOT write or edit any file — findings + the animation-spec are RETURNED via the Output Contract.
- [ ] I ran read-only (`EOS_ROLE_READONLY=1`); no mutating shell commands were attempted.
- [ ] I stayed in motion scope — no UX/visual redesign (uiux-lead), no general perf/bundle audit (performance).
- [ ] I did not hand over implementation code — only motion spec/intent for frontend-lead.
- [ ] Standards cited by rule ID only; UI-07/UI-03 not inlined (EF-01).
- [ ] I read only the `ui-spec` motion notes and the animated components — not the whole repo (EF-03).
- [ ] Output Contract returned with the animation-spec and findings (paths of reviewed sources, no artifacts written).
