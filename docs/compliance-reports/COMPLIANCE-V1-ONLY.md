# Compliance API - V1 Only

**Date:** 2025-11-24  
**Status:** Compliance module currently only has v1 endpoints

---

## ✅ Current Status

**Compliance Module:**
- ✅ Only has **v1** endpoints (`/api/v1/compliance/*`)
- ✅ All endpoints working correctly
- ✅ No v2 controller exists yet

**Auth Module:**
- ✅ Has both **v1** (deprecated) and **v2** (recommended)
- ✅ V2 recommended for new code

---

## 📋 Available Compliance Endpoints (V1)

All compliance endpoints are available at `/api/v1/compliance/*`:

- `GET /api/v1/compliance/rules` - Get all rule definitions
- `GET /api/v1/compliance/checks` - Get compliance checks
- `POST /api/v1/compliance/checks` - Create compliance check ✅ **Working!**
- `GET /api/v1/compliance/pr/{prNumber}` - Get PR compliance
- `GET /api/v1/compliance/pr/{prNumber}/score` - Get PR compliance score
- `GET /api/v1/compliance/trends` - Get compliance trends

---

## 🔍 Why No V2?

**Reasons:**
1. Compliance module is new (Phase 3 implementation)
2. V1 endpoints are working correctly
3. No breaking changes needed yet
4. Can add v2 later if needed

**Comparison:**
- **Auth:** Had v1 for a while, needed v2 for better structure
- **Compliance:** Brand new, v1 is sufficient for now

---

## ✅ Using V1 Compliance Endpoints

**With V2 Auth Token:**

You can use your v2 auth token with v1 compliance endpoints:

```bash
# Get token from v2 auth
TOKEN=$(curl -s -X POST \
  "http://localhost:3001/api/v2/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "...", "password": "..."}' \
  | jq -r '.data.access_token')

# Use token with v1 compliance endpoints
curl -X POST \
  "http://localhost:3001/api/v1/compliance/checks" \
  -H "Authorization: Bearer $TOKEN" \
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

**This works perfectly!** ✅

---

## 🚀 Adding V2 Support (If Needed)

If you want v2 compliance endpoints, we can:

1. **Create `ComplianceV2Controller`** (similar to `AuthV2Controller`)
2. **Wrap responses in `{ data, meta }` structure**
3. **Add idempotency support**
4. **Add version headers**

**But it's not necessary** - v1 works fine for compliance endpoints.

---

## 📝 Recommendation

**For Compliance Endpoints:**
- ✅ Use **v1** endpoints (`/api/v1/compliance/*`)
- ✅ They work correctly
- ✅ No deprecation warnings (unlike auth v1)
- ✅ Can add v2 later if needed

**For Authentication:**
- ✅ Use **v2** (`/api/v2/auth/login`)
- ✅ Better structure
- ✅ Recommended

**Mixed Usage is Fine:**
- V2 auth token + V1 compliance endpoints = ✅ Works perfectly!

---

## ✅ Success Confirmation

Your compliance check was successfully queued:
```json
{
  "message": "Compliance check queued successfully",
  "queued": true
}
```

**Next Steps:**
1. Wait 5-10 seconds for queue to process
2. Check `compliance_checks` table for your check
3. View in dashboard: `http://localhost:5173/compliance`

---

**Last Updated:** 2025-11-24  
**Status:** V1 compliance endpoints working correctly, v2 not needed yet

