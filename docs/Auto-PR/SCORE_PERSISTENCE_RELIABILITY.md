# Score Persistence Reliability - Solution

**Last Updated:** 2025-12-05  
**Status:** ⚠️ **CRITICAL ISSUE IDENTIFIED**

---

## 🚨 Problem Statement

**Issue:** PR scores may not be persisted to the database, leading to:
- Missing score history
- Inability to track PR quality over time
- Loss of data for analytics and dashboards
- Silent failures in production Auto-PR workflows

**Root Causes:**
1. `persist_score()` may fail silently if schema access fails
2. No retry logic for transient failures
3. No verification step to confirm persistence succeeded
4. Workflow continues even if persistence fails
5. No alerting/monitoring for missed scores

---

## ✅ Solution: Multi-Layer Reliability

### 1. Enhanced Persistence with Retry Logic

**File:** `.cursor/scripts/veroscore_v3/scoring_engine.py`

**Changes:**
- Add retry logic with exponential backoff (3 attempts)
- Add explicit error handling and logging
- Return detailed status (success/failure with reason)
- Throw exception if all retries fail (don't fail silently)

**Implementation:**
```python
def persist_score(self, result: ScoreResult, max_retries: int = 3) -> Dict[str, Any]:
    """
    Persist score to Supabase with retry logic.
    
    Returns:
        {
            'success': bool,
            'attempts': int,
            'error': str | None,
            'score_id': str | None
        }
    """
    trace_ctx = get_or_create_trace_context()
    
    for attempt in range(1, max_retries + 1):
        try:
            # ... persistence logic ...
            return {
                'success': True,
                'attempts': attempt,
                'error': None,
                'score_id': response.data[0]['id'] if response.data else None
            }
        except Exception as e:
            if attempt < max_retries:
                delay = 2 ** attempt  # Exponential backoff: 2s, 4s, 8s
                logger.warn(
                    f"Persistence attempt {attempt} failed, retrying in {delay}s",
                    operation="persist_score",
                    attempt=attempt,
                    error_code="PERSIST_RETRY",
                    root_cause=str(e),
                    **trace_ctx
                )
                time.sleep(delay)
            else:
                # Final attempt failed
                logger.error(
                    "Score persistence failed after all retries",
                    operation="persist_score",
                    attempts=max_retries,
                    error_code="PERSIST_FAILED",
                    root_cause=str(e),
                    **trace_ctx
                )
                return {
                    'success': False,
                    'attempts': max_retries,
                    'error': str(e),
                    'score_id': None
                }
    
    return {'success': False, 'attempts': 0, 'error': 'Unknown error', 'score_id': None}
```

### 2. Verification Step in Workflow

**File:** `.github/workflows/verofield_auto_pr.yml`

**Add new job:**
```yaml
verify-score-persistence:
  name: Verify Score Persistence
  needs: score-pr
  if: always() && needs.score-pr.outputs.veroscore != ''
  runs-on: ubuntu-latest
  steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Python
      uses: actions/setup-python@v5
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: pip install supabase pyyaml
    
    - name: Verify Score Saved
      env:
        PR_NUMBER: ${{ needs.score-pr.outputs.pr_number }}
        SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        SUPABASE_SECRET_KEY: ${{ secrets.SUPABASE_SECRET_KEY }}
      run: |
        python .cursor/scripts/verify_score_persistence.py \
          --pr-number "$PR_NUMBER" \
          --repository "${{ github.repository }}"
    
    - name: Alert on Failure
      if: failure()
      run: |
        echo "::error::Score persistence verification failed for PR #${{ needs.score-pr.outputs.pr_number }}"
        # Could also send to Slack, email, etc.
```

### 3. Dead Letter Queue for Failed Persistence

**Purpose:** Track PRs where score persistence failed for manual retry

**Schema Addition:**
```sql
CREATE TABLE IF NOT EXISTS veroscore.persistence_failures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pr_number INTEGER NOT NULL,
    repository TEXT NOT NULL,
    session_id TEXT,
    workflow_run_id TEXT,
    error_message TEXT,
    score_data JSONB,  -- Store the score data for retry
    retry_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'retrying', 'resolved', 'ignored')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    last_retry_at TIMESTAMPTZ
);

CREATE INDEX idx_persistence_failures_status ON veroscore.persistence_failures(status) 
    WHERE status = 'pending';
CREATE INDEX idx_persistence_failures_pr ON veroscore.persistence_failures(pr_number, repository);
```

**Usage:**
- When `persist_score()` fails after all retries, save to dead letter queue
- Background job processes queue and retries persistence
- Dashboard shows failed persistences for manual intervention

### 4. Enhanced Error Handling in score_pr.py

**File:** `.github/scripts/score_pr.py`

**Changes:**
- Check persistence result and fail workflow if persistence failed
- Log detailed error information
- Save score data to artifact for manual recovery

```python
# After scoring
persist_result = engine.persist_score(result)

if not persist_result.get('success'):
    # Save score to artifact for manual recovery
    import json
    with open('score_data.json', 'w') as f:
        json.dump({
            'pr_number': args.pr_number,
            'repository': repository,
            'score': result.to_dict(),
            'error': persist_result.get('error'),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }, f, indent=2)
    
    # Upload artifact
    print(f"::error::Score persistence failed: {persist_result.get('error')}")
    print(f"::warning::Score data saved to artifact for manual recovery")
    
    # Fail the workflow (don't continue silently)
    sys.exit(1)
else:
    print(f"::notice::Score persisted successfully (attempt {persist_result['attempts']})")
    print(f"SCORE_ID={persist_result.get('score_id')}")
```

### 5. Monitoring & Alerting

**Script:** `.cursor/scripts/monitor_score_persistence.py`

**Purpose:** 
- Check for PRs that were scored but scores weren't persisted
- Alert on missing scores
- Generate report of persistence failures

**Usage:**
```bash
# Run daily cron job
python .cursor/scripts/monitor_score_persistence.py --check-last-24h --alert-on-failures
```

**Checks:**
1. Query GitHub for PRs with VeroScore comments
2. Check database for corresponding scores
3. Report missing scores
4. Send alerts for critical failures

---

## 🔧 Implementation Priority

### Phase 1: Critical (Immediate)
1. ✅ Add retry logic to `persist_score()` (3 attempts with backoff)
2. ✅ Fail workflow if persistence fails (don't continue silently)
3. ✅ Add verification step to workflow
4. ✅ Create dead letter queue table

### Phase 2: Important (This Week)
5. ✅ Create monitoring script
6. ✅ Add persistence failure logging to dead letter queue
7. ✅ Create dashboard for failed persistences

### Phase 3: Nice to Have (Next Sprint)
8. ✅ Background job to process dead letter queue
9. ✅ Slack/email alerts for persistence failures
10. ✅ Automatic retry of failed persistences

---

## 📋 Cleanup Procedure for Test PRs

### Option 1: Close Test PRs (Recommended)
```bash
# Close test PRs that are no longer needed
gh pr close 371 --comment "Test PR - closing"
gh pr close 372 --comment "Test PR - closing"
gh pr close 373 --comment "Test PR - closing"
```

### Option 2: Delete Test Branches
```bash
# Delete branches after closing PRs
git push origin --delete auto-pr-test-user-20251125-025657-session-
git push origin --delete auto-pr-test-user-20251125-030249-session-
```

### Option 3: Keep for Reference
- Keep PRs open but mark as "Test" in title
- Useful for debugging and reference
- Can close later when no longer needed

**Recommendation:** Close PRs 371, 372, 373 (they have violations and aren't useful). Keep PR #374 open to see if it passes once workflow runs.

---

## 🎯 Production Impact

### Current Risk
- **High:** Scores may be lost silently in production
- **Impact:** Missing data for analytics, dashboards, historical tracking
- **Frequency:** Unknown (need monitoring to determine)

### After Fixes
- **Low:** Persistence failures will be detected and logged
- **Recovery:** Dead letter queue allows manual/automatic retry
- **Visibility:** Dashboard shows all failures for investigation

---

## 📊 Verification Checklist

After implementing fixes, verify:

- [ ] Retry logic works (test with temporary network failure)
- [ ] Workflow fails if persistence fails (test with invalid credentials)
- [ ] Verification step catches missing scores
- [ ] Dead letter queue receives failed persistences
- [ ] Monitoring script detects missing scores
- [ ] Dashboard shows persistence failures
- [ ] Alerts fire for critical failures

---

## 🔗 Related Files

- `.cursor/scripts/veroscore_v3/scoring_engine.py` - Persistence logic
- `.github/scripts/score_pr.py` - Workflow script
- `.github/workflows/verofield_auto_pr.yml` - Workflow definition
- `.cursor/scripts/check_pr_scores.py` - Verification script (NEW)
- `.cursor/scripts/monitor_score_persistence.py` - Monitoring script (NEW)

---

**Next Steps:**
1. Implement Phase 1 fixes (retry logic, workflow failure)
2. Run verification script on PRs 370-374 to check current state
3. Set up monitoring for ongoing verification
4. Clean up test PRs as needed



