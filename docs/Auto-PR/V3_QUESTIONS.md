# VeroScore V3 - Implementation Questions

**Created:** 2025-12-05  
**Last Updated:** 2025-12-05  
**Status:** ✅ ANSWERS PROVIDED - Ready for Implementation  
**Priority:** CRITICAL - Required before implementation begins

---

## 📋 Purpose

This document contains all clarifying questions that need to be answered before implementing VeroScore V3. These questions are organized by category to facilitate review and decision-making.

**Related Documents:**
- `V3_IMPLEMENTATION_PLAN.md` - Full implementation plan
- `Developer Plan VeroField Governance.md` - System design document (VeroScore V3)

---

## 1. Migration Strategy

### Question 1.1: Migration Approach

**Question:** How should we handle the transition from the existing Auto-PR system to VeroScore V3?

**Options:**
- **Option A:** Big bang replacement (all at once)
- **Option B:** Gradual migration (run both systems in parallel)
- **Option C:** Feature flag approach (enable VeroScore V3 per developer)

**✅ ANSWER:** Option C - Feature flag approach

**Rationale:**
- Safest rollout - can enable per developer
- Easy rollback if issues arise
- Allows A/B testing of scoring accuracy
- Gradual team adoption reduces support burden

**Implementation:**
```yaml
# .cursor/config/auto_pr_config.yaml
veroscore:
  enabled: true  # Set to false to disable for specific developer
  version: "V3"
  fallback_to_legacy: false  # Use old system if VeroScore V3 fails
```

**Additional Notes:**
- Start with 2-3 pilot developers
- Expand to 25% after 1 week
- Full rollout after 2 weeks if no issues

---

### Question 1.2: Existing Session Data

**Question:** What happens to existing sessions in the old system?

**✅ ANSWER:** Start fresh with VeroScore V3, optionally export legacy data for reference

**Rationale:**
- Legacy data format likely incompatible
- Migration complexity not worth effort
- VeroScore V3 schema is significantly different
- Historical data less valuable than ongoing metrics

**Implementation:**
- Export existing sessions to JSON/CSV for archival
- Start VeroScore V3 with clean slate
- Keep legacy system read-only for 30 days
- Delete legacy data after 90 days

**Additional Notes:**
- If historical trends are critical, create a one-time import script to populate `pr_scores_archive` table with summary data only

---

### Question 1.3: Existing PRs

**Question:** How do we handle PRs created by the old system?

**✅ ANSWER:** Only new PRs use VeroScore V3 scoring; no backfilling

**Rationale:**
- Backfilling would be expensive (API calls, compute)
- Scores would be inconsistent (different code states)
- Focus resources on future improvements
- Old PRs already merged/closed

**Implementation:**
- PRs created before VeroScore V3 launch: Keep existing scores
- PRs created after VeroScore V3 launch: Use new scoring
- Dashboard clearly separates v2 vs V3 scores

**Additional Notes:**
- Add a `scoring_version` column to track which engine scored each PR

---

## 2. Supabase Configuration

### Question 2.1: Supabase Project Setup

**Question:** Do we have a Supabase project already set up?

**✅ ANSWER:** Create new dedicated Supabase project for veroscore (separate from CRM database)

**Rationale:**
- **CRITICAL:** Use a SEPARATE database for isolation
- veroscore generates high-volume transactional data (file changes, sessions, scores)
- Mixing with CRM could cause connection pool exhaustion, impact CRM performance, create noisy metrics/logs
- Schema independence: veroscore needs specialized schemas (materialized views, cron jobs, audit logs)
- Scaling: veroscore can scale independently without affecting CRM performance
- Security: Different RLS policies - veroscore data is more permissive (developers need access), CRM is tenant-isolated
- Disaster Recovery: If veroscore crashes, your CRM stays operational

**Implementation:**
```bash
# Project details
Name: {company}-veroscore
Region: us-east-1 (or closest to team)
Plan: Free tier initially, upgrade to Pro if >500MB

# Connection strings
SUPABASE_URL=https://{project-id}.supabase.co
SUPABASE_KEY={anon-key}
SUPABASE_SERVICE_ROLE_KEY={service-role-key}
```

**Additional Notes:**
- Multi-environment setup:
  - Dev: Local Supabase instance (Docker)
  - Staging: Dedicated Supabase project
  - Prod: Separate project with backups
- Estimated veroscore data: ~50MB/month for 10 developers, manageable on free tier initially

---

### Question 2.2: Row Level Security (RLS) Policies

**Question:** What RLS policies should be implemented?

**✅ ANSWER:** Implement tiered RLS policies with service role bypass

**Rationale:**
- Developers need read access to own data for debugging
- Service role (GitHub Actions) needs full write access
- Sensitive data (violations) should be team-readable
- Audit logs should be append-only

**Implementation:**
```sql
-- Developers can view own sessions
CREATE POLICY "developers_own_sessions" ON sessions
  FOR SELECT USING (author = current_user);

-- Service role has full access
CREATE POLICY "service_role_all" ON sessions
  FOR ALL USING (current_user = 'service_role');

-- Team members can view all PR scores (transparency)
CREATE POLICY "team_view_scores" ON pr_scores
  FOR SELECT USING (auth.role() = 'authenticated');

-- Audit logs are append-only and readable
CREATE POLICY "audit_append_only" ON audit_log
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "audit_team_read" ON audit_log
  FOR SELECT USING (auth.role() = 'authenticated');
```

**Additional Notes:**
- Use Supabase Auth for developer authentication, mapping GitHub usernames to Supabase users

---

### Question 2.3: Supabase Tier & Scaling

**Question:** What are the Supabase tier/limits?

**✅ ANSWER:** Start with Free tier, plan for Pro upgrade at 50+ devs or 500MB

**Rationale:**
- Free tier: 500MB storage, 2GB bandwidth, adequate for <20 devs
- Pro tier ($25/mo): 8GB storage, 50GB bandwidth, better for teams
- Data volume estimate: ~2-5MB per developer per month

**Implementation:**
- Free Tier (0-20 devs): ~100MB/month
- Pro Tier (20-100 devs): ~500MB/month
- Team Tier (100+ devs): Custom plan

**Archival Strategy:**
```sql
-- Archive data >90 days old (runs monthly)
SELECT archive_old_pr_scores(90);  -- Move to pr_scores_archive

-- Export archives to S3/GCS for long-term storage
-- Delete archived data after 1 year
```

**Additional Notes:**
- Monitor via dashboard: Database size, row counts
- Alert at 80% capacity
- Automated archival prevents surprise overages

---

## 3. File Watcher Deployment

### Question 3.1: Deployment Model

**Question:** How should the file watcher be deployed?

**✅ ANSWER:** Option A initially (local process), evolve to Option C (hybrid)

**Rationale:**
- Local deployment is simplest for rollout
- No infrastructure setup required
- Developer-specific configurations easy
- Centralized coordination can be added later

**Implementation:**

**Phase 1 (Local):**
```bash
# Each developer runs locally
python .cursor/scripts/file_watcher.py &

# Add to shell startup (.bashrc/.zshrc)
alias veroscore-start="cd ~/projects/myapp && python .cursor/scripts/file_watcher.py &"
```

**Phase 2 (Hybrid):**
```bash
# Central coordinator tracks all sessions
# Local agents report to coordinator
# Coordinator handles PR creation (prevents conflicts)
```

**Additional Notes:**
- Create a systemd/launchd service for auto-start on dev machines

---

### Question 3.2: Failure Handling

**Question:** How do we handle file watcher failures?

**✅ ANSWER:** Implement local queue with automatic retry and max 100 changes buffer

**Rationale:**
- Network hiccups are common
- Don't lose developer work due to temporary outages
- Bounded queue prevents runaway disk usage
- Exponential backoff prevents API hammering

**Implementation:**
```python
class LocalQueue:
    def __init__(self, max_size=100):
        self.queue = deque(maxlen=max_size)
        self.retry_delay = 5  # seconds
        
    async def flush_to_supabase(self):
        while self.queue:
            try:
                changes = list(self.queue)
                supabase.table('changes_queue').insert(changes).execute()
                self.queue.clear()
                self.retry_delay = 5  # Reset
            except Exception as e:
                logger.warning("supabase_unavailable", error=str(e))
                await asyncio.sleep(self.retry_delay)
                self.retry_delay = min(self.retry_delay * 2, 60)  # Max 1 min
```

**Additional Notes:**
- If queue fills (100 changes), alert developer
- Option to manually flush: `veroscore flush`
- Persist queue to disk for process restarts

---

### Question 3.3: Concurrent Development

**Question:** How do we handle multiple developers working on the same files?

**✅ ANSWER:** Each developer gets own session; branch-based conflict prevention

**Rationale:**
- Session-per-developer prevents collision
- Branch names include author: `auto-pr-{author}-{timestamp}`
- Supabase unique constraint on active sessions per author
- PR creation is atomic with idempotency keys

**Implementation:**
```sql
-- Only one active session per author
CREATE UNIQUE INDEX idx_active_session_per_author 
  ON sessions(author, status) WHERE status = 'active';
```

```python
# Branch naming prevents conflicts
branch_name = f"auto-pr-{author}-{session_id}"
# e.g., "auto-pr-alice-20251121-1430"

# Idempotency key prevents double-creation
key = hash(f"create_pr:{session_id}")
```

**Additional Notes:**
- If two devs modify same file, both get separate PRs
- Merge conflicts resolved normally during PR merge
- Dashboard shows all active sessions per developer

---

## 4. Configuration Management

### Question 4.1: Configuration File Location

**Question:** Where should configuration files live?

**✅ ANSWER:** Committed to git with per-developer override support

**Rationale:**
- Team standardization via committed defaults
- Per-developer customization via local overrides
- Version-controlled changes to configuration
- Easy rollback of config changes

**Implementation:**
```bash
# Committed to git
.cursor/config/auto_pr_config.yaml          # Team defaults

# Per-developer overrides (gitignored)
.cursor/config/auto_pr_config.local.yaml    # Developer overrides

# Loading priority:
# 1. Load defaults
# 2. Overlay local overrides
# 3. Apply environment variables (highest priority)
```

**Example:**
```yaml
# auto_pr_config.yaml (committed)
thresholds:
  min_files: 3
  min_lines: 50

# auto_pr_config.local.yaml (gitignored)
thresholds:
  min_files: 5  # Alice prefers higher threshold
```

**Additional Notes:**
- Document override mechanism in onboarding guide

---

### Question 4.2: Default Threshold Values

**Question:** What are the default threshold values?

**✅ ANSWER:** Use proposed defaults with 30-day tuning period

**Current Defaults (Good Starting Point):**
```yaml
min_files: 3              # ✅ Reasonable
min_lines: 50             # ✅ Prevents tiny PRs
max_wait_seconds: 300     # ✅ 5 min is good
debounce_seconds: 2.0     # ✅ Handles rapid edits
```

**Rationale:**
- Values based on typical development patterns
- 3 files = meaningful feature unit
- 50 lines = enough for scoring accuracy
- 5 minutes = prevents forgotten sessions
- 2 seconds = debounce typing pauses

**Tuning Plan:**
- Week 1: Track metrics (files/PR, session duration)
- Week 2-4: Adjust based on data
- Month 2+: Per-team customization

**Metrics to Track:**
```sql
-- Average files per session
SELECT AVG(total_files) FROM sessions WHERE status = 'completed';

-- Session duration distribution
SELECT 
  EXTRACT(EPOCH FROM (completed_at - started)) / 60 as duration_minutes,
  COUNT(*)
FROM sessions
WHERE status = 'completed'
GROUP BY 1
ORDER BY 1;
```

**Additional Notes:**
- Add dashboard widget showing threshold effectiveness

---

### Question 4.3: File Exclusion Patterns

**Question:** How do we handle excluded file patterns?

**✅ ANSWER:** Global exclusions committed, per-developer additions in local config

**Rationale:**
- Standard exclusions prevent noise (node_modules, .env)
- Per-developer additions for IDE-specific files
- Glob patterns simpler than regex (easier to maintain)

**Implementation:**
```yaml
# Committed defaults
exclusions:
  patterns:
    # Dependencies
    - "node_modules/**"
    - "vendor/**"
    - ".venv/**"
    
    # Build artifacts
    - "dist/**"
    - "build/**"
    - "*.pyc"
    - "__pycache__/**"
    
    # Config/secrets
    - ".env"
    - ".env.*"
    - "*.key"
    - "*.pem"
    
    # IDE
    - ".idea/**"
    - ".vscode/**"
    - "*.swp"
    
    # Logs
    - "*.log"
    - "logs/**"
    
    # Generated
    - "*.generated.*"
    - "**/migrations/*.sql"  # Auto-generated migrations
```

**Additional Notes:**
- Support `!pattern` for exceptions (e.g., `!important.generated.ts`)

---

## 5. GitHub Integration

### Question 5.1: GitHub Permissions

**Question:** What GitHub permissions are required?

**✅ ANSWER:** Use fine-grained PAT for security, store in GitHub Secrets

**Required Permissions:**
```
Repository Access: Selected repositories only
Permissions:
  ✅ Contents: Read and write (for branch creation)
  ✅ Pull requests: Read and write (for PR creation/approval)
  ✅ Workflows: Read and write (for workflow dispatch)
  ✅ Metadata: Read (for repo info)
```

**Rationale:**
- Fine-grained PATs have least-privilege
- Easier to rotate than classic tokens
- Better audit trail
- Can be repository-specific

**Implementation:**
```bash
# Create PAT at: https://github.com/settings/tokens?type=beta
# Name: veroscore V3
# Expiration: 90 days (set calendar reminder)

# Store in GitHub Secrets
gh secret set AUTO_PR_PAT --body "ghp_xxxxx"
gh secret set SUPABASE_URL --body "https://xxx.supabase.co"
gh secret set SUPABASE_KEY --body "eyJxxx"

# Rotation procedure (every 90 days):
# 1. Create new PAT
# 2. Test in staging
# 3. Update secret in production
# 4. Revoke old PAT after 24h
```

**Additional Notes:**
- Document PAT owner (who created it)
- Add to password manager for team access
- Consider GitHub App for larger orgs (better audit)

---

### Question 5.2: Branch Naming Conflicts

**Question:** How do we handle branch naming conflicts?

**✅ ANSWER:** Include author + UUID suffix; check for collisions

**Format:** `auto-pr-{author}-{timestamp}-{uuid4[:8]}`

**Example:** `auto-pr-alice-20251121-1430-a3f9d2e1`

**Rationale:**
- Author prefix enables per-dev filtering
- Timestamp for human readability
- UUID suffix prevents ALL collisions (2^32 space)
- Collision probability: ~0.000001% even with 1M sessions

**Implementation:**
```python
import uuid
from datetime import datetime

def generate_branch_name(author: str) -> str:
    timestamp = datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')
    unique_suffix = uuid.uuid4().hex[:8]
    branch_name = f"auto-pr-{author}-{timestamp}-{unique_suffix}"
    
    # Verify no collision (defensive)
    result = subprocess.run(
        ['git', 'ls-remote', '--heads', 'origin', branch_name],
        capture_output=True
    )
    if result.stdout:
        # Collision detected (extremely rare), retry
        return generate_branch_name(author)
    
    return branch_name
```

**Cleanup Strategy:**
```bash
# Delete merged auto-pr branches after 30 days
git branch -r --merged | grep 'auto-pr-' | \
  xargs -I {} git push origin --delete {}
```

**Additional Notes:**
- Add cleanup job to GitHub Actions (weekly)

---

### Question 5.3: Auto-Merge Strategy

**Question:** Should auto-merge be enabled by default?

**✅ ANSWER:** Disabled by default; opt-in per repository with strict requirements

**Rationale:**
- Safety first - auto-merge is high risk
- Require explicit opt-in
- Multiple safety checks before merge
- Easy to disable if issues arise

**Implementation:**
```yaml
# Enable via config
auto_merge:
  enabled: false  # MUST be explicitly set to true
  
  # Strict requirements
  requirements:
    min_score: 8.0                    # High bar
    pipeline_complete: true           # All 5 steps done
    no_critical_violations: true      # Zero tolerance
    branch_protected: true            # Must pass all checks
    approvals_required: 1             # At least 1 human approval
    ci_checks_passing: true           # All tests pass
    
  # Exclusions (never auto-merge)
  excluded_paths:
    - "migrations/**"                 # DB changes require review
    - "**/auth/**"                    # Auth changes require review
    - "**/billing/**"                 # Financial code requires review
    - ".github/workflows/**"          # CI changes require review
```

**Additional Notes:**
- Recommendation: Start with `enabled: false` for 3+ months, then enable for specific repos
- Add Slack notification for ALL auto-merges

---

## 6. Scoring & Detection

### Question 6.1: False Positive Handling

**Question:** How do we handle false positives in detection?

**✅ ANSWER:** Support exception comments with required justification and tracking

**Rationale:**
- False positives are inevitable (admin ops, test code)
- Exception mechanism prevents developer frustration
- Justification required prevents abuse
- Tracking enables audit

**Implementation:**
```python
# Supported exception comments
EXCEPTION_PATTERNS = {
    'rls': [
        '// veroscore:ignore rls - admin operation',
        '# veroscore:ignore rls - system user',
        '/* veroscore:ignore rls - migration script */'
    ],
    'hardcoded': [
        '// veroscore:ignore hardcoded - test data',
        '// veroscore:ignore hardcoded - example code'
    ]
}

def check_for_exception(line: str, violation_type: str) -> Optional[str]:
    """Returns justification if exception found"""
    for pattern in EXCEPTION_PATTERNS.get(violation_type, []):
        if pattern in line.lower():
            # Extract justification
            return line.split('-', 1)[1].strip()
    return None

# In detection function
if exception_justification:
    # Log exception
    supabase.table('exception_log').insert({
        'pr_number': pr_number,
        'rule_id': violation.rule_id,
        'justification': exception_justification,
        'file_path': file_path,
        'line_number': line_number
    }).execute()
    
    # Don't apply penalty
    continue
```

**Exception Review Process:**
1. Developer adds comment with justification
2. Violation is logged but not penalized
3. Monthly review of exceptions by tech lead
4. Patterns of abuse → coaching conversation

**Dashboard View:**
```
Exception Usage Report (Last 30 Days):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
alice     12 exceptions  (8 RLS, 4 hardcoded)
bob        3 exceptions  (3 RLS)
carol     45 exceptions  ⚠️ REVIEW NEEDED
```

**Additional Notes:**
- Add warning if developer uses >10 exceptions per month

---

### Question 6.2: Detection Function Extensibility

**Question:** Should detection functions be pluggable?

**✅ ANSWER:** Support plugin system with versioning and registry

**Rationale:**
- Teams need custom rules (company-specific patterns)
- Versioning enables safe updates
- Registry prevents conflicts
- Enables community sharing

**Implementation:**
```python
# Plugin structure
class CustomDetector:
    """Custom detection function"""
    
    name = "company_specific_pattern_detector"
    version = "1.0.0"
    priority = 10  # Lower = runs first
    
    def detect(self, file_path: str, content: str) -> List[ViolationResult]:
        """Implement detection logic"""
        violations = []
        
        # Example: Detect usage of deprecated API
        if 'oldApiFunction' in content:
            violations.append(ViolationResult(
                detector_name=self.name,
                severity='high',
                rule_id='CUSTOM-001',
                message='Usage of deprecated oldApiFunction',
                penalty=-25.0
            ))
        
        return violations

# Registry
CUSTOM_DETECTORS = [
    CustomDetector(),
    AnotherCustomDetector(),
]

# In MasterDetector
def __init__(self):
    self.detectors = [
        # Built-in detectors
        RLSViolationDetector(),
        ArchitectureDriftDetector(),
        # ... etc
    ] + CUSTOM_DETECTORS  # Add custom
```

**Plugin Location:**
```
.cursor/scripts/detectors/
  ├── __init__.py
  ├── custom_detector_1.py
  ├── custom_detector_2.py
  └── README.md  # Documentation
```

**Additional Notes:**
- Create detector template and contribution guide

---

### Question 6.3: Performance Targets

**Question:** What's the performance target for scoring?

**✅ ANSWER:** Target <1s per file, <30s total, with parallelization and caching

**Rationale:**
- Developers expect fast feedback
- Long scans block PRs
- Parallelization leverages multi-core
- Caching prevents duplicate work

**Implementation:**
```python
import concurrent.futures

class MasterDetector:
    def detect_all(
        self, 
        changed_files: List[Dict],
        max_workers: int = 4
    ) -> List[ViolationResult]:
        """Parallel detection"""
        
        all_violations = []
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all file scans
            future_to_file = {
                executor.submit(self._scan_file, file_data): file_data
                for file_data in changed_files
            }
            
            # Collect results with timeout
            for future in concurrent.futures.as_completed(
                future_to_file, 
                timeout=30  # 30s max
            ):
                try:
                    violations = future.result(timeout=5)  # 5s per file
                    all_violations.extend(violations)
                except concurrent.futures.TimeoutError:
                    file_data = future_to_file[future]
                    logger.error(
                        "detector_timeout",
                        file=file_data['path'],
                        timeout=5
                    )
                except Exception as e:
                    logger.error("detector_failed", error=str(e))
        
        return all_violations
    
    def _scan_file(self, file_data: Dict) -> List[ViolationResult]:
        """Scan single file with all detectors"""
        file_path = file_data['path']
        content = file_data['content']
        
        # Check cache first
        cache_key = f"{file_path}:{hash(content)}"
        if cache_key in self.result_cache:
            logger.debug("cache_hit", file=file_path)
            return self.result_cache[cache_key]
        
        violations = []
        for detector in self.detectors:
            violations.extend(detector.detect(file_path, content))
        
        # Cache result
        self.result_cache[cache_key] = violations
        return violations
```

**Performance Targets:**
- Per-file scan: <1s (for typical 200-line file)
- Total scan time: <30s (for 20 files)
- Cache hit rate: >50% (for unchanged files)
- Timeout handling: Graceful degradation

**Additional Notes:**
- Add dashboard alert if p95 scan time > 30s

---

## 7. Dashboard Deployment

### Question 7.1: Hosting Strategy

**Question:** Where should the dashboard be hosted?

**✅ ANSWER:** Yes - Run Fully Local for Year 1, Design for Easy Cloud Migration

**Rationale:**
For in-house development with a small team, running everything locally is the optimal choice:
- Zero Cloud Costs: No Vercel/Railway fees during development phase
- Faster Iteration: No deployment delays when testing changes
- Full Control: Debug with direct access to all components
- Network Independence: Works offline or with VPN restrictions
- Easy Transition: Architecture designed for seamless cloud migration later

**Local Development Architecture:**
```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPER MACHINE(S)                          │
│                                                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐       │
│  │ File Watcher │   │Dashboard API │   │  Dashboard   │       │
│  │              │   │              │   │   Frontend   │       │
│  │ Python       │   │ FastAPI      │   │   Next.js    │       │
│  │ Port: N/A    │   │ Port: 8000   │   │   Port: 3000 │       │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘       │
│         │                  │                   │                │
│         └──────────────────┼───────────────────┘                │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │ Supabase Cloud   │
                   │ (Shared State)   │
                   │ Free Tier        │
                   └──────────────────┘
```

**Key Points:**
- Supabase: Still in cloud (free tier) - provides shared state for all developers
- File Watcher: Runs on each developer's machine
- Dashboard API: Run locally, one per developer OR shared on one dev machine
- Dashboard Frontend: Run locally, developers access via localhost:3000

**Implementation Options:**

**Option A: Individual Setup (Recommended for <5 Devs)**
Each developer runs their own dashboard locally.

**Option B: Shared Dashboard (Recommended for 5-15 Devs)**
One developer hosts the dashboard on their machine; others access it.

**Option C: Docker Compose (Recommended for 15+ Devs)**
Run entire dashboard stack in Docker on one machine.

**Migration Path: Local → Cloud (When Ready)**
When you're ready to scale (Year 2+), migration is straightforward:
- Phase 1: Keep Dashboard Local, Move Database to Prod (no changes needed)
- Phase 2: Move Dashboard to Cloud (deploy API to Railway, Frontend to Vercel)
- Phase 3: Add External Users (enable GitHub OAuth)

**Cost Comparison:**
- Year 1 (Local Development, 10 Devs): $0/month (vs $30/month cloud)
- Year 2+ (Production, 50 Devs): N/A local (vs $75/month cloud)

**Additional Notes:**
- Start local, cloud is a one-day migration when needed
- See full implementation details in answers document (Question 7.1 section)

---

### Question 7.2: Authentication

**Question:** How do we handle authentication for the dashboard?

**✅ ANSWER:** Use Supabase Auth with GitHub OAuth provider

**Rationale:**
- Seamless integration (already using Supabase)
- GitHub OAuth matches developer workflow
- No separate user management needed
- Built-in session handling

**Implementation:**
1. Enable GitHub OAuth in Supabase Dashboard
2. Configure GitHub OAuth App at https://github.com/settings/developers
3. Implement in Dashboard frontend using Supabase client
4. Protect API routes with JWT token verification

**User Mapping:**
```sql
-- Map GitHub usernames to Supabase users
CREATE TABLE user_mappings (
    github_username TEXT PRIMARY KEY,
    supabase_user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-populate on first login
CREATE OR REPLACE FUNCTION map_github_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_mappings (github_username, supabase_user_id)
    VALUES (NEW.raw_user_meta_data->>'user_name', NEW.id)
    ON CONFLICT (github_username) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Additional Notes:**
- Support email fallback for non-GitHub users
- Add role-based access (admin, developer, viewer)
- Implement SSO if enterprise required later
- For local development, can use simplified HTTP Basic Auth or disable auth entirely

---

### Question 7.3: Data Retention

**Question:** What's the data retention policy?

**✅ ANSWER:** 90-day active retention, 1-year archive, permanent deletion after

**Rationale:**
- 90 days covers most analytics needs
- 1 year satisfies audit requirements
- Permanent deletion prevents unbounded growth
- Configurable per data type

**Implementation:**
```yaml
data_retention:
  # Active data (full queryable access)
  sessions:
    active_days: 90
    archive_days: 365
    
  pr_scores:
    active_days: 90
    archive_days: 365
    
  detection_results:
    active_days: 90
    archive_days: 365
  
  changes_queue:
    active_days: 30   # Shorter - high volume
    archive_days: 90
  
  # Logs
  audit_log:
    active_days: 180  # Longer for compliance
    archive_days: 730  # 2 years
  
  system_metrics:
    active_days: 30
    archive_days: 365
```

**Archival Process:**
- Auto-archive function runs monthly (scheduled via pg_cron)
- Moves data from active tables to archive tables
- Permanent deletion of archives after retention period
- Export API endpoint for compliance exports (JSON/CSV)

**Additional Notes:**
- Add dashboard warning when approaching retention limits
- Allow manual extension for specific PRs (e.g., incident investigation)
- Encrypt archived data if compliance required

---

## 8. Error Handling & Recovery

### Question 8.1: Supabase Unavailability

**Question:** What happens if Supabase is unavailable?

**✅ ANSWER:** Queue locally with automatic flush, max 1000 changes, 24h retention

**Rationale:**
- Local queue prevents data loss
- Bounded size prevents disk issues
- 24h window covers most outages
- Automatic flush when service returns

**Implementation:**
- Persistent queue stored on disk (`.cursor/queue.pkl`)
- Max size: 1000 changes
- Automatic retry with exponential backoff (5s → 60s max)
- Flush every 30 seconds when Supabase is available
- Alert developer if queue >80% full

**Recovery Procedure:**
1. Detect outage: Supabase requests fail
2. Switch to queue: All changes go to local queue
3. Monitor: Check Supabase health every 30s
4. Flush: When healthy, flush queue automatically
5. Alert: If queue fills, notify developer

**Additional Notes:**
- Add `veroscore status` command to check queue
- Notify in Slack if queue >50% full
- Consider S3 backup for very long outages

---

### Question 8.2: GitHub Actions Failures

**Question:** What happens if GitHub Actions fails?

**✅ ANSWER:** Automatic retry with exponential backoff, max 3 attempts, dead letter queue

**Rationale:**
- Transient failures are common (rate limits, network)
- Exponential backoff prevents thundering herd
- Dead letter queue captures permanent failures
- Manual intervention for stuck workflows

**Implementation:**
- Use `nick-fields/retry@v2` action in workflow
- Max 3 attempts with exponential backoff (1 min, 2 min, 4 min)
- Dead letter queue table in Supabase for permanent failures
- Dashboard component to view and retry failed workflows
- CLI command: `veroscore retry-workflow --pr 1234`

**Dead Letter Queue:**
```sql
CREATE TABLE workflow_failures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pr_number INTEGER NOT NULL,
    workflow_run_id TEXT,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'retrying', 'resolved', 'ignored')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);
```

**Additional Notes:**
- Alert in Slack if >5 failures in 1 hour
- Weekly review of dead letter queue
- Add metrics for failure rate trends

---

### Question 8.3: Orphaned Sessions

**Question:** How do we handle orphaned sessions?

**✅ ANSWER:** Auto-complete after 30 min inactivity, optional PR creation, daily cleanup

**Rationale:**
- 30 minutes covers lunch/meetings
- Optional PR creation prevents lost work
- Daily cleanup keeps database clean
- Developer notification for awareness

**Implementation:**
- Auto-timeout function runs every 15 minutes (pg_cron)
- Sessions with changes: Mark as 'idle', optionally auto-create PR
- Sessions without changes: Mark as 'completed'
- Notification service listens for orphaned session events
- Configuration options for timeout duration and auto-PR creation

**Configuration:**
```yaml
orphan_handling:
  timeout_minutes: 30
  auto_create_pr: true  # Create PR automatically?
  min_files_for_pr: 1   # Minimum files to justify PR
  notification:
    slack: true
    email: false
```

**Additional Notes:**
- Add dashboard showing "idle" sessions
- Allow manual "resume session" command
- Track orphan rate as quality metric

---

## 9. Testing Strategy

### Question 9.1: Testing Approach

**Question:** What's the testing approach?

**✅ ANSWER:** Comprehensive testing with dedicated test Supabase instance

**Rationale:**
- Unit tests catch logic errors
- Integration tests verify component interaction
- E2E tests validate full workflow
- Test isolation prevents production impact

**Test Structure:**
```
tests/
├── unit/
│   ├── test_file_watcher.py
│   ├── test_scoring_engine.py
│   ├── test_detection_functions.py
│   └── test_pr_creator.py
├── integration/
│   ├── test_session_flow.py
│   ├── test_pr_workflow.py
│   └── test_dashboard_api.py
├── e2e/
│   ├── test_full_workflow.py
│   └── test_rescore_flow.py
├── fixtures/
│   ├── sample_files/
│   └── test_data.sql
└── conftest.py  # Pytest configuration
```

**Test Environments:**
- Unit: Use mocks (no external dependencies)
- Integration: Dedicated Supabase test instance
- E2E: Staging Supabase instance + test GitHub repo

**Coverage Targets:**
- Unit tests: >80% code coverage
- Integration tests: All critical paths
- E2E tests: Happy path + 2 failure scenarios

**Additional Notes:**
- Run unit tests on every commit
- Run integration tests on PR
- Run E2E tests nightly

---

### Question 9.2: Detection Function Testing

**Question:** How do we test detection functions?

**✅ ANSWER:** Golden test suite with known violations, regression testing, performance benchmarks

**Rationale:**
- Golden tests ensure consistency
- Regression tests prevent breakage
- Performance benchmarks catch slowdowns
- Test data version-controlled

**Golden Test Files:**
```
tests/fixtures/golden_tests/
├── rls_violations/
│   ├── missing_filter.ts          # SHOULD detect
│   ├── with_filter.ts              # Should NOT detect
│   ├── admin_operation.ts          # Exception comment
│   └── expected_results.json       # Expected violations
├── hardcoded_values/
│   ├── api_key_in_code.ts
│   ├── tenant_id_hardcoded.ts
│   └── expected_results.json
└── ...
```

**Test Types:**
1. **Golden Tests:** Test against known violation examples with expected results
2. **Regression Tests:** Prevent known past issues from recurring
3. **Performance Benchmarks:** Ensure <1s per file, <30s total

**Additional Notes:**
- Update golden tests when detectors improve
- Add new golden test for each bug fix
- Review performance trends monthly
- Continuous benchmarking via GitHub Actions (daily)

---

### Question 9.3: Load Testing

**Question:** What's the load testing plan?

**✅ ANSWER:** Simulate 50 concurrent developers, 1000 changes/day, validate <5s p95 latency

**Rationale:**
- 50 devs = medium-large team
- 1000 changes/day = active team (20 changes per dev)
- p95 latency = 95% of operations fast
- Identifies bottlenecks before production

**Load Test Scenarios:**
1. **Normal Load:** 50 devs, 20 changes each
2. **Peak Load:** 100 devs, 30 changes each
3. **Spike Load:** All devs commit at once
4. **Sustained Load:** 8 hours of activity

**Performance Targets:**
- P95 latency: <5 seconds
- Average latency: <2 seconds
- Operations/sec: Measure and track
- Connection pool: Test exhaustion scenarios

**Implementation:**
- Load test script using asyncio/aiohttp
- Simulate developer activity patterns
- Monitor Supabase connection pool usage
- Track metrics during load tests
- Automated load testing via GitHub Actions (weekly)

**Additional Notes:**
- Run load tests against staging, not production
- Clean up test data after runs
- Track trends over time to catch performance degradation

---

## 10. Documentation & Training

### Question 10.1: Documentation Requirements

**Question:** What documentation is needed?

**✅ ANSWER:** Multi-format documentation with interactive elements

**Rationale:**
- Different audiences need different formats
- Interactive docs improve understanding
- Video tutorials increase adoption
- Searchable knowledge base reduces support burden

**Documentation Structure:**
```
docs/
├── README.md                          # Landing page
├── getting-started/
│   ├── 01-overview.md
│   ├── 02-installation.md
│   ├── 03-your-first-pr.md
│   └── 04-understanding-scores.md
├── user-guides/
│   ├── developer-workflow.md
│   ├── fixing-violations.md
│   ├── exception-handling.md
│   └── dashboard-usage.md
├── configuration/
│   ├── file-watcher-config.md
│   ├── threshold-tuning.md
│   ├── exclusion-patterns.md
│   └── environment-variables.md
├── scoring/
│   ├── how-scoring-works.md
│   ├── category-explanations.md
│   ├── violation-penalties.md
│   └── pipeline-compliance.md
├── api/
│   ├── dashboard-api.md
│   ├── supabase-schema.md
│   └── github-actions.md
├── architecture/
│   ├── system-overview.md
│   ├── data-flow.md
│   ├── component-diagram.md
│   └── deployment-options.md
├── troubleshooting/
│   ├── common-issues.md
│   ├── faq.md
│   └── support.md
├── videos/
│   ├── 01-introduction.mp4
│   ├── 02-setup-walkthrough.mp4
│   └── 03-dashboard-tour.mp4
└── examples/
    ├── sample-pr-good.md
    ├── sample-pr-bad.md
    └── sample-configs.yaml
```

**Documentation Formats:**
- **Markdown:** Developer guides, API docs
- **OpenAPI/Swagger:** API documentation
- **Video Tutorials:** 4 videos (5-15 min each)
- **Interactive:** Try-it-yourself sections, code examples
- **Searchable:** Knowledge base (GitBook, Docusaurus, or MkDocs)

**Additional Notes:**
- Update docs with every major release
- Include changelog and migration guides
- Host on subdomain: docs.veroscore.yourdomain.com

---

### Question 10.2: Training Strategy

**Question:** How do we train the team?

**✅ ANSWER:** Phased rollout with pilot program, workshops, and ongoing support

**Rationale:**
- Pilot program identifies issues early
- Workshops enable hands-on learning
- Ongoing support reduces frustration
- Champions program scales knowledge

**Implementation:**

**Phase 1: Pilot Program (Week 1-2)**
- 3-5 developers (mix of senior and junior)
- 1-hour intro session
- 10 days of normal use with feedback
- Retrospective meeting

**Phase 2: Team Workshops (Week 3-4)**
- 90-minute workshop format
- Part 1: Introduction (20 min)
- Part 2: Hands-On Demo (30 min)
- Part 3: Dashboard Tour (20 min)
- Part 4: Troubleshooting & Tips (20 min)

**Phase 3: Gradual Rollout (Week 5-8)**
- Week 5: Team A (25% of devs)
- Week 6: Team B (50% total)
- Week 7: Team C (75% total)
- Week 8: Full Rollout (100%)

**Support Structure:**
- Slack Channel: #veroscore-support (response SLA: <2 hours)
- Office Hours: Tuesday & Thursday, 2-3 PM
- Champions Program: 1-2 per team
- Documentation: Living docs, video tutorials, FAQ

**Training Materials:**
- Quick start guide (5 min read)
- Video: Your First Auto-PR (10 min)
- Cheat sheet (PDF, printable)
- Configuration templates
- FAQ document

**Success Metrics:**
- Adoption: >90% of developers enabled
- Satisfaction: >4/5 training score
- Support: <10 tickets per week
- Quality: Average score improving

**Additional Notes:**
- Record workshops for async viewing
- Create internal wiki page with all resources
- Celebrate early wins (first auto-approved PR per team)

---

## 📝 Answer Format

Please provide answers in the following format:

```markdown
### Question X.Y: [Question Title]

**Answer:** [Your answer]

**Rationale:** [Why this decision was made]

**Additional Notes:** [Any other relevant information]
```

---

## ✅ Next Steps

1. **Review all questions** with stakeholders
2. **Provide answers** using the format above
3. **Update implementation plan** with decisions
4. **Begin implementation** once all critical questions answered

---

## 📊 Question Status

| Category | Total Questions | Critical | Answered | Pending |
|----------|----------------|----------|----------|---------|
| Migration Strategy | 3 | 3 | ✅ 3 | 0 |
| Supabase Configuration | 3 | 3 | ✅ 3 | 0 |
| File Watcher Deployment | 3 | 3 | ✅ 3 | 0 |
| Configuration Management | 3 | 2 | ✅ 3 | 0 |
| GitHub Integration | 3 | 3 | ✅ 3 | 0 |
| Scoring & Detection | 3 | 2 | ✅ 3 | 0 |
| Dashboard Deployment | 3 | 1 | ✅ 3 | 0 |
| Error Handling & Recovery | 3 | 3 | ✅ 3 | 0 |
| Testing Strategy | 3 | 2 | ✅ 3 | 0 |
| Documentation & Training | 2 | 1 | ✅ 2 | 0 |
| **TOTAL** | **29** | **23** | **✅ 29** | **0** |

---

**Last Updated:** 2025-12-05  
**Status:** ✅ ALL QUESTIONS ANSWERED - Ready for Implementation  
**Owner:** [To be assigned]

---

## ✅ Summary

All 29 questions have been answered with comprehensive solutions. The implementation plan can now proceed with full clarity on:

- **Database Architecture:** Separate Supabase project for veroscore
- **Migration Strategy:** Feature flag approach with gradual rollout
- **Deployment Model:** Local development for Year 1, cloud migration path ready
- **Configuration:** Committed defaults with per-developer overrides
- **Scoring & Detection:** File-level analysis with exception handling
- **Dashboard:** Local hosting initially, easy cloud migration
- **Error Handling:** Comprehensive recovery strategies
- **Testing:** Multi-level testing approach
- **Documentation & Training:** Phased rollout with support structure

**Next Steps:**
1. Review all answers with stakeholders
2. Update implementation plan with decisions
3. Begin Week 1: Database Foundation
4. Follow 10-week implementation checklist

**Reference Documents:**
- `V3_IMPLEMENTATION_PLAN.md` - Full implementation plan (VeroScore V3)
- `Developer Plan VeroField Governance.md` - System design document (VeroScore V3)
- `docs/developer/VeroScore - Dev answers.md` - Complete answers document

