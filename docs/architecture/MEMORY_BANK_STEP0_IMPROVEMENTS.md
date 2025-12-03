# Step 0 Improvements - Memory Bank Context Loading

**Date:** 2025-11-30  
**Purpose:** Strengthen Step 0 to prevent skipping and ensure compliance

---

## Current Step 0 (Problematic)

```markdown
### Step 0: Memory Bank Context Loading (MANDATORY)
- [ ] **MUST** read all Memory Bank files at task start:
  - `.cursor/memory-bank/projectbrief.md` - Project foundation
  - `.cursor/memory-bank/productContext.md` - Product context
  - `.cursor/memory-bank/systemPatterns.md` - Architecture and patterns
  - `.cursor/memory-bank/techContext.md` - Technologies and setup
  - `.cursor/memory-bank/activeContext.md` - Current work focus
  - `.cursor/memory-bank/progress.md` - Project status
- [ ] **MUST** update `activeContext.md` with current task
- [ ] **MUST** reference relevant Memory Bank context in planning
- [ ] **MUST** use Memory Bank context to inform searches and pattern analysis

**STOP if Memory Bank context is not loaded.**
```

**Problems:**
1. No explicit verification requirement
2. No evidence required of file reads
3. Easy to skip when focused on implementation
4. "STOP" is self-enforced, not technically enforced

---

## Proposed Step 0 (Strengthened)

```markdown
### Step 0: Memory Bank Context Loading (MANDATORY - HARD STOP) ⭐ **CRITICAL**

**⚠️ YOU CANNOT PROCEED TO STEP 1 UNTIL THIS IS COMPLETE AND VERIFIED:**

#### 0.1: Read All Memory Bank Files (MANDATORY)
- [ ] **MUST** read `.cursor/memory-bank/projectbrief.md` (use `read_file` tool)
- [ ] **MUST** read `.cursor/memory-bank/productContext.md` (use `read_file` tool)
- [ ] **MUST** read `.cursor/memory-bank/systemPatterns.md` (use `read_file` tool)
- [ ] **MUST** read `.cursor/memory-bank/techContext.md` (use `read_file` tool)
- [ ] **MUST** read `.cursor/memory-bank/activeContext.md` (use `read_file` tool)
- [ ] **MUST** read `.cursor/memory-bank/progress.md` (use `read_file` tool)

**VERIFICATION:** You must show evidence of reading each file (list files read or show file content summaries).

#### 0.2: Update Active Context (MANDATORY)
- [ ] **MUST** update `activeContext.md` with current task:
  - Set "Current Task" section with task description
  - Set status to "in progress"
  - Note files to be created/modified
  - Update "Last Updated" date to current system date
- [ ] **MUST** show evidence of update (file diff or summary of changes)

**VERIFICATION:** You must show the updated `activeContext.md` content or diff.

#### 0.3: Reference Memory Bank Context (MANDATORY)
- [ ] **MUST** identify relevant context from Memory Bank files:
  - What project context is relevant? (from projectbrief.md)
  - What patterns are relevant? (from systemPatterns.md)
  - What tech constraints apply? (from techContext.md)
  - What is current status? (from progress.md)
- [ ] **MUST** explicitly state how Memory Bank context informs the task

**VERIFICATION:** You must list specific context items from Memory Bank files that are relevant to the current task.

#### 0.4: Step 0 Completion Verification (MANDATORY)
Before proceeding to Step 1, you MUST answer:

1. **Which Memory Bank files did you read?** (List all 6)
2. **What is the current task from activeContext.md?** (Quote or summarize)
3. **What relevant context did you find in Memory Bank files?** (List 3+ items)
4. **Did you update activeContext.md?** (Show evidence)

**HARD STOP:** If you cannot answer these questions with evidence, STOP and complete Step 0 first.

**STOP if Memory Bank context is not loaded. DO NOT PROCEED TO STEP 1.**
```

---

## Key Improvements

### 1. Explicit Tool Usage
- **Before:** "read all Memory Bank files" (vague)
- **After:** "read `.cursor/memory-bank/projectbrief.md` (use `read_file` tool)" (explicit)

### 2. Verification Requirements
- **Before:** No verification required
- **After:** Must show evidence of file reads and updates

### 3. Structured Sub-Steps
- **Before:** Single checklist
- **After:** 4 sub-steps (0.1, 0.2, 0.3, 0.4) with clear requirements

### 4. Pre-Flight Check
- **Before:** "STOP if not loaded" (self-enforced)
- **After:** Must answer 4 verification questions before proceeding

### 5. Evidence Requirements
- **Before:** No evidence needed
- **After:** Must show file reads, updates, and context references

---

## Implementation in Rule File

Replace the current Step 0 section in `.cursor/rules/01-enforcement.mdc` with the strengthened version above.

---

## Expected Behavior

### When Step 0 is Completed Correctly:

1. AI reads all 6 Memory Bank files using `read_file` tool
2. AI updates `activeContext.md` with current task
3. AI lists relevant context from Memory Bank files
4. AI answers verification questions
5. AI proceeds to Step 1

### When Step 0 is Skipped:

1. AI attempts to proceed to Step 1
2. Verification questions cannot be answered
3. AI must STOP and complete Step 0 first
4. Work cannot proceed until Step 0 is complete

---

## Testing

To verify this works:

1. Start a new implementation task
2. Attempt to skip Step 0
3. Verify that verification questions prevent proceeding
4. Complete Step 0 properly
5. Verify that work can proceed after Step 0 completion

---

**Last Updated:** 2025-11-30  
**Status:** Proposal - Awaiting Approval





















