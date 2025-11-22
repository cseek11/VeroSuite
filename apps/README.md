# Apps Directory

**Purpose:** Contains all independently deployable applications in the VeroField monorepo.

**Last Updated:** 2025-11-22

---

## Structure

```
apps/
  api/              # NestJS API (primary backend)
  crm-ai/           # CRM AI service (future)
  ai-soc/           # SOC/alerting AI (future)
  feature-ingestion/  # ingestion/ETL (future)
  kpi-gate/         # metrics & KPIs (future)
```

---

## Service Boundaries

Each app in `apps/` is:
- **Independently deployable**
- **Self-contained** (has its own package.json, dependencies)
- **Communicates via HTTP/events** with other services
- **Shares code via `libs/common`** (not direct imports)

---

## Rules

### ✅ DO:
- Use `@verofield/common/*` for shared code
- Communicate via HTTP/events between services
- Keep services independent and deployable separately

### ❌ DON'T:
- Use relative imports across services (`../../crm-ai/`)
- Import backend implementation types in frontend
- Create cross-service dependencies

---

## Migration Status

- ✅ **Directory structure created** (2025-11-22)
- 🟡 **Migration in progress:** `backend/` → `apps/api/` (Phase 1)

---

**Reference:** `.cursor/rules/04-architecture.mdc`


