# ACTIVE CONTEXT DUMP

**Generated:** 2025-12-05T20:49:17.383342+00:00  
**Task Type:** `add_error_handling`  
**Session ID:** 4850fc61-c840-4d53-9737-54a7400fcc11

---

## Task Context

**Detected Task Type:** `add_error_handling`

**Hints:**
- No silent failures: Always log errors with context
- Use try/catch with proper error propagation
- Log with traceId and tenantId for correlation
- Map errors to appropriate HTTP status codes (400, 422, 500)

---

## Recommended Files

1. `frontend/src/routes/dashboard/hooks/useServerPersistence.ts`
2. `VeroSuiteMobile/src/hooks/useAuth.ts`
3. `VeroSuiteMobile/src/hooks/useJobs.ts`

---

## Code Snippets

### `VeroSuiteMobile/src/hooks/useAuth.ts` (lines 1-50)

```typescript
// ============================================================================
// VeroField Mobile App - Authentication Hook
// ============================================================================

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthState, LoginCredentials, User, AppError } from '../types';
import authService from '../services/authService';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const queryClient = useQueryClient();

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const isAuthenticated = await authService.isAuthenticated();
      const user = await authService.getStoredUser();
      const token = await authService.getStoredToken();

      setAuthState({
        user,
        token,
        isAuthenticated,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  // Login mutation
```

### `VeroSuiteMobile/src/hooks/useJobs.ts` (lines 1-50)

```typescript
// ============================================================================
// VeroField Mobile App - Jobs Hook
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Job, AppError } from '../types';
import jobsService from '../services/jobsService';
import { useAuth } from './useAuth';

export const useJobs = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Get today's jobs
  const {
    data: jobs = [],
    isLoading: isLoadingJobs,
    error: jobsError,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ['jobs', 'today'],
    queryFn: () => jobsService.getTodaysJobs(),
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  // Start job mutation
  const startJobMutation = useMutation({
    mutationFn: (jobId: string) => jobsService.startJob(jobId),
    onSuccess: (updatedJob) => {
      // Update the job in the cache
      queryClient.setQueryData(['jobs', 'today'], (oldJobs: Job[] = []) =>
        oldJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      );
      
      // Invalidate job details if it's cached
      queryClient.invalidateQueries({ queryKey: ['job', updatedJob.id] });
    },
    onError: (error: AppError) => {
      console.error('Error starting job:', error);
    },
  });

  // Complete job mutation
  const completeJobMutation = useMutation({
    mutationFn: ({ jobId, completionData }: { 
      jobId: string; 
      completionData: {
        notes?: string;
```

### `frontend/src/routes/dashboard/hooks/useServerPersistence.ts` (lines 1-50)

```typescript
import { useState, useCallback } from 'react';
import { enhancedApi } from '@/lib/enhanced-api';
import { getDefaultCardSize } from '../utils/cardHelpers';
import { logger } from '@/utils/logger';

export const useServerPersistence = (
  localUpdateCardPosition: (cardId: string, x: number, y: number) => void,
  localUpdateCardSize: (cardId: string, width: number, height: number) => void,
  localAddCard: (type: string, position?: { x: number; y: number }) => string,
  localRemoveCard: (cardId: string) => void,
  localUpdateMultipleCardPositions: (updates: Array<{ cardId: string; x: number; y: number }>) => void,
  loadLayoutFromData: (layout: any) => void,
  layout: any,
  kpiData: Record<string, any>,
  setKpiData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  KPI_DATA_STORAGE_KEY: string
) => {
  const [currentLayoutId, setCurrentLayoutId] = useState<string | null>(null);
  const [isLoadingLayout, setIsLoadingLayout] = useState(true);
  const [serverLoadSucceeded, setServerLoadSucceeded] = useState(false);

  const updateCardPosition = useCallback(async (cardId: string, x: number, y: number) => {
    localUpdateCardPosition(cardId, x, y);
    
    // Only attempt server persistence if we have a layout ID
    // If no layout ID, operation succeeds locally (no error)
    if (!currentLayoutId) {
      logger.debug('No layout ID, skipping server persistence for card position', { cardId });
      return; // Success - local update only
    }
    
    try {
      const card = layout.cards[cardId];
      if (!card) {
        logger.warn('Card not found in layout, skipping server persistence', { cardId });
        return; // Not an error - card might not be in layout yet
      }
      
      const kd = kpiData[cardId] || {};
      const linkage: any = {};
      // Only include user_kpi_id if it's a valid UUID
      if (kd.user_kpi_id && typeof kd.user_kpi_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.user_kpi_id)) {
        linkage.user_kpi_id = kd.user_kpi_id;
      }
      // Only include template_id if it's a valid UUID or valid string
      if (kd.template_id && typeof kd.template_id === 'string') {
        // Check if it's a valid UUID format
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(kd.template_id)) {
          linkage.template_id = kd.template_id;
        }
```

---

## Patterns to Follow

1. **Wrap risky operations in try/catch**
2. **Log errors with context (traceId, tenantId, user_id)**
3. **Propagate typed errors (AppError, HttpException)**
4. **No silent failures - always log or throw**

---

**Generated by:** VeroField Auto-Enforcer  
**Purpose:** This file provides minimal context hints for the current task. Read this before editing code.
