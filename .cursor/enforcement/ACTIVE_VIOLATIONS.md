# ACTIVE VIOLATIONS — FIX NOW

**Status:** REJECTED  
**Last Scan:** 2025-12-06T02:12:16.201417+00:00  
**Session ID:** 4850fc61-c840-4d53-9737-54a7400fcc11

---

## Current Session Violations — Fix NOW

**These violations were introduced in the current session and must be fixed before task completion.**

### Critical (BLOCKING)

1. **[VF-DATE-001]** Hardcoded date detected: 2025-12-04 (should be 2025-12-05)
   - **File:** `tests/test_date_detection_phase3.py`
   - **Rule:** `02-core.mdc`
   - **Fix Hint:** Replace hardcoded date with injected system date or configuration value
   - **Evidence:**
     - Line 49: tests/test_date_detection_phase3.py
     - Hardcoded date detected: 2025-12-04 (should be 2025-12-05)

2. **[VF-DATE-001]** Hardcoded date detected: 2025-12-04 (should be 2025-12-05)
   - **File:** `tools/bible_pipeline.py`
   - **Rule:** `02-core.mdc`
   - **Fix Hint:** Replace hardcoded date with injected system date or configuration value
   - **Evidence:**
     - Line 529: tools/bible_pipeline.py
     - Hardcoded date detected: 2025-12-04 (should be 2025-12-05)

3. **[VF-DATE-001]** Hardcoded date detected: 2025-12-04 (should be 2025-12-05)
   - **File:** `tools/bible_pipeline.py`
   - **Rule:** `02-core.mdc`
   - **Fix Hint:** Replace hardcoded date with injected system date or configuration value
   - **Evidence:**
     - Line 778: tools/bible_pipeline.py
     - Hardcoded date detected: 2025-12-04 (should be 2025-12-05)

---

### Warnings

4. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `.cursor/scripts/auto-enforcer.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 422: .cursor/scripts/auto-enforcer.py
     - Error-prone operation without error handling: open\(

5. **[VF-ERR-001]** Error-prone operation without error handling: subprocess\.(run|call|Popen)
   - **File:** `.cursor/scripts/veroscore_v3/pr_creator.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 266: .cursor/scripts/veroscore_v3/pr_creator.py
     - Error-prone operation without error handling: subprocess\.(run|call|Popen)

6. **[VF-ERR-001]** Error-prone operation without error handling: subprocess\.(run|call|Popen)
   - **File:** `.cursor/scripts/veroscore_v3/pr_creator.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 274: .cursor/scripts/veroscore_v3/pr_creator.py
     - Error-prone operation without error handling: subprocess\.(run|call|Popen)

7. **[VF-ERR-001]** Error-prone operation without error handling: subprocess\.(run|call|Popen)
   - **File:** `.cursor/scripts/veroscore_v3/pr_creator.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 333: .cursor/scripts/veroscore_v3/pr_creator.py
     - Error-prone operation without error handling: subprocess\.(run|call|Popen)

8. **[VF-ERR-001]** Error-prone operation without error handling: subprocess\.(run|call|Popen)
   - **File:** `.cursor/scripts/veroscore_v3/pr_creator.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 471: .cursor/scripts/veroscore_v3/pr_creator.py
     - Error-prone operation without error handling: subprocess\.(run|call|Popen)

9. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `.cursor/scripts/veroscore_v3/tests/test_git_diff_analyzer.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 155: .cursor/scripts/veroscore_v3/tests/test_git_diff_analyzer.py
     - Error-prone operation without error handling: open\(

10. **[VF-ERR-001]** Error-prone operation without error handling: subprocess\.(run|call|Popen)
   - **File:** `.cursor/scripts/veroscore_v3/tests/test_pr_creator.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 82: .cursor/scripts/veroscore_v3/tests/test_pr_creator.py
     - Error-prone operation without error handling: subprocess\.(run|call|Popen)

11. **[VF-ERR-001]** Error-prone operation without error handling: await\s+\w+\(
   - **File:** `.cursor/scripts/veroscore_v3/tests/test_scoring_engine_integration.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 101: .cursor/scripts/veroscore_v3/tests/test_scoring_engine_integration.py
     - Error-prone operation without error handling: await\s+\w+\(

12. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `analyze_date_violations.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 6: analyze_date_violations.py
     - Error-prone operation without error handling: open\(

13. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `analyze_date_violations_detailed.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 6: analyze_date_violations_detailed.py
     - Error-prone operation without error handling: open\(

14. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `analyze_violations.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 5: analyze_violations.py
     - Error-prone operation without error handling: open\(

15. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `check_current_session_false_positives.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 13: check_current_session_false_positives.py
     - Error-prone operation without error handling: open\(

16. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `check_date_violations.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 10: check_date_violations.py
     - Error-prone operation without error handling: open\(

17. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `check_date_violations_legitimate.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 5: check_date_violations_legitimate.py
     - Error-prone operation without error handling: open\(

18. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `check_line_numbers.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 8: check_line_numbers.py
     - Error-prone operation without error handling: open\(

19. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `check_session_violations.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 8: check_session_violations.py
     - Error-prone operation without error handling: open\(

20. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `check_violation_count.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 10: check_violation_count.py
     - Error-prone operation without error handling: open\(

21. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `check_violation_count.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 23: check_violation_count.py
     - Error-prone operation without error handling: open\(

22. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `debug_false_positive.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 9: debug_false_positive.py
     - Error-prone operation without error handling: open\(

23. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 423: enforcement/Cursor/scripts/auto-enforcer.py
     - Error-prone operation without error handling: open\(

24. **[VF-ERR-001]** Error-prone operation without error handling: subprocess\.(run|call|Popen)
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/pr_creator.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 266: enforcement/Cursor/scripts/veroscore_v3/pr_creator.py
     - Error-prone operation without error handling: subprocess\.(run|call|Popen)

25. **[VF-ERR-001]** Error-prone operation without error handling: subprocess\.(run|call|Popen)
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/pr_creator.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 274: enforcement/Cursor/scripts/veroscore_v3/pr_creator.py
     - Error-prone operation without error handling: subprocess\.(run|call|Popen)

26. **[VF-ERR-001]** Error-prone operation without error handling: subprocess\.(run|call|Popen)
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/pr_creator.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 333: enforcement/Cursor/scripts/veroscore_v3/pr_creator.py
     - Error-prone operation without error handling: subprocess\.(run|call|Popen)

27. **[VF-ERR-001]** Error-prone operation without error handling: subprocess\.(run|call|Popen)
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/pr_creator.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 471: enforcement/Cursor/scripts/veroscore_v3/pr_creator.py
     - Error-prone operation without error handling: subprocess\.(run|call|Popen)

28. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/tests/test_git_diff_analyzer.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 155: enforcement/Cursor/scripts/veroscore_v3/tests/test_git_diff_analyzer.py
     - Error-prone operation without error handling: open\(

29. **[VF-ERR-001]** Error-prone operation without error handling: subprocess\.(run|call|Popen)
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/tests/test_pr_creator.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 82: enforcement/Cursor/scripts/veroscore_v3/tests/test_pr_creator.py
     - Error-prone operation without error handling: subprocess\.(run|call|Popen)

30. **[VF-ERR-001]** Error-prone operation without error handling: await\s+\w+\(
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/tests/test_scoring_engine_integration.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 101: enforcement/Cursor/scripts/veroscore_v3/tests/test_scoring_engine_integration.py
     - Error-prone operation without error handling: await\s+\w+\(

31. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/checkers/core_checker.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 485: enforcement/checkers/core_checker.py
     - Error-prone operation without error handling: open\(

32. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/checkers/core_checker.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 532: enforcement/checkers/core_checker.py
     - Error-prone operation without error handling: open\(

33. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/checks/date_checker.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 859: enforcement/checks/date_checker.py
     - Error-prone operation without error handling: open\(

34. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/checks/error_handling_checker.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 98: enforcement/checks/error_handling_checker.py
     - Error-prone operation without error handling: open\(

35. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/checks/error_handling_checker.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 100: enforcement/checks/error_handling_checker.py
     - Error-prone operation without error handling: open\(

36. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/checks/error_handling_checker.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 106: enforcement/checks/error_handling_checker.py
     - Error-prone operation without error handling: open\(

37. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/checks/error_handling_checker.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 204: enforcement/checks/error_handling_checker.py
     - Error-prone operation without error handling: open\(

38. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/core/git_utils.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 724: enforcement/core/git_utils.py
     - Error-prone operation without error handling: open\(

39. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/core/session_state.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 269: enforcement/core/session_state.py
     - Error-prone operation without error handling: open\(

40. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/core/session_state.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 308: enforcement/core/session_state.py
     - Error-prone operation without error handling: open\(

41. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `enforcement/tests/analyze_enforcer_report.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 8: enforcement/tests/analyze_enforcer_report.py
     - Error-prone operation without error handling: open\(

42. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `filter_false_positive_violations.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 21: filter_false_positive_violations.py
     - Error-prone operation without error handling: open\(

43. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `filter_false_positive_violations.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 91: filter_false_positive_violations.py
     - Error-prone operation without error handling: open\(

44. **[VF-ERR-001]** Error-prone operation without error handling: subprocess\.(run|call|Popen)
   - **File:** `scripts/compare_to_git.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 11: scripts/compare_to_git.py
     - Error-prone operation without error handling: subprocess\.(run|call|Popen)

45. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `test_date_checker_debug.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 9: test_date_checker_debug.py
     - Error-prone operation without error handling: open\(

46. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `tests/test_date_detection_critical.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 317: tests/test_date_detection_critical.py
     - Error-prone operation without error handling: open\(

47. **[VF-ERR-001]** Error-prone operation without error handling: open\(
   - **File:** `tests/test_date_detection_critical.py`
   - **Rule:** `06-error-resilience.mdc`
   - **Fix Hint:** Add proper error handling with logging and error propagation
   - **Evidence:**
     - Line 355: tests/test_date_detection_critical.py
     - Error-prone operation without error handling: open\(

48. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 343: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

49. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 345: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

50. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 387: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

51. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 389: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

52. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 1168: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

53. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 1338: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

54. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 1354: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

55. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 1364: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

56. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 1408: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

57. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 1427: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

58. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 1435: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

59. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2746: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

60. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2747: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

61. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2749: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

62. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2750: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

63. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2755: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

64. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2756: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

65. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2757: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

66. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2758: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

67. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2759: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

68. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2761: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

69. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2762: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

70. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2763: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

71. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2764: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

72. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2765: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

73. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2769: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

74. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2772: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

75. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2774: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

76. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2775: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

77. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2778: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

78. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2780: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

79. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
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
     - Line 2781: .cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

80. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/fix_archived_dates.py`
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
     - Line 73: .cursor/scripts/fix_archived_dates.py
     - Console logging detected (use structured logging): print\s*\(

81. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/fix_archived_dates.py`
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
     - Line 76: .cursor/scripts/fix_archived_dates.py
     - Console logging detected (use structured logging): print\s*\(

82. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/fix_archived_dates.py`
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
     - Line 84: .cursor/scripts/fix_archived_dates.py
     - Console logging detected (use structured logging): print\s*\(

83. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/logger_util.py`
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
     - Line 160: .cursor/scripts/logger_util.py
     - Console logging detected (use structured logging): print\s*\(

84. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 200: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

85. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 201: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

86. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 202: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

87. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 205: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

88. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 206: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

89. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 212: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

90. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 214: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

91. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 217: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

92. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 218: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

93. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 224: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

94. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 226: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

95. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 229: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

96. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 230: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

97. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 234: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

98. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 235: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

99. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 238: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

100. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 239: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

101. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 241: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

102. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 244: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

103. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 246: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

104. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 247: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

105. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 250: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

106. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 251: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

107. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/pre-flight-check.py`
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
     - Line 265: .cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

108. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 160: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

109. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 162: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

110. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 271: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

111. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 286: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

112. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 288: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

113. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 299: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

114. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 301: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

115. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 324: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

116. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 327: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

117. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 330: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

118. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 335: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

119. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 337: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

120. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/test-enforcement.py`
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
     - Line 338: .cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

121. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `.cursor/scripts/veroscore_v3/detection_functions.py`
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
     - Line 606: .cursor/scripts/veroscore_v3/detection_functions.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

122. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `.cursor/scripts/veroscore_v3/detection_functions.py`
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
     - Line 607: .cursor/scripts/veroscore_v3/detection_functions.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

123. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `.cursor/scripts/veroscore_v3/detection_functions.py`
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
     - Line 608: .cursor/scripts/veroscore_v3/detection_functions.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

124. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `.cursor/scripts/veroscore_v3/detection_functions.py`
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
     - Line 662: .cursor/scripts/veroscore_v3/detection_functions.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

125. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/veroscore_v3/detection_functions.py`
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
     - Line 609: .cursor/scripts/veroscore_v3/detection_functions.py
     - Console logging detected (use structured logging): print\s*\(

126. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `.cursor/scripts/veroscore_v3/scoring_engine.py`
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
     - Line 393: .cursor/scripts/veroscore_v3/scoring_engine.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

127. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `.cursor/scripts/watch-files.py`
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
     - Line 33: .cursor/scripts/watch-files.py
     - Console logging detected (use structured logging): print\s*\(

128. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 14: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

129. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 15: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

130. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 16: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

131. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 17: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

132. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 21: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

133. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 44: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

134. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 45: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

135. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 46: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

136. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 49: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

137. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 56: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

138. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 57: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

139. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 58: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

140. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 94: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

141. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 96: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

142. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 99: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

143. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 102: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

144. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 104: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

145. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 105: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

146. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 106: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

147. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 107: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

148. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 108: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

149. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 111: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

150. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 112: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

151. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 113: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

152. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 115: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

153. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 117: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

154. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 129: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

155. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 130: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

156. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 131: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

157. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 132: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

158. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 134: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

159. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 136: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

160. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations.py`
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
     - Line 139: analyze_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

161. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 14: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

162. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 15: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

163. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 16: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

164. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 17: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

165. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 40: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

166. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 41: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

167. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 42: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

168. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 45: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

169. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 53: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

170. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 54: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

171. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 55: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

172. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 98: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

173. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 100: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

174. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 102: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

175. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 103: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

176. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 104: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

177. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 106: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

178. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 107: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

179. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 109: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

180. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 111: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

181. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 113: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

182. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 115: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

183. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 117: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

184. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 118: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

185. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 119: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

186. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 120: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

187. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 121: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

188. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 125: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

189. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 137: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

190. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 138: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

191. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 141: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

192. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 142: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

193. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 143: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

194. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 145: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

195. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 147: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

196. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_date_violations_detailed.py`
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
     - Line 150: analyze_date_violations_detailed.py
     - Console logging detected (use structured logging): print\s*\(

197. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 29: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

198. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 36: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

199. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 37: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

200. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 38: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

201. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 39: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

202. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 40: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

203. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 41: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

204. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 80: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

205. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 81: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

206. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 82: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

207. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 85: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

208. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 86: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

209. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 87: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

210. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 91: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

211. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 92: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

212. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 93: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

213. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 94: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

214. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 95: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

215. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 101: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

216. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 104: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

217. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 106: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

218. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 109: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

219. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 110: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

220. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 111: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

221. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 112: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

222. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 113: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

223. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 125: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

224. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 128: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

225. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 129: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

226. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 130: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

227. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 142: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

228. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 143: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

229. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_scanned_file_sizes.py`
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
     - Line 151: analyze_scanned_file_sizes.py
     - Console logging detected (use structured logging): print\s*\(

230. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 19: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

231. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 20: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

232. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 21: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

233. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 22: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

234. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 23: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

235. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 24: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

236. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 26: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

237. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 27: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

238. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 28: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

239. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 30: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

240. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 32: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

241. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 33: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

242. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 34: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

243. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 36: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

244. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 38: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

245. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 39: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

246. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 40: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

247. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `analyze_violations.py`
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
     - Line 42: analyze_violations.py
     - Console logging detected (use structured logging): print\s*\(

248. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 10: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

249. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 18: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

250. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 19: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

251. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 62: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

252. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 63: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

253. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 64: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

254. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 65: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

255. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 66: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

256. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 70: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

257. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 73: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

258. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 74: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

259. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 78: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

260. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 85: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

261. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 87: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

262. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 91: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

263. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 100: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

264. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 102: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

265. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 103: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

266. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 104: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

267. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 105: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

268. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 106: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

269. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_current_session_false_positives.py`
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
     - Line 107: check_current_session_false_positives.py
     - Console logging detected (use structured logging): print\s*\(

270. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations.py`
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
     - Line 7: check_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

271. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations.py`
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
     - Line 18: check_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

272. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations.py`
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
     - Line 19: check_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

273. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations.py`
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
     - Line 20: check_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

274. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations.py`
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
     - Line 21: check_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

275. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations.py`
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
     - Line 25: check_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

276. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations.py`
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
     - Line 27: check_date_violations.py
     - Console logging detected (use structured logging): print\s*\(

277. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 13: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

278. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 14: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

279. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 15: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

280. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 16: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

281. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 35: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

282. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 36: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

283. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 37: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

284. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 41: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

285. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 78: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

286. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 79: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

287. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 80: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

288. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 81: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

289. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 82: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

290. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 83: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

291. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 86: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

292. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 87: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

293. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 88: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

294. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 95: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

295. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 98: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

296. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 99: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

297. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 100: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

298. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 107: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

299. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 122: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

300. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 123: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

301. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 124: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

302. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 125: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

303. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 126: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

304. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 127: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

305. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 130: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

306. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_date_violations_legitimate.py`
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
     - Line 133: check_date_violations_legitimate.py
     - Console logging detected (use structured logging): print\s*\(

307. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 11: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

308. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 34: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

309. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 36: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

310. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 38: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

311. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 40: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

312. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 41: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

313. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 43: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

314. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 45: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

315. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 47: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

316. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 51: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

317. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 53: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

318. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 54: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

319. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_diagnostic.py`
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
     - Line 55: check_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

320. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 14: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

321. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 17: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

322. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 18: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

323. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 21: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

324. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 25: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

325. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 26: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

326. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 27: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

327. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 28: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

328. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 32: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

329. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 33: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

330. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 34: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

331. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 35: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

332. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_line_numbers.py`
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
     - Line 37: check_line_numbers.py
     - Console logging detected (use structured logging): print\s*\(

333. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_session_violations.py`
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
     - Line 14: check_session_violations.py
     - Console logging detected (use structured logging): print\s*\(

334. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_session_violations.py`
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
     - Line 15: check_session_violations.py
     - Console logging detected (use structured logging): print\s*\(

335. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_session_violations.py`
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
     - Line 19: check_session_violations.py
     - Console logging detected (use structured logging): print\s*\(

336. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_session_violations.py`
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
     - Line 20: check_session_violations.py
     - Console logging detected (use structured logging): print\s*\(

337. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_session_violations.py`
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
     - Line 21: check_session_violations.py
     - Console logging detected (use structured logging): print\s*\(

338. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_session_violations.py`
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
     - Line 30: check_session_violations.py
     - Console logging detected (use structured logging): print\s*\(

339. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_session_violations.py`
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
     - Line 31: check_session_violations.py
     - Console logging detected (use structured logging): print\s*\(

340. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_session_violations.py`
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
     - Line 33: check_session_violations.py
     - Console logging detected (use structured logging): print\s*\(

341. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 13: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

342. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 14: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

343. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 15: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

344. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 16: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

345. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 17: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

346. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 18: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

347. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 26: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

348. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 28: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

349. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 31: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

350. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 35: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

351. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 36: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

352. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 37: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

353. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 40: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

354. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `check_violation_count.py`
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
     - Line 55: check_violation_count.py
     - Console logging detected (use structured logging): print\s*\(

355. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 15: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

356. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 16: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

357. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 26: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

358. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 27: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

359. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 28: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

360. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 29: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

361. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 30: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

362. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 31: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

363. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 35: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

364. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 39: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

365. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 46: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

366. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 48: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

367. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 49: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

368. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 51: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

369. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 52: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

370. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 56: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

371. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 57: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

372. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 59: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

373. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `debug_false_positive.py`
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
     - Line 60: debug_false_positive.py
     - Console logging detected (use structured logging): print\s*\(

374. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 136: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

375. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 137: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

376. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 138: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

377. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 139: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

378. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 144: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

379. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 145: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

380. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 146: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

381. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 147: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

382. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 148: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

383. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 149: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

384. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 150: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

385. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 151: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

386. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 155: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

387. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 156: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

388. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 158: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

389. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 159: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

390. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 163: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

391. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 164: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

392. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 165: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

393. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 167: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

394. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 168: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

395. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 172: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

396. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 173: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

397. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 174: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

398. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 176: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

399. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 177: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

400. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 180: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

401. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 182: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

402. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 184: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

403. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/check_source_readiness.py`
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
     - Line 185: docs/bibles/check_source_readiness.py
     - Console logging detected (use structured logging): print\s*\(

404. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 79: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

405. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 85: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

406. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 89: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

407. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 111: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

408. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 120: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

409. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 150: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

410. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 151: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

411. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 152: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

412. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 167: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

413. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 178: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

414. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 179: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

415. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 180: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

416. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 187: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

417. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 191: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

418. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/fix_chapter_ordering.py`
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
     - Line 192: docs/bibles/fix_chapter_ordering.py
     - Console logging detected (use structured logging): print\s*\(

419. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_config.py`
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
     - Line 9: docs/bibles/validate_config.py
     - Console logging detected (use structured logging): print\s*\(

420. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_config.py`
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
     - Line 10: docs/bibles/validate_config.py
     - Console logging detected (use structured logging): print\s*\(

421. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_config.py`
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
     - Line 11: docs/bibles/validate_config.py
     - Console logging detected (use structured logging): print\s*\(

422. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_config.py`
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
     - Line 12: docs/bibles/validate_config.py
     - Console logging detected (use structured logging): print\s*\(

423. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_config.py`
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
     - Line 13: docs/bibles/validate_config.py
     - Console logging detected (use structured logging): print\s*\(

424. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 158: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

425. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 162: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

426. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 165: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

427. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 168: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

428. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 172: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

429. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 182: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

430. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 195: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

431. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 196: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

432. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 197: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

433. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 198: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

434. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 199: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

435. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 200: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

436. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 201: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

437. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 205: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

438. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 206: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

439. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 207: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

440. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 210: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

441. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 212: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

442. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 216: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

443. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 217: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

444. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 218: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

445. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 221: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

446. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 223: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

447. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 228: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

448. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 229: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

449. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 230: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

450. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 231: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

451. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 233: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

452. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 234: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

453. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `docs/bibles/validate_split_integrity.py`
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
     - Line 235: docs/bibles/validate_split_integrity.py
     - Console logging detected (use structured logging): print\s*\(

454. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 344: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

455. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 346: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

456. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 388: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

457. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 390: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

458. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 1094: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

459. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 1264: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

460. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 1280: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

461. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 1290: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

462. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 1334: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

463. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 1353: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

464. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 1361: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

465. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2672: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

466. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2673: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

467. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2675: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

468. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2676: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

469. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2681: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

470. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2682: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

471. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2683: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

472. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2684: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

473. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2685: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

474. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2687: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

475. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2688: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

476. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2689: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

477. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2690: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

478. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2691: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

479. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2695: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

480. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2698: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

481. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2700: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

482. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2701: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

483. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2704: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

484. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2706: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

485. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/auto-enforcer.py`
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
     - Line 2707: enforcement/Cursor/scripts/auto-enforcer.py
     - Console logging detected (use structured logging): print\s*\(

486. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/fix_archived_dates.py`
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
     - Line 73: enforcement/Cursor/scripts/fix_archived_dates.py
     - Console logging detected (use structured logging): print\s*\(

487. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/fix_archived_dates.py`
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
     - Line 76: enforcement/Cursor/scripts/fix_archived_dates.py
     - Console logging detected (use structured logging): print\s*\(

488. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/fix_archived_dates.py`
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
     - Line 84: enforcement/Cursor/scripts/fix_archived_dates.py
     - Console logging detected (use structured logging): print\s*\(

489. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/logger_util.py`
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
     - Line 160: enforcement/Cursor/scripts/logger_util.py
     - Console logging detected (use structured logging): print\s*\(

490. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 200: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

491. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 201: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

492. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 202: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

493. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 205: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

494. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 206: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

495. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 212: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

496. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 214: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

497. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 217: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

498. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 218: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

499. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 224: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

500. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 226: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

501. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 229: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

502. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 230: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

503. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 234: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

504. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 235: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

505. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 238: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

506. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 239: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

507. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 241: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

508. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 244: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

509. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 246: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

510. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 247: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

511. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 250: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

512. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 251: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

513. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/pre-flight-check.py`
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
     - Line 265: enforcement/Cursor/scripts/pre-flight-check.py
     - Console logging detected (use structured logging): print\s*\(

514. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 160: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

515. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 162: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

516. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 271: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

517. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 286: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

518. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 288: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

519. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 299: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

520. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 301: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

521. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 324: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

522. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 327: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

523. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 330: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

524. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 335: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

525. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 337: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

526. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/test-enforcement.py`
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
     - Line 338: enforcement/Cursor/scripts/test-enforcement.py
     - Console logging detected (use structured logging): print\s*\(

527. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/detection_functions.py`
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
     - Line 606: enforcement/Cursor/scripts/veroscore_v3/detection_functions.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

528. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/detection_functions.py`
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
     - Line 607: enforcement/Cursor/scripts/veroscore_v3/detection_functions.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

529. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/detection_functions.py`
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
     - Line 608: enforcement/Cursor/scripts/veroscore_v3/detection_functions.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

530. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/detection_functions.py`
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
     - Line 662: enforcement/Cursor/scripts/veroscore_v3/detection_functions.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

531. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/detection_functions.py`
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
     - Line 609: enforcement/Cursor/scripts/veroscore_v3/detection_functions.py
     - Console logging detected (use structured logging): print\s*\(

532. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/Cursor/scripts/veroscore_v3/scoring_engine.py`
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
     - Line 393: enforcement/Cursor/scripts/veroscore_v3/scoring_engine.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

533. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/Cursor/scripts/watch-files.py`
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
     - Line 33: enforcement/Cursor/scripts/watch-files.py
     - Console logging detected (use structured logging): print\s*\(

534. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/autofix_suggestions.py`
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
     - Line 191: enforcement/autofix_suggestions.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

535. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/autofix_suggestions.py`
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
     - Line 197: enforcement/autofix_suggestions.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

536. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 28: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

537. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 41: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

538. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 43: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

539. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 44: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

540. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 46: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

541. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 47: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

542. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 52: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

543. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 53: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

544. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 54: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

545. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 55: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

546. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 56: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

547. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 58: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

548. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/check_secret_violations.py`
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
     - Line 61: enforcement/check_secret_violations.py
     - Console logging detected (use structured logging): print\s*\(

549. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/core_checker.py`
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
     - Line 115: enforcement/checkers/core_checker.py
     - Console logging detected (use structured logging): print\s*\(

550. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/core_checker.py`
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
     - Line 122: enforcement/checkers/core_checker.py
     - Console logging detected (use structured logging): print\s*\(

551. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/core_checker.py`
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
     - Line 141: enforcement/checkers/core_checker.py
     - Console logging detected (use structured logging): print\s*\(

552. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/core_checker.py`
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
     - Line 144: enforcement/checkers/core_checker.py
     - Console logging detected (use structured logging): print\s*\(

553. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/core_checker.py`
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
     - Line 149: enforcement/checkers/core_checker.py
     - Console logging detected (use structured logging): print\s*\(

554. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/core_checker.py`
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
     - Line 159: enforcement/checkers/core_checker.py
     - Console logging detected (use structured logging): print\s*\(

555. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/core_checker.py`
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
     - Line 161: enforcement/checkers/core_checker.py
     - Console logging detected (use structured logging): print\s*\(

556. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/core_checker.py`
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
     - Line 164: enforcement/checkers/core_checker.py
     - Console logging detected (use structured logging): print\s*\(

557. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/core_checker.py`
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
     - Line 217: enforcement/checkers/core_checker.py
     - Console logging detected (use structured logging): print\s*\(

558. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/core_checker.py`
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
     - Line 220: enforcement/checkers/core_checker.py
     - Console logging detected (use structured logging): print\s*\(

559. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/core_checker.py`
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
     - Line 412: enforcement/checkers/core_checker.py
     - Console logging detected (use structured logging): print\s*\(

560. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/core_checker.py`
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
     - Line 418: enforcement/checkers/core_checker.py
     - Console logging detected (use structured logging): print\s*\(

561. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/checkers/observability_checker.py`
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
     - Line 42: enforcement/checkers/observability_checker.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

562. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/checkers/observability_checker.py`
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
     - Line 114: enforcement/checkers/observability_checker.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

563. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/checkers/observability_checker.py`
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
     - Line 130: enforcement/checkers/observability_checker.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

564. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 30: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

565. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 55: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

566. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 57: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

567. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 59: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

568. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 65: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

569. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 74: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

570. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 84: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

571. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 86: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

572. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 89: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

573. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 95: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

574. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 112: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

575. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 126: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

576. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 129: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

577. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 131: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

578. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 136: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

579. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 142: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

580. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 147: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

581. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 163: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

582. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 167: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

583. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 170: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

584. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 175: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

585. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 181: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

586. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 182: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

587. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 183: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

588. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 184: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

589. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 199: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

590. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 204: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

591. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 205: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

592. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 206: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

593. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 213: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

594. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 215: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

595. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checkers/test_checkers.py`
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
     - Line 216: enforcement/checkers/test_checkers.py
     - Console logging detected (use structured logging): print\s*\(

596. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 981: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

597. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 983: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

598. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 985: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

599. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 987: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

600. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 1010: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

601. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 1018: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

602. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 1025: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

603. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 1045: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

604. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 1046: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

605. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 1057: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

606. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 1059: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

607. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 1210: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

608. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 1218: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

609. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 1229: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

610. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/checks/date_checker.py`
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
     - Line 1316: enforcement/checks/date_checker.py
     - Console logging detected (use structured logging): print\s*\(

611. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 68: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

612. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 69: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

613. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 70: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

614. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 73: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

615. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 74: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

616. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 76: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

617. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 80: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

618. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 83: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

619. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 87: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

620. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 89: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

621. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 93: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

622. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 100: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

623. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 101: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

624. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 102: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

625. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 103: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

626. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 106: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

627. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 110: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

628. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 111: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

629. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 112: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

630. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 117: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

631. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 118: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

632. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 123: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

633. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 124: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

634. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 126: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

635. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 128: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

636. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 129: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

637. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 132: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

638. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 135: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

639. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 137: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

640. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 141: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

641. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 144: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

642. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 145: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

643. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 146: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

644. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 153: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

645. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 170: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

646. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 173: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

647. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 175: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

648. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 181: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

649. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 184: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

650. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 221: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

651. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 224: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

652. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 225: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

653. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 229: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

654. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/fix_loop.py`
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
     - Line 232: enforcement/fix_loop.py
     - Console logging detected (use structured logging): print\s*\(

655. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 68: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

656. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 69: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

657. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 70: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

658. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 71: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

659. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 80: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

660. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 87: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

661. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 175: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

662. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 179: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

663. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 180: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

664. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 181: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

665. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 182: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

666. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 183: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

667. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 186: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

668. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 188: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

669. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 190: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

670. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 192: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

671. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/llm_caller.py`
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
     - Line 193: enforcement/llm_caller.py
     - Console logging detected (use structured logging): print\s*\(

672. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/report_generator.py`
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
     - Line 241: enforcement/report_generator.py
     - Console logging detected (use structured logging): print\s*\(

673. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/report_generator.py`
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
     - Line 243: enforcement/report_generator.py
     - Console logging detected (use structured logging): print\s*\(

674. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/report_generator.py`
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
     - Line 259: enforcement/report_generator.py
     - Console logging detected (use structured logging): print\s*\(

675. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/report_generator.py`
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
     - Line 261: enforcement/report_generator.py
     - Console logging detected (use structured logging): print\s*\(

676. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/report_generator.py`
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
     - Line 354: enforcement/report_generator.py
     - Console logging detected (use structured logging): print\s*\(

677. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/report_generator.py`
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
     - Line 355: enforcement/report_generator.py
     - Console logging detected (use structured logging): print\s*\(

678. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/reporting/context_bundle_builder.py`
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
     - Line 212: enforcement/reporting/context_bundle_builder.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

679. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `enforcement/reporting/context_bundle_builder.py`
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
     - Line 342: enforcement/reporting/context_bundle_builder.py
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

680. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/two_brain_integration.py`
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
     - Line 290: enforcement/two_brain_integration.py
     - Console logging detected (use structured logging): print\s*\(

681. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/two_brain_integration.py`
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
     - Line 291: enforcement/two_brain_integration.py
     - Console logging detected (use structured logging): print\s*\(

682. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/two_brain_integration.py`
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
     - Line 292: enforcement/two_brain_integration.py
     - Console logging detected (use structured logging): print\s*\(

683. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/two_brain_integration.py`
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
     - Line 293: enforcement/two_brain_integration.py
     - Console logging detected (use structured logging): print\s*\(

684. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/two_brain_integration.py`
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
     - Line 294: enforcement/two_brain_integration.py
     - Console logging detected (use structured logging): print\s*\(

685. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `enforcement/two_brain_integration.py`
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
     - Line 295: enforcement/two_brain_integration.py
     - Console logging detected (use structured logging): print\s*\(

686. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `filter_false_positive_violations.py`
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
     - Line 17: filter_false_positive_violations.py
     - Console logging detected (use structured logging): print\s*\(

687. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `filter_false_positive_violations.py`
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
     - Line 28: filter_false_positive_violations.py
     - Console logging detected (use structured logging): print\s*\(

688. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `filter_false_positive_violations.py`
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
     - Line 29: filter_false_positive_violations.py
     - Console logging detected (use structured logging): print\s*\(

689. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `filter_false_positive_violations.py`
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
     - Line 30: filter_false_positive_violations.py
     - Console logging detected (use structured logging): print\s*\(

690. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `filter_false_positive_violations.py`
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
     - Line 74: filter_false_positive_violations.py
     - Console logging detected (use structured logging): print\s*\(

691. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `filter_false_positive_violations.py`
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
     - Line 75: filter_false_positive_violations.py
     - Console logging detected (use structured logging): print\s*\(

692. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `filter_false_positive_violations.py`
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
     - Line 76: filter_false_positive_violations.py
     - Console logging detected (use structured logging): print\s*\(

693. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `filter_false_positive_violations.py`
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
     - Line 77: filter_false_positive_violations.py
     - Console logging detected (use structured logging): print\s*\(

694. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `filter_false_positive_violations.py`
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
     - Line 89: filter_false_positive_violations.py
     - Console logging detected (use structured logging): print\s*\(

695. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `filter_false_positive_violations.py`
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
     - Line 94: filter_false_positive_violations.py
     - Console logging detected (use structured logging): print\s*\(

696. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `filter_false_positive_violations.py`
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
     - Line 95: filter_false_positive_violations.py
     - Console logging detected (use structured logging): print\s*\(

697. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `filter_false_positive_violations.py`
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
     - Line 102: filter_false_positive_violations.py
     - Console logging detected (use structured logging): print\s*\(

698. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 21: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

699. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 22: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

700. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 56: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

701. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 57: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

702. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 58: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

703. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 81: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

704. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 83: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

705. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 84: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

706. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 92: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

707. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 93: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

708. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 94: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

709. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 97: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

710. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 98: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

711. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 99: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

712. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 100: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

713. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 132: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

714. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 139: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

715. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `find_large_files.py`
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
     - Line 141: find_large_files.py
     - Console logging detected (use structured logging): print\s*\(

716. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `frontend/src/utils/index.ts`
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
     - Line 124: frontend/src/utils/index.ts
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

717. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `frontend/src/utils/index.ts`
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
     - Line 132: frontend/src/utils/index.ts
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

718. **[VF-LOG-001]** Console logging detected (use structured logging): console\.(log|error|warn|debug)
   - **File:** `frontend/src/utils/index.ts`
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
     - Line 140: frontend/src/utils/index.ts
     - Console logging detected (use structured logging): console\.(log|error|warn|debug)

719. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 32: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

720. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 33: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

721. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 34: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

722. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 38: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

723. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 45: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

724. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 46: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

725. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 47: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

726. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 48: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

727. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 49: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

728. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 51: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

729. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 54: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

730. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 56: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

731. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 57: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

732. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 62: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

733. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 66: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

734. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 68: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

735. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `parse_diagnostic.py`
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
     - Line 69: parse_diagnostic.py
     - Console logging detected (use structured logging): print\s*\(

736. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 32: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

737. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 33: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

738. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 34: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

739. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 35: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

740. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 50: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

741. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 53: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

742. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 56: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

743. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 59: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

744. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 62: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

745. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 63: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

746. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 64: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

747. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 65: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

748. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 66: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

749. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 67: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

750. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 68: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

751. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 69: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

752. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 72: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

753. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 74: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

754. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/check_files_simple.py`
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
     - Line 76: scripts/check_files_simple.py
     - Console logging detected (use structured logging): print\s*\(

755. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 55: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

756. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 56: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

757. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 57: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

758. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 58: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

759. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 67: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

760. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 68: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

761. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 96: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

762. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 97: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

763. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 98: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

764. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 99: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

765. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 101: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

766. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 102: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

767. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 103: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

768. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 104: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

769. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 105: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

770. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 106: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

771. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 109: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

772. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 111: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

773. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 112: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

774. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 113: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

775. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 115: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

776. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 122: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

777. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 123: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

778. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 124: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

779. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 125: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

780. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 126: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

781. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 127: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

782. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 129: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

783. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `scripts/compare_to_git.py`
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
     - Line 131: scripts/compare_to_git.py
     - Console logging detected (use structured logging): print\s*\(

784. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 25: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

785. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 51: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

786. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 52: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

787. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 53: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

788. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 54: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

789. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 55: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

790. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 77: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

791. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 79: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

792. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 80: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

793. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 83: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

794. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 84: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

795. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 85: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

796. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 112: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

797. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 113: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

798. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `show_large_files.py`
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
     - Line 118: show_large_files.py
     - Console logging detected (use structured logging): print\s*\(

799. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_batch_status.py`
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
     - Line 13: test_batch_status.py
     - Console logging detected (use structured logging): print\s*\(

800. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_batch_status.py`
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
     - Line 14: test_batch_status.py
     - Console logging detected (use structured logging): print\s*\(

801. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_batch_status.py`
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
     - Line 15: test_batch_status.py
     - Console logging detected (use structured logging): print\s*\(

802. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_batch_status.py`
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
     - Line 24: test_batch_status.py
     - Console logging detected (use structured logging): print\s*\(

803. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_batch_status.py`
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
     - Line 27: test_batch_status.py
     - Console logging detected (use structured logging): print\s*\(

804. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_debug.py`
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
     - Line 16: test_date_checker_debug.py
     - Console logging detected (use structured logging): print\s*\(

805. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_debug.py`
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
     - Line 17: test_date_checker_debug.py
     - Console logging detected (use structured logging): print\s*\(

806. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_debug.py`
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
     - Line 18: test_date_checker_debug.py
     - Console logging detected (use structured logging): print\s*\(

807. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_debug.py`
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
     - Line 23: test_date_checker_debug.py
     - Console logging detected (use structured logging): print\s*\(

808. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_debug.py`
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
     - Line 24: test_date_checker_debug.py
     - Console logging detected (use structured logging): print\s*\(

809. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_debug.py`
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
     - Line 27: test_date_checker_debug.py
     - Console logging detected (use structured logging): print\s*\(

810. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_debug.py`
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
     - Line 41: test_date_checker_debug.py
     - Console logging detected (use structured logging): print\s*\(

811. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_debug.py`
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
     - Line 42: test_date_checker_debug.py
     - Console logging detected (use structured logging): print\s*\(

812. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_debug.py`
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
     - Line 43: test_date_checker_debug.py
     - Console logging detected (use structured logging): print\s*\(

813. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_debug.py`
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
     - Line 44: test_date_checker_debug.py
     - Console logging detected (use structured logging): print\s*\(

814. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_debug.py`
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
     - Line 45: test_date_checker_debug.py
     - Console logging detected (use structured logging): print\s*\(

815. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 18: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

816. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 19: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

817. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 26: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

818. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 27: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

819. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 28: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

820. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 29: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

821. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 30: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

822. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 33: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

823. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 35: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

824. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 37: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

825. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 38: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

826. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 39: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

827. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_date_checker_fix.py`
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
     - Line 40: test_date_checker_fix.py
     - Console logging detected (use structured logging): print\s*\(

828. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_hardcoded_check.py`
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
     - Line 5: test_hardcoded_check.py
     - Console logging detected (use structured logging): print\s*\(

829. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_hardcoded_check.py`
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
     - Line 6: test_hardcoded_check.py
     - Console logging detected (use structured logging): print\s*\(

830. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_hardcoded_check.py`
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
     - Line 9: test_hardcoded_check.py
     - Console logging detected (use structured logging): print\s*\(

831. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_hardcoded_check.py`
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
     - Line 10: test_hardcoded_check.py
     - Console logging detected (use structured logging): print\s*\(

832. **[VF-LOG-001]** Console logging detected (use structured logging): print\s*\(
   - **File:** `test_hardcoded_check.py`
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
     - Line 11: test_hardcoded_check.py
     - Console logging detected (use structured logging): print\s*\(

---

## Summary

### Current Session (Gates Task Completion)
- **Blocking:** 3
- **Warnings:** 829
- **Action Required:** Fix all BLOCKING violations before proceeding

### Baseline (Historical - For Visibility)
- **Blocking:** 0
- **Warnings:** 0

---

**Generated by:** VeroField Auto-Enforcer  
**See Also:** `ENFORCER_REPORT.json` for full details
