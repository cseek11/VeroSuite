# VeroScore V3 - Detailed Implementation Plan

**Created:** 2025-11-21  
**Last Updated:** 2025-11-22  
**Version:** V3 (Comprehensive Integration)  
**Status:** Planning Phase - Awaiting Approval  
**Priority:** CRITICAL

---

## 📋 Executive Summary

This document provides a comprehensive implementation plan for **VeroScore V3**, a complete redesign of the Auto-PR system that integrates:

1. **Auto-PR Session Management** (Supabase-based, event-driven)
2. **Hybrid Scoring Engine v2.1** (file-level analysis + massive penalties)
3. **Enforcement Pipeline Compliance** (structured PR descriptions)
4. **Real-Time Dashboard** (session monitoring, PR analytics)
5. **Critical Detection Functions** (RLS, architecture, security violations)

### Key Improvements Over Previous System

✅ **100% Consistency** - Every PR auto-created and scored  
✅ **Supabase State Management** - Centralized, scalable state store  
✅ **Event-Driven Architecture** - Real-time file monitoring with debouncing  
✅ **Massive Penalties** - RLS violations (-100), Architecture drift (-75), Secrets (-60)  
✅ **Pipeline Enforcement** - Machine-verifiable compliance sections  
✅ **Complete Audit Trail** - Full history in Supabase  
✅ **Real-Time Dashboard** - Live session tracking and analytics

---

## 🎯 System Architecture Understanding

### 1. Data Flow Architecture

```
Developer (Local) → File Watcher → Supabase (State) → GitHub Actions → Scoring → Decision
     │                  │                │                    │            │         │
     │                  │                │                    │            │         │
     └──────────────────┴────────────────┴────────────────────┴────────────┴─────────┘
                              Real-time Dashboard (WebSocket)
```

**Key Flow:**
1. **File Changes Detected** → `watchdog` events captured
2. **Debounced & Batched** → Changes queued in Supabase `changes_queue`
3. **Threshold Check** → File count, line count, or time-based triggers
4. **PR Creation** → Branch created, files committed, PR opened with structured description
5. **GitHub Actions Triggered** → Detection functions run, scoring engine executes
6. **Decision Enforced** → Auto-block (<0), Review (0-6), Auto-approve (7+)
7. **Session Updated** → State persisted in Supabase, dashboard updated

### 2. Core Components

#### 2.1 Local File Watcher (`file_watcher.py`)
- **Technology:** Python 3.12+, `watchdog` library
- **Features:**
  - Event-driven file monitoring
  - 2-second debouncing (configurable)
  - Git diff analysis for accurate line counts
  - `.gitignore` respect
  - Thread-safe change buffering
  - Supabase integration for state persistence

**Key Classes:**
- `FileChange` - Represents single file change event
- `ChangeBuffer` - Thread-safe buffer with debouncing
- `GitDiffAnalyzer` - Accurate line count analysis
- `VeroFieldChangeHandler` - File system event handler
- `SessionManager` - Supabase session management
- `ThresholdChecker` - PR creation threshold logic

#### 2.2 PR Creator (`pr_creator.py`)
- **Technology:** Python 3.12+, GitHub CLI
- **Features:**
  - Idempotency management (prevents duplicate PRs)
  - Structured PR descriptions with enforcement pipeline section
  - Git automation (branch, commit, push)
  - Session state updates

**Key Classes:**
- `EnforcementPipelineSection` - Generates mandatory compliance section
- `IdempotencyManager` - Prevents duplicate operations
- `PRCreator` - Main PR creation orchestrator

#### 2.3 Hybrid Scoring Engine v2.1 (`scoring_engine.py`)
- **Technology:** Python 3.12+, Supabase
- **Scoring Categories:**
  - `code_quality` (weight: 3, range: -10 to +10)
  - `test_coverage` (weight: 4, range: -10 to +10)
  - `documentation` (weight: 2, range: -10 to +10)
  - `architecture` (weight: 4, range: -10 to +10)
  - `security` (weight: 5, range: -10 to +10)
  - `rule_compliance` (weight: 5, range: -100 to +10)

**Stabilization Formula:**
```
stabilized_score = 10 / (1 + e^(-raw_score / 15))
```

**Decision Thresholds:**
- `< 0` → Auto-BLOCK
- `0-6` → Review Required
- `7+` → Auto-APPROVE (if pipeline complete)

**Pipeline Bonus:** +5 points for complete enforcement pipeline compliance

#### 2.4 Detection Functions (`detection_functions.py`)
- **Technology:** Python 3.12+, Semgrep, regex, AST analysis
- **Detectors:**
  - `RLSViolationDetector` - Penalty: -100 (CRITICAL)
  - `ArchitectureDriftDetector` - Penalty: -75 (CRITICAL)
  - `HardcodedValueDetector` - Penalty: -60 (CRITICAL)
  - `SecurityVulnerabilityDetector` - Penalty: -50 (CRITICAL)
  - `LoggingComplianceDetector` - Penalty: -30/-20 (MEDIUM)

#### 2.5 Database Schema (Supabase)
- **Tables:**
  - `sessions` - Core session tracking
  - `changes_queue` - Buffered file changes
  - `pr_scores` - Scoring results and history
  - `detection_results` - Individual detector findings
  - `idempotency_keys` - Prevent duplicate operations
  - `system_metrics` - Observability
  - `audit_log` - Full audit trail

- **Views:**
  - `v_active_sessions` - Active sessions with stats
  - `v_pr_score_summary` - PR scores with decision summary
  - `v_system_health` - System health metrics
  - `v_dashboard_summary` - Real-time dashboard data

- **Functions:**
  - `get_avg_score_today()` - Average score for today
  - `get_top_authors(days)` - Top authors by PR count
  - `get_score_trend(days)` - Daily score trends
  - `get_violation_types(days)` - Violation distribution
  - `increment_session_stats()` - Batch update session stats

#### 2.6 GitHub Workflows
- **Workflow:** `.github/workflows/verofield_auto_pr.yml`
- **Jobs:**
  1. `extract-context` - Extract session ID from branch/PR
  2. `score-pr` - Run detection functions and scoring engine
  3. `enforce-decision` - Apply decision (block/review/approve)
  4. `update-session` - Update session state in Supabase
  5. `health-check` - Scheduled system health monitoring

#### 2.7 Dashboard (React + FastAPI)
- **Frontend:** React component with real-time updates
- **Backend:** FastAPI with WebSocket support
- **Features:**
  - Real-time session monitoring
  - PR score analytics
  - Author performance tracking
  - Violation trend analysis
  - Export capabilities (CSV/JSON)

---

## 🔗 Reward Score Integration

**Status:** ✅ 95% Compatible - Integration Required

VeroScore V3 and the Reward Score Feedback Loop are highly compatible and work together synergistically. See `docs/developer/VeroScore V3 + Reward Score.md` for complete compatibility analysis.

### Integration Overview

**Complementary Systems:**
- **VeroScore V3:** Pre-merge governance & enforcement (real-time)
- **Reward Score:** Post-merge learning & improvement (historical trends)

**Workflow Integration:**
```
PR Created → VeroScore V3 Runs → Decision Enforced → PR Merged → Reward Score Runs → Feedback Loop
```

**Key Integration Points:**
1. **Session Completion Tracking** - Mark sessions eligible for Reward Score
2. **Cross-Reference Storage** - Store Reward Score in VeroScore V3 database
3. **Workflow Coordination** - Reward Score waits for session completion
4. **Dashboard Integration** - Show both scores with correlation analysis

### Required Integration Tasks

**Phase 1:** Add schema columns for Reward Score integration
**Phase 3:** Add session completion detection and marking
**Phase 6:** Update workflows for Reward Score coordination
**Phase 7:** Add Reward Score views to dashboard
**Phase 9:** Test both systems working together

**Total Integration Effort:** 6-8 hours for critical items, 16-32 hours for full integration

---

## ✅ Key Decisions & Answers

All questions have been answered and decisions documented. See `V3_QUESTIONS.md` for complete details. Key decisions are summarized below:

### 1. Migration Strategy

**✅ Decision 1.1:** Feature flag approach (Option C)
- Enable VeroScore V3 per developer via configuration
- Start with 2-3 pilot developers
- Expand to 25% after 1 week, full rollout after 2 weeks
- Configuration: `veroscore.enabled: true`, `version: "V3"`

**✅ Decision 1.2:** Start fresh with VeroScore V3
- Export existing sessions to JSON/CSV for archival
- Keep legacy system read-only for 30 days
- Delete legacy data after 90 days

**✅ Decision 1.3:** Only new PRs use VeroScore V3 scoring
- No backfilling of existing PRs
- Dashboard separates v2 vs V3 scores
- Add `scoring_version` column to track engine

### 2. Supabase Configuration

**✅ Decision 2.1:** Create new dedicated Supabase project for veroscore
- **CRITICAL:** Separate from CRM database for isolation
- Project name: `{company}-veroscore`
- Region: us-east-1 (or closest to team)
- Plan: Free tier initially, upgrade to Pro if >500MB

**✅ Decision 2.2:** Tiered RLS policies with service role bypass
- Developers: Read access to own sessions
- Service role: Full access for GitHub Actions
- Team members: Read access to all PR scores (transparency)
- Audit logs: Append-only and readable

**✅ Decision 2.3:** Start with Free tier, plan for Pro upgrade
- Free tier: 500MB storage, adequate for <20 devs
- Pro tier: 8GB storage, upgrade at 50+ devs or 500MB
- Data volume: ~2-5MB per developer per month
- Archival strategy: Archive data >90 days old monthly

### 3. File Watcher Deployment

**✅ Decision 3.1:** Option A initially (local process), evolve to Option C (hybrid)
- Each developer runs locally: `python .cursor/scripts/file_watcher.py &`
- Add to shell startup (.bashrc/.zshrc)
- Create systemd/launchd service for auto-start
- Phase 2: Add central coordinator for scale

**✅ Decision 3.2:** Local queue with automatic retry, max 100 changes buffer
- Persistent queue on disk (`.cursor/queue.pkl`)
- Exponential backoff: 5s → 60s max
- Flush every 30 seconds when Supabase available
- Alert developer if queue >80% full

**✅ Decision 3.3:** Each developer gets own session; branch-based conflict prevention
- Unique constraint: One active session per author
- Branch naming: `auto-pr-{author}-{timestamp}-{uuid4[:8]}`
- Idempotency keys prevent double-creation
- Merge conflicts resolved normally during PR merge

### 4. Configuration Management

**✅ Decision 4.1:** Committed to git with per-developer override support
- Team defaults: `.cursor/config/auto_pr_config.yaml` (committed)
- Developer overrides: `.cursor/config/auto_pr_config.local.yaml` (gitignored)
- Loading priority: Defaults → Local overrides → Environment variables

**✅ Decision 4.2:** Use proposed defaults with 30-day tuning period
- `min_files: 3` - Reasonable for meaningful feature unit
- `min_lines: 50` - Enough for scoring accuracy
- `max_wait_seconds: 300` - 5 min prevents forgotten sessions
- `debounce_seconds: 2.0` - Handles rapid edits
- Track metrics Week 1, adjust Weeks 2-4

**✅ Decision 4.3:** Global exclusions committed, per-developer additions in local config
- Standard exclusions: node_modules, .env, build artifacts, IDE files
- Glob patterns (simpler than regex)
- Support `!pattern` for exceptions

### 5. GitHub Integration

**✅ Decision 5.1:** Use fine-grained PAT for security, store in GitHub Secrets
- Repository access: Selected repositories only
- Permissions: Contents (R/W), Pull requests (R/W), Workflows (R/W), Metadata (R)
- Rotation: Every 90 days with calendar reminder
- Store in GitHub Secrets: `AUTO_PR_PAT`

**✅ Decision 5.2:** Include author + UUID suffix; check for collisions
- Format: `auto-pr-{author}-{timestamp}-{uuid4[:8]}`
- Example: `auto-pr-alice-20251121-1430-a3f9d2e1`
- Collision probability: ~0.000001% even with 1M sessions
- Defensive check: Verify no collision before creating

**✅ Decision 5.3:** Disabled by default; opt-in per repository with strict requirements
- `auto_merge.enabled: false` (MUST be explicitly set to true)
- Requirements: min_score 8.0, pipeline_complete, no_critical_violations, branch_protected, approvals_required: 1, ci_checks_passing
- Exclusions: migrations, auth, billing, .github/workflows
- Recommendation: Start disabled for 3+ months

### 6. Scoring & Detection

**✅ Decision 6.1:** Support exception comments with required justification and tracking
- Pattern: `// veroscore:ignore rls - admin operation`
- Justification required (prevents abuse)
- Logged to `exception_log` table for audit
- Monthly review by tech lead
- Warning if >10 exceptions per month per developer

**✅ Decision 6.2:** Support plugin system with versioning and registry
- Plugin location: `.cursor/scripts/detectors/`
- Structure: `CustomDetector` class with name, version, priority
- Registry prevents conflicts
- Enables community sharing

**✅ Decision 6.3:** Target <1s per file, <30s total, with parallelization and caching
- Parallel execution: ThreadPoolExecutor with max_workers=4
- Cache key: `{file_path}:{hash(content)}`
- Timeout: 30s total, 5s per file
- Cache hit rate target: >50%

### 7. Dashboard Deployment

**✅ Decision 7.1:** Run Fully Local for Year 1, Design for Easy Cloud Migration
- **CRITICAL:** For in-house development, local is optimal
- Option A (Individual): Each dev runs own dashboard (<5 devs)
- Option B (Shared): One dev hosts, others access (5-15 devs)
- Option C (Docker): Full stack in Docker (15+ devs)
- Supabase: Still in cloud (free tier) for shared state
- Migration path: 1-day migration to cloud when needed

**✅ Decision 7.2:** Use Supabase Auth with GitHub OAuth provider
- Enable GitHub OAuth in Supabase Dashboard
- Configure GitHub OAuth App
- Map GitHub usernames to Supabase users
- For local dev: Can use simplified HTTP Basic Auth or disable auth

**✅ Decision 7.3:** 90-day active retention, 1-year archive, permanent deletion after
- Sessions/PR scores: 90 days active, 365 days archive
- Changes queue: 30 days active, 90 days archive
- Audit logs: 180 days active, 730 days archive
- Auto-archive function runs monthly via pg_cron

### 8. Error Handling & Recovery

**✅ Decision 8.1:** Queue locally with automatic flush, max 1000 changes, 24h retention
- Persistent queue: `.cursor/queue.pkl`
- Max size: 1000 changes
- Automatic retry: Exponential backoff (5s → 60s)
- Flush every 30 seconds when Supabase available
- Alert if queue >80% full

**✅ Decision 8.2:** Automatic retry with exponential backoff, max 3 attempts, dead letter queue
- Use `nick-fields/retry@v2` action in workflow
- Retry delays: 1 min, 2 min, 4 min
- Dead letter queue table: `workflow_failures`
- Dashboard component for viewing/retrying failures
- CLI: `veroscore retry-workflow --pr 1234`

**✅ Decision 8.3:** Auto-complete after 30 min inactivity, optional PR creation, daily cleanup
- Auto-timeout function runs every 15 minutes
- Sessions with changes: Mark as 'idle', optionally auto-create PR
- Sessions without changes: Mark as 'completed'
- Configuration: `orphan_handling.timeout_minutes: 30`, `auto_create_pr: true`

### 9. Testing Strategy

**✅ Decision 9.1:** Comprehensive testing with dedicated test Supabase instance
- Unit tests: Use mocks (>80% coverage)
- Integration tests: Dedicated Supabase test instance
- E2E tests: Staging Supabase instance + test GitHub repo
- Test structure: unit/, integration/, e2e/, fixtures/

**✅ Decision 9.2:** Golden test suite with known violations, regression testing, performance benchmarks
- Golden test files: `tests/fixtures/golden_tests/`
- Test categories: RLS violations, hardcoded values, XSS vulnerabilities, etc.
- Regression tests: Prevent known past issues
- Performance benchmarks: Ensure <1s per file, <30s total

**✅ Decision 9.3:** Simulate 50 concurrent developers, 1000 changes/day, validate <5s p95 latency
- Load test scenarios: Normal, peak, spike, sustained
- Performance targets: P95 <5s, average <2s
- Connection pool testing: Verify exhaustion handling
- Automated load testing: Weekly via GitHub Actions

### 10. Documentation & Training

**✅ Decision 10.1:** Multi-format documentation with interactive elements
- Structure: getting-started/, user-guides/, configuration/, scoring/, api/, architecture/, troubleshooting/
- Formats: Markdown, OpenAPI/Swagger, Video tutorials (4 videos), Interactive sections
- Searchable: Knowledge base (GitBook, Docusaurus, or MkDocs)

**✅ Decision 10.2:** Phased rollout with pilot program, workshops, and ongoing support
- Phase 1: Pilot program (3-5 developers, Week 1-2)
- Phase 2: Team workshops (90 min format, Week 3-4)
- Phase 3: Gradual rollout (25% → 50% → 75% → 100%, Week 5-8)
- Support: Slack channel, office hours, champions program
- Success metrics: >90% adoption, >4/5 satisfaction, <10 tickets/week

---

## ⚠️ CRITICAL: Implementation Requirements

### 1. Phased Approach with Approval Gates

**MANDATORY:** This implementation **MUST** follow a phased approach with explicit approval required before proceeding to the next phase.

**Approval Process:**
1. **Complete Phase Deliverables** - All tasks, deliverables, and success criteria must be met
2. **Submit Phase Review** - Create PR with phase completion summary
3. **Stakeholder Review** - Designated approver reviews and tests
4. **Approval Required** - Explicit approval (comment, merge, or sign-off) before next phase
5. **Document Approval** - Record approval in phase documentation

**Approval Gates:**
- ✅ **Phase 1 → Phase 2:** Database foundation approved
- ✅ **Phase 2 → Phase 3:** File watcher approved
- ✅ **Phase 3 → Phase 4:** PR creator approved
- ✅ **Phase 4 → Phase 5:** Detection functions approved
- ✅ **Phase 5 → Phase 6:** Scoring engine approved
- ✅ **Phase 6 → Phase 7:** GitHub workflows approved
- ✅ **Phase 7 → Phase 8:** Dashboard approved
- ✅ **Phase 8 → Phase 9:** Testing & validation approved
- ✅ **Phase 9 → Phase 10:** Migration & rollout approved

**If approval is not granted:**
- **STOP** all work on next phase
- Address feedback and concerns
- Re-submit for approval
- Do NOT proceed without explicit approval

---

### 2. Cursor Rules Compliance

**MANDATORY:** All implementation work **MUST** follow the VeroField Hybrid Rule System v2.0.

**Required Compliance:**
- ✅ **5-Step Enforcement Pipeline** - Must complete for every code change
  1. Search & Discovery
  2. Pattern Analysis
  3. Rule Compliance Check
  4. Implementation Plan
  5. Post-Implementation Audit

- ✅ **Security Rules** (`.cursor/rules/03-security.mdc`)
  - Tenant isolation (RLS) - **NON-NEGOTIABLE**
  - No hardcoded secrets
  - Input validation required
  - XSS prevention

- ✅ **Architecture Rules** (`.cursor/rules/04-architecture.mdc`)
  - Correct monorepo paths (`apps/`, `libs/`, `frontend/`)
  - No cross-service relative imports
  - Shared code in `libs/common/`

- ✅ **Error Resilience** (`.cursor/rules/06-error-resilience.mdc`)
  - No silent failures
  - Structured logging with traceId
  - User-friendly error messages

- ✅ **Observability** (`.cursor/rules/07-observability.mdc`)
  - Structured logging (JSON-like)
  - Trace ID propagation
  - Metrics tracking

- ✅ **Date Handling** (`.cursor/rules/02-core.mdc`)
  - **CRITICAL:** Use current system date - NEVER hardcode dates
  - Format: ISO 8601 (`YYYY-MM-DD`)

**Compliance Verification:**
- Each PR must include compliance checklist
- Automated checks via CI/CD
- Manual review for rule adherence
- Violations = BLOCK merge

**Reference Documents:**
- `.cursor/rules/00-master.mdc` - Master rules
- `.cursor/rules/01-enforcement.mdc` - Enforcement pipeline
- `.cursor/rules/02-core.mdc` - Core philosophy
- `.cursor/rules/03-security.mdc` - Security rules
- `.cursor/rules/04-architecture.mdc` - Architecture rules
- All other `.cursor/rules/*.mdc` files as applicable

---

### 3. Question-Asking Protocol

**MANDATORY:** Agents **MUST** ask questions before proceeding if the path forward is unclear.

**When to Ask Questions:**
- ✅ **Ambiguity in requirements** - If requirements are unclear or conflicting
- ✅ **Multiple valid approaches** - If there are several valid implementation paths
- ✅ **Architecture decisions** - If change affects system architecture
- ✅ **Security concerns** - If security implications are unclear
- ✅ **Breaking changes** - If change might break existing functionality
- ✅ **Performance impact** - If change might affect performance significantly
- ✅ **Dependencies** - If new dependencies or external services are needed
- ✅ **Configuration changes** - If change requires new configuration
- ✅ **Data migration** - If change requires data migration
- ✅ **API changes** - If change affects public APIs or contracts

**How to Ask Questions:**
1. **Stop work** on the unclear item
2. **Document the question** clearly with context
3. **Provide options** if multiple paths exist
4. **Explain trade-offs** for each option
5. **Wait for clarification** before proceeding

**Question Format:**
```markdown
## ❓ Question: [Brief Title]

**Context:** [What you're working on]

**Issue:** [What's unclear]

**Options:**
- Option A: [Description] - Pros: [...], Cons: [...]
- Option B: [Description] - Pros: [...], Cons: [...]

**Recommendation:** [Your recommendation with rationale]

**Blocking:** [Is this blocking other work?]
```

**Do NOT proceed if:**
- ❌ Requirements are ambiguous
- ❌ Multiple valid approaches exist and preference is unclear
- ❌ Security implications are uncertain
- ❌ Architecture impact is significant
- ❌ Breaking changes are possible

**Proceed only when:**
- ✅ Question answered clearly
- ✅ Path forward is unambiguous
- ✅ Approval given for chosen approach
- ✅ All concerns addressed

---

## 📅 Implementation Phases

### Phase 1: Foundation & Database Setup (Week 1)

**Goal:** Set up core infrastructure and database schema

**⚠️ APPROVAL REQUIRED:** This phase must be approved before proceeding to Phase 2.

**Tasks:**
1. ✅ Create Supabase project (or configure existing)
2. ✅ Deploy database schema (all tables, views, functions)
3. ✅ **Add Reward Score integration columns** (see Integration section below)
4. ✅ Configure RLS policies
5. ✅ Set up environment variables
6. ✅ Create configuration files (`.cursor/config/auto_pr_config.yaml`)
7. ✅ Test database connectivity
8. ✅ Create backup/restore procedures
9. ✅ Verify Cursor rules compliance
10. ✅ Document any questions or clarifications needed

**Reward Score Integration Tasks:**
- ✅ Add `reward_score_eligible` column to `sessions` table
- ✅ Add `last_reward_score` and `reward_scored_at` columns to `sessions` table
- ✅ Add `reward_score` and `reward_score_timestamp` columns to `pr_scores` table
- ✅ Document Reward Score integration points

**Deliverables:**
- Supabase project configured
- Database schema deployed (including Reward Score columns)
- Configuration files created
- Environment setup documented
- Reward Score integration schema documented
- Compliance checklist completed
- Phase review document

**Success Criteria:**
- All tables created successfully
- Test data can be inserted/queried
- RLS policies working correctly
- Configuration loads without errors
- All Cursor rules verified
- No blocking questions remain

**Approval Checklist:**
- [ ] All tasks completed
- [ ] All deliverables present
- [ ] Success criteria met
- [ ] Cursor rules compliance verified
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] **APPROVAL GRANTED** (sign-off required)

---

### Phase 2: File Watcher Implementation (Week 1-2)

**Goal:** Implement local file monitoring and session management

**⚠️ APPROVAL REQUIRED:** Phase 1 must be approved before starting this phase.

**Tasks:**
1. ✅ Implement `FileChange` dataclass
2. ✅ Implement `ChangeBuffer` with debouncing
3. ✅ Implement `GitDiffAnalyzer`
4. ✅ Implement `VeroFieldChangeHandler`
5. ✅ Implement `SessionManager` (Supabase integration)
6. ✅ Implement `ThresholdChecker`
7. ✅ Create main `file_watcher.py` entry point
8. ✅ Add structured logging (per Cursor rules)
9. ✅ Add error handling and recovery (no silent failures)
10. ✅ Create unit tests
11. ✅ Verify Cursor rules compliance
12. ✅ Ask questions if path unclear

**Deliverables:**
- `file_watcher.py` script
- Unit tests for all components
- Configuration validation
- Error handling implemented
- Compliance checklist
- Phase review document

**Success Criteria:**
- File changes detected and debounced correctly
- Changes queued in Supabase `changes_queue`
- Session created/updated correctly
- Threshold checks working
- Handles errors gracefully
- Structured logging with traceId
- No silent failures
- All Cursor rules followed

**Approval Checklist:**
- [ ] All tasks completed
- [ ] All deliverables present
- [ ] Success criteria met
- [ ] Cursor rules compliance verified
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] **APPROVAL GRANTED** (sign-off required)

---

### Phase 3: PR Creator Implementation (Week 2)

**Goal:** Implement PR creation with structured descriptions

**⚠️ APPROVAL REQUIRED:** Phase 2 must be approved before starting this phase.

**Tasks:**
1. ✅ Implement `EnforcementPipelineSection` generator
2. ✅ Implement `IdempotencyManager`
3. ✅ Implement `PRCreator` class
4. ✅ Add Git automation (branch, commit, push)
5. ✅ Add GitHub CLI integration
6. ✅ Generate structured PR descriptions
7. ✅ Update session state after PR creation
8. ✅ **Add session completion detection**
9. ✅ **Add method to mark sessions for Reward Scoring** (`mark_reward_eligible()`)
10. ✅ Add error handling and rollback
11. ✅ Create unit tests
12. ✅ Verify Cursor rules compliance
13. ✅ Ask questions if path unclear

**Reward Score Integration Tasks:**
- ✅ Implement session completion detection logic
- ✅ Add `mark_reward_eligible(session_id)` method to session manager
- ✅ Add CLI command: `session_agent.py mark-reward-eligible --session-id <id>`
- ✅ Update session state when completion detected

**Deliverables:**
- `pr_creator.py` script
- PR description template
- Idempotency logic
- Unit tests
- Compliance checklist
- Phase review document

**Success Criteria:**
- PRs created with correct structure
- Idempotency prevents duplicates
- Session state updated correctly
- Handles Git/GitHub errors gracefully
- All Cursor rules followed

**Approval Checklist:**
- [ ] All tasks completed
- [ ] All deliverables present
- [ ] Success criteria met
- [ ] Cursor rules compliance verified
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] **APPROVAL GRANTED** (sign-off required)

---

### Phase 4: Detection Functions Implementation (Week 2-3)

**Goal:** Implement all critical violation detectors

**⚠️ APPROVAL REQUIRED:** Phase 3 must be approved before starting this phase.

**Tasks:**
1. ✅ Implement `RLSViolationDetector`
2. ✅ Implement `ArchitectureDriftDetector`
3. ✅ Implement `HardcodedValueDetector`
4. ✅ Implement `SecurityVulnerabilityDetector`
5. ✅ Implement `LoggingComplianceDetector`
6. ✅ Implement `MasterDetector` orchestrator
7. ✅ Add Semgrep integration
8. ✅ Add regex patterns
9. ✅ Add AST analysis (where applicable)
10. ✅ Create test suite with violation examples
11. ✅ Add unit tests
12. ✅ Verify Cursor rules compliance
13. ✅ Ask questions if path unclear

**Deliverables:**
- `detection_functions.py` script
- All detector classes
- Test suite with examples
- Unit tests
- Compliance checklist
- Phase review document

**Success Criteria:**
- All detectors working correctly
- False positive rate < 5%
- Performance acceptable (< 1s per file)
- Test suite passes
- All Cursor rules followed

**Approval Checklist:**
- [ ] All tasks completed
- [ ] All deliverables present
- [ ] Success criteria met
- [ ] Cursor rules compliance verified
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] **APPROVAL GRANTED** (sign-off required)

---

### Phase 5: Scoring Engine Implementation (Week 3)

**Goal:** Implement Hybrid Scoring Engine v2.1

**⚠️ APPROVAL REQUIRED:** Phase 4 must be approved before starting this phase.

**Tasks:**
1. ✅ Implement `FileAnalyzer` class
2. ✅ Implement category scoring methods
3. ✅ Implement `CategoryScore` dataclass
4. ✅ Implement `StabilizationFunction`
5. ✅ Implement `PipelineComplianceDetector`
6. ✅ Implement `HybridScoringEngine`
7. ✅ Add Supabase result persistence
8. ✅ Add decision logic
9. ✅ Create unit tests
10. ✅ Add integration tests with real files
11. ✅ Verify Cursor rules compliance
12. ✅ Ask questions if path unclear

**Deliverables:**
- `scoring_engine.py` script
- All scoring classes
- Unit and integration tests
- Test data files
- Compliance checklist
- Phase review document

**Success Criteria:**
- Scoring matches expected results
- Stabilization formula working correctly
- Decisions match thresholds
- Results persisted correctly
- All Cursor rules followed

**Approval Checklist:**
- [ ] All tasks completed
- [ ] All deliverables present
- [ ] Success criteria met
- [ ] Cursor rules compliance verified
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] **APPROVAL GRANTED** (sign-off required)

---

### Phase 6: GitHub Workflows Integration (Week 3-4)

**Goal:** Implement complete CI/CD workflow

**⚠️ APPROVAL REQUIRED:** Phase 5 must be approved before starting this phase.

**Tasks:**
1. ✅ Create `.github/workflows/verofield_auto_pr.yml`
2. ✅ Implement `extract-context` job
3. ✅ Implement `score-pr` job
4. ✅ Implement `enforce-decision` job
5. ✅ Implement `update-session` job
6. ✅ **Add session completion check to workflow**
7. ✅ **Add step to mark session as reward-eligible** (when session completes)
8. ✅ Implement `health-check` job
9. ✅ Add runner scripts (`.github/scripts/`)
10. ✅ Configure secrets
11. ✅ Add error handling
12. ✅ Test with real PRs
13. ✅ Verify Cursor rules compliance
14. ✅ Ask questions if path unclear

**Reward Score Integration Tasks:**
- ✅ Add `check-completion` step to `update-session` job
- ✅ Add `mark-reward-eligible` step (conditional on session completion)
- ✅ Document Reward Score workflow coordination
- ✅ Test session eligibility flag setting

**Deliverables:**
- Complete workflow file
- Runner scripts
- Secrets configured
- Test PRs created
- Compliance checklist
- Phase review document

**Success Criteria:**
- Workflow triggers correctly
- All jobs complete successfully
- Decisions enforced correctly
- Session state updated
- All Cursor rules followed

**Approval Checklist:**
- [ ] All tasks completed
- [ ] All deliverables present
- [ ] Success criteria met
- [ ] Cursor rules compliance verified
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] **APPROVAL GRANTED** (sign-off required)

---

### Phase 7: Dashboard Implementation (Week 4)

**Goal:** Implement real-time dashboard

**⚠️ APPROVAL REQUIRED:** Phase 6 must be approved before starting this phase.

**Tasks:**
1. ✅ Create FastAPI backend (`dashboard_api.py`)
2. ✅ Implement REST endpoints
3. ✅ Implement WebSocket for real-time updates
4. ✅ Create React frontend component
5. ✅ Add session monitoring views
6. ✅ Add PR analytics views
7. ✅ **Add Reward Score views to dashboard**
8. ✅ **Add correlation analysis charts** (VeroScore vs Reward Score)
9. ✅ **Add combined analytics page**
10. ✅ Add export functionality
11. ✅ Add authentication (if needed)
12. ✅ Deploy to hosting platform
13. ✅ Add error handling
14. ✅ Verify Cursor rules compliance
15. ✅ Ask questions if path unclear

**Reward Score Integration Tasks:**
- ✅ Create `RewardScoreTrends.tsx` component
- ✅ Add API endpoint to fetch Reward Score data from Supabase
- ✅ Add scatter plot for VeroScore vs Reward Score correlation
- ✅ Add combined analytics view showing both scores
- ✅ Document Reward Score dashboard integration

**Deliverables:**
- FastAPI backend
- React frontend
- Deployed dashboard
- API documentation
- Compliance checklist
- Phase review document

**Success Criteria:**
- Dashboard loads correctly
- Real-time updates working
- All views functional
- Export working
- All Cursor rules followed

**Approval Checklist:**
- [ ] All tasks completed
- [ ] All deliverables present
- [ ] Success criteria met
- [ ] Cursor rules compliance verified
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] **APPROVAL GRANTED** (sign-off required)

---

### Phase 8: Testing & Validation (Week 4-5)

**Goal:** Comprehensive testing and validation

**⚠️ APPROVAL REQUIRED:** Phase 7 must be approved before starting this phase.

**Tasks:**
1. ✅ Unit tests for all components
2. ✅ Integration tests for full flow
3. ✅ E2E tests with test environment
4. ✅ Load testing (concurrent developers)
5. ✅ Performance benchmarking
6. ✅ Security testing
7. ✅ Error scenario testing
8. ✅ Recovery testing
9. ✅ Documentation review
10. ✅ User acceptance testing
11. ✅ Verify Cursor rules compliance
12. ✅ Ask questions if path unclear

**Deliverables:**
- Complete test suite
- Test reports
- Performance benchmarks
- Security audit report
- Compliance checklist
- Phase review document

**Success Criteria:**
- All tests passing
- Performance targets met
- Security issues resolved
- Ready for production
- All Cursor rules followed

**Approval Checklist:**
- [ ] All tasks completed
- [ ] All deliverables present
- [ ] Success criteria met
- [ ] Cursor rules compliance verified
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] **APPROVAL GRANTED** (sign-off required)

---

### Phase 9: Migration & Rollout (Week 5)

**Goal:** Migrate from old system and roll out VeroScore V3

**⚠️ APPROVAL REQUIRED:** Phase 8 must be approved before starting this phase.

**Tasks:**
1. ✅ Create migration plan
2. ✅ Backup old system data
3. ✅ Migrate configuration
4. ✅ Deploy VeroScore V3 to staging
5. ✅ Run parallel systems (if needed)
6. ✅ Gradual rollout to developers
7. ✅ Monitor and fix issues
8. ✅ Complete migration
9. ✅ Decommission old system
10. ✅ Post-migration cleanup
11. ✅ **Migrate existing Reward Scores to Supabase (optional)**
12. ✅ **Enable cross-reference saving** (Reward Score → Supabase)
13. ✅ **Test both systems working together**
14. ✅ Verify Cursor rules compliance
15. ✅ Document migration process
16. ✅ Ask questions if path unclear

**Reward Score Integration Tasks:**
- ✅ Test session eligibility flag workflow
- ✅ Test Reward Score workflow coordination
- ✅ Verify cross-reference saving works
- ✅ Test dashboard shows both scores
- ✅ Document integration testing results

**Deliverables:**
- Migration plan
- Rollout schedule
- Monitoring dashboard
- Issue tracking
- Compliance checklist
- Phase review document

**Success Criteria:**
- All developers migrated
- No data loss
- System stable
- Old system decommissioned
- All Cursor rules followed

**Approval Checklist:**
- [ ] All tasks completed
- [ ] All deliverables present
- [ ] Success criteria met
- [ ] Cursor rules compliance verified
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] **APPROVAL GRANTED** (sign-off required)

---

### Phase 10: Documentation & Training (Week 5-6)

**Goal:** Complete documentation and team training

**⚠️ APPROVAL REQUIRED:** Phase 9 must be approved before starting this phase.

**Tasks:**
1. ✅ Write developer onboarding guide
2. ✅ Write configuration reference
3. ✅ Write troubleshooting guide
4. ✅ Create API documentation
5. ✅ Create video tutorials
6. ✅ Conduct team workshop
7. ✅ Create FAQ
8. ✅ Update main README
9. ✅ Verify Cursor rules compliance
10. ✅ Ask questions if path unclear

**Deliverables:**
- Complete documentation
- Video tutorials
- Training materials
- FAQ
- Compliance checklist
- Phase review document

**Success Criteria:**
- All documentation complete
- Team trained
- Questions answered
- Ready for self-service
- All Cursor rules followed

**Approval Checklist:**
- [ ] All tasks completed
- [ ] All deliverables present
- [ ] Success criteria met
- [ ] Cursor rules compliance verified
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] **APPROVAL GRANTED** (sign-off required)

---

## 🛠️ Technical Implementation Details

### File Structure

```
.cursor/
├── config/
│   ├── auto_pr_config.yaml          # Main configuration
│   └── session_config.yaml          # Session settings
├── scripts/
│   ├── file_watcher.py              # File monitoring
│   ├── pr_creator.py                # PR creation
│   ├── detection_functions.py       # Violation detectors
│   ├── scoring_engine.py            # Scoring engine
│   └── session_manager.py           # Session utilities
└── data/
    └── (auto-generated state files)

.github/
├── workflows/
│   └── verofield_auto_pr.yml        # Main workflow
└── scripts/
    ├── run_detections.py            # Detection runner
    └── run_scoring.py               # Scoring runner

docs/
├── Auto-PR/
│   ├── V3_IMPLEMENTATION_PLAN.md    # This document
│   ├── CONFIGURATION_GUIDE.md       # Configuration reference
│   ├── TROUBLESHOOTING.md           # Troubleshooting guide
│   └── API_REFERENCE.md             # API documentation
└── developer/
    └── Developer Plan VeroField Governance.md  # Design doc (VeroScore V3)
```

### Environment Variables

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
AUTO_PR_PAT=ghp_xxxxxxxxxxxxx  # Fine-grained PAT

# Configuration
AUTO_MERGE=false  # Set true to enable auto-merge
```

### Configuration File Format

```yaml
# .cursor/config/auto_pr_config.yaml

thresholds:
  min_files: 3
  min_lines: 50
  max_wait_seconds: 300
  debounce_seconds: 2.0
  batch_size: 10

exclusions:
  patterns:
    - "*.log"
    - "*.tmp"
    - "node_modules/**"
    - ".git/**"
    - "__pycache__/**"

author:
  auto_detect: true
  fallback: "unknown"
```

---

## 📊 Success Metrics

### Performance Targets

- **File Change Detection:** < 100ms latency
- **Debouncing:** 2 seconds (configurable)
- **PR Creation:** < 30 seconds end-to-end
- **Scoring:** < 5 seconds per PR
- **Detection:** < 1 second per file
- **Dashboard Load:** < 2 seconds

### Quality Targets

- **Test Coverage:** > 80%
- **False Positive Rate:** < 5%
- **System Uptime:** > 99.5%
- **Error Recovery:** < 5 minutes

### Adoption Targets

- **Developer Adoption:** > 90% within 2 weeks
- **PR Compliance:** > 80% with structured descriptions
- **Auto-Approval Rate:** > 50% of PRs
- **Violation Detection:** 100% of critical violations caught

---

## 🚨 Risk Mitigation

### Risk 1: Supabase Downtime

**Mitigation:**
- Local queue fallback in file watcher
- Retry logic with exponential backoff
- Health check monitoring
- Alerting for downtime

### Risk 2: False Positives in Detection

**Mitigation:**
- Exception comments support (`// RLS-exempt`)
- Human review for borderline cases
- Continuous tuning of detection patterns
- Feedback loop for improvements

### Risk 3: Performance Issues

**Mitigation:**
- Load testing before rollout
- Database indexing optimization
- Caching for frequently accessed data
- Rate limiting if needed

### Risk 4: Migration Failures

**Mitigation:**
- Parallel system running
- Gradual rollout
- Rollback plan
- Data backup before migration

---

## ✅ Next Steps

1. **Review this plan** with stakeholders
2. **Answer clarifying questions** (see Section 3)
3. **Approve implementation phases**
4. **Set up Supabase project** (if not exists)
5. **Begin Phase 1** (Foundation & Database Setup)

---

## 📝 Notes

- This plan assumes Python 3.12+ and Node.js 18+
- All dates should use current system date (no hardcoded dates)
- Follow enforcement pipeline for all code changes
- Maintain backward compatibility where possible
- Document all architectural decisions

---

**Last Updated:** 2025-11-22  
**Status:** Awaiting Approval  
**Next Review:** After questions answered

**Related Documents:**
- `V3_QUESTIONS.md` - Implementation questions and answers
- `docs/developer/VeroScore V3 + Reward Score.md` - Reward Score integration guide
- `docs/developer/Developer Plan VeroField Governance.md` - System design document

