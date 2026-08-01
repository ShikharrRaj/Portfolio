# Architecture Principles

> Status: canonical (v1.0) · Owner: staff-architect · Consumed-by: all Leads, database, devops
> Cited as `per AR-NN`. One enforceable rule per bullet; IDs are stable and never reused.

## Rules

### Foundations
- **AR-01** Prefer the simplest design that meets the requirement. Complexity must be earned by a real constraint, not anticipated.
- **AR-02** Clear module boundaries: each domain owns its data and exposes a typed contract; no reaching across boundaries into internals.
- **AR-03** Dependencies point inward: domain/business logic never depends on frameworks, transport, or infra details.
- **AR-04** Stateless services by default; push state to Postgres/Redis. Horizontal scalability is the baseline assumption.
- **AR-05** One source of truth per datum. No duplicated writeable state across services.
- **AR-06** Design for failure: timeouts, retries with backoff, idempotency keys on all mutating external calls.
- **AR-07** API contracts are versioned and explicit; breaking changes require a version bump and migration path.
- **AR-08** Data migrations are forward-only, reviewed, and reversible-by-design where feasible (owned by `database`).
- **AR-09** Every architecturally significant decision is recorded as an ADR in `projects/<slug>/arch/adr/`.
- **AR-10** Security and observability are designed in, not bolted on: authz at every boundary, traces/metrics/logs from day one.
- **AR-11** Prefer boring, proven technology (per TS-*) over novel tech; novelty needs an ADR.
- **AR-12** Cost and latency budgets are set at design time and gated by the `performance` role.

### Caching
- **AR-13** Cache only derived/read data; never the source of truth. Every cache entry declares an explicit TTL — no unbounded caches.
- **AR-14** Cache keys are namespaced and versioned so a schema or logic change invalidates cleanly without a manual flush.
- **AR-15** Reads tolerate a cold or stale cache: on miss or cache outage the service falls back to origin, never errors.

### Idempotency & consistency
- **AR-16** Every mutating endpoint and consumer is idempotent — a caller-supplied key (AR-06) makes retries safe with no duplicate effect.
- **AR-17** State the consistency contract per read path (strong vs eventual); clients are told when data may be stale.
- **AR-18** Cross-aggregate invariants use sagas/outbox with compensation, never distributed 2PC.

### Eventing & messaging
- **AR-19** Domain events are versioned, immutable, and self-describing; schemas live in a shared registry (per AR-07 rules).
- **AR-20** Consumers assume at-least-once delivery and dedupe by event id; ordering is never assumed across partitions.
- **AR-21** Reliable publishing uses the transactional outbox pattern — no dual-write of DB plus broker in one step.
- **AR-22** Every consumer has a dead-letter queue and a documented, replayable poison-message policy.

### API versioning & contracts
- **AR-23** APIs are contract-first (OpenAPI/proto checked in); the contract is the source of truth and CI-verified against the impl.
- **AR-24** Additive changes are backward-compatible; consumers ignore unknown fields (tolerant reader). Removals require a version bump (AR-07).
- **AR-25** Deprecated versions ship with a published sunset date and are observably tracked until traffic reaches zero.

### Multi-tenancy
- **AR-26** Every tenant-scoped row/request carries an explicit tenant id; queries filter by it at the data layer, enforced not conventional.
- **AR-27** Tenant isolation is verified by test: no query path can return another tenant's data. Cross-tenant access requires an ADR.
- **AR-28** Per-tenant quotas and limits are first-class so one tenant cannot exhaust shared capacity (noisy-neighbor containment).

### Rate limiting & backpressure
- **AR-29** Every public and cross-service entry point is rate-limited with defined quotas; limits return `429`/`Retry-After`, not silent drops.
- **AR-30** Services shed load and apply backpressure (bounded queues, concurrency caps) before resource exhaustion; unbounded queues are banned.
- **AR-31** Bound the blast radius of dependencies with circuit breakers and bulkheads; a slow dependency must not stall the caller.

### Config & secrets
- **AR-32** Config is environment-injected, never hardcoded or committed; code is identical across environments (12-factor).
- **AR-33** Secrets live only in the secrets manager, are referenced not embedded, and are rotatable without a code deploy.
- **AR-34** Risky changes ship behind a flag/kill-switch that can disable a path at runtime without a redeploy.

### Migrations & schema evolution
- **AR-35** Schema and code deploy in backward-compatible steps (expand/migrate/contract); a migration never breaks the running version.
- **AR-36** Every migration is tested against production-scale data and has a rehearsed rollback or roll-forward before it ships.

### Cost & efficiency
- **AR-37** Each service has an owned cost budget with per-request/per-tenant unit economics tracked and alerted on breach.
- **AR-38** Unbounded fan-out, N+1 access, and full-table scans on hot paths are design defects, not tuning items (per EF-03).

### Failure isolation & resilience
- **AR-39** No single point of failure on a critical path; degrade gracefully to a reduced-function mode over hard failure.
- **AR-40** Dependencies are classified critical vs optional; an optional dependency's outage must never take down the request.

### Observability
- **AR-41** Every request carries a propagated correlation/trace id across all service and async hops.
- **AR-42** Emit the golden signals (latency, traffic, errors, saturation) per service; each has an SLO and an alert.
- **AR-43** Logs are structured, leveled, and PII-safe; no secrets or raw personal data in logs or traces.

## Rationale
Boundaries, inward dependencies, and statelessness (AR-01..AR-05) let the org build many products on
one stack and swap specialists in without re-learning bespoke architecture. The added rules make the
failure-mode contract explicit — idempotency, backpressure, isolation, and observability — so systems
degrade predictably instead of collapsing, and so cost and tenancy are designed rather than discovered
in production. Every rule is a testable/CI-gated assertion, not a preference; if it cannot be enforced,
it does not belong here.

## Exceptions & how to request one
No rule is absolute, but deviations are explicit and logged — never silent.
1. **When to request:** a rule imposes cost with no benefit for a specific context, or a real constraint (legacy system, vendor limit, deadline) makes compliance infeasible.
2. **How:** write an ADR in `projects/<slug>/arch/adr/` citing the rule ID, the reason, the blast radius, and the compensating control or planned paydown.
3. **Ratification:** the Staff Architect owns this file and approves or rejects the ADR. Reviewers enforce the rule until an approved ADR exists.
4. **Scope & expiry:** an exception applies only to the named component and carries a review/expiry date; it is not a precedent for other code.
