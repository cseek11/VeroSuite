# Authentication Setup Guide

**Date:** 2025-11-24  
**Purpose:** How to get valid credentials for testing API endpoints

---

## ✅ Good News: Route is Working!

The **401 Unauthorized** error means:
- ✅ Route is correct: `/api/v1/auth/login` works
- ✅ Server is responding correctly
- ❌ Credentials are invalid (email/password don't match)

---

## 🔑 How to Get Valid Credentials

### Option 1: Use Existing User (If Available)

If you have an existing user account:
1. Use your actual email and password
2. Make sure the user exists in Supabase Auth
3. Make sure the user exists in the database (`users` table)

### Option 2: Create User via Supabase Dashboard

1. **Go to Supabase Dashboard:**
   - URL: `https://supabase.com/dashboard`
   - Navigate to your project

2. **Go to Authentication → Users**

3. **Click "Add User" or "Create User"**

4. **Enter:**
   - Email: `test@example.com` (or your choice)
   - Password: `TestPassword123!` (or your choice)
   - Auto Confirm: ✅ (check this to skip email verification)

5. **Create the user**

6. **Verify user exists in database:**
   ```sql
   SELECT * FROM users WHERE email = 'test@example.com';
   ```
   
   If not found, you may need to:
   - Run database seed script
   - Or manually create user record with matching `id` and `tenant_id`

### Option 3: Use Test Credentials (If Seeded)

Based on test files, these credentials might exist:

**Test User (if seeded):**
- Email: `test@veropest.com`
- Password: `TestPassword123!`
- Tenant ID: `7193113e-ece2-4f7b-ae8c-176df4367e28`

**Test Users from test setup:**
- Admin: `test-user-admin@test.example.com`
- Password: `Test123!@#`

---

## 🔍 V1 vs V2 Authentication

### V1 (Deprecated) ⚠️

**Route:** `/api/v1/auth/login`  
**Status:** Deprecated (will be removed)

**Response Headers:**
- `deprecation: true`
- `link: </api/v2/auth/login>; rel="successor-version"`
- `sunset: Tue,24 Nov 2026 17:01:58 GMT` (deprecation date)

**Response Format:**
```json
{
  "access_token": "eyJ...",
  "user": { ... }
}
```

### V2 (Recommended) ✅

**Route:** `/api/v2/auth/login`  
**Status:** Current (recommended)

**Response Format:**
```json
{
  "data": {
    "access_token": "eyJ...",
    "user": { ... }
  },
  "meta": {
    "version": "2.0",
    "timestamp": "2025-11-24T17:02:42.000Z"
  }
}
```

**Features:**
- Idempotency support
- Version header
- Timestamp
- Consistent API structure

---

## 🚀 Quick Test

### Try V2 (Recommended)

```bash
curl -X POST \
  "http://localhost:3001/api/v2/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

### Or V1 (If Needed)

```bash
curl -X POST \
  "http://localhost:3001/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

---

## 📝 Important Notes

### User Must Exist in Both Places

1. **Supabase Auth** (for authentication)
   - Check: Supabase Dashboard → Authentication → Users

2. **Database** (for user data)
   - Check: `users` table in database
   - Must have matching `id` and `tenant_id`

### If User Doesn't Exist in Database

The login will fail with "User not found in database" even if Supabase auth succeeds.

**Fix:**
- Run seed script: `npx ts-node libs/common/prisma/seed.ts`
- Or manually create user record with matching `id` from Supabase

---

## 🐛 Troubleshooting

### Issue: 401 Invalid Credentials

**Causes:**
- Email doesn't exist in Supabase
- Password is wrong
- User not confirmed (if email verification required)

**Fix:**
- Create user in Supabase Dashboard
- Use correct password
- Enable "Auto Confirm" when creating test user

### Issue: User Not Found in Database

**Error:** "User not found in database"

**Causes:**
- User exists in Supabase but not in database
- User ID mismatch

**Fix:**
- Check if user exists: `SELECT * FROM users WHERE email = '...'`
- Create user record with matching Supabase user ID
- Ensure `tenant_id` is set

---

## ✅ Success Indicators

After successful login, you'll get:

**V1 Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "...",
    "tenantId": "..."
  }
}
```

**V2 Response:**
```json
{
  "data": {
    "access_token": "eyJ...",
    "user": { ... }
  },
  "meta": {
    "version": "2.0",
    "timestamp": "..."
  }
}
```

---

**Last Updated:** 2025-11-24  
**Status:** Use V2 for new code, V1 is deprecated

