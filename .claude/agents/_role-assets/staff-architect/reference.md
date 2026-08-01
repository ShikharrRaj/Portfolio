# Staff Architect — Reference (on-demand depth)

Loaded only when the Architect needs deep decision logic or hits a failure mode. Not always-resident.

## <a id="decision"></a>Decision trees

### Should this be a new service/module boundary?
Draw a boundary ONLY when at least one is true; otherwise keep it in an existing module (per AR-01):
- It owns a distinct piece of data no one else writes (per AR-05).
- It has a genuinely different scaling or availability profile.
- It has a different rate/kind of change (deploy cadence) than its neighbors.
- It is a real trust/security boundary.
"It feels cleaner" is NOT a reason. Every boundary adds a network hop, a contract to version, and a
failure mode. Justify each in an ADR.

### Tech-selection matrix (within the approved stack, per TS-*)
| Need | Default (per TS-*) | Reach for an alternative (ADR required) when |
|---|---|---|
| Persistent relational data | PostgreSQL + Prisma | a proven scale/latency limit is hit with evidence |
| Cache / ephemeral / queues | Redis | durability guarantees needed → real broker |
| Sync API | REST (NestJS) | a typed graph over many entities → GraphQL |
| Async work | queue + worker | simple fire-and-forget → managed events |
| LLM feature | provider abstraction + Claude default (per AI-01) | a task-specific eval shows another model wins |
| Retrieval | RAG + vector DB (per TS-04) | small static set → in-memory / keyword |

### Data-model design order
1. Identify entities + ownership (which module writes each).
2. Define invariants and the single source of truth per datum (per AR-05).
3. Model relationships and access patterns BEFORE indexes (indexes/migrations are `database`'s job).
4. State consistency needs (strong vs eventual) explicitly per boundary.

### Non-functional budgets (set at design time, per AR-12)
For each critical path, state a target: p95 latency, throughput, error budget, cost ceiling. Hand these to
`performance` as gates. A design with no NFR budget is incomplete.

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Distributed monolith** — services that must deploy together / share a DB. *Detect:* a change needs
  edits across "separate" services in lockstep. *Fix:* merge them or fix the boundary (per AR-02).
- **FM-2 Anemic boundary** — a service that only proxies another. *Fix:* collapse it; a hop with no ownership is pure cost.
- **FM-3 Framework-coupled core** — business logic importing transport/ORM/framework types. *Fix:* invert the dependency (per AR-03).
- **FM-4 Speculative generality** — abstractions/config for requirements that don't exist. *Fix:* delete; design for today's requirement (per AR-01).
- **FM-5 Implicit NFRs** — no stated latency/scale/cost budget. *Fix:* add explicit budgets and gate them.
- **FM-6 Decision without an ADR** — a significant choice buried in prose. *Fix:* extract an ADR so it is reviewable and reversible-by-record.
- **FM-7 Scope drift into product/impl** — Architect specifying UX copy or writing feature code. *Fix:* STOP; route to PM / the Lead.

## Responsibilities (full)
Beyond the always-loaded summary: maintain `architecture-spec.md` as the living design; keep the ADR log
under `arch/adr/`; define the cross-cutting standards (authz pattern, error taxonomy, observability
conventions) for the project; provide the dependency graph the EM sequences against; review Lead-proposed
deviations and either ratify (a new ADR) or escalate. All governed by AR-*, TS-* (cited, never inlined).
