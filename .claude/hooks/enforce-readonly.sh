#!/usr/bin/env bash
# enforce-readonly.sh — PreToolUse(Bash) guard for read-only roles.
# Run read-only roles (code-reviewer, security-reviewer, performance, accessibility, seo,
# animation) with EOS_ROLE_READONLY=1. Blocks mutating shell even though Bash is available.
# Deny = canonical PreToolUse JSON on stdout + exit 2. Allow = exit 0.
set -euo pipefail

[ "${EOS_ROLE_READONLY:-0}" = "1" ] || exit 0

input="$(cat)"
cmd="$(printf '%s' "$input" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null || true)"
[ -z "$cmd" ] && exit 0

if printf '%s' "$cmd" | grep -Eiq '(\brm\b|\bgit +(commit|push|reset|checkout|rebase|merge|clean)\b|\bnpm +(i|install|ci|publish)\b|\byarn +add\b|\bpnpm +(add|install)\b|prisma +migrate|\bdrop +table\b|\btruncate\b|\bdelete +from\b|\bmv\b|\bcp\b)'; then
  python3 -c 'import json,sys;print(json.dumps({"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":sys.argv[1]}}))' \
    "read-only role attempted a mutating command; reviewers emit findings, not state changes: $cmd"
  exit 2
fi
exit 0
