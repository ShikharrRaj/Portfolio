#!/usr/bin/env node
// lint-handoff-chain.mjs — the handoff DAG is a CI-checkable artifact (graft from Design A).
// Every artifact a role `consumes` must be `produce`d by some role, or be a declared externalInput.
// A dangling consume = a role waiting on an input nobody produces = a broken pipeline.
// Run:  node scripts/lint-handoff-chain.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const matrix = JSON.parse(readFileSync(join(ROOT, '.claude/role-matrix.json'), 'utf8'));
const roles = matrix.roles;

const produced = new Set(matrix.externalInputs || []);
for (const r of Object.values(roles)) for (const p of r.produces || []) produced.add(p);

const errors = [];
for (const [slug, r] of Object.entries(roles)) {
  for (const c of r.consumes || []) {
    if (!produced.has(c)) {
      errors.push(`role "${slug}" consumes "${c}" but nothing produces it (and it is not an externalInput)`);
    }
  }
}

// Warn on orphan producers (produced but never consumed) — informational, not fatal.
const consumed = new Set();
for (const r of Object.values(roles)) for (const c of r.consumes || []) consumed.add(c);
const orphans = [...produced].filter((p) => !consumed.has(p) && !(matrix.externalInputs || []).includes(p));

if (errors.length === 0) {
  console.log(`✓ lint-handoff-chain: every consumed artifact has a producer (${produced.size} artifact types)`);
  if (orphans.length) console.log(`  ⓘ terminal outputs (produced, consumed by no role): ${orphans.join(', ')}`);
  process.exit(0);
}
for (const e of errors) console.error(`✗ ${e}`);
console.error(`\n✗ lint-handoff-chain: ${errors.length} dangling input(s)`);
process.exit(1);
