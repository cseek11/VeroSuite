# -------------------------
# Supabase Configuration
# -------------------------
# Get these from your Supabase project dashboard: https://supabase.com/dashboard
SUPABASE_URL=https://iehzwglvmbtrlhdgofew.supabase.co
SUPABASE_SECRET_KEY=sb_secret_fd4OrQG-fhS11FgZZcVxdQ_LImGWRW9   # backend-only high privilege key

# (optional if you also need client access from frontend code)
SUPABASE_PUBLISHABLE_KEY=sb_publishable_OFGfJcRCQlPh41a2MLSSgg_iEdpZKbJ   # safe to expose in client apps

# CORS Configuration
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"

# -------------------------
# Backend Authentication
# -------------------------
# Used by your backend to sign/verify its own JWTs
# Generate a strong secret: openssl rand -hex 64
JWT_SECRET=42a3040410f06b1e1d3160745504ac60207352216ebde471812777dbc0579ac8b8b222f660d3c933c91ab85d17725207b722c47628b3baaa510b8184c26c6f5a

# (optional) token expiration times
JWT_EXPIRES_IN=1h        # example: 1 hour
REFRESH_TOKEN_EXPIRES_IN=7d  # example: 7 days

# -------------------------
# Database / Other Services
# -------------------------
# If you connect directly to Postgres
DATABASE_URL=postgresql://postgres:hhUH1lFpOGSkxPZL@db.iehzwglvmbtrlhdgofew.supabase.co:5432/postgres?connect_timeout=30

# -------------------------
# Data Encryption
# -------------------------
# AES-256-GCM encryption key for sensitive data (SSN, driver's license, etc.)
# This is a 32-byte key (64 hex characters) - DO NOT SHARE OR COMMIT TO VERSION CONTROL
# Generate a new key with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# ⚠️ ROTATED: 2025-12-05 - Previous key was exposed in compliance audit
ENCRYPTION_KEY=453fe4eeaba8b55e0463ae6118c0be4bbf694704826d78a19a0c5904bc3af003

# -------------------------
# Stripe Payment Processing (Optional)
# -------------------------
# Get these from your Stripe Dashboard: https://dashboard.stripe.com/apikeys
# For development, use test keys (sk_test_... and pk_test_...)
# For production, use live keys (sk_live_... and pk_live_...)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Note: If Stripe keys are not provided, the system will work in mock mode for development

# -------------------------
# Redis Configuration (Optional)
# -------------------------
# Redis URL for caching (if not provided, caching will be disabled)
# REDIS_URL=redis://localhost:6379
