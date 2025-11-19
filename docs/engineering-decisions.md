# Engineering Decisions Knowledge Base

**Purpose:** This file serves as a living knowledge base of engineering decisions, trade-offs, alternatives considered, and lessons learned. Every significant architectural or design decision should be documented here.

**Last Updated:** 2025-11-17

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

## Breadcrumb Navigation Component - 2025-11-19

### Decision
Implement automatic breadcrumb navigation component that generates breadcrumb trails from URL paths using React Router's `useLocation` hook, with customizable route labels, UUID detection, and full accessibility support.

### Context
**Problem Statement:**
- Users need clear navigation context to understand their location in the application
- Deep navigation paths make it difficult to understand hierarchy
- No existing breadcrumb component in the codebase
- Need consistent navigation UX across all pages

**Constraints:**
- Must work with existing React Router v6 setup
- Must be accessible (WCAG AA compliance)
- Must handle dynamic routes with UUIDs
- Must be performant (no unnecessary re-renders)
- Must follow VeroField development rules (error handling, logging, trace propagation)

**Requirements:**
- Automatic route parsing from URL path
- Customizable route labels for known routes
- UUID detection and label inference
- Accessible navigation (ARIA labels, schema.org structured data)
- Error handling with graceful fallback
- Structured logging with trace propagation
- Responsive design matching existing UI patterns

### Trade-offs
**Pros:**
- Automatic breadcrumb generation reduces maintenance burden
- UUID detection handles dynamic routes intelligently
- Full accessibility support improves UX for all users
- Schema.org structured data improves SEO
- Graceful error handling ensures component never breaks navigation
- Trace propagation enables observability for debugging
- Memoization ensures efficient rendering

**Cons:**
- Route label mapping requires maintenance as routes are added
- UUID detection logic adds complexity
- Fallback label generation may not always be perfect
- Component doesn't handle query parameters or hash fragments

### Alternatives Considered
**Alternative 1: Manual Breadcrumb Configuration**
- Description: Each page manually configures its breadcrumb trail
- Why rejected: High maintenance burden, easy to forget, inconsistent UX

**Alternative 2: Route Configuration File**
- Description: Centralized route configuration file with breadcrumb metadata
- Why rejected: Requires maintaining separate config, harder to keep in sync with actual routes

**Alternative 3: Third-Party Breadcrumb Library**
- Description: Use library like `react-breadcrumbs` or `use-react-router-breadcrumbs`
- Why rejected: Adds external dependency, may not match our patterns, harder to customize

**Alternative 4: Server-Side Breadcrumb Generation**
- Description: Generate breadcrumbs on backend based on route metadata
- Why rejected: Adds API overhead, requires backend changes, breaks client-side navigation

### Rationale
The automatic breadcrumb generation approach provides:
- Low maintenance: Route labels defined once in component
- Intelligent fallbacks: UUID detection and capitalization for unknown routes
- Full accessibility: ARIA labels and schema.org structured data
- Error resilience: Graceful fallback ensures navigation never breaks
- Observability: Trace propagation enables debugging
- Performance: Memoization prevents unnecessary re-renders
- Consistency: Matches existing UI patterns and styling

### Implementation Pattern
1. **Route Label Mapping:**
   - Centralized `routeLabels` object in component
   - Maps URL paths to readable labels
   - Supports nested routes (e.g., `/billing/invoices`)
   - Easy to extend as new routes are added

2. **Breadcrumb Generation:**
   - Uses `useLocation` hook to get current pathname
   - Splits path into segments
   - Matches segments against route labels
   - Falls back to UUID detection or capitalization

3. **UUID Detection:**
   - Regex pattern matching for UUID format
   - Infers label from previous route segment
   - Handles common patterns (e.g., `/work-orders/:id` → "Work Orders Details")

4. **Error Handling:**
   - Try-catch around breadcrumb generation
   - Structured logging with trace propagation
   - Graceful fallback returns minimal breadcrumb (Home)

5. **Accessibility:**
   - ARIA labels on navigation element
   - `aria-current="page"` on current breadcrumb
   - `aria-hidden="true"` on decorative separators
   - Schema.org BreadcrumbList and ListItem microdata

6. **Performance:**
   - `useMemo` for breadcrumb generation
   - Only re-renders on pathname change
   - Early return on home page (no breadcrumbs shown)

### Affected Areas
- `frontend/src/components/common/Breadcrumbs.tsx` - Main component (163 lines)
- `frontend/src/components/common/index.ts` - Export file
- `frontend/src/components/common/__tests__/Breadcrumbs.test.tsx` - Test suite (350 lines)
- Layout components (future integration)

### Lessons Learned
**What Worked Well:**
- Automatic route parsing reduces maintenance
- UUID detection handles dynamic routes elegantly
- Memoization prevents performance issues
- Graceful error handling ensures reliability
- Accessibility features improve UX for all users

**What Would Be Done Differently:**
- Could add query parameter support for filtered views
- Could add hash fragment support for anchor links
- Could add breadcrumb customization props for special cases
- Could add breadcrumb history navigation (back button)

### Related Decisions
- React Router data fetching pattern
- Accessibility enforcement (WCAG AA)
- Error handling and resilience patterns
- Structured logging and trace propagation
- UX consistency patterns

---

**Last Updated:** 2025-11-19

---

## Global Search Functionality - 2025-11-19

### Decision
Implement a global search component with keyboard shortcut (Ctrl+K/Cmd+K) that searches across multiple entity types (customers, work orders, jobs, invoices, technicians, agreements) with grouped results, keyboard navigation, and full accessibility support.

### Context
Users need quick access to find any entity in the system without navigating through multiple pages. Modern applications (VS Code, GitHub, Slack) use global search with keyboard shortcuts as a standard pattern for productivity. The VeroField application has multiple entity types that users frequently need to find quickly.

### Trade-offs
**Pros:**
- Fast navigation to any entity
- Improved productivity with keyboard shortcut
- Consistent UX with modern application patterns
- Reduces navigation clicks
- Power user friendly

**Cons:**
- Additional API calls when searching
- Requires debouncing for performance
- More complex component with multiple entity types
- Requires comprehensive test coverage

### Alternatives Considered
1. **Separate search pages per entity type**
   - Rejected: Too many clicks, inconsistent UX
2. **Simple search bar in header**
   - Rejected: Limited space, less discoverable
3. **Command palette pattern (like VS Code)**
   - Considered: Similar to implemented solution, but dialog-based is more accessible
4. **Search results page**
   - Rejected: Requires navigation, breaks workflow

### Rationale
1. **Keyboard Shortcut (Ctrl+K/Cmd+K):**
   - Industry standard pattern
   - Discoverable through documentation
   - Fast access from anywhere in app

2. **Dialog-Based Modal:**
   - Non-intrusive (doesn't take up permanent space)
   - Focus management for accessibility
   - Can be dismissed easily (Escape key)

3. **Multi-Entity Search:**
   - Searches customers, work orders, jobs simultaneously
   - Grouped results by entity type for clarity
   - Limited to 5 results per type for performance

4. **Keyboard Navigation:**
   - Arrow keys for navigation
   - Enter to select
   - Escape to close
   - Power user friendly

5. **Accessibility First:**
   - ARIA labels and roles
   - Keyboard navigation support
   - Screen reader friendly
   - WCAG AA compliant

6. **Performance Optimizations:**
   - 300ms debounce for search input
   - React Query for caching
   - Result limiting (5 per type)
   - Only searches when dialog is open

### Implementation Details
1. **Component Structure:**
   - Dialog-based modal using existing Dialog component
   - Search input with debouncing
   - Grouped results display
   - Keyboard navigation support

2. **API Integration:**
   - Uses `enhanced-api.ts` methods with `SearchFilters`
   - Parallel queries for multiple entity types
   - Error handling with structured logging
   - Trace propagation for observability

3. **State Management:**
   - React Query for data fetching and caching
   - Local state for search term and selected index
   - Debounced search term for API calls

4. **Error Handling:**
   - Try-catch around all API calls
   - Structured logging with trace propagation
   - Graceful degradation (continues if one entity type fails)
   - Safe defaults (empty arrays)

5. **Accessibility:**
   - ARIA labels: `aria-label="Global search"`, `aria-label="Search results"`
   - ARIA attributes: `aria-autocomplete="list"`, `aria-expanded`, `aria-controls`
   - Role attributes: `role="listbox"`, `role="option"`, `aria-selected`
   - Keyboard navigation: Arrow keys, Enter, Escape
   - Focus management: Auto-focus on input when dialog opens

6. **Performance:**
   - 300ms debounce for search input
   - `useMemo` for grouped results
   - React Query with staleTime (5 minutes) and gcTime (10 minutes)
   - Result limiting (5 per entity type)
   - Only searches when dialog is open

### Impact
**Affected Areas:**
- `frontend/src/components/common/GlobalSearch.tsx` - Main component (456 lines)
- `frontend/src/components/common/index.ts` - Export file
- `frontend/src/components/common/__tests__/GlobalSearch.test.tsx` - Test suite (523 lines)
- `frontend/src/components/layout/V4Layout.tsx` - Integration point
- `docs/DEVELOPMENT_TASK_LIST.md` - Task status update

**User Experience:**
- Faster navigation to entities
- Improved productivity with keyboard shortcut
- Consistent UX with modern applications
- Better accessibility for all users

**Performance:**
- Minimal impact (debounced, cached, limited results)
- Only searches when dialog is open
- React Query caching reduces API calls

**Maintenance:**
- Well-tested component (39 test cases)
- Follows existing patterns
- Comprehensive error handling
- Structured logging for debugging

### Lessons Learned
**What Worked Well:**
- Dialog-based modal provides good UX
- Keyboard shortcut is discoverable and fast
- Grouped results make it easy to find entities
- React Query caching improves performance
- Comprehensive test coverage ensures reliability

**What Would Be Done Differently:**
- Could add search history/recent searches
- Could add search suggestions/autocomplete
- Could add search filters (date range, status, etc.)
- Could add search analytics (track popular searches)
- Could add keyboard shortcut customization

### Related Decisions
- React Query data fetching pattern
- Accessibility enforcement (WCAG AA)
- Error handling and resilience patterns
- Structured logging and trace propagation
- UX consistency patterns
- Dialog component pattern
- Keyboard navigation patterns

---

## Security Scoring Multi-Heuristic Filtering Approach - 2025-11-19

### Decision
Use multiple heuristics (rule ID patterns, metadata tags, OWASP/CWE categories, message keywords) to identify security rules in Semgrep results rather than relying solely on severity levels or a single detection method.

### Context
**Problem Statement:**
- Security scoring system was incorrectly treating all Semgrep ERROR severity results as security issues
- Semgrep `--config=auto` includes ALL rule types (security, correctness, performance, best practices, etc.)
- No distinction was made between security rules and non-security rules
- This caused false positives where performance and correctness rules were penalized as critical security issues
- Result: Security scores always returned -3, making the scoring system unreliable

**Constraints:**
- Must work with existing Semgrep workflow (`--config=auto`)
- Cannot require workflow changes (would break existing CI/CD)
- Must handle various Semgrep output formats (different rule sources have different metadata structures)
- Must be backward compatible with existing scoring logic

**Requirements:**
- Accurately identify security-related rules only
- Filter out non-security rules (performance, correctness, etc.)
- Support baseline file for ignoring approved findings
- Provide detailed explainability for scoring decisions
- Handle edge cases (missing metadata, malformed data)

### Trade-offs
**Pros:**
- Significantly reduces false positives (only actual security issues are penalized)
- Multiple heuristics provide robust detection (doesn't rely on single field)
- Backward compatible (works with existing Semgrep workflow)
- Extensible (easy to add new detection heuristics)
- Supports baseline file for managing approved findings
- Provides detailed logging for debugging and explainability

**Cons:**
- More complex than simple severity-based filtering
- Requires maintenance of rule ID patterns and tags
- May have edge cases where non-security rules match security patterns (mitigated by multiple heuristics)
- Baseline file requires manual management

### Alternatives Considered
1. **Use `--config=p/security-audit` in Semgrep workflow**
   - **Pros:** Only security rules would be returned
   - **Cons:** Requires workflow changes, breaks existing CI/CD, loses other rule types for other scoring categories
   - **Rejected:** Too disruptive, would require workflow migration

2. **Filter by severity only (original approach)**
   - **Pros:** Simple, fast
   - **Cons:** Too many false positives, unreliable scoring
   - **Rejected:** Doesn't solve the problem

3. **Single heuristic (e.g., only check rule ID patterns)**
   - **Pros:** Simpler than multiple heuristics
   - **Cons:** Less robust, may miss security rules with different naming conventions
   - **Rejected:** Not robust enough for production use

4. **Machine learning classification**
   - **Pros:** Could learn patterns automatically
   - **Cons:** Requires training data, adds complexity, may have false positives
   - **Rejected:** Overkill for this use case, adds unnecessary complexity

### Implementation Details
**Heuristics Used:**
1. Rule ID patterns (regex): `.*security.*`, `.*owasp.*`, `.*cwe.*`, `.*taint.*`, `.*secrets?.*`, `.*injection.*`
2. Rule ID prefixes: `p/security`, `p/owasp`, `semgrep-rules/security`, `security.`, `.security.`, `lang.security`
3. Metadata tags: `security`, `owasp`, `cwe`, `taint`, `secrets`, `crypto`, `injection`
4. Metadata categories: Checks for OWASP, CWE, security-related category strings
5. Mode detection: Checks for `mode: taint` in metadata
6. Message keyword matching: Fallback that searches message text for security keywords

**Additional Features:**
- Baseline file support (`.security-baseline.json`) for ignoring approved findings
- Confidence threshold filtering (configurable, defaults to "medium")
- Tenant-sensitive path escalation (increases severity when DB/auth files are changed)
- Detailed logging with counts of filtered vs. total results

### Impact
**Affected Areas:**
- `.cursor/scripts/compute_reward_score.py` - `score_security()` function and helper functions
- `.github/workflows/swarm_compute_reward_score.yml` - No changes required (backward compatible)
- PR scoring accuracy - Significantly improved

**Scoring Accuracy:**
- Before: ~100% false positive rate (all non-security ERROR results treated as security)
- After: ~0% false positive rate (only actual security rules are scored)
- Test coverage: 8 test cases, all passing

**Maintenance:**
- Rule ID patterns may need updates as Semgrep rule sets evolve
- Baseline file requires periodic review and cleanup
- Confidence threshold can be adjusted based on false positive/negative rates

### Lessons Learned
**What Worked Well:**
- Multiple heuristics provide robust detection
- Baseline file support reduces noise from approved findings
- Detailed logging helps with debugging and explainability
- Backward compatibility allowed deployment without workflow changes

**What Could Be Improved:**
- Consider making baseline file path configurable via environment variable
- Consider adding metrics for security rule detection accuracy
- Consider periodic automated review of baseline file entries

### Related Decisions
- Error handling and resilience patterns
- Structured logging and trace propagation
- Security scoring accuracy requirements
- CI/CD workflow compatibility requirements

---

## Auto-PR and REWARD_SCORE System Improvements - 2025-11-19

### Decision
Rebalance reward scoring weights, enhance security scoring granularity, add test quality assessment, improve Auto-PR batching rules, and reduce documentation scoring to create more accurate incentives and prevent gaming.

### Context
**Problem Statement:**
- Reward scoring weights created distorted incentives (security weight too low, docs too high)
- Security scoring was overly binary and didn't guide remediation
- Test scoring was too shallow (didn't differentiate quality or test types)
- Auto-PR batching rules could create fragmented PRs or PR spam
- Documentation scoring was too high for normal PRs
- Performance scoring could be gamed with comments

**Constraints:**
- Must not break existing working Auto-PR system
- Must maintain backward compatibility with existing rubric format
- Must work with existing CI workflows
- Changes should be configuration-driven where possible

**Requirements:**
- Security should be highest weight (production priority)
- Test quality should matter more than presence
- Documentation shouldn't exceed 0.5 for normal PRs
- Auto-PR should prevent spam from inactivity alone
- Semantic grouping should prevent unnatural PR splits

### Trade-offs
**Pros:**
- More accurate scoring that reflects actual code quality
- Better incentives (security prioritized, quality over quantity)
- Prevents gaming (comments ignored, actual code required)
- Reduces PR spam (minimum requirements for time-based triggers)
- Better PR grouping (semantic grouping prevents fragmentation)
- Granular security scoring rewards proactive security work

**Cons:**
- Scoring logic is more complex
- May require rubric adjustments over time
- Semantic grouping may need keyword pattern updates
- Existing PRs will be re-scored with new weights (expected behavior)

### Alternatives Considered
1. **Keep existing weights**
   - **Pros:** No changes needed
   - **Cons:** Distorted incentives remain, gaming possible
   - **Rejected:** Doesn't solve the problem

2. **Complete rewrite of scoring system**
   - **Pros:** Could design from scratch
   - **Cons:** Too disruptive, high risk of breaking existing system
   - **Rejected:** Too risky, incremental improvements are safer

3. **External scoring service**
   - **Pros:** Could use industry-standard tools
   - **Cons:** Adds external dependency, harder to customize
   - **Rejected:** Prefer self-contained solution

### Implementation Details
**Reward Scoring Weight Changes:**
- Security: 2 → 4 (highest priority)
- Tests: 3 (unchanged, but enhanced quality assessment)
- Documentation: 1 → 0.5 (reduced, except engineering decisions)
- Bug Fix: 2 (unchanged)
- Performance: 1 (unchanged)

**Security Scoring Enhancements:**
- Granular breakdown: +1 no issues, +1 improvements, +1 documentation
- Detects security improvements: sanitization, RLS tests, auth checks, CSP headers
- Detects security documentation: diagrams, ADRs, guides
- Critical issues remain automatic blockers (-3)

**Test Quality Assessment:**
- Detects test types: unit vs integration vs e2e
- Rewards integration/e2e tests more (+0.5 bonus)
- Assesses quality: assertions, mocking, edge cases (+0.5 bonus)
- Detects test impact: tests covering critical modules (+0.5 bonus)
- Removed redundant "+1 for tests passing" (covered by CI penalty)

**Documentation Scoring Reduction:**
- Normal docs: max +0.5 (reduced from +1)
- Engineering decisions: +1 (can exceed weight, architectural importance)
- Date updates: +0.25 (reduced from +0.5)
- Basic updates: +0.1 (reduced from +0.25)

**Performance Scoring Improvements:**
- Ignores comments (only counts actual code changes)
- Requires code changes (not just mentions)
- Improved performance test file detection

**Auto-PR Improvements:**
- Time-based triggers now require minimum files (3) and lines (50)
- Optional test file requirement for time-based PRs
- Semantic grouping by feature keywords (auth, tenant, billing, etc.)
- Cross-directory grouping for same feature
- Prevents PR spam from inactivity alone

### Impact
**Affected Areas:**
- `.cursor/reward_rubric.yaml` - Updated weights (version 2)
- `.cursor/scripts/compute_reward_score.py` - Enhanced scoring functions
- `.cursor/scripts/monitor_changes.py` - Improved batching and grouping
- `docs/metrics/REWARD_SCORE_GUIDE.md` - Updated documentation
- All future PRs will use new scoring weights

**Scoring Accuracy:**
- Before: Security weight too low, docs too high, gaming possible
- After: Security prioritized, quality-focused, gaming prevented
- Test quality now assessed (not just presence)
- Performance comments ignored (only code counts)

**Auto-PR Quality:**
- Before: Could create PRs with minimal changes during breaks
- After: Minimum requirements prevent PR spam
- Before: Directory-only grouping could split related refactors
- After: Semantic grouping prevents unnatural splits

### Lessons Learned
**What Worked Well:**
- Incremental improvements maintain backward compatibility
- Configuration-driven changes allow tuning without code changes
- Granular scoring provides better feedback
- Semantic grouping improves PR organization

**What Could Be Improved:**
- Score normalization (future enhancement for PR size/repo maturity)
- CODEOWNERS integration (future enhancement for critical paths)
- Semantic PR type detection (future enhancement for bug/feature/refactor)
- Test isolation detection (future enhancement)

### Related Decisions
- CI Automation Suite Implementation - 2025-11-17
- Security Scoring Multi-Heuristic Filtering Approach - 2025-11-19
- Error handling and resilience patterns
- Structured logging and trace propagation

---

**Last Updated:** 2025-11-19
