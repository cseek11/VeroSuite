<!-- SSM:CHUNK_BOUNDARY id="ch41-start" -->
📘 CHAPTER 41 — MISSION CRITICAL SYSTEMS 🔴 Advanced

### 41.1 Safety Guidelines

Guidelines for mission-critical TypeScript:

- **Never use `any`**: Always use `unknown` with narrowing
- **Enable strict mode**: Use all strict flags
- **Validate at boundaries**: Runtime validation for external data
- **Exhaustive checks**: Use `never` for exhaustive checking
- **Type-safe errors**: Use discriminated unions for errors

### 41.2 Code Review Checklist

TypeScript code review checklist:

- [ ] No `any` types
- [ ] All external data validated
- [ ] Exhaustive checks for unions
- [ ] Proper error handling
- [ ] Type-safe APIs
- [ ] No type assertions without justification

---


<!-- SSM:CHUNK_BOUNDARY id="ch41-end" -->
