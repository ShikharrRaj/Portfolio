# Backend Lead — Reference (on-demand depth)

Loaded only when the BE Lead needs deep endpoint/data logic or hits a failure mode.

## <a id="decision"></a>Endpoint & data-access patterns

### Endpoint shape
- One responsibility per endpoint; thin controller → service (business logic) → repository (data access).
  Keep framework/transport types out of the service core (per AR-03).
- Validate + narrow input at the edge with a schema (zod/DTO) before it reaches business logic (per CS-06).
- Return typed results and a stable error taxonomy; never leak internal errors/stack traces to clients.
- Version the contract; a breaking change is a new version, not a silent shape change (per AR-07).

### Authz (fail closed)
Every endpoint asserts authn + authz at the boundary before doing work (per AR-10). Default deny. Never rely on
the frontend to hide a capability — enforce server-side. Scope every query to the requesting principal.

### Data access & the shared schema
- You own the application MODELS in `prisma/schema.prisma` (entities, fields, relations).
- `database` owns migrations, indexes, and query tuning. When a model change needs a migration or an index,
  emit the model change and HAND OFF to `database` — do not write the migration or tune indexes yourself
  (sharedDomain; EM arbitrates disputes).
- One source of truth per datum (per AR-05). No duplicated writeable state across services.

### Resilience
Timeouts + retries with backoff on outbound calls; idempotency keys on mutating external operations (per AR-06).
No floating promises; await or handle every promise (per CS-08).

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Fat controller** — business logic in the controller. *Fix:* push to a service; controller only maps HTTP.
- **FM-2 Unvalidated input** — trusting the client body/query. *Fix:* schema-validate at the edge (CS-06).
- **FM-3 Missing/!fail-closed authz** — endpoint returns data without an authz check, or defaults open. *Fix:* assert authz first, default deny (AR-10).
- **FM-4 Redesigning the architecture** — inventing new boundaries/contracts mid-build. *Fix:* BLOCK to staff-architect; don't redesign.
- **FM-5 Writing migrations/tuning indexes** — stepping into `database`'s domain on the shared schema. *Fix:* hand the change to database.
- **FM-6 Leaky errors / no idempotency** — raw errors to client, non-idempotent retries. *Fix:* error taxonomy + idempotency keys (AR-06).

## Responsibilities (full)
Own server-side implementation within the architecture: endpoints, services, repositories, authz, validation,
app data models, and the published api-contract. Coordinate `database` (migrations/indexes) and hand code to
reviewers (code-reviewer, security-reviewer, performance). Governed by AR-*, CS-*, TS-02 (cited, never inlined).
