# Hybrid Context Management System - Integration Summary

**Last Updated:** 2025-12-02  
**Purpose:** Detailed explanation of how the new hybrid context management system integrates with existing components, particularly the auto-enforcer and file watcher.

---

## Executive Summary

The hybrid context management system introduces **two parallel context loading mechanisms**:

1. **Core Context (Automatic)**: Critical files like `schema.prisma`, `ARCHITECTURE.md` are embedded directly into rule files (`.cursor/rules/context/*.mdc`) and automatically loaded by Cursor at session start
2. **Dynamic Context (Instruction-Based)**: Task-specific files are managed via `context_enforcement.mdc` with explicit `@` mentions for the agent to load

This hybrid approach **reduces token usage** (core context loaded once at session start) while maintaining **flexibility** (dynamic context adapts to tasks).

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cursor AI Agent Session                       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Step 0.5: Context Loading (MANDATORY)                   │   │
│  │  - Reads recommendations.md                               │   │
│  │  - Loads PRIMARY context via @ mentions                  │   │
│  │  - Core context already loaded (via rule files)          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Steps 1-4: Task Execution                               │   │
│  │  - Uses loaded context (core + dynamic)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Step 4.5: Context Management (MANDATORY)              │   │
│  │  - Reads updated recommendations.md                      │   │
│  │  - Unloads obsolete context                              │   │
│  │  - Pre-loads predicted context                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Step 5: Post-Implementation Audit                       │   │
│  │  - Reports context usage and token statistics            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                              │ (File changes detected)
                              │
┌─────────────────────────────┴─────────────────────────────────┐
│                    File Watcher (watch-files.py)               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  EnforcementHandler                                      │  │
│  │  - Monitors: apps/, libs/, frontend/, .cursor/rules/     │  │
│  │  - Debounces changes (2 seconds)                         │  │
│  │  - Triggers: auto-enforcer.py                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  RuleFileUpdateHandler (NEW)                             │  │
│  │  - Monitors: schema.prisma, ARCHITECTURE.md, etc.        │  │
│  │  - Debounces changes (2 seconds)                         │  │
│  │  - Triggers: RuleFileManager.update_rule_file()          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                              │ (File changes detected)
                              │
┌─────────────────────────────┴─────────────────────────────────┐
│              Auto-Enforcer (auto-enforcer.py)                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  run_all_checks()                                         │  │
│  │  ├─ Memory Bank checks                                    │  │
│  │  ├─ Date compliance checks                                │  │
│  │  ├─ Security checks                                       │  │
│  │  ├─ Error handling checks                                 │  │
│  │  └─ _update_context_recommendations() ← NEW INTEGRATION   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  _update_context_recommendations() (UPDATED)             │  │
│  │  ├─ Get changed files (git diff)                         │  │
│  │  ├─ Detect task (TaskDetector)                           │  │
│  │  ├─ Track workflow (WorkflowTracker)                      │  │
│  │  ├─ Predict next tasks (ContextPredictor)                 │  │
│  │  ├─ Categorize files (ContextCategorizer) ← NEW           │  │
│  │  ├─ Sync rule files (RuleFileManager) ← NEW              │  │
│  │  ├─ Generate recommendations.md                          │  │
│  │  ├─ Generate context_enforcement.mdc                     │  │
│  │  └─ Update dashboard.md                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                              │ (Uses)
                              │
┌─────────────────────────────┴─────────────────────────────────┐
│              Context Manager Components                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ContextCategorizer (NEW)                                │  │
│  │  - Categorizes files as core vs dynamic                   │  │
│  │  - Core patterns: schema.prisma, ARCHITECTURE.md, etc.    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  RuleFileManager (NEW)                                    │  │
│  │  - Creates/deletes rule files in .cursor/rules/context/  │  │
│  │  - Embeds file content (if < 10K lines / 100KB)          │  │
│  │  - Updates rule files when source files change            │  │
│  │  - Triggers auto-save after file operations              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  TaskDetector (EXISTING)                                 │  │
│  │  - Analyzes agent messages and file changes               │  │
│  │  - Classifies task types (edit_code, run_tests, etc.)     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ContextPredictor (EXISTING)                               │  │
│  │  - Predicts next tasks based on current task             │  │
│  │  - Uses workflow patterns and transition statistics       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ContextPreloader (EXISTING)                              │  │
│  │  - Determines which files to load/unload                  │  │
│  │  - Uses task type and predictions                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  WorkflowTracker (EXISTING)                               │  │
│  │  - Tracks task sequences (workflows)                      │  │
│  │  - Detects workflow patterns                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Integration Flow

### 1. File Change Detection & Enforcer Trigger

**Existing Flow (Unchanged):**

1. **File Watcher** (`watch-files.py`) monitors directories:
   - `apps/`, `libs/`, `frontend/`, `VeroFieldMobile/`
   - `.cursor/memory-bank/`, `.cursor/rules/`

2. **EnforcementHandler** detects file changes:
   - Filters out: `.cursor/enforcement/`, binary files, build directories
   - Debounces rapid changes (2-second delay)
   - Triggers `auto-enforcer.py` after debounce period

3. **Auto-Enforcer** runs `run_all_checks()`:
   - Memory Bank compliance checks
   - Date compliance checks
   - Security checks
   - Error handling checks
   - **NEW:** Calls `_update_context_recommendations()` at end

**New Flow (Added):**

4. **RuleFileUpdateHandler** (NEW in `watch-files.py`) monitors:
   - Core context source files: `schema.prisma`, `ARCHITECTURE.md`, `.env.example`
   - Rule files in `.cursor/rules/context/`

5. On source file change:
   - Debounces changes (2-second delay)
   - Calls `RuleFileManager.update_rule_file(changed_file)`
   - Rule file is updated with latest content
   - Auto-save trigger ensures Cursor detects change

---

### 2. Context Recommendations Update (Enforcer Integration)

**Location:** `.cursor/scripts/auto-enforcer.py` → `_update_context_recommendations()`

**Current Implementation (Lines 3233-3356):**

```python
def _update_context_recommendations(self):
    # 1. Get changed files from git
    changed_files = self.get_changed_files(include_untracked=False)
    
    # 2. Detect current task
    task_detection = self.task_detector.detect_task(...)
    
    # 3. Track workflow
    workflow_id = self.workflow_tracker.add_task(...)
    
    # 4. Predict next tasks
    predictions = self.predictor.predict_next_tasks(current_task)
    
    # 5. Get context management plan
    context_plan = self.preloader.manage_context(current_task)
    
    # 6. Generate recommendations.md
    self._generate_recommendations_file(...)
    
    # 7. Generate context_enforcement.mdc
    self._generate_dynamic_rule_file(context_plan)
    
    # 8. Update dashboard.md
    self._update_dashboard(...)
```

**New Implementation (After Integration):**

```python
def _update_context_recommendations(self):
    # 1. Get changed files from git
    changed_files = self.get_changed_files(include_untracked=False)
    
    # 2. Filter out rule files (prevent recursion)
    changed_files = [f for f in changed_files 
                     if not f.startswith('.cursor/rules/')]
    
    # 3. Detect current task
    task_detection = self.task_detector.detect_task(...)
    
    # 4. Track workflow
    workflow_id = self.workflow_tracker.add_task(...)
    
    # 5. Predict next tasks
    predictions = self.predictor.predict_next_tasks(current_task)
    
    # 6. Get context management plan
    context_plan = self.preloader.manage_context(current_task)
    
    # 7. NEW: Categorize files (core vs dynamic)
    categorizer = ContextCategorizer()
    active_context = context_plan.get('active_context', [])
    preloaded_context = context_plan.get('preloaded_context', [])
    context_to_unload = context_plan.get('context_to_unload', [])
    
    # Filter out rule files from context lists
    active_context = [f for f in active_context 
                      if not f.startswith('.cursor/rules/')]
    preloaded_context = [f for f in preloaded_context 
                         if not f.startswith('.cursor/rules/')]
    context_to_unload = [f for f in context_to_unload 
                          if not f.startswith('.cursor/rules/')]
    
    # Categorize into core vs dynamic
    core_files, dynamic_files = categorizer.categorize(
        active_context + preloaded_context,
        context_to_unload
    )
    
    # 8. NEW: Sync rule files (create/delete/update)
    rule_file_manager = RuleFileManager()
    rule_changes = rule_file_manager.sync_context_files(
        core_files=core_files,
        context_to_unload=context_to_unload
    )
    
    # 9. NEW: Generate session restart alert (if core context changed)
    if rule_changes.get('created') or rule_changes.get('deleted'):
        self._generate_session_restart_rule(rule_changes)
    
    # 10. Generate recommendations.md (UPDATED)
    self._generate_recommendations_file(
        current_task,
        context_plan,
        workflow_id,
        rule_changes  # NEW: Pass rule changes
    )
    
    # 11. Generate context_enforcement.mdc (UPDATED)
    self._generate_dynamic_rule_file(
        context_plan,
        rule_changes  # NEW: Pass rule changes
    )
    
    # 12. Update dashboard.md
    self._update_dashboard(...)
```

---

### 3. File Categorization (New Component)

**Location:** `.cursor/context_manager/context_categorizer.py` (NEW)

**Purpose:** Separates files into "core context" (auto-loaded via rule files) vs "dynamic context" (loaded via @ mentions).

**Integration Points:**

- **Called by:** `_update_context_recommendations()` in auto-enforcer
- **Input:** Lists of active context, preloaded context, context to unload
- **Output:** Tuple of (core_files, dynamic_files)

**Core File Patterns:**

```python
CORE_PATTERNS = [
    'libs/common/prisma/schema.prisma',
    'docs/ARCHITECTURE.md',
    '.env.example',
    # ... other critical files
]
```

**Logic:**

1. Check if file matches `CORE_PATTERNS`
2. Check if file is excluded (`.cursor/rules/`, `node_modules/`, etc.)
3. Return categorized lists

---

### 4. Rule File Management (New Component)

**Location:** `.cursor/context_manager/rule_file_manager.py` (NEW)

**Purpose:** Creates, updates, and deletes rule files in `.cursor/rules/context/` directory.

**Integration Points:**

- **Called by:** `_update_context_recommendations()` in auto-enforcer
- **Called by:** `RuleFileUpdateHandler` in file watcher (for real-time updates)
- **Output:** Dict with `created`, `deleted`, `updated`, `unchanged` lists

**Key Methods:**

1. **`sync_context_files(core_files, context_to_unload)`**:
   - Creates rule files for new core files
   - Deletes rule files for files in `context_to_unload`
   - Updates rule files if source files changed (mtime comparison)
   - Returns dict with changes

2. **`_create_rule_file(source_path, rule_file)`**:
   - Reads source file content
   - Checks file size limits (10K lines / 100KB)
   - Generates rule file markdown with embedded content
   - Writes rule file
   - **Triggers auto-save** after creation

3. **`_trigger_cursor_auto_save(rule_file)`**:
   - Touches file to update mtime
   - Touches parent directory to trigger refresh
   - Platform-specific notifications (if available)

**File Naming Convention:**

- `libs/common/prisma/schema.prisma` → `schema_prisma.mdc`
- `docs/ARCHITECTURE.md` → `architecture_md.mdc`
- Readable names, not full paths

---

### 5. Recommendations File Generation (Updated)

**Location:** `.cursor/scripts/auto-enforcer.py` → `_generate_recommendations_file()`

**Current Implementation (Lines 3500-3783):**

- Lists active context files (with @ mentions)
- Lists preloaded context files
- Lists context to unload
- Includes mandatory Step 0.5 and Step 4.5 requirements

**New Implementation (After Integration):**

**Enhanced Sections:**

1. **"How Context Is Managed" Section (NEW)**:
   - Explains core context (automatic via rule files)
   - Explains dynamic context (instructions-based)
   - References `.cursor/rules/context/` directory
   - References `context_enforcement.mdc` for instructions

2. **"Active Context" Section (UPDATED)**:
   - Split into "Core Context (Automatic)" and "Dynamic Context (Load These)"
   - Core context: Lists files auto-loaded via rule files (no @ mention needed)
   - Dynamic context: Lists files that need @ mentions

3. **"Troubleshooting" Section (NEW)**:
   - How to check for `SESSION_RESTART_REQUIRED.mdc`
   - How to see core context (list `.cursor/rules/context/`)
   - How to see dynamic context (read `context_enforcement.mdc`)

**Example Output:**

```markdown
## Recommended Context

### Core Context (Automatic - Already Loaded)

These files are automatically loaded via rule files - no @ mention needed:

- `libs/common/prisma/schema.prisma` (via `.cursor/rules/context/schema_prisma.mdc`)
- `docs/ARCHITECTURE.md` (via `.cursor/rules/context/architecture_md.mdc`)

### Dynamic Context (Load These - REQUIRED)

These files MUST be loaded with @ mentions:

- `@apps/api/src/work-orders/work-orders.service.ts` (PRIMARY - REQUIRED)
- `@frontend/src/components/ui/Button.tsx` (PRIMARY - REQUIRED)
```

---

### 6. Dynamic Rule File Generation (Updated)

**Location:** `.cursor/scripts/auto-enforcer.py` → `_generate_dynamic_rule_file()`

**Current Implementation (Lines 3785-3946):**

- Lists active context files with @ mentions
- Lists preloaded context files
- Lists context to unload
- Includes mandatory Step 0.5 and Step 4.5 requirements

**New Implementation (After Integration):**

**Enhanced Sections:**

1. **"Core Context (Already Loaded)" Section (NEW)**:
   - Lists files already loaded via rule files
   - Note: "These are automatically loaded - no @ mention needed"
   - References rule files in `.cursor/rules/context/`

2. **"Dynamic Context (Load These)" Section (UPDATED)**:
   - Only lists dynamic files (not core files)
   - Uses @ mentions for loading

3. **"Session Restart Notice" Section (NEW)**:
   - Includes alert if core context changed
   - References `SESSION_RESTART_REQUIRED.mdc`
   - Instructions for user to start new chat

**Example Output:**

```markdown
## Core Context (Already Loaded)

These files are automatically loaded via rule files - no @ mention needed:

- `libs/common/prisma/schema.prisma` (via `.cursor/rules/context/schema_prisma.mdc`)
- `docs/ARCHITECTURE.md` (via `.cursor/rules/context/architecture_md.mdc`)

## Dynamic Context (Load These - REQUIRED)

**BEFORE starting ANY task, you MUST load these files with @ mentions:**

- `@apps/api/src/work-orders/work-orders.service.ts`
- `@frontend/src/components/ui/Button.tsx`

## ⚠️ SESSION RESTART REQUIRED

**Core context has changed. Please start a new chat session to load updated rule files.**

See `.cursor/rules/SESSION_RESTART_REQUIRED.mdc` for details.
```

---

### 7. Session Restart Mechanism (New Component)

**Location:** `.cursor/scripts/auto-enforcer.py` → `_generate_session_restart_rule()` (NEW)

**Purpose:** Creates high-visibility alert when core context changes, requiring user to start new chat session.

**Integration Points:**

- **Called by:** `_update_context_recommendations()` when rule files created/deleted
- **Output:** `.cursor/rules/SESSION_RESTART_REQUIRED.mdc` file

**Implementation:**

```python
def _generate_session_restart_rule(self, rule_changes: dict) -> Path:
    """
    Generate session restart alert file.
    
    Creates high-visibility alert when core context changes.
    """
    alert_file = self.rules_dir.parent / "SESSION_RESTART_REQUIRED.mdc"
    
    content = f"""# ⚠️ SESSION RESTART REQUIRED

**Last Updated:** {datetime.now(timezone.utc).isoformat()}

## Core Context Has Changed

The following rule files have been created or deleted:

**Created:**
{chr(10).join(f"- {f}" for f in rule_changes.get('created', []))}

**Deleted:**
{chr(10).join(f"- {f}" for f in rule_changes.get('deleted', []))}

## Action Required

**Cursor requires a new chat session to load updated rule files.**

### How to Restart Session:

1. **Start New Chat** (Recommended):
   - Click the **"+"** button in Cursor chat panel
   - Or use keyboard shortcut: **Cmd/Ctrl + N** (new chat)
   - This will load all updated rule files automatically

2. **Reload Window** (Alternative):
   - Use **Cmd/Ctrl + Shift + P** to open command palette
   - Type "Reload Window" and select it
   - This reloads the entire Cursor window

### Why Restart Is Needed:

- Rule files are loaded at session start
- Core context changes require rule file reload
- New session ensures all context is up-to-date

### Current Session Behavior:

- You can continue in current session, but context may be stale
- Agent will warn about missing/outdated context
- New session recommended for best results

---

**This alert will be removed automatically after 5 minutes or when new session detected.**
"""
    
    alert_file.write_text(content, encoding='utf-8')
    return alert_file
```

**Agent Compliance:**

- **Step 0.5:** Agent MUST check for `SESSION_RESTART_REQUIRED.mdc`
- If found, agent MUST inform user: "Session restart required - please start new chat"
- Agent can continue in current session but should warn about stale context
- Agent should check `context_enforcement.mdc` "SESSION STATUS" section

**Limitation:**

- Cursor's rule file loading happens at session start
- Cannot force a reload mid-session programmatically
- Best we can do: Clear alerts + agent compliance + user instructions

---

### 8. File Watcher Integration (Updated)

**Location:** `.cursor/scripts/watch-files.py`

**Current Implementation:**

- `EnforcementHandler` monitors directories and triggers auto-enforcer
- Watches: `apps/`, `libs/`, `frontend/`, `.cursor/rules/`, etc.

**New Implementation (After Integration):**

**New Handler Class:**

```python
class RuleFileUpdateHandler(FileSystemEventHandler):
    """
    Handler for rule file updates when core context source files change.
    """
    
    def __init__(self, rule_file_manager: RuleFileManager):
        self.rule_file_manager = rule_file_manager
        self.debounce_timer: Optional[Timer] = None
        self.debounce_seconds = 2.0
        self.categorizer = ContextCategorizer()
    
    def on_modified(self, event: FileSystemEvent):
        # Check if source file changed (schema.prisma, ARCHITECTURE.md, etc.)
        if self._is_core_context_source(event.src_path):
            # Debounce and trigger rule file update
            self._debounce_update(event.src_path)
    
    def _is_core_context_source(self, file_path: str) -> bool:
        # Check if file matches CORE_PATTERNS
        return self.categorizer._is_core_file(file_path)
    
    def _debounce_update(self, source_path: str):
        # Cancel existing timer
        if self.debounce_timer and self.debounce_timer.is_alive():
            self.debounce_timer.cancel()
        
        # Create new debounced timer
        self.debounce_timer = Timer(
            self.debounce_seconds,
            lambda: self.rule_file_manager.update_rule_file(source_path)
        )
        self.debounce_timer.start()
```

**Updated FileWatcher Class:**

```python
class FileWatcher:
    # ... existing code ...
    
    def start(self):
        # ... existing code ...
        
        # Create enforcement handler (existing)
        enforcement_handler = EnforcementHandler(debounce_seconds=self.debounce_seconds)
        
        # Create rule file update handler (NEW)
        rule_file_manager = RuleFileManager()
        rule_file_handler = RuleFileUpdateHandler(rule_file_manager)
        
        # Watch directories with enforcement handler
        for watch_dir in self.WATCH_DIRECTORIES:
            self.observer.schedule(enforcement_handler, str(watch_path), recursive=True)
        
        # Watch core context source directories with rule file handler (NEW)
        core_source_dirs = [
            "libs/common/prisma",  # schema.prisma
            "docs",                # ARCHITECTURE.md
            ".",                   # .env.example
        ]
        for source_dir in core_source_dirs:
            source_path = self.project_root / source_dir
            if source_path.exists():
                self.observer.schedule(rule_file_handler, str(source_path), recursive=True)
```

**Prevent Recursion:**

- Skip `.cursor/rules/context/*.mdc` files in `EnforcementHandler` (already skips `.cursor/enforcement/`)
- Skip source files in `RuleFileUpdateHandler` that are being updated by RuleFileManager

---

### 9. Auto-Save Trigger Mechanism (New Feature)

**Location:** `.cursor/context_manager/rule_file_manager.py` → `_trigger_cursor_auto_save()`

**Purpose:** Ensures Cursor immediately detects rule file changes without requiring manual save or window reload.

**Integration Points:**

- **Called by:** `_create_rule_file()` after rule file creation
- **Called by:** `rule_file.unlink()` after rule file deletion
- **Called by:** `sync_context_files()` after batch operations

**Implementation:**

```python
def _trigger_cursor_auto_save(self, rule_file: Path):
    """
    Trigger Cursor to detect rule file changes.
    
    Uses multiple strategies to ensure Cursor detects changes:
    - Touch file to update mtime (if file exists)
    - Touch parent directory to trigger refresh
    - Platform-specific file system notifications (if available)
    """
    try:
        # Strategy 1: Touch the file itself (updates mtime)
        if rule_file.exists():
            rule_file.touch()
        
        # Strategy 2: Touch parent directory (triggers directory refresh)
        parent_dir = rule_file.parent
        if parent_dir.exists():
            # Create/update a marker file to trigger directory change
            marker_file = parent_dir / ".cursor_rule_update_marker"
            marker_file.touch()
            # Clean up marker after a short delay (optional)
            # Timer(0.1, lambda: marker_file.unlink(missing_ok=True)).start()
        
        # Strategy 3: Platform-specific notifications (Windows)
        if sys.platform == 'win32':
            # Windows: Use ReadDirectoryChangesW via watchdog (already in use)
            # File watcher should detect the change automatically
            pass
        
    except Exception as e:
        logger.warn(
            "Failed to trigger Cursor auto-save",
            operation="_trigger_cursor_auto_save",
            error_code="AUTO_SAVE_TRIGGER_FAILED",
            root_cause=str(e),
            file_path=str(rule_file)
        )
```

**Batch Operations Optimization:**

```python
def sync_context_files(self, core_files: List[str], context_to_unload: List[str]) -> dict:
    # ... create/delete rule files ...
    
    # After batch operations, trigger single save event
    if created_files or deleted_files:
        # Touch parent directory once for all changes
        self._trigger_cursor_auto_save(self.rules_dir)
```

**Platform Considerations:**

- **Windows:** File watcher (watchdog) should detect changes automatically
- **Mac/Linux:** File watcher should detect changes automatically
- **Fallback:** Touch parent directory to trigger refresh

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    File Change Event                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              File Watcher (watch-files.py)                       │
│                                                                   │
│  ┌──────────────────────────┐  ┌──────────────────────────┐    │
│  │ EnforcementHandler        │  │ RuleFileUpdateHandler     │    │
│  │                          │  │ (NEW)                     │    │
│  │ - Detects file changes   │  │ - Detects core context   │    │
│  │ - Debounces (2 sec)      │  │   source file changes    │    │
│  │ - Triggers:               │  │ - Debounces (2 sec)      │    │
│  │   auto-enforcer.py        │  │ - Triggers:              │    │
│  │                           │  │   RuleFileManager       │    │
│  └──────────────┬────────────┘  └──────────────┬────────────┘    │
└─────────────────┼──────────────────────────────┼────────────────┘
                  │                              │
                  ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│         Auto-Enforcer (auto-enforcer.py)                        │
│                                                                   │
│  run_all_checks()                                                │
│  ├─ Memory Bank checks                                           │
│  ├─ Date compliance checks                                      │
│  ├─ Security checks                                              │
│  └─ _update_context_recommendations() ← ENTRY POINT             │
│      │                                                           │
│      ├─ Get changed files (git diff)                             │
│      ├─ Detect task (TaskDetector)                               │
│      ├─ Track workflow (WorkflowTracker)                         │
│      ├─ Predict next tasks (ContextPredictor)                    │
│      ├─ Get context plan (ContextPreloader)                      │
│      │                                                           │
│      ├─ NEW: Categorize files (ContextCategorizer)              │
│      │   ├─ Input: active_context, preloaded_context            │
│      │   └─ Output: core_files, dynamic_files                     │
│      │                                                           │
│      ├─ NEW: Sync rule files (RuleFileManager)                  │
│      │   ├─ Input: core_files, context_to_unload                │
│      │   ├─ Creates: .cursor/rules/context/*.mdc                 │
│      │   ├─ Deletes: obsolete rule files                         │
│      │   ├─ Updates: changed rule files (mtime comparison)      │
│      │   └─ Output: rule_changes dict                             │
│      │                                                           │
│      ├─ NEW: Generate session restart alert                      │
│      │   └─ Creates: .cursor/rules/SESSION_RESTART_REQUIRED.mdc  │
│      │                                                           │
│      ├─ Generate recommendations.md (UPDATED)                    │
│      │   ├─ Lists core context (auto-loaded)                    │
│      │   ├─ Lists dynamic context (load with @)                 │
│      │   └─ Includes troubleshooting section                     │
│      │                                                           │
│      ├─ Generate context_enforcement.mdc (UPDATED)               │
│      │   ├─ Lists core context (already loaded)                  │
│      │   ├─ Lists dynamic context (load with @)                  │
│      │   └─ Includes session restart notice                      │
│      │                                                           │
│      └─ Update dashboard.md                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Rule File Manager (rule_file_manager.py)            │
│                                                                   │
│  sync_context_files()                                            │
│  ├─ For each core_file:                                          │
│  │   ├─ Check if rule file exists                                │
│  │   ├─ Check if source file changed (mtime comparison)          │
│  │   ├─ Create/update rule file                                  │
│  │   │   ├─ Read source file content                             │
│  │   │   ├─ Check file size limits (10K lines / 100KB)           │
│  │   │   ├─ Generate rule file markdown                          │
│  │   │   └─ Write rule file                                      │
│  │   └─ Trigger auto-save (_trigger_cursor_auto_save)             │
│  │                                                               │
│  └─ For each file in context_to_unload:                          │
│      ├─ Find corresponding rule file                            │
│      ├─ Delete rule file                                         │
│      └─ Trigger auto-save (touch parent directory)                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Generated Files                                    │
│                                                                   │
│  .cursor/rules/context/                                          │
│  ├─ schema_prisma.mdc (auto-generated)                          │
│  ├─ architecture_md.mdc (auto-generated)                        │
│  └─ env_example.mdc (auto-generated)                            │
│                                                                   │
│  .cursor/rules/                                                  │
│  ├─ context_enforcement.mdc (updated)                           │
│  └─ SESSION_RESTART_REQUIRED.mdc (if core changed)              │
│                                                                   │
│  .cursor/context_manager/                                        │
│  ├─ recommendations.md (updated)                                 │
│  └─ dashboard.md (updated)                                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Cursor AI Agent                                    │
│                                                                   │
│  Step 0.5: Context Loading                                       │
│  ├─ Reads recommendations.md                                     │
│  ├─ Core context already loaded (via rule files)                 │
│  └─ Loads dynamic context via @ mentions                         │
│                                                                   │
│  Steps 1-4: Task Execution                                       │
│  └─ Uses loaded context (core + dynamic)                          │
│                                                                   │
│  Step 4.5: Context Management                                     │
│  ├─ Reads updated recommendations.md                             │
│  ├─ Unloads obsolete context                                     │
│  └─ Pre-loads predicted context                                  │
│                                                                   │
│  Step 5: Post-Implementation Audit                                │
│  └─ Reports context usage and token statistics                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Integration Points Summary

### 1. **Enforcer Integration**

- **Location:** `auto-enforcer.py` → `_update_context_recommendations()`
- **Changes:**
  - Filter out rule files from context lists (prevent recursion)
  - Categorize files (core vs dynamic)
  - Sync rule files (create/delete/update)
  - Generate session restart alert
  - Update recommendations.md with hybrid system info
  - Update context_enforcement.mdc with core context section

### 2. **File Watcher Integration**

- **Location:** `watch-files.py`
- **Changes:**
  - Add `RuleFileUpdateHandler` class (NEW)
  - Watch core context source directories
  - Trigger `RuleFileManager.update_rule_file()` on source file changes
  - Prevent recursion (skip rule files in enforcement handler)

### 3. **New Components**

- **ContextCategorizer:** Categorizes files as core vs dynamic
- **RuleFileManager:** Manages rule files (create/delete/update)
- **Session Restart Mechanism:** Alerts user when core context changes

### 4. **Auto-Save Trigger**

- **Location:** `rule_file_manager.py` → `_trigger_cursor_auto_save()`
- **Purpose:** Ensure Cursor detects rule file changes immediately
- **Strategies:** Touch file, touch parent directory, platform-specific notifications

### 5. **Agent Compliance**

- **Step 0.5:** Check for `SESSION_RESTART_REQUIRED.mdc`, load dynamic context
- **Step 4.5:** Unload obsolete context, pre-load predicted context
- **Step 5:** Report context usage and token statistics

---

## Benefits of Integration

1. **Reduced Token Usage**: Core context loaded once at session start (not repeatedly)
2. **Real-Time Updates**: File watcher updates rule files when source files change
3. **Automatic Detection**: Auto-save triggers ensure Cursor detects changes immediately
4. **Clear Instructions**: Session restart alerts guide user when core context changes
5. **Backward Compatible**: Existing context management workflow unchanged
6. **No Breaking Changes**: All existing components continue to work

---

## Testing Considerations

1. **Test rule file creation**: Verify files created with correct content
2. **Test rule file deletion**: Verify files removed when context unloaded
3. **Test file size limits**: Verify large files fallback to instructions
4. **Test session restart alert**: Verify alert created when core context changes
5. **Test categorization**: Verify files correctly categorized as core vs dynamic
6. **Test mtime comparison**: Verify rule files updated when source files change
7. **Test auto-save trigger**: Verify Cursor detects rule file changes immediately
8. **Test file watcher**: Verify rule files update when source files change
9. **Test session reset instructions**: Verify agent checks for restart requirement
10. **Test debouncing**: Verify file watcher debounces rapid changes correctly
11. **Test recursion prevention**: Verify file watcher doesn't trigger on rule file updates
12. **Test platform compatibility**: Verify auto-save triggers work on Windows, Mac, Linux

---

**Last Updated:** 2025-12-02  
**Maintained By:** VeroField Engineering Team








