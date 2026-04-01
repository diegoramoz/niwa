---
id: "001"
title: Add /test page
prd: "0002"
status: open
type: afk
blocked_by: []
created: 2026-04-01
---

# Add /test page

## What

Create `src/app/test/page.tsx` — a bare server component that renders "Hello World" at the `/test` route.

## Acceptance criteria

- `GET /test` returns a page containing "Hello World"
- File is a server component (no `"use client"`)
- No route group, no layout, no sidebar

## Implementation notes

- Single file: `src/app/test/page.tsx`
- Export a default function returning `<h1>Hello World</h1>`
