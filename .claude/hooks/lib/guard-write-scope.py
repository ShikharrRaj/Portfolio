#!/usr/bin/env python3
"""Per-role write-scope guard for PreToolUse(Write|Edit|MultiEdit).

Constrains AUTONOMOUS ROLES, not the human operator. If no role identity is present
(main thread = the operator maintaining Engineering OS), writes are allowed. When a role IS
acting (EOS_ROLE, or subagent_type/agent_type in the payload that matches a role in
role-matrix.json) it is confined to its writeGlobs, read-only roles cannot write, and protected
infrastructure (Knowledge/.claude/templates/scripts/the constitution) cannot be overwritten
(override: EOS_ALLOW_INFRA_WRITE=1).

Deny = canonical PreToolUse JSON on stdout + exit 2. Allow = exit 0.
"""
import sys, json, os, re

def deny(reason):
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }}))
    sys.exit(2)

try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(0)

ti = d.get("tool_input") or {}
path = ti.get("file_path") or ti.get("path") or ""
if not path:
    sys.exit(0)

# Constrain autonomous roles only; the operator (no matrix role) is trusted.
role = os.environ.get("EOS_ROLE") or d.get("subagent_type") or d.get("agent_type") or ""
if not role:
    sys.exit(0)

proj = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
rel = path[len(proj):].lstrip("/") if proj and path.startswith(proj) else path

mpath = os.path.join(proj, ".claude", "role-matrix.json")
try:
    r = json.load(open(mpath)).get("roles", {}).get(role)
except Exception:
    r = None
if r is None:
    sys.exit(0)  # not one of our roles -> defer to other layers

if r.get("readOnly"):
    deny("Role '%s' is read-only and cannot write (reviewers emit findings, not edits). Blocked write to '%s'." % (role, rel))

if os.environ.get("EOS_ALLOW_INFRA_WRITE") != "1":
    for top in ("Knowledge/", ".claude/", "templates/", "scripts/"):
        if rel.startswith(top):
            deny("Role '%s' may not modify protected infrastructure '%s'. Escalate to the file Owner." % (role, rel))
    if rel == "docs/engineering-os-standard.md":
        deny("Role '%s' may not modify the constitution (docs/engineering-os-standard.md)." % role)

def g2re(g):
    return re.escape(g).replace(r"\*\*", ".*").replace(r"\*", "[^/]*")
patterns = [g2re(g) for g in (r.get("writeGlobs") or [])]
patterns += [r"projects/[^/]*/handoffs/.*", r"projects/[^/]*/escalations/.*"]
if not any(re.match(p + r"$", rel) for p in patterns):
    deny("Role '%s' may write only to %s (+ project handoffs/escalations). Blocked out-of-scope write to '%s'." % (role, r.get("writeGlobs") or [], rel))

sys.exit(0)
