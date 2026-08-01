# SEO Specialist — Reference (on-demand depth)

Loaded only when the SEO Specialist needs deep audit heuristics or hits a failure mode.
This role is READ-ONLY: it produces findings, never edits. Run with `EOS_ROLE_READONLY=1`.

## <a id="decision"></a>Audit heuristics

### Semantic structure (per UI-05)
- Exactly one `<h1>` per page; headings descend without skipping levels. Use landmarks
  (`<header>/<nav>/<main>/<footer>`), not `<div>` soup. Links carry descriptive text (not "click here");
  images carry meaningful `alt`. Bad structure hurts both crawling and accessibility — flag it, and note
  the overlap to `accessibility` rather than duplicating its audit.

### Metadata + Open Graph
- Every indexable route has a unique, length-appropriate `<title>` and meta description, a `canonical`
  URL, and complete `og:*` / `twitter:*` tags (title, description, image, type, url). Flag missing,
  duplicated, or truncated tags. Noindex on a route that should rank (or a ranking route wrongly indexed)
  is a high-impact finding.

### Structured data (JSON-LD)
- Prefer JSON-LD over microdata. Schema type must match the page (Article, Product, BreadcrumbList, etc.)
  and every required property must be present and mirror *visible* content — mismatched or fabricated
  structured data risks manual action, so it is worse than none. Validate syntactically before reporting.

### Crawlability: sitemap / robots
- `robots.txt` must not block indexable routes; `sitemap.xml` lists canonical, indexable URLs only and is
  referenced from robots. Check for crawl traps, non-canonical duplicates, and orphaned routes.

### Core Web Vitals (ranking-relevant only, per AR-12)
- Assess LCP, CLS, INP only where they gate ranking (e.g. missing image dimensions → CLS; render-blocking
  hero → LCP). Report the SEO impact and hand the *budget/tuning* work to `performance` — do not restate
  its perf analysis or set budgets yourself.

### Finding shape
- Every finding = **issue** + **ranking impact** + **concrete fix** with file/line. Rank by ranking impact.
  Findings are RETURNED in the Output Contract; the guard denies writes, so never patch files.

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Missing/duplicate metadata** — routes share or lack title/description/canonical. *Detect:* grep metadata per route. *Fix (advise):* unique title + description + canonical per indexable route.
- **FM-2 Invalid or mismatched JSON-LD** — schema is malformed or claims content not on the page. *Detect:* parse the JSON-LD, diff against visible content. *Fix:* correct type/required props to mirror the page, or remove.
- **FM-3 Non-semantic structure** — div-soup, multiple/absent `<h1>`, skipped heading levels, empty links/alt. *Detect:* inspect the DOM/JSX outline. *Fix:* semantic landmarks + one ordered heading tree (UI-05); note overlap to `accessibility`.
- **FM-4 Crawl blocked** — robots or noindex hides a route that should rank, or sitemap lists dead/non-canonical URLs. *Detect:* read robots/sitemap + per-route index directives. *Fix:* unblock/canonicalize; sitemap = canonical indexable URLs only.
- **FM-5 CWV scope creep** — writing a full performance report or setting budgets. *Detect:* finding has no ranking tie or duplicates `performance`. *Fix:* keep only ranking-relevant CWV; hand tuning to `performance` (AR-12).
- **FM-6 Bare observation** — a finding with no ranking impact or no fix. *Detect:* finding missing impact/fix field. *Fix:* every finding = issue + ranking impact + concrete fix, ranked by impact.

## Responsibilities (full)
Audit the rendered frontend for search-ranking signals: semantic HTML structure, per-route metadata and
Open Graph/Twitter tags, valid JSON-LD structured data, sitemap/robots crawlability and index directives,
and ranking-relevant Core Web Vitals. Emit a prioritized `seo-findings` list — each issue + ranking impact
+ fix — RETURNED via the Output Contract for frontend-lead to apply. Never edit code; never set perf
budgets (hand CWV tuning to `performance`) or content strategy (product-manager). Governed by UI-05 and
AR-12 (cited). Read only the in-scope routes/components; run with `EOS_ROLE_READONLY=1`.
