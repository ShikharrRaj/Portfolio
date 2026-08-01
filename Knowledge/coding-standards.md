# Coding Standards

> Status: canonical (v1.0) · Owner: staff-architect · Consumed-by: all builder roles, code-reviewer, security-reviewer, qa-automation
> Cited as `per CS-NN`. Never inline this file into a role or skill (EF-01). One enforceable rule per bullet; IDs are stable and never reused or renumbered.

## Rules

### Types & correctness
- **CS-01** TypeScript `strict` is mandatory. No `any` without an inline justification comment; prefer `unknown` + narrowing.
- **CS-02** No implicit `null`/`undefined` handling — model absence explicitly; return typed results, not thrown control-flow.
- **CS-16** Parse, don't validate: convert unknown input into a precise domain type once at the boundary, then trust the type downstream.
- **CS-17** No unsafe casts (`as X`, `!` non-null) past a boundary; a cast requires an inline reason and a preceding runtime check.
- **CS-18** Make illegal states unrepresentable: prefer discriminated unions and narrow types over boolean flags and optional soup.

### Structure & size
- **CS-03** Functions do one thing. Extract when a function exceeds ~40 lines or nests >3 levels.
- **CS-07** Every module has a single clear responsibility and a stable public surface; internal helpers stay private.
- **CS-19** Module boundaries are explicit: export only the public surface via a single entry point; import from siblings' internals is forbidden.
- **CS-20** No circular dependencies between modules; dependencies point inward (domain never imports infrastructure).
- **CS-21** Keep the change reviewable: one logical concern per commit/PR; unrelated refactors go in a separate PR.

### Naming
- **CS-04** Names describe intent, not type (`activeUsers`, not `arr`). Match the surrounding file's existing idiom.
- **CS-05** No magic values. Hoist to named constants or config; centralize enums/unions.
- **CS-22** Naming is consistent and searchable: booleans read as predicates (`isReady`, `hasAccess`); async functions and side-effecting names are unambiguous; no abbreviations outside established domain terms.

### Errors & failure
- **CS-06** Errors: fail fast at boundaries, validate all external input (zod or equivalent), never swallow errors silently.
- **CS-23** Throw typed/domain errors, never bare strings; preserve the cause chain (`{ cause }`) — never discard the original error.
- **CS-24** Handle errors where you can act on them; a `catch` must recover, enrich-and-rethrow, or surface — never empty, never log-and-continue by default.
- **CS-25** External calls (network, disk, DB) have explicit timeouts and bounded retries with backoff; no unbounded waits or naive infinite retry.

### Async & concurrency
- **CS-08** Async: no floating promises; handle or `await` every promise; no `async` without `await` in body.
- **CS-26** Independent async work runs concurrently (`Promise.all`/`allSettled`); never serialize awaits that have no data dependency.
- **CS-27** Shared mutable state across async boundaries is guarded (idempotency key, lock, or atomic op); assume interleaving and races by default.
- **CS-28** Every async operation is cancellable or bounded (`AbortSignal`/timeout); long work must not leak on request abort or shutdown.

### Immutability & data flow
- **CS-15** Prefer composition and pure functions over inheritance and shared mutable state.
- **CS-29** Treat data as immutable: no mutation of inputs, shared objects, or exported constants; return new values (`readonly`, spreads, `Object.freeze` where load-bearing).
- **CS-30** Isolate side effects: keep I/O and mutation at the edges; core logic is pure and dependency-injected so it is testable without mocks of the world.

### Security in code
- **CS-13** Secrets never in source; read from env/secret manager. No credentials in logs.
- **CS-31** All external input is treated as hostile: validate, and use parameterized queries / safe builders — never string-concatenate SQL, shell, HTML, or paths.
- **CS-32** Output is encoded for its sink (HTML/URL/SQL/shell) to prevent injection; authz is checked at every boundary, never assumed from a prior layer.
- **CS-33** Least privilege in code: request the narrowest scope/permission/column set needed; never widen access for convenience.

### Logging & observability
- **CS-34** Logs are structured (key/value, not string soup) and carry correlation/trace context; log at boundaries and on error, not in hot loops.
- **CS-35** Never log secrets, credentials, tokens, or PII; redact by default and prefer allowlisting fields over blocklisting.
- **CS-36** Log levels are meaningful: `error` is actionable and alertable, `warn` is recoverable, `info` is a state change, `debug` is diagnostic — no `error` for expected flow.

### Testing depth
- **CS-09** Tests colocated or mirrored under `tests/`; each bug fix adds a regression test; public behavior is tested, not internals.
- **CS-37** Tests assert behavior and edge cases (empty, boundary, error, concurrency), not just the happy path; every branch of business logic is exercised.
- **CS-38** Tests are deterministic and isolated: no shared mutable state, no real network/clock/randomness — inject time and dependencies; flaky tests are bugs, not retried.
- **CS-39** Assertions are specific (exact value/error, not truthiness); no test without a meaningful assertion; coverage is a signal, not a target to game.

### Comments & documentation
- **CS-12** Comments explain *why*, not *what*. Match the file's existing comment density.
- **CS-14** Public functions and exported types carry doc comments describing contract and failure modes.
- **CS-40** Comment the non-obvious: invariants, gotchas, and links to the decision (ADR/issue) for any non-local or surprising choice; no restating code in prose.

### Hygiene & tooling
- **CS-10** No commented-out code and no dead code in commits; delete it (git remembers).
- **CS-11** Formatting/linting are automated (Prettier + ESLint); never hand-format. CI blocks on lint.
- **CS-41** No unreachable code, unused exports, or dead branches; a symbol with no live caller is removed, not left "just in case".
- **CS-42** No `TODO`/`FIXME` without a tracked issue reference; no `console.*` or debug scaffolding, no skipped/`only` tests, in committed code.

## Rationale
Deterministic, reviewable code lowers cognitive load for the next agent (human or AI) and makes
automated review high-signal. These rules exist so that (1) a reviewer can verify correctness from
the diff alone, without running it in their head; (2) failures are loud and localized instead of
silent and diffuse; and (3) any role can cite one stable ID to justify a change or a rejection,
keeping review objective rather than a matter of taste. Every rule is written to be mechanically
checkable or unambiguously arbitrable — if a rule cannot gate a PR, it does not belong here.

## Exceptions & how to request one
No rule is absolute; deviations are allowed but never silent. To request one:
1. **Justify inline** at the deviation site with a comment naming the rule (`// CS-25 exception: <reason>`), the trade-off accepted, and the bound (scope/expiry) of the deviation.
2. **Flag it** in the Output Contract `OPEN` field so `code-reviewer` sees it without diffing the whole change.
3. **Ratification:** `code-reviewer` may accept a local, low-blast-radius deviation; anything touching security (CS-13, CS-31..CS-33), data integrity, or a public contract escalates to `staff-architect`.
4. **No retroactive silence:** an unjustified deviation found in review is a defect, not an exception — it blocks merge until justified or fixed.
Standing exceptions (a rule that is wrong for this codebase) are not inline comments — propose a standard amendment to the Owner so the rule itself changes for everyone.
