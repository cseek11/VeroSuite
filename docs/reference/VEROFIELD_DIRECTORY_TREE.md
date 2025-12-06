# VeroField Complete Directory Structure & File Type Summary

**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Root Path:** `C:\Users\ashse\Documents\VeroField\Training\VeroField`

---

## 📁 ROOT DIRECTORY

### Root Files Summary
- **Markdown (.md)**: 81 files - Documentation, reports, plans, guides
- **PowerShell (.ps1)**: 4 files - Setup and utility scripts
- **JSON (.json)**: 4 files - Configuration and data files
- **Text (.txt)**: 6 files - Logs and output files
- **Python (.py)**: 1 file - Utility scripts
- **YAML (.yaml)**: 1 file - Configuration
- **Config Files**: `.cursorrules`, `.gitignore`, `.cursorignore`, `.prettierrc`

### Key Root Files
- `package.json` - Monorepo workspace configuration
- `README.md` - Main project documentation
- `ENFORCEMENT_REFACTOR_EXECUTION_PLAN.md` - Active refactoring plan
- `ENFORCEMENT_REFACTOR_ANALYSIS_PLAN.md` - Analysis documentation
- Multiple audit and status reports (`.md` files)

---

## 📂 DIRECTORY STRUCTURE

```
VeroField/
├── .ai/                          # AI/LLM Configuration & Memory
│   ├── logs/
│   │   └── enforcer/            # Enforcement logs (3 .md, 1 .json)
│   ├── memory_bank/              # Memory bank files (7 .md)
│   ├── patterns/                 # Pattern definitions (2 .md + infrastructure/)
│   └── rules/                    # Rule definitions (20+ .mdc files)
│
├── .cursor/                      # Cursor IDE Configuration
│   ├── enforcement/              # Enforcement system files
│   │   ├── ACTIVE_CONTEXT_DUMP.md
│   │   ├── ACTIVE_VIOLATIONS.md
│   │   ├── AGENT_REMINDERS.md
│   │   ├── AGENT_STATUS.md
│   │   ├── AUTO_FIXES.md
│   │   ├── ENFORCEMENT_BLOCK.md
│   │   ├── ENFORCER_REPORT.json
│   │   ├── ENFORCER_STATUS.md
│   │   ├── session.json
│   │   └── VIOLATIONS.md
│   └── rules/                    # LLM interface rules (referenced in .cursorrules)
│
├── .cursor__archived_2025-12-05/ # Archived cursor configuration
├── .cursor__disabled/            # Disabled cursor rules
├── .git/                         # Git repository
├── .github/                      # GitHub Configuration
│   ├── scripts/                  # Python scripts (4 .py files)
│   │   ├── enforce_decision.py
│   │   ├── extract_context.py
│   │   ├── score_pr.py
│   │   └── update_session.py
│   └── workflows/                # GitHub Actions workflows (18 .yml files)
│       ├── ci.yml
│       ├── deploy-production.yml
│       ├── enterprise-testing.yml
│       ├── opa_compliance_check.yml
│       ├── verofield_auto_pr.yml
│       └── [13 more workflow files]
│
├── .husky/                       # Git hooks
│   └── pre-commit               # Pre-commit hook script
│
├── .vscode/                      # VS Code Configuration
│   ├── settings.json
│   └── tasks.json
│
├── apps/                         # Applications (Monorepo Workspace)
│   └── api/                      # Backend API Application
│       ├── dist/                 # Compiled output
│       │   ├── apps/api/         # Compiled API code
│       │   └── shared/validation/ # Compiled shared validation
│       ├── docs/                 # API Documentation (5 .md files)
│       ├── scripts/              # Utility scripts
│       │   ├── *.js              # JavaScript utilities
│       │   ├── *.ts              # TypeScript utilities
│       │   ├── *.ps1             # PowerShell deployment scripts
│       │   └── *.sh              # Shell scripts
│       ├── src/                  # Source Code
│       │   ├── accounts/         # Account management (5 .ts files)
│       │   ├── agreements/       # Agreement management (3 .ts files)
│       │   ├── audit/            # Audit logging (2 .ts files)
│       │   ├── auth/             # Authentication (8 .ts files)
│       │   ├── billing/          # Billing system (15 .ts files)
│       │   ├── common/           # Common utilities (38 .ts files)
│       │   ├── company/          # Company management (4 .ts files)
│       │   ├── compliance/       # Compliance features (8 .ts files)
│       │   ├── crm/              # CRM features (7 .ts files)
│       │   ├── dashboard/        # Dashboard features (25 .ts files)
│       │   ├── health/           # Health checks (3 .ts files)
│       │   ├── jobs/             # Job management (15 .ts files)
│       │   ├── kpi-templates/    # KPI templates (10 .ts files)
│       │   ├── kpis/             # KPI management (8 .ts files)
│       │   ├── layouts/          # Layout management (8 .ts files)
│       │   ├── middleware/       # Middleware (1 .ts file)
│       │   ├── routing/          # Routing (5 .ts files)
│       │   ├── service-types/    # Service types (6 .ts files)
│       │   ├── services/        # Services (1 .ts file)
│       │   ├── sessions/         # Session management (4 .ts files)
│       │   ├── technician/       # Technician management (11 .ts files)
│       │   ├── test-violations/  # Test violations (3 .ts, 2 .md)
│       │   ├── uploads/          # File uploads (4 .ts files)
│       │   ├── user/             # User management (10 .ts files)
│       │   ├── websocket/        # WebSocket (2 .ts files)
│       │   ├── work-orders/      # Work order management (8 .ts files)
│       │   ├── app.module.ts     # Main application module
│       │   └── main.ts           # Application entry point
│       ├── test/                 # Test Suite
│       │   ├── compliance/       # Compliance tests (1 .ts)
│       │   ├── dashboard/        # Dashboard tests (9 files: 4 .ts, 2 .js, 2 .map, 1 .json)
│       │   ├── integration/      # Integration tests (10 files: 6 .ts, 2 .js, 2 .map)
│       │   ├── mocks/            # Test mocks (9 files: 5 .ts, 2 .js, 2 .map)
│       │   ├── performance/      # Performance tests (8 files: 4 .js, 2 .ts, 1 .json, 1 .md)
│       │   ├── security/         # Security tests (12 files: 6 .ts, 3 .js, 3 .map)
│       │   ├── setup/            # Test setup (13 files: 7 .ts, 3 .js, 3 .map)
│       │   ├── templates/        # Test templates (2 .ts)
│       │   ├── unit/             # Unit tests (74 files: 70 .ts, 2 .js, 2 .map)
│       │   ├── utils/            # Test utilities (6 .ts)
│       │   └── *.e2e-spec.ts     # E2E test files
│       ├── Dockerfile            # Docker configuration
│       ├── env.example           # Environment variables template
│       ├── jest.config.js        # Jest test configuration
│       ├── nest-cli.json         # NestJS CLI configuration
│       ├── package.json          # API dependencies
│       ├── README_ENV_SETUP.md   # Environment setup guide
│       ├── start-dev.js          # Development startup script
│       ├── tsconfig*.json        # TypeScript configurations
│       └── tsconfig.tsbuildinfo  # TypeScript build info
│
├── branding/                     # Branding Assets
│   ├── assets/
│   │   ├── images/               # Image assets
│   │   │   ├── *.png             # PNG images (logos, icons, screenshots)
│   │   │   ├── *.webp            # WebP images (optimized)
│   │   │   ├── *.svg             # SVG graphics
│   │   │   └── *.gif             # Animated GIFs
│   │   ├── screenshots/          # Application screenshots (20+ .png files)
│   │   └── videos/               # Demo videos (4 .mov/.mp4 files)
│   └── crm_bg.png                # CRM background image
│
├── coverage/                     # Test Coverage Reports (empty)
│
├── deploy/                       # Deployment Configuration
│   ├── docker-compose.prod.yml   # Production Docker Compose
│   └── k8s/                      # Kubernetes Configuration
│       ├── configmap.yaml
│       ├── deployment.yaml
│       ├── namespace.yaml
│       ├── secrets.yaml.example
│       └── service.yaml
│
├── docs/                         # Documentation Hub
│   ├── ai/                       # AI Documentation
│   │   └── self_improvement_log.md
│   ├── architecture/             # Architecture Documentation
│   │   └── [16 .md files]        # System architecture, two-brain model, audits
│   ├── bibles/                   # Code Bibles & Reference Guides
│   │   ├── python/               # Python Bible
│   │   │   ├── compiled/         # Compiled versions
│   │   │   │   └── Python_Bible.ssm.md
│   │   │   └── cursor/           # Cursor-specific version
│   │   │       └── Python_Bible.cursor.md
│   │   ├── rego/                 # Rego/OPA Bible
│   │   │   ├── compiled/
│   │   │   │   └── REGO_OPA_Bible.ssm.md
│   │   │   └── cursor/
│   │   │       └── REGO_OPA_Bible.cursor.md
│   │   └── typescript/           # TypeScript Bible
│   │       ├── cursor/
│   │       │   └── TypeScript_Bible.cursor.md
│   │       └── [Multiple .md/.mdc files] # Source and compiled versions
│   │           ├── typescript_bible_unified.mdc (21,942 lines!)
│   │           ├── typescript_bible.mdc
│   │           └── [Backup and audit files]
│   ├── [200+ .md files]          # Comprehensive documentation covering:
│   │   ├── API documentation
│   │   ├── Development guides
│   │   ├── Implementation reports
│   │   ├── Migration guides
│   │   ├── Testing guides
│   │   ├── Security guides
│   │   ├── Deployment guides
│   │   └── Feature documentation
│   ├── archive/                  # Archived documentation
│   ├── audits/                   # Audit reports
│   ├── compliance-reports/       # Compliance documentation
│   ├── database/                 # Database documentation
│   ├── decisions/                # Architecture decision records
│   ├── developer/                # Developer documentation
│   ├── examples/                 # Code examples
│   ├── guides/                   # How-to guides
│   ├── metrics/                  # Metrics and analytics docs
│   ├── migrations/               # Migration documentation
│   ├── operations/               # Operations documentation
│   ├── planning/                 # Planning documents
│   ├── reference/                # Reference documentation
│   ├── state-machines/           # State machine documentation
│   └── [Many more subdirectories]
│
├── frontend/                     # Frontend Application
│   ├── coverage/                 # Test Coverage
│   │   ├── *.html, *.css, *.js   # Coverage report files
│   │   └── frontend/             # Coverage for frontend code
│   ├── dist/                     # Production Build Output
│   │   ├── assets/               # Compiled assets (.js, .css)
│   │   ├── branding/             # Branding assets
│   │   └── index.html
│   ├── docs/                     # Frontend Documentation
│   │   ├── TS_CLEANUP_PROGRESS.md
│   │   └── TS_ERROR_FIXES_LOG.md
│   ├── playwright-report/        # Playwright test reports
│   ├── public/                   # Public Static Assets
│   │   ├── branding/             # Branding images
│   │   ├── manifest.json         # PWA manifest
│   │   ├── offline.html          # Offline page
│   │   ├── reward_scores.json    # Reward scores data
│   │   ├── service-worker.js     # Service worker
│   │   └── testing-dashboard-demo.html
│   ├── scripts/                  # Frontend Scripts
│   │   └── [73 files: 69 .js, 2 .sh, 1 .sql, 1 .ps1]
│   ├── src/                      # Source Code
│   │   ├── components/           # React Components
│   │   │   ├── __tests__/        # Component tests (6 .tsx)
│   │   │   ├── agreements/       # Agreement components (4 .tsx)
│   │   │   ├── analytics/        # Analytics components (2 .tsx)
│   │   │   ├── auth/             # Auth components (1 .tsx)
│   │   │   ├── billing/          # Billing components (57 files: 56 .tsx, 1 .ts)
│   │   │   ├── cards/            # Card components (6 files: 5 .tsx, 1 .ts)
│   │   │   ├── crm/              # CRM components (10 .tsx)
│   │   │   ├── customer/         # Customer components (18 .tsx)
│   │   │   ├── customers/        # Customer list components (7 .tsx)
│   │   │   ├── dashboard/        # Dashboard components (76 files: 73 .tsx, 2 .css, 1 .ts)
│   │   │   ├── icons/            # Icon components (1 .tsx)
│   │   │   ├── kpi/              # KPI components (5 files: 4 .tsx, 1 .ts)
│   │   │   ├── layout/           # Layout components (6 files: 5 .tsx, 1 .ts)
│   │   │   ├── scheduler/        # Scheduler components (1 .tsx)
│   │   │   ├── scheduling/       # Scheduling components (20 files: 18 .tsx, 2 .ts)
│   │   │   ├── search/           # Search components (3 .tsx)
│   │   │   ├── services/         # Service components (5 .tsx)
│   │   │   ├── settings/         # Settings components (12 files: 9 .tsx, 3 .ts)
│   │   │   ├── technicians/      # Technician components (9 .tsx)
│   │   │   ├── testing/          # Testing components (3 files: 2 .tsx, 1 .md)
│   │   │   ├── ui/               # UI components (31 files: 30 .tsx, 1 .ts)
│   │   │   ├── users/            # User components (15 .tsx)
│   │   │   ├── work-orders/      # Work order components (8 .tsx)
│   │   │   └── [Standalone components: .tsx files]
│   │   ├── config/               # Configuration
│   │   │   ├── mobileDesignPatterns.ts
│   │   │   └── performanceBudgets.ts
│   │   ├── context/              # React Context
│   │   │   ├── DensityModeContext.tsx
│   │   │   └── LayoutContext.tsx
│   │   ├── contexts/             # Additional Contexts
│   │   │   └── PageCardContext.tsx
│   │   ├── hooks/                # React Hooks
│   │   │   └── [57 files: 54 .ts, 3 .tsx]
│   │   ├── lib/                  # Library Code
│   │   │   └── [60 files: 59 .ts, 1 .js]
│   │   ├── pages/                # Page Components
│   │   │   └── [16 .tsx files]
│   │   ├── routes/               # Routing Configuration
│   │   │   ├── admin/            # Admin routes (3 .tsx)
│   │   │   ├── compliance/       # Compliance routes (5 files: 4 .tsx, 1 .ts)
│   │   │   ├── dashboard/        # Dashboard routes (63 files: 34 .ts, 28 .tsx, 1 .md)
│   │   │   └── [Route files: .tsx, .ts]
│   │   ├── services/             # Service Layer
│   │   │   └── [4 .ts files]
│   │   ├── stores/               # State Management
│   │   │   └── [5 .ts files]
│   │   ├── styles/               # Styles
│   │   │   └── card-responsive.css
│   │   ├── test/                 # Test Utilities
│   │   │   └── [19 files: 12 .ts, 6 .tsx, 1 .md]
│   │   ├── test-utils/           # Test Utilities
│   │   │   └── observability-helpers.tsx
│   │   ├── types/                # TypeScript Types
│   │   │   └── [14 .ts files]
│   │   ├── ui/                   # UI Components
│   │   │   └── Spinner.tsx
│   │   ├── ui-dashboard/         # Dashboard UI (legacy?)
│   │   │   └── [4 files: 3 .jsx, 1 .css]
│   │   ├── utils/                # Utilities
│   │   │   └── [13 files: 8 .ts, 4 .js, 1 .tsx]
│   │   ├── workers/               # Web Workers
│   │   │   └── [1 .ts file]
│   │   ├── crm-styles.css        # CRM-specific styles
│   │   ├── declarations.d.ts     # Type declarations
│   │   ├── env.d.ts              # Environment types
│   │   ├── index.css             # Global styles
│   │   └── main.tsx              # Application entry point
│   ├── test/                     # E2E Tests
│   │   └── integration/          # Integration tests (8 .ts files)
│   ├── test-results/             # Test Results
│   │   ├── results.json
│   │   └── results.xml
│   ├── Dockerfile                # Docker configuration
│   ├── env.example               # Environment template
│   ├── index.html                # HTML entry point
│   ├── netlify.toml              # Netlify configuration
│   ├── nginx.conf                # Nginx configuration
│   ├── package.json              # Frontend dependencies
│   ├── playwright.config.ts      # Playwright configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tsconfig.node.json        # Node TypeScript config
│   ├── vite.config.ts            # Vite configuration
│   ├── vitest.config.ts          # Vitest configuration
│   ├── vitest.e2e.config.ts      # E2E test configuration
│   └── [PowerShell scripts: .ps1 files]
│
├── knowledge/                    # Knowledge Base
│   └── bibles/                   # Code Bibles (compiled versions)
│       ├── python/
│       │   ├── compiled/
│       │   │   └── Python_Bible.ssm.md
│       │   └── cursor/
│       │       └── Python_Bible.cursor.md
│       ├── rego/
│       │   ├── compiled/
│       │   │   └── REGO_OPA_Bible.ssm.md
│       │   └── cursor/
│       │       └── REGO_OPA_Bible.cursor.md
│       └── typescript/
│           └── cursor/
│               └── TypeScript_Bible.cursor.md
│
├── libs/                         # Shared Libraries (Monorepo Workspace)
│   └── common/                   # Common Library
│       ├── prisma/               # Prisma ORM
│       │   ├── migrations/       # Database migrations
│       │   │   ├── 20250823161445_enhanced_crm_schema/
│       │   │   ├── 20251124120000_add_compliance_schema/
│       │   │   ├── 20251124130000_add_write_queue/
│       │   │   ├── 20251124160359_veroscore_v3_schema/ (13 SQL files)
│       │   │   ├── add_user_employee_fields/
│       │   │   └── migration_lock.toml
│       │   ├── schema.prisma     # Prisma schema
│       │   ├── enhanced_schema.prisma
│       │   ├── seed.ts           # Database seeding
│       │   └── [Seed and template files: .ts, .js, .d.ts, .js.map]
│       ├── src/
│       │   ├── index.ts          # Library entry point
│       │   └── utils/            # Utility functions
│       │       ├── __tests__/    # Tests (2 .test.ts files)
│       │       ├── formatCurrency.ts
│       │       ├── formatCurrency.md
│       │       ├── stringUtils.ts
│       │       └── stringUtils.md
│       ├── package.json
│       ├── README.md
│       └── tsconfig.json
│
├── monitoring/                   # Monitoring Configuration
│   ├── alertmanager/
│   │   └── alertmanager.yml
│   ├── prometheus/
│   │   ├── alerts/               # Alert definitions
│   │   │   ├── critical-rollback-triggers.yml
│   │   │   ├── manual-review-required.yml
│   │   │   └── monitoring-alerts.yml
│   │   └── prometheus.yml
│   └── README.md
│
├── node_modules/                 # Node.js Dependencies (excluded from tree)
│
├── scripts/                      # Root-Level Scripts
│   ├── *.ps1                     # PowerShell scripts
│   ├── *.ts                       # TypeScript scripts
│   ├── *.js                      # JavaScript scripts
│   ├── *.py                      # Python scripts
│   ├── *.sh                      # Shell scripts
│   ├── *.sql                     # SQL scripts
│   └── migration/                # Migration scripts
│       └── validate-migration.sh
│
├── services/                     # Service Configurations
│   └── opa/                      # Open Policy Agent
│       ├── bin/
│       │   └── opa.exe            # OPA binary
│       ├── data/
│       │   └── exemptions.json
│       ├── policies/              # OPA Policies
│       │   ├── _shared.rego
│       │   ├── _template.rego
│       │   ├── architecture.rego
│       │   ├── backend.rego
│       │   ├── data-integrity.rego
│       │   ├── documentation.rego
│       │   ├── error-handling.rego
│       │   ├── frontend.rego
│       │   ├── infrastructure.rego
│       │   ├── observability.rego
│       │   ├── operations.rego
│       │   ├── quality.rego
│       │   ├── sample.rego
│       │   ├── security.rego
│       │   ├── tech-debt.rego
│       │   └── ux-consistency.rego
│       ├── tests/                 # OPA Test Files
│       │   └── [25+ .rego test files]
│       ├── [Test and diagnostic files: .rego, .json, .md]
│       ├── README.md
│       └── QUICK_START.md
│
├── shared/                       # Shared Code
│   └── validation/               # Validation Utilities
│       ├── region-constants.ts
│       ├── region-constants.d.ts
│       └── region-constants.js.map
│
├── supabase/                     # Supabase Functions
│   └── functions/
│       ├── contact-form/
│       │   └── index.ts
│       ├── contact-submit/
│       │   └── index.ts
│       └── unsubscribe/
│           └── index.ts
│
├── tests/                        # Root-Level Tests
│   ├── __pycache__/              # Python cache
│   ├── e2e/                      # E2E Tests
│   │   └── dashboard.spec.ts
│   ├── enforcer_date_test/       # Date detection tests
│   │   └── current_session_date_violation.md
│   ├── integration/              # Integration Tests
│   │   └── dashboard-regions.test.ts
│   └── [Python test files: .py]
│
├── Test_Results/                 # Test Results (empty)
│
├── tools/                        # Development Tools
│   ├── __pycache__/              # Python cache
│   ├── bible_build.py            # Bible compilation tool
│   ├── bible_pipeline.py         # Bible pipeline
│   ├── bible_types.py            # Bible type definitions
│   ├── check_cursor_md_issue.py  # Cursor MD checker
│   ├── diagnose_chunk_boundary.py # Chunk boundary diagnostic
│   ├── Makefile.bibles           # Makefile for bibles
│   └── README_BIBLE_PIPELINE.md  # Bible pipeline documentation
│
├── verofield-website/            # Marketing Website
│   ├── assets/
│   │   ├── css/                  # Stylesheets (4 .css files)
│   │   ├── js/                   # JavaScript (3 .js files)
│   │   └── videos/               # Videos (1 .mp4)
│   ├── supabase/
│   │   └── functions/
│   │       └── index.ts
│   ├── index.html                # Main page
│   ├── privacy-policy.html
│   ├── terms-and-conditions.html
│   ├── unsubscribed.html
│   ├── sitemap.xml
│   ├── favicon.png
│   └── [SQL setup files: .sql]
│
└── VeroSuiteMobile/              # React Native Mobile App
    ├── __tests__/
    │   └── App.test.tsx
    ├── android/                  # Android Native Code
    │   ├── app/
    │   │   ├── build/            # Build output (extensive)
    │   │   ├── src/
    │   │   │   └── main/
    │   │   │       ├── AndroidManifest.xml
    │   │   │       ├── java/     # Kotlin files (2 .kt)
    │   │   │       └── res/      # Resources (8 .png, 3 .xml)
    │   │   ├── build.gradle
    │   │   ├── debug.keystore
    │   │   └── proguard-rules.pro
    │   ├── build/
    │   ├── build.gradle
    │   ├── gradle/
    │   │   └── wrapper/          # Gradle wrapper
    │   ├── gradle.properties
    │   ├── gradlew
    │   ├── gradlew.bat
    │   └── settings.gradle
    ├── ios/                      # iOS Native Code
    │   ├── Podfile
    │   ├── VeroSuiteMobile/
    │   │   ├── AppDelegate.swift
    │   │   ├── Images.xcassets/  # App icons
    │   │   ├── Info.plist
    │   │   ├── LaunchScreen.storyboard
    │   │   └── PrivacyInfo.xcprivacy
    │   └── VeroSuiteMobile.xcodeproj/
    │       ├── project.pbxproj
    │       └── xcshareddata/
    │           └── xcschemes/
    │               └── VeroSuiteMobile.xcscheme
    ├── src/
    │   ├── components/           # React Native Components
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Input.tsx
    │   │   └── SyncStatus.tsx
    │   ├── constants/
    │   │   └── index.ts
    │   ├── hooks/                # Custom Hooks
    │   │   ├── useAuth.ts
    │   │   └── useJobs.ts
    │   ├── navigation/
    │   │   └── AppNavigator.tsx
    │   ├── screens/              # Screen Components
    │   │   ├── JobDetailsScreen.tsx
    │   │   ├── JobsScreen.tsx
    │   │   ├── LoginScreen.tsx
    │   │   ├── PhotoCaptureScreen.tsx
    │   │   └── SignatureCaptureScreen.tsx
    │   ├── services/             # Mobile Services
    │   │   ├── authService.ts
    │   │   ├── jobsService.ts
    │   │   ├── locationService.ts
    │   │   ├── notificationService.ts
    │   │   ├── offlineService.ts
    │   │   ├── performanceService.ts
    │   │   └── uploadService.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   └── [Entry files]
    ├── app.json                  # Expo configuration
    ├── App.tsx                    # Main app component
    ├── babel.config.js            # Babel configuration
    ├── Gemfile                    # Ruby dependencies (CocoaPods)
    ├── index.js                   # Entry point
    ├── jest.config.js             # Jest configuration
    ├── metro.config.js            # Metro bundler config
    ├── package.json               # Mobile app dependencies
    ├── README.md
    └── tsconfig.json              # TypeScript configuration
```

---

## 📊 FILE TYPE SUMMARY BY DIRECTORY

### Root Directory
- **.md**: 81 files (documentation, reports, plans)
- **.ps1**: 4 files (PowerShell scripts)
- **.json**: 4 files (config/data)
- **.txt**: 6 files (logs/output)
- **.py**: 1 file (utility)
- **.yaml**: 1 file (config)
- **Config**: `.cursorrules`, `.gitignore`, `.cursorignore`, `.prettierrc`

### apps/api/
- **.ts**: ~200+ TypeScript source files
- **.js**: Compiled JavaScript + utility scripts
- **.spec.ts / .e2e-spec.ts**: Test files
- **.json**: Configuration files (package.json, tsconfig, jest.config)
- **.md**: Documentation files
- **.ps1 / .sh**: Deployment scripts
- **.sql**: Migration scripts (in Prisma migrations)

### frontend/
- **.tsx**: ~300+ React component files
- **.ts**: ~150+ TypeScript utility/type files
- **.css**: Stylesheet files
- **.js**: JavaScript utilities and scripts
- **.json**: Configuration files
- **.html**: HTML templates
- **.md**: Documentation

### docs/
- **.md**: 200+ markdown documentation files
- **.mdc**: Markdown cursor files (bibles)
- Organized into subdirectories: architecture, bibles, guides, etc.

### libs/common/
- **.ts**: TypeScript source files
- **.prisma**: Prisma schema files
- **.sql**: Migration SQL files
- **.md**: Documentation

### services/opa/
- **.rego**: OPA policy files (~40+ files)
- **.json**: Test input/output files
- **.md**: Documentation
- **.exe**: OPA binary (Windows)

### VeroSuiteMobile/
- **.tsx**: React Native components
- **.ts**: TypeScript files
- **.kt**: Kotlin files (Android)
- **.swift**: Swift files (iOS)
- **.gradle**: Gradle build files
- **.xml**: Android manifest/resources
- **.json**: Configuration files

### scripts/
- **.ps1**: PowerShell scripts
- **.ts**: TypeScript scripts
- **.js**: JavaScript scripts
- **.py**: Python scripts
- **.sh**: Shell scripts
- **.sql**: SQL scripts

### verofield-website/
- **.html**: HTML pages
- **.css**: Stylesheets
- **.js**: JavaScript
- **.xml**: Sitemap
- **.sql**: Database setup

---

## 🔑 KEY STATISTICS

- **Total Directories**: 30+ major directories
- **Monorepo Workspaces**: `apps/*`, `libs/*`
- **Main Applications**: 
  - Backend API (NestJS)
  - Frontend (React + Vite)
  - Mobile App (React Native)
  - Marketing Website
- **Documentation**: 200+ markdown files
- **Test Coverage**: E2E, integration, unit tests across all apps
- **Code Bibles**: TypeScript (21,942 lines!), Python, Rego/OPA
- **Enforcement System**: Two-brain model with auto-enforcer
- **Database**: Prisma ORM with PostgreSQL
- **Infrastructure**: Docker, Kubernetes, monitoring (Prometheus)

---

## 🎯 TECHNOLOGY STACK SUMMARY

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT + Supabase
- **Payment**: Stripe integration

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Testing**: Vitest, Playwright

### Mobile
- **Framework**: React Native / Expo
- **Platforms**: iOS, Android
- **Language**: TypeScript

### DevOps & Tools
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Monitoring**: Prometheus + Alertmanager
- **Policy**: Open Policy Agent (OPA)
- **Code Quality**: ESLint, Prettier, Husky

---

*This tree represents the complete VeroField project structure as of the current state.*



