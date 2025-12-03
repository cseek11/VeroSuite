# Bible Structure Improvement Proposal: AI Generation + opa fmt

**Date:** 2025-11-25  
**Section:** Chapter 2.3 - Comments and Formatting  
**Current Issue:** AI generation guidance is buried in a numbered list and may be missed  
**Proposed Solution:** Add standalone fact block + enhance list item

---

## Current Structure (Lines 730-802)

The section is currently in a `::: diagram` block with a numbered list:

```markdown
::: diagram
When you should use opa fmt
1. Every time you write or modify Rego
...
5. After using AI tools (Cursor, ChatGPT, GitHub Copilot, etc.)
AI-generated Rego is usually:
•	valid
•	but not formatted to OPA conventions
You should run opa fmt immediately after AI/model generation.
...
:::
```

**Problem:** The AI guidance is item #5 in a long list, making it easy to miss.

---

## Proposed Structure (Maintains SSM Formatting)

### Option 1: Add Standalone Fact Block (RECOMMENDED)

Add a prominent fact block BEFORE the numbered list, then reference it in the list:

```markdown
::: fact
id: BLK-ai-generation-format-requirement
chapter: CH-02
level: [beginner, intermediate, advanced]
summary: **MANDATORY: Run opa fmt after AI-generated code**
tags: [ai, formatting, mandatory, best-practice]
:::
**MANDATORY: Run opa fmt after AI-generated code**

AI tools (Cursor, ChatGPT, GitHub Copilot, Claude, etc.) generate valid Rego code but **do not format it to OPA conventions**. 

**You MUST run `opa fmt` immediately after any AI/model generates Rego code.**

This applies to:
- Cursor-generated policy files
- ChatGPT-generated Rego rules
- GitHub Copilot completions
- Any LLM-generated Rego code
- Prompt-engineered complex policies
- AI-generated test files
- Model-generated example data

**Command:**
```bash
opa fmt --write <file.rego>
```

**Why this matters:**
- AI-generated code is syntactically correct but stylistically inconsistent
- Unformatted code causes style drift across the codebase
- Formatting debates waste code review time
- CI will fail if formatting isn't applied
:::

::: diagram
id: DIAGRAM-8ef2922a342ab0b9
chapter: CH-02
level: [beginner, intermediate]
type: ascii
tags: [ascii, diagram]
summary: ASCII diagram (requires interpretation)
:::
When you should use opa fmt

**⚠️ CRITICAL: See mandatory requirement above for AI-generated code**

1. Every time you write or modify Rego
...
5. **After using AI tools** ⚠️ **MANDATORY**
   - See fact block above for full details
   - Run `opa fmt --write` immediately after generation
   - Applies to: Cursor, ChatGPT, Copilot, Claude, etc.
...
:::
```

### Option 2: Enhanced List Item with Fact Reference

Keep the list but make item #5 more prominent:

```markdown
::: diagram
When you should use opa fmt
...
5. ⚠️ **MANDATORY: After using AI tools** (Cursor, ChatGPT, GitHub Copilot, Claude, etc.)

   **Why this is critical:**
   AI-generated Rego is usually:
   •	valid (syntactically correct)
   •	but NOT formatted to OPA conventions
   
   **Action Required:**
   ```bash
   # Run immediately after AI generation
   opa fmt --write <generated-file.rego>
   ```
   
   **This is especially true if:**
   •	you use Prompt Engineering to generate complex Rego
   •	Cursor writes policy libraries
   •	models generate example data
   •	AI generates test files
   •	LLMs create policy documentation examples
   
   **Failure to format will:**
   •	cause CI formatting checks to fail
   •	create style inconsistencies
   •	waste code review time on formatting debates
   •	violate team formatting standards
...
:::
```

### Option 3: Separate Section with Multiple Blocks (MOST COMPREHENSIVE)

Create a dedicated subsection with multiple SSM blocks:

```markdown
::: concept
id: BLK-ai-code-generation-formatting
chapter: CH-02
level: [beginner, intermediate, advanced]
summary: AI-Generated Code Requires Immediate Formatting
tags: [ai, formatting, mandatory]
:::
**AI-Generated Code Requires Immediate Formatting**
:::

::: fact
id: BLK-ai-format-requirement
chapter: CH-02
level: [beginner, intermediate, advanced]
summary: AI tools generate valid but unformatted Rego code
tags: [ai, formatting, fact]
:::
AI tools (Cursor, ChatGPT, GitHub Copilot, Claude, etc.) generate **valid** Rego code but **do not format it** to OPA conventions.
:::

::: fact
id: BLK-ai-format-mandatory
chapter: CH-02
level: [beginner, intermediate, advanced]
summary: You MUST run opa fmt immediately after AI generation
tags: [ai, formatting, mandatory]
:::
**You MUST run `opa fmt --write` immediately after any AI/model generates Rego code.**
:::

::: example
id: CODE-ai-format-workflow
chapter: CH-02
language: bash
level: [beginner, intermediate, advanced]
name: "AI Generation Formatting Workflow"
pattern_category: "workflow"
pattern_type: "formatting"
pattern_tags: [ai, formatting, workflow]
:::
```bash
# Step 1: AI generates code (e.g., in Cursor)
# Step 2: Immediately format it
opa fmt --write services/opa/policies/new-policy.rego

# Step 3: Verify formatting
opa fmt --diff services/opa/policies/new-policy.rego

# Step 4: Run tests (formatting shouldn't break anything)
opa test services/opa/tests/new-policy_test.rego
```
:::

::: diagram
id: DIAGRAM-ai-format-checklist
chapter: CH-02
level: [beginner, intermediate, advanced]
type: ascii
tags: [ascii, diagram, checklist]
summary: AI Generation Formatting Checklist
:::
**AI Generation Formatting Checklist:**

✅ AI generates Rego code
✅ Run `opa fmt --write <file.rego>` immediately
✅ Verify with `opa fmt --diff` (should show no changes)
✅ Run tests to ensure formatting didn't break anything
✅ Commit formatted code
:::

::: diagram
id: DIAGRAM-8ef2922a342ab0b9
chapter: CH-02
level: [beginner, intermediate]
type: ascii
tags: [ascii, diagram]
summary: ASCII diagram (requires interpretation)
:::
When you should use opa fmt

1. Every time you write or modify Rego
...
5. **After using AI tools** ⚠️ **See dedicated section above**
...
:::
```

---

## Recommendation

**Use Option 1 (Standalone Fact Block)** because:
1. ✅ Maintains SSM formatting structure
2. ✅ Makes the requirement impossible to miss
3. ✅ Can be referenced from multiple places
4. ✅ Provides clear command examples
5. ✅ Explains why it matters
6. ✅ Minimal disruption to existing structure

**Implementation:**
- Add the fact block right after line 729 (after the example code block)
- Update item #5 in the list to reference the fact block
- This creates a "see also" pattern that's common in technical documentation

---

## Benefits

1. **Visibility:** Standalone fact block is impossible to miss
2. **Searchability:** Can be found via fact block ID
3. **Reference:** Other sections can link to this fact
4. **Clarity:** Explicit "MANDATORY" language
5. **Examples:** Includes actual commands
6. **Context:** Explains why it matters

---

## Alternative: Add to Multiple Locations

If we want maximum visibility, we could also add a reference in:
- Chapter 7 (Testing) - "Format test files after AI generation"
- Chapter 10 (CI/CD) - "CI should enforce formatting on AI-generated code"
- Chapter 6 (Best Practices) - "Always format AI-generated code"

But the standalone fact block in Chapter 2.3 is the primary location.

---

**Last Updated:** 2025-11-25  
**Status:** Proposal for Review


