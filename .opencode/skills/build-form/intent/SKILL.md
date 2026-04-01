---
name: intent
description: Transform an idea into a clear PRD, phased plan, and implementation issues through guided interview, codebase exploration, and structured local artifacts. Use when user wants to go from idea to implementation, start a new feature end-to-end, or mentions "intent".
---

# Intent

Transform a rough idea into a clear PRD, phased plan, and independently-grabbable issues — all saved locally with no GitHub dependency.

## Local storage rules

All artifacts are saved to the project root under `./prds/NNNN-slug/`.

```
prds/
  0001-slug-of-title/
    PRD.md
    PLAN.md
    ISSUE-001-slug-of-issue.md
    ISSUE-002-slug-of-issue.md
```

- **PRD IDs**: 4-digit zero-padded, sequential (`0001`, `0002`...)
- **Issue IDs**: 3-digit zero-padded, sequential per PRD (`001`, `002`...)
- **Slugs**: lowercase, hyphens, max 50 chars at word boundary, no special characters
- **Determine next PRD ID**: scan `./prds/` for dirs matching `NNNN-*`, take the max numeric prefix + 1, default `0001` if none exist
- **Determine next issue ID**: scan the PRD dir for files matching `ISSUE-NNN-*.md`, take the max numeric prefix + 1, default `001` if none exist

### PRD.md frontmatter

```yaml
---
id: "0001"
title: <Title>
status: draft
created: <YYYY-MM-DD>
---
```

### ISSUE-NNN-slug.md frontmatter

```yaml
---
id: "001"
title: <Title>
prd: "0001"
status: open
type: hitl | afk
blocked_by: []
created: <YYYY-MM-DD>
---
```

---

## Phase 1 — Understand the intent

Ask the user one open question: **"What's the idea?"** Let them describe freely.

Then grill them relentlessly following the approach in `.claude/skills/grill-me/SKILL.md`:
- One question at a time
- Provide your recommended answer for each question
- Walk down each branch of the decision tree, resolving dependencies between decisions one-by-one
- If a question can be answered by exploring the codebase, explore instead of asking

Continue until you have a thorough understanding of: the problem, the proposed solution, constraints, and key design decisions.

## Phase 2 — Explore the codebase

Explore the repo to:
- Verify the user's assertions against current code
- Understand the current state of relevant modules and interfaces
- Identify existing patterns, integration points, and test conventions
- Spot opportunities for deep modules that can be tested in isolation

If the codebase reveals surprises that reopen design questions, grill the user further (one question at a time) until resolved.

## Phase 3 — Write the PRD

Follow the PRD process and template in `.claude/skills/write-a-prd/SKILL.md`. Skip the interview steps — they were completed in Phase 1. Skip module sketching if it was already covered during grilling.

**Storage**: Determine the next PRD ID, create `./prds/NNNN-slug/`, write `PRD.md` using the frontmatter above. Do NOT submit to GitHub.

After writing, print the file path and ask:

> **"Does this PRD look right? Reply 'yes' to continue to the plan, or give feedback to revise."**

Do not proceed until the user approves.

## Phase 4 — Write the PLAN

Follow the plan process and template in `.claude/skills/prd-to-plan/SKILL.md`. The PRD is already in context — skip the "confirm PRD is in context" step.

**Storage**: Write `PLAN.md` to the same PRD directory (`./prds/NNNN-slug/PLAN.md`). Do NOT write to `./plans/`.

After writing, print the file path and ask:

> **"Does this plan look right? Reply 'yes' to continue to issues, or give feedback to revise."**

Do not proceed until the user approves.

## Phase 5 — Write the issues

Follow the issues process and template in `.claude/skills/prd-to-issues/SKILL.md`. Skip any steps that reference GitHub.

**Storage**: For each approved issue, write `./prds/NNNN-slug/ISSUE-NNN-slug.md` using the frontmatter above. Do NOT call `gh issue create`.

After all issues are written, print a summary list of all files created in this session.
