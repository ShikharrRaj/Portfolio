#!/usr/bin/env node
// simulate-hooks.mjs — drives the REAL .claude/settings.json hook config the way Claude Code's
// harness does: matches tool_name against each hook's `matcher`, resolves $CLAUDE_PROJECT_DIR,
// pipes a PreToolUse/Stop payload to the configured command, and interprets the decision
// (exit 2 OR stdout JSON hookSpecificOutput.permissionDecision / decision:block).
// This tests the settings wiring, not just the scripts. A fresh interactive session is still the
// final word (see .claude/hooks/README.md), but this removes essentially all wiring risk.
// Run:  node scripts/simulate-hooks.mjs
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const settings = JSON.parse(readFileSync(join(ROOT, '.claude/settings.json'), 'utf8'));
const HOOKS = settings.hooks || {};

function runHook(command, payload, extraEnv) {
  const env = { ...process.env, CLAUDE_PROJECT_DIR: ROOT, ...extraEnv };
  try {
    const stdout = execFileSync('bash', ['-c', command], { input: JSON.stringify(payload), env, encoding: 'utf8' });
    return { code: 0, stdout };
  } catch (e) {
    return { code: e.status ?? 1, stdout: (e.stdout || '').toString() };
  }
}

// Returns 'deny' | 'allow' by replaying every configured hook for the event whose matcher matches.
function evaluate(event, toolName, payload, extraEnv) {
  const entries = HOOKS[event] || [];
  for (const entry of entries) {
    if (entry.matcher && !new RegExp(`^(${entry.matcher})$`).test(toolName)) continue;
    for (const h of entry.hooks || []) {
      if (h.type !== 'command') continue;
      const { code, stdout } = runHook(h.command, payload, extraEnv);
      let decision = null;
      try {
        const j = JSON.parse(stdout.trim().split('\n').filter(Boolean).pop() || '{}');
        decision = j?.hookSpecificOutput?.permissionDecision || j?.decision || null;
      } catch {}
      if (code === 2 || decision === 'deny' || decision === 'block') return 'deny';
    }
  }
  return 'allow';
}

const P = ROOT;
const scenarios = [
  { name: 'operator (no role) → Knowledge/',       event: 'PreToolUse', tool: 'Write', payload: { tool_name: 'Write', tool_input: { file_path: `${P}/Knowledge/x.md` } }, env: {}, expect: 'allow' },
  { name: 'frontend-lead → Knowledge/ (infra)',    event: 'PreToolUse', tool: 'Write', payload: { tool_name: 'Write', subagent_type: 'frontend-lead', tool_input: { file_path: `${P}/Knowledge/x.md` } }, env: {}, expect: 'deny' },
  { name: 'operator (no role) → src/app/',         event: 'PreToolUse', tool: 'Write', payload: { tool_name: 'Write', tool_input: { file_path: `${P}/src/app/x.tsx` } }, env: {}, expect: 'allow' },
  { name: 'frontend-lead → src/server (EOS_ROLE)', event: 'PreToolUse', tool: 'Write', payload: { tool_name: 'Write', tool_input: { file_path: `${P}/src/server/api.ts` } }, env: { EOS_ROLE: 'frontend-lead' }, expect: 'deny' },
  { name: 'backend-lead → src/app (subagent_type)',event: 'PreToolUse', tool: 'Write', payload: { tool_name: 'Write', subagent_type: 'backend-lead', tool_input: { file_path: `${P}/src/app/x.tsx` } }, env: {}, expect: 'deny' },
  { name: 'security-reviewer → any write',         event: 'PreToolUse', tool: 'Write', payload: { tool_name: 'Write', subagent_type: 'security-reviewer', tool_input: { file_path: `${P}/src/x.ts` } }, env: {}, expect: 'deny' },
  { name: 'read-only role runs git commit',        event: 'PreToolUse', tool: 'Bash', payload: { tool_name: 'Bash', tool_input: { command: 'git commit -m x' } }, env: { EOS_ROLE_READONLY: '1' }, expect: 'deny' },
  { name: 'read-only role runs grep',              event: 'PreToolUse', tool: 'Bash', payload: { tool_name: 'Bash', tool_input: { command: 'grep -r foo src' } }, env: { EOS_ROLE_READONLY: '1' }, expect: 'allow' },
  { name: 'Stop with missing DoD artifact',        event: 'Stop', tool: 'Stop', payload: { stop_hook_active: true }, env: { EOS_DOD_ARTIFACT: '/tmp/eos-missing.md' }, expect: 'deny' },
  { name: 'Stop with no DoD env',                  event: 'Stop', tool: 'Stop', payload: { stop_hook_active: true }, env: {}, expect: 'allow' },
];

let pass = 0;
console.log(`Driving ${scenarios.length} scenarios through .claude/settings.json hooks\n`);
for (const s of scenarios) {
  const got = evaluate(s.event, s.tool, s.payload, s.env);
  const ok = got === s.expect;
  if (ok) pass++;
  console.log(`${ok ? '✓' : '✗'} ${s.name.padEnd(34)} expected=${s.expect.padEnd(5)} got=${got}`);
}
console.log(`\n${pass}/${scenarios.length} passed`);
process.exit(pass === scenarios.length ? 0 : 1);
