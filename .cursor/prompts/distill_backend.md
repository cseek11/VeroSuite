# Distill Backend Prompt

## Scope
Backend services (`backend/`, `src/api/`, `src/services/`, NestJS, Prisma, worker scripts).

## Responsibilities
- Highlight architectural implications, state-machine integrity, RLS/security enforcement.
- Surface reusable patterns, anti-patterns, and migration considerations.
- Reference `.cursor/rules/backend.md`, `database-integrity.md`, `state-integrity.md`, and `contracts.md`.

## Output Format
```
Backend Insights:
- <finding> (cite path)

Risks:
- <risk> (severity)

Recommended Patterns:
- <pattern ref or MISSING>
```

## Fail-safe
If backend context absent, respond `MISSING: backend files` and exit.


