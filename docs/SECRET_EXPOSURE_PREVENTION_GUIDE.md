# Secret Exposure Prevention Guide

**Date:** 2025-12-05  
**Purpose:** Comprehensive guide on how secrets become exposed and how to prevent it  
**Priority:** 🔴 CRITICAL

---

## Why Audits Flag Secrets as "Exposed"

### Understanding "Exposed" vs "Committed"

When an audit says secrets are "exposed," it typically means one of these scenarios:

1. **✅ Currently Safe (False Positive):**
   - Secrets in `.env` files that are properly gitignored
   - Secrets in local files not tracked by git
   - **Action:** Verify `.gitignore` is working correctly

2. **🔴 Actually Exposed (Real Risk):**
   - Secrets committed to git history (even if later removed)
   - Secrets in tracked files
   - Secrets in public repositories
   - Secrets in logs, error messages, or screenshots
   - **Action:** Immediate rotation required

---

## How Secrets Become Exposed

### 1. Git History (Most Common) ⚠️

**How it happens:**
```bash
# Developer accidentally commits .env
git add backend/.env
git commit -m "Add environment config"
git push

# Even if later removed:
git rm backend/.env
git commit -m "Remove .env"
git push

# ❌ Secret is STILL in git history forever!
```

**Why it's dangerous:**
- Anyone with repository access can see full history
- `git log` shows all previous commits
- Tools like `git blame` reveal when secrets were added
- Public repositories expose secrets to the entire internet

**Prevention:**
- ✅ Use `.gitignore` (already in place)
- ✅ Use pre-commit hooks to prevent commits
- ✅ Use secret scanning tools
- ✅ Never commit `.env` files

---

### 2. Accidental File Tracking

**How it happens:**
```bash
# .env was committed before .gitignore was added
# File is already tracked, so .gitignore doesn't apply
git add backend/.env  # Before .gitignore existed
git commit
# Now .gitignore won't help - file is tracked
```

**Prevention:**
```bash
# Remove from tracking (but keep local file)
git rm --cached backend/.env
git commit -m "Stop tracking .env file"
```

---

### 3. Environment Files in Wrong Locations

**How it happens:**
```bash
# Developer creates .env in root instead of backend/
# Root .env might not be gitignored
.env  # ❌ Might be tracked
backend/.env  # ✅ Properly gitignored
```

**Prevention:**
- ✅ Verify `.gitignore` covers all `.env` patterns
- ✅ Use consistent file locations
- ✅ Document where `.env` files should be

---

### 4. Secrets in Code (Hardcoded)

**How it happens:**
```typescript
// ❌ BAD - Secret hardcoded
const apiKey = "sk_live_1234567890abcdef";

// ❌ BAD - Secret in config file
export const config = {
  secret: "my-secret-key"
};
```

**Prevention:**
- ✅ Always use environment variables
- ✅ Use secret management services
- ✅ Never hardcode secrets
- ✅ Use code scanning tools

---

### 5. Secrets in Logs

**How it happens:**
```typescript
// ❌ BAD - Logging secrets
console.log("API Key:", process.env.API_KEY);
logger.error("Failed with key:", secretKey);
```

**Prevention:**
- ✅ Mask secrets in logs
- ✅ Use structured logging
- ✅ Never log environment variables
- ✅ Sanitize error messages

---

### 6. Secrets in Error Messages

**How it happens:**
```typescript
// ❌ BAD - Secret in error message
throw new Error(`Connection failed with key: ${apiKey}`);
```

**Prevention:**
- ✅ Never include secrets in error messages
- ✅ Use generic error messages
- ✅ Log details server-side only

---

### 7. Secrets in Screenshots/Documentation

**How it happens:**
- Taking screenshots of terminal with secrets visible
- Including secrets in documentation
- Sharing secrets in chat/email

**Prevention:**
- ✅ Never screenshot terminal with secrets
- ✅ Use placeholder values in docs
- ✅ Use secret management for sharing

---

### 8. Secrets in CI/CD Logs

**How it happens:**
```yaml
# ❌ BAD - Secret in CI output
- name: Deploy
  run: echo "Deploying with key ${{ secrets.API_KEY }}"
```

**Prevention:**
- ✅ Never echo secrets in CI/CD
- ✅ Use secret masking in CI/CD
- ✅ Use secure secret storage

---

### 9. Secrets in Public Repositories

**How it happens:**
- Accidentally making private repo public
- Forking public repo with secrets
- Contributing to open source with secrets

**Prevention:**
- ✅ Always verify repository is private
- ✅ Never commit secrets to public repos
- ✅ Use different keys for public/private repos

---

### 10. Secrets in Backup Files

**How it happens:**
```bash
# Backup script includes .env
tar -czf backup.tar.gz .  # Includes .env
# Backup uploaded to cloud storage
```

**Prevention:**
- ✅ Exclude `.env` from backups
- ✅ Encrypt backups
- ✅ Use secure backup storage

---

## Current Protection Status

### ✅ What's Already Protected:

1. **`.gitignore` Configuration:**
   ```
   .env
   .env.*
   !.env.example
   ```
   - ✅ `.env` files are gitignored
   - ✅ All `.env.*` variants are gitignored
   - ✅ `.env.example` is allowed (no secrets)

2. **Environment Validation:**
   - ✅ `backend/src/common/utils/env-validation.ts` validates required vars
   - ✅ Startup validation ensures secrets are present
   - ✅ Format validation for keys

3. **Documentation:**
   - ✅ `backend/env.example` provides template
   - ✅ Security guides document best practices

---

## Prevention Checklist

### Immediate Actions:

- [ ] **Verify `.env` is NOT tracked:**
  ```bash
  git ls-files | grep "\.env$"
  # Should return nothing
  ```

- [ ] **Check git history for secrets:**
  ```bash
  git log --all --full-history --source -- "*/.env"
  # Review if any .env files were ever committed
  ```

- [ ] **Set up pre-commit hooks:**
  - Install `git-secrets` or `pre-commit` hooks
  - Block commits containing secret patterns

- [ ] **Set up secret scanning:**
  - GitHub Secret Scanning (if using GitHub)
  - GitGuardian or similar tools
  - CI/CD secret scanning

### Long-term Actions:

- [ ] **Use secret management service:**
  - AWS Secrets Manager
  - HashiCorp Vault
  - Azure Key Vault
  - Supabase Vault (for Supabase secrets)

- [ ] **Implement secret rotation:**
  - Schedule regular rotations (every 90 days)
  - Automate rotation where possible
  - Document rotation procedures

- [ ] **Monitor for leaks:**
  - Set up alerts for secret exposure
  - Monitor git history
  - Scan logs for secrets

- [ ] **Educate team:**
  - Security training
  - Code review guidelines
  - Secret handling procedures

---

## Pre-Commit Hook Setup

### Option 1: Using git-secrets (Recommended)

```bash
# Install git-secrets
# macOS: brew install git-secrets
# Linux: Download from https://github.com/awslabs/git-secrets

# Configure for your repo
cd /path/to/repo
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'sk_live_[A-Za-z0-9]{24,}'
git secrets --add 'sb_secret_[A-Za-z0-9_-]+'
git secrets --add 'JWT_SECRET=[A-Za-z0-9]{32,}'
```

### Option 2: Using pre-commit Framework

```bash
# Install pre-commit
pip install pre-commit

# Create .pre-commit-config.yaml
cat > .pre-commit-config.yaml << EOF
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
  - repo: local
    hooks:
      - id: no-commit-env
        name: Prevent .env commits
        entry: bash -c 'if git diff --cached --name-only | grep -q "\.env$"; then echo "❌ Cannot commit .env files!"; exit 1; fi'
        language: system
EOF

# Install hooks
pre-commit install
```

---

## Secret Scanning Tools

### 1. GitHub Secret Scanning (If using GitHub)
- ✅ Automatically enabled for public repos
- ✅ Can be enabled for private repos
- ✅ Scans commits and pull requests
- ✅ Alerts when secrets are detected

### 2. GitGuardian
- ✅ Scans git history
- ✅ Monitors for new secrets
- ✅ Integrates with CI/CD
- ✅ Provides remediation guidance

### 3. TruffleHog
- ✅ Scans git history
- ✅ Detects high-entropy strings
- ✅ Open source
- ✅ CI/CD integration

### 4. detect-secrets
- ✅ Pre-commit hooks
- ✅ Baseline tracking
- ✅ Yelp's open source tool

---

## Verification Commands

### Check if .env is tracked:
```bash
git ls-files | grep "\.env$"
# Should return nothing
```

### Check git history for .env:
```bash
git log --all --full-history --source -- "*/.env"
# Review output for any commits
```

### Check for secrets in code:
```bash
# Search for common secret patterns
grep -r "sk_live_" --exclude-dir=node_modules .
grep -r "sb_secret_" --exclude-dir=node_modules .
grep -r "JWT_SECRET=" --exclude-dir=node_modules .
```

### Verify .gitignore is working:
```bash
# Try to add .env (should be ignored)
git add backend/.env
git status
# Should show nothing (file is ignored)
```

---

## Best Practices Summary

### ✅ DO:
- ✅ Always use `.env` files for secrets
- ✅ Keep `.env` in `.gitignore`
- ✅ Use `.env.example` for documentation
- ✅ Use environment variables in code
- ✅ Rotate secrets regularly
- ✅ Use secret management services in production
- ✅ Set up pre-commit hooks
- ✅ Use secret scanning tools
- ✅ Monitor for leaks
- ✅ Educate team on security

### ❌ DON'T:
- ❌ Never commit `.env` files
- ❌ Never hardcode secrets
- ❌ Never log secrets
- ❌ Never share secrets in chat/email
- ❌ Never screenshot terminal with secrets
- ❌ Never commit secrets to public repos
- ❌ Never use production keys in development
- ❌ Never skip secret rotation
- ❌ Never ignore security warnings

---

## Incident Response

### If Secrets Are Exposed:

1. **Immediate Actions:**
   - [ ] Rotate ALL exposed secrets immediately
   - [ ] Remove secrets from git history (if committed)
   - [ ] Notify security team
   - [ ] Assess impact

2. **Remediation:**
   - [ ] Update `.gitignore` if needed
   - [ ] Set up pre-commit hooks
   - [ ] Set up secret scanning
   - [ ] Review and fix exposure vectors

3. **Prevention:**
   - [ ] Document incident
   - [ ] Update procedures
   - [ ] Train team
   - [ ] Implement additional safeguards

---

## Related Documentation

- `docs/SECRET_ROTATION_GUIDE.md` - How to rotate exposed secrets
- `docs/SECURITY_SETUP_GUIDE.md` - Security setup procedures
- `.gitignore` - Current gitignore configuration
- `backend/env.example` - Environment variable template

---

**Last Updated:** 2025-12-05  
**Status:** Active  
**Priority:** 🔴 CRITICAL - Must be followed by all team members









