# Installing Sentry for Backend Error Tracking

**Date:** 2025-12-05  
**Status:** Required for Production

---

## Overview

The `SentryService` has been created and integrated into the backend, but the Sentry packages need to be installed before it will work.

---

## Installation

```bash
cd backend
npm install @sentry/node @sentry/profiling-node
```

---

## Configuration

After installation, configure Sentry in your production environment:

1. **Add to `.env.production`:**
   ```env
   SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   SENTRY_ENVIRONMENT=production
   SENTRY_TRACES_SAMPLE_RATE=0.1
   ```

2. **Initialize Sentry in `main.ts`:**
   The `SentryService` will automatically initialize when the application starts if `SENTRY_DSN` is set.

---

## Usage

The `SentryService` is available globally through `CommonModule`. Inject it in any service:

```typescript
import { SentryService } from '../common/services/sentry.service';

constructor(private readonly sentryService: SentryService) {}

// Capture exceptions
try {
  // Your code
} catch (error) {
  this.sentryService.captureException(error, { context: 'operation_name' });
}

// Capture messages
this.sentryService.captureMessage('Important event', 'info', { data: 'value' });

// Set user context
this.sentryService.setUser({ id: userId, email: userEmail, tenantId: tenantId });
```

---

## Testing

After installation, verify Sentry is working:

1. Set `SENTRY_DSN` in your environment
2. Start the application
3. Check logs for "Sentry initialized" message
4. Trigger a test error and verify it appears in Sentry dashboard

---

**Last Updated:** 2025-12-05


