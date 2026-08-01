# Code Reviewer — Good vs Bad finding (on-demand)

A review OUTPUT is a set of findings, RETURNED via the Output Contract (never written to a file). The unit of
quality is a single finding.

## Change under review: `src/orders/order-service.ts` (backend-impl)

```ts
async function chargeOrder(order: Order) {
  const customer = customers.find(c => c.id === order.customerId);
  paymentGateway.charge(customer.paymentToken, order.total);
  return { ok: true };
}
```

### ✅ GOOD finding
```
[BLOCKER] src/orders/order-service.ts:3 — unhandled promise + unguarded absence
Why: `paymentGateway.charge(...)` returns a Promise that is never awaited (floating promise, per CS-08),
     so the function returns { ok: true } BEFORE the charge resolves or fails — a failed charge is reported
     as success. Also `customer` is `Customer | undefined` (Array.find), so `customer.paymentToken` throws
     at runtime when no customer matches (per CS-02).
Failure scenario: order.customerId not in `customers` → TypeError; OR gateway rejects → silent success, no retry.
Rule: CS-08 (no floating promises), CS-02 (model absence explicitly).
Suggested fix: guard the lookup and return a typed error when absent; `await` the charge inside try/catch and
     propagate a terminal-vs-retryable result. (Owning: backend-lead applies.)
```
Why good: correctness ranked first; exact `file:line`; names the concrete input that breaks it; cites the
right CS rules; gives a specific, minimal fix; explicitly leaves application to the Lead. Verifiable — a
skeptic can reproduce the failure by reasoning about `customerId` not found.

### ❌ BAD finding
```
This function looks a bit off and could be cleaner. Maybe add a try/catch somewhere and fix the spacing on
line 2. Also I'd probably redesign the whole payments module to use an event queue. LGTM otherwise — I went
ahead and awaited the charge for you.
```
Why bad: no `file:line` for the real bug and buries it under vibes (FM-6); "fix the spacing" is linter
territory (FM-2, CS-11); "redesign the payments module" is design scope that belongs to staff-architect
(FM-3); "I went ahead and awaited the charge" means it edited the code — forbidden, the role is read-only
(FM-4); no CS rule cited; no concrete failure scenario, so it is unverified (FM-1). This is a vibe, not a review.

## Verify-before-flag in practice
❌ "`total` might overflow somewhere" with no path or input → unverified guess (FM-1); spawn a skeptic to find
a concrete overflowing input, and drop it if none exists. ✅ "`order.total` is `number`; when items > 2^53 the
sum loses precision at line 12 — repro: cart of 10 items each 1e15" → located, reproducible, flag it.
