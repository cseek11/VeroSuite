## Circular Dependencies

- `npx madge --ts-config apps/api/tsconfig.json --extensions ts,tsx --circular apps/api/src` (2025-12-06) reported **none**.

## High Coupling

- Fan-in hot spots (most referenced):
  - `common/services/database.service.ts` (45)
  - `common/services/supabase.service.ts` (30)
  - `auth/jwt-auth.guard.ts` (29)
  - `dashboard/dto/dashboard-region.dto.ts` (12)
  - `common/services/cache.service.ts` (10)
  - `common/interceptors/idempotency.interceptor.ts` (9)
- Fan-out hot spots (most dependencies):
  - `app.module.ts` (26)
  - `dashboard/dashboard.module.ts` (17)
  - `common/common.module.ts` (14)
  - `billing/dto/index.ts` (9)
  - `dashboard/dashboard.service.ts` (9)
  - `user/user-v2.controller.ts` (9)

### Remediation Priorities

- Carve shared-kernel boundaries for cross-cutting concerns: database access (`common/services/database.service.ts`), Supabase client, JWT guard, cache service, and idempotency interceptor.
- Reduce `app.module.ts` fan-out by encapsulating feature wiring into bounded-context modules with slimmer exports.
- Split dashboard aggregation: move shared DTOs and widget registry contracts into a `dashboard-kernel` package to lower fan-in on dashboard DTOs.
- Review billing DTO index exports; export only stable DTOs through context-level barrels to curb unnecessary coupling.
- Introduce interface adapters around shared infra so feature modules depend on abstractions instead of concrete services.

