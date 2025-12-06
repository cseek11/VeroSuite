# VeroField Project Structure Report

**Generated:** 2025-12-04  
**Scope:** Complete project structure from root directory

---

## 📁 Root Directory Structure

```
VeroField/
├── .cursor/                    # Cursor IDE configuration and enforcement system
├── apps/                       # Application packages (monorepo structure)
├── branding/                   # Branding assets and images
├── coverage/                   # Test coverage reports
├── deploy/                     # Deployment configurations
├── docs/                       # Project documentation
├── enforcement/                # Legacy enforcement (migrated to .cursor/enforcement)
├── frontend/                   # React frontend application
├── knowledge/                  # Knowledge base and "bibles" for AI
├── libs/                       # Shared libraries
├── monitoring/                 # Monitoring and observability configs
├── node_modules/               # Root-level dependencies
├── scripts/                    # Utility and automation scripts
├── services/                   # External services (OPA, etc.)
├── shared/                     # Shared code between apps
├── supabase/                   # Supabase edge functions
├── tests/                      # Root-level test files
├── tools/                      # Development tools
├── VeroSuiteMobile/            # React Native mobile application
├── verofield-website/          # Marketing website
├── package.json                # Root package.json
├── package-lock.json           # Dependency lock file
└── README.md                   # Project overview
```

---

## 📂 Detailed Directory Breakdown

### `.cursor/` - Cursor IDE Configuration

**Purpose:** Cursor IDE-specific configuration, enforcement system, and AI agent rules.

```
.cursor/
├── enforcement/                # Enforcement system files
│   ├── ACTIVE_CONTEXT_DUMP.md      # Current context for AI agent
│   ├── ACTIVE_VIOLATIONS.md         # Active rule violations
│   ├── AGENT_REMINDERS.md           # Agent status reminders
│   ├── AGENT_STATUS.md              # Current agent status
│   ├── AUTO_FIXES.md                # Auto-fix suggestions
│   ├── ENFORCEMENT_BLOCK.md         # Blocking violations (if exists)
│   ├── ENFORCER_REPORT.json         # Full enforcer report
│   ├── ENFORCER_STATUS.md           # Enforcement status
│   ├── session.json                 # Current session data
│   └── VIOLATIONS.md                # All violations log
├── rules/                      # LLM interface rules
│   ├── 00-llm-interface.mdc         # Main LLM interface rules
│   ├── 01-llm-security-lite.mdc     # Security essentials
│   ├── 02-llm-fix-mode.mdc          # Fix mode protocol
│   ├── 10-enforced_task_loop.mdc    # Task loop workflow
│   └── SESSION_RESTART_REQUIRED.mdc # Session restart notices
└── scripts/                    # Enforcement scripts
    ├── auto-enforcer.py             # Main enforcement script
    ├── logger_util.py                # Logging utilities
    ├── pre-flight-check.py           # Pre-flight validation
    ├── test-enforcement.py           # Enforcement tests
    ├── watch-files.py                # File watching utility
    └── veroscore_v3/                 # VeroScore v3 enforcement engine
        ├── change_buffer.py          # Change tracking
        ├── change_handler.py         # Change processing
        ├── detection_functions.py    # Violation detection
        ├── enforcement_pipeline_section.py
        ├── file_change.py            # File change tracking
        ├── git_diff_analyzer.py      # Git diff analysis
        ├── idempotency_manager.py    # Idempotency handling
        ├── postgrest_client.py       # PostgREST client
        ├── pr_creator.py             # PR creation
        ├── scoring_engine.py         # Scoring logic
        ├── session_manager.py        # Session management
        ├── supabase_schema_helper.py # Schema helpers
        ├── threshold_checker.py     # Threshold validation
        └── tests/                    # Unit tests
```

**File Organization Rules:**
- Enforcement status files go in `.cursor/enforcement/`
- Rule definitions go in `.cursor/rules/`
- Enforcement scripts go in `.cursor/scripts/`
- Never modify files in `.cursor/` manually unless instructed

---

### `apps/` - Application Packages

**Purpose:** Monorepo structure for application packages.

```
apps/
├── api/                        # NestJS backend API
│   ├── dist/                   # Compiled output
│   ├── docs/                   # API-specific documentation
│   ├── scripts/                # API utility scripts
│   ├── src/                    # Source code
│   │   ├── accounts/           # Account management module
│   │   ├── agreements/         # Agreement management
│   │   ├── audit/              # Audit logging
│   │   ├── auth/               # Authentication & authorization
│   │   ├── billing/            # Billing & payments
│   │   ├── common/             # Shared utilities
│   │   ├── company/            # Company management
│   │   ├── compliance/         # Compliance features
│   │   ├── crm/                # CRM features
│   │   ├── dashboard/          # Dashboard APIs
│   │   ├── health/             # Health checks
│   │   ├── jobs/               # Job management
│   │   ├── kpi-templates/      # KPI template management
│   │   ├── kpis/               # KPI management
│   │   ├── layouts/            # Layout management
│   │   ├── middleware/         # Express middleware
│   │   ├── routing/            # Route management
│   │   ├── service-types/      # Service type definitions
│   │   ├── services/           # Service layer
│   │   ├── sessions/           # Session management
│   │   ├── technician/         # Technician management
│   │   ├── test-violations/   # Test violation examples
│   │   ├── uploads/            # File upload handling
│   │   ├── user/               # User management
│   │   ├── websocket/          # WebSocket handlers
│   │   ├── work-orders/        # Work order management
│   │   ├── app.module.ts       # Root module
│   │   └── main.ts           # Entry point
│   ├── test/                    # E2E and unit tests
│   │   ├── compliance/         # Compliance tests
│   │   ├── dashboard/          # Dashboard tests
│   │   ├── integration/       # Integration tests
│   │   ├── mocks/              # Test mocks
│   │   ├── performance/        # Performance tests
│   │   ├── security/           # Security tests
│   │   ├── setup/              # Test setup utilities
│   │   ├── templates/          # Test templates
│   │   ├── unit/               # Unit tests
│   │   └── utils/              # Test utilities
│   ├── Dockerfile              # Container definition
│   ├── env.example             # Environment template
│   ├── jest.config.js          # Jest configuration
│   ├── nest-cli.json           # NestJS CLI config
│   ├── package.json            # Dependencies
│   ├── tsconfig.json           # TypeScript config
│   └── tsconfig.build.json     # Build config
└── README.md                   # Apps overview
```

**File Organization Rules:**
- Each feature module has its own directory under `src/`
- Each module should contain: `*.controller.ts`, `*.service.ts`, `*.module.ts`, `dto/`
- Tests mirror the `src/` structure under `test/`
- Shared utilities go in `src/common/`
- Configuration files stay at the root of `apps/api/`

---

### `frontend/` - React Frontend Application

**Purpose:** React-based web frontend application.

```
frontend/
├── coverage/                   # Test coverage reports
├── dist/                       # Production build output
├── docs/                       # Frontend-specific docs
├── node_modules/               # Dependencies
├── playwright-report/          # E2E test reports
├── public/                     # Static assets
│   ├── branding/               # Branding images
│   ├── manifest.json            # PWA manifest
│   ├── offline.html            # Offline page
│   ├── reward_scores.json      # Reward data
│   ├── service-worker.js       # Service worker
│   └── testing-dashboard-demo.html
├── scripts/                    # Frontend utility scripts
│   └── [73 files: migrations, setup, etc.]
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── __tests__/          # Component tests
│   │   ├── agreements/         # Agreement components
│   │   ├── analytics/          # Analytics components
│   │   ├── auth/               # Auth components
│   │   ├── billing/            # Billing components
│   │   ├── cards/              # Card components
│   │   ├── crm/                # CRM components
│   │   ├── customer/           # Customer components
│   │   ├── customers/          # Customer list components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── icons/              # Icon components
│   │   ├── kpi/                # KPI components
│   │   ├── layout/             # Layout components
│   │   ├── scheduler/          # Scheduler components
│   │   ├── scheduling/         # Scheduling components
│   │   ├── search/             # Search components
│   │   ├── services/           # Service components
│   │   ├── settings/           # Settings components
│   │   ├── technicians/        # Technician components
│   │   ├── testing/             # Testing components
│   │   ├── ui/                 # UI primitives
│   │   ├── users/              # User components
│   │   └── work-orders/        # Work order components
│   ├── config/                 # Configuration files
│   ├── context/                # React contexts
│   ├── contexts/               # Additional contexts
│   ├── hooks/                  # Custom React hooks
│   │   ├── __tests__/          # Hook tests
│   │   └── [57 hook files]
│   ├── lib/                    # Library code
│   │   └── [60 utility files]
│   ├── pages/                  # Page components
│   │   └── [16 page files]
│   ├── routes/                 # Route definitions
│   │   ├── admin/              # Admin routes
│   │   ├── compliance/         # Compliance routes
│   │   ├── dashboard/          # Dashboard routes
│   │   └── [main route files]
│   ├── services/               # Service layer
│   ├── stores/                 # State management
│   ├── styles/                 # Global styles
│   ├── test/                   # Test utilities
│   ├── test-utils/             # Testing helpers
│   ├── types/                  # TypeScript types
│   ├── ui/                     # UI components
│   ├── ui-dashboard/           # Dashboard UI
│   ├── utils/                  # Utility functions
│   ├── workers/                # Web workers
│   ├── main.tsx                # Entry point
│   └── index.css               # Global CSS
├── test/                       # E2E tests
│   └── integration/            # Integration tests
├── test-results/               # Test results
├── Dockerfile                  # Container definition
├── env.example                 # Environment template
├── index.html                  # HTML entry point
├── netlify.toml                # Netlify config
├── nginx.conf                  # Nginx config
├── package.json                # Dependencies
├── playwright.config.ts        # Playwright config
├── postcss.config.js           # PostCSS config
├── tailwind.config.js          # Tailwind config
├── tsconfig.json               # TypeScript config
├── tsconfig.node.json          # Node TypeScript config
├── vite.config.ts              # Vite config
├── vitest.config.ts            # Vitest config
└── vitest.e2e.config.ts        # E2E test config
```

**File Organization Rules:**
- Components organized by feature domain
- Shared UI components in `components/ui/`
- Custom hooks in `hooks/`
- Page-level components in `pages/`
- Route definitions in `routes/`
- Types in `types/`
- Utilities in `lib/` or `utils/`
- Tests co-located with components or in `test/`

---

### `libs/` - Shared Libraries

**Purpose:** Shared code libraries used across applications.

```
libs/
├── common/                     # Common utilities library
│   ├── prisma/                 # Prisma schema and migrations
│   │   ├── migrations/         # Database migrations
│   │   │   ├── 20250823161445_enhanced_crm_schema/
│   │   │   ├── 20251124120000_add_compliance_schema/
│   │   │   ├── 20251124130000_add_write_queue/
│   │   │   ├── 20251124160359_veroscore_v3_schema/
│   │   │   └── add_user_employee_fields/
│   │   ├── schema.prisma       # Main Prisma schema
│   │   ├── enhanced_schema.prisma
│   │   ├── seed.ts             # Database seeding
│   │   ├── seed-compliance-rules.ts
│   │   └── seed-kpi-templates.ts
│   ├── src/                    # Source code
│   │   ├── index.ts            # Library entry point
│   │   └── utils/              # Utility functions
│   │       ├── __tests__/      # Utility tests
│   │       ├── formatCurrency.ts
│   │       └── stringUtils.ts
│   ├── package.json            # Library dependencies
│   └── tsconfig.json           # TypeScript config
└── README.md                   # Libraries overview
```

**File Organization Rules:**
- Each library is self-contained with its own `package.json`
- Prisma schemas and migrations in `libs/common/prisma/`
- Shared utilities in `libs/common/src/utils/`
- Tests co-located with source files

---

### `docs/` - Project Documentation

**Purpose:** Comprehensive project documentation.

```
docs/
├── ai/                         # AI-related documentation
├── architecture/               # Architecture documentation
├── archive/                    # Archived documentation
├── audits/                     # Audit reports
├── Auto-PR/                    # Auto-PR documentation
├── bibles/                     # Knowledge bibles
├── compliance-reports/         # Compliance reports
├── contracts/                  # Contract documentation
├── database/                   # Database documentation
├── decisions/                  # Architecture decision records
├── developer/                  # Developer guides
├── examples/                   # Code examples
├── guides/                     # How-to guides
├── metrics/                    # Metrics documentation
├── migrations/                 # Migration guides
├── opa/                        # OPA policy documentation
├── operations/                 # Operations guides
├── planning/                   # Planning documents
├── reference/                 # Reference documentation
├── state-machines/             # State machine docs
└── [1500+ markdown files]      # Various documentation files
```

**File Organization Rules:**
- Documentation organized by topic/domain
- Architecture docs in `architecture/`
- How-to guides in `guides/`
- API documentation in root or `guides/api/`
- Historical/archived docs in `archive/`
- Decision records in `decisions/`

---

### `services/` - External Services

**Purpose:** Configuration and code for external services.

```
services/
└── opa/                        # Open Policy Agent
    ├── bin/                    # OPA binary
    │   └── opa.exe
    ├── data/                   # OPA data files
    │   └── exemptions.json
    ├── policies/               # Rego policy files
    │   ├── _shared.rego        # Shared policy code
    │   ├── _template.rego       # Policy template
    │   ├── architecture.rego   # Architecture policies
    │   ├── backend.rego        # Backend policies
    │   ├── data-integrity.rego # Data integrity policies
    │   ├── documentation.rego  # Documentation policies
    │   ├── error-handling.rego # Error handling policies
    │   ├── frontend.rego       # Frontend policies
    │   ├── infrastructure.rego # Infrastructure policies
    │   ├── observability.rego  # Observability policies
    │   ├── operations.rego     # Operations policies
    │   ├── quality.rego        # Quality policies
    │   ├── security.rego       # Security policies
    │   ├── tech-debt.rego      # Tech debt policies
    │   └── ux-consistency.rego # UX consistency policies
    ├── tests/                  # Policy tests
    │   └── [test files for each policy]
    ├── README.md                # OPA documentation
    └── [test and diagnostic files]
```

**File Organization Rules:**
- Each service has its own directory
- Policy files in `policies/`
- Test files in `tests/`
- Data files in `data/`

---

### `VeroSuiteMobile/` - React Native Mobile App

**Purpose:** React Native mobile application for technicians.

```
VeroSuiteMobile/
├── __tests__/                  # Test files
├── android/                    # Android-specific code
│   ├── app/                    # Android app module
│   │   ├── build/              # Build output
│   │   ├── src/                # Android source
│   │   │   └── main/
│   │   │       ├── java/       # Kotlin/Java code
│   │   │       └── res/        # Android resources
│   │   ├── build.gradle        # Gradle build config
│   │   └── proguard-rules.pro  # ProGuard rules
│   ├── build.gradle            # Root Gradle config
│   ├── gradle/                 # Gradle wrapper
│   ├── gradle.properties       # Gradle properties
│   ├── gradlew                 # Gradle wrapper script
│   └── settings.gradle         # Gradle settings
├── ios/                        # iOS-specific code
│   ├── Podfile                 # CocoaPods dependencies
│   └── VeroSuiteMobile/        # iOS project
│       ├── AppDelegate.swift   # App delegate
│       ├── Images.xcassets/    # Image assets
│       ├── Info.plist          # App info
│       └── LaunchScreen.storyboard
├── src/                        # React Native source
│   ├── components/             # React components
│   ├── constants/              # Constants
│   ├── hooks/                  # Custom hooks
│   ├── navigation/            # Navigation setup
│   ├── screens/                # Screen components
│   ├── services/               # Service layer
│   │   ├── authService.ts
│   │   ├── jobsService.ts
│   │   ├── locationService.ts
│   │   ├── notificationService.ts
│   │   ├── offlineService.ts
│   │   ├── performanceService.ts
│   │   └── uploadService.ts
│   └── types/                  # TypeScript types
├── App.tsx                      # Root component
├── app.json                     # App configuration
├── babel.config.js             # Babel config
├── index.js                     # Entry point
├── jest.config.js              # Jest config
├── metro.config.js             # Metro bundler config
├── package.json                # Dependencies
└── tsconfig.json               # TypeScript config
```

**File Organization Rules:**
- React Native code in `src/`
- Platform-specific code in `android/` and `ios/`
- Services in `src/services/`
- Screens in `src/screens/`
- Components in `src/components/`

---

### `scripts/` - Utility Scripts

**Purpose:** Automation and utility scripts for development and operations.

```
scripts/
├── migration/                  # Migration scripts
│   └── validate-migration.sh
├── apply-write-queue-direct.sql
├── apply-write-queue-migration.ps1
├── audit-observability.ts
├── check_files_simple.py
├── check-compliance-queue-status.ps1
├── cleanup-root-files.ps1
├── cleanup-temporary-files.ps1
├── compare_to_git.py
├── deploy-schema.js
├── detect-silent-failures.ts
├── diagnose-module-error.ps1
├── docs-link-validator.js
├── docs-stale-detector.js
├── docs-toc-generator.js
├── email-alternative.js
├── get-annotations-simple.ps1
├── get-workflow-annotations.ps1
├── kill-port-3001.ps1
├── migrate-backend-to-apps-api.ts
├── organize-all-files.ps1
├── organize-documentation.ps1
├── remove-duplicate-docs.ps1
├── test_complete_flow.js
├── test-compliance-api.ps1
├── test-compliance-api.sh
├── test-compliance-check-created.ps1
├── test-compliance-endpoints.ps1
├── test-compliance-integration.ps1
├── test-create-compliance-check.ps1
├── update-import-paths.ts
├── validate-file-organization.ps1
└── verify-compliance-seed.ps1
```

**File Organization Rules:**
- Scripts organized by purpose (migration, testing, cleanup, etc.)
- PowerShell scripts use `.ps1` extension
- Node.js scripts use `.js` or `.ts` extension
- Python scripts use `.py` extension
- Shell scripts use `.sh` extension

---

### `deploy/` - Deployment Configurations

**Purpose:** Deployment configurations for various environments.

```
deploy/
├── docker-compose.prod.yml     # Production Docker Compose
└── k8s/                        # Kubernetes configurations
    ├── configmap.yaml          # ConfigMap definitions
    ├── deployment.yaml         # Deployment definitions
    ├── namespace.yaml          # Namespace definitions
    ├── secrets.yaml.example    # Secrets template
    └── service.yaml            # Service definitions
```

**File Organization Rules:**
- Docker Compose files at root of `deploy/`
- Kubernetes manifests in `k8s/`
- Environment-specific configs use suffixes (`.prod.yml`, `.dev.yml`, etc.)
- Never commit actual secrets (use `.example` files)

---

### `monitoring/` - Monitoring & Observability

**Purpose:** Monitoring and alerting configurations.

```
monitoring/
├── alertmanager/              # Alertmanager configuration
│   └── alertmanager.yml
├── prometheus/                # Prometheus configuration
│   ├── alerts/                # Alert definitions
│   │   ├── critical-rollback-triggers.yml
│   │   ├── manual-review-required.yml
│   │   └── monitoring-alerts.yml
│   └── prometheus.yml         # Prometheus config
└── README.md                   # Monitoring documentation
```

**File Organization Rules:**
- Prometheus configs in `prometheus/`
- Alert definitions in `prometheus/alerts/`
- Alertmanager config in `alertmanager/`

---

### `shared/` - Shared Code

**Purpose:** Code shared between frontend and backend.

```
shared/
└── validation/                # Shared validation code
    ├── region-constants.ts    # Region constants
    ├── region-constants.d.ts  # Type definitions
    └── region-constants.js.map # Source maps
```

**File Organization Rules:**
- Shared validation logic in `shared/validation/`
- Shared types in `shared/types/` (if exists)
- Keep shared code minimal and well-documented

---

### `supabase/` - Supabase Edge Functions

**Purpose:** Supabase edge functions for serverless operations.

```
supabase/
└── functions/                 # Edge functions
    ├── contact-form/          # Contact form handler
    │   └── index.ts
    ├── contact-submit/        # Contact submission handler
    │   └── index.ts
    └── unsubscribe/           # Unsubscribe handler
        └── index.ts
```

**File Organization Rules:**
- Each function in its own directory
- Entry point is `index.ts`
- Function-specific dependencies in function directory

---

### `tools/` - Development Tools

**Purpose:** Development and build tools.

```
tools/
├── __pycache__/               # Python cache
├── bible_build.py             # Bible build script
├── bible_pipeline.py          # Bible pipeline
├── bible_types.py             # Bible type definitions
├── check_cursor_md_issue.py   # Cursor MD checker
├── diagnose_chunk_boundary.py # Chunk boundary diagnostics
├── Makefile.bibles            # Bible build Makefile
└── README_BIBLE_PIPELINE.md   # Bible pipeline docs
```

**File Organization Rules:**
- Build tools in `tools/`
- Each tool is self-contained
- Documentation for tools in same directory

---

### `knowledge/` - Knowledge Base

**Purpose:** Knowledge "bibles" for AI assistance.

```
knowledge/
└── bibles/                    # Knowledge bibles
    ├── python/                # Python bible
    │   ├── compiled/          # Compiled versions
    │   └── cursor/            # Cursor-specific versions
    ├── rego/                  # Rego/OPA bible
    │   ├── compiled/
    │   └── cursor/
    └── typescript/            # TypeScript bible
        └── cursor/
```

**File Organization Rules:**
- Each language/topic has its own directory
- Compiled versions in `compiled/`
- Cursor-specific versions in `cursor/`

---

### `branding/` - Branding Assets

**Purpose:** Branding images, logos, and marketing assets.

```
branding/
├── assets/                    # Branding assets
│   ├── images/               # Image assets
│   │   ├── [logo files]
│   │   ├── [screenshot files]
│   │   └── [other images]
│   ├── screenshots/          # Application screenshots
│   └── videos/               # Demo videos
└── crm_bg.png                # CRM background image
```

**File Organization Rules:**
- Images in `assets/images/`
- Screenshots in `assets/screenshots/`
- Videos in `assets/videos/`
- Root-level branding files for quick access

---

### `tests/` - Root-Level Tests

**Purpose:** Cross-cutting test files.

```
tests/
├── __pycache__/              # Python cache
├── e2e/                      # E2E tests
│   └── dashboard.spec.ts
├── enforcer_date_test/       # Date detection tests
│   └── current_session_date_violation.md
├── integration/              # Integration tests
│   └── dashboard-regions.test.ts
├── test_date_detection_critical.py
├── test_date_detection_phase2.py
└── test_date_detection_phase3.py
```

**File Organization Rules:**
- Cross-cutting tests at root `tests/`
- Feature-specific tests in respective app directories
- E2E tests in `tests/e2e/`
- Integration tests in `tests/integration/`

---

## 📋 File Organization Principles

### 1. **Monorepo Structure**
- Applications in `apps/`
- Shared libraries in `libs/`
- Shared code in `shared/`

### 2. **Feature-Based Organization**
- Group related files by feature/domain
- Each feature has its own directory
- Tests co-located with source or in `test/` directory

### 3. **Configuration Files**
- Root-level configs for workspace-wide settings
- App-specific configs in respective app directories
- Environment files use `.example` suffix

### 4. **Documentation**
- All documentation in `docs/`
- Organized by topic/domain
- API docs in `docs/guides/api/`
- Architecture docs in `docs/architecture/`

### 5. **Tests**
- Unit tests: co-located or in `test/unit/`
- Integration tests: `test/integration/`
- E2E tests: `test/e2e/` or `tests/e2e/`
- Test utilities: `test/utils/` or `test-utils/`

### 6. **Build Output**
- Compiled output in `dist/` or `build/`
- Coverage reports in `coverage/`
- Test results in `test-results/`

### 7. **Dependencies**
- `package.json` at root and in each app/library
- `node_modules/` at root and in each app/library
- Lock files (`package-lock.json`) committed

### 8. **Enforcement & Rules**
- Enforcement system in `.cursor/enforcement/`
- Rules in `.cursor/rules/`
- Scripts in `.cursor/scripts/`

---

## 🚨 Important Notes

1. **Never modify files in `.cursor/` manually** unless explicitly instructed
2. **Never commit secrets** - use `.example` files for templates
3. **Keep shared code minimal** - prefer libraries in `libs/`
4. **Documentation goes in `docs/`** - not scattered across codebase
5. **Tests should mirror source structure** for easy navigation
6. **Build outputs are gitignored** - don't commit `dist/`, `build/`, `coverage/`
7. **Migration files are versioned** - don't modify existing migrations

---

## 📊 Statistics

- **Total Applications:** 2 (api, frontend)
- **Mobile App:** 1 (VeroSuiteMobile)
- **Shared Libraries:** 1 (common)
- **Documentation Files:** 1500+ markdown files
- **Enforcement Rules:** 5 rule files
- **OPA Policies:** 13 policy files
- **Test Suites:** Multiple (unit, integration, e2e)

---

**End of Report**











