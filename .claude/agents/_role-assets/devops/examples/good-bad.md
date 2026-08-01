# DevOps Engineer — Good vs Bad deploy config (on-demand)

## Task: containerize and deploy a NestJS service

### ✅ GOOD
```dockerfile
# multi-stage, digest-pinned base, non-root, no secrets in image
FROM node:20.11-slim@sha256:2e3f... AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:20.11-slim@sha256:2e3f... AS run
USER node                                  # non-root runtime (AR-10)
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
HEALTHCHECK CMD node dist/healthcheck.js   # orchestration can replace bad instances (AR-06)
CMD ["node", "dist/main.js"]
```
```yaml
# deploy job: OIDC short-lived creds, secrets from manager, same image promoted
permissions: { id-token: write, contents: read }   # least-privilege (AR-10)
steps:
  - uses: aws-actions/configure-aws-credentials@v4  # OIDC, no static keys
    with: { role-to-assume: arn:aws:iam::...:role/deploy-stage, aws-region: us-east-1 }
  - run: aws ssm get-parameter --name /svc/db-url --with-decryption  # secret manager (CS-13)
  - run: deploy --image "$IMAGE_DIGEST" --canary && rollback-if-unhealthy  # tested rollback (AR-06)
```
Why good: digest-pinned base + non-root (FM-1, AR-10); no secrets in image, pulled from SSM at runtime
(FM-2, CS-13); OIDC short-lived scoped role (FM-3, AR-10); one immutable image promoted with a canary +
auto-rollback (FM-5, AR-06); healthcheck for self-healing. Passes security review and DoD.

### ❌ BAD
```dockerfile
FROM node:latest                           # FM-1: unpinned, non-reproducible
ENV DB_PASSWORD=hunter2                     # FM-2: secret baked into image layer (CS-13)
COPY . .
RUN npm install && npm run build
CMD ["node", "dist/main.js"]               # runs as root, no healthcheck
```
```yaml
env:
  AWS_ACCESS_KEY_ID: AKIA...               # FM-3: long-lived static admin key in CI
  AWS_SECRET_ACCESS_KEY: ${{ ... }}
steps:
  - run: docker build -t svc . && docker push  # rebuilt per env → drift (FM-4)
  - run: kubectl apply -f prod.yml             # one-way, no rollback, no telemetry (FM-5, FM-6)
```
Why bad: `latest` base = non-reproducible (FM-1); DB password committed into the image (FM-2 →
security-critical); long-lived admin key with no scoping (FM-3); rebuilds a different image per environment
so prod ≠ stage (FM-4); one-way apply with no tested rollback and no observability (FM-5, FM-6). Fails
security review and DoD.
