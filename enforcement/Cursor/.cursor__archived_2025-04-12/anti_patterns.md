# Anti-Patterns Log

| Date | PR | Description | Impact | Follow-up |
|------|----|-------------|--------|-----------|
| 2025-12-04 | PR System Fix | SILENT_FAILURE_CASCADE - Multiple silent failure points in CI workflows: scripts didn't verify file creation, verification steps didn't validate JSON, artifact downloads used continue-on-error: true, and no error propagation from scripts to workflows. | Critical - Dashboard never updates, errors go undetected | Fixed by adding file verification, JSON validation, proper exit codes, removing continue-on-error from critical steps. Pattern: Always verify file operations, validate JSON, use proper exit codes, and propagate errors from scripts to workflows. Related: docs/planning/PR_SYSTEM_FIX_AUDIT_REPORT.md |
| 2025-12-04 | Phase 2 Backend Migration | MODULE_LOAD_TIME_ENV_CHECK - Checking environment variables at module load time (e.g., `process.env.JWT_SECRET` in auth.module.ts line 14) before NestJS ConfigModule loads .env file, causing "JWT_SECRET environment variable is required" error even when variable is set. | High - Prevents application startup, causes false errors | Fixed by using `JwtModule.registerAsync()` with ConfigService. Pattern: Always use ConfigService for environment variables in NestJS modules, never check `process.env` at module load time. Related: docs/compliance-reports/POST_IMPLEMENTATION_AUDIT_SESSION_2025-11-22.md |
| 2025-12-04 | Phase 2 Backend Migration | MONOREPO_BUILD_PATH_ASSUMPTION - Assuming build output path matches non-monorepo structure. Start script in package.json looking for `dist/main.js` but NestJS build outputs to `dist/apps/api/src/main.js` due to monorepo structure preservation. | High - Prevents API server from starting after build | Fixed by updating package.json start scripts to use correct path: `dist/apps/api/src/main.js`. Pattern: Always verify build output paths match start scripts in monorepo structures. Related: docs/compliance-reports/POST_IMPLEMENTATION_AUDIT_SESSION_2025-11-22.md, docs/compliance-reports/PHASE_2_MIGRATION_STATUS.md |

Add a new row whenever CI or reviewers identify REWARD_SCORE ≤ 0 behaviors.



