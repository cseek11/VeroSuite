# BUG LOG

| Date | Area | Description | Status | Owner | Notes |      
|------|------|-------------|--------|-------|-------|      
| 2025-12-04 | Frontend/Scheduling | REACT_QUERY_API_FETCH_ERROR - ResourceTimeline component missing error handling for React Query API fetch failures. Errors from enhancedApi.technicians.list, enhancedApi.users.list, and enhancedApi.jobs.getByDateRange were not caught and displayed to users, causing silent failures. | fixed | AI Agent | Fixed during implementation. Error pattern documented in docs/error-patterns.md. All errors now use structured logging (logger.error) and display user-friendly error messages. Regression tests added (4 error handling tests). |
| TBA | TBA  | Placeholder entry | open | TBA | Logged automatically for low REWARD_SCORE PRs |

