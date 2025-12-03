# cURL Command Fix for Compliance Checks

**Issue:** Swagger UI generates curl command without `/api/v1` prefix  
**Date:** 2025-11-24

---

## ❌ Wrong cURL (from Swagger UI)

```bash
curl -X 'POST' \
  'http://localhost:3001/compliance/checks' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
     "pr_number": 999,
     "commit_sha": "test-123",
     "rule_id": "R01",
     "status": "VIOLATION",
     "severity": "WARNING",
     "violation_message": "Test violation"
   }'
```

**Result:** `404 Not Found`

---

## ✅ Correct cURL Command

```bash
curl -X POST \
  "http://localhost:3001/api/v1/compliance/checks" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
     "pr_number": 999,
     "commit_sha": "test-123",
     "rule_id": "R01",
     "status": "VIOLATION",
     "severity": "WARNING",
     "violation_message": "Test violation"
   }'
```

**Key Changes:**
1. ✅ Added `/api/v1` prefix: `http://localhost:3001/api/v1/compliance/checks`
2. ✅ Added `Authorization` header with your JWT token

---

## 🔑 How to Get Your Token

### Option 1: From Swagger UI

1. Open: `http://localhost:3001/api/docs`
2. Click **"Authorize"** button (top right)
3. Enter credentials and click **"Authorize"**
4. Copy the token from the authorization dialog

### Option 2: Login via API

```bash
curl -X POST \
  "http://localhost:3001/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "your-email@example.com",
    "tenantId": "..."
  }
}
```

Copy the `access_token` value.

---

## 📝 Complete Example

```bash
# Step 1: Login and get token
TOKEN=$(curl -s -X POST \
  "http://localhost:3001/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }' | jq -r '.access_token')

# Step 2: Create compliance check
curl -X POST \
  "http://localhost:3001/api/v1/compliance/checks" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
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

## ✅ Expected Response

```json
{
  "message": "Compliance check queued successfully",
  "queued": true
}
```

---

## 🐛 Troubleshooting

### Issue: Still getting 404

**Check:**
1. Is the URL correct? Must include `/api/v1/`
2. Is the API server running? `http://localhost:3001/api`
3. Did you include the Authorization header?

### Issue: 401 Unauthorized

**Fix:**
- Make sure you included the `Authorization: Bearer YOUR_TOKEN` header
- Verify your token is valid (not expired)
- Try logging in again to get a fresh token

### Issue: 400 Bad Request

**Check:**
- All required fields are present
- Field types are correct (pr_number is number, not string)
- Status and severity values are valid enums

---

## 📋 All Compliance Endpoints

All endpoints follow the same pattern with `/api/v1/` prefix:

- `GET /api/v1/compliance/rules`
- `GET /api/v1/compliance/checks`
- `POST /api/v1/compliance/checks` ← **This one**
- `GET /api/v1/compliance/pr/{prNumber}`
- `GET /api/v1/compliance/pr/{prNumber}/score`
- `GET /api/v1/compliance/trends`

---

**Last Updated:** 2025-11-30  
**Status:** Use `/api/v1/compliance/checks` with Authorization header



