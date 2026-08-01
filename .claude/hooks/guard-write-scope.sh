#!/usr/bin/env bash
# guard-write-scope.sh — PreToolUse(Write|Edit|MultiEdit) per-role write-scope guard.
# Thin wrapper; logic in lib/guard-write-scope.py. See .claude/hooks/README.md.
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec python3 "$DIR/lib/guard-write-scope.py"
