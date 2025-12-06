# GitHub Secrets Setup for OPA Integration

**Date:** 2025-12-05  
**Purpose:** Configure GitHub Actions to send OPA compliance results to the Compliance API

---

## Required Secrets

### 1. COMPLIANCE_API_TOKEN (Required)

**Purpose:** Authentication token for the Compliance API

**How to Generate:**
1. Log in to your application
2. Get your JWT token from browser localStorage (`verofield_auth` key)
3. Or create a service account token via API

**Steps to Add:**
1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `COMPLIANCE_API_TOKEN`
5. Value: Your JWT token
6. Click **Add secret**

**Format:**
```
Bearer <your-jwt-token>
```
Or just the token (the workflow adds "Bearer" prefix)

---

### 2. COMPLIANCE_API_URL (Optional)

**Purpose:** Base URL for the Compliance API

**Default:** `http://localhost:3001/api/v1` (if not set)

**When to Set:**
- Production/staging environments
- Custom API deployment
- Different port or domain

**Steps to Add:**
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `COMPLIANCE_API_URL`
4. Value: Your API URL (e.g., `https://api.yourdomain.com/api/v1`)
5. Click **Add secret**

**Examples:**
- Production: `https://api.verofield.com/api/v1`
- Staging: `https://staging-api.verofield.com/api/v1`
- Local (for testing): `http://localhost:3001/api/v1`

---

## Verification

### Test the Integration

1. **Create a test PR:**
   ```bash
   git checkout -b test/compliance-integration
   # Make a small change
   git commit -m "test: compliance integration"
   git push origin test/compliance-integration
   # Create PR on GitHub
   ```

2. **Check GitHub Actions:**
   - Go to **Actions** tab in your repository
   - Find the "OPA Compliance Check" workflow run
   - Check the "Send results to Compliance API" step
   - Verify it completes without errors

3. **Check API Logs:**
   - Look for incoming POST requests to `/api/v1/compliance/checks`
   - Verify compliance checks are created in the database

4. **Check Dashboard:**
   - Navigate to `/compliance` in your frontend
   - Go to **Violations** tab
   - Verify violations from the PR appear

---

## Troubleshooting

### Issue: "COMPLIANCE_API_TOKEN not configured"

**Solution:** Add the `COMPLIANCE_API_TOKEN` secret to GitHub

### Issue: "Failed to send violation"

**Possible Causes:**
1. API server not running
2. Invalid API token
3. Network connectivity issues
4. API endpoint not accessible

**Solutions:**
- Verify API server is running
- Check token is valid (not expired)
- Verify API URL is correct
- Check firewall/network settings

### Issue: "No PR number found"

**Cause:** Workflow is running on push, not PR

**Solution:** This is expected - OPA integration only works for PRs. The workflow will skip API integration for push events.

---

## Security Notes

- **Never commit tokens to code**
- **Use GitHub Secrets for all sensitive data**
- **Rotate tokens regularly**
- **Use service accounts for CI/CD** (not personal tokens)
- **Limit token permissions** (read/write only what's needed)

---

## Alternative: Service Account Token

For production, consider creating a dedicated service account:

1. Create a service account user in your system
2. Generate a long-lived JWT token for the service account
3. Store token in GitHub Secrets
4. Use service account for all CI/CD operations

---

**Last Updated:** 2025-12-05  
**Next Review:** After initial deployment



