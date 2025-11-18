# Engineering Decisions Knowledge Base

**Purpose:** This file serves as a living knowledge base of engineering decisions, trade-offs, alternatives considered, and lessons learned. Every significant architectural or design decision should be documented here.                      

**Last Updated:** 2025-11-18

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

---

## Billing Automation API Integration - 2025-11-18

### Decision
Implemented backend API integration for Invoice Templates, Schedules, and Reminder History to complete the billing automation system. Added Prisma models, DTOs, service methods, controller endpoints, and frontend API client methods.

### Context
The billing system frontend components (InvoiceTemplates, InvoiceScheduler, InvoiceReminders) were completed but lacked backend integration. This feature completes the remaining 60% of the billing & invoicing system by providing:
- Invoice template management (CRUD operations)
- Automated invoice scheduling (recurring and one-time)
- Reminder history tracking and retrieval

### Trade-offs
**Pros:**
- Complete end-to-end billing automation functionality
- Reusable invoice templates for faster invoice creation
- Automated scheduling reduces manual work
- Reminder history provides audit trail
- Structured logging ensures observability compliance
- Tenant isolation maintained through RLS policies

**Cons:**
- Additional database tables increase schema complexity
- More API endpoints to maintain
- Frontend components require API integration testing
- Schedule execution logic (cron jobs) not yet implemented (future work)

### Alternatives Considered
**Alternative 1: External Scheduling Service (Cron-as-a-Service)**
- Description: Use external service like AWS EventBridge, Google Cloud Scheduler
- Why rejected: Want full control over scheduling logic, avoid external dependencies, keep costs low

**Alternative 2: In-Memory Scheduling (Node-cron)**
- Description: Use node-cron library to run schedules in the application process
- Why rejected: Not scalable across multiple instances, requires coordination, risk of lost schedules on restart

**Alternative 3: Database-Driven Scheduling (Current Approach)**
- Description: Store schedules in database, use background worker to process them
- Why accepted: Scalable, persistent, can be processed by any worker instance, easy to query and manage

### Rationale
The database-driven approach provides:
- Persistence: Schedules survive application restarts
- Scalability: Multiple worker instances can process schedules
- Queryability: Easy to view, filter, and manage schedules via API
- Auditability: Full history of schedule executions and reminders
- Tenant isolation: RLS policies ensure data security

### Implementation Pattern
1. **Database Schema:**
   - InvoiceTemplate - Stores reusable invoice templates with items and tags
   - InvoiceSchedule - Stores scheduled invoices (recurring/one-time) with frequency and next run date
   - InvoiceReminderHistory - Tracks all reminder communications sent

2. **Backend Architecture:**
   - DTOs for all operations (create, update, response)
   - Service methods with structured logging and error handling
   - REST endpoints following existing billing API patterns
   - Tenant isolation enforced at service layer

3. **Frontend Integration:**
   - React Query for data fetching and mutations
   - API client methods in enhanced-api.ts
   - Form handling with validation
   - User feedback via toast notifications

4. **Logging Compliance:**
   - All new methods use StructuredLoggerService
   - Includes context, operation, errorCode, rootCause
   - Trace propagation ready (traceId/spanId/requestId via request context)

### Affected Areas
- ackend/prisma/schema.prisma - 3 new models with relations
- ackend/src/billing/dto/ - 7 new DTO files
- ackend/src/billing/billing.service.ts - 10 new service methods
- ackend/src/billing/billing.controller.ts - 9 new endpoints
- ackend/src/billing/billing.module.ts - Added StructuredLoggerService
- rontend/src/lib/enhanced-api.ts - 9 new API client methods
- rontend/src/components/billing/ - 3 components updated to use API

### Lessons Learned
**What Worked Well:**
- Prisma schema changes integrate seamlessly with existing models
- DTO pattern provides type safety and validation
- Structured logging ensures compliance with observability rules
- React Query mutations simplify frontend state management
- Tenant isolation pattern consistent across all new methods

**What Would Be Done Differently:**
- Could add integration tests for schedule execution logic
- Could add unit tests for service methods
- Could add validation for schedule frequency/date combinations
- Could add rate limiting for reminder sending
- Could add webhook notifications for schedule executions

### Related Decisions
- Structured logging and trace propagation pattern
- Error handling and resilience patterns
- Tenant isolation and RLS policies
- Frontend API client patterns
- React Query for state management

### Future Work
- Implement background worker for schedule execution
- Add schedule execution history tracking
- Add schedule conflict detection
- Add bulk schedule operations
- Add schedule template system
- Add reminder automation rules

---

## Automated Workflow Validation in CI - 2025-11-17

### Decision
Implemented automated workflow validation in CI pipeline that runs on every PR to prevent workflow format mismatches, broken triggers, and artifact naming inconsistencies before merge.

### Context
**Problem Statement:**
- Workflow format mismatches occurred when PR branches had new formats but main branch had old formats
- Broken workflow_run dependencies caused cascading workflow failures
- Artifact naming inconsistencies prevented artifact downloads
- No validation before merge led to production issues

**Constraints:**
- Must not slow down CI pipeline significantly
- Must provide clear error messages
- Must block merge on critical violations
- Must validate all workflow files

**Requirements:**
- Validate workflow trigger configuration
- Validate workflow_run dependencies exist
- Validate artifact naming consistency
- Validate PR trigger types
- Block merge on critical violations

### Trade-offs
**Pros:**
- Prevents workflow format mismatches before merge
- Catches broken dependencies early
- Ensures artifact naming consistency
- Reduces production failures
- Provides clear error messages
- Fast validation (< 5 seconds)

**Cons:**
- Adds ~5 seconds to CI pipeline
- Requires maintaining validation script
- May block merges temporarily (but prevents worse issues)

### Alternatives Considered
**Alternative 1: Manual Validation**
- Description: Rely on developers to manually run validation script
- Why rejected: Human error, easy to forget, inconsistent enforcement

**Alternative 2: Pre-commit Hook Only**
- Description: Run validation only in pre-commit hook
- Why rejected: Can be bypassed, not all developers use pre-commit hooks

**Alternative 3: CI Validation (Current Approach)**
- Description: Run validation in CI pipeline on every PR
- Why accepted: Cannot be bypassed, consistent enforcement, blocks merge on violations

### Rationale
CI validation provides:
- **Enforcement:** Cannot be bypassed, ensures all PRs are validated
- **Early Detection:** Catches issues before merge, prevents production failures
- **Consistency:** All PRs validated the same way
- **Clear Feedback:** Provides actionable error messages in PR comments

### Implementation Pattern
1. **Validation Script:** `.cursor/scripts/validate_workflow_triggers.py`
   - Validates all workflow files in `.github/workflows/`
   - Checks for `on:` sections, trigger types, dependencies, artifacts
   - Returns structured violation reports

2. **CI Integration:** `.github/workflows/ci.yml`
   - Added `workflow-validation` job
   - Runs on all PRs
   - Blocks merge on critical violations
   - Provides clear error messages

3. **Validation Checks:**
   - Missing `on:` sections
   - Incorrect PR trigger types
   - Missing workflow_run dependencies
   - Artifact naming inconsistencies
   - Reward.json format usage

### Impact
**Short-term:**
- All PRs now validated before merge
- Workflow format mismatches prevented
- Broken dependencies caught early
- Clear error messages in PR comments

**Long-term:**
- Reduced production failures
- Better workflow quality
- Easier maintenance
- Consistent workflow patterns

**Affected Areas:**
- `.github/workflows/ci.yml` - Added validation job
- `.cursor/scripts/validate_workflow_triggers.py` - Enhanced validation
- All workflow files - Now validated automatically

### Lessons Learned
**What Worked Well:**
- Fast validation (< 5 seconds)
- Clear error messages help developers fix issues quickly
- Blocking merge on critical violations prevents production issues
- Structured violation reports easy to parse

**What Would Be Done Differently:**
- Could add auto-fix suggestions for common violations
- Could add validation for workflow syntax errors
- Could add validation for workflow permissions

### Related Decisions
- CI automation and workflow requirements (`.cursor/rules/ci-automation.md`)
- Error handling and resilience patterns
- Structured logging and observability

---

## Automated Retry Mechanism for Artifact Downloads - 2025-11-17

### Decision
Implemented automated retry mechanism with exponential backoff for artifact downloads to recover from transient failures and improve reliability of metrics collection.

### Context
**Problem Statement:**
- Artifact downloads sometimes fail due to transient network issues
- Single failures caused permanent failures in metrics collection
- No retry mechanism led to lost metrics data
- Manual intervention required to recover from failures

**Constraints:**
- Must not cause infinite retries
- Must have reasonable timeout
- Must log all retry attempts
- Must work in GitHub Actions environment

**Requirements:**
- Retry failed artifact downloads
- Exponential backoff between retries
- Max retry limit (3 attempts)
- Clear logging of retry attempts
- Graceful failure after max retries

### Trade-offs
**Pros:**
- Recovers from transient failures automatically
- Improves reliability of metrics collection
- Reduces manual intervention
- Better error messages for debugging
- Configurable retry parameters

**Cons:**
- Adds delay to workflow execution (up to ~20 seconds)
- May mask underlying issues if retries always succeed
- Requires maintaining retry logic

### Alternatives Considered
**Alternative 1: No Retry (Previous Approach)**
- Description: Fail immediately on artifact download failure
- Why rejected: Too many transient failures, lost metrics data

**Alternative 2: Fixed Delay Retry**
- Description: Retry with fixed delay (e.g., 5 seconds)
- Why rejected: Less efficient than exponential backoff, may retry too quickly

**Alternative 3: Exponential Backoff Retry (Current Approach)**
- Description: Retry with exponential backoff (1s, 2s, 4s, 8s)
- Why accepted: Efficient, gives system time to recover, standard practice

### Rationale
Exponential backoff retry provides:
- **Efficiency:** Gives system time to recover between retries
- **Reliability:** Recovers from transient failures automatically
- **Standard Practice:** Common pattern for handling transient failures
- **Configurable:** Can adjust retry parameters as needed

### Implementation Pattern
1. **Retry Script:** `.cursor/scripts/retry_artifact_download.py`
   - Implements exponential backoff (1s, 2s, 4s, 8s)
   - Max 3 retry attempts
   - Logs all retry attempts
   - Graceful failure after max retries

2. **Workflow Integration:** `.github/workflows/update_metrics_dashboard.yml`
   - Uses retry script for artifact downloads
   - Continues workflow even if artifact download fails (with warning)
   - Better error messages for debugging

3. **Schema Validation:** `.cursor/schemas/reward_schema.json`
   - JSON schema for reward.json validation
   - Ensures data format consistency
   - Prevents format mismatches

### Impact
**Short-term:**
- Automatic recovery from transient failures
- Improved reliability of metrics collection
- Better error messages for debugging
- Reduced manual intervention

**Long-term:**
- More reliable metrics collection
- Better data quality
- Reduced operational overhead
- Improved system resilience

**Affected Areas:**
- `.cursor/scripts/retry_artifact_download.py` - New retry script
- `.github/workflows/update_metrics_dashboard.yml` - Added retry logic
- `.cursor/schemas/reward_schema.json` - New schema file
- `.cursor/scripts/collect_metrics.py` - Added schema validation

### Lessons Learned
**What Worked Well:**
- Exponential backoff recovers from most transient failures
- Clear logging helps debug issues
- Schema validation prevents format mismatches
- Configurable parameters allow tuning

**What Would Be Done Differently:**
- Could add retry for other operations (not just artifact downloads)
- Could add metrics for retry success rates
- Could add alerting for persistent failures

### Related Decisions
- Error handling and resilience patterns
- Structured logging and observability
- Automated state recovery for failed PRs

---

## Automated Health Monitoring for Reward System - 2025-11-17

### Decision
Implemented automated health monitoring workflow that runs every 20 minutes to proactively detect system failures, stale metrics, and configuration issues in the reward system.

### Context
**Problem Statement:**
- System failures discovered only after impact (dashboard not updating)
- No proactive monitoring led to delayed issue detection
- Stale metrics data not detected automatically
- Configuration issues discovered only at runtime

**Constraints:**
- Must not overload system with checks
- Must provide actionable alerts
- Must run frequently enough to catch issues early
- Must work in GitHub Actions environment

**Requirements:**
- Monitor workflow success rates
- Check metrics file freshness
- Validate workflow dependencies
- Detect configuration issues
- Provide clear health status

### Trade-offs
**Pros:**
- Proactive failure detection
- Early warning for issues
- System health visibility
- Automated monitoring
- Clear health status

**Cons:**
- Adds scheduled workflow (runs every 20 minutes)
- Requires maintaining health check logic
- May generate false positives if thresholds too strict

### Alternatives Considered
**Alternative 1: Manual Monitoring**
- Description: Rely on developers to manually check system health
- Why rejected: Human error, easy to miss issues, inconsistent monitoring

**Alternative 2: External Monitoring Service**
- Description: Use external service like Datadog, New Relic
- Why rejected: Additional cost, external dependency, want self-contained solution

**Alternative 3: Scheduled Health Check Workflow (Current Approach)**
- Description: Scheduled GitHub Actions workflow that checks system health
- Why accepted: Self-contained, no external dependencies, integrated with existing workflows

### Rationale
Scheduled health check provides:
- **Proactive Detection:** Catches issues before they impact users
- **Self-Contained:** No external dependencies, uses existing infrastructure
- **Integrated:** Works with existing GitHub Actions workflows
- **Actionable:** Provides clear health status and failure reasons

### Implementation Pattern
1. **Health Check Script:** `.cursor/scripts/reward_system_health_check.py`
   - Verifies workflow success rates
   - Checks metrics file freshness
   - Validates workflow dependencies
   - Detects configuration issues

2. **Scheduled Workflow:** `.github/workflows/reward_system_health_check.yml`
   - Runs every 20 minutes
   - Can be triggered manually via workflow_dispatch
   - Logs health status
   - Alerts on critical issues

3. **Health Checks:**
   - Latest workflow run success
   - Workflow run freshness (within threshold)
   - Metrics file existence and freshness
   - Configuration validation

### Impact
**Short-term:**
- Proactive failure detection
- Early warning for issues
- System health visibility
- Reduced time to detect issues

**Long-term:**
- Better system reliability
- Reduced operational overhead
- Improved monitoring capabilities
- Better data quality

**Affected Areas:**
- `.cursor/scripts/reward_system_health_check.py` - New health check script
- `.github/workflows/reward_system_health_check.yml` - New scheduled workflow
- All reward system workflows - Now monitored automatically

### Lessons Learned
**What Worked Well:**
- Proactive detection catches issues early
- Clear health status helps debugging
- Scheduled checks provide consistent monitoring
- Manual trigger allows on-demand health checks

**What Would Be Done Differently:**
- Could add alerting (Slack, email) for critical failures
- Could add health dashboard UI
- Could add metrics for health check trends
- Could add more granular health checks

### Related Decisions
- Automated error aggregation
- Structured logging and observability
- Error handling and resilience patterns

---

## Automated Error Aggregation for Reward System - 2025-11-17

### Decision
Implemented automated error aggregation workflow that collects errors from all reward system workflows, categorizes them, and publishes them for dashboard use and trend analysis.

### Context
**Problem Statement:**
- Errors logged but not aggregated or surfaced
- No visibility into error patterns and trends
- Difficult to identify recurring issues
- No centralized error tracking

**Constraints:**
- Must not overload system with aggregation
- Must provide actionable insights
- Must work with existing workflows
- Must be maintainable

**Requirements:**
- Aggregate errors from all reward workflows
- Categorize errors by type
- Track error frequency and trends
- Publish error log for dashboard use
- Provide error visibility

### Trade-offs
**Pros:**
- Centralized error visibility
- Error trend analysis
- Proactive issue detection
- Better debugging information
- Historical error tracking

**Cons:**
- Adds scheduled workflow (runs hourly)
- Requires maintaining aggregation logic
- Error log file grows over time (limited to 25 entries)

### Alternatives Considered
**Alternative 1: Manual Error Review**
- Description: Rely on developers to manually review workflow logs
- Why rejected: Time-consuming, easy to miss patterns, inconsistent review

**Alternative 2: External Error Tracking Service**
- Description: Use external service like Sentry, Rollbar
- Why rejected: Additional cost, external dependency, want self-contained solution

**Alternative 3: Automated Error Aggregation (Current Approach)**
- Description: Scheduled workflow that aggregates errors and publishes log file
- Why accepted: Self-contained, no external dependencies, integrated with existing workflows

### Rationale
Automated error aggregation provides:
- **Visibility:** Centralized view of all errors
- **Trends:** Track error frequency and patterns over time
- **Proactive:** Identify recurring issues early
- **Self-Contained:** No external dependencies
- **Integrated:** Works with existing GitHub Actions workflows

### Implementation Pattern
1. **Error Aggregation Script:** `.cursor/scripts/aggregate_reward_errors.py`
   - Collects errors from all reward workflows
   - Categorizes errors by type
   - Tracks error frequency
   - Generates error log

2. **Scheduled Workflow:** `.github/workflows/reward_error_aggregation.yml`
   - Runs hourly and on workflow_run completion
   - Can be triggered manually via workflow_dispatch
   - Updates error log file
   - Commits error log to repository

3. **Error Log:** `docs/metrics/reward_error_log.json`
   - Centralized error tracking
   - Error categorization
   - Frequency tracking
   - Trend analysis

### Impact
**Short-term:**
- Centralized error visibility
- Error trend analysis
- Proactive issue detection
- Better debugging information

**Long-term:**
- Better system reliability
- Reduced operational overhead
- Improved monitoring capabilities
- Better error prevention

**Affected Areas:**
- `.cursor/scripts/aggregate_reward_errors.py` - New aggregation script
- `.github/workflows/reward_error_aggregation.yml` - New scheduled workflow
- `docs/metrics/reward_error_log.json` - New error log file
- All reward system workflows - Errors now aggregated

### Lessons Learned
**What Worked Well:**
- Centralized error visibility helps identify patterns
- Error categorization makes analysis easier
- Trend tracking helps predict issues
- Self-contained solution avoids external dependencies

**What Would Be Done Differently:**
- Could add error dashboard UI
- Could add alerting (Slack, email) for critical errors
- Could add error correlation analysis
- Could add error resolution tracking

### Related Decisions
- Automated health monitoring
- Structured logging and observability
- Error handling and resilience patterns

---

## Automated State Recovery for Failed Reward Workflows - 2025-11-17

### Decision
Implemented automated state recovery system that tracks failed reward workflow runs and automatically retries them with exponential backoff to ensure all PRs eventually get scored.

### Context
**Problem Statement:**
- Failed reward computations not automatically retried
- Manual intervention required to retry failed PRs
- Lost metrics data for failed PRs
- No tracking of retry attempts

**Constraints:**
- Must not cause infinite retries
- Must have reasonable retry limit
- Must track retry attempts
- Must work in GitHub Actions environment

**Requirements:**
- Track failed workflow runs
- Automatically retry failed runs
- Exponential backoff for retries
- Max retry limit (3 attempts)
- Track retry success rates

### Trade-offs
**Pros:**
- Automatic retry of failed PRs
- No manual intervention needed
- Ensures all PRs eventually get scored
- Tracks retry attempts
- Improves metrics collection rate

**Cons:**
- Adds scheduled workflow (runs every 30 minutes)
- May retry PRs that will always fail
- Requires maintaining retry logic

### Alternatives Considered
**Alternative 1: Manual Retry (Previous Approach)**
- Description: Rely on developers to manually retry failed workflows
- Why rejected: Time-consuming, easy to forget, inconsistent retry

**Alternative 2: Immediate Retry on Failure**
- Description: Retry immediately when workflow fails
- Why rejected: May retry too quickly, doesn't give system time to recover

**Alternative 3: Scheduled Retry with Exponential Backoff (Current Approach)**
- Description: Scheduled workflow that retries failed runs with exponential backoff
- Why accepted: Gives system time to recover, prevents infinite retries, standard practice

### Rationale
Scheduled retry with exponential backoff provides:
- **Reliability:** Ensures all PRs eventually get scored
- **Efficiency:** Gives system time to recover between retries
- **Safety:** Max retry limit prevents infinite retries
- **Standard Practice:** Common pattern for handling transient failures

### Implementation Pattern
1. **Retry Script:** `.cursor/scripts/retry_reward_workflows.py`
   - Lists failed workflow runs
   - Filters by retry attempt count
   - Retries failed runs
   - Tracks retry attempts

2. **Scheduled Workflow:** `.github/workflows/retry_failed_reward_runs.yml`
   - Runs every 30 minutes
   - Can be triggered manually via workflow_dispatch
   - Retries failed reward computations
   - Updates state after each retry

3. **State Tracking:** `.cursor/cache/failed_prs.json` (gitignored)
   - Tracks failed PRs
   - Stores retry attempt counts
   - Removes successful retries

### Impact
**Short-term:**
- Automatic retry of failed PRs
- No manual intervention needed
- Improved metrics collection rate
- Better data completeness

**Long-term:**
- More reliable metrics collection
- Better data quality
- Reduced operational overhead
- Improved system resilience

**Affected Areas:**
- `.cursor/scripts/retry_reward_workflows.py` - New retry script
- `.github/workflows/retry_failed_reward_runs.yml` - New scheduled workflow
- `.cursor/cache/failed_prs.json` - New state tracking file (gitignored)

### Lessons Learned
**What Worked Well:**
- Scheduled retry ensures all PRs eventually get scored
- Exponential backoff gives system time to recover
- Max retry limit prevents infinite retries
- State tracking helps monitor retry success rates

**What Would Be Done Differently:**
- Could add retry success rate metrics
- Could add alerting for persistent failures
- Could add retry reason tracking
- Could add retry delay configuration

### Related Decisions
- Automated retry mechanism for artifact downloads
- Error handling and resilience patterns
- Structured logging and observability

---

**Last Updated:** 2025-11-17
