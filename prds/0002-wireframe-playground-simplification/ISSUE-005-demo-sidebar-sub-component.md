---
id: "005"
title: DemoSidebar internal sub-component
prd: "0002"
status: closed
type: afk
blocked_by: []
created: 2026-04-13
---

## Parent PRD

prds/0002-wireframe-playground-simplification/PRD.md

## What to build

Extract a file-local `DemoSidebar` component inside `configurable-wireframe.tsx`. It accepts `position` (`"left" | "right"`), `collapsed` (boolean), and `onToggle` (function). Replace the near-duplicate left and right sidebar demo blocks with two `<DemoSidebar>` usages — one per side.

`DemoSidebar` is not exported; it is a rendering detail of the demo only.

## Acceptance criteria

- [ ] A file-local `DemoSidebar` component exists in `configurable-wireframe.tsx`
- [ ] The left and right sidebar blocks are replaced by `<DemoSidebar position="left" ...>` and `<DemoSidebar position="right" ...>`
- [ ] Collapse/expand toggles work correctly for both sides
- [ ] `ComponentName` tooltip labels still show the correct component name for each side
- [ ] No duplicated sidebar layout markup remains between the two usages

## Blocked by

None — can start immediately.

## User stories addressed

- User story 1

## Completion

Extracted a file-local `DemoSidebar` component inside `configurable-wireframe.tsx` accepting `position` (`"left" | "right"`), `collapsed` (boolean), and `onToggle` (() => void). The `WireframeSidebar` wrapping, blue background block, header row (with `ComponentName` tooltip and toggle button), and the tall border div are all rendered from `DemoSidebar`.

Key implementation details:
- `isLeft = position === "left"` drives the three position-specific values.
- `flex-row-reverse` for the right sidebar header is applied conditionally via `!isLeft && "flex-row-reverse"`.
- Toggle arrow: `isLeft === collapsed ? "→" : "←"` — a single expression covering all four cases without nested ternaries (satisfies Biome's no-nested-ternary rule).
- The two near-identical 30-line sidebar blocks in `ConfigurableWireframe` are now two `<DemoSidebar>` calls (~5 lines each).

## Suggested Commit

DIEGO: 005 PRD-0002 — DemoSidebar internal sub-component

- packages/ui/src/components/wireframe/configurable-wireframe.tsx: extract file-local DemoSidebar, replace both sidebar blocks with two <DemoSidebar> usages
