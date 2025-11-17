# Stripe Webhook CLI Testing Guide

## Overview

This guide explains how to test Stripe webhook endpoints using the Stripe CLI.

## Prerequisites

1. **Install Stripe CLI**
   ```bash
   # Windows (using Scoop)
   scoop install stripe

   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe CLI**
   ```bash
   stripe login
   ```

3. **Get your webhook secret**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Create a new endpoint or use existing one
   - Copy the webhook signing secret

## Setup

1. **Set environment variables**
   ```bash
   # In backend/.env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   ```

2. **Start your backend server**
   ```bash
   cd backend
   npm run start:dev
   ```

3. **Forward webhooks to local server**
   ```bash
   stripe listen --forward-to http://localhost:3001/api/v1/billing/stripe/webhook
   ```

   This will output a webhook signing secret. Update your `.env` with this secret for local testing.

## Testing Subscription Webhooks

### 1. Test invoice.payment_succeeded

```bash
# Trigger a test invoice payment succeeded event
stripe trigger invoice.payment_succeeded

# Or with custom data
stripe trigger invoice.payment_succeeded \
  --override invoice.metadata.invoiceId=your_invoice_id \
  --override invoice.metadata.tenantId=your_tenant_id \
  --override invoice.metadata.accountId=your_account_id \
  --override invoice.amount_paid=10000 \
  --override invoice.subscription=sub_test_123
```

**Expected Result:**
- Payment record created in database
- Payment confirmation email sent (if email service configured)
- Invoice status updated to PAID (if fully paid)

### 2. Test invoice.payment_failed

```bash
# Trigger a test invoice payment failed event
stripe trigger invoice.payment_failed

# Or with custom data
stripe trigger invoice.payment_failed \
  --override invoice.metadata.invoiceId=your_invoice_id \
  --override invoice.metadata.tenantId=your_tenant_id \
  --override invoice.metadata.accountId=your_account_id \
  --override invoice.amount_due=10000 \
  --override invoice.last_payment_error.message="Your card was declined." \
  --override invoice.last_payment_error.code=card_declined \
  --override invoice.subscription=sub_test_123
```

**Expected Result:**
- Failure logged to communication log
- Payment failure email sent to customer
- Follow-up flag set

### 3. Test customer.subscription.created

```bash
# Trigger a test subscription created event
stripe trigger customer.subscription.created

# Or with custom data
stripe trigger customer.subscription.created \
  --override subscription.metadata.invoiceId=your_invoice_id \
  --override subscription.metadata.tenantId=your_tenant_id \
  --override subscription.metadata.accountId=your_account_id \
  --override subscription.status=active
```

**Expected Result:**
- Subscription event logged to communication log
- No follow-up required

### 4. Test customer.subscription.updated

```bash
# Trigger a test subscription updated event
stripe trigger customer.subscription.updated

# Or with custom data
stripe trigger customer.subscription.updated \
  --override subscription.metadata.invoiceId=your_invoice_id \
  --override subscription.status=active \
  --override subscription.cancel_at_period_end=true
```

**Expected Result:**
- Subscription event logged to communication log

### 5. Test customer.subscription.deleted

```bash
# Trigger a test subscription deleted event
stripe trigger customer.subscription.deleted

# Or with custom data
stripe trigger customer.subscription.deleted \
  --override subscription.metadata.invoiceId=your_invoice_id \
  --override subscription.status=canceled
```

**Expected Result:**
- Subscription deletion logged to communication log
- Follow-up required flag set

## Testing Payment Intent Webhooks

### Test payment_intent.succeeded

```bash
stripe trigger payment_intent.succeeded \
  --override payment_intent.metadata.invoiceId=your_invoice_id
```

### Test payment_intent.payment_failed

```bash
stripe trigger payment_intent.payment_failed \
  --override payment_intent.metadata.invoiceId=your_invoice_id \
  --override payment_intent.last_payment_error.message="Your card was declined."
```

## Verifying Results

### Check Database

```sql
-- Check payments created
SELECT * FROM "Payment" WHERE invoice_id = 'your_invoice_id';

-- Check communication logs
SELECT * FROM communication_logs 
WHERE customer_id = 'your_account_id' 
ORDER BY timestamp DESC;

-- Check invoice status
SELECT id, invoice_number, status, total_amount 
FROM "Invoice" 
WHERE id = 'your_invoice_id';
```

### Check Logs

```bash
# Backend logs should show:
# - Webhook event received
# - Payment processed
# - Email sent (if configured)
```

### Check Email Service

If SendGrid is configured, check:
- Email delivery status in SendGrid dashboard
- Customer inbox for payment confirmations/failures

## Troubleshooting

### Webhook signature verification fails

**Problem:** `Invalid webhook signature` error

**Solution:**
1. Ensure `STRIPE_WEBHOOK_SECRET` matches the secret from `stripe listen`
2. Restart backend server after updating `.env`
3. Check that webhook payload is not modified

### Payment not created

**Problem:** Webhook received but payment not in database

**Solution:**
1. Check backend logs for errors
2. Verify invoice exists in database
3. Check tenant isolation (tenant_id must match)
4. Verify invoice metadata is set correctly

### Email not sent

**Problem:** Payment processed but no email sent

**Solution:**
1. Check `SENDGRID_API_KEY` is set
2. Verify customer email exists in database
3. Check email service logs
4. Verify email service is not in mock mode

## Advanced Testing

### Test with Real Stripe Data

1. Create a test customer in Stripe Dashboard
2. Create a test subscription
3. Use real subscription ID in webhook triggers:

```bash
stripe trigger invoice.payment_succeeded \
  --override invoice.subscription=sub_real_subscription_id
```

### Test Webhook Retry Logic

Stripe automatically retries failed webhooks. To test:

1. Temporarily break webhook handler
2. Trigger webhook
3. Fix handler
4. Verify retry succeeds

### Test Multiple Events

```bash
# Test sequence of events
stripe trigger customer.subscription.created
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.deleted
```

## Best Practices

1. **Use test mode** - Always use `sk_test_` keys for testing
2. **Clean up** - Delete test data after testing
3. **Verify idempotency** - Send same webhook twice, should not create duplicates
4. **Test error cases** - Test with invalid data, missing metadata, etc.
5. **Monitor logs** - Watch backend logs during testing

## Next Steps

After testing with Stripe CLI:
1. Set up webhook endpoint in Stripe Dashboard
2. Configure production webhook secret
3. Test with real subscription events
4. Monitor webhook delivery in Stripe Dashboard

