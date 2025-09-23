# 🔐 Security Setup Guide

This guide ensures your VeroPest Suite project follows security best practices for managing secrets and credentials.

## 🚨 CRITICAL: Before Backing Up to GitHub

**DO NOT commit .env files or hardcoded secrets to version control!**

## 📋 Security Checklist

- [ ] `.env` files are in `.gitignore` ✅ (Already configured)
- [ ] Created `env.example` template files ✅
- [ ] Removed hardcoded secrets from code ✅
- [ ] Added environment variable validation ✅
- [ ] Updated test scripts to use environment variables ✅

## 🛠️ Setup Instructions

### 1. Copy Environment Templates

```bash
# Backend
cp backend/env.example backend/.env

# Frontend  
cp frontend/env.example frontend/.env
```

### 2. Fill in Your Real Credentials

Edit the `.env` files with your actual values:

**Backend (.env):**
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_actual_secret_key
JWT_SECRET=your_actual_jwt_secret_here
DATABASE_URL=postgresql://postgres:your_password@db.your-project-ref.supabase.co:5432/postgres
```

**Frontend (.env):**
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_actual_publishable_key
```

### 3. Generate Strong JWT Secret

```bash
# Generate a strong 64-character hex secret
openssl rand -hex 64
```

### 4. Website Configuration

For the VeroField website, set these as global variables in your HTML:

```html
<script>
  window.SUPABASE_URL = 'https://your-project-ref.supabase.co';
  window.SUPABASE_ANON_KEY = 'your_anon_key_here';
  window.RECAPTCHA_SITE_KEY = 'your_recaptcha_site_key_here';
</script>
```

## 🔄 Key Rotation (Recommended)

Since some keys were exposed in the codebase, consider rotating:

1. **Supabase Service Role Key**: Generate new one in Supabase Dashboard
2. **JWT Secret**: Generate new strong secret
3. **Database Password**: Reset in Supabase Dashboard
4. **reCAPTCHA Keys**: Generate new ones if needed

## 🏗️ Production Deployment

### Environment Variables (Not .env files)

**For Vercel/Netlify:**
- Set environment variables in dashboard
- Use `VITE_` prefix for frontend variables

**For Docker:**
```dockerfile
ENV SUPABASE_URL=https://your-project-ref.supabase.co
ENV SUPABASE_SECRET_KEY=sb_secret_your_secret_key
ENV JWT_SECRET=your_jwt_secret
```

**For Kubernetes:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
data:
  supabase-url: <base64-encoded-url>
  supabase-secret-key: <base64-encoded-key>
  jwt-secret: <base64-encoded-secret>
```

## 🔍 Monitoring & Validation

The application now includes:

- **Startup Validation**: Checks all required environment variables
- **Key Format Validation**: Ensures keys are in correct format
- **Secure Logging**: Masks sensitive values in logs

## 🚫 What NOT to Do

- ❌ Never commit `.env` files
- ❌ Never hardcode secrets in source code
- ❌ Never use production keys in development
- ❌ Never share secrets in chat/email
- ❌ Never use weak JWT secrets

## ✅ What TO Do

- ✅ Use environment variables for all secrets
- ✅ Use strong, randomly generated secrets
- ✅ Rotate keys regularly
- ✅ Use different keys for dev/staging/prod
- ✅ Monitor for accidental leaks
- ✅ Use secret management services in production

## 🔧 Troubleshooting

### "Missing required environment variables" Error

1. Check your `.env` file exists and has correct values
2. Ensure no typos in variable names
3. Restart your application after changes

### "Environment variable validation failed" Error

1. Check key formats match expected patterns
2. Ensure JWT secret is at least 32 characters
3. Verify Supabase URL format

### Test Scripts Failing

1. Ensure `.env` file is in the correct location
2. Check environment variable names match
3. Run scripts from the correct directory

## 📚 Additional Resources

- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/local-development)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [OWASP Secrets Management](https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure)

---

**Remember**: Security is an ongoing process. Regularly review and update your security practices!
