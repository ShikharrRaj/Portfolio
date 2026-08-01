# DevOps Engineer — Reference (on-demand depth)

Loaded only when the DevOps Engineer needs deep pipeline/IaC logic or hits a failure mode.

## <a id="decision"></a>Pipeline, container & infra-as-code patterns

### CI/CD pipeline shape
- One pipeline, explicit stages: build → test → scan → package → deploy(stage) → gate → deploy(prod).
  Each stage fails closed; a red stage never promotes.
- Pin everything: runner image, action/tool versions, and dependency lockfiles. Reproducibility means the
  same commit produces the same artifact tomorrow (per TS-05). No `latest`, no unpinned floating refs.
- Scope pipeline credentials per job with OIDC/short-lived tokens, not long-lived static keys (per AR-10).
- Build the artifact once; promote the *same* immutable image across environments — never rebuild per env.

### Containerization
- Minimal, pinned base images (digest-pinned); multi-stage builds; non-root runtime user; no secrets baked
  into layers (per CS-13). Healthchecks defined so orchestration can detect and replace bad instances.
- Read config and secrets from the environment / secret manager at runtime (per CS-13), not from the image.

### Infra-as-code & environments
- All infra is declared in code (IaC) and version-controlled — no click-ops. State is remote and locked.
- Prod and stage share one module set; they differ only by parameter (scale, sizing), not by shape. Drift
  between environments is a defect, not a convenience.
- Least-privilege IAM: every role/policy scoped to the specific resources and actions the workload needs,
  default deny (per AR-10). No wildcard admin roles wired into deploys.

### Resilience & observability
- Every deploy has a tested rollback (blue/green, canary, or versioned rollback) — untested rollback = no
  rollback (per AR-06). Health gates and idempotent deploy steps so a retried deploy is safe.
- Traces, metrics, and logs are wired the day a service ships, not bolted on later (per AR-10). Alerts on
  SLO-relevant signals; dashboards exist before prod traffic does.

## <a id="failure-modes"></a>Failure modes (detect → fix)
- **FM-1 Unpinned builds** — `latest` base images / floating action versions. *Fix:* digest-pin images and pin tool/action versions (TS-05).
- **FM-2 Secrets in source** — credentials in a Dockerfile, `*.yml`, or committed env file. *Fix:* move to secret manager, inject at runtime (CS-13).
- **FM-3 Over-privileged IAM** — wildcard/admin roles or long-lived static keys in CI. *Fix:* scope least-privilege, use OIDC short-lived tokens, default deny (AR-10).
- **FM-4 Env drift / no parity** — prod and stage diverge in shape, hand-edited resources. *Fix:* one IaC module set, differ only by parameter; kill click-ops.
- **FM-5 No tested rollback** — deploy is one-way, rollback never exercised. *Fix:* implement + test blue/green or canary rollback before prod (AR-06).
- **FM-6 Observability bolted on** — service ships with no traces/metrics/logs or alerts. *Fix:* wire telemetry + SLO alerts from day one (AR-10).

## Responsibilities (full)
Own the deploy path within the architecture's constraints: CI/CD pipelines, containerization, infra-as-code,
environment definitions (prod/stage), deployment config, and observability wiring. Consume `backend-impl` and
`frontend-impl`; produce `deploy-config`. Hand deploy-config to security-reviewer (review) and the EM; block to
staff-architect on missing infra requirements. Do NOT write application code or sign off on security yourself.
Governed by TS-05, AR-06, AR-10, CS-13 (cited, never inlined).
