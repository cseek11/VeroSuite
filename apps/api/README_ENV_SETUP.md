# Environment Variables Setup

**Date:** 2025-11-22  
**Purpose:** Guide for setting up environment variables for the API

## Required Environment Variables

The API requires the following environment variables to start:

### 1. **SUPABASE_URL**
- Your Supabase project URL
- Format: `https://your-project-ref.supabase.co`
- Get from: [Supabase Dashboard](https://supabase.com/dashboard)

### 2. **SUPABASE_SECRET_KEY**
- Backend-only high privilege key
- Format: `sb_secret_...` (new format) or `eyJ...` (legacy JWT)
- Get from: Supabase Dashboard → Settings → API → Service Role Key

### 3. **JWT_SECRET**
- Secret key for signing/verifying JWTs
- Generate: `openssl rand -hex 64`
- Must be a strong, random string

### 4. **DATABASE_URL**
- PostgreSQL connection string
- Format: `postgresql://postgres:password@db.your-project-ref.supabase.co:5432/postgres`
- Get from: Supabase Dashboard → Settings → Database → Connection String

## Optional Environment Variables

### Supabase
- `SUPABASE_PUBLISHABLE_KEY` - Safe to expose in client apps (format: `sb_publishable_...`)

### JWT Configuration
- `JWT_EXPIRES_IN` - Token expiration (default: `1h`)
- `REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiration (default: `7d`)

### CORS
- `CORS_ORIGIN` - Allowed origins (default: `http://localhost:5173,http://localhost:3000`)

### Stripe (Optional)
- `STRIPE_SECRET_KEY` - Stripe secret key (starts with `sk_test_` or `sk_live_`)
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Webhook secret (starts with `whsec_`)

### Email (Optional)
- `SENDGRID_API_KEY` - SendGrid API key (starts with `SG.`)
- `EMAIL_FROM` - From email address
- `EMAIL_FROM_NAME` - From name
- `EMAIL_REPLY_TO` - Reply-to email

### Redis (Optional)
- `REDIS_URL` - Redis connection URL (format: `redis://localhost:6379`)

## Setup Steps

1. **Copy the example file:**
   ```bash
   cd apps/api
   cp env.example .env
   ```

2. **Edit `.env` file:**
   - Open `apps/api/.env` in your editor
   - Replace all placeholder values with your actual values
   - **Never commit `.env` to git** (it's in `.gitignore`)

3. **Verify your setup:**
   ```bash
   cd apps/api
   npm run start:dev
   ```

## Security Notes

⚠️ **CRITICAL:**
- `.env` files are in `.gitignore` - **never commit them**
- Use different secrets for dev/staging/production
- Rotate secrets if they're ever exposed
- Never share `.env` files or secrets in chat/email

## Troubleshooting

### Error: "JWT_SECRET environment variable is required"
- **Solution:** Create `apps/api/.env` file with `JWT_SECRET=your_secret_here`

### Error: "Missing required environment variables"
- **Solution:** Check that all 4 required variables are set in `.env`

### Error: "Invalid key format"
- **Solution:** Verify your Supabase keys match the expected format:
  - New format: `sb_secret_...` or `sb_publishable_...`
  - Legacy format: `eyJ...` (JWT token)

## Example `.env` File

```env
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_key_here
JWT_SECRET=your_generated_jwt_secret_here
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Optional
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
```

---

**Last Updated:** 2025-11-22








