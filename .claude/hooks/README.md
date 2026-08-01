# Engineering OS Hooks — enforcement layer (validated against Claude Code 2.1.x)

Two walls: (1) each subagent's `tools` allowlist in `.claude/agents/*.md` — BARE tool names, so a role
without `Write`/`Edit` physically cannot edit; (2) these hooks, which add **per-role path scoping** that
`tools` cannot express. Primary source of truth for boundaries: [`.claude/role-matrix.json`](../role-matrix.json).

| Hook | Event | Enforces |
|------|-------|----------|
| `guard-write-scope.sh` → `lib/guard-write-scope.py` | PreToolUse(Write\|Edit\|MultiEdit) | Constrains **identified roles only** — the operator (main thread, no matrix role) is trusted and unrestricted. When a role is acting (`subagent_type`/`agent_type` in payload, or `EOS_ROLE`), it enforces that role's `writeGlobs` from `role-matrix.json`: read-only roles can't write, builders can't write out of domain, and infra (Knowledge/.claude/templates/scripts/the constitution) is never overwritten. |
| `enforce-readonly.sh` | PreToolUse(Bash) | Blocks mutating shell for read-only roles (`EOS_ROLE_READONLY=1`). |
| `require-selfcheck.sh` | Stop | Blocks completion until the DoD artifact exists (`EOS_DOD_ARTIFACT=<path>`). |

## Validated facts (from the 2.1.201 binary + settings schema, 2026-07-04)
- **Settings structure** ✅ — `{matcher, hooks:[{type:"command", command}]}` per event; `$CLAUDE_PROJECT_DIR` substituted.
- **stdin payload** ✅ — carries `tool_name`, `tool_input.file_path` / `tool_input.command`, `subagent_type`/`agent_type`, `cwd`, `session_id`.
- **Deny mechanism** ✅ — canonical is stdout JSON `hookSpecificOutput.permissionDecision:"deny"` (PreToolUse) / `{"decision":"block"}` (Stop). These hooks emit that JSON **and** exit 2 (fail-safe).

## Env flags
- `EOS_ROLE=<role-slug>` — force role identity (deterministic; use if the harness doesn't surface `subagent_type` to the hook).
- `EOS_ROLE_READONLY=1` — for reviewers, security, performance, accessibility, seo, animation.
- `EOS_DOD_ARTIFACT=<path>` — the self-check artifact the role must produce this session.
- `EOS_ALLOW_INFRA_WRITE=1` — sanctioned override for editing standards/templates/scripts (Owners only).

## Testing

**Repeatable wiring test (run anytime):** `node scripts/simulate-hooks.mjs` reads this `settings.json`,
matches tool names to each `matcher`, resolves `$CLAUDE_PROJECT_DIR`, and drives every hook exactly as the
harness does (9 scenarios, incl. per-role scope + read-only + Stop).
> ⚠ **Quoting is mandatory.** Hook command paths in `settings.json` MUST be wrapped in escaped quotes
> (`"\"$CLAUDE_PROJECT_DIR/.claude/hooks/x.sh\""`). A project path containing a space (like "Engineering OS")
> otherwise splits at the space and every hook silently fails to run. Caught by the wiring test.

## 60-second live confirmation (run in a FRESH interactive `claude` session in this repo)
A mid-session settings change is not hot-reloaded, so verify end-to-end after a restart:
1. Open a new session in this project (so `.claude/settings.json` loads).
2. Ask Claude to write a file to `Knowledge/test.md`. Expect: **blocked** with the infra reason.
3. Ask it to write to `src/app/test.txt`. Expect: **allowed** (no role identity on the main thread).
4. (Optional) `export EOS_ROLE=security-reviewer` before launching, then ask to write anything → **blocked** (read-only).
If step 2 is NOT blocked, your version surfaces a different stdin/deny contract — adjust `lib/guard-write-scope.py`
(the fields are isolated at the top).
