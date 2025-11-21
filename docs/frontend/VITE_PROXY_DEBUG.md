# Vite Proxy Debug Guide

**Error:** `ECONNREFUSED` when proxying `/api/v1/sessions` to `http://localhost:3001`

---

## Diagnosis

### ✅ Backend Server Status
- **Port 3001:** ✅ Listening (PID 21564)
- **Endpoint:** ✅ `/api/v1/sessions` exists
- **Response:** ✅ Server responds (401 Unauthorized without auth - expected)

### ❌ Vite Proxy Issue
- **Error:** `ECONNREFUSED` when Vite tries to proxy requests
- **Possible Causes:**
  1. IPv4/IPv6 mismatch (server on IPv6, Vite trying IPv4)
  2. Connection timing issues
  3. Proxy configuration needs explicit host binding

---

## Solution

### Option 1: Update Vite Config (Recommended)

Updated `frontend/vite.config.ts` to:
- Add error logging to proxy
- Add request logging for debugging
- Ensure proper connection handling

### Option 2: Use Explicit IPv4 Address

If IPv6 is causing issues, change proxy target to:
```typescript
target: 'http://127.0.0.1:3001',  // Explicit IPv4
```

### Option 3: Check Backend Binding

Ensure backend is listening on all interfaces:
```typescript
// In backend/src/main.ts
await app.listen(port, '0.0.0.0');  // Listen on all interfaces
```

---

## Verification Steps

1. **Check if backend is running:**
   ```powershell
   netstat -ano | findstr ":3001"
   ```

2. **Test backend directly:**
   ```powershell
   curl http://localhost:3001/api/v1/sessions
   # Should return 401 Unauthorized (expected without auth)
   ```

3. **Test with IPv4 explicitly:**
   ```powershell
   curl http://127.0.0.1:3001/api/v1/sessions
   ```

4. **Check Vite dev server logs:**
   - Look for proxy error messages
   - Check if requests are being proxied

---

## Common Issues

### Issue 1: Backend Not Running
**Symptom:** `ECONNREFUSED`  
**Solution:** Start backend server
```powershell
cd backend
npm run start:dev
```

### Issue 2: Port Mismatch
**Symptom:** Connection refused  
**Solution:** Verify backend port matches Vite proxy target

### Issue 3: IPv6/IPv4 Mismatch
**Symptom:** Connection refused on localhost  
**Solution:** Use explicit `127.0.0.1` instead of `localhost`

### Issue 4: CORS Issues
**Symptom:** 401/403 errors  
**Solution:** Check backend CORS configuration includes `http://localhost:5173`

---

## Current Configuration

**Vite Proxy:**
- Target: `http://localhost:3001`
- Path: `/api`
- Port: 5173

**Backend:**
- Port: 3001
- Global Prefix: `/api`
- Version: `/v1`
- Endpoint: `/api/v1/sessions`

**Full URL:** `http://localhost:5173/api/v1/sessions` → `http://localhost:3001/api/v1/sessions`

---

## Next Steps

1. ✅ Updated Vite config with error logging
2. ⏳ Restart Vite dev server
3. ⏳ Check console for proxy error details
4. ⏳ Verify requests are being proxied correctly

---

**Last Updated:** 2025-11-21




