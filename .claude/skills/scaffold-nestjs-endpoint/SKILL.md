---
name: scaffold-nestjs-endpoint
description: >
  Scaffolds a NestJS endpoint as a thin controller→service→repository slice with
  edge schema-validation, default-deny principal-scoped authz, a stable error taxonomy,
  a published typed api-contract, and tests. Use when an approved design or task needs a
  new (or extended) HTTP endpoint implemented. Follows Knowledge/architecture-principles.md#AR-02.
when_to_use: new NestJS endpoint, add an API route, controller-service-repository slice, publish an api-contract, validate request input, authorize a route, scaffold REST handler
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

## Purpose & Preconditions
Turn a scoped endpoint request into a working, layered NestJS endpoint plus its published
typed api-contract, so downstream consumers can integrate against a stable, versioned shape.
Preconditions: an approved contract shape or acceptance criteria exists (method, path,
request/response, authz rule); the target NestJS module/project exists; the current actor
holds write-scope for that module. Missing contract shape, ambiguous authz rule, or a
path that crosses another module's data ownership → stop and escalate (WF-08); do not guess.

## Inputs / Outputs (contract)
Inputs:
- Endpoint spec — method, path, request/response shape, authz rule (who may call, on what
  resource). From an architecture-spec, PRD acceptance criteria, or an inline task.
- Existing module — the owning NestJS module, its service/repository, and datastore access.
- Standards — cited by ID, never re-read wholesale (per EF-01, EF-03).

Outputs:
- **endpoint** — controller handler + DTO/schema + service method + repository method,
  wired into the owning module. Layered per AR-02; thin controller, logic in the service.
- **api-contract** — a typed, explicitly versioned contract artifact (request schema,
  response schema, enumerated error codes) published where consumers import it (per AR-07).
- Tests — unit test for the service and an e2e/integration test for the route (happy path,
  one authz-deny, one validation-reject) per CS-08 test conventions.

## Steps (deterministic, numbered)
1. **Restate the contract.** Write the method, path, request shape, response shape, and
   authz rule as ≤5 bullets at the top of the endpoint. If any is ambiguous or the path
   writes data owned by another module, stop and escalate (WF-08) — do not invent it.
2. **Ground.** Grep/Glob only the owning module (existing controller, service, repository,
   error types, contract location). Confirm the writing module owns every datum this
   endpoint mutates (per AR-02); reads from other domains go through their contract, never
   their internals.
3. **Define the input schema at the edge.** Author a DTO backed by a runtime schema
   (zod/class-validator) that validates and coerces ALL external input — body, params,
   query, headers used. Reject unknown fields; fail fast at the boundary (per CS-06). No
   handler reads unvalidated request data.
4. **Author the api-contract.** Produce the typed, explicitly versioned contract: request
   schema, response schema, and the enumerated set of error codes this endpoint can return
   (per AR-07). Publish it where consumers import from (shared package/contract dir), not
   inline in the controller. Additive changes stay backward-compatible; a breaking change
   requires a version bump + migration note.
5. **Authorize first, default-deny.** As the first executable step of the handler (guard or
   explicit check), evaluate the authz rule against the caller's principal and the target
   resource. Deny unless a rule explicitly permits; scope every query to the principal
   (per AR-10). No data access precedes a passing authz check.
6. **Keep the controller thin.** The controller only: (a) receives validated input,
   (b) delegates to one service method, (c) maps the service result to the response shape.
   No business logic, no direct datastore access in the controller (per AR-02).
7. **Put logic in the service.** The service method holds the business rules and calls the
   repository for persistence. It returns typed results or throws a taxonomy error (step 8);
   it never returns HTTP concerns.
8. **Use the stable error taxonomy.** Map every failure to an enumerated error code from a
   shared taxonomy (e.g. validation / not-found / forbidden / conflict / internal) → stable
   HTTP status + code, surfaced via a filter or mapper. Never swallow errors silently; never
   leak internals in messages (per CS-06). The taxonomy set matches the contract's error
   list from step 4.
9. **Handle async correctly.** Every promise is awaited or explicitly handled; no floating
   promises; no `async` without `await` (per CS-08). Repository/service calls that can fail
   are caught and mapped to taxonomy errors, not left to bubble as raw exceptions.
10. **Test.** Add a service unit test (happy path + one error branch) and a route
    integration/e2e test asserting: happy path returns the contract shape, an unauthorized
    principal is denied (default-deny), and malformed input is rejected at the edge.
11. **Run the Quality Gate** below. Build/lint/test locally via Bash. Fix or flag every
    failed item before returning.

## Decision Points
- If the authz rule is unclear or the resource has no ownership/principal to scope to →
  escalate (WF-08); do not ship a permissive default.
- If the endpoint would write a datum owned by another module → stop; the owning module
  must expose the mutation via its contract (per AR-02) — escalate rather than reach in.
- If the response would need a breaking change to an existing published contract → bump the
  version and add a migration note (per AR-07); never mutate a shipped contract shape in place.
- If a failure mode has no matching taxonomy code → add the code to the shared taxonomy AND
  the contract's error list together (step 4/8); do not invent an ad-hoc inline error.
- If business logic starts accumulating in the controller → move it to the service (step 7);
  a fat controller is a gate failure, not a style nit.

## Quality Gate (inline pass/fail before returning)
- [ ] Contract restated at top; method/path/request/response/authz all explicit — per AR-02.
- [ ] All external input validated + coerced by an edge schema; unknown fields rejected — per CS-06.
- [ ] api-contract published (not inline), typed, and carries an explicit version — per AR-07.
- [ ] Authz runs first, default-deny, and every query is principal-scoped — per AR-10.
- [ ] Controller is thin: validate → delegate → map; no logic, no direct datastore access — per AR-02.
- [ ] Every failure maps to an enumerated taxonomy code; nothing swallowed or leaking internals — per CS-06.
- [ ] Contract's error list == taxonomy codes the endpoint can emit (no drift).
- [ ] No floating promises; every promise awaited or handled — per CS-08.
- [ ] Tests cover happy path, an authz-deny, and a validation-reject; build/lint/test pass locally.
- [ ] No datum owned by another module written directly (reads via contract only) — per AR-02.
- [ ] No Knowledge rule pasted inline; all cited by ID — per EF-01.

## References (pointers by rule ID; never inline a standard)
- Standards → cite by rule ID: AR-02 (module boundaries / data ownership), AR-07 (versioned
  contracts), AR-10 (authz at every boundary), CS-06 (fail-fast validation / error handling),
  CS-08 (async / no floating promises); workflow EF-01, EF-03, WF-08. Never inline.
- Execution loop + Output Contract → `Knowledge/development-workflow.md`.
- Full rule text + owners → `Knowledge/_index.md`.
