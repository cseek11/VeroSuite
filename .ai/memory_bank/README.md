# Memory Bank

**Last Updated:** 2025-12-04

## Purpose

The Memory Bank preserves project context across AI sessions. Since AI memory resets between sessions, the Memory Bank serves as the single source of truth for understanding the project, its goals, architecture, and current state.

## Structure

The Memory Bank consists of core files that build upon each other:

```
memory-bank/
├── projectbrief.md      # Foundation: project goals, scope, requirements
├── productContext.md    # Why: problems solved, user experience goals
├── systemPatterns.md    # How: architecture, patterns, technical decisions
├── techContext.md       # What: technologies, setup, constraints
├── activeContext.md     # Now: current work, recent changes
├── progress.md           # Status: what works, what's left, known issues
└── README.md          # This file
```

## File Hierarchy

```
projectbrief.md (foundation)
    ├── productContext.md (why)
    ├── systemPatterns.md (how)
    └── techContext.md (what)
            └── activeContext.md (now)
                    └── progress.md (status)
```

## Core Files

### 1. projectbrief.md
- **Purpose:** Foundation document that shapes all other files
- **Content:** Core requirements, goals, project scope
- **Created:** At project start
- **Updates:** When project scope changes

### 2. productContext.md
- **Purpose:** Why this project exists
- **Content:** Problems solved, user experience goals, product vision
- **References:** UX documentation in `docs/`, `.cursor/rules/13-ux-consistency.mdc`
- **Updates:** When product goals change

### 3. systemPatterns.md
- **Purpose:** System architecture and design patterns
- **Content:** Architecture overview, key decisions, component relationships
- **References:** 
  - `.cursor/patterns/` for golden patterns
  - `.cursor/golden_patterns.md` for pattern index
  - `.cursor/anti_patterns.md` for patterns to avoid
  - `.cursor/rules/04-architecture.mdc` for architecture rules
- **Updates:** When architecture changes, new patterns discovered

### 4. techContext.md
- **Purpose:** Technologies, setup, constraints
- **Content:** Tech stack summary, development setup, dependencies
- **References:**
  - `.cursor/rules/02-core.mdc` for tech stack details
  - `.cursor/rules/08-backend.mdc` for backend patterns
  - `.cursor/rules/09-frontend.mdc` for frontend patterns
- **Updates:** When tech stack changes, new dependencies added

### 5. activeContext.md
- **Purpose:** Current work focus, recent changes
- **Content:** Current task, recent changes, next steps, active decisions
- **References:**
  - `.cursor/BUG_LOG.md` for recent bugs
  - `docs/error-patterns.md` for recent error patterns
  - `docs/tech-debt.md` for active debt
- **Updates:** After each task completion (automatic), when starting new major feature

### 6. progress.md
- **Purpose:** What works, what's left, current status
- **Content:** Working features, remaining work, known issues, test coverage status
- **References:**
  - CI REWARD_SCORE trends (if tracked)
  - Test coverage reports
  - `docs/tech-debt.md` for known issues
- **Updates:** After major feature completion, after Step 5 audit

## Workflow Integration

### Memory Bank Loading (Step 0)
Before starting any task, the AI must:
1. Read all Memory Bank files
2. Update `activeContext.md` with current task
3. Reference relevant Memory Bank context in planning

### Automatic Updates
Memory Bank files are automatically updated:
- **After Step 5 (Post-Implementation Audit):** Update `activeContext.md` and `progress.md`
- **After major feature completion:** Update `progress.md`
- **After architectural changes:** Update `systemPatterns.md`
- **After significant bug fixes:** Update `progress.md` with status

### On-Demand Updates
User can trigger full Memory Bank review:
- Type "update memory bank" → AI reviews ALL files
- When starting new major feature → Update `activeContext.md`
- When context seems stale → User-triggered refresh

## Relationship with VeroField Rules

The Memory Bank and VeroField Rules are complementary:

- **Memory Bank:** Context & Continuity (what, why, where)
- **VeroField Rules:** Enforcement & Quality (how, standards, gates)

**Key Principle:** Memory Bank **references** existing documentation and rules, it does **not duplicate** them.

## Plan/Act Mode

The Memory Bank can use Plan/Act mode workflow:
- **Plan Mode:** Gather information, create plan, no changes
- **Act Mode:** Execute plan, make changes

This is separate from the VeroField Rules enforcement pipeline.

## Version Control

All Memory Bank files are committed to version control for:
- Team collaboration
- History and audit trail
- Onboarding new contributors
- Context preservation

Optional: `.cursor/memory-bank/personal/` folder (gitignored) for individual work context if needed.

## Maintenance

### Update Triggers
- Automatic: After Step 5 completion, major feature completion
- On-demand: User requests, context refresh needed
- Scheduled: Periodic review (optional)

### Reference Strategy
- Memory Bank provides summaries and navigation
- Detailed information stays in existing docs
- Memory Bank references existing files with links
- Single source of truth maintained

## Getting Started

1. Read all Memory Bank files at task start
2. Update `activeContext.md` with current work
3. Reference Memory Bank context in planning
4. Update Memory Bank after significant work

## Questions?

- See `.cursor/rules/00-master.mdc` for rule system overview
- See `.cursor/README.md` for Cursor system documentation
- See individual Memory Bank files for specific context





































