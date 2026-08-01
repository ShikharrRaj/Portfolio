# Documentation Engineer — Good vs Bad docs (on-demand)

## Task: document a public API function `createInvoice(input)`

### ✅ GOOD
```md
### `createInvoice(input: InvoiceInput): Promise<Invoice>`

Creates and persists an invoice, then returns it with a server-assigned `id`.

**Why:** amounts are stored in minor units (cents) to avoid float rounding — pass `amountCents`, not dollars.

**Params**
- `input.amountCents` — integer > 0. Non-integer or ≤ 0 → `ValidationError`.
- `input.customerId` — must reference an existing customer, else `NotFoundError`.

**Failure modes**
- `ValidationError` — bad amount/currency (4xx; do not retry).
- `NotFoundError` — unknown `customerId`.
- `ConflictError` — duplicate `idempotencyKey` (returns the original invoice; safe to treat as success).

**Example** (verified against `invoice.e2e.spec.ts`)
```ts
const inv = await createInvoice({ amountCents: 4999, currency: 'USD', customerId: 'cus_123' });
console.log(inv.id); // "inv_..."
```
```
Why good: documents the **contract + every failure mode** (CS-14); leads with the *why* — the cents
invariant a reader can't infer from the signature (CS-12); the example is pulled from a real test, so it runs.

### ❌ BAD
```md
### createInvoice

This function creates an invoice. It takes an input and returns an invoice.
It calls the validator, then the repository's save method, then returns the result.

Example:
```ts
createInvoice({ amount: 49.99 }); // pass the amount in dollars
```
```
Why bad: narrates the code line-by-line and adds no insight (FM-2 → CS-12); lists no params, no failure modes
(FM-5 → CS-14); the example is invented and wrong — `amount` in dollars contradicts the real `amountCents`
contract, so it won't run (FM-3) and asserts behavior the owner never confirmed (FM-4). Fails review and DoD.
