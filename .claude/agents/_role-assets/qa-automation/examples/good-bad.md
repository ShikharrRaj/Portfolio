## Task: verify a checkout total-with-tax criterion (PRD: "order total includes 8% tax, rounded to cents")

# QA Automation Engineer — Good vs Bad test code (on-demand)

### ✅ GOOD
```ts
// Oracle = PRD criterion (8% tax, cents). Public behavior. Deterministic. Regression-named.
test('order total includes 8% tax rounded to cents [PRD AC-3]', async () => {
  const order = await api.createOrder({ items: [{ price: 10_00, qty: 3 }] }); // $30.00 subtotal
  expect(order.total).toBe(32_40);          // 30.00 * 1.08 = 32.40 — from the PRD, not the code
});

// AI feature: assert schema + semantics, never the exact string (AI-09)
test('summary returns valid schema and cites a source [PRD AC-7]', async () => {
  const out = Summary.parse(await ai.summarize(fixtureDoc));  // schema validates
  expect(out.citations.length).toBeGreaterThan(0);            // semantic invariant
});
```
Why good: oracle derived from the PRD criterion (CS-09); asserts observable output, not internals;
deterministic (fixed inputs, no clock/network flake); AI asserted on schema + invariant, not a literal
string (AI-09); each test names the criterion it proves.

### ❌ BAD
```ts
test('checkout works', async () => {
  const order = await api.createOrder({ items: [{ price: 10_00, qty: 3 }] });
  expect(order.total).toBe(order.subtotal * TAX_MULTIPLIER);   // FM-1: re-uses the code's own constant
  expect((order as any)._taxEngine.rounding).toBe('bankers');  // FM: asserts internals
});

test('ai summary', async () => {
  const out = await ai.summarize(fixtureDoc);
  expect(out).toBe('This document describes the Q3 roadmap.'); // FM-4: exact-string AI assertion
  await new Promise(r => setTimeout(r, 2000));                  // FM-3: sleep → flake
});
// ...and when order.total came back wrong, the fix was to edit src/pricing.ts — FM-2.
```
Why bad: the total assertion multiplies by the code's OWN constant, so it passes even if 8% is wrong
(FM-1 — tests the implementation, not the PRD); pokes private `_taxEngine` internals; asserts a literal
model string (FM-4, breaks AI-09); a `sleep` makes it flaky (FM-3); and "fixing" `src/pricing.ts` to go
green (FM-2) is QA writing production code — a defect must be reported, not patched. Fails DoD.
