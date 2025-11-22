# BUG LOG

| Date | Area | Description | Status | Owner | Notes |      
|------|------|-------------|--------|-------|-------|      
| 2025-11-17 | Frontend/Scheduling | REACT_QUERY_API_FETCH_ERROR - ResourceTimeline component missing error handling for React Query API fetch failures. Errors from enhancedApi.technicians.list, enhancedApi.users.list, and enhancedApi.jobs.getByDateRange were not caught and displayed to users, causing silent failures. | fixed | AI Agent | Fixed during implementation. Error pattern documented in docs/error-patterns.md. All errors now use structured logging (logger.error) and display user-friendly error messages. Regression tests added (4 error handling tests). |
| 2025-11-22 | Backend/Auth | JWT_SECRET_LOADING_TIMING - JWT_SECRET environment variable checked at module load time (auth.module.ts line 14) before NestJS ConfigModule loads .env file, causing "JWT_SECRET environment variable is required" error even when variable is set. | fixed | AI Agent | Fixed by changing from JwtModule.register() to JwtModule.registerAsync() with ConfigService. This ensures environment variables are loaded before JWT module initialization. Error now includes traceId for debugging. Regression tests added (auth.module.spec.ts). |
| 2025-11-22 | Backend/Build | START_SCRIPT_PATH_MISMATCH - Start script in package.json looking for dist/main.js but NestJS build outputs to dist/apps/api/src/main.js due to monorepo structure preservation. | fixed | AI Agent | Fixed by updating package.json start scripts to use correct path: dist/apps/api/src/main.js. This ensures API server can start after build. Documented in API_START_SCRIPT_FIX.md. |
| TBA | TBA  | Placeholder entry | open | TBA | Logged automatically for low REWARD_SCORE PRs |

