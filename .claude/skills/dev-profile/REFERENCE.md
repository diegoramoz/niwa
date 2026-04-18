# Evaluation Dimension Reference

Detailed criteria for each dimension in the developer profile. Use these to guide what to look for — not as a checklist to score every item.

---

## Architecture & Design

**What to look for:**
- Is there a clear separation between data, business logic, and presentation?
- Are dependencies injected or hardcoded?
- Is there evidence of layered architecture (e.g., service/repository pattern, domain model)?
- Are interfaces/abstractions used appropriately, or is everything concrete?
- Does the structure suggest the developer thought about future change?

**Strong signals:**
- Domain models isolated from framework concerns
- Consistent module boundaries
- Data access in one place, not scattered

**Weak signals:**
- Business logic in route handlers or UI components
- God objects / god files
- Circular dependencies

---

## Code Quality

**What to look for:**
- Function/method length (ideal: fits on one screen)
- Naming clarity (does the name explain intent without a comment?)
- Duplication (is the same logic copy-pasted across files?)
- Consistent style within and across files

**Strong signals:**
- Functions that do one thing
- Names that read like prose (`fetchUserById`, not `getData`)
- DRY without over-abstraction

**Weak signals:**
- Functions > 80 lines with multiple levels of nesting
- Abbreviations that require domain knowledge to decode
- Magic numbers/strings without named constants

---

## Testing

**What to look for:**
- Are tests present at all?
- What types: unit, integration, e2e?
- Do tests assert behavior or just implementation details?
- Are edge cases covered?
- Test naming: does the test name describe what should happen?

**Strong signals:**
- Tests named `should [do X] when [condition Y]`
- Separate test files mirroring source structure
- Mocks at system boundaries, not inside business logic
- Edge cases and error paths tested

**Weak signals:**
- Tests that only assert the happy path
- Tests that mirror implementation (brittle)
- `expect(true).toBe(true)` style placeholders

---

## Tooling & DX

**What to look for:**
- Linter configured (ESLint, Clippy, Ruff, etc.)?
- Formatter configured (Prettier, gofmt, Black, etc.)?
- CI pipeline present (GitHub Actions, CircleCI, etc.)?
- Pre-commit hooks?
- Makefile or task runner for common operations?

**Strong signals:**
- CI runs lint + test on every PR
- Formatter enforced automatically
- Build reproducible from a single command

**Weak signals:**
- No CI
- Linter disabled with broad ignore rules
- `node_modules` committed

---

## Security Awareness

**What to look for:**
- Are secrets hardcoded anywhere? Search for `password =`, `api_key =`, `Bearer `.
- Is user input validated before use?
- Are dependencies pinned or using lockfiles?
- Is `eval()` or equivalent used?
- Are SQL queries parameterized?

**Strong signals:**
- `.env.example` present, `.env` in `.gitignore`
- Input validation at system boundaries
- Parameterized queries / ORM usage
- `dependabot.yml` or equivalent

**Weak signals:**
- Hardcoded credentials (even test ones normalize bad habits)
- `eval()` or `exec()` on user input
- Unpinned dependencies in production code

---

## Documentation

**What to look for:**
- README: does it explain what the project does, how to run it, and how to contribute?
- Inline comments: do they explain *why*, not *what*?
- API documentation: are public interfaces documented?
- Are complex algorithms explained?

**Strong signals:**
- README with setup, usage, and architecture overview
- Comments on non-obvious decisions ("using X because Y library has bug Z")
- JSDoc/Typedoc/godoc on exported symbols

**Weak signals:**
- Comments that restate the code (`// increment i` above `i++`)
- No README or an empty one
- Commented-out dead code left in files

---

## Language Fluency

**What to look for:**
- Does the code use idiomatic constructs for the language?
- Are standard library features used, or are they reimplemented by hand?
- Are advanced features (generics, async/await, pattern matching) used correctly?
- Are common anti-patterns present?

**Strong signals (language-specific examples):**
- JS/TS: proper async/await, optional chaining, type narrowing, no `any` abuse
- Python: context managers, list comprehensions, dataclasses
- Go: error wrapping with `%w`, interfaces for testability, defer for cleanup
- Rust: ownership without unnecessary cloning, `Result`/`Option` chaining

**Weak signals:**
- Manual promise chains where async/await fits
- Rewriting `Array.prototype.find` by hand
- Excessive type casting / unsafe casts

---

## Problem-Solving

**What to look for:**
- Are data structures appropriate for the operation (map for lookups, not array)?
- Is error handling present and useful (not just `catch(e) {}`)?
- Are edge cases handled (empty arrays, null checks, concurrent writes)?
- Are there comments or commit messages explaining hard decisions?

**Strong signals:**
- Appropriate data structure choice with evidence of reasoning
- Errors propagated with context, not swallowed
- Explicit handling of "what if this is empty/null/concurrent"

**Weak signals:**
- O(n²) where a map would give O(1)
- `catch (e) { console.log(e) }` or similar
- No null/undefined guards at I/O boundaries

---

## Signal Quality Guide

| Repo type | Signal quality | Notes |
|---|---|---|
| Personal project, 50+ commits, deployed | Strong | High signal across all dimensions |
| Work sample / take-home | Strong | Focused but potentially polished beyond normal |
| Open source contribution | Moderate | Shows collaboration skills too |
| Tutorial follow-along | Low | Architecture choices aren't theirs |
| Single-file script | Low | Limited scope by design |
| Fork with minor changes | Low | Credit only observable deltas |
| Boilerplate with features added | Moderate | Evaluate only what they added |
