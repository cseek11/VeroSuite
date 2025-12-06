# Production Deployment Checklist

**Date:** 2025-12-05  
**Feature:** Payment Enhancements System  
**Status:** Ready for Production

---

## Pre-Deployment Verification

### ✅ Code Verification

- [ ] All tests pass (unit, integration, E2E)
- [ ] Code review completed
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Logging configured properly
- [ ] Environment variables documented

### ✅ Database Verification

- [ ] Migration SQL reviewed
- [ ] Migration tested in staging environment
- [ ] Database backup created
- [ ] Rollback plan documented
- [ ] Migration script verified

### ✅ Security Verification

- [ ] API keys secured (not in code)
- [ ] Webhook secret secured
- [ ] Tenant isolation verified
- [ ] RLS policies reviewed
- [ ] Input validation implemented
- [ ] SQL injection prevention verified

---

## Step 1: Database Migration

### 1.1 Pre-Migration

- [ ] **Create Database Backup**
  ```sql
  -- Full database backup
  pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
  ```

- [ ] **Verify Backup**
  - Check backup file size
  - Verify backup is not corrupted
  - Store backup in secure location

- [ ] **Document Rollback Plan**
  - Rollback SQL script prepared
  - Test rollback in staging
  - Rollback procedure documented

### 1.2 Apply Migration

- [ ] **Review Migration SQL**
  - File: `backend/prisma/migrations/20250127000000_add_stripe_customer_id.sql`
  - Verify SQL is correct
  - Check for any conflicts

- [ ] **Apply Migration**
  ```sql
  -- Option 1: Supabase Dashboard
  -- Copy SQL from migration file
  -- Paste in SQL Editor
  -- Execute

  -- Option 2: psql
  psql $DATABASE_URL -f backend/prisma/migrations/20250127000000_add_stripe_customer_id.sql
  ```

- [ ] **Verify Migration**
  ```sql
  -- Check column exists
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name = 'accounts'
  AND column_name = 'stripe_customer_id';

  -- Check index exists
  SELECT indexname, indexdef
  FROM pg_indexes
  WHERE tablename = 'accounts'
  AND indexname = 'idx_accounts_stripe_customer_id';
  ```

### 1.3 Post-Migration

- [ ] Migration applied successfully
- [ ] Column exists and is correct
- [ ] Index created successfully
- [ ] No errors in migration logs
- [ ] Application still functioning

---

## Step 2: Environment Variables

### 2.1 Stripe Configuration

- [ ] **Production Stripe API Key**
  ```env
  STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
  ```
  - ✅ Using live key (not test key)
  - ✅ Key is secure and not exposed
  - ✅ Key has correct permissions

- [ ] **Production Webhook Secret**
  ```env
  STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
  ```
  - ✅ Secret from production webhook endpoint
  - ✅ Not using test webhook secret
  - ✅ Secret is secure

### 2.2 Email Configuration

- [ ] **SendGrid API Key**
  ```env
  SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
  EMAIL_FROM=noreply@verofield.com
  EMAIL_FROM_NAME=VeroField
  EMAIL_REPLY_TO=support@verofield.com
  ```
  - ✅ Production SendGrid account
  - ✅ Email addresses verified
  - ✅ Domain authenticated

### 2.3 Application Configuration

- [ ] **Frontend URL**
  ```env
  FRONTEND_URL=https://app.verofield.com
  ```
  - ✅ Production domain
  - ✅ HTTPS enabled
  - ✅ Domain verified

- [ ] **Database URL**
  ```env
  DATABASE_URL=postgresql://...
  ```
  - ✅ Production database
  - ✅ Connection string secure
  - ✅ SSL enabled

### 2.4 Verify All Variables

- [ ] All environment variables set
- [ ] No test/development values
- [ ] Variables loaded correctly
- [ ] Application starts without errors

---

## Step 3: Stripe Webhook Configuration

### 3.1 Create Production Webhook Endpoint

- [ ] **Go to Stripe Dashboard**
  - URL: https://dashboard.stripe.com/webhooks
  - Switch to **Live mode** (not Test mode)

- [ ] **Add Endpoint**
  - Endpoint URL: `https://api.verofield.com/api/v1/billing/stripe/webhook`
  - Description: "VeroField Payment Webhooks"
  - Version: Latest API version

- [ ] **Select Events**
  - ✅ `invoice.payment_succeeded`
  - ✅ `invoice.payment_failed`
  - ✅ `customer.subscription.created`
  - ✅ `customer.subscription.updated`
  - ✅ `customer.subscription.deleted`

- [ ] **Save Endpoint**

### 3.2 Get Webhook Secret

- [ ] **Copy Signing Secret**
  - Click on webhook endpoint
  - Click "Reveal" next to "Signing secret"
  - Copy secret (starts with `whsec_`)

- [ ] **Set in Environment**
  ```env
  STRIPE_WEBHOOK_SECRET=whsec_production_secret_here
  ```

- [ ] **Restart Application**
  - Restart backend server
  - Verify webhook secret loaded

### 3.3 Test Webhook

- [ ] **Send Test Webhook**
  - In Stripe Dashboard, click "Send test webhook"
  - Select event: `invoice.payment_succeeded`
  - Send to endpoint

- [ ] **Verify Receipt**
  - Check backend logs for webhook received
  - Verify webhook processed successfully
  - Check database for records created

- [ ] **Monitor Delivery**
  - Check webhook delivery logs
  - Verify 200 status code
  - No errors in delivery

---

## Step 4: Application Deployment

### 4.1 Build Application

- [ ] **Backend Build**
  ```bash
  cd backend
  npm run build
  ```
  - ✅ Build successful
  - ✅ No build errors
  - ✅ TypeScript compilation successful

- [ ] **Frontend Build**
  ```bash
  cd frontend
  npm run build
  ```
  - ✅ Build successful
  - ✅ No build errors
  - ✅ Assets optimized

### 4.2 Deploy Backend

- [ ] **Deploy to Production Server**
  - Application deployed
  - Environment variables set
  - Server restarted

- [ ] **Verify Deployment**
  - Health check endpoint responds
  - API endpoints accessible
  - Database connection working

### 4.3 Deploy Frontend

- [ ] **Deploy to Production**
  - Frontend deployed
  - CDN/assets configured
  - Domain configured

- [ ] **Verify Deployment**
  - Frontend loads correctly
  - API calls working
  - No console errors

---

## Step 5: Post-Deployment Verification

### 5.1 Functional Testing

- [ ] **Payment Processing**
  - Create test invoice
  - Process payment
  - Verify payment record created

- [ ] **Recurring Payments**
  - Create recurring payment
  - Verify subscription created
  - Check subscription status

- [ ] **Webhook Processing**
  - Trigger test webhook
  - Verify webhook received
  - Check database records
  - Verify email notifications

- [ ] **Analytics Dashboard**
  - Access payment analytics
  - Verify data displays correctly
  - Check date filtering works

### 5.2 Monitoring

- [ ] **Application Logs**
  - Logs being generated
  - No errors in logs
  - Structured logging working

- [ ] **Webhook Delivery**
  - Monitor Stripe webhook logs
  - Check delivery success rate
  - Investigate any failures

- [ ] **Database Performance**
  - Check query performance
  - Monitor index usage
  - Verify no slow queries

- [ ] **Error Tracking**
  - Error tracking configured
  - Alerts set up
  - No critical errors

### 5.3 Security Verification

- [ ] **Tenant Isolation**
  - Verify RLS policies active
  - Test cross-tenant access (should fail)
  - Verify tenant filtering in queries

- [ ] **API Security**
  - Authentication working
  - Authorization enforced
  - Rate limiting active

- [ ] **Data Protection**
  - Sensitive data encrypted
  - PII handling correct
  - GDPR compliance verified

---

## Step 6: Rollback Plan

### 6.1 Rollback Triggers

- [ ] **Critical Issues**
  - Payment processing fails
  - Database errors
  - Security vulnerabilities
  - Data corruption

### 6.2 Rollback Procedure

- [ ] **Database Rollback**
  ```sql
  -- Remove column and index
  DROP INDEX IF EXISTS idx_accounts_stripe_customer_id;
  ALTER TABLE accounts DROP COLUMN IF EXISTS stripe_customer_id;
  ```

- [ ] **Application Rollback**
  - Revert to previous version
  - Restore environment variables
  - Restart services

- [ ] **Webhook Rollback**
  - Disable webhook endpoint
  - Or point to previous version
  - Update webhook secret if needed

### 6.3 Rollback Testing

- [ ] Rollback procedure tested in staging
- [ ] Rollback SQL verified
- [ ] Rollback time estimated
- [ ] Team notified of rollback plan

---

## Step 7: Documentation

### 7.1 Update Documentation

- [ ] **API Documentation**
  - New endpoints documented
  - Request/response examples
  - Error codes documented

- [ ] **User Documentation**
  - Recurring payments guide
  - Payment analytics guide
  - Troubleshooting guide

- [ ] **Internal Documentation**
  - Deployment procedure
  - Monitoring setup
  - Incident response

### 7.2 Communication

- [ ] **Team Notification**
  - Deployment completed
  - New features available
  - Known issues communicated

- [ ] **User Notification** (if applicable)
  - New features announced
  - Changes communicated
  - Support channels available

---

## Monitoring & Maintenance

### Ongoing Monitoring

- [ ] **Daily Checks**
  - Webhook delivery success rate
  - Payment processing errors
  - Application error logs

- [ ] **Weekly Reviews**
  - Payment analytics review
  - Performance metrics
  - Error pattern analysis

- [ ] **Monthly Reviews**
  - System health assessment
  - Security audit
  - Performance optimization

### Maintenance Tasks

- [ ] **Database Maintenance**
  - Index optimization
  - Query performance tuning
  - Backup verification

- [ ] **Application Updates**
  - Dependency updates
  - Security patches
  - Feature enhancements

---

## Success Criteria

✅ **Deployment Successful When:**
- All tests pass
- Migration applied successfully
- Webhooks processing correctly
- Payments processing successfully
- No critical errors in logs
- Monitoring configured
- Documentation updated
- Team notified

---

## Emergency Contacts

- **Database Issues**: [Database Admin]
- **Stripe Issues**: [Stripe Support / Account Manager]
- **Application Issues**: [DevOps Team]
- **Security Issues**: [Security Team]

---

## Deployment Sign-Off

- [ ] **Technical Lead**: _________________ Date: _______
- [ ] **DevOps Lead**: _________________ Date: _______
- [ ] **Security Review**: _________________ Date: _______
- [ ] **Product Owner**: _________________ Date: _______

---

**Last Updated:** 2025-12-05  
**Next Review:** After first production deployment

