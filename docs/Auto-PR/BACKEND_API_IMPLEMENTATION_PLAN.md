# Backend API Implementation Plan for Auto-PR Sessions

**Last Updated:** 2025-11-19  
**Status:** 📋 **Planning** - Ready for Implementation

---

## 🎯 Goal

Create a NestJS backend API endpoint (`/api/sessions`) that serves real Auto-PR session data to the React dashboard, replacing the current test data fallback.

---

## 📁 Files to Create

### 1. **Sessions Module** (`backend/src/sessions/sessions.module.ts`)
- NestJS module that exports SessionsController and SessionsService
- Registers the module in `app.module.ts`

### 2. **Sessions Controller** (`backend/src/sessions/sessions.controller.ts`)
- `GET /api/sessions` - Get all sessions (active + completed)
- `GET /api/sessions/:id` - Get specific session details
- `POST /api/sessions/:id/complete` - Manually complete a session
- Uses JWT authentication guard
- Returns data in format expected by frontend

### 3. **Sessions Service** (`backend/src/sessions/sessions.service.ts`)
- Reads from `docs/metrics/auto_pr_sessions.json`
- Reads from `.cursor/data/session_state.json` (minimal metadata)
- Optionally merges with `docs/metrics/reward_scores.json` for score breakdowns
- Transforms data to match frontend `SessionData` interface
- Handles file reading errors gracefully

### 4. **Sessions DTOs** (`backend/src/sessions/dto/`)
- `session-response.dto.ts` - Response DTO matching frontend interface
- Optional: Request DTOs for POST endpoints

---

## 🔧 Implementation Details

### Data Sources

1. **Primary:** `docs/metrics/auto_pr_sessions.json`
   - Contains: `active_sessions`, `completed_sessions`
   - Updated by: `auto_pr_session_manager.py`

2. **Secondary:** `.cursor/data/session_state.json`
   - Contains: Minimal session metadata
   - Updated by: `minimal_metadata_system.py`

3. **Score Data:** `docs/metrics/reward_scores.json`
   - Contains: PR scores with breakdowns and file_scores
   - Used to enrich completed sessions with score details

### Data Transformation

The service needs to:
1. Load session data from JSON files
2. Match session PRs with reward scores
3. Merge breakdown and file_scores into session objects
4. Transform to match frontend `SessionData` interface:

```typescript
interface SessionData {
  active_sessions: Record<string, Session>;
  completed_sessions: Session[];
}

interface Session {
  session_id: string;
  author: string;
  started: string;
  last_activity?: string;
  completed?: string;
  prs: string[];
  total_files_changed: number;
  test_files_added: number;
  status?: 'active' | 'idle' | 'warning';
  final_score?: number;
  duration_minutes?: number;
  breakdown?: ScoreBreakdown;
  file_scores?: Record<string, FileScore>;
  metadata?: {
    pr?: string;
    computed_at?: string;
    session_id?: string;
  };
}
```

### Error Handling

- File not found → Return empty data (no sessions)
- Invalid JSON → Log error, return empty data
- Missing reward scores → Return sessions without breakdown data
- Network errors → Return appropriate HTTP status codes

---

## 📝 Step-by-Step Implementation

### Step 1: Create Sessions Module Structure

```bash
mkdir -p backend/src/sessions/dto
```

### Step 2: Create Sessions Service

**File:** `backend/src/sessions/sessions.service.ts`

**Key Methods:**
- `getAllSessions()` - Load and merge all session data
- `getSessionById(id: string)` - Get specific session
- `completeSession(id: string)` - Mark session as complete
- `loadSessionData()` - Read from `auto_pr_sessions.json`
- `loadStateData()` - Read from `session_state.json`
- `loadRewardScores()` - Read from `reward_scores.json`
- `mergeScoreData(sessions, scores)` - Merge score breakdowns

### Step 3: Create Sessions Controller

**File:** `backend/src/sessions/sessions.controller.ts`

**Endpoints:**
```typescript
@Get() // GET /api/sessions
async getAllSessions() {
  return this.sessionsService.getAllSessions();
}

@Get(':id') // GET /api/sessions/:id
async getSessionById(@Param('id') id: string) {
  return this.sessionsService.getSessionById(id);
}

@Post(':id/complete') // POST /api/sessions/:id/complete
async completeSession(@Param('id') id: string) {
  return this.sessionsService.completeSession(id);
}
```

### Step 4: Create Sessions Module

**File:** `backend/src/sessions/sessions.module.ts`

```typescript
@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
```

### Step 5: Register Module in App

**File:** `backend/src/app.module.ts`

Add `SessionsModule` to imports array.

### Step 6: Update Frontend Hook (Optional)

The frontend hook already calls `/api/sessions`, so no changes needed once the backend is ready.

---

## 🔍 File Path Resolution

Since the backend runs from `backend/` directory, file paths need to be relative to project root:

```typescript
// In sessions.service.ts
const SESSION_DATA_FILE = path.join(process.cwd(), 'docs', 'metrics', 'auto_pr_sessions.json');
const STATE_FILE = path.join(process.cwd(), '.cursor', 'data', 'session_state.json');
const REWARD_SCORES_FILE = path.join(process.cwd(), 'docs', 'metrics', 'reward_scores.json');
```

**Note:** `process.cwd()` should resolve to project root when backend runs from `backend/` directory.

---

## 🧪 Testing

### Manual Testing

1. Start backend: `cd backend && npm run start:dev`
2. Test endpoint: `curl http://localhost:3001/api/sessions`
3. Verify response matches frontend interface
4. Check frontend dashboard loads real data

### Unit Tests

Create `backend/src/sessions/sessions.service.spec.ts`:
- Test file reading
- Test data transformation
- Test error handling
- Test score merging logic

---

## 📊 Data Flow

```
Frontend (React)
    ↓ fetch('/api/sessions')
Backend Controller
    ↓ getAllSessions()
Backend Service
    ↓ loadSessionData() + loadRewardScores()
JSON Files (docs/metrics/, .cursor/data/)
    ↓ merge & transform
Backend Service
    ↓ return SessionData
Backend Controller
    ↓ JSON response
Frontend Hook
    ↓ setSessions(data)
React Component
    ↓ render dashboard
```

---

## ✅ Checklist

- [ ] Create `backend/src/sessions/` directory
- [ ] Create `sessions.service.ts` with file reading logic
- [ ] Create `sessions.controller.ts` with endpoints
- [ ] Create `sessions.module.ts`
- [ ] Register `SessionsModule` in `app.module.ts`
- [ ] Implement data transformation logic
- [ ] Implement score merging logic
- [ ] Add error handling
- [ ] Add logging
- [ ] Test endpoints manually
- [ ] Update frontend hook (if needed)
- [ ] Remove test data fallback from frontend (optional)

---

## 🚀 Next Steps After Implementation

1. **Remove Test Data Fallback** (optional)
   - Once backend is working, remove the `reward_scores.json` fallback from `useAutoPRSessions.ts`
   - Keep it as a backup for development

2. **Add Caching** (future enhancement)
   - Cache session data in Redis
   - Invalidate on session updates
   - Reduce file I/O

3. **Add WebSocket Updates** (future enhancement)
   - Push session updates to frontend in real-time
   - Use existing WebSocket infrastructure

4. **Add Session Analytics** (future enhancement)
   - Aggregate statistics
   - Trend analysis
   - Performance metrics

---

## 📚 References

- Frontend Hook: `frontend/src/hooks/useAutoPRSessions.ts`
- Session Manager Script: `.cursor/scripts/auto_pr_session_manager.py`
- Minimal Metadata System: `.cursor/scripts/minimal_metadata_system.py`
- Session Data File: `docs/metrics/auto_pr_sessions.json`
- Reward Scores File: `docs/metrics/reward_scores.json`

---

**Ready to implement?** Start with Step 1 and work through the checklist!

