#!/usr/bin/env bash
# require-selfcheck.sh — Stop hook enforcing WF-06 (self-check before done).
# Opt-in per session: set EOS_DOD_ARTIFACT to the path the role must produce. Missing => block.
# Unset => no-op. Deny = canonical Stop JSON ({"decision":"block"}) on stdout + exit 2.
set -euo pipefail

cat >/dev/null 2>&1 || true   # drain stdin payload (stop_hook_active, etc.)
target="${EOS_DOD_ARTIFACT:-}"
[ -z "$target" ] && exit 0

if [ ! -f "$target" ]; then
  python3 -c 'import json,sys;print(json.dumps({"decision":"block","reason":sys.argv[1]}))' \
    "WF-06 self-check incomplete: expected DoD artifact '$target' not found. Run checklists/dod.md and record the result before finishing."
  exit 2
fi
exit 0
