# JWT_SECRET Loading Fix

**Date:** 2025-11-22  
**Issue:** JWT_SECRET environment variable not loaded when auth.module.ts initializes

## Problem

The API server failed to start with error:
```
Error: JWT_SECRET environment variable is required
at Object.<anonymous> (auth.module.js:22:11)
```

**Root Cause:** The `auth.module.ts` was checking `process.env.JWT_SECRET` at module load time (line 14), which happens **before** NestJS ConfigModule loads the `.env` file. This is a timing issue - the module is imported before the ConfigModule has a chance to read the environment variables.

## Solution

✅ **Changed from synchronous to asynchronous JWT module registration:**

**Before:**
```typescript
// Check at module load time (too early!)
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '24h' },
})
```

**After:**
```typescript
JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    return {
      secret: jwtSecret,
      signOptions: { expiresIn: '24h' },
    };
  },
  inject: [ConfigService],
})
```

## Why This Works

1. **`registerAsync()`** delays the JWT module initialization until after ConfigModule has loaded
2. **`ConfigService`** is injected, which has access to all environment variables loaded from `.env`
3. **Factory function** runs after ConfigModule initialization, ensuring environment variables are available

## Files Changed

- ✅ `apps/api/src/auth/auth.module.ts` - Changed to use `JwtModule.registerAsync()` with ConfigService

## Verification

✅ **Build successful**  
✅ **No linter errors**  
✅ **Ready to test**

## To Test

```bash
cd apps/api
npm run start:dev
```

The server should now start successfully with the `.env` file in `apps/api/.env`.

---

**Last Updated:** 2025-11-22




