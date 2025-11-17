# Webhook Testing Setup Guide

**Date:** 2025-11-16  
**Purpose:** Complete guide for setting up and testing Stripe webhooks

---

## Prerequisites

1. **Stripe Account** (Test mode)
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy your test API keys

2. **Stripe CLI** (for local testing)
   - Download: https://stripe.com/docs/stripe-cli
   - Or install via package manager

3. **Backend Server Running**
   - Port 3001 (or configured port)
   - Environment variables set

---

## Step 1: Install Stripe CLI

### Windows

**Option A: Using Scoop**
```powershell
scoop install stripe
```

**Option B: Manual Installation**
1. Download from: https://github.com/stripe/stripe-cli/releases
2. Extract `stripe.exe` to a folder in your PATH
3. Or add to project: `backend/tools/stripe.exe`

**Option C: Using Chocolatey**
```powershell
choco install stripe-cli
```

### macOS
```bash
brew install stripe/stripe-cli/stripe
```

### Linux
```bash
# Download and install from releases page
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_*_linux_x86_64.tar.gz
tar -xzf stripe_*_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

### Verify Installation
```bash
stripe --version
```

---

## Step 2: Login to Stripe CLI

```bash
stripe login
```

This will:
1. Open your browser
2. Ask you to authorize the CLI
3. Save your credentials locally

**Expected Output:**
```
> Done! The Stripe CLI is configured for your account
```

---

## Step 3: Configure Environment Variables

### Backend `.env` File

Update your `backend/.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51...your_test_key
STRIPE_WEBHOOK_SECRET=whsec_...your_webhook_secret

# For local testing, you'll get a new secret from stripe listen
# Use that for STRIPE_WEBHOOK_SECRET when testing locally
```

### Get Your Test API Key

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy the **Secret key** (starts with `sk_test_`)
3. Paste into `STRIPE_SECRET_KEY`

---

## Step 4: Start Backend Server

```bash
cd backend
npm run start:dev
```

**Verify server is running:**
- Should see: `🚀 Backend server is running on port 3001`
- Or check: http://localhost:3001/api/health (if health endpoint exists)

---

## Step 5: Forward Webhooks Locally

### Start Webhook Forwarding

Open a **new terminal** and run:

```bash
stripe listen --forward-to localhost:3001/api/v1/billing/stripe/webhook
```

**Expected Output:**
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
> (^C to quit)
```

### Important: Update Webhook Secret

Copy the webhook signing secret from the output (starts with `whsec_`).

**Update your `.env` file:**
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx  # Use the secret from stripe listen
```

**Restart your backend server** after updating the secret.

---

## Step 6: Test Webhook Events

### Test Payment Succeeded

```bash
stripe trigger invoice.payment_succeeded
```

**Expected Results:**
- ✅ Webhook received in backend logs
- ✅ Payment record created in database
- ✅ Email notification sent (if configured)
- ✅ Communication log created

### Test Payment Failed

```bash
stripe trigger invoice.payment_failed
```

**Expected Results:**
- ✅ Webhook received in backend logs
- ✅ Payment failure record created
- ✅ Failure email notification sent
- ✅ Communication log created with follow-up flag

### Test Subscription Created

```bash
stripe trigger customer.subscription.created
```

**Expected Results:**
- ✅ Webhook received
- ✅ Subscription record created
- ✅ Communication log created

### Test Subscription Updated

```bash
stripe trigger customer.subscription.updated
```

### Test Subscription Deleted

```bash
stripe trigger customer.subscription.deleted
```

**Expected Results:**
- ✅ Webhook received
- ✅ Subscription status updated
- ✅ Communication log created with follow-up required

---

## Step 7: Verify Webhook Processing

### Check Backend Logs

Look for log entries like:
```
[WebhookController] Processing webhook event: invoice.payment_succeeded
[WebhookController] Webhook processed successfully
[BillingService] Payment record created: payment_xxx
```

### Check Database

**Verify Payment Records:**
```sql
SELECT * FROM payments 
WHERE stripe_payment_intent_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
```

**Verify Communication Logs:**
```sql
SELECT * FROM communication_logs
WHERE communication_type = 'payment_notification'
ORDER BY created_at DESC
LIMIT 5;
```

### Check Email Service (if configured)

- Verify emails are being sent
- Check SendGrid logs (if using SendGrid)
- Check email service logs

---

## Step 8: Test with Real Stripe Events

### Create a Test Customer

```bash
stripe customers create \
  --email=test@example.com \
  --name="Test Customer"
```

### Create a Test Payment

```bash
stripe payment_intents create \
  --amount=2000 \
  --currency=usd \
  --customer=cus_xxxxx
```

### Create a Test Subscription

```bash
stripe subscriptions create \
  --customer=cus_xxxxx \
  --items[0][price]=price_xxxxx
```

---

## Troubleshooting

### Issue: Webhook Not Received

**Check:**
1. ✅ Backend server is running
2. ✅ Webhook forwarding is active (`stripe listen` running)
3. ✅ Correct endpoint URL in `stripe listen` command
4. ✅ Webhook secret matches in `.env` file
5. ✅ Backend server restarted after updating secret

**Solution:**
```bash
# Stop stripe listen (Ctrl+C)
# Restart backend server
# Restart stripe listen with correct URL
stripe listen --forward-to localhost:3001/api/v1/billing/stripe/webhook
```

### Issue: Webhook Signature Verification Failed

**Error:**
```
Webhook signature verification failed
```

**Solution:**
1. Ensure `STRIPE_WEBHOOK_SECRET` matches the secret from `stripe listen`
2. Restart backend server after updating secret
3. Check that webhook secret is not empty

### Issue: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Kill process on port 3001
node backend/scripts/kill-port.js 3001

# Or use PowerShell
node backend/scripts/kill-port.js 3001
```

### Issue: Stripe CLI Not Found

**Error:**
```
'stripe' is not recognized as an internal or external command
```

**Solution:**
1. Verify Stripe CLI is installed: `stripe --version`
2. Check if it's in your PATH
3. Reinstall if needed

---

## Production Webhook Setup

### Step 1: Create Production Webhook Endpoint

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Enter endpoint URL: `https://your-domain.com/api/v1/billing/stripe/webhook`
4. Select events to listen for:
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **"Add endpoint"**

### Step 2: Get Production Webhook Secret

1. Click on your webhook endpoint
2. Click **"Reveal"** next to "Signing secret"
3. Copy the secret (starts with `whsec_`)

### Step 3: Set Production Environment Variable

```env
STRIPE_WEBHOOK_SECRET=whsec_production_secret_here
STRIPE_SECRET_KEY=sk_live_production_key_here
```

### Step 4: Monitor Webhook Delivery

1. Go to webhook endpoint in Stripe Dashboard
2. Check **"Recent events"** tab
3. Monitor for:
   - ✅ Successful deliveries (200 status)
   - ⚠️ Failed deliveries (investigate)
   - ⚠️ Retries (may indicate issues)

---

## Testing Checklist

- [ ] Stripe CLI installed
- [ ] Logged into Stripe CLI
- [ ] Backend server running
- [ ] Environment variables configured
- [ ] Webhook forwarding active
- [ ] Tested `invoice.payment_succeeded`
- [ ] Tested `invoice.payment_failed`
- [ ] Tested `customer.subscription.created`
- [ ] Tested `customer.subscription.updated`
- [ ] Tested `customer.subscription.deleted`
- [ ] Verified webhooks processed in logs
- [ ] Verified database records created
- [ ] Verified email notifications sent
- [ ] Production webhook endpoint configured (when ready)

---

## Quick Reference Commands

```bash
# Login to Stripe CLI
stripe login

# Forward webhooks locally
stripe listen --forward-to localhost:3001/api/v1/billing/stripe/webhook

# Trigger test events
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted

# View webhook events
stripe events list

# View specific event
stripe events retrieve evt_xxxxx
```

---

## Additional Resources

- **Stripe CLI Docs**: https://stripe.com/docs/stripe-cli
- **Webhook Testing**: https://stripe.com/docs/webhooks/test
- **Webhook Guide**: `backend/test/stripe-webhook-cli-test.md`
- **Verification Guide**: `NEXT_STEPS_VERIFICATION.md` Step 2

---

**Last Updated:** 2025-11-16

