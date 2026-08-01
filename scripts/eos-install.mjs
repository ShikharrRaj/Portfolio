#!/usr/bin/env node
// eos-install.mjs — install the Engineering OS bundle into another project, auto-detecting its
// stack + layout to tune role write-globs and scaffold a starter CLAUDE.md. Everything is
// co-located in the target so Knowledge citations and $CLAUDE_PROJECT_DIR hooks resolve.
//
// Usage:  node scripts/eos-install.mjs <target-project-dir> [--dry-run] [--no-tune]
//
// Copies: .claude/{agents,skills,hooks,role-matrix.json}, Knowledge/, scripts/, templates/.
// Tunes:  frontend-lead write-globs to the detected routes/src layout (unless --no-tune).
// Scaffolds: <target>/CLAUDE.md if none exists (detected stack + applicable roles).
// Merges: .claude/settings.json hooks (never clobbers existing keys/hooks).
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';

const SRC = process.cwd();
const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
const dryRun = args.includes('--dry-run');
const noTune = args.includes('--no-tune');

if (!target) { console.error('Usage: node scripts/eos-install.mjs <target-project-dir> [--dry-run] [--no-tune]'); process.exit(1); }
const DST = resolve(target.replace(/^~(?=$|\/)/, homedir()));
if (DST === SRC) { console.error('✗ Target is the Engineering OS repo itself; choose a different project.'); process.exit(1); }
if (!existsSync(DST)) { console.error(`✗ Target does not exist: ${DST}`); process.exit(1); }

// ---- 1. detect stack + layout -------------------------------------------------
const has = (p) => existsSync(join(DST, p));
let deps = {};
try { const pj = JSON.parse(readFileSync(join(DST, 'package.json'), 'utf8')); deps = { ...pj.dependencies, ...pj.devDependencies }; } catch {}
const dep = (name) => Object.keys(deps).some((d) => d === name || d.startsWith(name));
const det = {
  next: dep('next'),
  nest: dep('@nestjs/'),
  prisma: dep('prisma') || dep('@prisma/'),
  ai: ['openai', '@anthropic-ai/', 'langchain', '@langchain/', 'langgraph', 'ai', 'llamaindex'].some(dep),
  tailwind: dep('tailwindcss'),
  routesLoc: has('app') ? 'app' : has('src/app') ? 'src/app' : (dep('next') ? 'app' : null),
  srcDir: has('src'),
  serverDir: has('src/server') || has('src/api'),
  aiDir: has('src/ai'),
  tests: has('tests') || has('e2e') || ['jest', 'vitest', '@playwright/test'].some(dep),
};
const fullStack = det.nest || det.serverDir;   // has a real backend
const applicable = ['engineering-manager', 'product-manager', 'staff-architect', 'code-reviewer', 'documentation'];
if (det.next || det.tailwind) applicable.push('frontend-lead', 'uiux-lead', 'accessibility', 'performance', 'seo', 'animation');
if (fullStack) applicable.push('backend-lead', 'security-reviewer', 'qa-automation', 'devops');
if (det.prisma) applicable.push('database');
if (det.ai || det.aiDir) applicable.push('ai-platform-lead', 'prompt-engineer', 'ai-evaluation');
const applicableSet = [...new Set(applicable)];

console.log(`${dryRun ? '[dry-run] ' : ''}Installing Engineering OS → ${DST}`);
console.log(`  detected: ${[det.next && 'Next.js', det.nest && 'NestJS', det.prisma && 'Prisma', det.ai && 'AI', det.tailwind && 'Tailwind'].filter(Boolean).join(' + ') || 'generic'}` +
  ` | routes: ${det.routesLoc || 'n/a'} | ${fullStack ? 'full-stack' : 'frontend-only'}\n`);

// ---- 2. copy bundle -----------------------------------------------------------
const BUNDLE = [['.claude/agents', 1], ['.claude/skills', 1], ['.claude/hooks', 1], ['.claude/role-matrix.json', 0], ['Knowledge', 1], ['scripts', 1], ['templates', 1]];
for (const [rel, isDir] of BUNDLE) {
  const src = join(SRC, rel);
  if (!existsSync(src)) { console.log(`  skip (missing): ${rel}`); continue; }
  console.log(`  ${has(rel) ? 'overwrite' : 'copy'}  ${rel}`);
  if (!dryRun) { mkdirSync(join(DST, rel, '..'), { recursive: true }); cpSync(src, join(DST, rel), { recursive: !!isDir }); }
}
function makeExec(dir) { if (!existsSync(dir)) return; for (const n of readdirSync(dir)) { const p = join(dir, n); if (statSync(p).isDirectory()) makeExec(p); else if (/\.(sh|py|mjs)$/.test(n)) chmodSync(p, 0o755); } }
if (!dryRun) { makeExec(join(DST, '.claude/hooks')); makeExec(join(DST, 'scripts')); }

// ---- 3. tune frontend-lead write-globs to the layout --------------------------
let feGlobs = null;
if (!noTune && (det.next || det.tailwind)) {
  if (det.routesLoc === 'app') {
    feGlobs = fullStack
      ? ['app/**', 'src/components/**', 'src/styles/**', 'tailwind.config.ts', 'tailwind.config.js', 'components.json']
      : ['app/**', det.srcDir ? 'src/**' : 'components/**', 'tailwind.config.ts', 'tailwind.config.js', 'components.json', 'public/**'];
  } else { // src/app
    feGlobs = fullStack ? ['src/app/**', 'src/components/**', 'src/styles/**'] : ['src/app/**', 'src/**'];
  }
  const mp = join(DST, '.claude/role-matrix.json');
  if (existsSync(mp) || dryRun) {
    console.log(`\n  tune frontend-lead write-globs → ${JSON.stringify(feGlobs)}`);
    if (!dryRun) { const m = JSON.parse(readFileSync(mp, 'utf8')); if (m.roles['frontend-lead']) { m.roles['frontend-lead'].writeGlobs = feGlobs; m.roles['frontend-lead'].disallowed = []; } m.$project = `Auto-tuned by eos-install for ${det.routesLoc || 'generic'} layout (${fullStack ? 'full-stack' : 'frontend-only'}).`; writeFileSync(mp, JSON.stringify(m, null, 2) + '\n'); }
  }
}

// ---- 4. scaffold a starter CLAUDE.md ------------------------------------------
const claudePath = join(DST, 'CLAUDE.md');
if (!existsSync(claudePath) && !existsSync(join(DST, '.claude/CLAUDE.md'))) {
  const dormant = ['backend-lead','database','devops','ai-platform-lead','prompt-engineer','ai-evaluation','security-reviewer','qa-automation','uiux-lead','frontend-lead','accessibility','seo','animation','performance','documentation','staff-architect','product-manager','engineering-manager'].filter((r) => !applicableSet.includes(r));
  const md = `# ${(() => { try { return JSON.parse(readFileSync(join(DST,'package.json'),'utf8')).name; } catch { return 'project'; } })()} — Engineering OS config

${[det.next && 'Next.js', det.nest && 'NestJS', det.prisma && 'Prisma', det.ai && 'AI/LLM', det.tailwind && 'Tailwind'].filter(Boolean).join(' + ') || 'Project'} — ${fullStack ? 'full-stack' : 'frontend-only'}.
Engineering OS agents (\`.claude/agents/\`) operate here under mechanically-enforced boundaries
(\`.claude/hooks/\` + \`.claude/role-matrix.json\`). Standards in \`Knowledge/\`; run \`node scripts/lint-role-boundaries.mjs\` to verify.

## Detected layout
- Routes: \`${det.routesLoc || 'n/a'}\`  ${det.srcDir ? '· Code: `src/`' : ''}${det.prisma ? ' · DB: `prisma/`' : ''}${det.aiDir ? ' · AI: `src/ai/`' : ''}
- frontend-lead write-scope: ${feGlobs ? '`' + feGlobs.join('`, `') + '`' : '(default)'}

## Conventions (FILL THESE IN — agents will honor them)
1. <e.g. content/data lives in X, never hardcoded in components>
2. Style via design tokens / theme — no arbitrary values (per UI-01, UI-02).
3. <project-specific rule>

## Which Engineering OS roles apply
Active: ${applicableSet.map((r) => '`' + r + '`').join(', ')}.
Start cross-cutting work with **engineering-manager**.
Dormant here: ${dormant.length ? dormant.map((r) => '`' + r + '`').join(', ') : '(none)'}.

## Standards
Cite by rule ID (EF-01). Execution loop + Output Contract: \`Knowledge/development-workflow.md\`.
`;
  console.log(`\n  scaffold CLAUDE.md (${md.split('\n').length} lines) — EDIT the Conventions section`);
  if (!dryRun) writeFileSync(claudePath, md);
} else { console.log('\n  CLAUDE.md already exists — leaving it (add EOS context manually if needed)'); }

// ---- 5. merge settings.json hooks (never clobber) -----------------------------
const OUR = {
  PreToolUse: [
    { matcher: 'Write|Edit|MultiEdit', hooks: [{ type: 'command', command: '"$CLAUDE_PROJECT_DIR/.claude/hooks/guard-write-scope.sh"' }] },
    { matcher: 'Bash', hooks: [{ type: 'command', command: '"$CLAUDE_PROJECT_DIR/.claude/hooks/enforce-readonly.sh"' }] },
  ],
  Stop: [{ hooks: [{ type: 'command', command: '"$CLAUDE_PROJECT_DIR/.claude/hooks/require-selfcheck.sh"' }] }],
};
const sp = join(DST, '.claude/settings.json');
let settings = {};
if (existsSync(sp)) { try { settings = JSON.parse(readFileSync(sp, 'utf8')); } catch { console.log('  ⚠ existing settings.json invalid — add hooks manually'); } }
settings.hooks = settings.hooks || {};
let added = 0;
for (const [ev, entries] of Object.entries(OUR)) { settings.hooks[ev] = settings.hooks[ev] || []; const cur = JSON.stringify(settings.hooks[ev]); for (const e of entries) if (!cur.includes(e.hooks[0].command)) { settings.hooks[ev].push(e); added++; } }
console.log(`  settings.json: ${added} hook entr${added === 1 ? 'y' : 'ies'} to add`);
if (!dryRun && added) { mkdirSync(join(DST, '.claude'), { recursive: true }); writeFileSync(sp, JSON.stringify(settings, null, 2) + '\n'); }

console.log(`\n${dryRun ? '[dry-run complete — nothing written]' : '✓ Installed.'}`);
if (!dryRun) console.log(`\nNext:\n  1. Edit ${target}/CLAUDE.md — fill the Conventions section.\n  2. Open a Claude session there and say: "engineering-manager, <your task>".\n  3. Verify: (cd ${target} && node scripts/lint-role-boundaries.mjs) and ask an agent to write to Knowledge/ (should block).`);
