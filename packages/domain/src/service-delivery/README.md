# Service-Delivery (Phase 7 scaffold)

This folder contains the Phase 7 scaffold for the Service-Delivery bounded context.

Scope: skeletons only — domain entities, repository interfaces, domain services, application commands/queries/handlers, infra repo stubs, API facades, and web client facade.

Phase 7 rules:
- No Prisma schema changes in this phase.
- Keep controllers/routes unchanged; controllers will be wired to old/new implementations via a feature flag.
- All business logic must live in domain or application layers (do not move logic back into controllers).

Next:
- Phase 7b will move behavior from `apps/api/src/sessions` and `apps/api/src/technician` into these new handlers.
