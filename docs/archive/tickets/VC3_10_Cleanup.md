# VC3-10: Cleanup - Remove Mock Code and Unused Props

## Summary
Clean up the codebase by removing commented mock metric code/imports, deleting unused props, ensuring DEV flags guard logs/profiling, and removing any dead code. This improves code maintainability and reduces bundle size.

## Scope
- Remove commented mock code and unused imports
- Delete unused props and variables
- Ensure DEV flags guard all logging and profiling
- Remove dead code and unused functions
- Clean up console.log statements
- Optimize bundle size

## Current Cleanup Issues Identified

### 1. Commented Mock Code
```typescript
// VeroCardsV3.tsx lines 20, 67-68
// import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
// const mockMetrics: DashboardMetric[] = [];
```

### 2. Unused Imports
```typescript
// VeroCardsV3.tsx - potentially unused imports
import { DashboardMetric } from '@/types';
// import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
// import SmartKPITest from '@/components/dashboard/SmartKPITest';
// import SmartKPIDebug from '@/components/dashboard/SmartKPIDebug';
```

### 3. Unused Props and Variables
```typescript
// VeroCardsV3.tsx line 80 - unused props
export default function VeroCardsV2({}: VeroCardsV2Props) {
  // showHeader prop is not used
}

// VeroCardsV3.tsx line 166 - unused variable
const AUTO_CREATE_FROM_USER_KPIS = false;
```

### 4. Uncontrolled Console Logging
```typescript
// VeroCardsV3.tsx - console.log statements without DEV guards
console.log('🧪 Testing KPI templates API...');
console.log('✅ KPI templates loaded:', templates?.length || 0);
console.log('🔍 VeroCardsV2 - userKpis status:', { userKpis, userKpisStatus, isUserKpisLoading, isUserKpisError });
```

### 5. Unused Functions and Variables
```typescript
// VeroCardsV3.tsx - potentially unused functions
const getCardType = useCallback((cardId: string): string => {
  return layout.cards[cardId]?.type || 'unknown';
}, [layout.cards]);
```

## Tasks

### Phase 1: Remove Commented Code and Unused Imports

#### 1. Clean Up Import Statements
```typescript
// Remove commented imports
// import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
// import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
// import SmartKPITest from '@/components/dashboard/SmartKPITest';
// import SmartKPIDebug from '@/components/dashboard/SmartKPIDebug';

// Remove unused imports
import { DashboardMetric } from '@/types'; // Remove if not used
```

#### 2. Remove Commented Mock Code
```typescript
// Remove commented mock data
// const mockMetrics: DashboardMetric[] = [];

// Remove commented component references
// import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
```

#### 3. Clean Up Unused Variables
```typescript
// Remove unused variables
const AUTO_CREATE_FROM_USER_KPIS = false; // Remove if not used

// Remove unused props
interface VeroCardsV3Props {
  // Remove showHeader if not used
  // showHeader?: boolean;
}
```

### Phase 2: Add DEV Flag Guards

#### 1. Guard Console Logging
```typescript
// Replace uncontrolled console.log with DEV guards
const DEBUG = (typeof window !== 'undefined') && process.env.NODE_ENV !== 'production' && (window as any).__VERO_DEBUG__ === true;

// Guard all console.log statements
if (DEBUG) {
  console.log('🧪 Testing KPI templates API...');
  console.log('✅ KPI templates loaded:', templates?.length || 0);
}

// Guard development-only logging
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 VeroCardsV3 - userKpis status:', { userKpis, userKpisStatus, isUserKpisLoading, isUserKpisError });
}
```

#### 2. Guard Profiling Code
```typescript
// Guard Profiler component
{process.env.NODE_ENV === 'development' && (
  <Profiler id="VeroCardsV3" onRender={(id, phase, actualDuration) => {
    const DEBUG = (typeof window !== 'undefined') && process.env.NODE_ENV !== 'production' && (window as any).__VERO_PROFILE__ === true;
    if (DEBUG) {
      console.log(`[Profiler:${id}] ${phase} took ${actualDuration.toFixed(2)}ms`);
    }
  }}>
    {/* Component content */}
  </Profiler>
)}
```

#### 3. Guard Performance Monitoring
```typescript
// Guard performance monitoring
const enablePerformanceMonitoring = process.env.NODE_ENV === 'development';

if (enablePerformanceMonitoring) {
  // Performance monitoring code
}
```

### Phase 3: Remove Dead Code

#### 1. Remove Unused Functions
```typescript
// Remove unused functions
const getCardType = useCallback((cardId: string): string => {
  return layout.cards[cardId]?.type || 'unknown';
}, [layout.cards]); // Remove if not used

// Remove unused event handlers
const handleMobileNavigate = useCallback((page: string) => {
  console.log('Navigate to:', page);
  // Handle navigation logic here
}, []); // Remove if not implemented
```

#### 2. Remove Unused State Variables
```typescript
// Remove unused state variables
const [assignTechId, setAssignTechId] = useState<string>(''); // Remove if not used
const [assignStatus, setAssignStatus] = useState<string>(''); // Remove if not used
```

#### 3. Remove Unused Effect Dependencies
```typescript
// Clean up useEffect dependencies
useEffect(() => {
  // Effect logic
}, []); // Remove unused dependencies

// Remove empty useEffect
useEffect(() => {
  // Empty effect - remove
}, []);
```

### Phase 4: Optimize Bundle Size

#### 1. Remove Unused Dependencies
```typescript
// Remove unused imports from dependencies
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
// Remove unused hooks if not needed

import { 
  HelpCircle,
  X,
  Plus
} from 'lucide-react';
// Remove unused icons
```

#### 2. Optimize Import Statements
```typescript
// Use specific imports instead of wildcard imports
import { LoadingSpinner } from '@/components/LoadingSpinner';
// Instead of: import * as Components from '@/components';

// Use dynamic imports for heavy components
const KPIBuilder = lazy(() => import('@/components/kpi/KPIBuilder'));
const KpiTemplateLibraryModal = lazy(() => import('@/components/kpi/KpiTemplateLibraryModal'));
```

#### 3. Remove Unused Type Imports
```typescript
// Remove unused type imports
// import { DashboardMetric } from '@/types'; // Remove if not used

// Keep only used types
import { CardTypeId, DashboardCard, KPIData } from './types';
```

### Phase 5: Code Organization

#### 1. Group Related Imports
```typescript
// Group imports by category
// React imports
import { useState, useCallback, useMemo, useEffect, useRef, lazy, Suspense } from 'react';

// Third-party imports
import { useAuthStore } from '@/stores/auth';
import { enhancedApi } from '@/lib/enhanced-api';

// Component imports
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AlertModal, ConfirmModal, PromptModal } from '@/components/ui/Modal';

// Hook imports
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

// Icon imports
import { HelpCircle, X, Plus } from 'lucide-react';

// Type imports
import { CardTypeId, DashboardCard, KPIData } from './types';
```

#### 2. Organize Constants
```typescript
// Group constants at the top
const KPI_DATA_STORAGE_KEY = 'vero_kpi_data_v1';
const DEBUG = (typeof window !== 'undefined') && process.env.NODE_ENV !== 'production' && (window as any).__VERO_DEBUG__ === true;
const ENABLE_PERFORMANCE_MONITORING = process.env.NODE_ENV === 'development';
```

#### 3. Clean Up Comments
```typescript
// Remove outdated comments
// TODO: Implement this feature - Remove if implemented

// Keep useful comments
// Auto-enable virtualization for large sets (run after layout hook initializes)
useEffect(() => {
  // ... implementation
}, []);
```

### Phase 6: Add Cleanup Validation

#### 1. Create Cleanup Script
**File**: `scripts/cleanup-validation.js`
```javascript
const fs = require('fs');
const path = require('path');

function validateCleanup(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for commented imports
  const commentedImports = content.match(/^\/\/\s*import.*$/gm);
  if (commentedImports) {
    issues.push(`Commented imports found: ${commentedImports.length}`);
  }
  
  // Check for uncontrolled console.log
  const uncontrolledLogs = content.match(/console\.log\(/g);
  if (uncontrolledLogs) {
    issues.push(`Uncontrolled console.log found: ${uncontrolledLogs.length}`);
  }
  
  // Check for unused variables
  const unusedVars = content.match(/const\s+\w+\s*=.*;\s*$/gm);
  if (unusedVars) {
    issues.push(`Potentially unused variables: ${unusedVars.length}`);
  }
  
  return issues;
}

// Run validation
const filePath = 'frontend/src/routes/VeroCardsV3.tsx';
const issues = validateCleanup(filePath);

if (issues.length > 0) {
  console.log('Cleanup issues found:');
  issues.forEach(issue => console.log(`- ${issue}`));
} else {
  console.log('✅ No cleanup issues found');
}
```

#### 2. Add ESLint Rules
**File**: `.eslintrc.js` (add rules)
```javascript
module.exports = {
  rules: {
    // Prevent unused variables
    'no-unused-vars': 'error',
    
    // Prevent console.log in production
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // Prevent commented code
    'no-commented-code': 'warn',
    
    // Prevent unused imports
    'unused-imports/no-unused-imports': 'error',
  }
};
```

## Files to Modify

### Primary Files
- `frontend/src/routes/VeroCardsV3.tsx` - Main cleanup target
- `frontend/src/routes/dashboard/components/*.tsx` - Clean up extracted components
- `frontend/src/routes/dashboard/hooks/*.ts` - Clean up hooks
- `frontend/src/routes/dashboard/services/*.ts` - Clean up services

### Configuration Files
- `.eslintrc.js` - Add cleanup rules
- `package.json` - Add cleanup scripts

### New Files
- `scripts/cleanup-validation.js` - Cleanup validation script
- `scripts/cleanup-checklist.md` - Cleanup checklist

## Acceptance Criteria
- No commented mock code or unused imports
- All console.log statements guarded with DEV flags
- No unused props, variables, or functions
- All profiling code guarded with DEV flags
- Bundle size reduced (measured)
- Code is clean and maintainable
- ESLint passes with no warnings
- All existing functionality preserved

## Bundle Size Targets
- Target: < 2MB total bundle size
- Target: < 500KB for VeroCardsV3 component
- Target: < 100KB for extracted components
- Monitor: Tree shaking effectiveness
- Monitor: Unused code elimination

## Notes
- Maintain all existing functionality and styling
- Keep purple theme and Tailwind classes
- Cleanup should be transparent to users
- Add helpful development warnings
- Consider adding automated cleanup in CI/CD

## Dependencies
- VC3-09 (Performance Polish) should be completed first
- All extracted components must be properly structured

## Testing
- Test bundle size before and after cleanup
- Test all functionality to ensure no regression
- Run ESLint to check for cleanup issues
- Test development vs production builds
- Verify no console.log in production builds
- Test performance monitoring in development

## Cleanup Checklist
- [ ] Remove commented imports
- [ ] Remove commented mock code
- [ ] Remove unused variables and functions
- [ ] Add DEV guards to console.log statements
- [ ] Add DEV guards to profiling code
- [ ] Remove unused props and parameters
- [ ] Optimize import statements
- [ ] Group related imports
- [ ] Remove dead code
- [ ] Clean up comments
- [ ] Run ESLint validation
- [ ] Test bundle size
- [ ] Test all functionality











