---
name: prd-to-issues
description: Break a PRD into independently-grabbable local issue files using tracer-bullet vertical slices. Use when user wants to convert a PRD to issues, create implementation tickets, or break down a PRD into work items.
---

# PRD to Issues

Break a PRD into independently-grabbable issue files using vertical slices (tracer bullets).

## Process

### 1. Locate the PRD

The PRD should already be in the conversation. If it isn't, ask the user to point you to the file (e.g. `./prds/0001-user-authentication/PRD.md`).

Read the PRD frontmatter to get the `id` — you will need it to set the `prd` field in each issue and to determine the output directory.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code.

### 3. Draft vertical slices

Break the PRD into **tracer bullet** issues. Each issue is a thin vertical slice that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer.

Slices may be 'HITL' or 'AFK'. HITL slices require human interaction, such as an architectural decision or a design review. AFK slices can be implemented and merged without human interaction. Prefer AFK over HITL where possible.

<vertical-slice-rules>
- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones
</vertical-slice-rules>

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Type**: HITL / AFK
- **Blocked by**: which other slices (if any) must complete first
- **User stories covered**: which user stories from the PRD this addresses

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?
- Are the correct slices marked as HITL and AFK?

Iterate until the user approves the breakdown.

### 5. Write the issue files

**Storage rules:**
- Output directory: `./prds/NNNN-slug/` (same directory as the PRD)
- Determine next issue ID by scanning the PRD dir for files matching `ISSUE-NNN-*.md`, taking the max numeric prefix + 1. Default to `001` if none exist.
- Issue IDs are 3-digit zero-padded (`001`, `002`...)
- Filename: `ISSUE-NNN-slug.md` where slug is the title lowercased, hyphenated, max 50 chars at word boundary
- Write issues in dependency order (blockers first) so you can reference real IDs in `blocked_by`

**Issue file frontmatter:**
```yaml
---
id: "NNN"
title: <Title>
prd: "NNNN"
status: open
type: hitl | afk
blocked_by: []
created: <YYYY-MM-DD>
---
```

Use the issue body template below after the frontmatter.

<issue-template>
## Parent PRD

prds/<NNNN-slug>/PRD.md

## What to build

A concise description of this vertical slice. Describe the end-to-end behavior, not layer-by-layer implementation. Reference specific sections of the parent PRD rather than duplicating content.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Blocked by

- ISSUE-NNN (if any)

Or "None - can start immediately" if no blockers.

## User stories addressed

Reference by number from the parent PRD:

- User story 3
- User story 7

</issue-template>

Do NOT modify the parent PRD file.
