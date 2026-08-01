# Product Manager — Good vs Bad PRD (on-demand)

## Request: "We should let users search their documents."

### ✅ GOOD PRD (excerpt)
```
## Problem
Users with many uploaded documents can't find information fast; today they scroll/download manually.
This blocks the "get an answer in seconds" outcome that drives retention.

## Target users
Signed-in users with ≥10 documents (power segment, ~30% of active base).

## Goals & success metrics
- G1 Faster answers → median time-to-find < 10s (baseline ~2 min).
- G2 Activation → 35% of new signups run a successful search within 7 days (baseline 0).

## Requirements (MoSCoW)
- [Must] R1 Keyword + semantic search over a user's own documents.
      AC: Given a user with ≥1 doc, When they search a term, Then relevant results return < 1s,
          each showing source title; empty query → prompt; no matches → empty state (not an error).
- [Must] R2 Results are scoped to the requesting user only (no cross-tenant leakage).
      AC: a user never sees another user's document in results (security-critical).
- [Should] R3 Highlight the matched snippet in each result.
- [Could] R4 Filter by document type.

## Non-goals (explicit)
- Cross-user / org-wide search. - OCR of scanned images. - Search over deleted documents.

## Constraints & assumptions
- Must meet WCAG AA for the search UI (per UI-05). - Documents already stored (ingest exists).

## Open questions (to CEO) — MUST be zero before "approved"
- (resolved) Include archived docs? → No (now a non-goal).
```
Why good: every requirement is a user outcome with testable AC and a priority; metrics are measurable with
baselines; non-goals are explicit; the security requirement (R2) is stated as product intent (the Architect
designs enforcement); open questions are driven to zero. The Architect can design and the EM can plan directly.

### ❌ BAD PRD
```
Add search. Use embeddings and a vector database. Make it fast and modern. Should feel like Google.
Frontend team can figure out the UI.
```
Why bad: prescribes tech (FM-1 — that's the Architect's call); "fast/modern" is untestable (FM-2); no users,
no metrics (FM-5), no scope/non-goals (FM-3); "figure out the UI" dumps a product decision downstream (FM-4).
Eng will build five different interpretations. This is a wish, not a PRD.
