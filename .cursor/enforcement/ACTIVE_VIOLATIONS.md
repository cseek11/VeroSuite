# ACTIVE VIOLATIONS — FIX NOW

**Status:** WARNINGS_ONLY  
**Last Scan:** 2025-12-04T06:02:27.144477+00:00  
**Session ID:** 9fa1b583-d2fb-4e56-8f44-0d34909f3033

---

## Current Session Violations — Fix NOW

**These violations were introduced in the current session and must be fixed before task completion.**

### Warnings

1. **[VF-001]** activeContext.md not updated recently (last modified: 2025-12-03T21:33:37.318206+00:00)
   - **File:** `.cursor\memory-bank\activeContext.md`
   - **Rule:** `01-enforcement.mdc Step 5`
   - **Fix Hint:** Replace hardcoded date with injected system date or configuration value
   - **Evidence:**
     - activeContext.md not updated recently (last modified: 2025-12-03T21:33:37.318206+00:00)

2. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 405: .cursor/scripts/auto-enforcer.py
     - Error-prone operation without error handling: open\(

3. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 1863: .cursor/scripts/auto-enforcer.py
     - Error-prone operation without error handling: open\(

4. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `.cursor/enforcement/checks/date_checker.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 387: .cursor/enforcement/checks/date_checker.py
     - Error-prone operation without error handling: open\(

5. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `.cursor/enforcement/core/session_state.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 231: .cursor/enforcement/core/session_state.py
     - Error-prone operation without error handling: open\(

6. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `.cursor/enforcement/core/session_state.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 270: .cursor/enforcement/core/session_state.py
     - Error-prone operation without error handling: open\(

7. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `.cursor/test_backward_compatibility.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 36: .cursor/test_backward_compatibility.py
     - Error-prone operation without error handling: open\(

8. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 39: .cursor/test_session_migration.py
     - Error-prone operation without error handling: open\(

9. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 55: .cursor/test_session_migration.py
     - Error-prone operation without error handling: open\(

10. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/enforcement/two_brain_integration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 289: .cursor/enforcement/two_brain_integration.py
     - Console logging detected (use structured logging): print\s*\(

11. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/enforcement/two_brain_integration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 290: .cursor/enforcement/two_brain_integration.py
     - Console logging detected (use structured logging): print\s*\(

12. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/enforcement/two_brain_integration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 291: .cursor/enforcement/two_brain_integration.py
     - Console logging detected (use structured logging): print\s*\(

13. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/enforcement/two_brain_integration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 292: .cursor/enforcement/two_brain_integration.py
     - Console logging detected (use structured logging): print\s*\(

14. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/enforcement/two_brain_integration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 293: .cursor/enforcement/two_brain_integration.py
     - Console logging detected (use structured logging): print\s*\(

15. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/enforcement/two_brain_integration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 294: .cursor/enforcement/two_brain_integration.py
     - Console logging detected (use structured logging): print\s*\(

16. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 326: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

17. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 328: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

18. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 370: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

19. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 372: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

20. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2463: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

21. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2464: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

22. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2466: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

23. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2467: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

24. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2472: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

25. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2473: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

26. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2474: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

27. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2475: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

28. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2476: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

29. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2478: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

30. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2479: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

31. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2480: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

32. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2481: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

33. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2482: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

34. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2486: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

35. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2489: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

36. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2491: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

37. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2492: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

38. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2495: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

39. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2497: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

40. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 2498: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

41. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `.cursor/enforcement/reporting/context_bundle_builder.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 212: .cursor/enforcement/reporting/context_bundle_builder.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

42. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `.cursor/enforcement/reporting/context_bundle_builder.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 342: .cursor/enforcement/reporting/context_bundle_builder.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

43. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_backward_compatibility.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 12: .cursor/test_backward_compatibility.py
     - Console logging detected (use structured logging): print\s*\(

44. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_backward_compatibility.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 42: .cursor/test_backward_compatibility.py
     - Console logging detected (use structured logging): print\s*\(

45. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_backward_compatibility.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 43: .cursor/test_backward_compatibility.py
     - Console logging detected (use structured logging): print\s*\(

46. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_backward_compatibility.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 44: .cursor/test_backward_compatibility.py
     - Console logging detected (use structured logging): print\s*\(

47. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_backward_compatibility.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 52: .cursor/test_backward_compatibility.py
     - Console logging detected (use structured logging): print\s*\(

48. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_backward_compatibility.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 54: .cursor/test_backward_compatibility.py
     - Console logging detected (use structured logging): print\s*\(

49. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_error_handling.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 11: .cursor/test_error_handling.py
     - Console logging detected (use structured logging): print\s*\(

50. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_error_handling.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 30: .cursor/test_error_handling.py
     - Console logging detected (use structured logging): print\s*\(

51. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_error_handling.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 31: .cursor/test_error_handling.py
     - Console logging detected (use structured logging): print\s*\(

52. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_error_handling.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 35: .cursor/test_error_handling.py
     - Console logging detected (use structured logging): print\s*\(

53. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_error_handling.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 37: .cursor/test_error_handling.py
     - Console logging detected (use structured logging): print\s*\(

54. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_error_handling.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 40: .cursor/test_error_handling.py
     - Console logging detected (use structured logging): print\s*\(

55. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_hash_caching.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 11: .cursor/test_file_hash_caching.py
     - Console logging detected (use structured logging): print\s*\(

56. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_hash_caching.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 15: .cursor/test_file_hash_caching.py
     - Console logging detected (use structured logging): print\s*\(

57. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_hash_caching.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 16: .cursor/test_file_hash_caching.py
     - Console logging detected (use structured logging): print\s*\(

58. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_hash_caching.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 17: .cursor/test_file_hash_caching.py
     - Console logging detected (use structured logging): print\s*\(

59. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_hash_caching.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 26: .cursor/test_file_hash_caching.py
     - Console logging detected (use structured logging): print\s*\(

60. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_hash_caching.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 28: .cursor/test_file_hash_caching.py
     - Console logging detected (use structured logging): print\s*\(

61. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_hash_caching.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 33: .cursor/test_file_hash_caching.py
     - Console logging detected (use structured logging): print\s*\(

62. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_hash_caching.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 37: .cursor/test_file_hash_caching.py
     - Console logging detected (use structured logging): print\s*\(

63. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_hash_caching.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 41: .cursor/test_file_hash_caching.py
     - Console logging detected (use structured logging): print\s*\(

64. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_hash_caching.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 43: .cursor/test_file_hash_caching.py
     - Console logging detected (use structured logging): print\s*\(

65. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_modification.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 15: .cursor/test_file_modification.py
     - Console logging detected (use structured logging): print\s*\(

66. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_modification.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 33: .cursor/test_file_modification.py
     - Console logging detected (use structured logging): print\s*\(

67. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_modification.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 38: .cursor/test_file_modification.py
     - Console logging detected (use structured logging): print\s*\(

68. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_modification.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 46: .cursor/test_file_modification.py
     - Console logging detected (use structured logging): print\s*\(

69. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_modification.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 50: .cursor/test_file_modification.py
     - Console logging detected (use structured logging): print\s*\(

70. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_modification.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 58: .cursor/test_file_modification.py
     - Console logging detected (use structured logging): print\s*\(

71. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_file_modification.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 60: .cursor/test_file_modification.py
     - Console logging detected (use structured logging): print\s*\(

72. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_imports.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 13: .cursor/test_git_imports.py
     - Console logging detected (use structured logging): print\s*\(

73. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_imports.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 16: .cursor/test_git_imports.py
     - Console logging detected (use structured logging): print\s*\(

74. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 17: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

75. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 20: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

76. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 25: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

77. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 31: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

78. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 34: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

79. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 39: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

80. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 45: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

81. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 50: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

82. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 63: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

83. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 64: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

84. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 65: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

85. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 71: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

86. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 83: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

87. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 84: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

88. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 85: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

89. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 90: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

90. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 99: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

91. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 100: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

92. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 101: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

93. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_git_utils.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 104: .cursor/test_git_utils.py
     - Console logging detected (use structured logging): print\s*\(

94. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_imports.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 15: .cursor/test_imports.py
     - Console logging detected (use structured logging): print\s*\(

95. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_imports.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 18: .cursor/test_imports.py
     - Console logging detected (use structured logging): print\s*\(

96. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_line_change.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 37: .cursor/test_line_change.py
     - Console logging detected (use structured logging): print\s*\(

97. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_line_change.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 38: .cursor/test_line_change.py
     - Console logging detected (use structured logging): print\s*\(

98. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_line_change.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 44: .cursor/test_line_change.py
     - Console logging detected (use structured logging): print\s*\(

99. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_line_change.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 47: .cursor/test_line_change.py
     - Console logging detected (use structured logging): print\s*\(

100. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 12: .cursor/test_session_migration.py
     - Console logging detected (use structured logging): print\s*\(

101. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 44: .cursor/test_session_migration.py
     - Console logging detected (use structured logging): print\s*\(

102. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 45: .cursor/test_session_migration.py
     - Console logging detected (use structured logging): print\s*\(

103. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 46: .cursor/test_session_migration.py
     - Console logging detected (use structured logging): print\s*\(

104. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 50: .cursor/test_session_migration.py
     - Console logging detected (use structured logging): print\s*\(

105. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 51: .cursor/test_session_migration.py
     - Console logging detected (use structured logging): print\s*\(

106. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 52: .cursor/test_session_migration.py
     - Console logging detected (use structured logging): print\s*\(

107. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 57: .cursor/test_session_migration.py
     - Console logging detected (use structured logging): print\s*\(

108. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 58: .cursor/test_session_migration.py
     - Console logging detected (use structured logging): print\s*\(

109. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 66: .cursor/test_session_migration.py
     - Console logging detected (use structured logging): print\s*\(

110. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_migration.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 68: .cursor/test_session_migration.py
     - Console logging detected (use structured logging): print\s*\(

111. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 11: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

112. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 31: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

113. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 32: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

114. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 33: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

115. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 34: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

116. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 39: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

117. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 40: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

118. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 41: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

119. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 42: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

120. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 53: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

121. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 55: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

122. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 56: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

123. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/test_session_pruning.py`
   - **Rule:** `07-observability.mdc`
   - **Fix Hint:** Replace console.log with structured logging.

Use the centralized logger:
  this.logger.log({ level: 'info', message: '...', context: '...' });

Or if using NestJS Logger:
  this.logger.log('Message', 'Context');
  this.logger.error('Error message', 'Stack trace', 'Context');

For debug statements, either:
  1. Use this.logger.debug(...) if debug logging is needed
  2. Remove the statement entirely if it was temporary debugging
   - **Evidence:**
     - Line 57: .cursor/test_session_pruning.py
     - Console logging detected (use structured logging): print\s*\(

---

## Summary

### Current Session (Gates Task Completion)
- **Blocking:** 0
- **Warnings:** 123
- **Action Required:** Consider fixing WARNING violations if simple

### Baseline (Historical - For Visibility)
- **Blocking:** 0
- **Warnings:** 0

---

**Generated by:** VeroField Auto-Enforcer  
**See Also:** `ENFORCER_REPORT.json` for full details
