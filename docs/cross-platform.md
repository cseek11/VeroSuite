---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - frontend
  - backend
  - mobile
priority: high
last_updated: 2025-12-05
always_apply: true
---

# PRIORITY: HIGH - Cross-Platform Resilience Rules

## Overview

This rule file enforces cross-platform compatibility across web, backend, and mobile platforms. Ensures platform-specific behavior is detected, shared libraries are used, and compatibility is tested.

**⚠️ MANDATORY:** All code must be compatible across platforms, use shared libraries instead of duplicating business logic, and avoid platform-specific APIs without checks.

---

## I. Platform Detection

### Rule 1: Platform-Specific Behavior Detection

**MANDATORY:** Detect platform-specific code:

**Platforms:**
- **Web (Browser)** - `frontend/` - React web application
- **Server (Node.js)** - `apps/api/`, `apps/[service]/` - Backend services
- **Mobile (React Native)** - `VeroFieldMobile/` (or `VeroSuiteMobile/` if directory not yet renamed) - Mobile application

**MANDATORY:** Identify platform-specific code:

```typescript
// ❌ PLATFORM-SPECIFIC: Browser-only API
function getLocalStorage(key: string) {
  return localStorage.getItem(key); // Only available in browser
}

// ✅ CROSS-PLATFORM: Platform detection
function getStorage(key: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(key); // Browser
  } else if (typeof AsyncStorage !== 'undefined') {
    return AsyncStorage.getItem(key); // React Native
  } else {
    // Server-side: use alternative storage
    return null;
  }
}
```

### Rule 2: Platform-Specific API Detection

**MANDATORY:** Detect APIs unsupported on certain platforms:

**Browser-Only APIs:**
- `window`, `document`, `localStorage`, `sessionStorage`
- `navigator`, `location`, `history`
- DOM APIs (`querySelector`, `addEventListener`)

**Node.js-Only APIs:**
- `fs`, `path`, `os`, `crypto` (Node.js crypto)
- `process`, `Buffer`, `__dirname`, `__filename`

**React Native-Only APIs:**
- `AsyncStorage`, `Platform`, `Linking`
- Native modules, device APIs

**MANDATORY:** Use platform checks before using platform-specific APIs:

```typescript
// ✅ CORRECT: Platform check
function getPlatform() {
  if (typeof window !== 'undefined') {
    return 'web';
  } else if (typeof process !== 'undefined' && process.versions?.node) {
    return 'server';
  } else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'mobile';
  }
  return 'unknown';
}

function usePlatformAPI() {
  const platform = getPlatform();
  
  if (platform === 'web') {
    return window.localStorage;
  } else if (platform === 'mobile') {
    return AsyncStorage;
  } else {
    // Server: use alternative
    return null;
  }
}
```

---

## II. Shared Library Usage

### Rule 3: Use Shared Libraries

**MANDATORY:** Use shared libraries from `libs/common/` instead of duplicating business logic:

**Shared Libraries:**
- `libs/common/src/types/` - Shared TypeScript types
- `libs/common/src/utils/` - Shared utility functions
- `libs/common/src/kafka/` - Shared Kafka services
- `libs/common/src/prisma/` - Shared Prisma service
- `libs/common/src/cache/` - Shared cache service

**Example:**
```typescript
// ❌ WRONG: Duplicated business logic
// frontend/src/utils/dateUtils.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// VeroFieldMobile/src/utils/dateUtils.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]; // Duplicate!
}

// ✅ CORRECT: Shared library
// libs/common/src/utils/dateUtils.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// frontend/src/utils/dateUtils.ts
export { formatDate } from '@verofield/common/utils/dateUtils';

// VeroFieldMobile/src/utils/dateUtils.ts
export { formatDate } from '@verofield/common/utils/dateUtils';
```

**Reference:** See `.cursor/rules/monorepo.md` for shared library structure.

### Rule 4: Extract to Shared Libraries

**MANDATORY:** Extract business logic to shared libraries when used by 2+ platforms:

**Extraction Criteria:**
- Used by frontend AND backend
- Used by frontend AND mobile
- Used by multiple services
- Business logic (not UI-specific)

**Example:**
```typescript
// ✅ EXTRACT: Business logic used by multiple platforms
// libs/common/src/utils/workOrderUtils.ts
export function calculateWorkOrderTotal(items: WorkOrderItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Used by:
// - frontend/src/components/work-orders/WorkOrderSummary.tsx
// - VeroFieldMobile/src/screens/WorkOrderScreen.tsx
// - apps/api/src/work-orders/work-orders.service.ts
```

---

## III. Platform Compatibility Testing

### Rule 5: Cross-Platform Compatibility Tests

**MANDATORY:** Add compatibility tests across platforms:

```typescript
describe('Cross-Platform Compatibility', () => {
  it('should work on web platform', () => {
    // Mock browser environment
    global.window = { localStorage: mockLocalStorage };
    
    const result = getStorage('key');
    expect(result).toBeDefined();
  });

  it('should work on mobile platform', () => {
    // Mock React Native environment
    global.AsyncStorage = mockAsyncStorage;
    
    const result = getStorage('key');
    expect(result).toBeDefined();
  });

  it('should work on server platform', () => {
    // Mock Node.js environment
    delete global.window;
    delete global.AsyncStorage;
    
    const result = getStorage('key');
    // Server should handle gracefully
    expect(result).toBeNull();
  });
});
```

### Rule 6: Platform Requirement Documentation

**MANDATORY:** Document platform requirements:

```typescript
/**
 * Platform Requirements:
 * - Web: Requires localStorage API
 * - Mobile: Requires AsyncStorage from @react-native-async-storage/async-storage
 * - Server: Uses in-memory cache as fallback
 * 
 * @param key - Storage key
 * @returns Stored value or null
 */
function getStorage(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(key);
  } else if (typeof AsyncStorage !== 'undefined') {
    return AsyncStorage.getItem(key);
  } else {
    // Server-side fallback
    return inMemoryCache.get(key) || null;
  }
}
```

---

## IV. Platform-Specific Code Isolation

### Rule 7: Isolate Platform-Specific Code

**MANDATORY:** Isolate platform-specific code in separate files:

**File Structure:**
```
libs/common/src/utils/
├── dateUtils.ts          # Shared (all platforms)
├── storage.web.ts        # Web-specific
├── storage.mobile.ts     # Mobile-specific
├── storage.server.ts     # Server-specific
└── storage.ts            # Platform-agnostic wrapper
```

**Example:**
```typescript
// libs/common/src/utils/storage.web.ts
export function getStorage(key: string): string | null {
  return localStorage.getItem(key);
}

// libs/common/src/utils/storage.mobile.ts
export async function getStorage(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

// libs/common/src/utils/storage.server.ts
export function getStorage(key: string): string | null {
  return inMemoryCache.get(key) || null;
}

// libs/common/src/utils/storage.ts (Platform-agnostic)
import { getStorage as getStorageWeb } from './storage.web';
import { getStorage as getStorageMobile } from './storage.mobile';
import { getStorage as getStorageServer } from './storage.server';

export function getStorage(key: string): string | null | Promise<string | null> {
  if (typeof window !== 'undefined') {
    return getStorageWeb(key);
  } else if (typeof AsyncStorage !== 'undefined') {
    return getStorageMobile(key);
  } else {
    return getStorageServer(key);
  }
}
```

---

## V. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- Platform-specific code patterns
- Shared library implementations
- Platform compatibility issues
- Cross-platform test examples

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Platform-specific code is isolated
- Shared libraries are used
- Platform checks are present
- Compatibility is considered

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- No platform-specific APIs without checks
- Shared libraries used instead of duplication
- Platform requirements documented
- Compatibility tests planned

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- Platform-specific code isolated
- Shared libraries used
- Compatibility tests pass
- Platform requirements documented
- No platform-specific APIs without checks

---

## Violations

**HARD STOP violations:**
- Using platform-specific APIs without checks
- Duplicating business logic across platforms
- Missing platform compatibility tests
- Breaking cross-platform compatibility

**Must fix before proceeding:**
- Platform-specific code not isolated
- Missing shared library usage
- Missing platform requirement documentation
- Incomplete compatibility tests

---

**Last Updated:** 2025-12-05  
**Status:** Active Enforcement  
**Priority:** HIGH - Must be followed for every implementation

