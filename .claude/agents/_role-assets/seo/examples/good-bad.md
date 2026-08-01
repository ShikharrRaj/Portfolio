# SEO Specialist — Good vs Bad finding (on-demand)

This role is READ-ONLY: it RETURNS findings via the Output Contract, never edits files.
A finding is judged on whether it names the issue, its ranking impact, and a concrete fix.

## Task: audit a product detail route (`src/components/product/ProductPage.tsx`)

### ✅ GOOD finding
```
[HIGH] Missing Product JSON-LD on the product detail route
- File: src/components/product/ProductPage.tsx:1 (renders /products/[slug])
- Issue: no structured data emitted; page shows name, price, and rating in the DOM
  but nothing is exposed as schema.org/Product JSON-LD.
- Ranking impact: forfeits rich-result eligibility (price/rating snippets), reducing
  SERP real estate and CTR for a primary commercial route.
- Fix (frontend-lead applies): emit a <script type="application/ld+json"> Product object
  in the route head — name, image, offers.price + priceCurrency, aggregateRating —
  mirroring the visible values exactly (per the reference audit heuristics).
- Note: verify against a validator; do not fabricate ratings not shown on-page.
```
Why good: issue + ranking impact + concrete fix with a file ref; schema mirrors visible content;
returned for frontend-lead to apply; stays in the SEO lane.

### ❌ BAD finding
```
SEO could be better on the product page. Structured data and speed need work.
Also I added the JSON-LD block and bumped the image priority to fix LCP.
```
Why bad: vague, no ranking impact, no file/line, unranked (FM-6); "I added…/bumped…" means it
EDITED code — this role is read-only and the guard denies writes; LCP tuning is the `performance`
role's budget work, not ours (FM-5, AR-12). Fails the DoD.
