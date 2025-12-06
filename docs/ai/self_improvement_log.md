# Self-Improvement Log

**Purpose:** This file serves as a version-controlled memory for the Cursor agent, logging learnings from Reward Score evaluations to improve future PR quality.

**Last Updated:** 2025-12-05

---

## How This Works

When a Reward Score is < 6, Cursor automatically logs:
- What caused point loss (category breakdown)
- What it should do next time (actionable steps)
- What patterns it should prefer (from `.cursor/patterns/`)
- What anti-patterns it should avoid (from `.cursor/anti_patterns.md`)

This file is versioned in git, providing persistent memory that improves over time.

---

## Log Entries

### Entry Format

```markdown
## Entry #<N> - PR #<PR_NUMBER> - <DATE>

**Score:** <X>/10
**Status:** <low_score|improving|regression>

### Category Breakdown
- Tests: <score>
- Security: <score>
- Docs: <score>
- Performance: <score>
- Penalties: <score>

### What Caused Point Loss
- <Issue 1>: <description>
- <Issue 2>: <description>
- ...

### What to Do Next Time
- <Action 1>: <specific guidance>
- <Action 2>: <specific guidance>
- ...

### Patterns to Prefer
- <Pattern name> from `.cursor/patterns/<file>` - <why relevant>
- <Pattern name> from `.cursor/patterns/<file>` - <why relevant>

### Anti-Patterns to Avoid
- <Anti-pattern> from `.cursor/anti_patterns.md` - <why relevant>
- <Anti-pattern> from `.cursor/anti_patterns.md` - <why relevant>

### Context
- Files changed: <list>
- Type of change: <feature|bug_fix|refactor|docs|...>
- Domain: <backend|frontend|infra|data>
```

---

## Historical Entries

*(Entries will be added automatically when Reward Score < 6)*

---

## Usage Guidelines

- **For Cursor:** Read this file before making changes to learn from past mistakes
- **For Humans:** Review entries periodically to identify systemic issues
- **For Analysis:** Use this file to track improvement trends over time

---

## Maintenance

- Entries are automatically added by Cursor when Reward Score < 6
- Old entries should not be deleted (they provide historical context)
- If file becomes too large, consider archiving entries older than 6 months

---

**Note:** This file is automatically maintained by the Reward Score Feedback Loop system. See `.cursor/prompts/reward_feedback.md` for details.















