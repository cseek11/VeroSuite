# Swagger UI Route Fix

**Issue:** 404 error when trying to POST to `/compliance/checks`  
**Date:** 2025-11-24

---

## ✅ Correct Route Path

The compliance endpoints use API versioning. The correct path is:

```
POST /api/v1/compliance/checks
```

**Not:** `/compliance/checks` ❌

---

## 🔍 Route Configuration

- **Global Prefix:** `api` (set in `main.ts`)
- **Version Prefix:** `v` (URI versioning)
- **Default Version:** `1`
- **Controller Path:** `compliance`
- **Controller Version:** `1`
- **Endpoint:** `checks`

**Full Path:** `/api` + `/v1` + `/compliance` + `/checks` = `/api/v1/compliance/checks`

---

## 📝 How to Use in Swagger UI

### Option 1: Find the Correct Endpoint

1. Open: `http://localhost:3001/api/docs`
2. Look for the **"Compliance"** tag section
3. Find: **`POST /api/v1/compliance/checks`**
4. Click **"Try it out"**
5. Enter your test data
6. Click **"Execute"**

### Option 2: Search in Swagger

1. Use the search box at the top of Swagger UI
2. Search for: `compliance checks`
3. Click on the correct endpoint: `POST /api/v1/compliance/checks`

### Option 3: Direct URL

If Swagger UI shows the wrong path, you can manually test with curl:

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pr_number": 999,
    "commit_sha": "test-123",
    "rule_id": "R01",
    "status": "VIOLATION",
    "severity": "WARNING",
    "violation_message": "Test violation"
  }' \
  http://localhost:3001/api/v1/compliance/checks
```

---

## ✅ All Compliance Endpoints

All compliance endpoints follow the same pattern:

- `GET /api/v1/compliance/rules`
- `GET /api/v1/compliance/checks`
- `POST /api/v1/compliance/checks` ← **This one**
- `GET /api/v1/compliance/pr/{prNumber}`
- `GET /api/v1/compliance/pr/{prNumber}/score`
- `GET /api/v1/compliance/trends`

---

## 🐛 Troubleshooting

### Issue: Still getting 404

**Check:**
1. Is the API server running? (`http://localhost:3001/api`)
2. Is ComplianceModule imported in AppModule? ✅ (verified)
3. Is the controller registered? ✅ (verified)

**Verify route is registered:**
```bash
# Check if server is running
curl http://localhost:3001/api

# Check Swagger document
curl http://localhost:3001/api/docs-json | grep -i compliance
```

### Issue: Swagger shows wrong path

**Fix:**
- Refresh Swagger UI (Ctrl+F5)
- Check browser console for errors
- Verify API server restarted after code changes

---

**Last Updated:** 2025-11-24  
**Status:** Route is correctly configured, use `/api/v1/compliance/checks`

