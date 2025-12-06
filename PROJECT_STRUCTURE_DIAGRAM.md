# VeroField Project Structure - Visual Tree Diagram

**Generated:** 2025-12-04  
**Format:** Complete visual tree structure from root directory

---

## 🌳 Complete Project Structure Tree

```
VeroField/
│
├── .cursor/                                    # Cursor IDE Configuration & Enforcement
│   ├── enforcement/                            # Enforcement System Files
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
│   ├── rules/                                  # LLM Interface Rules
│   │   ├── 00-llm-interface.mdc
│   │   ├── 01-llm-security-lite.mdc
│   │   ├── 02-llm-fix-mode.mdc
│   │   ├── 10-enforced_task_loop.mdc
│   │   └── SESSION_RESTART_REQUIRED.mdc
│   └── scripts/                                # Enforcement Scripts
│       ├── auto-enforcer.py
│       ├── logger_util.py
│       ├── pre-flight-check.py
│       ├── test-enforcement.py
│       ├── watch-files.py
│       └── veroscore_v3/                       # VeroScore v3 Engine
│           ├── change_buffer.py
│           ├── change_handler.py
│           ├── detection_functions.py
│           ├── enforcement_pipeline_section.py
│           ├── file_change.py
│           ├── git_diff_analyzer.py
│           ├── idempotency_manager.py
│           ├── postgrest_client.py
│           ├── pr_creator.py
│           ├── scoring_engine.py
│           ├── session_manager.py
│           ├── supabase_schema_helper.py
│           ├── threshold_checker.py
│           └── tests/                          # Unit Tests
│               ├── test_change_buffer.py
│               ├── test_detection_functions.py
│               ├── test_file_change.py
│               ├── test_git_diff_analyzer.py
│               ├── test_pr_creator.py
│               ├── test_scoring_engine.py
│               └── test_threshold_checker.py
│
├── apps/                                       # Application Packages (Monorepo)
│   ├── api/                                    # NestJS Backend API
│   │   ├── dist/                              # Compiled Output
│   │   ├── docs/                              # API Documentation
│   │   │   ├── INDEX_VERIFICATION_GUIDE.md
│   │   │   ├── MIGRATION_INSTRUCTIONS.md
│   │   │   ├── PHASE_1_FIXES_SUMMARY.md
│   │   │   ├── TYPESCRIPT_ERRORS_FIX_SUMMARY.md
│   │   │   └── UNDO_REDO_IMPLEMENTATION.md
│   │   ├── scripts/                            # API Utility Scripts
│   │   │   ├── check-port.js
│   │   │   ├── create-customer-locations.js
│   │   │   ├── create-test-jobs.js
│   │   │   ├── deploy-production.ps1
│   │   │   ├── deploy-production.sh
│   │   │   ├── generate-dashboard.js
│   │   │   ├── kill-port.js
│   │   │   ├── kill-port.ps1
│   │   │   ├── quick-test-jobs.js
│   │   │   ├── rotate-encryption-key.ts
│   │   │   ├── run-migration.ts
│   │   │   ├── run-tests.js
│   │   │   ├── seed-work-orders.js
│   │   │   ├── test-health-checks.ts
│   │   │   ├── validate-production-env.ts
│   │   │   └── verify-indexes.ts
│   │   ├── src/                                # Source Code
│   │   │   ├── accounts/                       # Account Management
│   │   │   │   ├── accounts.controller.ts
│   │   │   │   ├── accounts.module.ts
│   │   │   │   ├── accounts.service.ts
│   │   │   │   ├── basic-accounts.controller.ts
│   │   │   │   ├── enhanced-accounts.service.ts
│   │   │   │   ├── simple-accounts.controller.ts
│   │   │   │   └── dto/                        # Data Transfer Objects
│   │   │   ├── agreements/                     # Agreement Management
│   │   │   │   ├── agreements.controller.ts
│   │   │   │   ├── agreements.module.ts
│   │   │   │   ├── agreements.service.ts
│   │   │   │   └── dto/
│   │   │   ├── audit/                          # Audit Logging
│   │   │   │   ├── audit.controller.ts
│   │   │   │   └── audit.service.ts
│   │   │   ├── auth/                           # Authentication & Authorization
│   │   │   │   ├── auth-v2.controller.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.service.spec.ts
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── permissions.guard.ts
│   │   │   │   ├── roles.guard.ts
│   │   │   │   ├── session.service.ts
│   │   │   │   └── dto/
│   │   │   ├── billing/                         # Billing & Payments
│   │   │   │   ├── __tests__/
│   │   │   │   ├── billing.controller.ts
│   │   │   │   ├── billing.module.ts
│   │   │   │   ├── billing.service.ts
│   │   │   │   ├── stripe-webhook.controller.ts
│   │   │   │   ├── stripe.service.ts
│   │   │   │   └── dto/
│   │   │   ├── common/                          # Shared Utilities
│   │   │   │   └── [38 utility files]
│   │   │   ├── company/                         # Company Management
│   │   │   │   ├── company.controller.ts
│   │   │   │   ├── company.module.ts
│   │   │   │   ├── company.service.ts
│   │   │   │   └── dto/
│   │   │   ├── compliance/                      # Compliance Features
│   │   │   │   └── [8 files]
│   │   │   ├── crm/                             # CRM Features
│   │   │   │   └── [7 files]
│   │   │   ├── dashboard/                       # Dashboard APIs
│   │   │   │   └── [25 files]
│   │   │   ├── health/                          # Health Checks
│   │   │   │   └── [3 files]
│   │   │   ├── jobs/                            # Job Management
│   │   │   │   └── [15 files]
│   │   │   ├── kpi-templates/                    # KPI Template Management
│   │   │   │   └── [10 files]
│   │   │   ├── kpis/                             # KPI Management
│   │   │   │   └── [8 files]
│   │   │   ├── layouts/                          # Layout Management
│   │   │   │   └── [8 files]
│   │   │   ├── middleware/                      # Express Middleware
│   │   │   │   └── [1 file]
│   │   │   ├── routing/                          # Route Management
│   │   │   │   └── [5 files]
│   │   │   ├── service-types/                    # Service Type Definitions
│   │   │   │   └── [6 files]
│   │   │   ├── services/                         # Service Layer
│   │   │   │   └── [1 file]
│   │   │   ├── sessions/                         # Session Management
│   │   │   │   └── [4 files]
│   │   │   ├── technician/                       # Technician Management
│   │   │   │   └── [11 files]
│   │   │   ├── test-violations/                  # Test Violation Examples
│   │   │   │   └── [5 files]
│   │   │   ├── uploads/                          # File Upload Handling
│   │   │   │   └── [4 files]
│   │   │   ├── user/                             # User Management
│   │   │   │   └── [10 files]
│   │   │   ├── websocket/                        # WebSocket Handlers
│   │   │   │   └── [2 files]
│   │   │   ├── work-orders/                      # Work Order Management
│   │   │   │   └── [8 files]
│   │   │   ├── app.module.ts                     # Root Module
│   │   │   └── main.ts                           # Entry Point
│   │   ├── test/                                 # Test Suite
│   │   │   ├── compliance/                       # Compliance Tests
│   │   │   ├── dashboard/                        # Dashboard Tests
│   │   │   ├── integration/                      # Integration Tests
│   │   │   ├── mocks/                            # Test Mocks
│   │   │   ├── performance/                      # Performance Tests
│   │   │   ├── security/                         # Security Tests
│   │   │   ├── setup/                            # Test Setup Utilities
│   │   │   ├── templates/                        # Test Templates
│   │   │   ├── unit/                             # Unit Tests
│   │   │   └── utils/                             # Test Utilities
│   │   ├── Dockerfile
│   │   ├── env.example
│   │   ├── jest.config.js
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   ├── start-dev.js
│   │   ├── tsconfig.json
│   │   └── tsconfig.build.json
│   └── README.md
│
├── branding/                                    # Branding Assets
│   ├── assets/
│   │   ├── images/                              # Image Assets
│   │   │   ├── Analytics Dashboard.png
│   │   │   ├── Analytics Dashboard.webp
│   │   │   ├── crm_BG_small.png
│   │   │   ├── crm_BG_V2.png
│   │   │   ├── crm_bg.png
│   │   │   ├── Customizable Interface.png
│   │   │   ├── Customizable Interface.webp
│   │   │   ├── favicon.png
│   │   │   ├── favicon.svg
│   │   │   ├── ic_launcher_round.png
│   │   │   ├── ic_launcher.png
│   │   │   ├── new.png
│   │   │   ├── newbg22.png
│   │   │   ├── OG_New.webp
│   │   │   ├── settings.png
│   │   │   ├── settings.webp
│   │   │   ├── Smart Scheduling.png
│   │   │   ├── Smart Scheduling.webp
│   │   │   ├── sort-arrow-sprite.png
│   │   │   ├── sprite.svg
│   │   │   ├── V_standalone_128.png
│   │   │   ├── V_standalone_256.png
│   │   │   ├── V_standalone_512.png
│   │   │   ├── vero_F.png
│   │   │   ├── vero_small.png
│   │   │   ├── vero_social_small.gif
│   │   │   ├── Verofield_facebook.webp
│   │   │   └── veropest_logo.png
│   │   ├── screenshots/                         # Application Screenshots
│   │   │   └── [18 screenshot files]
│   │   └── videos/                              # Demo Videos
│   │       ├── copy_8B367DA7-0028-43A0-B57C-3845E80BE7C8.mov
│   │       ├── copy_8B367DA7-0028-43A0-B57C-3845E80BE7C8.mp4
│   │       ├── demo_1_optimized.mp4
│   │       ├── demo_1.mp4
│   │       └── vero_demo.mp4
│   └── crm_bg.png
│
├── coverage/                                    # Test Coverage Reports
│
├── deploy/                                      # Deployment Configurations
│   ├── docker-compose.prod.yml                 # Production Docker Compose
│   └── k8s/                                     # Kubernetes Configurations
│       ├── configmap.yaml
│       ├── deployment.yaml
│       ├── namespace.yaml
│       ├── secrets.yaml.example
│       └── service.yaml
│
├── docs/                                        # Project Documentation
│   ├── ai/                                      # AI-Related Documentation
│   ├── architecture/                            # Architecture Documentation
│   ├── archive/                                 # Archived Documentation
│   ├── audits/                                  # Audit Reports
│   ├── Auto-PR/                                 # Auto-PR Documentation
│   ├── bibles/                                  # Knowledge Bibles
│   ├── compliance-reports/                      # Compliance Reports
│   ├── contracts/                               # Contract Documentation
│   ├── database/                                 # Database Documentation
│   ├── decisions/                               # Architecture Decision Records
│   ├── developer/                               # Developer Guides
│   ├── examples/                                 # Code Examples
│   ├── guides/                                  # How-To Guides
│   ├── metrics/                                 # Metrics Documentation
│   ├── migrations/                              # Migration Guides
│   ├── opa/                                     # OPA Policy Documentation
│   ├── operations/                               # Operations Guides
│   ├── planning/                                # Planning Documents
│   ├── reference/                               # Reference Documentation
│   ├── state-machines/                           # State Machine Docs
│   └── [1500+ markdown files]                    # Various Documentation Files
│
├── enforcement/                                 # Legacy Enforcement (Migrated to .cursor/enforcement)
│   ├── checkers/                                # Rule Checkers
│   │   ├── architecture_checker.py
│   │   ├── backend_checker.py
│   │   ├── backend_patterns_checker.py
│   │   ├── backend_utils.py
│   │   ├── base_checker.py
│   │   ├── checker_registry.py
│   │   ├── checker_router.py
│   │   ├── core_checker.py
│   │   ├── data_checker.py
│   │   ├── dto_enforcement_checker.py
│   │   ├── enforcement_checker.py
│   │   ├── error_resilience_checker.py
│   │   ├── frontend_checker.py
│   │   ├── master_checker.py
│   │   ├── observability_checker.py
│   │   ├── operations_checker.py
│   │   ├── pattern_matcher.py
│   │   ├── python_bible_checker.py
│   │   ├── quality_checker.py
│   │   ├── secret_scanner_checker.py
│   │   ├── security_checker.py
│   │   ├── tech_debt_checker.py
│   │   ├── tenant_isolation_checker.py
│   │   ├── typescript_bible_checker.py
│   │   ├── ux_consistency_checker.py
│   │   └── verification_checker.py
│   ├── checks/                                   # Core Checks
│   │   ├── bug_logging_checker.py
│   │   ├── context_checker.py
│   │   ├── date_checker.py
│   │   ├── error_handling_checker.py
│   │   ├── logging_checker.py
│   │   ├── memory_bank_checker.py
│   │   ├── python_bible_checker.py
│   │   └── security_checker.py
│   ├── core/                                     # Core Enforcement
│   │   ├── file_scanner.py
│   │   ├── git_utils.py
│   │   ├── scope_evaluator.py
│   │   ├── session_state.py
│   │   └── violations.py
│   ├── reporting/                                # Reporting Module
│   │   ├── block_generator.py
│   │   ├── context_bundle_builder.py
│   │   ├── status_generator.py
│   │   ├── two_brain_reporter.py
│   │   └── violations_logger.py
│   ├── tests/                                    # Enforcement Tests
│   ├── ACTIVE_CONTEXT_DUMP.md
│   ├── ACTIVE_VIOLATIONS.md
│   ├── AGENT_REMINDERS.md
│   ├── AGENT_STATUS.md
│   ├── AUTO_FIXES.md
│   ├── ENFORCEMENT_BLOCK.md
│   ├── ENFORCER_REPORT.json
│   ├── ENFORCER_STATUS.md
│   ├── VIOLATIONS.md
│   ├── autofix_suggestions.py
│   ├── check_secret_violations.py
│   ├── config_paths.py
│   ├── date_detector.py
│   ├── fix_loop.py
│   ├── handshake_generator.py
│   ├── llm_caller.py
│   ├── prisma_query_parser.py
│   ├── report_generator.py
│   ├── session.json
│   ├── tenant_tables.json
│   └── two_brain_integration.py
│
├── frontend/                                     # React Frontend Application
│   ├── coverage/                                # Test Coverage
│   ├── dist/                                    # Production Build
│   ├── docs/                                    # Frontend Documentation
│   │   ├── TS_CLEANUP_PROGRESS.md
│   │   └── TS_ERROR_FIXES_LOG.md
│   ├── node_modules/                            # Dependencies
│   ├── playwright-report/                       # E2E Test Reports
│   ├── public/                                  # Static Assets
│   │   ├── branding/                            # Branding Images
│   │   ├── manifest.json                        # PWA Manifest
│   │   ├── offline.html                         # Offline Page
│   │   ├── reward_scores.json                   # Reward Data
│   │   ├── service-worker.js                    # Service Worker
│   │   └── testing-dashboard-demo.html
│   ├── scripts/                                 # Frontend Scripts
│   │   └── [73 files: migrations, setup, etc.]
│   ├── src/                                     # Source Code
│   │   ├── components/                          # React Components
│   │   │   ├── __tests__/                       # Component Tests
│   │   │   ├── agreements/                       # Agreement Components
│   │   │   ├── analytics/                        # Analytics Components
│   │   │   ├── auth/                             # Auth Components
│   │   │   ├── billing/                          # Billing Components
│   │   │   ├── cards/                            # Card Components
│   │   │   ├── crm/                              # CRM Components
│   │   │   ├── customer/                         # Customer Components
│   │   │   ├── customers/                        # Customer List Components
│   │   │   ├── dashboard/                        # Dashboard Components
│   │   │   ├── icons/                            # Icon Components
│   │   │   ├── kpi/                              # KPI Components
│   │   │   ├── layout/                           # Layout Components
│   │   │   ├── scheduler/                        # Scheduler Components
│   │   │   ├── scheduling/                       # Scheduling Components
│   │   │   ├── search/                           # Search Components
│   │   │   ├── services/                         # Service Components
│   │   │   ├── settings/                         # Settings Components
│   │   │   ├── technicians/                      # Technician Components
│   │   │   ├── testing/                           # Testing Components
│   │   │   ├── ui/                               # UI Primitives
│   │   │   ├── users/                            # User Components
│   │   │   └── work-orders/                      # Work Order Components
│   │   ├── config/                               # Configuration
│   │   │   ├── mobileDesignPatterns.ts
│   │   │   └── performanceBudgets.ts
│   │   ├── context/                               # React Contexts
│   │   │   ├── DensityModeContext.tsx
│   │   │   └── LayoutContext.tsx
│   │   ├── contexts/                              # Additional Contexts
│   │   │   └── PageCardContext.tsx
│   │   ├── hooks/                                # Custom React Hooks
│   │   │   ├── __tests__/                         # Hook Tests
│   │   │   └── [57 hook files]
│   │   ├── lib/                                  # Library Code
│   │   │   └── [60 utility files]
│   │   ├── pages/                                # Page Components
│   │   │   ├── AgreementsPage.tsx
│   │   │   ├── CreateAgreementPage.tsx
│   │   │   ├── CreateTechnicianPage.tsx
│   │   │   ├── CreateWorkOrderPage.tsx
│   │   │   ├── CustomerManagement.tsx
│   │   │   ├── CustomerManagementDemo.tsx
│   │   │   ├── EditTechnicianPage.tsx
│   │   │   ├── EditWorkOrderPage.tsx
│   │   │   ├── ServiceManagement.tsx
│   │   │   ├── SessionsPage.tsx
│   │   │   ├── TechnicianDetailPage.tsx
│   │   │   ├── TechnicianManagementPage.tsx
│   │   │   ├── TechniciansPage.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   ├── WorkOrderDetailPage.tsx
│   │   │   └── WorkOrdersPage.tsx
│   │   ├── routes/                               # Route Definitions
│   │   │   ├── admin/                            # Admin Routes
│   │   │   ├── compliance/                       # Compliance Routes
│   │   │   ├── dashboard/                        # Dashboard Routes
│   │   │   ├── App.tsx
│   │   │   ├── Billing.tsx
│   │   │   ├── Charts.tsx
│   │   │   ├── Communications.tsx
│   │   │   ├── Finance.tsx
│   │   │   ├── Jobs.tsx
│   │   │   ├── Knowledge.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── Routing.tsx
│   │   │   ├── Scheduler.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Uploads.tsx
│   │   │   ├── VeroCardsV3.tsx
│   │   │   └── WorkOrders.tsx
│   │   ├── services/                             # Service Layer
│   │   │   ├── layoutStorage.ts
│   │   │   ├── offline-api-wrapper.ts
│   │   │   ├── offline-queue.service.ts
│   │   │   └── TestExecutionService.ts
│   │   ├── stores/                               # State Management
│   │   │   └── [5 store files]
│   │   ├── styles/                               # Global Styles
│   │   │   └── card-responsive.css
│   │   ├── test/                                 # Test Utilities
│   │   │   └── [19 test files]
│   │   ├── test-utils/                           # Testing Helpers
│   │   │   └── observability-helpers.tsx
│   │   ├── types/                                # TypeScript Types
│   │   │   └── [14 type files]
│   │   ├── ui/                                   # UI Components
│   │   │   └── Spinner.tsx
│   │   ├── ui-dashboard/                         # Dashboard UI
│   │   │   └── [4 files]
│   │   ├── utils/                                # Utility Functions
│   │   │   └── [13 utility files]
│   │   ├── workers/                               # Web Workers
│   │   │   └── [1 worker file]
│   │   ├── main.tsx                              # Entry Point
│   │   ├── index.css                             # Global CSS
│   │   └── crm-styles.css                        # CRM Styles
│   ├── test/                                     # E2E Tests
│   │   └── integration/                          # Integration Tests
│   ├── test-results/                             # Test Results
│   ├── Dockerfile
│   ├── env.example
│   ├── index.html
│   ├── netlify.toml
│   ├── nginx.conf
│   ├── package.json
│   ├── playwright.config.ts
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   └── vitest.e2e.config.ts
│
├── knowledge/                                    # Knowledge Base
│   └── bibles/                                   # Knowledge Bibles
│       ├── python/                               # Python Bible
│       │   ├── compiled/                         # Compiled Versions
│       │   │   └── Python_Bible.ssm.md
│       │   └── cursor/                           # Cursor-Specific
│       │       └── Python_Bible.cursor.md
│       ├── rego/                                 # Rego/OPA Bible
│       │   ├── compiled/
│       │   │   └── REGO_OPA_Bible.ssm.md
│       │   └── cursor/
│       │       └── REGO_OPA_Bible.cursor.md
│       └── typescript/                           # TypeScript Bible
│           └── cursor/
│               └── TypeScript_Bible.cursor.md
│
├── libs/                                         # Shared Libraries
│   ├── common/                                   # Common Utilities Library
│   │   ├── prisma/                               # Prisma Schema & Migrations
│   │   │   ├── migrations/                       # Database Migrations
│   │   │   │   ├── 20250823161445_enhanced_crm_schema/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20251124120000_add_compliance_schema/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20251124130000_add_write_queue/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20251124160359_veroscore_v3_schema/
│   │   │   │   │   ├── add_missing_rls_policies.sql
│   │   │   │   │   ├── complete_postgrest_setup.sql
│   │   │   │   │   ├── complete_secure_setup.sql
│   │   │   │   │   ├── configure_schema_exposure.sql
│   │   │   │   │   ├── drop_rpc_functions.sql
│   │   │   │   │   ├── enable_rls_all_tables.sql
│   │   │   │   │   ├── final_postgrest_fix.sql
│   │   │   │   │   ├── final_secure_setup.sql
│   │   │   │   │   ├── fix_postgrest_config.sql
│   │   │   │   │   ├── force_postgrest_reload.sql
│   │   │   │   │   ├── migration_safe.sql
│   │   │   │   │   ├── migration.sql
│   │   │   │   │   ├── rpc_functions.sql
│   │   │   │   │   └── verify_and_fix_permissions.sql
│   │   │   │   ├── add_user_employee_fields/
│   │   │   │   │   └── migration.sql
│   │   │   │   └── migration_lock.toml
│   │   │   ├── schema.prisma                     # Main Prisma Schema
│   │   │   ├── enhanced_schema.prisma
│   │   │   ├── seed.ts                           # Database Seeding
│   │   │   ├── seed-compliance-rules.ts
│   │   │   └── seed-kpi-templates.ts
│   │   ├── src/                                  # Source Code
│   │   │   ├── index.ts                          # Library Entry Point
│   │   │   └── utils/                            # Utility Functions
│   │   │       ├── __tests__/                    # Utility Tests
│   │   │       ├── formatCurrency.ts
│   │   │       ├── formatCurrency.md
│   │   │       ├── stringUtils.ts
│   │   │       └── stringUtils.md
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   └── README.md
│
├── monitoring/                                   # Monitoring & Observability
│   ├── alertmanager/                             # Alertmanager Configuration
│   │   └── alertmanager.yml
│   ├── prometheus/                               # Prometheus Configuration
│   │   ├── alerts/                               # Alert Definitions
│   │   │   ├── critical-rollback-triggers.yml
│   │   │   ├── manual-review-required.yml
│   │   │   └── monitoring-alerts.yml
│   │   └── prometheus.yml
│   └── README.md
│
├── node_modules/                                 # Root-Level Dependencies
│
├── scripts/                                      # Utility Scripts
│   ├── migration/                                # Migration Scripts
│   │   └── validate-migration.sh
│   ├── apply-write-queue-direct.sql
│   ├── apply-write-queue-migration.ps1
│   ├── audit-observability.ts
│   ├── check_files_simple.py
│   ├── check-compliance-queue-status.ps1
│   ├── cleanup-root-files.ps1
│   ├── cleanup-temporary-files.ps1
│   ├── compare_to_git.py
│   ├── deploy-schema.js
│   ├── detect-silent-failures.ts
│   ├── diagnose-module-error.ps1
│   ├── docs-link-validator.js
│   ├── docs-stale-detector.js
│   ├── docs-toc-generator.js
│   ├── email-alternative.js
│   ├── get-annotations-simple.ps1
│   ├── get-workflow-annotations.ps1
│   ├── kill-port-3001.ps1
│   ├── migrate-backend-to-apps-api.ts
│   ├── organize-all-files.ps1
│   ├── organize-documentation.ps1
│   ├── remove-duplicate-docs.ps1
│   ├── test_complete_flow.js
│   ├── test-compliance-api.ps1
│   ├── test-compliance-api.sh
│   ├── test-compliance-check-created.ps1
│   ├── test-compliance-endpoints.ps1
│   ├── test-compliance-integration.ps1
│   ├── test-create-compliance-check.ps1
│   ├── update-import-paths.ts
│   ├── validate-file-organization.ps1
│   └── verify-compliance-seed.ps1
│
├── services/                                     # External Services
│   └── opa/                                      # Open Policy Agent
│       ├── bin/                                  # OPA Binary
│       │   └── opa.exe
│       ├── data/                                 # OPA Data Files
│       │   └── exemptions.json
│       ├── policies/                             # Rego Policy Files
│       │   ├── _shared.rego                      # Shared Policy Code
│       │   ├── _template.rego                     # Policy Template
│       │   ├── architecture.rego                 # Architecture Policies
│       │   ├── backend.rego                      # Backend Policies
│       │   ├── data-integrity.rego                # Data Integrity Policies
│       │   ├── documentation.rego                # Documentation Policies
│       │   ├── error-handling.rego                # Error Handling Policies
│       │   ├── frontend.rego                     # Frontend Policies
│       │   ├── infrastructure.rego                # Infrastructure Policies
│       │   ├── observability.rego                # Observability Policies
│       │   ├── operations.rego                   # Operations Policies
│       │   ├── quality.rego                       # Quality Policies
│       │   ├── security.rego                      # Security Policies
│       │   ├── tech-debt.rego                     # Tech Debt Policies
│       │   └── ux-consistency.rego                # UX Consistency Policies
│       ├── tests/                                # Policy Tests
│       │   ├── architecture_r03_test.rego
│       │   ├── architecture_r21_test.rego
│       │   ├── architecture_r22_test.rego
│       │   ├── backend_r11_test.rego
│       │   ├── data_integrity_r04_test.rego
│       │   ├── data_integrity_r05_test.rego
│       │   ├── data_integrity_r06_test.rego
│       │   ├── documentation_r23_test.rego
│       │   ├── error_handling_r07_test.rego
│       │   ├── frontend_r24_test.rego
│       │   ├── observability_r08_test.rego
│       │   ├── observability_r09_test.rego
│       │   ├── operations_r25_test.rego
│       │   ├── quality_r10_test.rego
│       │   ├── quality_r16_test.rego
│       │   ├── quality_r17_test.rego
│       │   ├── quality_r18_test.rego
│       │   ├── security_r01_test.rego
│       │   ├── security_r02_test.rego
│       │   ├── security_r12_test.rego
│       │   ├── security_r13_test.rego
│       │   ├── tech_debt_r14_test.rego
│       │   ├── tech_debt_r15_test.rego
│       │   ├── ux_r19_test.rego
│       │   └── ux_r20_test.rego
│       ├── README.md
│       └── [test and diagnostic files]
│
├── shared/                                       # Shared Code
│   └── validation/                              # Shared Validation Code
│       ├── region-constants.ts
│       ├── region-constants.d.ts
│       └── region-constants.js.map
│
├── supabase/                                     # Supabase Edge Functions
│   └── functions/                                 # Edge Functions
│       ├── contact-form/                         # Contact Form Handler
│       │   └── index.ts
│       ├── contact-submit/                       # Contact Submission Handler
│       │   └── index.ts
│       └── unsubscribe/                          # Unsubscribe Handler
│           └── index.ts
│
├── tests/                                        # Root-Level Tests
│   ├── e2e/                                      # E2E Tests
│   │   └── dashboard.spec.ts
│   ├── enforcer_date_test/                       # Date Detection Tests
│   │   └── current_session_date_violation.md
│   ├── integration/                              # Integration Tests
│   │   └── dashboard-regions.test.ts
│   ├── test_date_detection_critical.py
│   ├── test_date_detection_phase2.py
│   └── test_date_detection_phase3.py
│
├── tools/                                        # Development Tools
│   ├── bible_build.py
│   ├── bible_pipeline.py
│   ├── bible_types.py
│   ├── check_cursor_md_issue.py
│   ├── diagnose_chunk_boundary.py
│   ├── Makefile.bibles
│   └── README_BIBLE_PIPELINE.md
│
├── VeroSuiteMobile/                              # React Native Mobile App
│   ├── __tests__/                                # Test Files
│   │   └── App.test.tsx
│   ├── android/                                  # Android-Specific Code
│   │   ├── app/                                  # Android App Module
│   │   │   ├── build/                            # Build Output
│   │   │   ├── src/                              # Android Source
│   │   │   │   └── main/
│   │   │   │       ├── java/                     # Kotlin/Java Code
│   │   │   │       └── res/                      # Android Resources
│   │   │   ├── build.gradle
│   │   │   └── proguard-rules.pro
│   │   ├── build.gradle
│   │   ├── gradle/                               # Gradle Wrapper
│   │   ├── gradle.properties
│   │   ├── gradlew
│   │   └── settings.gradle
│   ├── ios/                                      # iOS-Specific Code
│   │   ├── Podfile
│   │   └── VeroSuiteMobile/                     # iOS Project
│   │       ├── AppDelegate.swift
│   │       ├── Images.xcassets/
│   │       ├── Info.plist
│   │       └── LaunchScreen.storyboard
│   ├── src/                                      # React Native Source
│   │   ├── components/                           # React Components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── SyncStatus.tsx
│   │   ├── constants/                           # Constants
│   │   │   └── index.ts
│   │   ├── hooks/                                # Custom Hooks
│   │   │   ├── useAuth.ts
│   │   │   └── useJobs.ts
│   │   ├── navigation/                           # Navigation Setup
│   │   │   └── AppNavigator.tsx
│   │   ├── screens/                              # Screen Components
│   │   │   ├── JobDetailsScreen.tsx
│   │   │   ├── JobsScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── PhotoCaptureScreen.tsx
│   │   │   └── SignatureCaptureScreen.tsx
│   │   ├── services/                             # Service Layer
│   │   │   ├── authService.ts
│   │   │   ├── jobsService.ts
│   │   │   ├── locationService.ts
│   │   │   ├── notificationService.ts
│   │   │   ├── offlineService.ts
│   │   │   ├── performanceService.ts
│   │   │   └── uploadService.ts
│   │   └── types/                                # TypeScript Types
│   │       └── index.ts
│   ├── App.tsx
│   ├── app.json
│   ├── babel.config.js
│   ├── index.js
│   ├── jest.config.js
│   ├── metro.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── verofield-website/                            # Marketing Website
│   ├── assets/
│   │   ├── css/
│   │   │   ├── animations.css
│   │   │   ├── inline-styles.css
│   │   │   ├── main.css
│   │   │   └── tailwind.min.css
│   │   ├── js/
│   │   │   ├── animations.js
│   │   │   ├── forms.js
│   │   │   └── main.js
│   │   └── videos/
│   │       └── demo_1_optimized.mp4
│   ├── supabase/
│   │   └── functions/
│   │       └── index.ts
│   ├── favicon.png
│   ├── index.html
│   ├── privacy-policy.html
│   ├── setup_form_user.sql
│   ├── setup_leads_table.sql
│   ├── sitemap.xml
│   ├── terms-and-conditions.html
│   └── unsubscribed.html
│
├── .gitignore
├── breakdown.json
├── generate_comprehensive_report.py
├── metadata.json
├── MIGRATION_LOG.md
├── package.json                                  # Root Package.json
├── package-lock.json                             # Dependency Lock File
├── PROJECT_STRUCTURE_REPORT.md
├── PROJECT_STRUCTURE_DIAGRAM.md                  # This File
├── README.md                                     # Project Overview
├── run-tests.ps1
├── setup-pre-commit.ps1
├── verify_android_setup.ps1
└── verify_java_setup.ps1
```

---

## 📊 Structure Summary

### Directory Count by Type

- **Applications:** 2 (api, frontend)
- **Mobile App:** 1 (VeroSuiteMobile)
- **Shared Libraries:** 1 (common)
- **Documentation Directories:** 20+ in `docs/`
- **Enforcement System:** 2 locations (`.cursor/enforcement`, `enforcement/`)
- **Services:** 1 (OPA)
- **Deployment Configs:** 2 (Docker, Kubernetes)
- **Monitoring:** 2 (Prometheus, Alertmanager)

### File Organization Patterns

1. **Monorepo Structure:** Applications in `apps/`, libraries in `libs/`
2. **Feature-Based:** Each feature has its own module/directory
3. **Test Co-location:** Tests mirror source structure
4. **Documentation Centralized:** All docs in `docs/` directory
5. **Configuration at Root:** App-specific configs in app directories
6. **Shared Code:** Minimal shared code in `shared/`, prefer libraries

---

**End of Visual Tree Diagram**










