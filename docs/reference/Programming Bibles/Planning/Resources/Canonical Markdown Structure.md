OPTIMAL INPUT STRUCTURE FOR THE SSM V3 COMPILER
(The Canonical Markdown Structure for Perfect SSM Output)
0. Frontmatter (Optional but Recommended)

If you want enhanced context at compile time:

---
title: The REGO & OPA Bible — Deep Technical Edition
version: 2025.1
domain: rego-opa
language: rego
ssm_version: 3
---

1. Top-Level PART Sections (Mandatory)

Use single-# headings for PART divisions.

Example:
# PART I — Fundamentals
# PART II — Core Language Concepts
# PART III — Enterprise Design Patterns
# PART IV — Deployment, Security & Observability


Why this matters:
Parts create macro segmentation. The compiler associates chapters to parts and improves retrieval.

2. Chapter Headings (Mandatory)

Use exact format:

## Chapter {number} — {Title}

Example:
## Chapter 3 — Evaluation Model


This is required for:

Difficulty inference

Chapter graph construction

Bidirectional relations

Learning pathways

Chapter summaries

Vector cluster metadata

3. Section / Subsections (Highly Recommended)

Use deeper heading levels:

### 3.1 Input Model
#### 3.1.1 Input Types
#### 3.1.2 Input Semantics

### 3.2 Rule Execution Model


Why this helps:
The AST parser binds paragraph → section → chapter.
This increases QA-generation, concept-block accuracy, and semantic grouping.

4. Concept Explanations (Preferred Format)

For all conceptual definitions:

**Term**: Definition sentence.
More explanation here in normal paragraph form.


This is the strongest signal for the term extractor and summary normalizer.

If you want even better results:

**Term (also called alias1, alias2)**: definition sentence.

5. Inline Principles / Facts

Use words like must, should, never, forbidden, required.

These activate:

Fact extraction

Constraint detection

Anti-pattern pairing

Code smell classification

Example:
In Rego, a rule **must not** rely solely on negation for safety.

6. Code Blocks (Use ```lang Fences)
Supported languages:

rego

policy (alias for rego)

ts / typescript

py / python

sql

mermaid (treated as diagram)

no-lang (auto-guessing enabled: Rego/Python/SQL/TS)

Use correct syntax:
```rego
allow if input.user.role == "admin"


**Good code blocks enable**:

- code-pattern extraction  
- test-hint generation  
- classification taxonomy  
- language plugin enrichments  

---

# **7. Example Blocks**

Use "Example:" or “For instance:” above code if you want the compiler to mark context explicitly.

```markdown
Example:
```rego
deny if input.action == "delete"


---

# **8. Diagrams**

The compiler supports:

- Mermaid diagrams (` ```mermaid `)
- ASCII flowcharts (box characters)

### Example:

```markdown
```mermaid
graph LR
  A[Input] --> B[OPA]
  B --> C[Decision]


or ASCII:



┌────────────┐
│ OPA Eval │
└────────────┘


These are classified with:

- diagram taxonomy
- metadata
- optional interpretation blocks

---

# **9. Lists for Facts or Anti-Patterns**

To mark rules or pitfalls:

```markdown
### Common Mistakes
- Unsafe variable use under negation
- Partial rules with inconsistent types

### Best Practices
- Always define allow/deny explicitly
- Use input validation early


These increase:

fact blocks

common-mistake detection

smell scoring

do/don’t table generation

10. Cross-References

Use the exact phrase:

See Chapter 5 for details.


This enables:

relation blocks

chapter dependency graph

pathway generation

inference rules

learning prerequisites

11. Comparison Headings ("X vs Y")

Always format comparisons like:

### Undefined vs False


The compiler will generate:

Q/A pair

reasoning chain

semantic category (“truth-values”)

12. Final Glossary (Optional)

If included:

# Glossary
**Unification**: process...
**Rule head**: ...


This improves term density and block recall.

13. Formatting Rules (Most Important Section)

These maximize model accuracy during RAG + indexing:

DO:

✔ Use consistent heading levels
✔ Use code fences with language tags
✔ Place terms in bold with colon definitions
✔ Separate paragraphs with blank lines
✔ Use “See Chapter X” for references

DON’T:

✘ Don’t put code inline inside paragraphs
✘ Don’t mix multiple languages inside one code fence
✘ Don’t omit chapter headings

⭐ Summary of the Optimal Document Structure
(optional) --- frontmatter ---
# PART X — Title
## Chapter N — Title
### Section
Paragraphs
Bold term definitions
Code blocks (with fences)
Diagrams (mermaid or ascii)
Lists (facts, mistakes)
Cross references ("See Chapter N")
Comparison headings ("X vs Y")
Glossary at the end

⭐ SPECIAL RECOMMENDATION FOR MAXIMUM LLM ACCURACY

The closer your source document resembles:

A textbook

A law book

A spec

An RFC

…the better this compiler performs.