# ConfigService Async Module Registration Pattern

**Pattern ID:** `backend/config-service-async-module-registration`  
**Domain:** Backend  
**Complexity:** Medium  
**Source PR:** Phase 2 Backend Migration  
**Created:** 2025-11-22  
**Status:** ✅ Approved

---

## WHEN

Use this pattern when:
- A NestJS module needs to access environment variables during initialization
- The module is imported before ConfigModule has loaded `.env` file
- You need to avoid checking `process.env` at module load time (top-level)

**Problem:** Checking `process.env` at module load time fails because ConfigModule hasn't loaded environment variables yet.

---

## DO

Use `registerAsync()` with `ConfigService` instead of synchronous `register()`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    ConfigModule, // Ensure ConfigModule is imported
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        const traceId = randomUUID(); // Generate trace ID for error tracking
        
        if (!jwtSecret) {
          throw new Error(
            `JWT_SECRET environment variable is required [traceId: ${traceId}]`
          );
        }
        
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: '24h' },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
```

---

## WHY

**Principle:** Environment variables must be loaded by ConfigModule before modules try to use them.

**Benefits:**
- ✅ Environment variables are available when factory function runs
- ✅ Proper error handling with trace context
- ✅ Works with `.env` files and ConfigModule
- ✅ Type-safe with ConfigService

**Anti-Pattern (Don't Do This):**
```typescript
// ❌ BAD: Checks process.env at module load time
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET required');
}

JwtModule.register({
  secret: process.env.JWT_SECRET, // Will be undefined!
})
```

---

## EXAMPLE

**File:** `apps/api/src/auth/auth.module.ts`  
**Lines:** 17-30  
**Context:** JWT module initialization with environment variable validation

---

## METADATA

- **domain:** backend
- **complexity:** medium
- **source_pr:** Phase 2 Backend Migration
- **created_at:** 2025-11-22
- **author:** AI Agent
- **related_patterns:**
  - `backend/structured-logging`
  - `infrastructure/trace-propagation`

---

## TESTING

Always test that:
1. Module initializes correctly when environment variable is set
2. Error is thrown when environment variable is missing
3. Error includes traceId for debugging
4. Error is thrown at correct time (after ConfigModule loads)

**Test Example:**
```typescript
it('should throw error when JWT_SECRET is missing', async () => {
  delete process.env.JWT_SECRET;
  
  await expect(
    Test.createTestingModule({
      imports: [ConfigModule.forRoot(), AuthModule],
    }).compile(),
  ).rejects.toThrow('JWT_SECRET environment variable is required');
});
```

---

**Last Updated:** 2025-11-22



