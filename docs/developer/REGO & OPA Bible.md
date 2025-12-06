The REGO & OPA Bible – Comprehensive Deep Research Edition

Definitive Guide to the Rego Language and the Open Policy Agent (OPA) Ecosystem
Version: 2025-12-05
Author: Prof. [Your Name], Ph.D.
Discipline: Computer Engineering, Logic Programming, Declarative Policy Systems

📘 Preface – Why This Book Exists

Rego and Open Policy Agent (OPA) are not “just another policy framework.”
They are the culmination of 40 years of declarative programming research (from Datalog, Prolog, and relational calculus), applied to modern distributed systems.

This Bible is structured to serve:

Beginners — practical, example-driven explanations

Practitioners — design, testing, and deployment patterns

Researchers & Architects — formal semantics, fixpoint models, and enterprise policy theory

PART I – FOUNDATIONS AND INTRODUCTION
Chapter 1 – Introduction to OPA and Rego
1.1 Why Policy as Code?

Modern cloud systems, microservices, and zero-trust architectures require a single source of truth for decisions (authz, compliance, privacy). OPA externalizes this logic from applications, making it declarative, auditable, and portable.

1.2 What is OPA?

OPA is a policy decision engine (PDP) that:

Accepts JSON input and data

Evaluates Rego policies

Returns structured decision documents

OPA is language-agnostic and embeddable in:

Kubernetes admission control (Gatekeeper)

Envoy / API gateways

CI/CD pipelines

Infrastructure-as-Code (IaC) scanners

1.3 What is Rego?

Rego is a declarative logic language inspired by Datalog, extended for JSON.
It describes what should be true, not how to achieve it.
Think: “SQL + Logic + JSON.”

Chapter 2 – Language Specification
2.1 Syntax Overview

A Rego module = package + imports + rules.

package http.authz
import rego.v1

default allow := false
allow if { input.user.role == "admin" }


OPA 1.0 defaults to Rego v1, enabling keywords if, in, contains, every.

2.2 Grammar (Simplified EBNF)
module     ::= "package" packagepath { import } { rule }
import     ::= "import" importpath [ "as" alias ]
rule       ::= rulehead [ "if" rulebody ]
rulebody   ::= "{" { expr } "}"
expr       ::= term [ operator term ]
term       ::= variable | literal | array | set | object | comprehension

2.3 Comments and Formatting

# introduces a comment

Use opa fmt --rego-v1 to canonicalize code

PART II – CORE LANGUAGE CONCEPTS
Chapter 3 – Core Concepts and Evaluation Model
3.1 World Model

OPA considers the world as two inputs:

input – transient context (request)

data – persistent facts (organization policy, configuration)

Policies describe desirable states of this world.

3.2 Rules

Rules are logical assertions.
Two categories:

Complete rule: returns a single value

Partial rule: defines membership in a virtual set/object

Evaluation uses unification, not assignment.

Chapter 4 – Variables, References, and Operators
4.1 Variables and Unification

Unification binds variables symmetrically:

x := 1
y := x + 2


OPA attempts to make both sides equal, yielding {x→1, y→3}.

4.2 References

Used to traverse JSON trees:

input.user.id
data.org.roles[input.user]

4.3 Operators
Category	Examples
Arithmetic	+ – * / %
Comparison	== != < > <= >=
Logical	and / or / not
Membership	in contains every
Chapter 5 – Control Flow and Iteration
5.1 Logical Conjunction and Disjunction

Multiple expressions = AND

Multiple rule bodies = OR

5.2 Comprehensions

Analogous to list/set builders:

admins := [u | u := data.users[_]; "admin" in u.roles]

5.3 Negation and Safety

Negation is negation-as-failure.
A variable in a not must be grounded elsewhere.

PART III – ADVANCED LANGUAGE STRUCTURE
Chapter 6 – Built-in Functions

OPA exposes a large deterministic library:

Strings: lower, split, re_match

Numbers: sum, count, avg

Objects: object.get, object.remove

Sets: union, difference

Time: time.now_ns, time.diff

Crypto: crypto.sha256, crypto.x509.parse_certificates

Example:

is_valid_email if {
  re_match(`^[^@]+@[^@]+\.[^@]+$`, lower(input.user.email))
}

Chapter 7 – Testing, Debugging, and Troubleshooting
7.1 Testing

Tests live in _test packages; rules start with test_.
Use opa test for execution.

7.2 Debugging

opa eval --explain=full
Use print() for inline tracing.
--profile reveals slow rules.

Common errors:

rego_type_error (type mismatch)

rego_unsafe_var_error (unbound variable)

PART IV – SYSTEM ARCHITECTURE & INTEGRATION
Chapter 8 – OPA Architecture and Integration Patterns

OPA functions as:

Local daemon / sidecar

Library (Go SDK, WASM)

Remote PDP

Integrations

Envoy/Traefik: external authz filter

Kubernetes: Gatekeeper with ConstraintTemplates

CI/CD: opa eval or Conftest

Cloud/IaC: Terraform, ARM/Bicep scanning

Chapter 9 – Policy Bundling and Distribution

Bundles package policies + data in tarballs with .manifest metadata for versioning.
Used for:

Global rollout

Tenant-specific overlays

Canary testing and rollback

Chapter 10 – Linting, Style, and CI

Tools: opa fmt, Regal (official linter).
Enforce:

Clarity over cleverness

One main decision per module

Consistent naming (allow, violation)

Prefer v1 syntax (if, in, contains, every)

Integrate with CI:

opa fmt --rego-v1 --diff ./policies
regal lint ./policies
opa test ./policies

PART V – PERFORMANCE, OPTIMIZATION & FORMAL SEMANTICS
Chapter 11 – Performance Engineering
Pattern	Anti-Pattern
Use objects/sets for O(1) lookup	Iterate over arrays for membership
Precompute via comprehensions	Nested loops over large collections
Use --profile to detect hotspots	Implicit N² joins
Chapter 12 – Formal Semantics (Doctorate Level)
12.1 Declarative Model

Rego program P is a finite set of Horn clauses.
OPA evaluation = least fixpoint of operator F over interpretation lattice L.

Eval(P) = μX.F(X)

12.2 Unification

mgu(t₁, t₂) = most general unifier ensuring structural equality.

12.3 Negation and Stratification

Negation defined as:

not p(X) ⇔ ¬∃θ. Eval(p(Xθ)) = true


Program is stratified if dependency graph has no negative cycles.

12.4 Partial Evaluation

Compile-time specialization:

PE(P, Known) → P′
Eval(P′, Unknown) ≡ Eval(P, Known ∪ Unknown)

12.5 Complexity

Lookup O(1)

Iteration O(n)

Nested comprehension O(n²)

Safe recursion → O(depth × fan-out)

PART VI – ENTERPRISE PATTERNS & GOVERNANCE
Chapter 13 – Multi-Layer Policy Architecture

Global base policies: security/compliance invariants

Domain policies: per-product or team

Tenant overlays: safe customization

Use Regal rules to enforce change control by tier (BLOCK/OVERRIDE/WARNING).

Chapter 14 – Observability and Audit

Centralize decision logs → SIEM.
Include: input, decision_id, result, bundle_revision.
Link bundle revisions to Git commits for full policy lineage.

Chapter 15 – Stateful and Temporal Extensions

OPA is stateless; externalize state to DB or event systems.
Feed snapshot into input for time-window evaluation (rate-limiting, anomaly detection).

PART VII – ADVANCED RESEARCH TOPICS
Chapter 16 – GraphQL, API, and Data Policy Models

Use Rego to analyze query ASTs for:

Field-level authorization

Query depth/cost limits

Tenant data isolation

Rego’s JSON-native nature makes schema reasoning natural.

Chapter 17 – Agentic Systems & LLM Integration

Emerging pattern:

LLM drafts Rego from requirements.

OPA executes tests.

Regal enforces style and semantics.

Human review closes the loop.

Ensures AI-authored policies are verifiable and auditable.

PART VIII – QUICK REFERENCE, CHEAT SHEET & GLOSSARY
Chapter 18 – Rego Cheat Sheet
package example
import rego.v1

default allow := false

allow if { is_admin }
allow if { is_owner; input.action == "read" }

is_admin if { "admin" in input.user.roles }
is_owner if { input.resource.owner_id == input.user.id }

violation contains {"msg": msg} if {
  not allow
  msg := "access denied"
}

Chapter 19 – Glossary (Condensed)
Term	Definition
OPA	Open Policy Agent – general-purpose decision engine
Rego	Declarative policy language based on Datalog
Bundle	Versioned tarball packaging policies and data
Partial Rule	Defines members of a virtual set/object
Partial Evaluation	Compile-time specialization of a policy
Decision Document	JSON result of OPA evaluation
ConstraintTemplate	Gatekeeper CRD defining reusable logic
Safety	Guarantee that all variables are grounded
Regal	Official Rego linter/analyzer
Fixpoint	Stable state where no new facts derive
Sidecar	Deployment pattern embedding OPA locally
Stratification	Absence of negation cycles in dependencies
NAF	Negation-as-Failure semantics
PE	Partial Evaluation abbreviation
ABAC/RBAC	Attribute/Role-based access control
Decision Address	data.<package>.<rule> query path
Appendix A – Formal Inference Rules

Rule Evaluation

(B₁,…,Bₙ) ⊢ H  
───────────────  
Eval(P) ⊢ H


Negation

P ⊬ B ⇒ Eval(P) ⊢ not B


Unification

mgu(t₁,t₂)=σ ⇒ (σ ⊢ t₁=t₂)

Appendix B – Evaluation DAG Visualization
allow ──> is_admin
      └─> is_owner ──> input.resource.owner_id


OPA builds such DAGs internally for incremental re-evaluation.

Appendix C – Reference Implementations

Minimal OPA evaluator (Go)

WASM integration example

Conftest and CI pipeline samples


Rego Language Complete Reference Guide
This reference compiles all aspects of Rego, the policy language for Open Policy Agent (OPA), into a unified document. It draws from official OPA documentation (as of November 25, 2025), including the policy language, policy reference, style guide, and advanced topics from community and blog posts. The guide is exhaustive, with formal explanations, extensive examples, proofs of correctness, pitfalls, and optimizations. Terms are defined inline and compiled in the glossary.
Version Note: Based on OPA 1.0+ (released December 2024), where import rego.v1 enables modern syntax by default. Pre-1.0 code uses --v0-compatible; future.keywords is deprecated.
Table of Contents

Introduction
Language Specification
Syntax Overview
Core Concepts
Rules and Control Flow
Variables and References
Operators
Iteration and Comprehensions
Built-in Functions
Testing
Performance Considerations
Best Practices


Introduction
What is Rego?
Rego is OPA's native query language, inspired by Datalog and extended to support structured document models such as JSON. It is purpose-built for expressing policies over complex hierarchical data structures.
Key Characteristics

Declarative: Focus on what queries should return, not how to execute them
Purpose-built: Designed for policy decisions over structured documents
Assertions-based: Queries are assertions on data stored in OPA
Optimizable: OPA can optimize queries for better performance


Language Specification
Reserved Keywords
The following words are reserved and cannot be used as variable names, rule names, or dot-access style reference arguments:
textas default else every false
if import in input not
null package some true with
data
Note: contains is not a reserved keyword but rather compiler sugar that gets desugared during compilation.
Grammar (Approximate EBNF-Style)
Important: This grammar is a conceptual approximation for documentation purposes. The actual OPA grammar is defined in Go code (ast/parser.go). Use this as a learning aid, not as a formal specification.
ebnfmodule = package { import } policy
package = "package" ref
import = "import" ref [ "as" var ]
policy = { rule }
rule = [ "default" ] rule-name [ rule-key ] [ rule-value ] [ "if" ] rule-body
rule-name = var | ref
rule-key = "[" term "]" | "contains" term
rule-value = "=" term | ":=" term
rule-body = "{" query "}" | literal
query = literal { ( ";" | LF ) literal }
literal = ( some-decl | expr | "not" expr ) { with-modifier }
with-modifier = "with" term "as" term
some-decl = "some" var { "," var } [ "in" expr ]
expr = term
     | expr infix-operator expr
     | unary-operator expr
     | call-expr
     | "(" expr ")"
     | "every" var [ "," var ] "in" expr "{" query "}"
call-expr = ref "(" [ term { "," term } ] ")"
term = ref | var | scalar | array | object | set | array-compr | object-compr | set-compr
array-compr = "[" term "|" query "]"
set-compr = "{" term "|" query "}"
object-compr = "{" object-item "|" query "}"
infix-operator = ":=" | "=" | "==" | "!=" | "<" | ">" | ">=" | "<="
               | "+" | "-" | "*" | "/" | "%" | "&" | "|" | "in"
unary-operator = "-"
ref = ref-base { ref-arg }
ref-base = var | call-expr
ref-arg = "." var | "[" ( scalar | var | "_" ) "]"
var = ( ALPHA | "_" ) { ALPHA | DIGIT | "_" }
scalar = string | NUMBER | TRUE | FALSE | NULL
string = STRING | raw-string
raw-string = "`" { CHAR-"`" } "`"
array = "[" [ term { "," term } ] "]"
object = "{" [ object-item { "," object-item } ] "}"
object-item = scalar-or-var ":" term
scalar-or-var = scalar | var
set = "{" term { "," term } "}" | "set(" ")"
Key Points:

References can only begin with variables or function calls (not literal arrays/objects)
Object keys must be scalars or variables (not arbitrary references)
The in operator creates expressions, not a separate "membership term" type
contains is syntactic sugar, not part of the core grammar


Syntax Overview
Comments
rego# Single-line comment starts with #
# Comments can document rules
# Multiple comment lines are common
allow if {
    input.user == "admin" # inline comments too
}
Modules and Packages
rego# Every module must declare a package
package example.authz
# Packages namespace your rules
# Multiple files can contribute to the same package

Core Concepts
Scalar Values
Rego supports the following scalar types:
rego# Strings (two types)
greeting := "Hello" # Standard string with escaping
raw_path := `C:\Users\file.txt` # Raw string (no escape sequences)
# Numbers (integers and floats)
max_height := 42
pi := 3.14159
# Booleans
allowed := true
denied := false
# Null
location := null
String Types:

Standard strings: Use double quotes, support escape sequences (\n, \t, \", etc.)
Raw strings: Use backticks, no escape sequences interpreted (useful for regex)

Composite Values
Arrays
Ordered, zero-indexed collections:
rego# Array declaration
numbers := [1, 2, 3]
mixed := [1, "two", 3.0, true]
# Array access
first := numbers[0]
last := numbers[count(numbers)-1]
# Destructuring assignment
[x, y, z] := [1, 2, 3]
[_, second, _] := ["a", "b", "c"] # second is "b"
Important: Literal arrays cannot start a reference chain:
rego# ❌ Invalid: [1, 2, 3][0].foo
# ✓ Valid: arr := [1, 2, 3]; arr[0]
Objects
Unordered key-value collections:
rego# Object declaration
person := {
    "name": "Alice",
    "age": 30,
    "active": true
}
# Object access (two forms)
name1 := person["name"] # Bracket notation
name2 := person.name # Dot notation (only for simple keys)
# Any scalar type can be a key
ports := {
    80: ["10.0.0.1"],
    443: ["10.1.1.1"],
    true: "boolean key",
    null: "null key"
}
Object Key Restrictions:

Keys must be scalar values (strings, numbers, booleans, null)
Keys cannot be references like x.y (only variables that evaluate to scalars)
When using variables as keys, they must be bound to scalar values

rego# ✓ Valid
key := "name"
obj := {key: "Alice"} # key evaluates to scalar "name"
# ❌ Invalid
obj := {input.field: "value"} # Cannot use reference as key
Sets
Unordered collections of unique values:
rego# Set declaration
s1 := {1, 2, 3}
s2 := {3, 2, 1}
# Sets are equal regardless of order
result := s1 == s2 # true
# Empty set (special syntax required)
empty := set()
# Empty object (NOT a set)
empty_obj := {}
# Checking membership
has_one := 1 in s1 # true
Critical Distinction:

set() is an empty set
{} is an empty object, NOT an empty set
Non-empty sets use {1, 2, 3} syntax
Non-empty objects use {"key": value} syntax


Rules
Basic Rule Syntax
Modern Rego (OPA 0.60+) uses the if keyword:
rego# Boolean rule with 'if' keyword (recommended)
allow if {
    input.user == "admin"
}
# Equivalent forms
allow if input.user == "admin" # Single expression
allow := true if input.user == "admin" # Explicit true value
# Legacy form (still valid but not recommended)
allow {
    input.user == "admin"
}
Complete Definitions
Rules that define a single value:
rego# Simple constant
max_memory := 32
# Conditional complete rule
max_memory := 32 if {
    input.user == "admin"
}
max_memory := 4 if {
    input.user == "guest"
}
# Default value (note: uses = not :=)
default max_memory = 1
Default Syntax:
rego# Correct
default allow = false
default grade(_) = "F"
# Incorrect
default allow := false # ❌ Don't use :=
Incremental Definitions (Partial Rules)
Rules that build sets or objects incrementally:
Partial Sets
rego# Modern syntax with 'contains' (recommended)
hostnames contains name if {
    some site in sites
    some server in site.servers
    name := server.hostname
}
# Legacy syntax (still valid)
hostnames[name] if {
    some site in sites
    some server in site.servers
    name := server.hostname
}
Note: contains is not a reserved keyword but compiler sugar that makes intent clearer.
Partial Objects
rego# Partial object rule
user_roles[user] := role if {
    some assignment in input.assignments
    user := assignment.user
    role := assignment.role
}
Functions
User-defined functions with parameters:
rego# Function with single output
trim_and_split(s) := x if {
    t := trim(s, " ")
    x := split(t, ".")
}
# Function with multiple parameters
add(x, y) := x + y
# Conditional functions (multiple definitions)
grade(score) := "A" if score >= 90
grade(score) := "B" if { score >= 80; score < 90 }
grade(score) := "C" if { score >= 70; score < 80 }
# Default function value (uses =)
default grade(_) = "F"
# Pattern matching in function arguments
extract_first([x, _]) := x
extract_second([_, x]) := x
Function Rules:

Functions must have exactly one output
Multiple definitions are allowed (evaluated in order)
All definitions must produce the same value or conflict error occurs
Default values use = not :=

Reference Heads
Shorthand for nested structures:
rego# Direct nested assignment
fruit.apple.seeds := 12
fruit.orange.color := "orange"
# Equivalent to:
fruit := {
    "apple": {"seeds": 12},
    "orange": {"color": "orange"}
}
# With variables (dynamic construction)
users_by_role[role][id] := user if {
    some user in input.users
    id := user.id
    role := user.role
}
# Partial sets with reference heads
users_by_country[country] contains u.id if {
    some u in input.users
    country := u.country
}

Variables and References
Variable Declaration and Assignment
rego# Assignment with :=
x := 42
# Variables in expressions
result if {
    x := input.value
    x > 10
}
# Multiple variables
coordinates if {
    x := input.x
    y := input.y
    x > 0
    y > 0
}
Safety Requirement: Variables must be "safe" (defined) before use in certain contexts:

In comparisons (when using ==, !=, etc.)
In negated expressions
As function arguments

References
References access nested documents and can only begin with:

Variables
input or data (implicitly imported)
Function calls

rego# Valid reference starts
hostname := sites[0].servers[1].hostname # from variable
user := input.request.user # from input
role := data.roles.admin # from data
result := get_config().timeout # from function call
# Variable keys (iteration)
hostnames := {h | h := sites[_].servers[_].hostname}
# Underscore for unused indices
all_names := servers[_].name
# Multiple variables
result if {
    sites[i].servers[j].name == "web-0"
    hostname := sites[i].servers[j].hostname
}
Invalid Reference Starts:
rego# ❌ Cannot start reference with literal composite value
x := [1, 2, 3][0] # Invalid
y := {"a": 1}.a # Invalid
z := {1, 2, 3}[1] # Invalid
# ✓ Must assign first
arr := [1, 2, 3]
x := arr[0] # Valid
The some Keyword
Explicitly declare local variables (recommended for clarity):
rego# Without 'some' (implicit existential quantification)
result if {
    sites[i].region == "west"
    sites[i].servers[j].name == "db-0"
}
# With 'some' (explicit - recommended)
result if {
    some i, j
    sites[i].region == "west"
    sites[i].servers[j].name == "db-0"
}
# With 'in' operator (modern style - most readable)
result if {
    some site in sites
    site.region == "west"
    some server in site.servers
    server.name == "db-0"
}
Benefits of some:

Makes intent explicit
Prevents accidental variable capture from outer scope
Improves code readability


Operators
Assignment and Equality
rego# Assignment (:=) - declares and assigns local variable
x := 100
# Comparison (==) - tests equality, requires both sides defined
result if x == 100
# Unification (=) - combines assignment and comparison
# Assigns if unbound, compares if bound
[x, "world"] = ["hello", y] # x = "hello", y = "world"
When to Use Each:

Use := for clear assignment (recommended)
Use == for clear comparison (recommended)
Use = for pattern matching and unification (advanced)

Comparison Operators
regoa == b # Equal
a != b # Not equal
a < b # Less than
a <= b # Less than or equal
a > b # Greater than
a >= b # Greater than or equal
Arithmetic Operators
regox + y # Addition
x - y # Subtraction
x * y # Multiplication
x / y # Division
x % y # Modulo (remainder)
Binary Operators
regox & y # Bitwise AND
x | y # Bitwise OR
Membership and Iteration: in Operator
The in operator is used for membership testing and iteration. It creates expressions, not terms.
rego# Membership testing (returns true/false)
3 in [1, 2, 3] # true
"foo" in {"foo": "bar"} # true (checks values)
"foo" in {"foo"} # true (set membership)
# With key-value pairs
"foo", "bar" in {"foo": "bar"} # true (object key-value)
2, "baz" in ["foo", "bar", "baz"] # true (array index-value)
# Negation
result if not "admin" in user.roles
# Iteration with 'some' (binds variables)
usernames contains name if {
    some user in users
    name := user.name
}
# With index/key
indices contains i if {
    some i, "target" in array
}
# Object iteration
pairs contains [k, v] if {
    some k, v in object
}
Key Points:

in is an operator that creates expressions
Returns boolean when used for membership testing
Binds variables when used with some for iteration
Can take one argument (value) or two arguments (key/index, value)


Iteration and Comprehensions
Implicit Iteration
rego# Iterate over arrays
values := arr[_] # All values
values := arr[i] # All index/value pairs (i gets bound)
# Iterate over objects
keys := obj[key] # All keys (key gets bound)
values := obj[_] # All values
pairs := obj[key] # All key/value pairs
# Iterate over sets
members := set[val] # All members (val gets bound)
Explicit Iteration with some in
Modern, recommended style:
rego# Array iteration
some val in array # Iterate values
some i, val in array # Iterate index/value pairs
# Object iteration
some val in object # Iterate values
some key, val in object # Iterate key/value pairs
# Set iteration
some val in set # Iterate values
# Nested iteration
hostnames contains hostname if {
    some site in sites
    some server in site.servers
    hostname := server.hostname
}
Array Comprehensions
Build arrays from queries:
rego# Format: [ <term> | <body> ]
# Simple mapping
squares := [x * x | some x in numbers]
# With filtering
evens := [x | some x in numbers; x % 2 == 0]
# Nested iteration
pairs := [[x, y] |
    some x in [1, 2, 3]
    some y in ["a", "b"]
]
# Complex transformation
user_emails := [email |
    some user in users
    user.active == true
    email := user.email
]
Set Comprehensions
Build sets from queries:
rego# Format: { <term> | <body> }
# Remove duplicates
unique := {x | some x in array}
# Filter and transform
adult_names := {p.name |
    some p in people
    p.age >= 18
}
# Flatten nested collections
all_tags := {tag |
    some item in items
    some tag in item.tags
}
Object Comprehensions
Build objects from queries:
rego# Format: { <key>: <value> | <body> }
# Create mapping
name_to_age := {person.name: person.age |
    some person in people
}
# With computation
doubled := {k: v * 2 |
    some v in numbers[k]
}
# Complex aggregation
user_permissions := {user.id: perms |
    some user in users
    perms := [p | some p in permissions; p.user_id == user.id]
}
Universal Quantification (FOR ALL)
Express "for all" conditions using three approaches:
1. Using every (Modern, Recommended)
rego# All items must satisfy condition
all_valid if {
    every item in items {
        item.status == "approved"
    }
}
# With index/key
all_numbered_correctly if {
    every i, item in items {
        item.id == i
    }
}
# Multiple conditions in body
all_healthy if {
    every server in servers {
        server.status == "up"
        server.cpu < 80
        server.memory < 90
    }
}
Note: The every keyword iterates over the collection and ensures the body is true for each element. If any element fails, the entire expression is undefined.
2. Using Negation (Helper Rule Pattern)
rego# Define what we don't want
all_valid if not any_invalid
any_invalid if {
    some item in items
    item.status != "approved"
}
# More complex example
no_bitcoin_miners if not any_bitcoin_miner
any_bitcoin_miner if {
    some app in apps
    app.name == "bitcoin-miner"
}
3. Using Comprehensions
rego# Count approach
all_valid if {
    valid := {x | some x in items; x.status == "valid"}
    count(valid) == count(items)
}
# Set equality approach
all_approved if {
    approved := {x | some x in items; x.status == "approved"}
    unapproved := {x | some x in items; x.status != "approved"}
    count(unapproved) == 0
}

Negation
Negation in Rego expresses that something should NOT exist or be true.
rego# Simple negation
deny if not allow
# Negation with expressions
invalid if not startswith(input.name, "valid_")
# Check non-membership
unauthorized if not input.user in authorized_users
# Negation with function calls
invalid_token if not io.jwt.verify_hs256(input.token, "secret")
Safety Requirements
Variables in negated expressions must appear in a non-negated expression first:
rego# ✓ Safe: user is bound before negation
valid if {
    user := input.user # user bound here
    not blacklisted[user] # safe to negate
}
# ❌ Unsafe: user only appears in negated expression
invalid if {
    not blacklisted[user] # compile error: unsafe variable
}
Common Pitfall: Existential vs Universal
The != operator in iterations has existential semantics, not universal:
rego# ❌ Common mistake: "Is there any element not equal to 'foo'?"
# This returns true if ANY element is not "foo"
has_non_foo if {
    arr[_] != "foo"
}
# ✓ Correct for "Is 'foo' not in the array?"
foo_not_present if {
    not "foo" in arr
}
# ✓ Or using helper rule (universal quantification)
all_are_foo if not any_not_foo
any_not_foo if {
    some x in arr
    x != "foo"
}
Understanding the Difference:

arr[_] != "foo" means: "There exists an element in arr that is not foo" (existential)
not "foo" in arr means: "foo is not a member of arr"
To express "all elements are foo", use negation of existential: not any_not_foo


Built-in Functions
Built-in functions provide common operations. They follow the syntax function(arg1, arg2, ...).
Core Categories
1. Aggregates
regocount([1, 2, 3]) # 3
sum([1, 2, 3]) # 6
product([2, 3, 4]) # 24
max([1, 5, 3]) # 5
min([1, 5, 3]) # 1
sort([3, 1, 2]) # [1, 2, 3]
all([true, true, false]) # false
any([true, false, false]) # true
2. Arrays
regoarray.concat([1, 2], [3, 4]) # [1, 2, 3, 4]
array.slice([1, 2, 3, 4], 1, 3) # [2, 3]
array.reverse([1, 2, 3]) # [3, 2, 1]
3. Sets
regointersection({1, 2, 3}, {2, 3, 4}) # {2, 3}
union({1, 2}, {2, 3}) # {1, 2, 3}
set_diff({1, 2, 3}, {2, 3}) # {1}
4. Objects
regoobject.get(obj, "key", "default") # Get with default value
object.remove(obj, ["key1", "key2"]) # Remove keys
object.union(obj1, obj2) # Merge (obj2 wins conflicts)
object.filter(obj, ["k1", "k2"]) # Keep only specified keys
json.filter(obj, ["a/b", "c"]) # Filter by JSON paths
5. Strings
regoconcat("/", ["a", "b", "c"]) # "a/b/c"
contains("hello", "ell") # true
startswith("hello", "hel") # true
endswith("hello", "lo") # true
format_int(42, 16) # "2a" (hex)
indexof("hello", "l") # 2
lower("HELLO") # "hello"
upper("hello") # "HELLO"
replace("hello", "l", "L") # "heLLo"
split("a,b,c", ",") # ["a", "b", "c"]
sprintf("Hello %s", ["world"]) # "Hello world"
substring("hello", 1, 3) # "el"
trim(" hello ", " ") # "hello"
trim_space(" hello ") # "hello"
trim_prefix("hello", "hel") # "lo"
trim_suffix("hello", "lo") # "hel"
6. Regular Expressions
regoregex.is_valid("[a-z]+") # true
regex.match("^[a-z]+$", "hello") # true
regex.find_n("a.", "banana", 2) # ["ba", "an"]
regex.split("[,;]", "a,b;c") # ["a", "b", "c"]
7. Numbers
regoabs(-42) # 42
ceil(3.14) # 4
floor(3.14) # 3
round(3.5) # 4
numbers.range(1, 5) # [1, 2, 3, 4]
8. Encoding/Decoding
regobase64.encode("hello") # "aGVsbG8="
base64.decode("aGVsbG8=") # "hello"
base64url.encode("hello") # URL-safe base64
base64url.decode("...") # URL-safe base64 decode
hex.encode("hello") # "68656c6c6f"
hex.decode("68656c6c6f") # "hello"
json.marshal({"a": 1}) # "{\"a\":1}"
json.unmarshal("{\"a\":1}") # {"a": 1}
urlquery.encode("a=1&b=2") # "a%3D1%26b%3D2"
urlquery.decode("a%3D1") # "a=1"
yaml.marshal({"a": 1}) # YAML string
yaml.unmarshal("a: 1") # {"a": 1}
9. Type Checking
regois_array([1, 2]) # true
is_boolean(true) # true
is_null(null) # true
is_number(42) # true
is_object({"a": 1}) # true
is_set({1, 2}) # true
is_string("hello") # true
type_name([1, 2, 3]) # "array"
type_name({"a": 1}) # "object"
10. Cryptography
regocrypto.md5("hello") # MD5 hash
crypto.sha1("hello") # SHA1 hash
crypto.sha256("hello") # SHA256 hash
crypto.x509.parse_certificates(pem) # Parse X.509 certs
11. JWT
regoio.jwt.decode(token) # [header, payload, signature]
io.jwt.verify_hs256(token, secret) # Verify with HMAC SHA-256
io.jwt.verify_rs256(token, cert) # Verify with RSA SHA-256
io.jwt.verify_es256(token, cert) # Verify with ECDSA SHA-256
io.jwt.verify_ps256(token, cert) # Verify with RSA-PSS SHA-256
io.jwt.encode_sign_raw(headers, payload, key) # Create signed JWT
12. Time
regotime.now_ns() # Current time (nanoseconds since epoch)
time.parse_ns("2006-01-02", "2024-01-15") # Parse to nanoseconds
time.parse_rfc3339_ns("2024-01-15T10:00:00Z") # Parse RFC3339
time.date(ns) # [year, month, day]
time.clock(ns) # [hour, minute, second]
time.weekday(ns) # "Monday", "Tuesday", etc.
13. HTTP
regohttp.send({
    "method": "GET",
    "url": "https://example.com",
    "headers": {"Accept": "application/json"}
})
# Returns: {"status": 200, "body": ..., "headers": ...}
14. Network
regonet.cidr_contains("192.168.1.0/24", "192.168.1.10") # true
net.cidr_expand("192.168.1.0/30") # List of IPs in range
net.cidr_intersects("10.0.0.0/8", "10.1.0.0/16") # true
net.cidr_merge(["10.0.0.0/16", "10.1.0.0/16"]) # Merge ranges
15. UUID/ULID
regouuid.rfc4122("some-string") # Generate RFC4122 UUID
ulid.generate() # Generate ULID
16. Graph Operations
rego# Graph reachability
graph.reachable(graph, ["start"]) # Nodes reachable from start
# Walk structure (not specifically a "graph" function)
walk(obj) # Walk through nested structure
# Returns [[path, value], ...]
17. Rego Metadata
regorego.metadata.chain() # Get annotation chain
rego.metadata.rule() # Get current rule's metadata
18. Units
regounits.parse("10GB") # Parse size with units
units.parse_bytes("10MB") # Parse to bytes
Built-in Function Error Handling
By default, built-in errors make expressions undefined (treated as false):
rego# If JWT is invalid, this expression is undefined
valid_token if {
    io.jwt.verify_hs256(input.token, "secret")
}
# Can check for errors with negation
invalid_token if {
    not io.jwt.decode(input.token)
}
Enable strict error mode to treat errors as exceptions:

CLI: opa eval --strict-builtin-errors
API: strict-builtin-errors query parameter


Testing
Test Structure
Test rules must start with test_:
regopackage example_test
import data.example
# Basic test
test_allow_admin if {
    example.allow with input as {"user": "admin"}
}
# Test with negation
test_deny_guest if {
    not example.allow with input as {"user": "guest"}
}
# Test with data override
test_with_data if {
    example.allow
        with input as {"user": "alice"}
        with data.roles as {"admin": ["alice"]}
}
# Test expected value
test_grade if {
    example.grade(95) == "A"
}
# Test multiple conditions
test_complex_policy if {
    result := example.evaluate with input as test_input
    result.allowed == true
    result.reason == "authorized"
}
Running Tests
Bash# Run all tests in current directory
opa test .
# Verbose output
opa test . -v
# Run specific test file
opa test policy_test.rego
# Run tests matching pattern
opa test . --run test_allow
# With coverage report
opa test . --coverage
# Show coverage for specific files
opa test . --coverage --format=json
Testing Best Practices

Organize tests in separate files: Use _test.rego suffix
Test both positive and negative cases: Verify both success and failure paths
Use descriptive test names: test_allow_admin_users not test1
Mock external dependencies: Use with to override http.send, time.now_ns, etc.
Test edge cases: Empty inputs, null values, boundary conditions
Keep tests focused: One logical assertion per test
Example test suite:

regopackage authz_test
import data.authz
# Setup test data
test_input_admin := {
    "user": "alice",
    "role": "admin",
    "resource": "users"
}
test_input_user := {
    "user": "bob",
    "role": "user",
    "resource": "users"
}
# Positive tests
test_admin_can_read if {
    authz.allow with input as test_input_admin
}
test_admin_can_write if {
    authz.allow with input as object.union(test_input_admin, {"action": "write"})
}
# Negative tests
test_user_cannot_write if {
    not authz.allow with input as object.union(test_input_user, {"action": "write"})
}
# Edge case tests
test_missing_user_denied if {
    not authz.allow with input as {"resource": "users"}
}
test_null_role_denied if {
    not authz.allow with input as {"user": "charlie", "role": null}
}

Performance Considerations
Expression Ordering
OPA evaluates expressions left to right. Put cheaper, more selective conditions first:
rego# ✓ Good: Fast check first
allow if {
    input.method == "GET" # Fast: simple equality
    expensive_validation() # Slow: complex computation
}
# ❌ Bad: Expensive check for all inputs
allow if {
    expensive_validation() # Evaluated for everything
    input.method == "GET"
}
Indexing
OPA automatically indexes rules for efficient lookups:
rego# ✓ Indexed lookup (O(1) average case)
user := users["alice"]
role := user_roles[input.user]
# ❌ Linear scan (O(n))
user := u if {
    some u in users
    u.id == "alice"
}
Use keyed lookups whenever possible.
Avoid Redundant Computation
Use variable assignment to compute values once:
rego# ❌ Bad: Computes sum three times
inefficient if {
    sum(numbers) > 100
    sum(numbers) < 1000
    result := sum(numbers)
}
# ✓ Good: Compute once, reuse
efficient if {
    total := sum(numbers)
    total > 100
    total < 1000
}
Comprehension Efficiency
Comprehensions create intermediate data structures. Use them wisely:
rego# ✓ Good: Direct check
has_admin if {
    some user in users
    "admin" in user.roles
}
# ❌ Unnecessary: Creates intermediate set
has_admin if {
    admins := {u | some u in users; "admin" in u.roles}
    count(admins) > 0
}
Set Membership vs Array Iteration
Sets provide O(1) membership testing:
rego# Define as set for fast lookup
admin_users := {"alice", "bob", "charlie"}
# ✓ Fast: O(1) set membership
allow if input.user in admin_users
# ❌ Slower: O(n) array scan
admin_array := ["alice", "bob", "charlie"]
allow if input.user in admin_array # Still works but slower
Partial Evaluation and Compilation
For production deployments, use partial evaluation:
Bash# Compile policy for specific query
opa build -t wasm -e 'data.authz.allow' policy.rego
# Results in optimized bundle
Benefits:

Removes unused rules
Optimizes query paths
Reduces evaluation time

Caching with Memoization
Built-in functions are automatically memoized within a query:
rego# http.send called only once, result cached
result if {
    resp := http.send({"method": "GET", "url": "https://api.example.com"})
    resp.status == 200
    resp.body.valid == true
}

Best Practices
Code Organization
Follow a consistent structure:
rego# 1. Package declaration
package authz.api.v1
# 2. Imports
import data.users
import data.roles
import future.keywords # For forward compatibility
# 3. Constants and default values
default allow = false
admin_role := "administrator"
# 4. Helper rules (private conventions)
_is_admin if {
    some role in input.user.roles
    role == admin_role
}
_is_resource_owner if {
    input.user.id == input.resource.owner
}
# 5. Main rules (public API)
allow if {
    _is_admin
}
allow if {
    input.action == "read"
    _is_resource_owner
}
# 6. Additional exported rules
deny contains msg if {
    not allow
    msg := "Access denied: insufficient permissions"
}
Naming Conventions
Rules:

Use snake_case for all rule names
Use descriptive, verb-based names for boolean rules: has_permission, is_valid
Use noun-based names for value rules: user_permissions, resource_owner
Prefix internal helpers with _ (convention, not enforced)
Variables:
Use descriptive names: user, resource, permission
Avoid single letters except in comprehensions: i, j, k, x
Use plural for collections: users, roles, permissions

rego# ✓ Good naming
user_has_permission if { ... }
valid_ip_address if { ... }
allowed_actions contains action if { ... }
# ❌ Poor naming
p if { ... }
check if { ... }
x if { ... }
Use Modern Keywords
Prefer modern Rego syntax (OPA 0.60+):
rego# ✓ Modern style
allow if {
    some user in users
    user.active == true
}
hostnames contains name if {
    some site in sites
    some server in site.servers
    name := server.hostname
}
# ❌ Legacy style (still valid but not recommended)
allow {
    users[_].active == true
}
hostnames[name] {
    sites[_].servers[_].hostname = name
}
Error Handling and Validation
Always validate inputs:
rego# Check for required fields
valid_request if {
    not is_null(input.user)
    not is_null(input.resource)
    not is_null(input.action)
}
# Use defaults for optional fields
timeout := input.timeout if input.timeout
default timeout = 30
# Handle missing data gracefully
user_roles := data.roles[input.user] if data.roles[input.user]
default user_roles = []
Document Your Policies
Use metadata annotations:
rego# METADATA
# title: API Authorization Policy
# description: |
# Controls access to API resources based on user roles
# and resource ownership. Implements RBAC with ownership checks.
# authors:
# - Security Team <security@example.com>
# organizations:
# - Example Corp
package authz.api
# METADATA
# title: Admin Access Rule
# description: Grants full access to users with admin role
# scope: rule
allow if {
    _is_admin
}
Avoid Common Pitfalls
1. Misunderstanding != in Loops
rego# ❌ Wrong: "Is there any element not equal to 'admin'?"
# Returns true even if some elements ARE 'admin'
has_non_admin if {
    input.roles[_] != "admin" # Existential: "exists non-admin"
}
# ✓ Correct: "Is 'admin' not in the array?"
admin_not_present if {
    not "admin" in input.roles
}
# ✓ Correct: "Are all elements not admin?" (universal)
no_admins if not any_admin
any_admin if {
    some role in input.roles
    role == "admin"
}
2. Unsafe Variable in Negation
rego# ❌ Unsafe: x only in negated expression
bad_rule if {
    not blacklist[x] # Compile error: unsafe variable
}
# ✓ Safe: x bound first
good_rule if {
    x := input.user
    not blacklist[x]
}
3. Reference Head Conflicts
rego# ❌ Conflict: Can't define both
fruit.apple := "red"
fruit.apple.color := "red" # Error: conflicts with complete rule
# ✓ Correct: Use consistent structure
fruit.apple.color := "red"
fruit.apple.taste := "sweet"
4. Object Key Restrictions
rego# ❌ Invalid: Reference as key
obj := {input.field: "value"}
# ✓ Valid: Variable as key (must be scalar)
key := input.field
obj := {key: "value"}
# ✓ Valid: Literal scalar keys
obj := {"name": "Alice", 123: "number key"}
5. Confusing Empty Set and Empty Object
rego# Empty object (NOT a set)
empty_obj := {}
is_object(empty_obj) # true
# Empty set (special syntax)
empty_set := set()
is_set(empty_set) # true
# Non-empty set
my_set := {1, 2, 3}
is_set(my_set) # true
Testing Strategy

Unit test individual rules: Test each rule in isolation
Integration test policies: Test complete policy evaluation
Test with realistic data: Use production-like test cases
Mock external calls: Override http.send, time.now_ns, etc.
Measure coverage: Aim for high coverage of rules and branches

regopackage policy_test
# Unit test
test_is_admin_true if {
    data.policy._is_admin with input.user.role as "admin"
}
# Integration test
test_admin_full_access if {
    data.policy.allow
        with input as {
            "user": {"id": "alice", "role": "admin"},
            "action": "delete",
            "resource": {"id": "123"}
        }
}
# Mock external call
test_with_time_mock if {
    data.policy.within_business_hours
        with time.now_ns as 1640000000000000000 # Fixed timestamp
}
Policy Structure Best Practices
Small, focused packages:
rego# ✓ Good: Focused package
package authz.api.users
# ❌ Bad: Everything in one package
package authz
Reusable helper rules:
rego# Define common helpers
_is_admin if "admin" in input.user.roles
_is_owner if input.user.id == input.resource.owner
# Reuse in multiple rules
allow if _is_admin
allow if { input.action == "read"; _is_owner }
Separate concerns:
rego# policy.rego - Business logic
package authz
allow if { ... }
# data.rego - Data definitions
package authz
admin_users := {"alice", "bob"}
# test.rego - Tests
package authz_test
test_allow if { ... }
Performance Checklist

 Put selective conditions first in rules
 Use indexed lookups (direct key access) over scans
 Compute expensive values once, store in variables
 Use sets for membership testing when possible
 Avoid unnecessary comprehensions
 Consider partial evaluation for production
 Profile policies with opa eval --profile


Additional Language Features
The with Keyword
Override values during rule evaluation:
rego# Override input
test_admin if {
    allow with input as {"user": "admin", "action": "read"}
}
# Override data
test_with_roles if {
    allow
        with input.user as "alice"
        with data.roles as {"alice": ["admin"]}
}
# Override built-in functions
test_time_dependent if {
    within_hours
        with time.now_ns as 1640000000000000000
}
# Override custom functions
test_with_mock if {
    validate_token
        with verify_signature as mock_verify
}
# Multiple overrides
test_complete if {
    allow
        with input.user as "bob"
        with data.permissions as test_permissions
        with http.send as mock_http_send
}
Scope: The with keyword only affects the expression it's attached to.
The else Keyword
Create ordered rule evaluation (use sparingly):
rego# Evaluated in order until first match
authorize := "allow" if {
    input.user == "admin"
} else := "deny" if {
    input.action == "delete"
} else := "allow" if {
    input.action == "read"
} else := "deny"
# Can be used for fallback values
priority := "high" if {
    input.severity >= 8
} else := "medium" if {
    input.severity >= 5
} else := "low"
Recommendation: Use else sparingly. Multiple rule definitions are often clearer:
rego# Often clearer than else chains
priority := "high" if input.severity >= 8
priority := "medium" if { input.severity >= 5; input.severity < 8 }
priority := "low" if input.severity < 5
default priority := "unknown"
Import Statement
Bring external documents into scope:
rego# Import entire document
import data.users
import data.roles
# Import with alias
import data.company.employees as staff
import input.request as req
# Use imported data
allow if {
    some user in staff
    user.id == req.user
}
Note: data and input are implicitly imported in every module.
Modules and Packages
Package Declaration
Every Rego file must start with a package declaration:
rego# Simple package
package example
# Nested package
package example.authz.api
# Package with special characters (use brackets)
package example["special-name"].policy
Rules:

Package names must be valid references
Can only contain strings in brackets
All rules in same package are exported together

Multi-file Packages
Multiple files can contribute to the same package:
rego# file1.rego
package authz
allow if _is_admin
# file2.rego
package authz
allow if _is_owner
# file3.rego
package authz
_is_admin if "admin" in input.user.roles
_is_owner if input.user.id == input.resource.owner
All files contribute to data.authz and must be consistent.
Package Organization
Recommended structure:
textpolicies/
├── authz/
│ ├── api.rego # API authorization
│ ├── api_test.rego # API tests
│ ├── admin.rego # Admin rules
│ └── helpers.rego # Shared helpers
├── data/
│ ├── roles.json # Role definitions
│ └── permissions.json # Permission mappings
└── lib/
    └── utils.rego # Reusable utilities

Schema Support
OPA supports JSON Schema annotations for type checking:
rego# METADATA
# schemas:
# - input: schema.input
# - data.users: schema.users
package policy
allow if {
    input.user.role == "admin" # Type-checked against schema
}
Use with opa eval --schema or opa check --schema to enable enhanced type checking.
Strict Mode
Enable additional compiler checks:
Bashopa check --strict policy.rego
Strict mode enforces:

No unused variables
No unused imports
Additional safety checks
Useful for catching subtle errors during development.


Summary of Key Concepts

Declarative Language: Express what should be true, not how to compute it
Modern Keywords: Use if, contains, some in, every for clarity
Safety First: Variables must be bound before use in certain contexts
Comprehensions: Powerful tools for transforming and filtering data
Universal Quantification: Use every, negation, or comprehensions
Testing: Essential for policy correctness, use with for mocking
Performance: Order matters, use indexing, avoid redundant computation
Best Practices: Clear naming, good structure, comprehensive testing


Quick Reference
Rule Types



































TypeSyntaxExampleCompletename := value if { ... }max := 100 if adminPartial Setname contains x if { ... }users contains u if { ... }Partial Objectname[key] := value if { ... }roles[u] := r if { ... }Functionname(x) := value if { ... }double(x) := x * 2Booleanname if { ... }allow if admin
Iteration Patterns
rego# Array
some x in arr # values
some i, x in arr # index, value
# Object
some v in obj # values
some k, v in obj # key, value
# Set
some x in set # members
# With underscore
arr[_] # values (implicit)
obj[_] # values (implicit)
Common Patterns
rego# Default value
default allow = false
# Helper rule (convention: prefix _)
_is_admin if "admin" in input.user.roles
# Universal quantification
all_valid if every x in items { x.valid }
# Existential check
has_admin if some x in users; x.role == "admin"
# Comprehension
admins := {u | some u in users; u.role == "admin"}
# With mocking
test_case if policy with input as test_input


1. Rego Cheat Sheet (Condensed)
1.1 Variable Operators





























OperatorMeaningRebind AllowedTypical Use:=AssignmentNoIntentional variable binding==Boolean equalityYes (values must be equal)Comparisons=UnificationYesPattern matching, destructuring
1.2 Rule Types

Complete rule:allow = true — one final value.
Partial rule:allow { cond } — many possible true statements.
Function rule:f(x) = y — deterministic mapping.

1.3 Logic

AND: expressions stacked vertically
OR: multiple rule bodies or cond1 or cond2
NOT: not cond
Universal: every x in xs { cond }
Existential: some x in xs or implicit in loops

1.4 Collections

Array: [1,2,3]
Set: {1,2,3} (unordered)
Object: {"a":1, "b":2}

1.5 Control

if in rule headers
in and contains

1.6 Imports
textimport future.keywords
import data.lib.utils as u
import input.request as req

2. Evaluation Model (Most Important)
Rego is declarative, search-based, and set-based, not procedural.
2.1 Rule Evaluation Principles

OPA evaluates all rule definitions, not line-by-line.
Rule bodies are conjunctions (logical ANDs).
Multiple bodies of the same rule are logical ORs.
Variables unify rather than assign sequentially.
Undefined ≠ false.

Example
textallow if {
    cond1
    cond2
}
Means:
allow is true if BOTH cond1 AND cond2 are provable simultaneously.
No order, no sequencing.
2.2 Diagram: Rule Evaluation Flow
text┌───────────────────────────────────────┐
          │ Query: data.allow │
          └───────────────────────────────────────┘
                          │
                          ▼
           Collect all rules named "allow"
                          │
        ┌───────────────┬───────────────┬───────────────┐
        ▼ ▼ ▼
  allow body A allow body B allow body C
   (ANDs) (ANDs) (ANDs)
        │ │ │
   provable? provable? provable?
        │ │ │
        ▼ ▼ ▼
   true/undef true/undef true/undef
        └───────────────┬───────────────┘
                        ▼
          OR combine all successful bodies
                        ▼
           Final allow = true OR undefined

3. Undefined vs False

























ExpressionMeaningallow = falseExplicitly falseallow produces no valueUndefinedOPA does not default undefined → false.Example:
textallow if some x in input.roles { x == "admin" }
If roles is empty → rule produces undefined, not false.
4. Iteration Semantics
4.1 Ordering Rules

Sets: iteration order is undefined.
Objects: iteration order is undefined.
Arrays: order is preserved, but evaluation is still non-procedural.
Example (non-procedural):

textresult := [x | x := input.arr[_]; x > 10]
Even though array order is stable, evaluation order is not guaranteed.
5. Type Conversion Built-ins
textto_number(x)
to_string(x)
to_set(x)
to_array(x)
to_object(x)
cast_number(x)
cast_string(x)
cast_bool(x)
Validation helpers:
textjson.is_valid(x)
yaml.is_valid(x)
Examples:
textscore := to_number(input.score)

6. Crypto Built-ins
textcrypto.hmac.sha256(key, data)
crypto.sha3_256(data)
crypto.pbkdf2(hash, password, salt, rounds)
crypto.bcrypt.hash(password)
crypto.bcrypt.compare(hash, password)
Example:
textvalid := crypto.bcrypt.compare(stored_hash, input.password)

7. Rule Ordering

There is no top-to-bottom priority.
All rules of the same name evaluate independently.
Multiple complete rules that produce different values → error.
Function rules must be deterministic.
Example conflict:

textf(1) = 2
f(1) = 3 # ERROR

8. Imports Best Practices
textimport future.keywords # strongly recommended
import data.lib.utils as u
import input.request as req
Why future.keywords?

Enables if in rule headers
Prevents legacy syntax conflicts


9. Debugging Tools
textprint("debug: ", value)
trace("reached")
CLI tools:
textopa eval --explain
opa eval --format pretty
opa eval --strict

10. Common Pitfalls
Pitfall 1 — Confusing {}
text{} # set
{"a":1} # object
Pitfall 2 — Using = when == intended
textx = y # unify (can rebind)
x == y # strict comparison
Pitfall 3 — Unsafe variables
text# WRONG
allow {
    x > 5
}
x was never defined.
Pitfall 4 — Negation misuse
textnot cond # means “cond cannot be proven”
Pitfall 5 — Misusing != in loops
!= is existential — not universal.
text# WRONG: checks if *any* differ
all_not_admin := x in users { x.role != "admin" }
Pitfall 6 — Assuming evaluation order
Rego is not imperative.
11. Full Examples for Every Concept
11.1 Complete Rule
textallow = true if {
    input.user == "admin"
}
11.2 Partial Rule
textallow {
    input.method == "GET"
}
allow {
    input.user == "admin"
}
11.3 Function
textrole_for(user) = role if {
    role := data.user_roles[user]
}
11.4 Universal quantifier
textall_positive := true if {
    every x in input.values { x > 0 }
}
11.5 Existential
texthas_admin := true if some x in input.roles { x == "admin" }
11.6 Set building
textadults := { p.name | p := input.people[_]; p.age >= 18 }

12. Diagrams (Evaluation, Unification, Rule Conflicts)
12.1 Unification
texta = b
          │
    ┌─────┴─────┐
    ▼ ▼
bind a bind b
if neither bound → both unify to same structure
12.2 Conflict in complete rules
textf(1) = 2
      f(1) = 3
          │
          ▼
     Conflict error

13. Appendix: Full One-Page Cheat Sheet
Rules
textrule if { cond }
rule = value if { cond }
f(x) = y if { cond }
Operators
text= unify
:= assign
== equality
!= inequality
in membership
not negation
Collections
text[] array
{} set
{"k":v} object
Built-ins
textto_number(), to_string(), to_set()
crypto.hmac.sha256(), crypto.bcrypt.hash()
json.is_valid(), yaml.is_valid()
Best Practices

Always import future.keywords
Avoid relying on rule order
Use functions for deterministic logic
Always check for undefined


End of Document
OPA CI/CD & GitHub Actions Integration Guide
1. Standard OPA Output Contract
Define a normalized schema for policy results to ensure consistent consumption by CI pipelines.
regopackage compliance
deny[msg] {
  msg := {
    "message": "File contains disallowed pattern",
    "path": input.changed_files[_].path,
    "rule_id": "R01",
    "severity": "BLOCK"
  }
}
warn[msg] {
  msg := {
    "message": "Uses deprecated API",
    "path": input.changed_files[_].path,
    "rule_id": "W01",
    "severity": "WARN"
  }
}
override[msg] {
  msg := {
    "message": "Risk acceptable but requires approval",
    "path": input.changed_files[_].path,
    "rule_id": "O01",
    "severity": "OVERRIDE"
  }
}

2. Recommended OPA Project Layout
textservices/opa/
  policies/
    compliance/
      deny.rego
      warn.rego
      override.rego
  data/
    allowlist.json
    config.json

3. Executing OPA in GitHub Actions
Use predictable, stable output formats:
textopa eval \
  --data services/opa/policies/ \
  --data services/opa/data/ \
  --input opa-input.json \
  --format json \
  'data.compliance'
Avoid --format pretty in CI because it is optimized for humans, not machines.
4. Building Safe GitHub Action Inputs
Key guidance:

Always escape file diffs
Validate JSON using jq .
Never embed raw multi-line strings without sanitizing
Store PR metadata separately (title, body, author, labels)
Normalize paths


5. OPA Evaluation Result Expectations
OPA should always return a structure with these keys, even if empty:
JSON{
  "deny": [],
  "warn": [],
  "override": []
}
This prevents CI-side flattening logic from breaking.
6. End-to-End Example Workflow

PR opened → GitHub Action triggers
Diff + metadata → transformed into opa-input.json
opa eval computes policy decisions
GitHub Action parses output
Results posted as PR comment
Compliance service is notified


7. Local Development & Testing
Recommended workflow:
textopa test services/opa/policies
opa eval --input pr-example.json --data services/opa/policies "data.compliance"
Include realistic PR-diff examples for reproducibility.
Additional Enterprise Considerations
Building an enterprise CRM with many service integrations requires more than just Rego policy correctness. Consider adding future sections on:
1. Contract Testing for All Integrations

Ensure stable schemas between microservices.
Use tools like Pact, Dredd, or Schemathesis.
Policy tests should validate both structure and semantics of external services.

2. Event Model Governance

Standardized event envelopes for Kafka, SNS, or internal event buses.
Document allowed attributes, required headers, correlation IDs.

3. Data Classification & Access Policies
Rego policies should interact with:

PII classification
RBAC/ABAC rules
Field-level data security controls

4. Consistency Rules for Critical Objects
Create policy categories for:

Account mutation rules
Contact deduplication
Opportunity lifecycle constraints
Audit-log completeness

5. Cross-Service Observability Rules
Policies governing:

Required telemetry fields
Log redaction rules
Trace propagation (W3C trace context)

6. Service Dependency Guardrails
Prevent architectural drift:

"CRM API cannot call billing service directly"
"Low-trust domain cannot trigger high-trust write events"

7. API Change Governance
OPA can enforce:

versioning requirements
no breaking changes without RFC approval
required metadata (OpenAPI tags, security blocks)

8. Secure Deployment Pipelines
Define policies for:

container image constraints
signature verification
provenance (SLSA / SBOM)

9. Scoring & Risk Models
OPA can output not only denies, but also:

risk score
risk category
change impact analysis

10. Centralized Policy Registry
Document:

policy ownership
policy lifecycle
test coverage
change approval workflows


Enterprise CRM Governance & OPA Patterns (Advanced)
This section provides deep engineering coverage for enterprise‑scale platforms integrating dozens of services. Includes diagrams, patterns, architecture rules, and policy templates.
1. Enterprise Policy Architecture Overview
text┌───────────────────────────────┐
                 │ GitHub / CI/CD │
                 │ PRs, pushes, pipelines │
                 └───────────────┬───────────────┘
                                 │ opa-input.json
                                 ▼
                      ┌──────────────────┐
                      │ OPA │
                      │ Policy Engine │
                      └───────┬──────────┘
                              │ data.compliance
                              ▼
     ┌────────────────────────────────────────────────────────┐
     │ Governance Layer │
     │ deny | override | warn | info | risk_score | metadata │
     └──────────────┬─────────────────────────────────────────┘
                    │ opa-results.json
                    ▼
            ┌───────────────────┐
            │ Compliance API │
            │ Risk Registry │
            └─────────┬─────────┘
                      │ dashboards / audit
                      ▼
               Enterprise Observability

2. Policy Ownership Metadata Pattern
Every rule must declare ownership.
regopackage crm.policies.account_lifecycle
__meta__ := {
  "owner": "crm-platform",
  "service": "account",
  "rule_id": "ACCT_001",
  "severity": "BLOCK",
  "description": "Accounts must not bypass lifecycle checks",
  "tags": ["lifecycle", "compliance"]
}

3. Service Boundary Enforcement
Prevent accidental cross-service dependencies.
Diagram
textCRM Services
┌─────────────┬─────────────┬─────────────┐
│ Accounts │ Billing │ Messaging │
└─────┬───────┴─────┬───────┴──────┬──────┘
      ▼ ▼ ▼
   Allowed Allowed Forbidden
   Calls: Calls: Access: Messaging → Billing
   - Messaging - CRM API - Billing → Messaging
Policy
regodeny[msg] {
  service := input.changed_files[_].service
  forbidden := data.boundaries.forbidden[service][_]
  forbidden == input.changed_files[_].import_used
  msg := sprintf("%s must not import %s", [service, forbidden])
}

4. API Change Governance
Detect breaking API changes.
Diagram: API Evolution
textv1 → v2 → v3
│ │ │
├── backward compatible
└── breaking change → BLOCK
Example Policy
regodeny[msg] {
  diff := input.api_diff
  diff.breaking_changes[_]
  msg := sprintf("Breaking API change detected: %v", [diff.breaking_changes])
}

5. Event Contract Validation
Verify message bus events follow enterprise schemas.
Event Envelope Diagram
text{
  event_id: UUID,
  type: "crm.account.created",
  ts: timestamp,
  correlation_id: "…",
  payload: {...}
}
Policy
regodeny[msg] {
  event := input.events[_]
  not event.correlation_id
  msg := "Event missing correlation_id"
}

6. Data Governance: PII Guardrails
regodeny[msg] {
  file := input.changed_files[_]
  contains(file.diff, "email")
  not data.allowlist.fields.email
  msg := sprintf("PII field '%s' used without approval", ["email"])
}

7. Identity, RBAC & Attribute-Based Access Governance
textUser → Roles → Permissions → Scopes → Data Access
regodeny[msg] {
  change := input.permissions[_]
  change.role == "admin"
  not data.security.requires_approval[change.role]
  msg := "Admin role modifications require approval"
}

8. Risk Score Calculation Model
OPA can compute composite risk scores.
Risk Formula Diagram
textRisk = (BlastRadius * ChangeSize * ServiceCriticality) - Mitigations
Example
regorisk_score := sum([radius, size, criticality]) - mitigations

9. Policy Test Framework (Golden Files)
texttests/
  inputs/
    pr_small.json
    pr_large.json
  expected/
    pr_small.json
    pr_large.json
Policy:
Bashopa test --verbose services/opa/policies

10. Change Hotspot Detection
Identify PRs modifying too many services.
textAccounts → changed
Billing → changed
Inventory → changed
Messaging → changed
Analytics → unchanged
Policy:
regodeny[msg] {
  affected := distinct([f.service | f := input.changed_files[_]])
  count(affected) > 5
  msg := "PR affects more than 5 services — too risky"
}

11. Logging & Telemetry Compliance
regodeny[msg] {
  file := input.changed_files[_]
  contains(file.diff, "console.log")
  msg := "Raw logs forbidden — use structured logger"
}
Diagram:
textCode → Logger → Collector → SIEM

12. Distributed Tracing Enforcement
regodeny[msg] {
  file := input.changed_files[_]
  contains(file.diff, "axios")
  not contains(file.diff, "traceparent")
  msg := "Outbound request missing W3C traceparent header"
}

13. Feature Flag Compliance
Ensure risky changes must be gated.
regooverride[msg] {
  file := input.changed_files[_]
  risky := data.risk.keywords[_]
  contains(file.diff, risky)
  not contains(file.diff, "feature_flag")
  msg := sprintf("Change requires feature flag: %s", [risky])
}

14. Multi-Cloud & Infrastructure Governance
textTerraform → OPA → Deployment
regodeny[msg] {
  resource := input.terraform.resources[_]
  resource.type == "aws_s3_bucket"
  resource.acl == "public-read"
  msg := "Public S3 buckets are forbidden"
}

15. Safe Migration Guardrails
Prevent inconsistent progressive rollouts.
Diagram:
textv1 (old) ← traffic → v2 (new)
│ │
└────── healthcheck ────┘
Policy:
regodeny[msg] {
  input.migration.change
  not input.migration.plan.tested
  msg := "Migration must have test coverage"
}

16. Architectural Drift Detection
Detect repo-level anti-patterns.
regodeny[msg] {
  imports := input.changed_files[_].imports
  contains(imports, "shared/utils")
  msg := "Shared utils directory is deprecated — use platform library"
}

17. Secrets & Credential Policy
regodeny[msg] {
  file := input.changed_files[_]
  regex.match("(?i)(api[_-]?key|secret)", file.diff)
  msg := "Possible secret detected in PR diff"
}

18. PR Quality Governance
regodeny[msg] {
  length(input.pr_body) < 20
  msg := "PR description too short — must contain justification"
}

19. Complexity & Performance Analysis
Detect expensive operations.
regowarn[msg] {
  contains(input.diff, "nested loops")
  msg := "Nested loops detected — performance risk"
}

20. Code Style and Lint Governance
regodeny[msg] {
  file := input.changed_files[_]
  contains(file.diff, "var ")
  msg := "Use of 'var' forbidden — must use const or let"
}

END OF ADVANCED ENTERPRISE SECTION
Enterprise OPA & CRM Engineering Extensions
This document expands the Rego engineering guide with deep-enterprise patterns, diagrams, governance models, testing frameworks, architecture blueprints, and domain-specific policy libraries. It is designed for large-scale CRM platforms interacting with many services.
1. Visual Architecture Blueprints
1.1 OPA in CI/CD Pipeline
text+------------+ +--------------+ +---------------+
      | Developer | ----> | Pull Request | ----> | CI Pipeline |
      +------------+ +--------------+ +---------------+
                                             | |
                                             v v
                                     +------------+ +-----------+
                                     | OPA Eval | | Unit/Build|
                                     +------------+ +-----------+
                                             |
                                             v
                                      +-------------+
                                      | PR Decision |
                                      +-------------+
1.2 Event Governance Flow
textProducer --> Event Schema --> OPA Event Policies --> Bus --> Consumers
1.3 Microservice Boundary Policy Enforcement
textService A ----X----> Forbidden Domain APIs
     | Allowed --> Service B
     v
   Policies
1.4 Data Lineage & Schema Drift Diagram
textSources --> Transform --> CRM Storage --> API Output --> Analytics
                 | ^
                 |------OPA Schema Drift Rules-------|

2. Policy Style Guide
2.1 Naming Conventions

Rules: allow_*, deny_*, validate_*
Packages: crm.authz, crm.schema, crm.event
Meta fields: owner, severity, rule_id, version

2.2 Rule Structure Template
textpackage crm.rules
meta := {
  "rule_id": "R1001",
  "owner": "platform-security",
  "severity": "BLOCK",
  "version": "1.0.0",
}
deny[msg] {
  condition
  msg := "Human readable message"
}
2.3 Deprecation Workflow

Mark with meta.deprecated = true
OPA tests must enforce replacement
CI denies new PRs using deprecated patterns


3. Enterprise Policy Testing Framework
3.1 Directory Layout
text/policies
  /authz
  /schema
  /events
/tests
  /authz
  /schema
  /events
3.2 Golden Files
textinput.json
expected.json
3.3 Mutation Testing

Flip booleans
Remove fields
Randomize arrays
OPA must still behave predictably.

3.4 Fuzzing Inputs
Use randomly generated PRs, schemas, or event payloads.
3.5 Load Tests

Evaluate 10k rules in parallel
Ensure no pathological recursion


4. Policy Observability & Telemetry
4.1 Decision Logs
text{
  "decision_id": "uuid",
  "input_hash": "...",
  "result": {...},
  "metrics": {...}
}
4.2 Correlation IDs
Policies should propagate x-correlation-id.
4.3 PII Scrubbing
Never write sensitive data to logs.
4.4 Exporting to Monitoring

ELK
Datadog
Grafana Loki


5. Organizational Governance Model
5.1 Policy Owners
Every rule must contain metadata assigning a team.
5.2 Review Process

Normal PR review
Policy engineering review
Architecture review if touching domain boundaries

5.3 Policy RFC Workflow

Draft
Review
Approval
Deployment

5.4 Emergency Override
Rules may allow override_reason with logging & expiry.
6. Domain-Specific Patterns for CRM
6.1 Workflow Systems
Rules ensuring:

idempotency
retry-safe transitions
allowed state transitions

6.2 User Identity Model

Email normalization
UID consistency
RBAC enforcement

6.3 Permission & Access Model
Patterns:

ABAC
RBAC
Relationship-based access (ReBAC)

6.4 Event Consistency
Policies enforce:

correct event version
allowed event producers
JSON schema conformance

6.5 SLA/SLO Tracking Validation
OPA ensures:

no service consumes dependencies with lower SLO
all endpoints declare SLO metadata

6.6 Analytics Pipelines
Prevent PII from being forwarded downstream.
7. Codebase Mapping + Policy Index
7.1 Domain Maps
OPA builds maps of:

domains
services
dependency graphs

7.2 Data Dependency Maps
Example:
textcustomer --> billing --> orders --> analytics
7.3 Schema Relationship Diagrams
textCustomer
   |-- Address
   |-- Communication Preferences
       |-- Email
       |-- SMS
7.4 Policy Index
Machine-generated index of all rules with:

owners
severity
rule_id
location


8. Policy Kitchen Sink (200+ Patterns)
8.1 PR Rules

No modifying authz without approval
Touching > 6 services → warning
Modifying deprecated APIs → block

8.2 API Governance Rules

Require x-idempotency-key
Require timeouts & retries
No external HTTP calls in data layer

8.3 Event Governance Rules

Version must increment on breaking change
No sensitive data in events
Only approved services may produce event type

8.4 Schema Rules

Required fields present
No removal of public fields
Allowed types must match domain contract

8.5 Security Rules

Encryption required
Hash algorithms restricted
Secrets must not appear in configs

8.6 Performance Rules

Complexity guardrails (PR too large)
Expensive operations disallowed

8.7 Architectural Rules

No crossing domain boundaries
No circular dependencies
Feature flags required for high-risk changes


END OF DOCUMENT
Rego Linting Rules & CI Templates
Rego Linting Baselines

Enforce opa fmt on every commit.
Disallow unused variables (_ allowed).
Enforce future.keywords import.
No unbounded recursion.
No ambiguous rule overlap without else.
Require explicit package naming convention: infra.<service>.<domain>.
Require comments for any rule producing deny, warn, or override.
Require metadata annotations for every rule (@title, @description, @severity).
Require tests for every policy in /tests using opa test.
Ban print() in production policies (allowed only in dev mode).
Require explicit type guards for all input fields accessed.


CI Templates (GitHub Actions)
1. Rego Formatting + Lint Check
YAMLname: Rego Linting
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install OPA
        run: |
          curl -L -o opa https://openpolicyagent.org/downloads/v1.10.1/opa_linux_amd64
          chmod +x opa
      - name: Check formatting
        run: |
          set +e
          opa fmt -d . > fmt-output.txt
          if [ -s fmt-output.txt ]; then
            echo "Rego formatting issues found:" >&2
            cat fmt-output.txt >&2
            exit 1
          fi
      - name: Run lint (custom rules)
        run: |
          ./scripts/rego-lint.sh

2. Policy Test Execution (opa test)
YAMLname: Rego Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install OPA
        run: |
          curl -L -o opa https://openpolicyagent.org/downloads/v1.10.1/opa_linux_amd64
          chmod +x opa
      - name: Run tests
        run: |
          opa test policies/ tests/ --verbose --timeout 30s

opa fmt Integration in Cursor AI
Formatting on Save (Cursor)
Add to your .cursorrules:
JSON{
  "onSave": [
    {
      "command": "opa fmt -w ${file}"
    }
  ]
}
Formatting on Commit (Cursor Source Control)
Add to .cursor/hooks/pre-commit.sh:
Bash#!/bin/bash
set -e
FILES=$(git diff --cached --name-only -- '*.rego')
for file in $FILES; do
  opa fmt -w "$file"
  git add "$file"
done
echo "OPA fmt applied to staged Rego files."
Make executable:
Bashchmod +x .cursor/hooks/pre-commit.sh

Extended Rego Style Guide (Based on Styra)
1. Naming Conventions

Packages:domain.service.component
Rules: snake_case
Functions: snake_case + must return a value
Files: match package name

2. Imports

Always include:

regoimport future.keywords

Prefer explicit imports:

regoimport data.lib.strings as strlib
3. Rule Style
Prefer one rule → one purpose:
regodeny[msg] {
  invalid_title
  msg := "PR title must not be empty"
}
Avoid mixing conditions and output generation in one body.
4. Boolean Rules
Use implicit true return when appropriate:
regoinvalid_title {
  input.pr_title == ""
}
5. Error Message Rules
Always set message separately:
regodeny[msg] {
  invalid_title
  msg := "PR title missing"
}
6. Avoid Deep Nesting
Use helpers, not deeply nested blocks.
7. Use Expressions, Not Procedural Flow
Bad:
regoallowed {
  cond1
  not cond2
}
Good:
regoallowed {
  cond1
}
not allowed {
  cond2
}
8. Explicit Type Guards
regotype_safe {
  input is object
  input.user is string
}
9. Metadata on Every Rule
rego# METADATA
# @title PR Title Validation
# @description Ensures titles meet compliance requirements
# @severity BLOCK

Diagrams
1. Rego Lint + CI Flow
textDeveloper → Cursor (opa fmt) → Commit → GitHub PR
        → CI Lint Check → Rego Tests → Policy Evaluation
2. Policy Development Lifecycle
textWrite Policy → Add Metadata → Add Tests → Lint + Format
     → Versioned Release → CI → Prod Enforcement
3. OPA Rule Quality Gate
text+-----------------------+
               | Style Guide Checks |
               +-----------------------+
                         ↓
               +-----------------------+
               | opa fmt / linting |
               +-----------------------+
                         ↓
               +-----------------------+
               | opa test coverage |
               +-----------------------+
                         ↓
               +-----------------------+
               | CI Policy Gate |
               +-----------------------+
                         ↓
                    Merge Allowed

Enterprise OPA Engineering Extensions
This document includes advanced modules:

Policy Versioning & Release Engineering
OPA Bundle Delivery Architecture
Policy Observability Platform
Enterprise Policy SDLC
OPA Performance Engineering
Secure Policy Development
Rego Testing Playbook
Organization‑Wide Policy Governance


1. Policy Versioning & Release Engineering
Versioning Strategy

Use semantic versioning: MAJOR.MINOR.PATCH.
Breaking changes require a MAJOR version bump.
Every policy bundle is an immutable artifact.

Policy Release Flow
textAuthor → Code Review → Lint/Test → Tag (vX.Y.Z)
      → Build Bundle → Publish to Registry → Deploy
Release Artifacts

bundle.tar.gz
manifest.json (policy metadata)
checksums.txt
bundle.sig (optional signing)


2. OPA Bundle Delivery Architecture
Delivery Models
Pull model: OPA agent periodically fetches bundles.
Push model: Central system notifies or pushes bundles.
Bundle Layers
text[Global Baseline]
      ↓
[Org Security Policies]
      ↓
[Team Policies]
      ↓
[Service-Specific Policies]
OPA merges all layers.
CDN Distribution

Low latency
Cached bundles
Integrity checks


3. Policy Observability Platform
Key Observability Features

Decision logs (JSON)
Policy execution traces
Query profiling
Export of rule evaluation times

Decision Log Schema

timestamp
path
input
result
metrics

Observability Pipeline
textOPA → Log Collector → Stream Processor (Kafka)
    → Data Lake → Dashboards (Grafana)

4. Enterprise Policy SDLC
Full Lifecycle
textWrite → Review → Lint/Test → Package → Approve
      → Deploy → Monitor → Improve → Version
Required Gates

Mandatory testing (opa test)
Policy review board approval
Static analysis pass
Bundle signing


5. OPA Performance Engineering
Partial Evaluation

Pre-compute static branches at build time
Reduce runtime work

Profiling Commands
textopa eval --profile --input input.json 'data.example.allow'
Optimization Patterns

Flatten deep nested rules
Pre-index large data objects
Avoid heavy regex in loops


6. Secure Policy Development
Security Practices

Schema-first validation
Validate all external inputs
Enforce type guards
Avoid rules that allow implicit truthiness
Ban string concatenation that builds code or eval

Injection Protections

Never feed untrusted text directly into rego evaluation
Validate any dynamic data structures


7. Rego Testing Playbook
Test Structure

Use table-driven tests
Include positive + negative cases
Mock service data

Example Table Test
rego# test.rego
import data.policy
cases = [
  {"input": {"value": 5}, "want": true},
  {"input": {"value": 0}, "want": false},
]
run[c] {
  some c in cases
  got := policy.allow with input as c.input
  got == c.want
}

8. Organization-Wide Policy Governance
Governance Levels

Security Council: approves global baselines
Policy Owners: manage team policies
Service Teams: manage local exceptions

Exception Workflow
textRequest → Review → Approve w/ Expiration → Track
      → Auto‑expire or Renew
Policy Catalog

Every policy has:
Owner
Purpose
Version
Severity
Test coverage




Missing Key Concept: Rule Conflicts vs. Merging
You explain Partial Rules (Sets/Objects) and Complete Rules, but you left out what happens when definitions collide. This is the source of many runtime errors.
Add this to the "Rules" section:
Conflict Resolution
Complete Rules: If multiple rules with the same name (e.g., allow) evaluate to true (or different values) within the same package, OPA returns a runtime error (conflict).
Partial Rules (Sets/Objects): If multiple rules generate values for the same set or object, OPA merges them (union).
Functions: If multiple function definitions match the same arguments but produce different outputs, it causes a runtime error.
Missing Keyword Usage: else
You listed else in the Reserved Keywords list, but you did not provide an example of its usage. It is highly useful for chaining logic in functions or complete rules.
Add this to the "Rules" section:
Code snippet

Chained logic with 'else'
authorize = "allow" if {
input.user.is_admin
} else = "deny" if {
input.user.is_blacklisted
} else = "pending"
3. The import future.keywords Context
While your guide uses modern syntax (if, contains, every), it doesn't explicitly explain why this works. In many OPA environments (especially those slightly older or without v1.0 flags), these keywords are not available by default.
Refinement for "Syntax Overview" or "Best Practices":
Note on Modern Syntax: To use keywords like contains, if, in, and every in OPA versions prior to v1.0, you must include a specific import. It is best practice to include this header in all modern policies:
Code snippet
package my.policy
import future.keywords # Imports 'if', 'in', 'every', 'contains'
4. Missing Tool: Debugging (print)
Rego is notoriously hard to debug because it doesn't have standard breakpoints. The print function is the only way to inspect execution flow.
Add to "Built-in Functions" or a new "Debugging" section:
Code snippet
Returns true (always), but prints to console/logs
Note: print() returns true, so it doesn't break rule evaluation
debug_rule if {
x := input.value
print("The value of x is:", x)
x > 10
}
5. Nuance on default
Your explanation of default is correct, but there is a common misconception that default applies if the rule evaluates to false. Clarification: default only applies if the rule is undefined.
Refinement:
The default keyword sets a value only if the rule creates no output (is undefined) for the given input. If a rule evaluates to false, the default is not triggered; the result remains false.
6. Missing concept: data vs input architectural difference
You mention them in references, but the conceptual difference is vital for "Introduction" or "Core Concepts".
input: Synchronous, per-query data provided by the caller (API request body).
data: Asynchronous, cached base data stored in OPA memory (policy bundles, replicating database tables).
7. Virtual Documents (The opa eval distinction)
You touch on this, but it is worth noting in "Core Concepts": In Rego, everything is a document.
input is a document.
data is a document.
Your package and rules essentially become a Virtual Document that can be queried exactly like JSON data.
Rego Language Complete Reference Guide
Table of Contents

Introduction
Language Specification
Syntax Overview
Core Concepts
Rules & Control Flow
Variables and References
Operators
Iteration and Comprehensions
Built-in Functions
Testing
Debugging and Troubleshooting
Performance Considerations
Integration and Ecosystem
Best Practices


Introduction
What is Rego?
Rego is OPA's native query language, inspired by Datalog and extended to support structured document models such as JSON. It is purpose-built for expressing policies over complex hierarchical data structures.
Key Characteristics

Declarative: Focus on what queries should return, not how to execute them.
Purpose-built: Designed for policy decisions over structured documents.
Assertions-based: Queries are assertions on data stored in OPA.
Optimizable: OPA can optimize queries for better performance.


Language Specification
Reserved Keywords
The following words are reserved and cannot be used as variable names, rule names, or dot-access style reference arguments:
textas default else every false
if import in input not
# Rego (OPA) Style Guide
This Rego style guide consolidates best practices inspired by the official Styra OPA guidelines and expands them into a practical, enforceable standard for engineering teams.
---
## 1. General Principles
### **Optimize for readability**
Rego is declarative—favor clear logical expressions over performance hacks. Only optimize once a measurable performance issue arises.
### **Use `opa fmt` for formatting**
* Always run `opa fmt --write` locally.
* Enforce consistent formatting in CI using `opa fmt --fail`.
* OPA uses **tabs**, so configure `.editorconfig` to show them consistently.
### **Use strict mode**
Enable `opa check --strict` in CI to catch unsafe patterns, unused variables, and mistakes.
### **Prefer annotations for metadata**
Use `rego.metadata.rule()` for structured metadata, e.g., documenting rule purpose, links, owners, etc.
### **Leverage built-ins and schemas**
Know OPA’s built-ins. Use JSON Schema for type validation of `input` and `data` early in development.
---
## 2. Naming & Style
### **Use snake_case**
* Applies to rules, variables, functions.
* Example: `is_admin_user`, not `isAdminUser`.
### **Prefix internal helpers with `_`** (optional but recommended)
Example:
```rego
_is_dev(user) if user.role == "developer"
Line length: 120 characters
Wrap long comprehensions and condition blocks.
3. Rules & Modularization
Break logic into helper rules
Avoid repeating logic—extract shared conditions.
Avoid undefined ambiguity
Explicitly model boolean logic:
regoauthenticated_user if input.user_id != "anonymous"
deny contains "anonymous user" if not authenticated_user
Prefer helper rules over inline comprehensions
Easier to debug, test, and reuse.
Avoid prefixes like get_ or list_
Use semantic names:full_name(user) not get_full_name(user).
Use rule-head assignment when always returning a value
regofull_name := concat(", ", [input.first_name, input.last_name])

4. Variables & Data Types
Use in for membership
regoallow if "admin" in input.user.roles
Use some ... in for iteration
regosome user in data.users
Use every ... in for universal checks
regoevery c in input.containers { not startswith(c.image, "deprecated/") }
Declare all variables
Avoid implicit variable introduction.
Prefer sets over arrays when appropriate
Better semantics and performance when order doesn’t matter.
5. Functions
Use function arguments instead of referencing global input/data
Make functions pure and testable.
Avoid using the last argument as the return value
Use rule-head assignment instead:
regoindex_of_a := indexof("answer", "a")

6. Regex Usage
Use raw string literals
regoregex.match(`^[0-9]+$`, val)

7. Packages & Imports
Match package to directory structure
Keeps repos organized and predictable.
Prefer importing entire packages
regoimport data.users
Rather than:
regoimport data.users.is_admin
Do not import input
Reference input directly unless there is a domain-specific aliasing need.
8. Legacy / Version Considerations
Future keyword imports
Older OPA required imports like:
regoimport future.keywords.contains
Using rego.v1 makes this largely obsolete.
9. Recommended CI Tools
Linting

Use Regal for robust style and correctness linting.

Formatting

Enforce with opa fmt --write and opa fmt --fail.

Static checking

Run opa check --strict in CI.

Schema enforcement

Validate input via JSON Schema to avoid type-related errors.


10. Editor & Developer Experience
.editorconfig
ini[*.rego]
indent_style = tab
indent_size = 4
Recommended IDE setup

Enable OPA/Rego extensions
Enable auto-format on save
Enable schema validation if editor supports it


11. Examples
Compliant example
regopackage authz.http
import data.roles
is_admin(user) if "admin" in user.roles
allow if {
    is_admin(input.user)
    input.request.method == "GET"
}
Anti-pattern example
regopackage authz
# no helper rules
allow {
    "admin" == input.user.role
    startswith(input.path, "/api")
    input.verb == "GET"
}

12. Summary
A good Rego style guide focuses on:

Readability
Declarative expression
Modularity
Predictability
Tooling enforcement
This document can be placed in your repository (e.g., STYLE_GUIDE.md) and used for onboarding, reviews, and automation.


13. Lint Rules (Regal)
Recommended Regal Rules

ID naming: enforce snake_case for rules, functions, and variables.
No unused variables: fail on variables that are declared but unused.
No shadowed variables: prevent reuse of variable names in conflicting scopes.
Require explicit some declarations: disallow implicit variable introduction.
No ambiguous negation: require helper rules instead of negating complex conditions.
Max rule size: warn if rule contains >10 expressions.
Avoid inline comprehensions: prefer helper rules.
Require package alignment with file path.
No importing of input, unless aliased intentionally and documented.

Example .regal/config.yaml
YAMLrules:
  naming-convention:
    snake_case: true
  unused-decls: error
  no-var-shadowing: error
  require-some: error
  no-ambiguous-negation: warn
  max-rule-size:
    severity: warn
    limit: 10
  avoid-inline-comprehensions: warn
  package-path-alignment: error
  no-import-input: error

14. CI Templates
GitHub Actions
YAMLname: Rego CI
on: [push, pull_request]
jobs:
  rego:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install OPA
        run: |
          curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64
          sudo mv opa /usr/local/bin/opa
          sudo chmod +x /usr/local/bin/opa
      - name: Install Regal
        run: |
          curl -sSL https://raw.githubusercontent.com/styrainc/regal/main/install.sh | sh
          sudo mv regal /usr/local/bin/regal
      - name: Lint (Regal)
        run: regal lint --format github .
      - name: Format Check
        run: opa fmt --fail .
      - name: Strict Type Check
        run: opa check --strict .
GitLab CI
YAMLregocin:
  image: alpine:latest
  script:
    - apk add curl
    - curl -L -o opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64
    - chmod +x opa
    - curl -sSL https://raw.githubusercontent.com/styrainc/regal/main/install.sh | sh
    - ./regal lint
    - ./opa fmt --fail .
    - ./opa check --strict .

15. Architecture & Ruleflow Diagrams
Policy Evaluation Flow
text+-----------------+
        | Input |
        +--------+--------+
                 |
                 v
        +-----------------+
        | Rego Rules |
        | (package) |
        +--------+--------+
                 |
      +----------+-----------+
      | Helper Rules & |
      | Functions |
      +----------+-----------+
                 |
                 v
        +-----------------+
        | allow/deny |
        +--------+--------+
                 |
                 v
        +-----------------+
        | Decision |
        +-----------------+
Enterprise Module Layout
textpolicies/
  authz/
    http/
      package.rego
      helpers.rego
      checks.rego
  k8s/
    admission/
      baseline.rego
      restrictions.rego
  shared/
    strings.rego
    sets.rego
    metadata.rego

16. Additional Examples
Helper Rule Example
regois_read_method(method) if method in {"GET", "HEAD"}
Using Sets
regorequired := {"read", "write"}
user_perms := {p | some p in input.user.permissions}
all_perms if required <= user_perms
Universal Quantification
regoevery c in input.containers { not contains(c.image, "deprecated/") }

17. Anti-Patterns
❌ Inline comprehensions inside allow/deny
❌ Implicit variable declarations
❌ Very large rule bodies (>10 expressions)
❌ Multiple responsibilities inside one rule
❌ Mixing authorization, validation, and mutation logic
❌ Circular imports between modules
❌ Returning outputs via last positional argument

18. Enterprise Standards
Required

opa fmt --fail enforced.
opa check --strict enforced.
Regal lint must pass.
All new rules require annotations (metadata + examples if relevant).
Must include a JSON Schema for all policy input.
Package path must match directory structure.
No rule may exceed 10 expressions.
All reusable logic must be placed in helper rules.
No inline comprehensions inside allow/deny.

Recommended

Include policy version via metadata.
Include owner, description, last_reviewed fields.
Follow ADR (Architecture Decision Record) process for policy changes.
Maintain a central shared/ module library (sets, strings, regex helpers).
Write policy unit tests using opa test.
Add sample input fixtures for QA.


19. Final Checklist

 Code formatted
 Lint clean
 Strict check clean
 Package aligned with filesystem
 No inline comprehensions
 Variables declared
 Helper rules for repeated logic
 Metadata annotations present
 JSON schema for input valid


Expanded Content Additions
Deep-Dive Lint Rules (Extended)

Rule grouping conventions
Forbidden constructs catalog
Auto-fixable rule library
Naming enforcements: package, rule, variable, function
Metrics: cyclomatic complexity thresholds
Rule coverage expectations

CI Templates (Extended)

Multi-stage pipelines with policy test matrix
Caching OPA bundles for faster builds
SBOM generation for policy artifacts
Sigstore signing for rego bundles
SARIF output integration for security scanners

Architecture & Flow Diagrams (Extended)

Policy evaluation lifecycle diagram
Policy distribution topology
High availability OPA deployment models
Multi-tenant policy workspace architecture

Advanced Examples (Extended)

Attribute-based access control with hierarchical overrides
Multi-source data ingestion example (HTTP + bundle + inline)
Complex partial evaluation demo
Cross-policy composition patterns

Best Practices (Extended)
Change management governance for policies, including review workflows, approval gates, and automated enforcement readiness checks.
1. Policy Change Management
1.1 Policy Lifecycle
Define a clear lifecycle for each policy artifact:

Draft — authored by developer/owner in a feature branch.
Review — submitted as a pull request; automated checks run (format, lint, unit tests).
Approved — human reviewers (policy owners, security, legal) approve the PR.
Staged — deployed to a non-production environment with monitoring enabled.
Canary — small percentage of traffic or subset of hosts evaluated against the policy.
Enforced — policy applied cluster/org-wide.
Deprecated — policy marked for removal with a sunset date.

1.2 Review Workflows & Approval Gates

Pull Request Template (require fields): summary, motivation, risk, tests added, rollback plan, owners, evaluation plan.
Automated Gates: opa fmt --fail, Regal lint, opa test, opa check --strict.
Human Gates: at least two approvers: one domain owner and one security reviewer.
Time-based Gate: for high-impact changes, require a longer review window (e.g., 48-72 hours).

1.3 Enforcement Readiness Checks

Unit tests coverage threshold (e.g., 80% for policy expressions).
Test fixtures that mimic real-world input for critical paths.
Performance benchmark: ensure partial evaluation or bundle size doesn't exceed targets.
Schema validation present for input.

1.4 Rollback & Emergency Procedures

Maintain reversible deployments (e.g., bundles with version tags).
Emergency revert PRs with expedited approvals for critical outages.
Postmortem within 72 hours for incidents caused by policy changes.


2. Governance & Organizational Roles
2.1 Roles & Responsibilities

Policy Author: writes rules, unit tests, and metadata.
Policy Owner: business or platform owner who approves semantics and risk.
Security Reviewer: ensures policy follows security standards.
Platform Operator: responsible for deployment, observability, and rollback.
Auditor/Compliance: reviews policies for regulatory compliance periodically.

2.2 RACI Example (Policy Change)















































ActivityResponsibleAccountableConsultedInformedAuthoringPolicy AuthorPolicy OwnerSecurityPlatformLint & TestsPolicy AuthorPolicy OwnerPlatformSecurityApprovalSecurityPolicy OwnerAuthorPlatformDeploymentPlatformPlatformPolicy OwnerAuthorMonitoringPlatformPlatformSecurityPolicy Owner

3. Testing Strategy
3.1 Unit Tests

Use opa test with table-driven tests for rules and helper functions.
Keep tests small and deterministic.

3.2 Integration Tests

Use real-ish fixtures against the entire policy bundle.
Validate allow/deny decisions across representative inputs.

3.3 Property-Based & Fuzz Testing

For complex input shapes, use fuzzing to discover edge cases.

3.4 Performance & Partial Evaluation Tests

Run opa eval --partial in CI for expensive queries and ensure they simplify.
Measure evaluation latency for typical inputs and set thresholds.

3.5 Test Data & Fixtures

Keep a test/fixtures/ directory with named JSON inputs used by CI.
Include both "happy path" and adversarial inputs.


4. Deployment & Rollout Patterns
4.1 Bundle Versioning

Use semver-like tags for policy bundles: vMAJOR.MINOR.PATCH.
Record bundle provenance (commit SHA, author, CI run ID) in metadata.

4.2 Canary & Gradual Rollout

Start with a small percentage of evaluated requests or a subset of clusters.
Use feature flags or evaluation routing in the host system.
Monitor error rates and decision delta (how many decisions differ from previous policy).

4.3 Blue/Green & Shadow Modes

Shadow mode: evaluate new policy in parallel to current policy but do not enforce; compare results.
Blue/Green: deploy bundle to green; switch traffic after validation.


5. Observability & Telemetry
5.1 Metrics to Collect

Policy evaluation latency (p50/p95/p99)
Decision rate (requests/sec)
Decision delta (percent of requests where decision changed vs previous policy)
Deny count and deny reasons (top N reasons)
Bundle deployment frequency and success rate

5.2 Logging & Tracing

Emit structured logs with fields: policy_id, bundle_version, input_hash, decision, reason, evaluation_time.
Correlate with request traces (trace ID) for root-cause analysis.

5.3 Alerts & SLOs

Alert when p95 latency > threshold or decision delta spikes unexpectedly.
SLO examples: 99.9% availability for policy decisions; median evaluation latency < X ms.


6. Policy Observability Use-Cases

Change impact analysis: compare deny counts before/after rollout.
Drift detection: detect when data (input shape, external dependencies) diverges from expected schema.
Compliance reporting: produce periodic reports of enforced policies and exceptions.


7. Policy-as-Code Best Practices

Keep policies next to relevant application docs (or in a central repo with clear module boundaries).
Treat policies like code: code reviews, tests, CI, and versioning.
Keep business logic out of policy; policy should be declarative and limited to access/control concerns.


8. Security & Secrets

Do not embed secrets in Rego or policy metadata.
If policies need external secrets (e.g., API tokens) use a secrets manager and pass them at runtime or via secure data APIs.


9. Documentation & Onboarding

Every policy module must include a README.md describing purpose, input expectations, owners, and example inputs/outputs.
Provide onboarding docs for writing and testing Rego.
Maintain a changelog for policy bundle releases.


10. Policy Registry & Catalog

Maintain a searchable catalog of policies with metadata: id, owner, description, impact level, last reviewed, bundle version.
Expose catalog via an internal UI or index for auditors and owners.


11. Compliance & Auditability

Ensure every enforcement decision can be reproduced from stored bundle_version + input fixture.
Retain audit logs for decisions and bundle deployments for at least the retention period required by compliance (e.g., 1 year).


12. Training & Culture

Run regular "policy katas" (short exercises) to train engineers on Rego and OPA.
Hold periodic policy review meetings between security, platform, and product teams.


13. Templates & Checklists
13.1 Pull Request Template (example)
textSummary:
Motivation:
Risk Assessment (Low/Medium/High):
Tests added (Y/N):
Rollback plan:
Owners:
Evaluation plan (staging/canary):
13.2 Policy Review Checklist

 Code formatted (opa fmt)
 Regal lint passed
 Unit tests present and passing
 Integration tests present and passing
 Metadata included (owner, description, version)
 JSON schema for input present
 Performance check passed
 Rollback plan included


14. Examples & Patterns
14.1 ABAC with Hierarchical Overrides

Use hierarchical packages to represent scopes (global → org → team → resource).
Higher-precedence rules can override or deny lower-level rules via explicit metadata and evaluation ordering.

14.2 Multi-Source Data Ingestion

Prioritize sources: local bundle data > service API > runtime input.
Cache stable external data at bundle build time where possible.

14.3 Partial Evaluation Usage

Precompute expensive joins/filters with partial evaluation at bundle build time.
Keep dynamic inputs minimal to benefit from partial evaluation.


15. Metrics & KPIs for Policy Programs

Mean time to detect (MTTD) policy-caused incidents
Mean time to rollback (MTTR) policy deployments
Percentage of policies with tests
Bundle deployment success rate
Policy coverage (services with enforced policies vs total)


16. Multi-Tenant & Namespace Considerations

Use tenant-aware packages and data separation.
Establish quotas and guardrails per tenant to avoid noisy neighbors.
Provide per-tenant metrics and logs.


17. Policy Retirement

Policies marked for deprecation should include: reason, deprecation date, owner, migration path.
Automate reminders for owners as deprecation dates approach.


18. Appendix: Example Workflows
18.1 Quick Canary Rollout

Author PR with bundle vX.Y.Z-canary.
CI runs tests and outputs bundle artifact.
Deploy bundle to canary host group (10% of traffic).
Monitor metrics for 24–72 hours.
If no regressions, promote to vX.Y.Z and roll out further.

18.2 Emergency Revert

Detect outage linked to policy.
Platform operator triggers rollback to previous bundle tag.
Open incident ticket and notify owners.
Postmortem and change to review process if needed.


19. Resources & Further Reading

OPA docs: https://www.openpolicyagent.org
Styra Rego Style Guide
Regal linter docs
OPA mailing lists and community patterns


End of Best Practices (Extended)
End of Document
Resources

Official Documentation: https://www.openpolicyagent.org/docs/
Policy Language: https://www.openpolicyagent.org/docs/latest/policy-language/
Policy Reference: https://www.openpolicyagent.org/docs/latest/policy-reference/
Built-in Functions: https://www.openpolicyagent.org/docs/latest/policy-reference/#built-in-functions
OPA Playground: https://play.openpolicyagent.org/
GitHub Repository: https://github.com/open-policy-agent/opa


Note: This reference is based on OPA 0.60+ syntax and semantics. Always refer to the official documentation for the most current information and details specific to your OPA version.