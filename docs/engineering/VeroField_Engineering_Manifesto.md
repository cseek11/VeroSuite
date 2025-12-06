
## 1. VeroField Engineering Manifesto

> **Our job is not just to make it work, but to make it safe to change.**
> VeroField is a long-lived, multi-tenant platform. Every line of code either increases or reduces our ability to ship safely in the future. These rules exist to keep us fast *and* sane.

### 1.1 Core Principles

* **Clarity over cleverness** – If future-you or another dev can’t understand it quickly, it’s not done.
* **Local changes, not chain reactions** – Design so features and fixes are isolated, not ripple effects.
* **Safety nets everywhere** – Tests, typed contracts, and monitoring let us move fast without fear.
* **Tenant safety is sacred** – No cross-tenant leaks, ever. This is a *hard* requirement, not a nice-to-have.
* **Code as a team asset** – Everything we write should be maintainable by someone else in 2+ years.

---

### 1.2 Modularity, Boundaries & Design

* **Organize by feature, not by technical layer**

  * Group UI, logic, data access, and tests for a feature together (vertical slices).
  * Avoid sprawling “generic” folders like `utils/`, `common/` that become junk drawers.

* **Apply SOLID & DDD in practice, not as buzzwords**

  * One responsibility per class/function.
  * Extend behavior via composition or new classes, not by hacking up old ones.
  * Domain terms (Tenant, WorkOrder, Invoice, Route, Technician) are consistent across DB, code, and UI.

* **Boundaries are contracts**

  * Modules/services only talk through well-defined interfaces or APIs.
  * No “reach into another module’s internals.” If you need that, the boundary is wrong.

---

### 1.3 Clean, Readable Code

* **KISS, DRY, YAGNI – in that order**

  * Start simple. Don’t abstract until you see *actual* duplication and a clear abstraction.
  * Don’t build speculative “flexibility” you aren’t using yet.

* **Names tell the story**

  * Functions and variables should reveal intent: `calculateInvoiceTotal`, not `doStuff`.
  * Prefer small, focused functions over giant ones. If it’s >20–30 lines and doing multiple things, split it.

* **Comments explain “why,” not “what”**

  * The code shows *what* happens. Comments explain decisions, tradeoffs, and known constraints.

* **Style is automated, not debated**

  * Use linters, formatters, and pre-commit hooks.
  * No PRs that mix formatting changes with functional code unless explicitly agreed.

---

### 1.4 Testing & Safety Nets

* **Test behavior, not implementation details**

  * Tests should break when behavior breaks, not when you rename a private helper.

* **The Diamond of Tests**

  * Unit tests for core logic.
  * Heavy use of integration tests for real interactions.
  * A thinner layer of E2E tests for critical flows.

* **Mock carefully, not everywhere**

  * Mock external systems and unstable dependencies.
  * Prefer real collaborators inside a bounded context where possible.

---

### 1.5 Change Management & Tech Debt

* **Small, focused changes win**

  * Small PRs, small surface area, clear intent.
  * Refactors and features should be separate where possible.

* **Boy Scout Rule**

  * Always leave the code a bit better than you found it—naming, comments, structure, tests.

* **Tech debt is real work**

  * Track it in the backlog. Reserve capacity (10–20%) to pay it down regularly.

---

### 1.6 Security & Multi-Tenancy (VeroField-Specific)

* **Tenant isolation by default**

  * Every DB query, every data access path is tenant-scoped.
  * Helper functions and patterns enforce this so the “easy” path is the safe path.

* **No secrets in code, ever**

  * Secrets come from secret managers or env, not from source control.
  * Design for rotation and revocation from day one.

* **RBAC and authZ at the boundary**

  * Authorization lives at the edge of the system (controllers/handlers), not sprinkled randomly.
  * Internals assume a validated security context.

* **Respect privacy in logs**

  * Never log credentials or sensitive personal info. Prefer structured, redacted logs.

---

### 1.7 Reliability, APIs & Operations

* **Errors are first-class citizens**

  * Distinguish between domain errors and system errors.
  * Log with enough context to be actionable.

* **Timeouts and retries are not optional**

  * Every external call has a timeout and a retry strategy where appropriate.
  * Design endpoints that are idempotent if they can be retried.

* **Stable, versioned APIs**

  * Once an API is public (external or cross-service), treat it as a contract.
  * Use versioning and deprecation paths, not silent breaking changes.

* **Observability from day one**

  * Emit metrics and logs that help answer: “Is it working?” and “What went wrong?”
  * Critical services have basic runbooks for incidents.

---

### 1.8 Workflow, Git & Documentation

* **Atomic commits, meaningful messages**

  * Each commit should represent one intention.
  * Messages describe *why* the change exists.

* **Green mainline**

  * No merging failing builds. CI is part of the definition of done.

* **Docs that stay close to code**

  * Each feature/module has a short README with purpose, entry points, and gotchas.
  * For critical systems (billing, auth, tenant isolation), maintain “How to change this safely” guides.

---

## 2. VeroField PR Checklist (For Authors & Reviewers)

Use this as a quick checklist when opening or reviewing a PR. You can encode this into a PR template.

### 2.1 Design & Boundaries

* [ ] Is this code organized by feature/domain (not random shared utilities)?
* [ ] Does this respect module/service boundaries (no internal reach-through)?
* [ ] Are SOLID responsibilities reasonably respected (no “god classes”/“god functions”)?
* [ ] Does the change keep core domain logic free from framework/infra coupling where possible?

### 2.2 Readability & Style

* [ ] Are names (functions, variables, modules) clear, specific, and domain-aligned?
* [ ] Is the code as simple as it can be (no obvious over-engineering)?
* [ ] Are functions and files reasonably small and focused?
* [ ] Are comments explaining *why* where needed, and not duplicating the code?
* [ ] Linters, formatters, and type-checkers pass without warnings.

### 2.3 Testing

* [ ] Are there tests for new behavior (unit and/or integration)?
* [ ] Do tests focus on behavior (inputs/outputs), not implementation details?
* [ ] Do existing tests still pass, and is coverage reasonable for risk level?
* [ ] For bugs, is there at least one test that would fail without this fix?

### 2.4 Security & Multi-Tenancy

* [ ] Are all data access paths correctly tenant-scoped (no missing `tenant_id` filters / RLS bypass)?
* [ ] No secrets, API keys, or tokens are hardcoded or logged.
* [ ] Are authorization/RBAC checks present and in the right place (at boundaries)?
* [ ] Logs do not contain sensitive personal or credential data.

### 2.5 Reliability & Operations

* [ ] Are external calls (HTTP/DB/queue/cache) using appropriate timeouts and retries?
* [ ] Are error paths handled properly (no swallowed exceptions, actionable log messages)?
* [ ] Are any new or changed APIs versioned or backward compatible where needed?
* [ ] Would this change be diagnosable in production (logs/metrics)? Do we need any additional instrumentation?

### 2.6 Change Scope & Tech Debt

* [ ] Is this PR focused (no unrelated refactors mixed in)?
* [ ] If there *is* refactoring, is it clearly separated and safe (tests support it)?
* [ ] Any “temporary” hacks are documented with TODO + ticket.
* [ ] If tech debt is introduced, is it explicitly called out in the PR description?

### 2.7 Git & Docs

* [ ] Commit messages are clear, scoped, and follow convention (`feat:`, `fix:`, `refactor:`, etc.).
* [ ] Relevant docs/READMEs/ADR entries are updated for behavior or design changes.
* [ ] The PR description explains **why** the change is needed and how it was implemented.

You can tag a subset of these as **[BLOCKER]** in your template (e.g., tenant isolation, secrets, tests, CI green).

---

## 3. Day-1 Rules for New VeroField Engineers

This is the short, “put it on the wall” version. These are the expectations from your *first* PR.

1. **Never bypass tenant isolation.**
   Every query and API path must be tenant-scoped. If you’re not sure how, ask before merging.

2. **No secrets in code, ever.**
   Use env/secret management. If you see a secret in code, treat it as a bug.

3. **Organize by feature, not by layer.**
   Put code near the domain it belongs to. Don’t create new generic `utils/` unless agreed.

4. **Name things like you’re writing for future you.**
   Functions and variables should tell the story without needing comments.

5. **Write tests for behavior you care about.**
   If it can break in production, it needs at least one meaningful test.

6. **Keep PRs small and focused.**
   One intention per PR: a feature, a fix, or a refactor—not all three at once.

7. **Let tools do the formatting.**
   Run linters/formatters; don’t hand-format. Don’t mix big formatting changes with logic changes.

8. **Log responsibly.**
   Helpful, structured logs with context—but never credentials or sensitive personal data.

9. **Ask before you invent new patterns.**
   Prefer existing patterns and helpers (especially for queries, auth, tenant isolation). Consistency > creativity at the boundaries.

10. **If you’re unsure, leave the code a bit better.**
    Small cleanup is always welcome: better naming, a clarified test, a tiny refactor with tests.


