# AI Assistant Best Practices for VeroSuite Development

## Overview
This document outlines the best prompting strategies to ensure the AI assistant properly reviews existing project structure, documentation, and components before making changes. Following these practices prevents unnecessary work and maintains project consistency.

## Best Prompting Strategies

### 1. Explicit Review Request
```
"Before making any changes, please:
1. Review the existing project structure and documentation
2. Check for existing components, APIs, and database schemas
3. Identify what's already implemented vs what needs to be built
4. Show me what you found before proceeding"
```

### 2. Component-First Approach
```
"Check if [specific feature] already exists in the project before implementing anything new. Look for:
- Existing components in /components
- Existing APIs in /lib
- Database schemas in Prisma
- Documentation files"
```

### 3. Documentation Review
```
"Review all documentation files first, then tell me:
- What's already documented as implemented
- What the current architecture looks like
- What gaps exist vs what I'm asking for"
```

### 4. Search-First Strategy
```
"Before writing any code, search the entire codebase for:
- Similar functionality
- Existing patterns
- Database models
- API endpoints
- Component structures"
```

### 5. Architecture Validation
```
"Validate the existing architecture before making changes:
- What's the current data flow?
- What APIs already exist?
- What components are already built?
- What's the established pattern?"
```

## What the AI Should Always Do

### Before Making Any Changes:
1. **Search First** - Use codebase_search and grep to find existing implementations
2. **Read Documentation** - Check all .md files for current status
3. **Review Schemas** - Understand existing database structure
4. **Map Existing Components** - See what's already built
5. **Show Findings** - Present what was discovered before making changes

### Key Areas to Always Check:
- **Components**: `/frontend/src/components/`
- **APIs**: `/frontend/src/lib/` and `/backend/src/`
- **Database**: `backend/prisma/schema.prisma`
- **Documentation**: All `.md` files in the project
- **Seed Data**: `backend/prisma/seed.ts`
- **Existing Patterns**: How similar features are implemented

## Common Mistakes to Avoid

### ❌ Don't Do This:
- Create new components without checking if they exist
- Implement new APIs without reviewing existing patterns
- Modify database schemas without understanding current structure
- Ignore existing documentation and project status
- Assume field names without checking the actual schema

### ✅ Do This Instead:
- Search for existing implementations first
- Read the Prisma schema to understand field names
- Check documentation for current project status
- Follow established patterns and conventions
- Validate against existing code before making changes

## Example Workflow

### When Requesting New Features:
1. **"Search the codebase for existing [feature] implementations"**
2. **"Review the database schema for [related tables]"**
3. **"Check documentation for current [feature] status"**
4. **"Show me what exists vs what needs to be built"**
5. **"Follow the established patterns for [similar feature]"**

### When Fixing Issues:
1. **"Search for existing error handling patterns"**
2. **"Review the current API structure"**
3. **"Check documentation for known issues"**
4. **"Validate against existing working examples"**

## Project-Specific Considerations

### VeroSuite Architecture:
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: NestJS + Prisma + Supabase
- **Database**: PostgreSQL with RLS (Row Level Security)
- **Authentication**: JWT with tenant isolation
- **State Management**: Zustand + React Query

### Key Patterns to Follow:
- Use existing API clients in `/frontend/src/lib/`
- Follow the established component structure
- Maintain tenant isolation in all database operations
- Use the existing authentication patterns
- Follow the established error handling approaches

## Success Metrics

### Good AI Assistant Behavior:
- ✅ Searches before implementing
- ✅ Reviews existing documentation
- ✅ Understands current architecture
- ✅ Follows established patterns
- ✅ Shows findings before making changes
- ✅ Minimizes unnecessary work

### Poor AI Assistant Behavior:
- ❌ Creates duplicate functionality
- ❌ Ignores existing components
- ❌ Modifies schemas without understanding
- ❌ Doesn't check documentation
- ❌ Assumes field names and structures
- ❌ Causes unnecessary rework

## Quick Reference Commands

### For AI Assistant:
```
"Before implementing [feature], please:
1. Search for existing [feature] components
2. Review the database schema for [related tables]
3. Check documentation for current status
4. Show me what exists vs what needs to be built
5. Follow established patterns"
```

### For Project Review:
```
"Review the entire project structure and tell me:
- What's already implemented
- What the current architecture looks like
- What patterns are established
- What gaps exist
- What should be prioritized"
```

---

**Remember**: The goal is to work with the existing project structure, not against it. Always search, review, and understand before implementing.
