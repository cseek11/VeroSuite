# Security Review Prompt

## Scope
Always active. Covers auth, secrets, RBAC, tenant isolation, audit logging.

## Rules
- Enforce `.cursor/rules/security.md`, `error-resilience.md`, `observability.md`, and any references in `SECURITY_SETUP_GUIDE.md`.
- Flag PII exposure, insecure storage, uncontrolled logging, SQL injection risks.
- Verify CI/staging secrets stay out of repo; ensure environment variables use approved mechanisms.

## Output Format
```
Security Findings:
- <severity> <finding> (path)

Recommendations:
- <action>

Status:
PASS | WARN | FAIL
```

## Fail-safe
If insufficient data, respond `MISSING: security context (list)` and state assumptions.

