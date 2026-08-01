# premium-portfolio — Engineering OS project config

Frontend-only Next.js 14 (App Router) + TypeScript + Tailwind 3 + shadcn portfolio.
Engineering OS agents (`.claude/agents/`) operate here under mechanically-enforced boundaries
(`.claude/hooks/` + `.claude/role-matrix.json`). Shared standards live in `Knowledge/`.
Verify the wiring with `node scripts/lint-role-boundaries.mjs` and `node scripts/lint-handoff-chain.mjs`.

## Layout — agents MUST respect these paths
- Routes/pages: `app/` (root) — `layout.tsx`, `page.tsx`, `globals.css`, `robots/sitemap/manifest`.
- Components: `src/components/{layout,providers,sections,three,ui}`.
- Content: `src/data/portfolio.ts` — SINGLE SOURCE OF TRUTH. Edit content HERE, never in components.
- Hooks: `src/hooks/` · Lib: `src/lib/` · Alias: `@/*` → `src/*`.
- Design tokens: semantic CSS variables in `app/globals.css` + `tailwind.config.ts`.
- frontend-lead write-scope: `app/**`, `src/**`, `tailwind.config.ts`, `components.json`, `public/**`.

## Non-negotiable conventions
1. Content changes → `src/data/portfolio.ts` only (never hardcode copy in components).
2. Style via tokens / Tailwind theme — NO arbitrary values (`[#hex]`, `[13px]`) (per UI-01, UI-02).
3. Respect `prefers-reduced-motion` via the `usePrefersReducedMotion` hook (per UI-07).
4. shadcn "new-york" base components live in `src/components/ui`; extend with `npx shadcn@latest add`.
5. Every interactive surface covers loading/empty/error/success where applicable (per UI-03).

## Which Engineering OS roles apply here
Active: **uiux-lead** (design → ui-spec), **frontend-lead** (all `app/` + `src/` code), and review
specialists (**animation, accessibility, seo, performance, code-reviewer**), plus
**engineering-manager, product-manager, staff-architect, documentation**.
Start any cross-cutting or multi-step task with **engineering-manager**.
Dormant (no backend/DB/AI): backend-lead, database, devops, security-reviewer, qa-automation,
ai-platform-lead, prompt-engineer, ai-evaluation — UNLESS `src/components/ui/Assistant.tsx` becomes a
real AI feature, which activates **ai-platform-lead**.

## Governing standards
TS-01 (Next/React/TS/Tailwind), UI-* (design), CS-* (code). TS-02..TS-05 (backend/AI/infra) DO NOT APPLY.
Execution loop + Output Contract: `Knowledge/development-workflow.md`. Cite standards by rule ID (EF-01).
Multi-role delivery pipeline: `playbooks/software-factory.md`.
