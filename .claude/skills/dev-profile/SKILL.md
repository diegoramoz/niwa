---
name: dev-profile
description: Analyze a codebase to produce an evidence-based developer skill profile for hiring evaluation. Explores code quality, architecture, testing, tooling, and breadth of knowledge from observable artifacts. Use when someone wants to assess a developer's abilities, generate a hiring report, evaluate a candidate's repo, or understand what skills a developer demonstrates through their work.
---

# Dev Profile

Generate an unbiased developer skill profile from a codebase. Every claim must cite a specific file or commit — no inferences beyond what is observable.

## Workflow

### 1. Inventory the repo
- [ ] Read `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`, or equivalent — list languages, frameworks, key dependencies
- [ ] Read `README.md` and any docs to understand stated intent
- [ ] Run `git log --oneline -50` to gauge commit cadence and message quality
- [ ] List top-level directories to understand project layout

### 2. Probe each evaluation dimension (see [REFERENCE.md](REFERENCE.md))
For each dimension, collect 2–4 specific evidence items (file:line, commit hash, or pattern).

Dimensions:
- **Architecture & design** — separation of concerns, layer boundaries, data flow
- **Code quality** — naming, function size, duplication, readability
- **Testing** — coverage approach, test types present, test quality
- **Tooling & DX** — CI/CD, linting, formatting, build setup
- **Security awareness** — input validation, secret handling, dependency hygiene
- **Documentation** — inline comments quality, README depth, API docs
- **Language fluency** — idiomatic use, advanced feature usage, anti-pattern avoidance
- **Problem-solving** — algorithm choices, edge case handling, error handling strategy

### 3. Produce the profile

Output a structured report with these sections:

```
## Developer Profile: [repo name]
Generated: [date]  |  Commits analyzed: [N]  |  Primary language: [X]

### Summary
2–3 sentences. What kind of developer does this code suggest?

### Strengths (with evidence)
- **[Skill]**: [specific observation] — `path/to/file.ts:42`

### Growth areas (with evidence)
- **[Area]**: [specific observation] — `path/to/file.ts:42`

### Technology breadth
[List of technologies, frameworks, and tools, grouped by category]

### Signal quality
How much signal does this repo provide? (Limited / Moderate / Strong)
Caveats: [e.g., "repo is a tutorial follow-along", "few commits", "single feature"]

### Hiring considerations
Bullet list of concrete, observable facts relevant to a hiring decision.
No speculation about personality or potential.
```

## Bias guardrails

- Cite evidence for every claim. No evidence = omit the claim.
- Do not infer seniority from years of experience or commit dates alone.
- Do not comment on writing style, variable name culture, or non-technical signals.
- Flag low-signal repos explicitly (forks, tutorials, single-file scripts).
- Separate "not present" from "done poorly" — absence of tests may mean scope, not ability.
