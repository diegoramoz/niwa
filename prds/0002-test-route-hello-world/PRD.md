---
id: "0002"
title: Test Route — Hello World
status: draft
created: 2026-04-01
---

# Test Route — Hello World

## Problem

No `/test` route exists. A bare, minimal page is needed at that path.

## Solution

Add `src/app/test/page.tsx` — a server component that renders a single "Hello World" heading. No layout, no sidebar, no route group.

## Scope

- **In**: `src/app/test/page.tsx`
- **Out**: layouts, sidebars, navigation links, auth guards, styling beyond defaults

## Acceptance criteria

- `GET /test` returns a page containing "Hello World"
- No route group wrapper
- Server component (no `"use client"`)
