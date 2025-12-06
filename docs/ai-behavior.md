---
# Cursor Rule Metadata
version: 1.3
project: VeroField
scope:
  - ai-assistant
priority: critical
last_updated: 2025-12-05 20:13:54
always_apply: true
---

# PRIORITY: CRITICAL - AI Behavior Directives

## PRIORITY: CRITICAL - Pre-Implementation Requirements

**⚠️ MANDATORY: Read `.cursor/rules/enforcement.md` FIRST before any implementation.**

**Before implementing ANY feature, you MUST complete:**

### 1. Component Discovery (MANDATORY - DO NOT SKIP)
```
✅ MUST search for existing components in frontend/src/components/ui/
✅ MUST check component library catalog (docs/reference/COMPONENT_LIBRARY_CATALOG.md)
✅ MUST review similar implementations in the codebase (find 2-3 examples)
✅ MUST check for component documentation (*.md files in ui/)
✅ MUST use parallel tool calls (3-5 simultaneous searches)
✅ MUST search for state machine documentation (if stateful component) (see `.cursor/rules/state-integrity.md`)
✅ MUST search for contract definitions (if schema changes) (see `.cursor/rules/contracts.md`)
✅ MUST check for existing dependencies (if adding dependency) (see `.cursor/rules/dependencies.md`)

STOP if you haven't completed all searches above.
```

### 2. Pattern Analysis (MANDATORY - DO NOT SKIP)
```
✅ MUST find 2-3 similar implementations (use grep + codebase_search)
✅ MUST identify common patterns and conventions
✅ MUST review form patterns (WorkOrderForm, InvoiceForm, etc.)
✅ MUST check validation patterns (react-hook-form + zod)
✅ MUST verify file path matches monorepo structure (see .cursor/rules/monorepo.md)

STOP if pattern is unclear - ask for clarification.
```

### 3. Documentation Review (MANDATORY - DO NOT SKIP)
```
✅ MUST read docs/reference/DEVELOPMENT_BEST_PRACTICES.md
✅ MUST review CRM_STYLING_GUIDE.md (if exists)
✅ MUST check DESIGN_SYSTEM.md (if exists)
✅ MUST review component-specific guides
✅ MUST check .cursor/rules/enforcement.md for compliance checklist

STOP if documentation unclear - ask for clarification.
```

### 4. Code Location Verification (MANDATORY - DO NOT SKIP)
```
✅ MUST verify correct file location (check .cursor/rules/monorepo.md)
✅ MUST check if component should be in ui/ (reusable) or feature-specific
✅ MUST ensure proper imports use @verofield/common/* for shared code
✅ MUST verify no old paths (backend/src/ or backend/prisma/)
✅ MUST check if feature requires VeroAI patterns (see .cursor/rules/veroai.md)
✅ MUST verify transaction requirements (if multi-step DB operations) (see .cursor/rules/database-integrity.md)
✅ MUST check layer synchronization needs (if touching any layer) (see .cursor/rules/layer-sync.md)
✅ MUST verify no architecture changes without permission (see .cursor/rules/architecture-scope.md)

STOP if file location is incorrect - fix before proceeding.
```

---

## PRIORITY: CRITICAL - Tool Usage Strategy

**CRITICAL:** Always use parallel tool calls when gathering information.

- Execute 3-5 simultaneous searches rather than sequentially
- Batch related operations to maximize context window utilization
- Combine semantic search + grep + file reading in single operations

### Tool Selection Matrix
- **Concept Understanding**: `codebase_search` → `read_file`
- **Exact Symbol Lookup**: `grep` → `codebase_search`
- **Architecture Analysis**: `codebase_search` + `read_file` → `grep`
- **Implementation Planning**: `todo_write` + parallel searches → `read_file`

### Discovery Commands Template
```typescript
// Execute parallel searches for comprehensive coverage:
codebase_search("How does [feature] work in this system?")
glob_file_search("**/*[pattern]*.tsx")
grep -r "[pattern]" frontend/src/components/
read_file("docs/reference/DEVELOPMENT_BEST_PRACTICES.md")
list_dir("frontend/src/components/ui")

// Additional searches for new rules:
codebase_search("What is the state machine for [component]?") // If stateful
codebase_search("What are the contract definitions for [entity]?") // If schema changes
grep -r "from ['\"][library-name]" . --exclude-dir=node_modules // If adding dependency
codebase_search("How are transactions implemented for [operation]?") // If multi-step DB
codebase_search("How are layers synchronized for [entity]?") // If touching layers
```

---

## PRIORITY: CRITICAL - AI Behavior Directives

### Always Follow These Procedures:

1. **Always summarize understanding before writing code**
   - Explain what you found in your search
   - Describe the pattern you'll follow
   - Identify any concerns or questions

2. **Always show search queries used before implementation**
   - List the searches you performed
   - Show what you found
   - Explain why you chose a particular approach

3. **Always verify file existence before creation**
   - Check if file already exists
   - Verify correct directory location
   - Ensure proper naming conventions

4. **Always update related documentation automatically**
   - Update "Last Updated" timestamps
   - Update CHANGELOG.md if significant
   - Update cross-references if needed

5. **Ask for confirmation before architectural changes**
   - Database schema changes
   - Major refactoring
   - Breaking changes
   - Security-related changes

---

## PRIORITY: HIGH - Implementation Workflow

### For New Features
```
1. SEARCH PHASE
   - Execute 4-5 parallel searches:
     - Semantic: 'How does [FEATURE] work in VeroField?'
     - Components: grep for related UI components
     - APIs: Search for existing backend endpoints
     - Schema: Review database tables for [DOMAIN]
     - Docs: Check .md files for current status

2. ANALYSIS PHASE
   - What exists vs what needs to be built?
   - What patterns should be followed?
   - What are the integration points?
   - Are there any security considerations?

3. PLANNING PHASE
   - Create todo list for complex features
   - Start with core functionality
   - Follow established patterns
   - Maintain tenant isolation
   - Update documentation

4. IMPLEMENTATION PHASE
   - Use existing components
   - Follow established patterns
   - Match styling
   - Maintain TypeScript types
   - Preserve security boundaries

5. IMPLEMENTATION PHASE
   - Use existing components
   - Follow established patterns
   - Match styling
   - Maintain TypeScript types
   - Preserve security boundaries

6. FILE AUDIT PHASE ⭐ **MANDATORY**
   - Audit ALL files touched for code compliance
   - Verify file paths (monorepo structure)
   - Verify imports (correct paths)
   - Verify security (tenant isolation)
   - Verify dates (current system date, not hardcoded)
   - Verify patterns (established conventions)
   - Verify TypeScript (no `any`, proper types)
   - Verify state machine compliance (if stateful) (see `.cursor/rules/state-integrity.md`)
   - Verify contract consistency (if schema changes) (see `.cursor/rules/contracts.md`)
   - Verify dependency governance (if adding dependency) (see `.cursor/rules/dependencies.md`)
   - Verify transaction safety (if multi-step DB) (see `.cursor/rules/database-integrity.md`)
   - Verify layer synchronization (if touching layers) (see `.cursor/rules/layer-sync.md`)
   - Verify performance characteristics (see `.cursor/rules/performance.md`)
   - Verify event schemas (if events) (see `.cursor/rules/eventing.md`)
   - Verify accessibility (if UI) (see `.cursor/rules/accessibility.md`)
   - Verify tooling compliance (lint/format) (see `.cursor/rules/tooling.md`)
   - Fix any violations found

7. VERIFICATION PHASE
   - Test integration with existing systems
   - Verify error handling
   - Check TypeScript compliance
   - Validate security boundaries
   - Update documentation with current date/time
   - Verify all file audits passed
```

---

## PRIORITY: HIGH - Success Metrics

### Excellent AI Assistant Behavior
- ✅ Uses multiple tools simultaneously for comprehensive analysis
- ✅ Understands existing architecture before making changes
- ✅ Consistently applies established project conventions
- ✅ Provides clear updates and explanations
- ✅ Implements proper error handling and validation
- ✅ Updates relevant files and maintains accuracy
- ✅ Maintains tenant isolation and data protection
- ✅ Uses current date/time for documentation

### Poor AI Assistant Behavior
- ❌ Uses tools one at a time instead of parallel execution
- ❌ Creates functionality that already exists
- ❌ Ignores established conventions and structures
- ❌ Modifies database without understanding relationships
- ❌ Makes modifications without explaining decisions
- ❌ Fails to update relevant documentation
- ❌ Breaks tenant isolation or security boundaries
- ❌ Uses outdated or hardcoded dates

---

## PRIORITY: NORMAL - Communication Standards

### Progress Reporting
- Provide regular progress updates during long operations
- Explain architectural decisions and trade-offs clearly
- Document breaking changes and migration paths
- Include testing instructions for new features
- Show intermediate results and validate direction

### Clear Explanations
- **Decision Rationale**: Explain why specific approaches were chosen
- **Trade-off Analysis**: Discuss alternatives and their implications
- **Integration Impact**: Describe how changes affect existing systems
- **Future Considerations**: Note potential enhancement opportunities
- **Error Scenarios**: Document expected failure modes and handling





