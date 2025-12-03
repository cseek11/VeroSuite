# VeroField Two-Brain Model: Complete Implementation Plan

**Generated:** 2025-12-02  
**Status:** Ready for Implementation  
**Architecture:** Two-Brain Separation (Brain A: Enforcer, Brain B: LLM)

---

## Executive Summary

### The Problem

Your audit report correctly identified the core issue: **structural health (87.5% pass) but behavioral chaos**. The LLM is trying to:

- Self-enforce 25-40 rule files
- Manage context loading/unloading
- Execute complex 5-step procedural pipelines
- Predict next tasks
- Update Memory Bank
- Check violations

**Result:** Context overload, blocking behavior, recursion loops, unpredictable stops.

### The Solution

**Two-Brain Architecture:**

- **Brain A (Auto-Enforcer):** Owns ALL rules, enforcement, Memory Bank, context strategy
- **Brain B (LLM Agent):** Lightweight interface (3-5 files), implements code, applies fixes

**Key Benefits:**

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Files in LLM Context | 25-40 | 3-5 | **80-90% reduction** |
| Token Usage | ~84k | ~8-15k | **82% reduction** |
| Blocking Incidents | Frequent | Zero | **100% elimination** |
| Rule Compliance | ~70% | ~100% | **30% improvement** |
| Context Recursion | Common | Impossible | **Architectural fix** |

---

## Architecture Overview

### Current Architecture (Problem)

```
┌─────────────────────────────────────────────────────────────┐
│                  SINGLE-BRAIN MODEL (Current)                │
└─────────────────────────────────────────────────────────────┘

                    User Request
                         │
                         ▼
         ┌───────────────────────────────┐
         │    LLM Agent (Cursor)         │
         │                               │
         │  Context: 25-40 files          │
         │  • All rule files (00-14)     │
         │  • Memory Bank (6 files)      │
         │  • Context management         │
         │  • Recommendations            │
         │                               │
         │  Responsibilities:            │
         │  • Implement code            │
         │  • Self-enforce rules        │
         │  • Manage context            │
         │  • Execute 5-step pipeline   │
         │  • Update Memory Bank        │
         │                               │
         └───────────────────────────────┘
                         │
                         ▼
              ❌ RESULT: Overload
              • Context overflow
              • Blocking behavior
              • Recursion loops
```

### New Architecture (Solution)

```
┌─────────────────────────────────────────────────────────────┐
│                  TWO-BRAIN MODEL (Target)                   │
└─────────────────────────────────────────────────────────────┘

                    User Request
                         │
                         ▼
         ┌───────────────────────────────┐
         │  BRAIN B: LLM Agent           │
         │                               │
         │  Context: 3-5 files           │
         │  • 00-llm-interface.mdc        │
         │  • 01-llm-security-lite.mdc    │
         │  • ENFORCER_REPORT.json        │
         │  • memory-bank/summary.md      │
         │                               │
         │  Responsibilities:            │
         │  • Implement code ONLY        │
         │  • Apply fixes from reports  │
         │                               │
         └───────────────────────────────┘
                         │
                         ▼ (writes code)
         ┌───────────────────────────────┐
         │  BRAIN A: Auto-Enforcer       │
         │                               │
         │  Context: Full system         │
         │  • enforcement/rules/ (all)   │
         │  • memory-bank/ (all 6)       │
         │  • Full codebase analysis     │
         │                               │
         │  Responsibilities:            │
         │  • Enforce all rules          │
         │  • Detect violations          │
         │  • Generate reports           │
         │  • Auto-fix when possible     │
         │  • Call LLM to fix violations │
         │                               │
         └───────────────────────────────┘
                         │
                         ▼
              ENFORCER_REPORT.json
                         │
                         ▼
              [FOLLOW_ENFORCER_REPORT]
                         │
                         ▼
              LLM applies fixes
                         │
                         ▼
              Auto-enforcer re-audits
                         │
                    ┌────┴────┐
                    ▼         ▼
                Status: OK  Violations
                    │         │
                    ▼         └──> Loop back
              ✅ Continue
```

---

## Communication Protocol

### Step-by-Step Flow

1. **User Request → Brain B (LLM)**
   - User: "Add RLS to customer queries"
   - LLM: Implements code normally (no self-enforcement)

2. **Brain A (Enforcer) Audits**
   - File watcher detects changes
   - Enforcer runs full rule audit
   - Generates `ENFORCER_REPORT.json`

3. **Report Generated**
   ```json
   {
     "status": "BLOCKING",
     "violations": [
       {
         "id": "VF-RLS-001",
         "severity": "BLOCKING",
         "file": "src/customers/customers.service.ts",
         "rule_ref": "03-security.mdc#R02",
         "description": "Missing tenant_id filter",
         "fix_hint": "Add WHERE tenant_id = :tenant_id"
       }
     ]
   }
   ```

4. **Brain A Calls Brain B**
   - Enforcer writes prompt to `.cursor/llm_input.txt`
   - Or uses Cursor API (if available)
   - LLM reads report and applies fixes

5. **Brain B Applies Fixes**
   - LLM reads `ENFORCER_REPORT.json`
   - Applies only fixes listed
   - Outputs: `[FIX_COMPLETE]`

6. **Loop Until Clean**
   - Enforcer re-audits
   - If violations remain → loop back
   - If clean → continue

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal:** Create new structure without breaking existing system

**Tasks:**
- [ ] Create new directory structure
- [ ] Create lightweight LLM interface files
- [ ] Implement ENFORCER_REPORT.json schema
- [ ] Test in parallel with existing system

**Deliverables:**
- New directory structure
- Dual-mode operation (old + new)
- Report format specification

### Phase 2: Enforcer Enhancement (Week 2)
**Goal:** Upgrade auto-enforcer to full Two-Brain capability

**Tasks:**
- [ ] Implement report generator
- [ ] Add LLM callback mechanism
- [ ] Create autonomous fix loop
- [ ] Build Memory Bank summarizer

**Deliverables:**
- Enhanced auto-enforcer
- Automated loop working
- Memory Bank compression

### Phase 3: LLM Interface (Week 3)
**Goal:** Teach LLM the new protocol

**Tasks:**
- [ ] Finalize lightweight rule files
- [ ] Implement [FOLLOW_ENFORCER_REPORT] mode
- [ ] Update .cursorrules
- [ ] Test fix loop behavior

**Deliverables:**
- LLM interface rules
- Fix mode working
- Updated .cursorrules

### Phase 4: Migration (Week 4)
**Goal:** Switch from old to new architecture

**Tasks:**
- [ ] Remove heavy rules from LLM context
- [ ] Switch enforcer to use new paths
- [ ] Enable file watcher
- [ ] Validate all integrations

**Deliverables:**
- Full cutover complete
- Old system deprecated
- Monitoring in place

### Phase 5: Optimization (Week 5+)
**Goal:** Tune and improve

**Tasks:**
- [ ] Optimize token usage
- [ ] Improve fix hints
- [ ] Enhance prediction accuracy
- [ ] Add analytics

**Deliverables:**
- Performance metrics
- Best practices guide
- Team training

---

## File Structure & Changes

### New Directory Layout

```
VeroField/
├── .cursor/
│   ├── rules/                          # ← BRAIN B (LLM) ONLY
│   │   ├── 00-llm-interface.mdc        # ← NEW
│   │   ├── 01-llm-security-lite.mdc    # ← NEW
│   │   └── 02-llm-fix-mode.mdc         # ← NEW
│   │
│   ├── enforcement/                    # ← BRAIN A (Enforcer) TERRITORY
│   │   ├── rules/                      # ← MOVED: Heavy rules
│   │   │   ├── 00-master.mdc
│   │   │   ├── 01-enforcement.mdc
│   │   │   ├── 02-core.mdc
│   │   │   ├── 03-security.mdc
│   │   │   ├── ... (all 00-14)
│   │   │   ├── python_bible.mdc
│   │   │   └── typescript_bible.mdc
│   │   │
│   │   ├── auto-enforcer.py            # ← ENHANCED
│   │   ├── report_generator.py         # ← NEW
│   │   ├── llm_caller.py               # ← NEW
│   │   ├── fix_loop.py                 # ← NEW
│   │   ├── ENFORCER_REPORT.json        # ← NEW
│   │   └── ... (existing files)
│   │
│   ├── memory-bank/
│   │   ├── summary.md                  # ← NEW: Compressed for LLM
│   │   └── ... (existing 6 files)
│   │
│   └── scripts/
│       ├── file_watcher.py             # ← NEW
│       ├── memory_summarizer.py         # ← NEW
│       └── migration/                  # ← NEW
│           ├── create_structure.py
│           ├── move_rules.py
│           └── validate_migration.py
│
└── .cursorrules                        # ← UPDATED
```

### File Changes Summary

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `.cursor/rules/00-llm-interface.mdc` | Core LLM protocol |
| CREATE | `.cursor/rules/01-llm-security-lite.mdc` | Minimal security rules |
| CREATE | `.cursor/rules/02-llm-fix-mode.mdc` | Fix mode behavior |
| MOVE | `.cursor/rules/*.mdc` → `.cursor/enforcement/rules/` | Enforcer-only rules |
| CREATE | `.cursor/enforcement/ENFORCER_REPORT.json` | Communication bridge |
| CREATE | `.cursor/enforcement/report_generator.py` | Report creation |
| CREATE | `.cursor/enforcement/llm_caller.py` | Call LLM automatically |
| CREATE | `.cursor/enforcement/fix_loop.py` | Autonomous loop |
| ENHANCE | `.cursor/enforcement/auto-enforcer.py` | Add Two-Brain logic |
| CREATE | `.cursor/memory-bank/summary.md` | Compressed Memory Bank |
| CREATE | `.cursor/scripts/file_watcher.py` | Auto-trigger |
| CREATE | `.cursor/scripts/memory_summarizer.py` | Memory compression |
| UPDATE | `.cursorrules` | Point to new interface |

---

## Critical Implementation Details

### 1. Reusing Existing Components

**What We Can Reuse:**
- ✅ `auto-enforcer.py` - Already has violation detection logic
- ✅ `context_manager/` - Can be adapted for enforcer use
- ✅ `memory-bank/` - Files already exist, just need summarizer
- ✅ Session management - Already in place
- ✅ Violation tracking - Already working

**What Needs New Implementation:**
- ⚠️ Report generator (new format)
- ⚠️ LLM caller (depends on Cursor API availability)
- ⚠️ Fix loop (new autonomous mechanism)
- ⚠️ Memory Bank summarizer (new compression)

### 2. LLM Caller Implementation Options

**Option A: File-Based (Most Portable)**
- Write prompt to `.cursor/llm_input.txt`
- LLM reads file and responds
- Write response to `.cursor/llm_output.txt`
- Enforcer polls for completion

**Option B: Cursor CLI (If Available)**
- Use `cursor ask` command
- Direct subprocess call
- Capture response

**Option C: Cursor API (If Available)**
- HTTP endpoint for programmatic access
- Most elegant but requires API support

**Recommendation:** Start with Option A, upgrade to B/C when available.

### 3. File Watcher Considerations

**Debouncing:**
- Wait 5 seconds after last file change
- Prevents excessive triggering

**File Filters:**
- Only watch code files (`.ts`, `.tsx`, `.py`, `.js`, `.jsx`)
- Ignore build artifacts, node_modules, etc.

**Error Handling:**
- Timeout after 10 minutes
- Log errors but don't crash
- Continue watching after errors

### 4. Memory Bank Summarization Strategy

**Compression Approach:**
- Extract first 5 key points from each file
- Combine into single summary
- Preserve critical context (current task, recent changes)
- Target: 70% size reduction

**Update Frequency:**
- Generate summary after Memory Bank updates
- Cache until next update
- Enforcer owns full Memory Bank, LLM gets summary

---

## Migration Strategy

### Pre-Migration Checklist

- [ ] Backup entire `.cursor` directory
- [ ] Test current system one last time
- [ ] Commit all current work to git
- [ ] Create feature branch: `two-brain-migration`
- [ ] Review all existing violations
- [ ] Ensure tests pass

### Migration Steps

**Day 1-2: Foundation**
```bash
# 1. Create new structure
python .cursor/scripts/migration/create_structure.py

# 2. Create LLM interface rules
# (Copy files from implementation)

# 3. Test in parallel (don't switch yet)
```

**Day 3-4: Enforcer Enhancement**
```bash
# 4. Move rules to enforcer-only
python .cursor/scripts/migration/move_rules.py

# 5. Enhance auto-enforcer
# (Integrate new components)

# 6. Test report generation
python .cursor/enforcement/auto-enforcer.py audit
```

**Day 5-6: LLM Integration**
```bash
# 7. Update .cursorrules
# (Point to new interface files)

# 8. Test fix mode manually

# 9. Implement file watcher
pip install watchdog
python .cursor/scripts/file_watcher.py
```

**Day 7: Cutover**
```bash
# 10. Disable old system
# (Remove old rule references)

# 11. Enable file watcher permanently

# 12. Monitor for 24 hours
```

### Rollback Plan

If issues arise:
```bash
# 1. Stop file watcher
pkill -f file_watcher.py

# 2. Restore old rules
cp -r .cursor/rules_backup/* .cursor/rules/

# 3. Restore old .cursorrules
git checkout .cursorrules

# 4. Continue with old system
```

---

## Testing & Validation

### Test Suite

**File:** `.cursor/tests/test_two_brain.py`

Tests should verify:
- LLM interface files exist
- Enforcer rules moved correctly
- Report schema valid
- Memory Bank summary generated
- .cursorrules updated
- Fix loop completes

### Validation Checklist

After migration:
- [ ] LLM loads only 3-5 files
- [ ] Enforcer generates valid reports
- [ ] Fix loop completes without errors
- [ ] Violations detected correctly
- [ ] Fixes applied by LLM
- [ ] Re-audit shows improvements
- [ ] No blocking behavior
- [ ] No recursion loops
- [ ] Token usage reduced by 70-90%
- [ ] All tests pass

---

## Expected Outcomes

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Files in LLM Context | 3-5 | Check Cursor context panel |
| Token Usage | <15k | Monitor Cursor token counter |
| Blocking Incidents | 0 | Track for 1 week |
| Rule Compliance | >95% | Enforcer audit results |
| Fix Loop Success | >90% | Automated fix completion rate |

### Success Criteria

✅ LLM context reduced to 3-5 files  
✅ Zero blocking incidents for 1 week  
✅ All violations detected and fixed automatically  
✅ Token usage reduced by >70%  
✅ Fix loop completes without human intervention  
✅ No regressions in code quality  

---

## Next Steps

1. **Review this plan** - Confirm approach and priorities
2. **Create implementation files** - Generate all code files
3. **Test in parallel** - Run old and new systems side-by-side
4. **Gradual migration** - Phase-by-phase cutover
5. **Monitor and optimize** - Tune based on real usage

---

**Status:** Ready for implementation  
**Risk Level:** Low (parallel testing, rollback plan)  
**Estimated Time:** 4-5 weeks  
**Dependencies:** Cursor API availability (optional, file-based fallback)






