# AI Assistant Best Practices for VeroSuite Development

## Overview
This document outlines comprehensive best practices for AI-assisted development to ensure proper project analysis, efficient implementation, and maintainable code. Following these practices prevents unnecessary work, maintains project consistency, and maximizes development efficiency.

## 1. Pre-Implementation Analysis

### Comprehensive Project Discovery
```
"Conduct a comprehensive project analysis before implementation:
1. SEARCH: Use parallel semantic searches to understand the domain
2. ANALYZE: Map existing implementations and identify patterns  
3. VALIDATE: Cross-reference database schema with actual usage
4. PLAN: Create a structured implementation approach with todos
5. EXECUTE: Implement following established patterns
6. VERIFY: Test integration with existing systems"
```

### Multi-Dimensional Code Search
```
"Before implementing [feature], execute parallel searches:
1. Semantic search: 'How does [feature] work in this system?'
2. Pattern search: grep for similar component structures
3. Database search: Review schema for related tables
4. Documentation search: Check all .md files for current status
5. API search: Find existing endpoints and services"
```

## 2. Context Management & Tool Usage

### Parallel Tool Execution Strategy
- **CRITICAL**: Always use parallel tool calls when gathering information
- Execute multiple searches simultaneously rather than sequentially
- Batch related operations to maximize context window utilization
- Combine semantic search + grep + file reading in single operations

### Tool Selection Matrix
| Task Type | Primary Tool | Secondary Tool | Use Case |
|-----------|-------------|----------------|----------|
| Concept Understanding | `codebase_search` | `read_file` | Learning how features work |
| Exact Symbol Lookup | `grep` | `codebase_search` | Finding specific functions/variables |
| Architecture Analysis | `codebase_search` + `read_file` | `grep` | Understanding system design |
| Implementation Planning | `todo_write` + parallel searches | `read_file` | Complex multi-step tasks |

### Context Window Optimization
```
"Maximize information gathering efficiency:
- Run 3-5 parallel searches for comprehensive coverage
- Use semantic search for broad understanding first
- Follow with targeted grep searches for specifics
- Read key files identified in search results
- Create todos for complex implementations"
```

## 3. Implementation Strategy

### Component-First Development Approach
```
"Before building new components:
1. Search for existing similar components in /frontend/src/components/
2. Identify reusable patterns and established conventions
3. Check if functionality can be achieved by extending existing components
4. Map component dependencies and integration points
5. Follow established naming and structure patterns
6. Ensure proper TypeScript interfaces and prop definitions"
```

### Incremental Implementation Strategy
```
"Break complex features into atomic, testable components:
1. Create detailed todo list with specific deliverables
2. Implement core functionality first
3. Add integration points incrementally
4. Test each component independently
5. Validate integration at each step
6. Update documentation as you progress"
```

### Architecture Validation Protocol
```
"Validate existing architecture before making changes:
1. Map current data flow and API structure
2. Identify established patterns and conventions
3. Check tenant isolation and security boundaries
4. Verify database schema relationships
5. Understand error handling approaches
6. Document any architectural decisions or trade-offs"
```

## 4. Quality Assurance Standards

### Code Quality Requirements
- **Type Safety**: Maintain 100% TypeScript coverage with proper interfaces
- **Error Handling**: Implement comprehensive error management following existing patterns
- **Validation**: Add proper input validation and sanitization
- **Testing**: Include unit tests for new functionality when possible
- **Documentation**: Update relevant .md files for new features

### Integration Testing Checklist
- ✅ Verify API endpoint compatibility and response formats
- ✅ Test database operations with proper tenant isolation
- ✅ Validate frontend-backend data flow
- ✅ Check authentication and authorization flows
- ✅ Ensure proper error handling and user feedback

### Database Safety Protocols
```
"For database changes:
1. Always review existing schema relationships first
2. Understand current RLS (Row Level Security) policies
3. Test migrations in development environment
4. Verify tenant isolation is maintained
5. Check for breaking changes in existing queries
6. Update seed data if necessary"
```

## 5. Risk Management & Safety

### Safe Development Practices
- **Backup Strategy**: Read existing files before making major modifications
- **Incremental Changes**: Make small, testable changes rather than large rewrites
- **Validation Gates**: Test each change before proceeding to the next
- **Rollback Planning**: Understand how to revert changes if needed
- **Security First**: Always maintain tenant isolation and data protection

### Change Impact Assessment
```
"Before implementing changes:
1. Identify all affected components and services
2. Map potential breaking changes and dependencies
3. Plan migration strategy for existing data
4. Consider backward compatibility requirements
5. Document any breaking changes clearly"
```

## 6. Communication Standards

### Progress Reporting
```
"For complex implementations:
1. Provide regular progress updates during long operations
2. Explain architectural decisions and trade-offs clearly
3. Document breaking changes and migration paths
4. Include testing instructions for new features
5. Update relevant documentation files
6. Show intermediate results and validate direction"
```

### Clear Explanations
- **Decision Rationale**: Explain why specific approaches were chosen
- **Trade-off Analysis**: Discuss alternatives and their implications  
- **Integration Impact**: Describe how changes affect existing systems
- **Future Considerations**: Note potential enhancement opportunities
- **Error Scenarios**: Document expected failure modes and handling

## 7. Project-Specific Guidelines

### VeroSuite Architecture Standards
- **Frontend**: React + TypeScript + Tailwind CSS (following purple theme preferences)
- **Backend**: NestJS + Prisma + Supabase with comprehensive RLS
- **Database**: PostgreSQL with strict tenant isolation
- **Authentication**: JWT with multi-tenant security
- **State Management**: Zustand + React Query for efficient data fetching
- **Mobile**: React Native with offline-first architecture

### Critical Implementation Areas
- **Components**: `/frontend/src/components/` - Follow established patterns
- **APIs**: `/frontend/src/lib/` and `/backend/src/` - Maintain consistency
- **Database**: `backend/prisma/schema.prisma` - Preserve relationships and RLS
- **Documentation**: All `.md` files - Keep current and accurate
- **Seed Data**: `backend/prisma/seed.ts` - Maintain test data integrity
- **Mobile App**: `VeroSuiteMobile/` - Production-ready React Native

### Security & Tenant Isolation
```
"Always maintain security standards:
1. Verify tenant isolation in all database operations
2. Use existing authentication patterns consistently
3. Follow established error handling approaches
4. Validate input data according to existing schemas
5. Maintain audit logging for sensitive operations"
```

## 8. Success Metrics & Validation

### Excellent AI Assistant Behavior
- ✅ **Parallel Efficiency**: Uses multiple tools simultaneously for comprehensive analysis
- ✅ **Context Awareness**: Understands existing architecture before making changes
- ✅ **Pattern Following**: Consistently applies established project conventions
- ✅ **Progress Communication**: Provides clear updates and explanations
- ✅ **Quality Focus**: Implements proper error handling and validation
- ✅ **Documentation**: Updates relevant files and maintains accuracy
- ✅ **Security Conscious**: Maintains tenant isolation and data protection

### Poor AI Assistant Behavior
- ❌ **Sequential Operations**: Uses tools one at a time instead of parallel execution
- ❌ **Duplicate Work**: Creates functionality that already exists
- ❌ **Pattern Breaking**: Ignores established conventions and structures
- ❌ **Schema Assumptions**: Modifies database without understanding relationships
- ❌ **Silent Changes**: Makes modifications without explaining decisions
- ❌ **Documentation Neglect**: Fails to update relevant documentation
- ❌ **Security Gaps**: Breaks tenant isolation or security boundaries

## 9. Common Patterns & Anti-Patterns

### ✅ Recommended Patterns

#### Information Gathering
```
"Execute comprehensive parallel analysis:
1. Semantic search: 'How does [domain] work in this system?'
2. Component search: grep for similar UI patterns
3. API search: Find related backend endpoints
4. Schema search: Review database relationships
5. Documentation search: Check current implementation status"
```

#### Complex Feature Implementation
```
"For multi-step features:
1. Create structured todo list with specific deliverables
2. Start with core functionality and basic UI
3. Add integration points incrementally
4. Test each component independently
5. Validate end-to-end workflow
6. Update documentation and add error handling"
```

### ❌ Anti-Patterns to Avoid

#### Sequential Tool Usage
- **Wrong**: Search → wait → read → wait → implement
- **Right**: Execute 3-5 parallel searches → analyze results → implement

#### Assumption-Based Development  
- **Wrong**: Assume field names and create new schemas
- **Right**: Read existing schema and follow established patterns

#### Silent Implementation
- **Wrong**: Make changes without explanation
- **Right**: Explain decisions and show intermediate progress

## 10. Quick Reference & Templates

### Comprehensive Feature Analysis Template
```
"Before implementing [FEATURE]:
1. PARALLEL SEARCH: Execute 4-5 simultaneous searches:
   - Semantic: 'How does [FEATURE] work in VeroSuite?'
   - Components: grep for related UI components
   - APIs: Search for existing backend endpoints  
   - Schema: Review database tables for [DOMAIN]
   - Docs: Check .md files for current status

2. ANALYSIS: Based on search results:
   - What exists vs what needs to be built?
   - What patterns should be followed?
   - What are the integration points?
   - Are there any security considerations?

3. IMPLEMENTATION PLAN:
   - Create todo list for complex features
   - Start with core functionality
   - Follow established patterns
   - Maintain tenant isolation
   - Update documentation

4. VALIDATION:
   - Test integration with existing systems
   - Verify error handling
   - Check TypeScript compliance
   - Validate security boundaries"
```

### Emergency Issue Resolution Template
```
"For urgent issues:
1. IMMEDIATE ANALYSIS: Parallel search for:
   - Error patterns and existing solutions
   - Related components and their error handling
   - Similar issues in documentation
   - Working examples in the codebase

2. ROOT CAUSE: Identify the core problem
3. IMPACT ASSESSMENT: Understand affected systems
4. SOLUTION: Apply fix following existing patterns
5. VALIDATION: Test thoroughly before deployment
6. DOCUMENTATION: Update relevant files with solution"
```

### Code Review Checklist
- ✅ **Parallel Tool Usage**: Used multiple tools efficiently
- ✅ **Pattern Compliance**: Follows established project conventions
- ✅ **Type Safety**: Maintains TypeScript standards
- ✅ **Error Handling**: Implements proper error management
- ✅ **Security**: Maintains tenant isolation
- ✅ **Testing**: Includes validation and testing
- ✅ **Documentation**: Updates relevant .md files
- ✅ **Communication**: Provides clear explanations

---

## Core Philosophy

**"Work WITH the existing project structure, not against it. Always search, analyze, and understand before implementing. Maximize efficiency through parallel operations and maintain the highest standards of code quality and security."**

### Key Success Factors
1. **Efficiency First**: Use parallel tool calls for comprehensive analysis
2. **Quality Focus**: Maintain TypeScript, testing, and documentation standards  
3. **Security Conscious**: Always preserve tenant isolation and data protection
4. **Pattern Driven**: Follow established conventions consistently
5. **Communication Clear**: Explain decisions and provide progress updates
6. **Safety Oriented**: Make incremental, testable changes with rollback plans

---

## Legacy Reference (Maintained for Compatibility)

### Basic Prompting Commands
```
"Before implementing [feature], please:
1. Search for existing [feature] components  
2. Review the database schema for [related tables]
3. Check documentation for current status
4. Show me what exists vs what needs to be built
5. Follow established patterns"
```

### Project Review Template
```
"Review the entire project structure and tell me:
- What's already implemented
- What the current architecture looks like  
- What patterns are established
- What gaps exist
- What should be prioritized"
```

---

**Remember**: The goal is to work WITH the existing project structure, not against it. Always search, analyze, and understand before implementing. Maximize efficiency through parallel operations while maintaining the highest standards of quality and security.
