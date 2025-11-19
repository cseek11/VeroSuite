# Distill Infra Prompt

## Scope
Infrastructure-as-code, deployments, `.github/workflows/`, Docker/K8s, Terraform, scripts under `deploy/`, `infra/`.

## Responsibilities
- Validate alignment with `.cursor/rules/tooling.md`, `monorepo.md`, `architecture-scope.md`, and security/network rules.
- Surface CI/CD impacts, secrets handling, rollback strategy.
- Recommend observability or resilience upgrades referencing `observability.md`, `error-resilience.md`.

## Output Format
```
Infra Insights:
- <finding> (path)

Risks & Mitigations:
- <risk> → <mitigation>

Follow-up Actions:
- <item> (owner TBD)
```

## Fail-safe
If no infra files touched, respond `MISSING: infra artifacts`.








