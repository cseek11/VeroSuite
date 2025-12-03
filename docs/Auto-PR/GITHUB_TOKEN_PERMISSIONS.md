# GitHub Token Permissions for VeroScore V3

**Date:** 2025-11-24  
**Purpose:** Document required GitHub token permissions for PR creation

---

## 🔑 Token Type

**Recommended:** Fine-grained Personal Access Token (PAT)  
**Alternative:** Classic PAT (if fine-grained not available)

**Why Fine-Grained PAT:**
- ✅ Least-privilege access (repository-specific)
- ✅ Better audit trail
- ✅ Easier rotation (90-day expiration)
- ✅ More granular permissions

---

## 📋 Required Permissions

### Repository Access
- **Type:** Selected repositories only (recommended)
- **Scope:** Only the repository where PRs will be created
- **Alternative:** All repositories (if managing multiple repos)

### Repository Permissions

#### 1. Contents: **Read and Write** ✅ **REQUIRED**
- **Why:** 
  - Create branches (`git checkout -b`)
  - Stage files (`git add`)
  - Commit changes (`git commit`)
  - Push branches (`git push`)
- **Operations:**
  - Branch creation
  - File commits
  - Branch pushes

#### 2. Pull Requests: **Read and Write** ✅ **REQUIRED**
- **Why:**
  - Create pull requests (`gh pr create`)
  - Read PR information
  - Update PR descriptions (if needed)
- **Operations:**
  - PR creation via GitHub CLI
  - PR status checks
  - PR metadata retrieval

#### 3. Workflows: **Read and Write** ⚠️ **OPTIONAL** (for Phase 6)
- **Why:**
  - Trigger GitHub Actions workflows
  - Read workflow status
  - Dispatch workflow events
- **Note:** Required for Phase 6 (GitHub Workflows Integration)
- **Operations:**
  - Workflow dispatch
  - Workflow status checks

#### 4. Metadata: **Read** ✅ **REQUIRED**
- **Why:**
  - Repository information
  - Branch information
  - Basic repository metadata
- **Operations:**
  - Repository info retrieval
  - Branch validation

---

## 🔧 Token Creation Steps

### Option 1: Fine-Grained PAT (Recommended)

1. **Go to GitHub Settings:**
   ```
   https://github.com/settings/tokens?type=beta
   ```

2. **Click "Generate new token" → "Generate new token (fine-grained)"**

3. **Configure Token:**
   - **Token name:** `VeroScore V3 Auto-PR`
   - **Expiration:** 90 days (set calendar reminder)
   - **Description:** "Fine-grained PAT for VeroScore V3 automated PR creation"
   - **Repository access:** Select "Only select repositories"
   - **Repositories:** Select your repository (e.g., `VeroField`)

4. **Set Permissions:**
   - **Repository permissions:**
     - ✅ **Contents:** Read and write
     - ✅ **Pull requests:** Read and write
     - ✅ **Workflows:** Read and write (for Phase 6)
     - ✅ **Metadata:** Read-only (always enabled)

5. **Generate Token:**
   - Click "Generate token"
   - **Copy token immediately** (you won't see it again)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

6. **Store Token:**
   ```bash
   # Set as environment variable
   $env:AUTO_PR_PAT = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   
   # Or add to .env file (not committed)
   AUTO_PR_PAT=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Option 2: Classic PAT (Alternative)

1. **Go to GitHub Settings:**
   ```
   https://github.com/settings/tokens
   ```

2. **Click "Generate new token" → "Generate new token (classic)"**

3. **Configure Token:**
   - **Note:** `VeroScore V3 Auto-PR`
   - **Expiration:** 90 days
   - **Scopes:**
     - ✅ `repo` (Full control of private repositories)
       - Includes: Contents, Pull requests, Workflows, Metadata

4. **Generate and Store:**
   - Same as fine-grained PAT steps above

---

## 🔍 Verification

### Test Token Permissions

```bash
# Test token works
gh auth login --with-token <<< "ghp_your-token"

# Test PR creation (dry run)
gh pr create --title "Test PR" --body "Test" --base main --head test-branch --dry-run

# Test repository access
gh repo view owner/repo
```

### Verify Token Has Required Permissions

```bash
# Check token permissions
gh auth status

# Test branch creation
git checkout -b test-branch
git commit --allow-empty -m "Test"
git push origin test-branch

# Test PR creation
gh pr create --title "Test" --body "Test" --base main --head test-branch
```

---

## 🔒 Security Best Practices

1. **Token Storage:**
   - ✅ Store in environment variables (not in code)
   - ✅ Use `.env` file (gitignored)
   - ✅ Use GitHub Secrets for CI/CD
   - ❌ Never commit tokens to git

2. **Token Rotation:**
   - Rotate every 90 days
   - Set calendar reminder
   - Test new token before revoking old one
   - Keep old token active for 24h after rotation

3. **Token Scope:**
   - Use fine-grained PAT with repository-specific access
   - Only grant minimum required permissions
   - Review token usage regularly

4. **Token Naming:**
   - Use descriptive names: `VeroScore V3 Auto-PR`
   - Include expiration date in name
   - Document token owner

---

## 📝 Environment Variable Setup

### Windows PowerShell
```powershell
$env:AUTO_PR_PAT = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_SECRET_KEY = "your-secret-key"
```

### Linux/Mac (Bash)
```bash
export AUTO_PR_PAT="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SECRET_KEY="your-secret-key"
```

### .env File (Recommended)
```bash
# .env (gitignored)
AUTO_PR_PAT=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-secret-key
```

---

## ⚠️ Common Issues

### Issue 1: "Permission denied" when creating PR
**Cause:** Token missing "Pull requests: Write" permission  
**Fix:** Regenerate token with correct permissions

### Issue 2: "Repository not found"
**Cause:** Token doesn't have access to repository  
**Fix:** Add repository to fine-grained PAT access list

### Issue 3: "Branch push failed"
**Cause:** Token missing "Contents: Write" permission  
**Fix:** Regenerate token with Contents: Read and write

### Issue 4: "Workflow dispatch failed" (Phase 6)
**Cause:** Token missing "Workflows: Write" permission  
**Fix:** Add Workflows: Read and write permission

---

## 📊 Permission Summary Table

| Permission | Read | Write | Required For | Phase |
|------------|------|-------|--------------|-------|
| **Contents** | ✅ | ✅ | Branch creation, commits, pushes | Phase 3 |
| **Pull Requests** | ✅ | ✅ | PR creation, PR updates | Phase 3 |
| **Workflows** | ✅ | ✅ | Workflow dispatch, status checks | Phase 6 |
| **Metadata** | ✅ | ❌ | Repository info, branch info | Phase 3 |

---

## 🔗 Related Documentation

- **Implementation Plan:** `docs/Auto-PR/V3_IMPLEMENTATION_PLAN.md` (Decision 5.1)
- **Questions & Answers:** `docs/Auto-PR/V3_QUESTIONS.md` (Question 5.1)
- **Setup Guide:** `docs/Auto-PR/PHASE1_SETUP_GUIDE.md`
- **GitHub CLI Docs:** https://cli.github.com/manual/gh_auth_login

---

**Last Updated:** 2025-11-24  
**Token Type:** Fine-grained PAT (recommended) or Classic PAT  
**Expiration:** 90 days (with rotation reminder)



