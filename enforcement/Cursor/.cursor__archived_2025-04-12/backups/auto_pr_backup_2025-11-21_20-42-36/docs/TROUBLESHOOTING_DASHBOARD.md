# AutoPRSessionManager Dashboard - Troubleshooting Guide

**Last Updated:** 2025-12-04

---

## Issue: Component Does Not Load

### Common Causes and Solutions

### 1. Component Not Added to Router

**Symptom:** Component doesn't appear when navigating to route

**Solution:**
Add the component to your router configuration:

```typescript
// In your router file (e.g., App.tsx or routes.tsx)
import AutoPRSessionManager from '@/components/dashboard/AutoPRSessionManager';

// Add route:
<Route path="/sessions" element={<AutoPRSessionManager />} />
```

### 2. Import Path Issues

**Symptom:** Module not found errors

**Check:**
- ✅ Component exists: `frontend/src/components/dashboard/AutoPRSessionManager.tsx`
- ✅ Hook exists: `frontend/src/hooks/useAutoPRSessions.ts`
- ✅ UI components exist:
  - `frontend/src/components/ui/Card.tsx`
  - `frontend/src/components/ui/Button.tsx`
  - `frontend/src/components/ui/ErrorMessage.tsx`
  - `frontend/src/components/LoadingSpinner.tsx`

**Fix:**
Verify all import paths use `@/` alias correctly.

### 3. Missing Dependencies

**Symptom:** Runtime errors about missing modules

**Check:**
```bash
# Verify lucide-react is installed
npm list lucide-react

# If not installed:
npm install lucide-react
```

### 4. TypeScript Errors

**Symptom:** Type errors preventing compilation

**Check:**
```bash
# Run TypeScript compiler
npx tsc --noEmit
```

**Common Issues:**
- Missing type definitions
- Import path issues
- Type mismatches

### 5. Hook Not Returning Data

**Symptom:** Component loads but shows empty/loading state

**Check:**
- Hook is returning mock data (for development)
- API endpoint not implemented yet (expected)
- Check browser console for errors

**Current Status:**
- Hook returns mock data for development
- API integration pending (see `REACT_DASHBOARD_IMPLEMENTATION.md`)

### 6. React Hooks Issues

**Symptom:** "Hooks can only be called inside React components" error

**Fix Applied:**
- ✅ `calculateStats` wrapped in `useCallback`
- ✅ `useEffect` dependencies properly set
- ✅ All hooks called at component top level

### 7. Console Errors

**Check Browser Console:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check React DevTools for component state

**Common Errors:**
- Import errors → Check file paths
- Type errors → Check TypeScript compilation
- Runtime errors → Check component logic

---

## Quick Fixes

### Fix 1: Add Component to Router

**Option A: Direct Import**
```typescript
// frontend/src/App.tsx or your router file
import { Route } from 'react-router-dom';
import AutoPRSessionManager from '@/components/dashboard/AutoPRSessionManager';

// In your routes:
<Route path="/sessions" element={<AutoPRSessionManager />} />
```

**Option B: Use SessionsPage Wrapper (Recommended)**
```typescript
// frontend/src/App.tsx or your router file
import { Route } from 'react-router-dom';
import SessionsPage from '@/pages/SessionsPage';

// In your routes:
<Route path="/sessions" element={<SessionsPage />} />
```

**Note:** A `SessionsPage.tsx` wrapper has been created for easier integration.

### Fix 2: Test Component Directly

```typescript
// Create a test page to verify component works
import AutoPRSessionManager from '@/components/dashboard/AutoPRSessionManager';

function TestPage() {
  return <AutoPRSessionManager />;
}
```

### Fix 3: Verify Imports

```typescript
// Check all imports resolve:
import Card from '@/components/ui/Card'; // ✅ Should work
import Button from '@/components/ui/Button'; // ✅ Should work
import { LoadingSpinner } from '@/components/LoadingSpinner'; // ✅ Should work
import { ErrorMessage } from '@/components/ui/ErrorMessage'; // ✅ Should work
```

---

## Verification Steps

### Step 1: Check Component File
```bash
# Verify file exists
ls frontend/src/components/dashboard/AutoPRSessionManager.tsx
```

### Step 2: Check Hook File
```bash
# Verify hook exists
ls frontend/src/hooks/useAutoPRSessions.ts
```

### Step 3: Check UI Components
```bash
# Verify all UI components exist
ls frontend/src/components/ui/Card.tsx
ls frontend/src/components/ui/Button.tsx
ls frontend/src/components/ui/ErrorMessage.tsx
ls frontend/src/components/LoadingSpinner.tsx
```

### Step 4: Check TypeScript Compilation
```bash
# Run TypeScript compiler
cd frontend
npx tsc --noEmit
```

### Step 5: Check Browser Console
1. Open browser DevTools (F12)
2. Navigate to component route
3. Check for errors in Console tab

---

## Expected Behavior

### When Component Loads Successfully:
1. **Loading State:** Shows spinner initially
2. **Data Loaded:** Shows dashboard with stats cards
3. **Active Sessions:** Lists active sessions (if any)
4. **Completed Sessions:** Lists completed sessions (if any)
5. **No Errors:** No console errors

### Current Mock Data:
- 1 active session (user1-20251119-1430)
- 1 completed session (user1-20251119-1200)
- Stats calculated from mock data

---

## Debugging Checklist

- [ ] Component file exists and is valid TypeScript
- [ ] Hook file exists and exports correctly
- [ ] All UI components exist
- [ ] Component added to router
- [ ] No TypeScript compilation errors
- [ ] No console errors in browser
- [ ] Dependencies installed (lucide-react, etc.)
- [ ] Import paths correct (@/ alias working)

---

## Next Steps

1. **If component doesn't load:**
   - Check router configuration
   - Verify import paths
   - Check browser console for errors

2. **If component loads but shows empty:**
   - Check hook is returning data
   - Verify mock data is set
   - Check component state in React DevTools

3. **If API integration needed:**
   - See `REACT_DASHBOARD_IMPLEMENTATION.md`
   - Create backend API endpoint
   - Update hook to use API

---

## Support

- **Component Location:** `frontend/src/components/dashboard/AutoPRSessionManager.tsx`
- **Hook Location:** `frontend/src/hooks/useAutoPRSessions.ts`
- **Documentation:** `docs/Auto-PR/REACT_DASHBOARD_IMPLEMENTATION.md`

---

**Last Updated:** 2025-12-04

