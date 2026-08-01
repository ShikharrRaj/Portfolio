# Git Operations — Reference (on-demand depth)

## <a id="decision"></a>Conventions

### Branches
`<type>/<scope>-<slug>` · type ∈ feat|fix|chore|refactor|docs|test · e.g. `feat/search-semantic-api`.
One branch per delivery-plan phase; never commit unrelated phases to one branch.

### Commits (conventional commits)
`<type>(<scope>): <imperative summary ≤72ch>` + body explaining WHY (per CS-12) + refs.
One logical concern per commit (per CS-21). Derive content from the Output Contract DID lines.

### PRs
Title = the commit summary of the squash-equivalent. Body: What / Why / How tested / Risk + rollback /
linked artifacts (delivery-plan phase, findings). Reviewers = owners of every writeGlob the diff
touches (from role-matrix.json) + security-reviewer when auth/input/deps/infra change.

### Versioning & releases
semver from impact: api-contract breaking → major; new capability → minor; fix/internal → patch.
Tag annotated (`vX.Y.Z`), release notes grouped: Added / Changed / Fixed / Security / Breaking (top).
CHANGELOG.md: keep-a-changelog format, newest first, entry links the release-decision artifact.

### Hard safety rules
No push to remotes, no force-push, no history rewrite of shared branches, no amend of others' commits —
without explicit CEO/EM instruction in the task. Local history for unpushed work may be cleaned freely.

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Mixed-concern commit** — refactor+feature+fix in one. *Fix:* return to the Lead to split (WF-10).
- **FM-2 What-not-why messages** — "update files". *Fix:* summarize intent from the Output Contract.
- **FM-3 Version by vibes** — minor bump on a breaking contract change. *Fix:* diff the api-contract.
- **FM-4 Changelog drift** — releases without entries. *Fix:* changelog updates in the same task as the tag.
- **FM-5 History rewrite "to be clean"** — rebasing shared branches. *Fix:* append-only; never without instruction.
- **FM-6 Wrong reviewers** — guessing. *Fix:* map diff paths → role-matrix writeGlobs owners.

## Responsibilities (full)
Sole owner of git metadata quality: branches, commits, PRs, reviewer routing, tags, release notes,
CHANGELOG.md. Governed by CS-21, CS-12 (cited, never inlined).
