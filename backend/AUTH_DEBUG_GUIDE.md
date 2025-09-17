# Authentication Debug Guide

## Issue: "No tenant ID found" Error

You're experiencing an issue where the `TenantMiddleware` is not finding a tenant ID, even though you've verified it exists in Supabase.

## Debugging Steps

### 1. Check the Backend Logs

With the debugging code I've added, you should now see detailed logs when you try to log in. Look for:

```
=== AUTH DEBUG ===
User ID: [user-id]
User Email: [email]
User Metadata: [metadata-object]
App Metadata: [metadata-object]
==================
```

### 2. Check JWT Token Content

After logging in, you can decode your JWT token to see what's actually in it:

```bash
# In the backend directory
node debug-auth.js "your-jwt-token-here"
```

### 3. Check Supabase User Metadata

In your Supabase dashboard:
1. Go to Authentication > Users
2. Find your user
3. Check the `user_metadata` and `app_metadata` fields
4. Look for `tenant_id` field

### 4. Common Issues and Solutions

#### Issue 1: tenant_id is in user_metadata but not being extracted
**Solution**: The code now checks both `user_metadata.tenant_id` and `app_metadata.tenant_id`

#### Issue 2: tenant_id is null/undefined in Supabase
**Solution**: You need to set the tenant_id in Supabase user metadata:

```sql
-- In Supabase SQL Editor
UPDATE auth.users 
SET user_metadata = user_metadata || '{"tenant_id": "your-tenant-uuid-here"}'
WHERE email = 'your-email@example.com';
```

#### Issue 3: JWT token doesn't contain tenant_id
**Solution**: The login process will now fail with a clear error message if tenant_id is missing

#### Issue 4: Authentication guard not being applied
**Solution**: Make sure your routes are protected with `@UseGuards(JwtAuthGuard)`

### 5. Testing the Fix

1. **Try logging in again** - you should see detailed debug logs
2. **Check the JWT token** - use the debug script to inspect the token
3. **Verify tenant context** - the middleware should now find the tenant_id

### 6. Expected Log Flow

When working correctly, you should see:

```
=== AUTH DEBUG ===
User ID: [uuid]
User Email: [email]
User Metadata: {"tenant_id": "[uuid]", ...}
App Metadata: {...}
==================
JWT Payload: {"sub": "[uuid]", "email": "[email]", "tenant_id": "[uuid]", ...}

=== JWT STRATEGY VALIDATION ===
JWT Payload received: {"sub": "[uuid]", "email": "[email]", "tenant_id": "[uuid]", ...}
User context created: {"userId": "[uuid]", "email": "[email]", "tenantId": "[uuid]", ...}
================================

=== TENANT MIDDLEWARE DEBUG ===
Request User: {"userId": "[uuid]", "email": "[email]", "tenantId": "[uuid]", ...}
Request User TenantId: [uuid]
================================
Tenant context established for tenant: [uuid]
```

### 7. If Still Not Working

If you're still having issues after following these steps:

1. **Share the debug logs** - copy the console output from the backend
2. **Share your JWT token** - use the debug script to show the token contents
3. **Check Supabase user data** - verify the user_metadata contains tenant_id

## Quick Fix Commands

### Set tenant_id in Supabase (if missing):
```sql
UPDATE auth.users 
SET user_metadata = user_metadata || '{"tenant_id": "your-tenant-uuid-here"}'
WHERE email = 'your-email@example.com';
```

### Test JWT token:
```bash
node debug-auth.js "your-jwt-token-here"
```

### Restart backend with debug logs:
```bash
npm run start:dev
```
