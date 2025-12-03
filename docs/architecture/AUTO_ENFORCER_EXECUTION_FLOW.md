# Auto-Enforcer Execution Flow - Complete Guide

**Last Updated:** 2025-12-02  
**Reference:** `.cursor/scripts/auto-enforcer.py`, `.cursor/scripts/watch-files.py`

---

## Executive Summary

The auto-enforcer is a **Python-based compliance checking system** that runs automatically when files change, manually via command line, or as part of VS Code tasks. It performs comprehensive rule compliance checks and updates context recommendations.

**Key Characteristics:**
- ✅ **Event-Driven:** Triggers on file changes (via file watcher)
- ✅ **Manual Execution:** Can be run directly via command line
- ✅ **VS Code Integration:** Auto-starts on folder open (optional)
- ✅ **Background Process:** Runs continuously when file watcher is active
- ✅ **Debounced:** 2-second delay prevents excessive runs

---

## Execution Modes

### 1. Automatic Execution (File Watcher) 🔄

**Primary Method:** Most common way the enforcer runs.

#### How It Works

```
File Change Detected
    │
    ▼
┌─────────────────┐
│  File Watcher   │ (watch-files.py)
│  Detects Change  │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Debounce Timer │ (2 seconds)
│  Prevents Rapid  │
│  Re-runs         │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Subprocess     │
│  Runs Enforcer  │
│  auto-enforcer  │
│  .py            │
└─────────────────┘
```

#### Trigger Conditions

**Watched Directories:**
- `apps/` - Backend services
- `libs/` - Shared libraries
- `frontend/` - Frontend code
- `VeroFieldMobile/` - Mobile app
- `.cursor/memory-bank/` - Memory Bank files
- `.cursor/rules/` - Rule files

**File Events:**
- `modified` - File edited
- `created` - New file created
- `moved` - File moved/renamed

**Skipped Files:**
- `.cursor/enforcement/` (to avoid recursion)
- Binary files (`.pyc`, `.pyo`, `.dll`, `.exe`, etc.)
- Build directories (`node_modules`, `.git`, `__pycache__`, `dist`, `build`)

#### Debouncing

**Why:** Prevents excessive enforcement runs when multiple files change rapidly.

**How:**
- 2-second delay after last file change
- Timer resets on each new change
- Only triggers enforcer after 2 seconds of inactivity

**Example:**
```
Time 0s: File1.py modified → Timer starts (2s)
Time 0.5s: File2.py modified → Timer resets (2s)
Time 1s: File3.py modified → Timer resets (2s)
Time 3s: Timer expires → Enforcer runs (checks all 3 files)
```

#### Starting the File Watcher

**Manual Start:**
```bash
python .cursor/scripts/watch-files.py
```

**VS Code Auto-Start:**
- Task: "Start Auto-Enforcement System"
- Runs automatically on folder open (if enabled)
- Background process (doesn't block VS Code)

**Configuration:** `.vscode/tasks.json`
```json
{
  "label": "Start Auto-Enforcement System",
  "command": "python ${workspaceFolder}/.cursor/scripts/watch-files.py",
  "runOptions": {
    "runOn": "folderOpen"
  },
  "isBackground": true
}
```

---

### 2. Manual Execution 🖱️

**When to Use:**
- One-time compliance check
- Testing enforcement rules
- Pre-commit validation
- CI/CD pipeline integration

#### Command Line

```bash
# Basic execution
python .cursor/scripts/auto-enforcer.py

# With user message (for task assignment detection)
python .cursor/scripts/auto-enforcer.py --user-message "Add new feature"
```

#### VS Code Task

- Task: "Run Enforcement Check"
- Shortcut: Run task from VS Code command palette
- Command: `python .cursor/scripts/auto-enforcer.py`

---

### 3. VS Code Auto-Start 🚀

**When:** Automatically on folder open (if task enabled)

**How:**
1. VS Code opens project folder
2. Task "Start Auto-Enforcement System" runs automatically
3. File watcher starts in background
4. Enforcer runs on file changes

**Configuration:** `.vscode/tasks.json` (see above)

---

## Execution Flow (Step-by-Step)

### Phase 1: Initialization

```
┌─────────────────────────────────────────────────────────────┐
│                    INITIALIZATION PHASE                       │
└─────────────────────────────────────────────────────────────┘

1. Parse Command-Line Arguments
   ├── --user-message (optional)
   └── Default: None

2. Detect Console Encoding
   ├── Windows: Check for UTF-8 support
   ├── Use ASCII-safe alternatives if needed
   └── Set emoji display mode

3. Create VeroFieldEnforcer Instance
   ├── Initialize project paths
   ├── Load or create session
   ├── Initialize predictive context management (if available)
   └── Load agent response from file (if exists)
```

**Code Path:**
```python
# main() function
enforcer = VeroFieldEnforcer()  # Initialization happens here
```

**What Happens in `__init__`:**
1. **Session Management:**
   - Load existing session from `session.json`
   - Or create new session with UUID
   - Track session start time

2. **Predictive Context Management:**
   - Initialize `TaskDetector` (if available)
   - Initialize `ContextLoader` (if available)
   - Initialize `WorkflowTracker` (if available)
   - Initialize `ContextPredictor` (if available)
   - Initialize `ContextPreloader` (if available)
   - Initialize `AgentResponseParser` (if available)
   - Initialize `SessionSequenceTracker` (if available)

3. **Agent Response Loading:**
   - Check for `.cursor/enforcement/agent_response.txt`
   - Load if file exists and is recent (< 10 minutes old)
   - Store for Step 0.5 and Step 4.5 verification

---

### Phase 2: Compliance Checks

```
┌─────────────────────────────────────────────────────────────┐
│                  COMPLIANCE CHECKS PHASE                      │
└─────────────────────────────────────────────────────────────┘

1. Update Context Recommendations (FIRST)
   ├── Generate fresh recommendations.md
   ├── Update context_enforcement.mdc
   ├── Update dashboard.md
   └── Generate context-id for tracking

2. Pre-Flight Check
   ├── Verify context state validity
   ├── Check for blocking conditions
   └── Return False if blocked

3. Clear Previous Violations
   └── Reset violations list for this run

4. Count Changed Files
   ├── Get list of changed files
   ├── If >100 files: Skip non-critical checks
   └── Optimize for large changesets

5. Run Critical Checks (Always)
   ├── Memory Bank compliance
   ├── Security compliance
   ├── Active Context update
   └── Context Management compliance

6. Run Non-Critical Checks (If <100 files)
   ├── Hardcoded dates
   ├── Error handling
   ├── Structured logging
   ├── Python Bible compliance
   └── Bug logging
```

**Code Path:**
```python
# run() method
success = self.run_all_checks(user_message=user_message)
return 0 if success else 1
```

**What Happens in `run_all_checks()`:**

1. **Update Context Recommendations (FIRST):**
   ```python
   self._update_context_recommendations(user_message=user_message)
   ```
   - Detects current task from file changes
   - Predicts next tasks
   - Generates recommendations.md
   - Updates context_enforcement.mdc
   - Updates dashboard.md

2. **Pre-Flight Check:**
   ```python
   if not self._pre_flight_check():
       return False  # Block execution
   ```
   - Verifies context state validity
   - Checks for blocking conditions

3. **Run Checks:**
   ```python
   # Critical checks (always run)
   self.check_memory_bank()
   self.check_security_compliance()
   self.check_active_context()
   self.check_context_management_compliance()
   
   # Non-critical checks (skip if >100 files)
   if not skip_non_critical:
       self.check_hardcoded_dates()
       self.check_error_handling()
       self.check_logging()
       self.check_python_bible()
       self.check_bug_logging()
   ```

---

### Phase 3: Violation Processing

```
┌─────────────────────────────────────────────────────────────┐
│                VIOLATION PROCESSING PHASE                    │
└─────────────────────────────────────────────────────────────┘

1. Categorize Violations
   ├── Current Session (🔧) - Auto-fixable
   └── Historical (📋) - Require human input

2. Auto-Fix Violations (Current Session Only)
   ├── Date corrections
   ├── Error handling additions
   ├── Logging improvements
   └── File path corrections

3. Generate Status Files
   ├── AGENT_STATUS.md
   ├── ENFORCEMENT_BLOCK.md (if blocked)
   ├── VIOLATIONS.md
   └── AUTO_FIXES.md

4. Update Session State
   ├── Record violations
   ├── Record auto-fixes
   ├── Update last_check timestamp
   └── Save session.json
```

**What Happens:**

1. **Violation Categorization:**
   - Check if violation was introduced in current session
   - Scope as "current_session" or "historical"
   - Current session violations are auto-fixable
   - Historical violations require human input

2. **Auto-Fix:**
   ```python
   if violation.session_scope == "current_session":
       auto_fix = self._auto_fix_violation(violation)
       if auto_fix:
           self.session.auto_fixes.append(auto_fix)
   ```

3. **Status File Generation:**
   - `AGENT_STATUS.md`: Current compliance status
   - `ENFORCEMENT_BLOCK.md`: Blocking message (if violations detected)
   - `VIOLATIONS.md`: Historical violation log
   - `AUTO_FIXES.md`: Auto-fix tracking

---

### Phase 4: Context Recommendations Update

```
┌─────────────────────────────────────────────────────────────┐
│          CONTEXT RECOMMENDATIONS UPDATE PHASE                 │
└─────────────────────────────────────────────────────────────┘

1. Detect Current Task
   ├── Analyze file changes
   ├── Detect task type (edit_code, run_tests, etc.)
   └── Extract metadata (file types, confidence)

2. Track Workflow
   ├── Group tasks by file patterns
   ├── Detect workflow boundaries
   └── Track task sequences

3. Predict Next Tasks
   ├── Session sequence (3x weight)
   ├── Conditional predictions (2x weight)
   ├── Static patterns (1x weight)
   └── Dynamic stats (log-scaled)

4. Generate Recommendations
   ├── recommendations.md
   ├── context_enforcement.mdc
   └── dashboard.md
```

**What Happens:**

1. **Task Detection:**
   ```python
   task_detection = self.task_detector.detect_task(
       agent_message=user_message or "File changes detected",
       files=changed_files
   )
   ```

2. **Workflow Tracking:**
   ```python
   self.workflow_tracker.record_task(
       task_type=task_detection.primary_task,
       files=changed_files,
       timestamp=now
   )
   ```

3. **Prediction:**
   ```python
   predictions = self.predictor.predict_next_tasks(
       current_task=task_detection,
       session_sequence_context=session_context
   )
   ```

4. **Recommendations Generation:**
   ```python
   self.preloader.generate_recommendations(
       current_task=task_detection,
       predictions=predictions
   )
   ```

---

## Complete Execution Timeline

```
Time 0.0s: File change detected
Time 0.0s: Debounce timer starts (2s)
Time 2.0s: Timer expires → Enforcer starts

Time 2.0s: [INITIALIZATION]
  ├── Parse arguments
  ├── Create VeroFieldEnforcer instance
  ├── Load session
  ├── Initialize context management
  └── Load agent response
  Duration: ~0.1-0.5s

Time 2.5s: [CONTEXT UPDATE]
  ├── Detect current task
  ├── Track workflow
  ├── Predict next tasks
  └── Generate recommendations
  Duration: ~0.2-1.0s

Time 3.5s: [COMPLIANCE CHECKS]
  ├── Pre-flight check
  ├── Memory Bank check
  ├── Security check
  ├── Active Context check
  ├── Context Management check
  ├── Hardcoded dates check
  ├── Error handling check
  ├── Logging check
  ├── Python Bible check
  └── Bug logging check
  Duration: ~1.0-5.0s (depends on file count)

Time 8.5s: [VIOLATION PROCESSING]
  ├── Categorize violations
  ├── Auto-fix current session violations
  ├── Generate status files
  └── Update session state
  Duration: ~0.5-2.0s

Time 10.5s: [COMPLETE]
  └── Exit with status code (0 = success, 1 = violations)
```

**Total Duration:** ~8-12 seconds (typical)

---

## Integration Points

### 1. File Watcher Integration

**File:** `.cursor/scripts/watch-files.py`

**How It Works:**
```python
class EnforcementHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        # Debounce
        if self.debounce_timer:
            self.debounce_timer.cancel()
        self.debounce_timer = Timer(2.0, self.run_enforcer)
        self.debounce_timer.start()
    
    def run_enforcer(self):
        subprocess.run(
            [sys.executable, str(self.enforcer_script)],
            timeout=180  # 3 minutes max
        )
```

**Key Features:**
- Debouncing (2 seconds)
- Subprocess execution (isolated)
- Timeout protection (180 seconds)
- Error handling

### 2. VS Code Task Integration

**File:** `.vscode/tasks.json`

**Tasks:**
1. **"Start Auto-Enforcement System"**
   - Runs `watch-files.py`
   - Auto-starts on folder open
   - Background process

2. **"Run Enforcement Check"**
   - Runs `auto-enforcer.py` directly
   - Manual execution
   - Shows output in terminal

### 3. Context Management Integration

**How It Works:**
- Enforcer detects tasks from file changes
- Passes task info to context management
- Context management generates recommendations
- Recommendations used by AI agent

**Flow:**
```
Enforcer → Task Detection → Workflow Tracking → Prediction → Recommendations
```

---

## Status Files Generated

### 1. AGENT_STATUS.md

**Location:** `.cursor/enforcement/AGENT_STATUS.md`

**Content:**
- Current compliance status (🟢 COMPLIANT / 🟡 WARNING / 🔴 BLOCKED)
- Violation counts
- Session information
- Compliance check results

**Updated:** Every enforcer run

### 2. ENFORCEMENT_BLOCK.md

**Location:** `.cursor/enforcement/ENFORCEMENT_BLOCK.md`

**Content:**
- Blocking message (if violations detected)
- List of blocking violations
- Remediation guidance

**Updated:** Only when blocking violations detected

### 3. VIOLATIONS.md

**Location:** `.cursor/enforcement/VIOLATIONS.md`

**Content:**
- Historical violation log
- All violations with timestamps
- Severity levels
- Resolution status

**Updated:** Every enforcer run (appends new violations)

### 4. AUTO_FIXES.md

**Location:** `.cursor/enforcement/AUTO_FIXES.md`

**Content:**
- Track of all auto-fixes applied
- Before/after states
- Fix descriptions
- Timestamps

**Updated:** Every time auto-fix is applied

### 5. session.json

**Location:** `.cursor/enforcement/session.json`

**Content:**
- Session ID
- Start time
- Last check time
- Violations list
- Auto-fixes list
- File hashes (for change detection)

**Updated:** Every enforcer run

---

## Context Recommendations Files

### 1. recommendations.md

**Location:** `.cursor/context_manager/recommendations.md`

**Content:**
- Current task information
- Predicted next tasks
- Recommended context files
- Context to unload
- Pre-loaded context

**Updated:** Every enforcer run (before compliance checks)

### 2. context_enforcement.mdc

**Location:** `.cursor/rules/context_enforcement.mdc`

**Content:**
- Dynamic context loading rules
- Context priorities
- Integration instructions

**Updated:** Every enforcer run (before compliance checks)

### 3. dashboard.md

**Location:** `.cursor/context_manager/dashboard.md`

**Content:**
- Current session status
- Active workflow
- Predicted next steps
- Context efficiency metrics
- Prediction accuracy

**Updated:** Every enforcer run (before compliance checks)

---

## Performance Characteristics

### Execution Time

**Typical Run:**
- Initialization: 0.1-0.5s
- Context Update: 0.2-1.0s
- Compliance Checks: 1.0-5.0s
- Violation Processing: 0.5-2.0s
- **Total: 2-8 seconds**

**Large Changeset (>100 files):**
- Skips non-critical checks
- **Total: 1-3 seconds**

**Timeout Protection:**
- Maximum execution time: 180 seconds (3 minutes)
- File watcher enforces timeout
- Prevents hanging processes

### Resource Usage

**Memory:**
- Base: ~50-100 MB
- With context management: ~100-200 MB
- Peak: ~200-300 MB (large codebase)

**CPU:**
- Low during idle (file watcher)
- Moderate during checks (file I/O, regex matching)
- High during large changesets (many files)

---

## Error Handling

### Graceful Degradation

**If Context Management Fails:**
- Enforcer continues without context management
- Logs warning
- Compliance checks still run

**If Session File Corrupted:**
- Creates new session
- Logs error
- Continues execution

**If File Watcher Crashes:**
- Process exits
- Can be restarted manually
- VS Code task can auto-restart

### Error Logging

**Structured Logging:**
- All errors logged with context
- Includes operation, error code, root cause
- Uses `logger_util` if available
- Falls back to standard logging

**Error Codes:**
- `ENFORCEMENT_RUN_FAILED` - General failure
- `CONTEXT_UPDATE_FAILED` - Context update failed
- `PRE_FLIGHT_BLOCKED` - Pre-flight check failed
- `CHECK_EXCEPTION` - Individual check failed
- `ENFORCER_TIMEOUT` - Execution timeout

---

## Best Practices

### 1. Keep File Watcher Running

**Why:** Ensures automatic compliance checking

**How:**
- Enable VS Code auto-start task
- Or run manually: `python .cursor/scripts/watch-files.py`

### 2. Monitor Status Files

**Why:** Stay informed about compliance status

**Files to Check:**
- `AGENT_STATUS.md` - Current status
- `VIOLATIONS.md` - Recent violations
- `AUTO_FIXES.md` - Auto-fixes applied

### 3. Review Auto-Fixes

**Why:** Ensure auto-fixes are correct

**How:**
- Check `AUTO_FIXES.md` after each run
- Review file changes
- Verify fixes are appropriate

### 4. Use User Message Parameter

**Why:** Improves task assignment detection

**How:**
```bash
python .cursor/scripts/auto-enforcer.py --user-message "Add new feature"
```

---

## Troubleshooting

### Enforcer Not Running

**Check:**
1. Is file watcher running?
   ```bash
   # Check for process
   ps aux | grep watch-files.py
   ```

2. Are files in watched directories?
   - Check watched directories list
   - Verify file changes are detected

3. Check logs:
   - Look for error messages
   - Check `AGENT_STATUS.md` for status

### Slow Execution

**Causes:**
- Large number of changed files (>100)
- Complex regex patterns
- File I/O bottlenecks

**Solutions:**
- Enforcer automatically skips non-critical checks for >100 files
- Consider optimizing file patterns
- Check disk I/O performance

### Context Recommendations Not Updating

**Check:**
1. Is context management initialized?
   - Check enforcer output: "Predictive context management: Enabled"
   - Verify context_manager directory exists

2. Are files being tracked?
   - Check workflow_state.json
   - Verify file changes are detected

3. Check logs:
   - Look for context update errors
   - Verify task detection is working

---

## Summary

**The auto-enforcer runs:**

1. ✅ **Automatically** when files change (if file watcher is running)
2. ✅ **On folder open** (if VS Code task enabled)
3. ✅ **Manually** via command line or VS Code task
4. ⚠️ **Not in CI/CD** (currently - can be added)

**Execution Flow:**
1. Initialization (load session, initialize context management)
2. Context Recommendations Update (detect task, predict next, generate recommendations)
3. Compliance Checks (Memory Bank, Security, Active Context, etc.)
4. Violation Processing (categorize, auto-fix, generate status files)
5. Session Update (save state, record violations)

**Key Features:**
- Debouncing (2 seconds) prevents excessive runs
- Auto-fixing for current session violations
- Context-aware recommendations
- Comprehensive status reporting

---

**For more details, see:**
- `.cursor/scripts/auto-enforcer.py` - Main enforcer code
- `.cursor/scripts/watch-files.py` - File watcher
- `when-enforcer-runs.md` - Trigger documentation
- `docs/architecture/RULES_ENFORCEMENT_AUDIT_REPORT.md` - System architecture





