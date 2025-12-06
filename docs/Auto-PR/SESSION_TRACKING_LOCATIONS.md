# Auto-PR Session Tracking - Where Sessions Are Stored

**Last Updated:** 2025-12-05

---

## 📍 Primary Session Storage

### 1. Main Session Data File
**Location:** `docs/metrics/auto_pr_sessions.json`

**Purpose:** Primary storage for all session data (active and completed)

**Structure:**
```json
{
  "version": "1.0",
  "last_updated": "2025-12-05T14:49:39Z",
  "active_sessions": {
    "cseek_cursor-20251120-0617": {
      "session_id": "cseek_cursor-20251120-0617",
      "author": "cseek_cursor",
      "started": "2025-12-05T06:17:51.491514",
      "last_activity": "2025-12-05T06:17:51.491514",
      "prs": [],
      "total_files_changed": 0,
      "test_files_added": 0,
      "status": "active"
    }
  },
  "completed_sessions": [
    {
      "session_id": "unknown-20251119-2204",
      "author": "unknown",
      "started": "2025-12-05T22:04:52.873742",
      "completed": "2025-12-05T22:26:11.789103",
      "completion_trigger": "manual_cli",
      "duration_minutes": 21,
      "status": "completed"
    }
  ]
}
```

**Managed By:**
- `auto_pr_session_manager.py` - `load_sessions()` and `save_sessions()`
- Updated when:
  - New session created
  - PR added to session
  - Session completed
  - Session cleaned up

**Current Status:**
- ✅ File exists
- 📊 2 active sessions
- 📊 15 completed sessions

---

## 📍 Current Session Marker

### 2. Active Session Marker File
**Location:** `.cursor/.session_id`

**Purpose:** Tracks the current active session for the local development environment

**Structure:**
```json
{
  "session_id": "cseek_cursor-20251120-0617",
  "author": "cseek_cursor",
  "created": "2025-12-05T06:17:51.491514",
  "last_updated": "2025-12-05T06:17:51.491514"
}
```

**Managed By:**
- `cursor_session_hook.py` - `get_or_create_session_id()`
- Created when:
  - Session CLI starts a new session
  - First auto-PR is created
- Updated when:
  - Session activity occurs (within 30-minute timeout)
- Deleted when:
  - Session is manually completed
  - Session times out

**Current Status:**
- ❌ File does not exist (no active local session)

---

## 📍 Minimal Metadata Storage (Optional)

### 3. Session State File
**Location:** `.cursor/data/session_state.json`

**Purpose:** Minimal metadata storage for PR-to-session mapping (alternative to embedding in PR bodies)

**Structure:**
```json
{
  "version": "1.0",
  "last_updated": "2025-12-05T14:49:39Z",
  "pr_to_session": {
    "326": "cseek_cursor-20251120-0617",
    "327": "cseek_cursor-20251120-0617"
  },
  "session_to_prs": {
    "cseek_cursor-20251120-0617": ["326", "327"]
  },
  "session_metadata": {
    "cseek_cursor-20251120-0617": {
      "author": "cseek_cursor",
      "timestamp": "2025-12-05T06:17:51",
      "title": "Session description"
    }
  }
}
```

**Managed By:**
- `minimal_metadata_system.py` - `SessionStateManager` class
- Used when:
  - Minimal metadata system is enabled
  - PRs need fast lookup without parsing PR bodies

**Current Status:**
- ❌ File does not exist (using full metadata system)

---

## 🔄 How Session Tracking Works

### Flow Diagram

```
1. Developer starts work
   ↓
   cursor_session_hook.py creates/loads .cursor/.session_id
   ↓
2. Auto-PR created (with "auto-pr:" prefix)
   ↓
   auto_pr_session_manager.py detects auto-PR
   ↓
3. PR added to session
   ↓
   add_to_session() called
   ↓
   Session data updated in docs/metrics/auto_pr_sessions.json
   ↓
4. Session completion triggered
   ↓
   complete_session() called
   ↓
   Session moved from active_sessions → completed_sessions
   ↓
   docs/metrics/auto_pr_sessions.json updated
```

---

## 📝 Code Locations

### Session Loading
```python
# File: .cursor/scripts/auto_pr_session_manager.py
# Line: 191-247

def load_sessions(self) -> Dict:
    """Load existing session data."""
    if SESSION_DATA_FILE.exists():
        with open(SESSION_DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    return data
```

### Session Saving
```python
# File: .cursor/scripts/auto_pr_session_manager.py
# Line: 247-264

def save_sessions(self):
    """Persist session data."""
    self.sessions["last_updated"] = datetime.now().isoformat()
    SESSION_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(SESSION_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(self.sessions, f, indent=2, ensure_ascii=False)
```

### Session ID Management
```python
# File: .cursor/scripts/cursor_session_hook.py
# Line: 25-165

SESSION_MARKER_FILE = Path(".cursor/.session_id")

def get_or_create_session_id(author: Optional[str] = None) -> str:
    """Get existing session ID or create new one."""
    if SESSION_MARKER_FILE.exists():
        # Load existing session
        with open(SESSION_MARKER_FILE, 'r') as f:
            data = json.load(f)
        # Check if still valid (< 30 minutes)
        if (now - last_updated).total_seconds() < 1800:
            return data["session_id"]
    # Create new session
    session_id = f"{author}-{timestamp}"
    with open(SESSION_MARKER_FILE, 'w') as f:
        json.dump(data, f)
    return session_id
```

### Adding PR to Session
```python
# File: .cursor/scripts/auto_pr_session_manager.py
# Line: 502-566

def add_to_session(self, pr_number: str, pr_data: Dict, session_id: Optional[str] = None):
    """Add a PR to an active session or create new session."""
    # Create or update session
    if session_id not in self.sessions["active_sessions"]:
        self.sessions["active_sessions"][session_id] = {
            "session_id": session_id,
            "author": author,
            "started": timestamp.isoformat(),
            "prs": [],
            ...
        }
    
    # Update session
    session = self.sessions["active_sessions"][session_id]
    session["prs"].append(pr_number)
    session["last_activity"] = timestamp.isoformat()
    
    # Save to file
    self.save_sessions()
```

---

## 🔍 Querying Session Data

### Check Current Sessions
```bash
python .cursor/scripts/auto_pr_session_manager.py status
```

### View Session Data File
```bash
cat docs/metrics/auto_pr_sessions.json
# or
Get-Content docs/metrics/auto_pr_sessions.json
```

### Check Active Session Marker
```bash
cat .cursor/.session_id
# or
Get-Content .cursor/.session_id
```

### Python API
```python
from auto_pr_session_manager import AutoPRSessionManager

manager = AutoPRSessionManager()
status = manager.get_session_status()
print(f"Active: {status['active']}, Completed: {status['completed']}")
```

---

## 📊 Current Session Statistics

**From:** `docs/metrics/auto_pr_sessions.json`

- **Active Sessions:** 2
  - `cseek_cursor-20251120-0617`
  - `cseek_cursor-20251120-0618`

- **Completed Sessions:** 15
  - Latest: `cseek_cursor-20251119-2313`
  - Oldest: Various from Nov 19, 2025

---

## 🔐 File Permissions & Security

### Session Data File
- **Location:** `docs/metrics/auto_pr_sessions.json`
- **Permissions:** Read/write by system
- **Backup:** Should be committed to git
- **Sensitive Data:** Contains author names, timestamps, PR numbers

### Session Marker File
- **Location:** `.cursor/.session_id`
- **Permissions:** Read/write by system
- **Backup:** Should be in `.gitignore` (local only)
- **Sensitive Data:** Contains author name, session ID

---

## 🛠️ Maintenance

### Backup Session Data
```bash
# Manual backup
cp docs/metrics/auto_pr_sessions.json \
   docs/metrics/auto_pr_sessions.backup.$(date +%Y%m%d).json
```

### Cleanup Orphaned Sessions
```bash
python .cursor/scripts/auto_pr_session_manager.py cleanup
```

### View Analytics
```bash
python .cursor/scripts/session_analytics.py
```

---

## 📚 Related Files

- **Session Manager:** `.cursor/scripts/auto_pr_session_manager.py`
- **Session Hook:** `.cursor/scripts/cursor_session_hook.py`
- **Minimal Metadata:** `.cursor/scripts/minimal_metadata_system.py`
- **Analytics:** `.cursor/scripts/session_analytics.py`
- **CLI:** `.cursor/scripts/session_cli.py`

---

**Last Updated:** 2025-12-05



