# Database Architecture Decision - VeroScore V3

**Created:** 2025-11-24  
**Last Updated:** 2025-11-24  
**Status:** ✅ **DECISION MADE**

---

## 📋 Question

**Should VeroScore V3 use a separate Supabase database or the same database as OPA Compliance?**

---

## ✅ Decision: Same Database, Separate Schema

**VeroScore V3 will use the same Supabase database as OPA Compliance, with a separate `veroscore` schema for namespace isolation.**

---

## 🎯 Rationale

### 1. Consistency with Existing Architecture
- **OPA Compliance** already uses the same database with a `compliance` schema
- **Pattern Established:** Multiple schemas in one database (`auth`, `compliance`, `public`)
- **Prisma Configuration:** Already supports multi-schema (`schemas: ["auth", "compliance", "public"]`)

### 2. Future Integration
- **OPA and Auto-PR will integrate** - Both systems work with PRs and need to share data
- **Shared PR Context:** Both systems analyze the same PRs, can share detection results
- **Unified Dashboard:** Easier to build combined dashboards when data is in same database
- **Cross-References:** Can create views/joins between `compliance.compliance_checks` and `veroscore.pr_scores`

### 3. Operational Benefits
- **Single Connection:** One `DATABASE_URL` for all systems
- **Simplified Configuration:** No need for separate Supabase projects
- **Cost Efficiency:** One database instance instead of multiple
- **Easier Backups:** Single backup strategy for all governance systems

### 4. Schema Isolation
- **Namespace Separation:** `veroscore` schema provides logical isolation
- **No Conflicts:** Table names can overlap (e.g., `compliance.audit_log` vs `veroscore.audit_log`)
- **Clear Boundaries:** Each system has its own schema, easy to understand

---

## 🏗️ Architecture

### Database Structure

```
Supabase Database (Single Instance)
├── auth schema (Supabase Auth)
├── public schema (Main application data)
├── compliance schema (OPA Compliance System)
│   ├── rule_definitions
│   ├── compliance_checks
│   ├── compliance_trends
│   ├── override_requests
│   ├── alert_history
│   └── compliance_audit_log
└── veroscore schema (VeroScore V3 System)
    ├── sessions
    ├── changes_queue
    ├── pr_scores
    ├── detection_results
    ├── idempotency_keys
    ├── system_metrics
    └── audit_log
```

### Prisma Configuration

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["auth", "compliance", "public", "veroscore"]
}
```

### Table Naming

- **Compliance Tables:** `compliance.rule_definitions`, `compliance.compliance_checks`, etc.
- **VeroScore Tables:** `veroscore.sessions`, `veroscore.pr_scores`, etc.
- **No Prefix Needed:** Schema provides namespace, no need for `veroscore_` prefix in table names

---

## 🔗 Integration Points

### Current (Separate Systems)
- OPA Compliance checks PRs independently
- VeroScore V3 scores PRs independently
- No data sharing between systems

### Future (Integrated)
- **Shared PR Context:** Both systems can query same PR data
- **Cross-References:** Link `compliance.compliance_checks` to `veroscore.pr_scores` via `pr_number`
- **Unified Views:** Create views joining both schemas for combined analytics
- **Shared Detection:** OPA violations can feed into VeroScore penalties
- **Combined Dashboard:** Single dashboard showing both compliance and scoring

### Example Integration Query

```sql
-- Combined view of PR scores and compliance checks
CREATE VIEW v_unified_pr_analysis AS
SELECT 
    ps.pr_number,
    ps.stabilized_score,
    ps.decision,
    COUNT(cc.id) FILTER (WHERE cc.status = 'VIOLATION') as compliance_violations,
    COUNT(cc.id) FILTER (WHERE cc.severity = 'BLOCK') as blocking_violations
FROM veroscore.pr_scores ps
LEFT JOIN compliance.compliance_checks cc 
    ON ps.pr_number = cc.pr_number
GROUP BY ps.id;
```

---

## 📝 Migration Impact

### Updated Migration File

The migration file has been updated to:
- Create `veroscore` schema (similar to `compliance` schema)
- Use schema-qualified table names: `veroscore.sessions`, `veroscore.pr_scores`, etc.
- Update all references to use schema prefix
- Update views to use schema prefix: `veroscore.v_active_sessions`, etc.

### Prisma Schema Update

Added `veroscore` to Prisma schema:
```prisma
schemas  = ["auth", "compliance", "public", "veroscore"]
```

---

## ✅ Benefits Summary

1. **Consistency** - Matches existing OPA Compliance pattern
2. **Integration Ready** - Same database enables easy future integration
3. **Operational Simplicity** - Single database, single connection string
4. **Cost Efficient** - One database instance
5. **Clear Separation** - Schema provides logical isolation
6. **Future-Proof** - Easy to create cross-schema views and queries

---

## ⚠️ Considerations

### Schema Management
- **Migration Order:** Ensure `veroscore` schema is created before tables
- **Prisma Client:** Must regenerate after adding `veroscore` schema
- **Access Control:** RLS policies work per-schema

### Future Integration
- **Cross-Schema Queries:** Will need proper permissions
- **Views:** Can create views joining both schemas
- **Foreign Keys:** Cannot create FK across schemas (use application-level validation)

---

## 📚 Related Documents

- `V3_IMPLEMENTATION_PLAN.md` - Original plan (updated to reflect this decision)
- `PHASE1_SETUP_GUIDE.md` - Setup instructions (updated for same database)
- `libs/common/prisma/migrations/20251124160359_veroscore_v3_schema/migration.sql` - Migration file

---

**Last Updated:** 2025-11-24  
**Status:** ✅ Decision Implemented  
**Impact:** Migration file and Prisma schema updated

