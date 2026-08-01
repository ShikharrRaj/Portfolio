# Tech Stack — Approved Defaults

> Status: canonical (v0.2) · Owner: staff-architect · Consumed-by: all Leads, all specialists
> The default stack. Deviations require an ADR approved by the Staff Architect.

## Rules

### Core stack
- **TS-01** Frontend: **Next.js (App Router) + React + TypeScript + Tailwind CSS**. No other UI framework without an ADR.
- **TS-02** Backend: **NestJS + PostgreSQL + Prisma + Redis**. REST by default; GraphQL only per ADR.
- **TS-03** AI: **Claude (default), OpenAI, Gemini** via provider abstraction; **LangGraph** for agent orchestration; **MCP** for tool/context integration.
- **TS-04** Retrieval: **RAG** over a managed **vector database**; embeddings provider chosen per AI-* guidelines.
- **TS-05** Infra: **AWS** primary; **Docker** for packaging; **Cloudflare** for edge/CDN/WAF; **Vercel** acceptable for FE previews.
- **TS-06** Testing: **Playwright** (e2e), **Jest** (backend/unit), **Vitest** (frontend/unit).
- **TS-07** Observability: **Sentry** (errors), **Langfuse** (LLM traces/evals), **PostHog** (product analytics).
- **TS-08** Language baseline: TypeScript everywhere feasible; Python only for AI/data tooling that requires it.
- **TS-09** Package manager & Node version are pinned per project in its `projects/<slug>/CLAUDE.md`; never assume globally.
- **TS-10** No new runtime dependency enters a project without the owning Lead's sign-off and a one-line justification in the PR.

### Versions & pinning
- **TS-11** Node version is pinned via `.nvmrc` **and** `engines.node` in `package.json`; CI enforces the match. Use the active LTS unless an ADR pins otherwise.
- **TS-12** The package manager is **pnpm** by default, pinned via `packageManager` in `package.json` and Corepack; mixing `npm`/`yarn` in a pnpm project is forbidden.
- **TS-13** The lockfile is committed and authoritative; CI installs with `--frozen-lockfile` (no drift). A PR that changes deps must include the regenerated lockfile.
- **TS-14** Runtime dependency versions are pinned to exact versions (no `^`/`~`); ranges are allowed only for `devDependencies`.
- **TS-15** Major-version upgrades of a framework (Next, NestJS, Prisma, React) require an ADR; minor/patch upgrades go through the normal PR + test gate.
- **TS-16** TypeScript runs in `strict` mode with `noUncheckedIndexedAccess`; disabling a strict flag project-wide requires an ADR.

### Dependency policy
- **TS-17** Prefer the platform/stdlib, then an existing project dependency, before adding a new package (EF-02 reuse-first).
- **TS-18** A new dependency must be actively maintained (release within ~12 months), have a compatible OSS license (MIT/Apache-2.0/BSD/ISC), and pass a supply-chain check; copyleft (GPL/AGPL) requires legal + Architect sign-off.
- **TS-19** Automated dependency updates (Renovate/Dependabot) run weekly; security advisories (CVEs) are patched within the SLA in the security standard, not deferred.
- **TS-20** No dependency on unpublished forks, git URLs, or `file:` paths in production code; vendor via a published package or an ADR-approved internal registry.

### Configuration & secrets
- **TS-21** All runtime configuration comes from environment variables (12-factor); no environment-specific values are hardcoded or committed.
- **TS-22** Env vars are validated at boot against a typed schema (e.g. Zod / Nest `ConfigModule` validation); the process fails fast on a missing or malformed var.
- **TS-23** Every variable is documented in a committed `.env.example` with a non-secret placeholder; real secrets live only in the secrets manager (AWS Secrets Manager / SSM), never in `.env` files or the repo.
- **TS-24** Client-exposed config on the frontend must use the framework's public prefix (`NEXT_PUBLIC_`); anything without it must never reach the browser bundle.

### Frontend conventions (Next.js App Router)
- **TS-25** Default to **Server Components**; add `"use client"` only at the leaf that needs interactivity, browser APIs, or hooks — never at a route root by default.
- **TS-26** Data fetching happens in Server Components / Route Handlers / Server Actions; secrets and privileged calls never run in client code.
- **TS-27** Route Handlers under `app/api/**` are the FE's server surface; set explicit caching/revalidation (`fetch` cache options or `revalidate`) rather than relying on defaults.
- **TS-28** Use `next/image`, `next/font`, and `next/link` for images, fonts, and navigation; no raw `<img>`/`<a>` for app assets/routes without a documented reason.

### Backend conventions (NestJS)
- **TS-29** Code is organized into feature **modules**; cross-module access goes through exported providers, not deep imports into another module's internals.
- **TS-30** Request payloads are validated and typed via DTOs + `class-validator` with a global `ValidationPipe` (`whitelist` + `forbidNonWhitelisted`); controllers never trust raw input.
- **TS-31** All DB access goes through Prisma in a repository/service layer; no raw SQL in controllers, and schema changes ship as committed, reviewed migrations (see database standard).
- **TS-32** Config, DB, cache, and external clients are provided via DI (injectable providers/modules); no ad-hoc singletons or module-level side effects at import time.

### Observability wiring
- **TS-33** Sentry is initialized on both frontend and backend with environment + release tagging and sourcemaps uploaded in CI; errors are never swallowed silently.
- **TS-34** Logs are structured JSON with a correlation/request id propagated across service boundaries; no `console.log` in shipped server code.
- **TS-35** Every LLM call is traced through Langfuse (prompt, model, tokens, latency, cost) per AI-* guidelines; no untraced model calls in production paths.
- **TS-36** Product analytics use the shared PostHog client with a typed event catalog; ad-hoc, unnamed events are not allowed.
- **TS-37** Services expose a health/readiness endpoint and emit RED metrics (rate, errors, duration) for their primary paths.

## Rationale
A fixed default stack removes per-project bikeshedding, maximizes cross-project reuse of skills, and keeps
specialist roles interchangeable across projects. Pinning versions, config, and dependency policy makes builds
reproducible and supply-chain-auditable; codifying framework conventions and observability wiring means every
service is debuggable and secure the same way, so a Lead dropped into any project already knows the rules.

## Exceptions & how to request one
1. **When to request:** any deviation from a TS-* rule — a different framework/tool, an unapproved license, a
   loosened compiler flag, an unpinned or forked dependency, or skipping an observability requirement.
2. **How:** open an ADR in `projects/<slug>/arch/adr/` stating the need, the alternative considered, the trade-off,
   the blast radius, and the exit/revisit condition. Tag the owning Lead and the Staff Architect.
3. **Decision:** the Staff Architect approves or rejects. Approved deviations are pinned in the project
   `CLAUDE.md` with a link back to the ADR and are scoped to that project only — they do not amend this standard.
4. **Urgent/security exceptions** may be taken first and ADR-documented within one business day; unresolved ones
   are treated as tech debt and tracked to closure.
