# Quick Start Checklist - Payment Enhancements

**Date:** 2025-12-05

Use this checklist to quickly verify and implement the next steps.

## ⚡ Quick Verification (5 minutes)

- [ ] **Migration file exists**: `backend/prisma/migrations/20250127000000_add_stripe_customer_id.sql`
- [ ] **Test files exist**: 
  - [ ] `backend/src/billing/__tests__/billing.service.spec.ts`
  - [ ] `backend/test/integration/stripe-webhook.integration.test.ts`
  - [ ] `frontend/src/components/billing/__tests__/RecurringPayments.e2e.test.tsx`
- [ ] **Components exist**:
  - [ ] `frontend/src/components/billing/PaymentAnalytics.tsx`
  - [ ] `frontend/src/components/billing/RecurringPayments.tsx`

## 🗄️ Step 1: Database Migration (10 minutes)

- [ ] Run migration verification script:
  ```bash
  cd backend
  node scripts/verify-migration.js
  ```

- [ ] If migration not applied:
  - [ ] Open Supabase Dashboard → SQL Editor
  - [ ] Copy contents of `backend/prisma/migrations/20250127000000_add_stripe_customer_id.sql`
  - [ ] Paste and execute
  - [ ] Verify success

- [ ] Re-run verification script to confirm

## ✅ Step 2: Run Tests - COMPLETE

**Status:** ✅ All tests passing (19/19)

## ⏸️ Step 2.5: Test Webhooks - DEFERRED

**Status:** ⏸️ Deferred to later in development  
**Note:** Requires external Stripe setup. Will be completed when ready for integration testing.

### Backend Tests
```bash
cd backend
npm run test:unit
npm run test:integration
```

- [ ] All unit tests pass
- [ ] All integration tests pass

### Frontend Tests
```bash
cd frontend
npm run test:component
npm run test:e2e
```

- [ ] All component tests pass
- [ ] All E2E tests pass

## 🔗 Step 3: Test Webhooks (20 minutes)

- [ ] Install Stripe CLI (if not installed)
- [ ] Login: `stripe login`
- [ ] Set webhook secret in `.env`:
  ```env
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```
- [ ] Start backend: `cd backend && npm run start:dev`
- [ ] Forward webhooks: `stripe listen --forward-to localhost:3000/api/v1/billing/stripe/webhook`
- [ ] Test events:
  ```bash
  stripe trigger invoice.payment_succeeded
  stripe trigger invoice.payment_failed
  stripe trigger customer.subscription.created
  ```
- [ ] Verify webhooks processed in backend logs

## 🚀 Step 4: Production (When Ready)

- [ ] Apply migration to production database
- [ ] Configure production webhook endpoint in Stripe Dashboard
- [ ] Set production environment variables
- [ ] Monitor webhook delivery

## 📚 Detailed Guides

- **Full Verification Guide**: `NEXT_STEPS_VERIFICATION.md`
- **Migration Guide**: `backend/prisma/migrations/MIGRATION_STRIPE_CUSTOMER_ID.md`
- **Webhook Testing**: `backend/test/stripe-webhook-cli-test.md`

---

**Status**: Ready to proceed

