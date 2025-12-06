# Authentication API v1 vs v2

**Date:** 2025-12-05  
**Purpose:** Explain the difference between Authentication API v1 and v2

---

## 🔍 Key Differences

### Authentication V1 (Deprecated)

**Route:** `/api/v1/auth/login`  
**Status:** ⚠️ Deprecated (marked for removal)

**Features:**
- Basic response format (direct data)
- Uses `DeprecationInterceptor` (adds deprecation warnings)
- Simple response structure

**Response Format:**
```json
{
  "access_token": "eyJ...",
  "user": {
    "id": "...",
    "email": "...",
    "tenantId": "..."
  }
}
```

**Use Case:**
- Legacy support
- Backward compatibility
- Will be removed in future version

---

### Authentication V2 (Recommended)

**Route:** `/api/v2/auth/login`  
**Status:** ✅ Current (recommended)

**Features:**
- Enhanced response format with metadata
- Uses `IdempotencyInterceptor` (prevents duplicate requests)
- Consistent API structure
- Version header included (`API-Version: 2.0`)
- Timestamp in response

**Response Format:**
```json
{
  "data": {
    "access_token": "eyJ...",
    "user": {
      "id": "...",
      "email": "...",
      "tenantId": "..."
    }
  },
  "meta": {
    "version": "2.0",
    "timestamp": "2025-12-05T16:57:19.000Z"
  }
}
```

**Use Case:**
- New integrations
- Recommended for all new code
- Better error handling
- Idempotency support

---

## 📋 Comparison Table

| Feature | V1 (Deprecated) | V2 (Current) |
|---------|----------------|--------------|
| **Route** | `/api/v1/auth/login` | `/api/v2/auth/login` |
| **Response Format** | Direct data | Wrapped in `{ data, meta }` |
| **Version Header** | ❌ No | ✅ Yes (`API-Version: 2.0`) |
| **Timestamp** | ❌ No | ✅ Yes |
| **Idempotency** | ❌ No | ✅ Yes |
| **Deprecation Warning** | ✅ Yes | ❌ No |
| **Status** | ⚠️ Deprecated | ✅ Recommended |

---

## 🚀 Which One to Use?

### Use V2 (Recommended)

**For:**
- ✅ New integrations
- ✅ New features
- ✅ Better error handling needed
- ✅ Idempotency required

**Example:**
```bash
curl -X POST \
  "http://localhost:3001/api/v2/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "data": {
    "access_token": "eyJ...",
    "user": { ... }
  },
  "meta": {
    "version": "2.0",
    "timestamp": "2025-12-05T16:57:19.000Z"
  }
}
```

### Use V1 (Only if needed)

**For:**
- ⚠️ Legacy code compatibility
- ⚠️ Existing integrations
- ⚠️ Temporary migration period

**Example:**
```bash
curl -X POST \
  "http://localhost:3001/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "user": { ... }
}
```

---

## 🔧 Implementation Details

### V1 Controller

```typescript
@ApiTags('Authentication V1 (Deprecated)')
@Controller({ path: 'auth', version: '1' })
@UseInterceptors(DeprecationInterceptor)
export class AuthController {
  // Direct response
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(...);
  }
}
```

### V2 Controller

```typescript
@ApiTags('Authentication V2')
@Controller({ path: 'auth', version: '2' })
@UseInterceptors(IdempotencyInterceptor)
export class AuthV2Controller {
  // Wrapped response with metadata
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(...);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }
}
```

---

## 📝 Migration Guide

### From V1 to V2

**Before (V1):**
```typescript
const response = await fetch('/api/v1/auth/login', { ... });
const { access_token, user } = response;
```

**After (V2):**
```typescript
const response = await fetch('/api/v2/auth/login', { ... });
const { data, meta } = response;
const { access_token, user } = data;
```

---

## ✅ Recommendation

**Use V2 for all new code:**
- Better structure
- Future-proof
- Enhanced features
- Consistent with modern API patterns

**V1 will be removed in a future version.**

---

**Last Updated:** 2025-12-05  
**Status:** V2 is recommended, V1 is deprecated



