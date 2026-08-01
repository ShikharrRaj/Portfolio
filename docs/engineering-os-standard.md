# Engineering OS — Skill Architecture Standard (v1.0, Normative)

> **Status:** Ratified constitution. Every future role, procedure, and standard is built against
> this document. Deviation requires written trade-off analysis approved by the CEO.
> **How this was chosen:** a 4-way design bake-off scored by independent judges. Design **C
> (Subagent-Native Org)** won on both surviving scorecards; Design **D (Three-Layer Hybrid)** was a
> close second and three of its mechanisms are grafted in. See §1.

---

## 1. Decision & Rationale

**Winner: Design C (Subagent-Native Org), grafted with mechanisms from D, A, and B.**

Both independent judge scorecards ranked **C #1, D #2**, for the same two reasons:

1. **C makes "no role overlap" a mechanical, harness-layer invariant** — a tool allowlist, not prose.
   A reviewer with `tools: Read, Grep, Glob` *cannot emit an edit*; the tool does not exist in its
   context. Backed by a write-scope hook and a read-only hook.
2. **C cleanly decouples the three primitives** so procedures are role-agnostic and reused across the
   whole org instead of duplicated inside every role — the only shape that scales to 19+ roles without
   N-way duplication.

The literal 800–1500-line monolith (Design A) scored **last even when steelmanned**: it pays the
highest per-turn token cost and duplicates role definitions, the worst maintainability property at scale.

**Grafted in (following the evidence, not averaging):**
- **From D:** (1) the fixed **Output Contract** every role returns upward; (2) **stable rule IDs** in
  Knowledge (`CS-07`) with provenance headers — cite in ~4 tokens vs ~80 to restate; (3) per-layer
  **budget-check** CI.
- **From A:** the honest recognition that path-based enforcement **cannot separate two builders editing
  the same file** (handled via `sharedDomains` + EM arbitration), and the **static handoff-chain lint**.
- **From B:** the **residency-vs-retrieval** framing, and self-check gates that **name the exact deferred
  file to read**, mitigating the progressive-disclosure retrieval risk.

### The residency rule (resolves the 800–1500 line tension) — CONSTITUTIONAL
> **Line count is a depth budget, not a residency budget.** A role's total specification may be deep
> (800–2000+ lines across all its files), but only its **always-loaded surface** may be resident per turn.

| Content class | Billed | Hard ceiling (CI-enforced by `scripts/budget-check.mjs`) |
|---|---|---|
| **Always-loaded** — subagent body, skill `description`, `.claude/CLAUDE.md`, `Knowledge/*` | every turn | body **≤180 ln**; description **≤60 words**; `CLAUDE.md` **≤120 ln**; each `Knowledge/*.md` **≤200 ln** |
| **On-demand once** — `SKILL.md` body | once per invocation | **≤400 ln** |
| **On-demand deep** — `reference.md`, `examples/`, `checklists/`, `scripts/` | only when `Read` | **unlimited** |

The CEO's 800–1500 lines are **honored in full** — as a role's *total governed surface*, progressively
disclosed. `scripts/build-role-doc.mjs` concatenates a role's body + all deferred assets into one readable
`docs/roles/<role>.md` for human onboarding/audit. **Depth for people via concatenation; tiered loading for
the machine.** The always-loaded monolith is rejected: it costs tokens every turn (violates efficiency),
duplicates standards N times (violates the token strategy), and degrades instruction-following.

---

## 2. The Conceptual Model

An Engineering OS **role** is a **subagent** — *who acts* — a thin always-loaded boundary (tool allowlist +
description) enforced by the harness. A **skill** is a **procedure** — *how a class of work is done* —
written once, role-agnostic, invoked on demand. A **Knowledge file** is a **standard** — *what we know* —
the single source of truth, cited by stable rule ID, never copied. Roles pull procedures at execution time,
cite standards by pointer, keep depth in on-demand files, and exchange **typed artifacts** + a fixed
**Output Contract** rather than prose.

| Concept | Primitive | Path | Load semantics | Enforces |
|---|---|---|---|---|
| Any role (EM, PM, Architect, Leads, specialists) | **Subagent** | `.claude/agents/<role>.md` | body always-loaded per turn (≤180 ln) | *who* — boundary via `tools` |
| Reusable procedure | **Skill** | `.claude/skills/<verb-noun>/` | body on-demand once (≤400 ln) | *how* — repeatable method |
| Shared standard | **Knowledge** | `Knowledge/<name>.md` | cited by ID; loaded on demand | *what* — single source of truth |
| Multi-role orchestration | **Playbook** | `playbooks/<flow>.md` | read by EM when routing | sequencing |
| Cross-role deliverable | **Typed artifact** | `projects/<p>/handoffs/**` | one writer, next reader | isolation-safe handoff |
| Machine-readable boundaries | **Role matrix** | `.claude/role-matrix.json` | read by linters | overlap + DAG checks |

---

## 3. Repo Folder Layout

```
Engineering OS/
├── .claude/
│   ├── settings.json                 # hook registry
│   ├── CLAUDE.md                     # ALWAYS-LOADED ≤120 ln. Org map + routing + Knowledge pointers.
│   ├── role-matrix.json              # canonical boundaries + handoff DAG (linters read this)
│   ├── agents/                       # ROLES = subagents
│   │   ├── engineering-manager.md
│   │   ├── <lead>.md ...
│   │   ├── specialists/<specialist>.md ...
│   │   └── _role-assets/<role>/       # on-demand depth: reference.md, examples/, checklists/
│   ├── skills/<verb-noun>/SKILL.md    # PROCEDURES = reusable, role-agnostic
│   └── hooks/                         # guard-write-scope.sh, enforce-readonly.sh, require-selfcheck.sh
├── Knowledge/                         # STANDARDS = single source of truth (≤200 ln each)
│   ├── _index.md  development-workflow.md  tech-stack.md  coding-standards.md
│   ├── architecture-principles.md  ui-guidelines.md  ai-guidelines.md
├── templates/                         # ROLE.template.md  SKILL.template.md  STANDARD.template.md
├── playbooks/                         # prd-to-production.md ...
├── projects/<slug>/                   # prd/ arch/ plan/ design/ handoffs/ escalations/
├── docs/
│   ├── engineering-os-standard.md     # this document
│   └── roles/<role>.md                # generated by build-role-doc.mjs
├── scripts/                           # budget-check · lint-role-boundaries · lint-handoff-chain · build-role-doc
└── README.md
```

---

## 4. The Reusable ROLE Template (primary artifact)

Source: `templates/ROLE.template.md`. Every section maps to one of the CEO's 16 required sections. The
**Load** column is the enforceable contract: `ALWAYS` counts against the ≤180-line body budget; `DEFER→<f>`
is a one-line pointer with content in an on-demand asset.

| # | CEO section | Template section | Load | ~Budget |
|---|---|---|---|---|
| 1–2 | Identity, Mission | Identity & Mission | ALWAYS | 8 ln |
| 3–4 | Responsibilities, Boundaries | Owns / Does-NOT-Own | ALWAYS | 14 ln |
| 5–6 | Inputs, Outputs | Inputs/Outputs contract | ALWAYS | 15 ln |
| 7 | Decision framework | Decision Framework | ALWAYS | 15 ln (deep→reference.md) |
| 8, 15 | Step reasoning, Execution workflow | Execution Workflow (ref) | ALWAYS | 6 ln (loop in Knowledge) |
| 9–10 | Collaboration, Escalation | Escalation & Handoff | ALWAYS | 12 ln |
| 11 | Constraints | Standards I obey | ALWAYS | 6 ln (rule IDs only) |
| 12 | Quality checklist | (pointer) | DEFER→`checklists/dod.md` | 1 ln |
| 13 | Anti-patterns / failure modes | (pointer) | DEFER→`reference.md` | 1 ln |
| 14 | Good-vs-bad examples | (pointer) | DEFER→`examples/good-bad.md` | 1 ln |
| 16 | Efficiency | Efficiency (ref) | ALWAYS | 4 ln |
| — | Procedures I run | Procedures available | ALWAYS | 8 ln (skill names only) |

**Budget arithmetic:** ALWAYS sections sum to ~110–140 lines → inside the ≤180 ceiling. Sections 12/13/14
carry the depth in deferred assets (unlimited). **Always-loaded per turn ≈140 lines; total governed surface
per role 800–2000 lines.** That is how the depth requirement and the efficiency requirement coexist.

**Retrieval-gap mitigation (graft from B):** deferred pointers must name the exact file AND the trigger. The
self-check gate (WF-06) reads `checklists/dod.md` by name; the Decision Framework names `reference.md` at each
non-trivial branch.

---

## 5. The PROCEDURE (Skill) & KNOWLEDGE Templates

- **`templates/SKILL.template.md`** — a role-agnostic procedure. `description` always-loaded (the trigger);
  body ≤400 ln on-demand; deeper detail → `reference/`. Never bake a role name into a skill — a procedure
  is invocable by any role with matching tools. This is what compounds reuse across projects.
- **`templates/STANDARD.template.md`** — a Knowledge file. Provenance header (Owner + Consumed-by), numbered
  **stable rule IDs**, ≤200 ln. One owner per file (graft from B) so the knowledge base is never an overlap
  battleground. Register the ID prefix in `Knowledge/_index.md`.

---

## 6. The Rule System

### 6.1 Behavioral rules (standing)
1. **Pointer, never paste** (EF-01). Cite standards by rule ID; >5 copied lines = lint failure.
2. **Pull, don't preload** (EF-02). Preload a skill into a role body only if the role is useless without it.
3. **Summarize upward, retain downward** (EF-04). Return the Output Contract; verbose work stays isolated.
4. **Relevant files only** (EF-03). No whole-repo loads.
5. **Budget is law** (EF-06). Over-budget always-loaded files fail CI.

### 6.2 "No role overlap" — MECHANICAL first, prose second
Enforcement layers (validated against Claude Code 2.1.x — see Appendix):
1. **Tool allowlist (`tools:` in the agent file, BARE names)** — read-only roles omit `Write`/`Edit`; they
   *cannot* edit. The coarse capability wall. Path/arg scoping is NOT expressible here.
2. **Per-role write-scope hook** (`guard-write-scope.sh`, PreToolUse) — constrains **identified roles only**;
   the human operator (main thread, no matrix role) is trusted and unrestricted, so the org can be maintained
   freely. When a role is acting (payload `subagent_type`/`agent_type`, or `EOS_ROLE`), it enforces that
   role's `writeGlobs` from `.claude/role-matrix.json`: a builder cannot write outside its domain, read-only
   roles cannot write at all, and protected infra (standards/templates/scripts/`.claude`) is never
   overwritten. Denies with the canonical `hookSpecificOutput.permissionDecision:"deny"`.
3. **Read-only shell hook** (`enforce-readonly.sh`, PreToolUse on Bash) — blocks mutating shell for roles run
   with `EOS_ROLE_READONLY=1`.
4. **(Optional) `permissions.deny`** in project `settings.json` — rule syntax (`Write(src/**)`) for
   universally-forbidden paths. This — NOT agent frontmatter — is where Claude Code path-scoping belongs.

> **Honest limit (graft from A):** tool walls separate reviewers from builders, but they **cannot separate two
> builders who edit the same file** (backend vs database on `prisma/schema.prisma`; a11y/seo/perf/animation
> inside one React component). These are declared in `role-matrix.json` `sharedDomains`: the non-owner emits
> advisory findings, does not edit, and the **Engineering Manager arbitrates**. We do not pretend the wall
> covers same-file overlap.

### 6.3 Escalation protocol
See `Knowledge/development-workflow.md#escalation`. Ownership collisions sink to the EM (sole arbiter, never
builds); input ambiguity escalates up the build chain; standard conflicts go to the file's Owner; nesting ≤5 levels.

### 6.4 Collaboration / handoff contract
Artifacts not conversation; one writer per artifact; idempotent summaries; version-pinned Knowledge IDs in
each handoff; `scripts/lint-handoff-chain.mjs` fails CI on any `consumes` with no upstream `produces`.

### 6.5 Token / context discipline
Always-loaded ceilings (§4) enforced by `budget-check.mjs`. Standards loaded on demand by ID. Return ≤15-line
Output Contracts. **Fast-path (EF-07):** EM may dispatch a trivial single-domain task straight to one specialist.

---

## 7. The Standard Execution Workflow

Defined ONCE in `Knowledge/development-workflow.md#execution-loop` (WF-01…WF-08); every role references it.
The **Output Contract** (`#output-contract`) is the universal handoff currency: five specialist contracts
compress into one Lead contract before reaching the Architect, so parent context stays flat as org depth grows.
Steps **WF-02** (scope-check) and **WF-06** (self-check) are hook-backed — the two points models most often cheat.

---

## 8. Worked Example — Engineering Manager

See `.claude/agents/engineering-manager.md` (always-loaded body ~150 lines) + its `_role-assets/`
(`reference.md`, `examples/good-bad.md`, `checklists/dod.md`). Run `node scripts/build-role-doc.mjs
engineering-manager` to produce the merged human-readable dossier at `docs/roles/engineering-manager.md`.
Total EM spec: ~150 always-loaded + ~200 on-demand lines = deep coverage, cheap per turn.

---

## 9. Quality Bar / Definition-of-Done

**New ROLE is done when:** `description` ≤60 words with explicit NOT-domain → owner; `tools` matches the
matrix (read-only roles omit Write/Edit); body ≤180 ln (`budget-check` green); all 16 CEO sections at their
correct load tier; every deferred pointer names its file; zero overlap (`lint-role-boundaries` green);
inputs match upstream outputs (`lint-handoff-chain` green); zero inlined Knowledge; returns the Output
Contract; has `checklists/dod.md`; `build-role-doc.mjs` produces a coherent dossier.

**New SKILL is done when:** `description`+`when_to_use` ≤1536 chars, role-agnostic (no role name baked in);
body ≤400 ln; deterministic Steps + inline Quality gate; cites Knowledge by ID; invocable by ≥2 roles.

**New STANDARD is done when:** stable rule IDs, provenance header, ≤200 ln, one owner, prefix in `_index.md`.

---

## 10. Phase-1 Build Order

**Confirmed: Foundation → Engineering Manager → Staff Architect → Product Manager → Frontend/Backend Leads.**

1. **Foundation (done in v1.0 scaffold):** git; `Knowledge/development-workflow.md` + `_index.md` + 5 seed
   standards; 3 templates; `role-matrix.json`; the 4 scripts; `settings.json` + 3 hooks; `.claude/CLAUDE.md`.
   Linters land **first** — enforcement is fiction until the scripts exist.
2. **Engineering Manager (done in v1.0 scaffold):** the router + escalation sink, with its hooks.
3. **Staff Architect before Product Manager (authoring order):** the Architect consumes the PRD, so author
   it second to give the EM a concrete downstream and let the handoff chain be linted; author PM third to
   produce the artifact the Architect consumes. *Authoring order ≠ runtime order* — at runtime PM still
   executes before the Architect.
4. **Frontend Lead + Backend Lead together:** so their write-globs (`src/app/**` vs `src/server/**`) are
   defined as a validated non-overlapping pair.
5. **Gate before specialists:** run one real PRD→plan→arch→FE/BE slice end-to-end; confirm
   `lint-handoff-chain` is green and the Output Contract roll-up holds before expanding to the 12 specialists.
   Prove the spine before growing the limbs.

Rule of thumb: **author a role only after its upstream producer and its enforcement tooling exist**, so every
role is chain-linted and budget-checked the moment it lands.

---

## Appendix — Validation results (validated 2026-07-04)
Verified empirically against the installed binary (running **2.1.197**; `2.1.201` native binary + its
`claude-code-settings.schema.json`):
1. **Hook settings structure — CONFIRMED.** `hooks.<Event> = [{matcher, hooks:[{type:"command", command}]}]`;
   `$CLAUDE_PROJECT_DIR` is substituted. Events include `PreToolUse`, `PostToolUse`, `Stop`, `SubagentStop`, …
2. **Hook I/O — CONFIRMED.** stdin payload carries `tool_name`, `tool_input` (`file_path`/`command`),
   `session_id`, `cwd`, and `subagent_type`/`agent_type`. Canonical deny = stdout JSON
   `hookSpecificOutput.permissionDecision:"deny"` (+`permissionDecisionReason`) for PreToolUse, and
   `{"decision":"block","reason"}` for Stop; exit 2 also blocks. Hooks emit the canonical JSON.
3. **Agent frontmatter tool-scoping — CORRECTED.** `tools:` takes **bare tool names**; path/arg scoping
   (`Write(src/**)`) is permission-rule syntax valid only in `permissions.deny` / hook `if`, **not** in agent
   frontmatter. The no-op `disallowedTools: Write(...)` was removed from roles + template; per-role write-globs
   are now enforced mechanically by `guard-write-scope.sh` via `role-matrix.json`.

Reliable frontmatter keys: `name`, `description`, `tools`, `model` (+ optional `permissionMode`, `maxTurns`,
`color`). Hooks are activated in `settings.json`, not agent frontmatter.
Residual manual check: run the 60-second smoke test in `.claude/hooks/README.md` in a fresh interactive
session to confirm hooks fire end-to-end on this machine (a mid-session settings change is not hot-reloaded).

*End of standard. `scripts/*.mjs` are its enforcement; `Knowledge/*` are its single source of truth.*
