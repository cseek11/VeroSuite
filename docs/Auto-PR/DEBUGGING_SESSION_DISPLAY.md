# Debugging: Sessions Not Showing on Dashboard

**Date:** 2025-11-20  
**Issue:** Active session created but not appearing on dashboard

---

## Quick Checks

### 1. **Verify Session is in File**
```bash
# Check if session exists in the JSON file
python -c "import json; f = open('docs/metrics/auto_pr_sessions.json', 'r'); data = json.load(f); print('Active sessions:', len(data.get('active_sessions', {}))); print('Session IDs:', list(data.get('active_sessions', {}).keys())); f.close()"
```

**Expected:** Should show at least 1 active session with your session ID.

### 2. **Check Backend Logs**
When you access `/sessions` page, check the backend console for:
- `Loading session data` log
- `Session data loaded from file` debug log
- Any error messages

**Look for:**
- File path being used
- Number of active sessions found
- Any file read errors

### 3. **Check Frontend Console**
Open browser DevTools → Console and look for:
- `[useAutoPRSessions]` logs
- `Raw session data received from API` debug log
- Any error messages

**Look for:**
- Active session IDs in the log
- API response data
- Any fetch errors

### 4. **Check Network Tab**
Open browser DevTools → Network:
1. Filter by "sessions"
2. Find the request to `/api/v1/sessions`
3. Click on it
4. Check:
   - **Status:** Should be 200
   - **Response:** Should contain `active_sessions` object
   - **Headers:** Should include `Authorization: Bearer ...`

### 5. **Restart Backend**
The backend might need to be restarted to pick up file changes:
```bash
# Stop backend (Ctrl+C)
cd backend
npm run start:dev
```

### 6. **Hard Refresh Frontend**
Clear cache and refresh:
- **Chrome/Edge:** Ctrl+Shift+R or Ctrl+F5
- **Firefox:** Ctrl+Shift+R

---

## Common Issues

### Issue 1: Backend Not Reading File
**Symptom:** Backend logs show "Session data file not found"

**Solution:**
- Verify backend is running from project root (not `backend/` directory)
- Check `process.cwd()` in backend logs
- Verify file path: `docs/metrics/auto_pr_sessions.json` exists

### Issue 2: API Returns Empty Data
**Symptom:** Network tab shows 200 response but `active_sessions: {}`

**Solution:**
- Check backend logs for file read errors
- Verify JSON file is valid (no syntax errors)
- Check file permissions

### Issue 3: Frontend Not Receiving Data
**Symptom:** Network tab shows correct data but dashboard shows "No active sessions"

**Solution:**
- Check browser console for errors
- Verify `setSessions(data)` is being called
- Check if `sessions.active_sessions` is populated in React DevTools

### Issue 4: Authentication Issue
**Symptom:** 401 Unauthorized error

**Solution:**
- Verify JWT token is being sent (check Network tab headers)
- Check if token is valid (not expired)
- Re-login if needed

---

## Manual Test

Test the API endpoint directly:

```bash
# Get your JWT token from browser localStorage
# Then test with curl (PowerShell):
$token = "YOUR_JWT_TOKEN_HERE"
Invoke-WebRequest -Uri "http://localhost:3001/api/v1/sessions" -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} | Select-Object -ExpandProperty Content
```

**Expected Response:**
```json
{
  "active_sessions": {
    "unknown-20251119-2155": {
      "session_id": "unknown-20251119-2155",
      "author": "unknown",
      ...
    }
  },
  "completed_sessions": []
}
```

---

## Next Steps

1. **Check backend logs** when accessing `/sessions` page
2. **Check browser console** for debug logs
3. **Check Network tab** for API response
4. **Restart backend** if needed
5. **Hard refresh frontend** to clear cache

If still not working, share:
- Backend console logs
- Browser console logs
- Network tab response








