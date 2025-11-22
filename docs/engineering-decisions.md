# Engineering Decisions Knowledge Base

**Purpose:** This file serves as a living knowledge base of engineering decisions, trade-offs, alternatives considered, and lessons learned. Every significant architectural or design decision should be documented here.

**Last Updated:** 2025-11-22

---

## Backend Migration to Monorepo Structure - 2025-11-22

### Decision
Migrated backend codebase from `backend/` directory to monorepo structure (`apps/api/` and `libs/common/`) to comply with VeroField Hybrid Rule System v2.0 architectural requirements.

### Context
- **Problem:** Codebase used legacy `backend/` structure, violating monorepo architecture rules
- **Constraints:** 
  - Must maintain all existing functionality
  - Must preserve all tests and configurations
  - Must update all import paths
  - Must update CI/CD workflows
- **Requirements:**
  - Follow monorepo structure: `apps/api/` for API, `libs/common/` for shared code
  - Update all 400+ files to new paths
  - Ensure zero downtime migration
  - Maintain backward compatibility during transition

### Trade-offs
**Pros:**
- ✅ Complies with architectural rules
- ✅ Enables better code organization
- ✅ Supports future microservices expansion
- ✅ Improves shared code reusability
- ✅ Better separation of concerns

**Cons:**
- ⚠️ Large migration effort (400+ files)
- ⚠️ Requires updating all import paths
- ⚠️ CI/CD workflows need updates
- ⚠️ Documentation needs updates
- ⚠️ Risk of breaking changes if not careful

### Alternatives Considered
**Alternative 1: Keep backend/ structure**
- Description: Maintain current structure, update rules to allow it
- Why rejected: Violates architectural standards, limits future scalability

**Alternative 2: Gradual migration**
- Description: Migrate module by module over time
- Why rejected: Creates confusion with mixed paths, harder to maintain

**Alternative 3: Big bang migration**
- Description: Migrate everything at once (chosen approach)
- Why chosen: Clean break, easier to verify, less confusion

### Rationale
- Monorepo structure is industry standard for large codebases
- Enables better code sharing via `libs/common/`
- Supports future microservices architecture
- Aligns with VeroField Hybrid Rule System requirements
- Provides clear separation between apps and shared libraries

### Impact
**Short-term:**
- All files moved to new locations
- All import paths updated
- CI/CD workflows updated
- Build configurations updated
- Some temporary confusion during transition

**Long-term:**
- Better code organization
- Easier to add new services
- Improved shared code reusability
- Better alignment with architectural standards
- Reduced technical debt

**Affected Areas:**
- All backend source code (200+ files)
- All test files (168 files)
- All scripts (20+ files)
- CI/CD workflows (6 workflows)
- Documentation (1000+ references)

### Lessons Learned
**What Worked Well:**
- Comprehensive migration plan before execution
- Dry-run testing to verify file moves
- Backup branch created before migration
- Incremental fixes (start script, JWT_SECRET loading)
- Thorough documentation of changes

**What Didn't Work:**
- Initial assumption that build output would be `dist/main.js` (monorepo preserves structure)
- Checking `process.env` at module load time (ConfigModule not loaded yet)
- Some workflow YAML syntax issues with multi-line strings

**What Would Be Done Differently:**
- Test build output paths earlier in process
- Use `registerAsync()` pattern from start for environment variables
- Validate workflow YAML syntax before committing

### Related Decisions
- JWT Module Async Registration Pattern (same session)
- Monorepo Build Output Path Handling (same session)
- Structured Logging Implementation (ongoing)

---

## JWT Module Async Registration Pattern - 2025-11-22

### Decision
Changed JWT module registration from synchronous `JwtModule.register()` to asynchronous `JwtModule.registerAsync()` with ConfigService to properly load environment variables.

### Context
- **Problem:** `auth.module.ts` was checking `process.env.JWT_SECRET` at module load time (line 14), which happens before NestJS ConfigModule loads the `.env` file
- **Constraints:**
  - Must work with ConfigModule
  - Must maintain error handling
  - Must support trace propagation
- **Requirements:**
  - Environment variables must be available when JWT module initializes
  - Error messages must include trace context
  - Must fail fast with clear error messages

### Trade-offs
**Pros:**
- ✅ Environment variables loaded before module initialization
- ✅ Proper error handling with trace context
- ✅ Type-safe with ConfigService
- ✅ Works with `.env` files

**Cons:**
- ⚠️ Slightly more complex than synchronous registration
- ⚠️ Requires ConfigModule to be imported

### Alternatives Considered
**Alternative 1: Keep synchronous registration**
- Description: Use `JwtModule.register()` with `process.env`
- Why rejected: Fails because ConfigModule hasn't loaded `.env` yet

**Alternative 2: Load .env manually**
- Description: Use `dotenv` to load `.env` before module loads
- Why rejected: Bypasses NestJS ConfigModule, inconsistent with architecture

**Alternative 3: Async registration with ConfigService (chosen)**
- Description: Use `JwtModule.registerAsync()` with factory function
- Why chosen: Proper NestJS pattern, works with ConfigModule, type-safe

### Rationale
- NestJS best practice for environment-dependent module initialization
- Ensures ConfigModule has loaded environment variables
- Provides proper error handling and trace context
- Maintains type safety with ConfigService

### Impact
**Short-term:**
- Fixed "JWT_SECRET environment variable is required" error
- API server can now start successfully
- Error messages include traceId for debugging

**Long-term:**
- Pattern can be reused for other environment-dependent modules
- Better error tracking with trace context
- More maintainable code

**Affected Areas:**
- `apps/api/src/auth/auth.module.ts`
- Environment variable loading
- Error handling and logging

### Lessons Learned
**What Worked Well:**
- Using `registerAsync()` pattern
- Adding traceId to error messages
- Proper error handling

**What Didn't Work:**
- Checking `process.env` at module load time
- Synchronous module registration with environment variables

**What Would Be Done Differently:**
- Use async registration pattern from the start
- Always use ConfigService for environment variables

### Related Decisions
- Backend Migration to Monorepo Structure (same session)
- Structured Logging Implementation (ongoing)

---

**Last Updated:** 2025-11-22

---

## How to Use This File

### When Making a Decision

1. **Search** this file for similar past decisions
2. **Review** trade-offs and lessons learned
3. **Document** your decision using the template
4. **Reference** this file in code comments when relevant

### When Evaluating Options

1. **Search** this file for similar decisions
2. **Review** alternatives that were considered
3. **Learn** from past mistakes and successes
4. **Apply** lessons learned to current decision

### Entry Template

```markdown
## [Decision Title] - [Date]

### Decision
What decision was made? (1-2 sentences)

### Context
Why was this decision needed? What problem does it solve?
- Problem statement
- Constraints
- Requirements

### Trade-offs
**Pros:**
- Benefit 1
- Benefit 2
- Benefit 3

**Cons:**
- Drawback 1
- Drawback 2
- Drawback 3

### Alternatives Considered
**Alternative 1: [Name]**
- Description
- Why it was rejected

**Alternative 2: [Name]**
- Description
- Why it was rejected

**Alternative 3: [Name]**
- Description
- Why it was rejected

### Rationale
Why was this approach chosen?
- Primary reasons
- Supporting factors
- Key considerations

### Impact
**Short-term:**
- Immediate effects
- Migration requirements
- Breaking changes

**Long-term:**
- Maintenance implications
- Scalability considerations
- Technical debt

**Affected Areas:**
- Components affected
- Services affected
- Teams affected

### Lessons Learned
**What Worked Well:**
- Success factor 1
- Success factor 2

**What Didn't Work:**
- Issue 1
- Issue 2

**What Would Be Done Differently:**
- Improvement 1
- Improvement 2

### Related Decisions
- Link to related decision entries
- Reference to related patterns
- Dependencies on other decisions
```

---

## Engineering Decisions

## Comprehensive Codebase Compliance Audit - 2025-11-22

### Decision
Conducted a comprehensive codebase compliance audit using the VeroField Hybrid Rule System v2.0 to identify structural violations, security issues, and compliance gaps before continued development.

### Context
**Problem:** Newly implemented Cursor rules system (v2.0) requires specific monorepo structure and compliance standards. The codebase had not been audited for compliance with these new rules, creating risk of:
- Structural violations preventing rule enforcement
- Security vulnerabilities (exposed secrets)
- Architectural drift
- Inability to enforce service boundaries

**Constraints:**
- Rules were newly added and structural issues suspected
- Need to identify all violations before continued development
- Must provide actionable remediation plan
- Must prioritize by severity

**Requirements:**
- Complete audit of all rule files (00-14 .mdc files)
- Identify critical, high, medium, and low severity violations
- Provide specific file paths and line numbers
- Create phased remediation plan
- Document findings in compliance report

### Trade-offs
**Pros:**
- Identifies all violations before they compound
- Provides clear remediation path
- Prevents continued development on non-compliant structure
- Documents security risks immediately
- Enables prioritization of fixes

**Cons:**
- Requires significant remediation effort (6+ weeks)
- May delay new feature development
- Reveals extensive technical debt
- Requires immediate action on critical issues

### Alternatives Considered
**Alternative 1: Incremental Audit**
- Description: Audit violations as they are encountered during development
- Why rejected: Would allow violations to compound, making fixes more difficult. Structural violations prevent rule enforcement.

**Alternative 2: Selective Audit**
- Description: Only audit high-risk areas (security, structure)
- Why rejected: Need complete picture to prioritize properly. Medium/low violations may indicate systemic issues.

**Alternative 3: Defer Audit**
- Description: Continue development and audit later
- Why rejected: Rules are newly added and structural issues suspected. Deferring would allow violations to compound.

### Rationale
- Rules were newly added and structural issues suspected
- Need baseline compliance before continued development
- Critical security violations (exposed secrets) require immediate attention
- Structural violations prevent enforcement of architectural rules
- Comprehensive audit provides actionable remediation plan

### Impact
**Short-term:**
- Immediate: Must remove secrets from git and rotate credentials
- Week 1: Create monorepo structure, begin migration planning
- Week 2-3: Migrate backend/ to apps/api/, update imports
- Week 4-5: Fix medium priority violations
- Week 6+: Cleanup and final audit

**Long-term:**
- Enables enforcement of architectural rules
- Prevents cross-service import violations
- Establishes proper monorepo structure
- Improves observability with structured logging
- Reduces technical debt

**Affected Areas:**
- Entire codebase structure (backend/ → apps/api/)
- All imports and references (124+ files)
- Logging infrastructure (287 files)
- Security configuration (secrets rotation)
- Documentation (date updates, naming)

### Lessons Learned
**What Worked Well:**
- Systematic approach using 5-step enforcement pipeline
- Severity-based prioritization
- Specific file paths and line numbers
- Phased remediation plan

**What Didn't Work:**
- N/A - First comprehensive audit

**What Would Be Done Differently:**
- Consider automated compliance checking in CI/CD
- Set up regular compliance audits (quarterly)
- Add pre-commit hooks for common violations

### Related Decisions
- Monorepo structure decision (04-architecture.mdc)
- Security rules implementation (03-security.mdc)
- Observability standards (07-observability.mdc)

### Implementation Pattern
- Follow 5-step enforcement pipeline (01-enforcement.mdc)
- Use severity-based prioritization
- Document findings in compliance reports
- Track remediation in phased plan

---

### Example Decision: Structured Logging Format - 2025-01-27

**Note:** This is an example entry. Replace with actual decisions as they are made.

#### Decision
Standardized on JSON-structured logging with required fields: message, context, traceId, operation, severity, errorCode/rootCause, and timestamp.

#### Context
**Problem:** Inconsistent logging formats across services made it difficult to:
- Search and filter logs
- Correlate errors across services
- Monitor and alert on errors
- Debug production issues

**Constraints:**
- Must work with existing logging infrastructure
- Must be machine-parseable
- Must support distributed tracing
- Must not impact performance significantly

**Requirements:**
- Consistent format across all services
- Support for distributed tracing
- Machine-parseable format
- Human-readable messages

#### Trade-offs
**Pros:**
- Consistent log format enables better tooling
- Machine-parseable format enables automated analysis
- Trace ID support enables distributed tracing
- Structured format enables better filtering and searching

**Cons:**
- Requires migration of existing logs
- Slightly more verbose than simple string logs
- Requires discipline to maintain consistency
- Initial learning curve for developers

#### Alternatives Considered
**Alternative 1: Plain Text Logs**
- Description: Continue using plain text logs with simple formatting
- Why rejected: Not machine-parseable, difficult to filter and search

**Alternative 2: Key-Value Pairs**
- Description: Use key=value format for structured data
- Why rejected: Less flexible than JSON, harder to parse nested structures

**Alternative 3: Multiple Formats**
- Description: Allow different formats for different services
- Why rejected: Inconsistency makes tooling and analysis difficult

#### Rationale
JSON format was chosen because:
- It's machine-parseable and widely supported
- It's flexible enough for complex nested structures
- It's human-readable when formatted
- It integrates well with existing logging infrastructure
- It supports distributed tracing requirements

#### Impact
**Short-term:**
- Requires updating all logging calls
- Requires updating log parsing tools
- May require log format migration

**Long-term:**
- Enables better observability and debugging
- Enables automated log analysis
- Enables better monitoring and alerting
- Reduces time to diagnose issues

**Affected Areas:**
- All backend services
- All frontend applications
- Logging infrastructure
- Monitoring and alerting systems
- Development tooling

#### Lessons Learned
**What Worked Well:**
- Standardizing on a single format early
- Providing clear examples and templates
- Integrating with existing infrastructure

**What Didn't Work:**
- Initially allowing flexibility led to inconsistency
- Not providing enough examples initially
- Migration took longer than expected

**What Would Be Done Differently:**
- Start with stricter enforcement from the beginning
- Provide more comprehensive examples earlier
- Automate format validation in CI/CD

#### Related Decisions
- Distributed Tracing Implementation
- Observability Infrastructure
- Error Handling Standards

---

## Decision Categories

### Architecture Decisions
- System architecture
- Service boundaries
- Data flow patterns
- Integration patterns

### Technology Choices
- Framework selection
- Library selection
- Tool selection
- Infrastructure choices

### Design Patterns
- Code organization
- Component patterns
- Service patterns
- Data patterns

### Performance Decisions
- Optimization strategies
- Caching strategies
- Scaling strategies
- Resource management

### Security Decisions
- Authentication strategies
- Authorization patterns
- Data protection
- Security boundaries

### Operational Decisions
- Deployment strategies
- Monitoring approaches
- Error handling strategies
- Recovery procedures

---

## Invoice Generation from Work Orders Pattern - 2025-11-16

### Decision
Implemented a pattern for automatically generating invoices from completed work orders, allowing users to select work orders and create invoices with pre-populated data.

### Context
**Problem Statement:**
- Manual invoice creation was time-consuming
- Work orders and invoices were disconnected
- Risk of errors when manually entering work order data into invoices

**Requirements:**
- Allow users to select completed work orders
- Auto-populate invoice data from work order information
- Support both single and bulk invoice generation
- Maintain link between work order and invoice

### Trade-offs
**Pros:**
- Reduces manual data entry
- Ensures accuracy by linking work orders to invoices
- Speeds up invoice creation process
- Supports bulk operations for efficiency
- Maintains data integrity through relationships

**Cons:**
- Requires work orders to be completed before invoicing
- Additional UI complexity for work order selection
- Need to handle cases where work order data is incomplete

### Alternatives Considered
**Alternative 1: Automatic Invoice Generation on Work Order Completion**
- Description: Automatically create invoice when work order is marked complete
- Why rejected: Too rigid, doesn't allow for review/editing before invoice creation

**Alternative 2: Manual Invoice Creation with Work Order Reference**
- Description: Users manually create invoice and optionally link to work order
- Why rejected: Doesn't solve the efficiency problem, still requires manual entry

**Alternative 3: Batch Invoice Generation**
- Description: Generate invoices for all completed work orders at once
- Why rejected: Too risky, could create unwanted invoices, no user control

### Rationale
The selected approach balances automation with user control:
- Users can review work orders before generating invoices
- Pre-population reduces errors while allowing customization
- Supports both individual and bulk operations
- Maintains audit trail through work_order_id link

### Implementation Pattern
1. **Component Structure:**
   - `InvoiceGenerator.tsx` - Main component for work order selection
   - Uses `CustomerSearchSelector` for customer selection
   - Filters work orders to show only completed ones
   - Integrates with `InvoiceForm` via `initialData` prop

2. **Data Flow:**
   - Select customer → Fetch work orders → Filter completed → Select work orders → Generate invoice
   - Work order data passed to InvoiceForm via `initialData` prop
   - `work_order_id` included in invoice creation payload

3. **Key Features:**
   - Search and filter work orders
   - Visual selection with checkboxes
   - Bulk generation support
   - Error handling for missing data

### Impact
**Short-term:**
- Immediate efficiency gains in invoice creation
- Reduced data entry errors
- Better user experience

**Long-term:**
- Foundation for automated invoicing workflows
- Enables future features like scheduled invoice generation
- Supports analytics on work order to invoice conversion

**Affected Areas:**
- `InvoiceGenerator.tsx` - New component
- `InvoiceForm.tsx` - Enhanced with `initialData` prop
- `Billing.tsx` - Added new tab
- Work orders API - Used for fetching completed work orders

### Lessons Learned
**What Worked Well:**
- Using `initialData` prop pattern for pre-population
- Reusing existing `CustomerSearchSelector` component
- Clear separation between selection and form editing

**What Didn't Work:**
- Initially tried to auto-generate without user review (too risky)
- Complex state management for bulk operations (simplified)

**What Would Be Done Differently:**
- Could add preview of invoice data before opening form
- Could support template selection during generation
- Could add work order details preview in selection UI

### Related Decisions
- Template-based invoice creation pattern
- Scheduled invoice automation pattern

---

## Template-Based Invoice Creation Pattern - 2025-11-16

### Decision
Implemented a template system for invoice creation, allowing users to save and reuse invoice configurations with predefined items, amounts, and settings.

### Context
**Problem Statement:**
- Repetitive invoice creation for similar services
- Inconsistent invoice formatting across users
- Time wasted recreating common invoice structures

**Requirements:**
- Allow users to create invoice templates
- Support template reuse across multiple invoices
- Enable template search and filtering
- Maintain template versioning and organization

### Trade-offs
**Pros:**
- Significant time savings for recurring invoices
- Ensures consistency in invoice structure
- Reduces errors through standardization
- Supports organization with tags/categories
- Enables bulk invoice creation from templates

**Cons:**
- Additional complexity in UI
- Requires template management overhead
- May not fit all unique invoice scenarios
- Need to handle template updates/versioning

### Alternatives Considered
**Alternative 1: Invoice Copy/Clone Feature**
- Description: Allow users to copy existing invoices
- Why rejected: Less flexible, doesn't support organization or search

**Alternative 2: Service Type Presets**
- Description: Pre-configure service types with default pricing
- Why rejected: Too limited, doesn't handle multi-item invoices

**Alternative 3: Invoice Categories**
- Description: Group invoices by category with default settings
- Why rejected: Not flexible enough for varying invoice structures

### Rationale
Template system provides the best balance:
- Flexible enough for various invoice types
- Organized with tags and categories
- Searchable and filterable
- Reusable across different customers
- Foundation for scheduled invoice automation

### Implementation Pattern
1. **Component Structure:**
   - `InvoiceTemplates.tsx` - Main template management component
   - Template list with preview cards
   - Search and tag-based filtering
   - Apply template functionality

2. **Template Data Structure:**
   ```typescript
   interface InvoiceTemplate {
     id: string;
     name: string;
     description?: string;
     items: InvoiceTemplateItem[];
     tags?: string[];
   }
   ```

3. **Key Features:**
   - Template CRUD operations (UI ready, backend pending)
   - Template preview with items and totals
   - Tag-based organization
   - Search functionality
   - Apply template to create new invoice

### Impact
**Short-term:**
- Faster invoice creation for common scenarios
- Improved consistency
- Better organization

**Long-term:**
- Foundation for automated invoice generation
- Enables scheduled invoice creation
- Supports invoice analytics by template type
- Can integrate with service agreements

**Affected Areas:**
- `InvoiceTemplates.tsx` - New component
- `InvoiceForm.tsx` - Can be enhanced to use templates
- Backend API - Template management endpoints needed

### Lessons Learned
**What Worked Well:**
- Card-based template preview UI
- Tag system for organization
- Search and filter functionality

**What Didn't Work:**
- Initially tried to auto-apply templates (too rigid)
- Complex template editor (deferred to future)

**What Would Be Done Differently:**
- Could add template versioning
- Could support template inheritance
- Could add template usage analytics

### Related Decisions
- Invoice generation from work orders pattern
- Scheduled invoice automation pattern

---

## Scheduled Invoice Automation Pattern - 2025-11-16

### Decision
Implemented a scheduling system for automated invoice generation, allowing users to create recurring and one-time scheduled invoices that are automatically generated at specified intervals.

### Context
**Problem Statement:**
- Manual invoice creation for recurring services is repetitive
- Risk of missing invoice generation dates
- Inconsistent timing of invoice creation
- Time wasted on routine invoice tasks

**Requirements:**
- Support recurring invoice schedules (daily, weekly, monthly, quarterly, yearly)
- Support one-time scheduled invoices
- Allow schedule activation/deactivation
- Track next run dates
- Support schedule management (create, edit, delete)

### Trade-offs
**Pros:**
- Eliminates manual work for recurring invoices
- Ensures timely invoice generation
- Reduces human error
- Enables predictable cash flow
- Supports various scheduling frequencies

**Cons:**
- Requires backend automation infrastructure
- Need to handle schedule conflicts
- Complexity in schedule management
- Risk of generating unwanted invoices
- Requires monitoring and error handling

### Alternatives Considered
**Alternative 1: Manual Reminder System**
- Description: Send reminders to users to create invoices
- Why rejected: Doesn't solve the automation need, still requires manual work

**Alternative 2: Calendar-Based Scheduling**
- Description: Use calendar events to trigger invoice generation
- Why rejected: Too complex, requires external calendar integration

**Alternative 3: Service Agreement Auto-Invoicing**
- Description: Automatically invoice based on service agreement terms
- Why rejected: Too rigid, doesn't allow for one-time or custom schedules

### Rationale
Scheduled invoice system provides:
- Flexibility for various scheduling needs
- User control through activation/deactivation
- Foundation for future automation features
- Integration with templates and work orders
- Clear visibility into upcoming invoice generation

### Implementation Pattern
1. **Component Structure:**
   - `InvoiceScheduler.tsx` - Main scheduling component
   - Schedule list with status indicators
   - Search and status filtering
   - Toggle active/inactive functionality

2. **Schedule Data Structure:**
   ```typescript
   interface ScheduledInvoice {
     id: string;
     customer_id: string;
     schedule_type: 'recurring' | 'one-time';
     frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
     start_date: string;
     end_date?: string;
     next_run_date: string;
     is_active: boolean;
     template_id?: string;
     amount: number;
   }
   ```

3. **Key Features:**
   - Schedule CRUD operations (UI ready, backend pending)
   - Status management (active/inactive)
   - Next run date tracking
   - Frequency selection
   - Integration with templates

### Impact
**Short-term:**
- UI ready for schedule management
- Foundation for automation backend
- User can view and manage schedules

**Long-term:**
- Automated invoice generation
- Reduced manual work
- Predictable revenue recognition
- Integration with payment processing
- Analytics on scheduled vs manual invoices

**Affected Areas:**
- `InvoiceScheduler.tsx` - New component
- Backend API - Scheduling endpoints needed
- Background jobs - Invoice generation automation needed
- `InvoiceTemplates.tsx` - Can be used with schedules

### Lessons Learned
**What Worked Well:**
- Clear status indicators (active/inactive)
- Next run date visibility
- Flexible frequency options

**What Didn't Work:**
- Initially tried to auto-generate on schedule (too risky without review)
- Complex schedule conflict resolution (deferred)

**What Would Be Done Differently:**
- Could add schedule templates
- Could support conditional scheduling
- Could add schedule preview before activation
- Could integrate with calendar view

### Related Decisions
- Invoice generation from work orders pattern
- Template-based invoice creation pattern

---

## Contributing

When adding a new decision:

1. Use the template above
2. Be thorough about trade-offs and alternatives
3. Document lessons learned honestly
4. Link to related decisions
5. Update the decision categories if needed

---

## Resource Timeline View Component - 2025-11-17

### Decision
Implemented a Resource Timeline View component for the Job Scheduling system, providing a visual timeline interface where technicians are displayed as lanes and jobs are shown as draggable/resizable events on a time-based grid.

### Context
**Problem Statement:**
- Users needed a visual way to see all jobs scheduled across multiple technicians on a single timeline
- Existing calendar view didn't provide the resource-centric perspective needed for scheduling optimization
- Need to visualize job assignments, overlaps, and time slots across the technician team
- Required ability to quickly navigate dates, zoom levels, and view job details

**Constraints:**
- Must integrate with existing React Query data fetching patterns
- Must use existing UI components (Button, Card, Dialog) for consistency
- Must handle large numbers of technicians and jobs efficiently
- Must support date navigation and zoom controls
- Must provide error handling and loading states

**Requirements:**
- Display technicians as horizontal lanes
- Display jobs as events positioned by time
- Support date navigation (previous/next/today)
- Support zoom levels (day/week/month views)
- Display job details in dialog on click
- Support job status updates
- Handle API errors gracefully
- Provide loading states

### Trade-offs
**Pros:**
- Provides intuitive visual representation of resource allocation
- Enables quick identification of scheduling conflicts
- Supports efficient date navigation and zoom controls
- Integrates seamlessly with existing scheduling system
- Uses established React Query patterns for data fetching
- Comprehensive error handling and user feedback

**Cons:**
- Complex rendering logic for positioning jobs on timeline
- Performance considerations with large datasets (many technicians/jobs)
- Requires careful state management for zoom levels and date ranges
- Additional component to maintain

### Alternatives Considered
**Alternative 1: Enhanced Calendar View**
- Description: Extend existing calendar view with resource lanes
- Why rejected: Calendar view is date-centric, not resource-centric. Would require significant refactoring.

**Alternative 2: List-Based Resource View**
- Description: Show technicians in a list with jobs listed below each
- Why rejected: Doesn't provide the visual timeline perspective needed for scheduling optimization.

**Alternative 3: Third-Party Timeline Library**
- Description: Use a library like react-big-schedule or timeline libraries
- Why rejected: Want to maintain full control over UI/UX and avoid external dependencies. Custom implementation allows better integration with existing design system.

### Rationale
The Resource Timeline View provides:
- Visual resource allocation at a glance
- Efficient scheduling conflict identification
- Intuitive date navigation and zoom controls
- Seamless integration with existing job management system
- Foundation for future drag-and-drop scheduling features
- Consistent UI/UX with rest of application

### Implementation Pattern
1. **Component Structure:**
   - `ResourceTimeline.tsx` - Main timeline component
   - Uses React Query for data fetching (`useQuery` for technicians and jobs)
   - Uses React Query mutations for job updates (`useMutation`)
   - State management for view date, zoom level, selected job

2. **Data Flow:**
   - Fetch technicians list on mount
   - Fetch jobs for current date range based on zoom level
   - Process jobs into timeline format (calculate positions, overlaps)
   - Display jobs as positioned elements in technician lanes

3. **Key Features:**
   - Date navigation (previous/next/today buttons)
   - Zoom controls (zoom in/out with day/week/month views)
   - Job detail dialog on click
   - Job status update via mutation
   - Error handling with user-friendly messages
   - Loading states with spinner

4. **Error Handling:**
   - All API calls wrapped in try/catch
   - Errors logged with structured logging and trace propagation
   - User-friendly error messages displayed
   - Error boundary for component-level error handling

5. **Observability:**
   - All logs include traceId, spanId, and requestId for distributed tracing
   - Structured logging with context identifiers
   - Error patterns documented in `docs/error-patterns.md`

### Affected Areas
- `frontend/src/components/scheduling/ResourceTimeline.tsx` - New component
- `frontend/src/components/scheduling/index.ts` - Export added
- `frontend/src/routes/Scheduler.tsx` - Integration with new timeline tab
- `frontend/src/components/scheduling/__tests__/ResourceTimeline.test.tsx` - Comprehensive test suite (63 tests)
- `docs/error-patterns.md` - Error pattern documented (REACT_QUERY_API_FETCH_ERROR)
- `.cursor/BUG_LOG.md` - Bug logged for error handling issue fixed during implementation

### Lessons Learned
**What Worked Well:**
- React Query integration for efficient data fetching and caching
- Modular component structure with clear separation of concerns
- Comprehensive error handling and user feedback
- Trace propagation for observability
- Extensive test coverage (63 tests including error scenarios)

**What Would Be Done Differently:**
- Could add drag-and-drop functionality for rescheduling jobs
- Could add conflict detection visualization
- Could add bulk operations (assign multiple jobs)
- Could optimize rendering for very large datasets (virtualization)
- Could add keyboard navigation for accessibility

### Related Decisions
- React Query data fetching pattern
- Error handling and structured logging pattern
- UI component consistency (Button, Card, Dialog)
- Trace propagation for observability

---

**Last Updated:** 2025-11-17


---

## CI Automation Suite Implementation - 2025-11-17

### Decision
Implement comprehensive CI automation suite for REWARD_SCORE system using Python scripts and GitHub Actions, with metrics dashboard for visualization.

### Context
**Problem Statement:**
- Need automated code quality scoring for all Pull Requests
- Want to reduce manual review burden and ensure consistency
- Need metrics and dashboard for tracking code quality trends over time
- Want to automate pattern extraction for high-quality code
- Need automated detection of anti-patterns and compliance violations

**Constraints:**
- Must work within GitHub Actions ecosystem
- Should not require external services or databases
- Must be maintainable and extensible
- Should provide actionable feedback to developers

**Requirements:**
- Automatic REWARD_SCORE computation for every PR
- Pattern extraction for high-scoring PRs (score  6)
- Anti-pattern detection for low-scoring PRs (score  0)
- File organization validation
- Documentation date compliance checking
- Trace ID propagation verification
- Silent failure detection
- Pattern learning compliance validation
- Metrics dashboard with historical trends

### Trade-offs
**Pros:**
- Fully automated code quality assessment
- Consistent scoring across all PRs
- Historical metrics tracking
- Automated pattern extraction reduces manual work
- Early detection of anti-patterns and compliance issues
- Dashboard provides visibility into code quality trends
- No external dependencies (uses GitHub Actions and git)
- JSON-based metrics storage (simple, git-trackable)

**Cons:**
- Python scripts require Python runtime in CI
- Metrics stored in git (could bloat repository over time)
- Dashboard requires manual deployment or GitHub Pages
- Scoring logic complexity may need refinement over time
- Additional CI workflow overhead (parallel execution helps)

### Alternatives Considered
**Alternative 1: External CI Service (CircleCI, Jenkins)**
- Description: Use external CI service with custom plugins
- Why rejected: Adds external dependency, requires additional infrastructure, harder to maintain

**Alternative 2: Database-Backed Metrics Storage**
- Description: Store metrics in PostgreSQL or other database
- Why rejected: Adds complexity, requires database infrastructure, harder to version control

**Alternative 3: Custom Backend Service**
- Description: Build dedicated backend service for scoring and metrics
- Why rejected: Overkill for metrics collection, adds deployment complexity, requires additional infrastructure

**Alternative 4: Third-Party Code Quality Tools**
- Description: Use tools like CodeClimate, SonarQube
- Why rejected: Want full control over scoring algorithm, want to integrate with internal patterns, cost considerations

### Rationale
The CI automation suite provides:
- Automated code quality assessment without manual intervention
- Consistent scoring based on defined rubric
- Historical tracking of code quality trends
- Automated pattern extraction for reusable code patterns
- Early detection of anti-patterns and compliance violations
- Dashboard visualization for stakeholders
- Simple implementation using existing GitHub Actions infrastructure
- Git-based metrics storage (version controlled, no external dependencies)

### Implementation Pattern
1. **Script Architecture:**
   - Python scripts in .cursor/scripts/ for all automation logic
   - Each script is self-contained with argparse for CLI interface
   - JSON input/output for interoperability
   - Proper error handling with specific exception types

2. **Workflow Structure:**
   - swarm_compute_reward_score.yml - Main scoring workflow
   - swarm_suggest_patterns.yml - Pattern extraction (triggers on high scores)
   - swarm_log_anti_patterns.yml - Anti-pattern detection (triggers on low scores)
   - Validation workflows for compliance checking
   - update_metrics_dashboard.yml - Metrics collection and dashboard update

3. **Scoring Algorithm:**
   - Loads rubric from .cursor/reward_rubric.yaml
   - Evaluates tests, bug fixes, docs, performance, security
   - Applies penalties for failing CI, missing tests, regressions
   - Generates PR comments with breakdown

4. **Metrics Collection:**
   - Collects scores from PR artifacts
   - Aggregates into JSON file (docs/metrics/reward_scores.json)
   - Calculates distributions, trends, averages
   - Dashboard reads from JSON file

5. **Dashboard:**
   - Static HTML/CSS/JS (no backend needed)
   - Uses Chart.js for visualization
   - Reads metrics from JSON file
   - Auto-refreshes every 5 minutes

6. **Error Handling:**
   - All scripts use try/except with specific exception types
   - Errors logged to stderr (captured by CI)
   - Graceful fallbacks for missing data
   - No silent failures

### Affected Areas
- .cursor/scripts/ - 9 new Python scripts
- .github/workflows/ - 10 new/modified workflows
- docs/metrics/ - Dashboard files and documentation
- .cursor/reward_rubric.yaml - Scoring rubric (existing, enhanced)
- .github/workflows/ci.yml - Modified to upload coverage artifacts

### Lessons Learned
**What Worked Well:**
- Python scripts are portable and maintainable
- GitHub Actions workflow_run events enable workflow chaining
- JSON-based metrics storage is simple and git-trackable
- Chart.js provides good visualization without backend
- Structured error handling prevents silent failures

**What Would Be Done Differently:**
- Could add unit tests for Python scripts
- Could add integration tests for workflows
- Could add performance monitoring for script execution
- Could add alerting for dashboard data staleness
- Could optimize metrics file size over time (pruning old data)

### Related Decisions
- Structured logging and trace propagation pattern
- Error handling and resilience patterns
- File organization standards
- Documentation date compliance
- Pattern learning and anti-pattern detection

---

**Last Updated:** 2025-11-17
