# All Routes Require /api/v1 Prefix

**Date:** 2025-11-24  
**Issue:** All API routes require `/api/v1` prefix, but Swagger UI shows paths without it

---

## ✅ Correct Route Format

**All API routes follow this pattern:**
```
/api/v1/{controller-path}/{endpoint}
```

**Where:**
- `/api` = Global prefix
- `/v1` = API version
- `{controller-path}` = Controller path (e.g., `auth`, `compliance`)
- `{endpoint}` = Endpoint path (e.g., `login`, `checks`)

---

## 📋 Common Routes

### Authentication Routes
- ✅ `POST /api/v1/auth/login`
- ✅ `POST /api/v1/auth/refresh`
- ✅ `GET /api/v1/auth/me`
- ✅ `POST /api/v1/auth/exchange-supabase-token`

### Compliance Routes
- ✅ `GET /api/v1/compliance/rules`
- ✅ `GET /api/v1/compliance/checks`
- ✅ `POST /api/v1/compliance/checks`
- ✅ `GET /api/v1/compliance/pr/{prNumber}`
- ✅ `GET /api/v1/compliance/pr/{prNumber}/score`
- ✅ `GET /api/v1/compliance/trends`

---

## 🔍 Why Swagger Shows Different Paths

**Swagger UI displays:**
- `/auth/login`
- `/compliance/checks`

**But actual routes are:**
- `/api/v1/auth/login`
- `/api/v1/compliance/checks`

**This is because:**
1. Swagger shows **relative paths** (without server URL)
2. The **server URL** includes `/api/v1`
3. When you execute in Swagger, it combines: `server URL + relative path`

---

## ✅ How to Use in Swagger UI

### Option 1: Use Swagger UI (Recommended)

1. **Check Server Selection:**
   - Look for server dropdown (top of Swagger UI)
   - Should show: `http://localhost:3001/api/v1`
   - If not, select it

2. **Find Endpoint:**
   - Look for: `POST /auth/login` (in Authentication section)
   - Or: `POST /compliance/checks` (in Compliance section)

3. **Click "Try it out"**

4. **Swagger automatically uses:**
   - Server URL: `http://localhost:3001/api/v1`
   - + Relative path: `/auth/login`
   - = Full URL: `http://localhost:3001/api/v1/auth/login`

### Option 2: Use cURL (Manual)

**Always include `/api/v1` prefix:**

```bash
# Login
curl -X POST \
  "http://localhost:3001/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'

# Create compliance check
curl -X POST \
  "http://localhost:3001/api/v1/compliance/checks" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pr_number": 999,
    "commit_sha": "test-123",
    "rule_id": "R01",
    "status": "VIOLATION",
    "severity": "WARNING",
    "violation_message": "Test violation"
  }'
```

---

## 🐛 Troubleshooting

### Issue: 404 Not Found

**Check:**
1. Is the URL correct? Must include `/api/v1/`
2. Is the API server running? `http://localhost:3001/api`
3. Did you use the correct HTTP method? (GET vs POST)

**Fix:**
- Always use: `http://localhost:3001/api/v1/{path}`
- Never use: `http://localhost:3001/{path}`

### Issue: Swagger Generated Wrong cURL

**Problem:**
Swagger generates: `http://localhost:3001/auth/login`

**Fix:**
Manually change to: `http://localhost:3001/api/v1/auth/login`

Or check server selection in Swagger UI dropdown.

---

## 📝 Quick Reference

| What You See in Swagger | Actual Route |
|------------------------|--------------|
| `POST /auth/login` | `POST /api/v1/auth/login` |
| `POST /compliance/checks` | `POST /api/v1/compliance/checks` |
| `GET /compliance/rules` | `GET /api/v1/compliance/rules` |

**Rule:** Always add `/api/v1` before the Swagger path!

---

**Last Updated:** 2025-11-30  
**Status:** All routes require `/api/v1` prefix



