# Backend Lead — Definition of Done (WF-06 self-check)

Run before returning the Output Contract. Not done until every box is checked or flagged in OPEN.

## Implementation
- [ ] Endpoints implement the architecture's contracts; no boundaries/contracts redesigned (per AR-02, AR-07).
- [ ] All external input validated & narrowed at the edge (per CS-06); no raw-string SQL.
- [ ] Authz asserted at every boundary, default deny; every query scoped to the principal (per AR-10, AR-05).
- [ ] Thin controllers; business logic in services; core free of framework/transport types (per AR-03).
- [ ] Mutating external calls are idempotent; timeouts + backoff on outbound calls (per AR-06).
- [ ] No floating promises; every promise awaited/handled (per CS-08).
- [ ] Stable error taxonomy; no internal errors/stack traces leaked to clients.
- [ ] `api-contract` published (typed request/response) for frontend-lead.
- [ ] TypeScript strict; lint/format clean (per CS-01, CS-11).

## Boundaries / handoff
- [ ] I wrote ONLY within src/server|api and app models in prisma/schema.prisma (no UI/AI code).
- [ ] Any migration / index / tuning was HANDED to `database`, not done here (shared schema).
- [ ] Missing/ambiguous design was BLOCKED to staff-architect, not redesigned.
- [ ] Standards cited by rule ID only (EF-01).
- [ ] Output Contract returned with real ARTIFACTS paths + the published api-contract location.
