---
name: observability-setup
description: Wires a service's observability baseline — structured logging, tracing with correlation IDs, RED metrics, dashboards, alerts, health checks, and an incident/rollback runbook. Use when standing up or auditing a service's production readiness. Follows Knowledge/architecture-principles.md#AR-41.
when_to_use: set up logging, add tracing, metrics and alerts, health checks, dashboards, incident runbook, observability baseline
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---
## Purpose & Preconditions
Make the service observable BEFORE it ships (per AR-10). Requires: the architecture-spec's NFR budgets
and the service's entry points.

## Inputs / Outputs (contract)
Inputs: architecture-spec (NFRs, service map), the service code.
Outputs: observability wiring (in the invoking role's write-scope) + runbook → docs/runbooks/<svc>.md.

## Steps (deterministic)
1. Logging: structured JSON, leveled per CS-36, correlation id on every request (per AR-41), PII-safe (per CS-35/AR-43).
2. Tracing: propagate trace context across every service + async hop; LLM calls via Langfuse (per TS-35).
3. Metrics: RED (rate, errors, duration) per primary path (per TS-37); SLO per golden signal (per AR-42).
4. Health: liveness + readiness endpoints; dependency checks classified critical vs optional (per AR-40).
5. Alerts: one per SLO breach + error-budget burn; alert text names the runbook.
6. Dashboards: one per service — golden signals + top business metric.
7. Runbook: symptoms → diagnosis → mitigation → rollback steps (rehearsed per AR-36).

## Decision Points
- No SLO defined → get it from staff-architect (AR-42 gap), don't invent silently.
- Alert without a runbook entry → not done; write the runbook line first.

## Quality Gate (inline)
- [ ] Correlation id verified end-to-end on one real request path.
- [ ] Every alert maps to an SLO and a runbook section; zero unactionable alerts.
- [ ] Logs checked for secrets/PII (per CS-35); health endpoints return dependency detail.

## References
per AR-10, AR-36, AR-39..AR-43, CS-34..CS-36, TS-33..TS-37.
