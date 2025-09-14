# Contact Form Deployment Guide

## 🚀 Deploy the Public Edge Function

### Step 1: Deploy with No JWT Verification

Run this command to deploy the Edge Function as public (no authentication required):

```bash
npx supabase functions deploy contact-submit --no-verify-jwt
```

### Step 2: Set Environment Variables

In your Supabase Dashboard, go to **Settings** → **Edge Functions** and set these environment variables:

- `SENDGRID_API_KEY`: `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`
- `NOTIFICATION_EMAIL`: `cseek@veropest.com`
- `SUPABASE_SERVICE_ROLE_KEY`: `sb_secret_ZzGLSBjMOlOgJ5Q8a-1pMQ_9wODxv6s`

### Step 3: Create Database Table

Run this SQL in your Supabase Dashboard → SQL Editor:

```sql
-- Create leads table for contact form submissions
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to insert leads
CREATE POLICY "Service role can insert leads" ON public.leads
    FOR INSERT TO service_role
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.leads TO service_role;
```

### Step 4: Test the Contact Form

1. Open your presentation page
2. Fill out the contact form
3. Submit it
4. Check:
   - Success message appears
   - Email notification sent to `cseek@veropest.com`
   - Lead saved in `leads` table in Supabase Dashboard

## ✅ What This Setup Provides

- **Public Edge Function** - No authentication required
- **Database Storage** - Leads saved to `leads` table
- **Email Notifications** - Automatic emails via SendGrid
- **Input Validation** - Email format, length limits
- **Input Sanitization** - Prevents injection attacks
- **Error Handling** - Proper error messages and logging

## 🔒 Security Features

- **Environment Variables** - No credentials in code
- **Input Validation** - Email format validation
- **Input Sanitization** - Length limits, trimming
- **Service Role Access** - Secure database operations
- **CORS Headers** - Proper cross-origin handling

## 🎯 Endpoint

Your public contact form endpoint will be:
`https://iehzwglvmbtrlhdgofew.supabase.co/functions/v1/contact-submit`

No authentication required - anyone can submit forms!