# Rego Bible – Cursor Edition

> Auto-generated from SSM Bible via V3 compiler + pipeline.

**Last Updated:** 2025-11-26

## Chapter 1 — Introduction to OPA and Rego

_Difficulty: [beginner]_

### Key Concepts

- **Modern distributed systems face unprecedented complexity:.**
- **Traditional approaches fail because:.**
- **RBAC Limitations: Role-based access control cannot express: - Context-dependent decisions - Attribute-based logic - Relationship-based access - Tim...**
- **Lack of Portability: Policies tied to specific languages/frameworks.**
- **Kubernetes Admission Control - Gatekeeper validates/mutates resources - Prevents non-compliant deployments - Enforces security policies.**
- **API Gateways & Service Meshes - Envoy External Authorization - Istio/Linkerd integration - Kong/Traefik plugins.**
- **Application Authorization - Microservices decisions - GraphQL field authorization - Database query filtering.**

### Important Facts

- Microservices Architecture: 10-1000+ services requiring consistent authorization - Zero-Trust Networks: Every request must be authenticated and aut...
- Hardcoded Logic: Authorization embedded in application code creates: - Inconsistency across services - Difficult auditing and compliance - Slow pol...
- OPA (Open Policy Agent) is a general-purpose policy decision engine that:.
- CI/CD Pipelines - Infrastructure-as-Code validation - Terraform plan analysis - Docker image policy enforcement.
- Cloud Security - AWS IAM policy validation - Azure ARM template scanning - GCP resource compliance.
- Rego is a declarative logic language with unique characteristics:.

### Common Code Patterns

- **Pattern:** # Python (Procedural) (python, python-structure)

### Frequently Asked Questions

---

## Chapter 3 — Core Concepts and Evaluation Model

_Difficulty: [intermediate]_

### Key Concepts

- **Input Document (input): - Provided per query - Represents current request/context - Typically contains: - User identity and attributes - Resource b...**
- **However, performance may differ (covered in Chapter 11).**
- **For Sets (Union Works):.**

### Important Facts

- OPA operates on a two-document model:.
- Data Document (data): - Loaded into OPA at startup or via bundles - Contains: - Policy rules (your Rego code) - Static reference data - Configurati...
- Rules are logical assertions about your world model.
- Parse: Convert Rego text to AST 2.
- Critical: Set Union Behavior in Partial Rules.
- Multiple rule bodies with the same partial rule name create a union for sets and objects, but this only works when each rule body adds distinct ele...
- For Complete Rules with Sets (Use Comprehensions):.
- Key Insight: - Partial rules (contains, [key] := value): Multiple bodies union automatically - Complete rules (:= value): Multiple bodies with diff...

### Common Code Patterns

- **Pattern:** allow if { (rego, quantifier)
- **Pattern:** # These are equivalent (rego, quantifier)
- **Pattern:** # Returns false explicitly (rego, rule_head)
- **Pattern:** # ❌ Common mistake (rego, rule_head)
- **Pattern:** allow if { (rego, rule_head)
- **Pattern:** allow if { expr1 }  # OR (rego, rule_head)
- **Pattern:** # (admin OR owner) AND active (rego, rule_head)
- **Pattern:** # ✅ CORRECT: Single rule with comprehension creates union (rego, quantifier)
- **Pattern:** deny := false if input.user.role != "admin" (rego, authorization)
- **Pattern:** deny if input.user.role == "admin" (rego, authorization)

### Frequently Asked Questions

---

## Chapter 5 — Control Flow and Iteration

_Difficulty: [intermediate]_

### Key Concepts

- **For orientation, here is the taxonomy we’ll use in this chapter:.**
- **Aggregates: count, sum, product, min, max, sort, all, any.**
- **Arrays: array.concat, array.slice, array.reverse, array.sort, array.filter.**
- **Sets & Set-like operations: union, intersection, set_diff, minus, distinct, to_set.**
- **Objects & JSON paths: object.get, object.remove, object.union, object.filter, json.filter.**
- **Strings: concat, contains, startswith, endswith, indexof, lower, upper, replace, split, sprintf, substring, trim* family.**
- **Regular Expressions: regex.is_valid, regex.match, regex.find_n, regex.split.**
- **Numbers & Numeric Utilities: abs, ceil, floor, round, numbers.range, comparisons.**
- **Type Conversion & Validation: to_number, to_string, to_set, to_array, to_object, cast_*, json.is_valid, yaml.is_valid.**
- **Encoding/Decoding & Serialization: base64.*, base64url.*, hex.*, json.marshal/unmarshal, yaml.marshal/unmarshal, urlquery.*.**
- **Type Introspection: is_array, is_boolean, is_null, is_number, is_object, is_set, is_string, type_name.**
- **Cryptography & Security: crypto.* hashes, HMAC, PBKDF, bcrypt, JWT (io.jwt.*), crypto.x509.*.**
- **Time & Temporal Logic: time.now_ns, time.parse_*, time.date, time.clock, time.weekday, diffs.**
- **HTTP & I/O: http.send for outbound HTTP calls.**
- **Network & CIDR: net.cidr_contains, net.cidr_expand, net.cidr_intersects, net.cidr_merge.**
- **UUID/ULID: uuid.*, ulid.generate.**
- **Graph & Structural Walks: graph.reachable, walk.**
- **Units: units.parse, units.parse_bytes.**
- **Debugging: print, trace.**
- **Error Semantics: Strict vs non-strict behavior.**

### Important Facts

- Metadata & Introspection: rego.metadata.rule, rego.metadata.chain.
- # All servers must be healthy all_healthy if { all([s.healthy | some s in input.servers]) }.
- OPA has no direct a[1:3] slicing syntax; use array.slice.
- Rego sets are unordered, unique collections.
- Rego strings are Unicode text; built-ins operate on code points (not bytes).
- # May not work in all OPA versions is_hex if regex.match(^[0-9a-fA-F]+$, input.value).
- Best Practice: Always use double-quoted strings with escaped backslashes for regex patterns.
- When to Use Raw Strings: - Test inputs containing multi-line content (file diffs, code blocks) - Regex patterns that need to match actual newline c...
- Difference: to_* is generally more permissive; cast_* may be stricter (implementation details can vary by version—always verify against your target...
- Always guard access to optional or potentially missing input fields:.
- Common Patterns: - Check is_string() before contains(), startswith(), endswith() - Check is_array() before iteration with some ..
- Never bake secrets into Rego source; pass via data or environment.
- 6.14 This chapter catalogs core built-ins and corrects a few subtle points (arrays, JSON filtering, time, UUIDs/ULIDs).
- Both arguments must be arrays.
- If either argument is null (or not an array), OPA raises a type error.
- Important corrections:.
- There is no standard time.diff builtin in OPA.
- Test_http_policy if { result := policy.check with http.send as mock_http_send }.
- Rego exposes rule metadata at evaluation time:.
- Rule_meta := rego.metadata.rule() # metadata of current rule chain_meta := rego.metadata.chain() # stack of rule metadata along evaluation chain.

### Common Code Patterns

- **Pattern:** allow if { (rego, rule_head)
- **Pattern:** allow if { (rego, rule_head)
- **Pattern:** # Format: [ <term> | <query> ] (rego, quantifier)
- **Pattern:** # Format: { <term> | <query> } (rego, quantifier)
- **Pattern:** # Format: { <key>: <value> | <query> } (rego, quantifier)
- **Pattern:** # ❌ WRONG: "Is there any element != 'foo'?" (rego, quantifier)
- **Pattern:** # ❌ UNSAFE: May error if input.pr_body is missing or not a string (rego, quantifier)
- **Pattern:** # ✅ CORRECT: Raw string preserves actual newlines (rego, aggregation)
- **Pattern:** # ❌ PROBLEMATIC: Direct count() with with clause (rego, aggregation)
- **Pattern:** # ✅ CORRECT: Bind result to variable first (rego, aggregation)
- **Pattern:** # ✅ CORRECT: Iterate set to get first element (rego, aggregation)
- **Pattern:** test_multiple_assertions if { (rego, quantifier)
- **Pattern:** # ✅ CORRECT: Test for either rule, or check for common message pattern (rego, quantifier)
- **Pattern:** # ✅ CORRECT: Explicit import and qualified reference (rego, aggregation)
- **Pattern:** # ❌ AVOID: Bare rule name resolution (rego, aggregation)

### Common Pitfalls & Anti-Patterns

- **[HIGH]** Pitfall: contains is substring, not set membership (for that use in).
- **[HIGH]** 6.24 Design Patterns & Anti-Patterns.
- **[HIGH]** Explain modes opa eval --explain=notes -d policy.rego -i input.json 'data.authz.allow' opa eval --explain=full ...
- **[HIGH]** 7.9.1 The Case Sensitivity Trap.
- **[HIGH]** Common Pitfalls: Variable Scoping & Safety 4.X Common Pitfalls: Variable Scoping & Safety.
- **[HIGH]** Pitfall 1: Accidental Variable Shadowing.
- **[HIGH]** Pitfall 2: Unsafe Variables in Rules.
- **[HIGH]** A variable is unsafe if it’s used in a rule head or expression but not bound on all paths in the body.
- **[HIGH]** Pitfall 3: Misusing some in Comprehensions.
- **[HIGH]** # ❌ Over-constrained: 'some i' appears twice, but you really wanted two different indices bad if { some i arr[i] == "a" some i arr[i] == "b" }.
- **[HIGH]** Pitfall 4: Assuming Global State in Rules.
- **[HIGH]** # ❌ Misleading mental model: this does not "increment" anything counter := counter + 1 if { ..
- **[HIGH]** Chapter 6 – Common Pitfalls: Nulls, Missing Fields, and Type Guards 6.X Common Pitfalls: Nulls, Missing Fields, and Type Guards.
- **[HIGH]** Pitfall 1: Accessing Missing Fields Directly.
- **[HIGH]** # ❌ Panics if input.user is null or missing email := input.user.email.

### Frequently Asked Questions

---
