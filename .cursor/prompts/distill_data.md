# Distill Data Prompt

## Scope
Analytics pipelines, SQL, dbt, Airflow, Supabase functions, or any `*.sql`/`pipelines/` assets.

## Responsibilities
- Verify schema alignment with `.cursor/rules/contracts.md`, `database-integrity.md`, `dependencies.md`.
- Check RLS/tenant isolation, data retention, privacy mandates.
- Recommend tests (dbt, SQL unit tests) and monitoring hooks.

## Output Format
```
Data Insights:
- <finding> (path)

Data Risks:
- <risk + severity>

Next Steps:
- <tests/docs/approvals>
```

## Fail-safe
If no data artifacts referenced, respond `MISSING: data files`.








