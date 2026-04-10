---
id: "001"
title: Scaffold @oss/llm package and migrate extraction logic from packages/api
prd: "0001"
status: closed
type: afk
blocked_by: []
created: 2026-04-10
---

## Parent PRD

prds/0001-llm-package/PRD.md

## What to build

Create `packages/llm` as a standalone TypeScript ESM package (`@oss/llm`) with no `workspace:*` dependencies. Move `packages/api/src/ollama.ts` into `packages/llm/src/extract.ts`, updating `extractInvoiceFromOllama` to accept an optional `headers` parameter that is forwarded to the fetch call. Parse all env vars (Ollama URL, model name) via zod in `src/config.ts`. Export `extractInvoiceFromOllama` and `OllamaExtraction` from `src/index.ts`.

Update `packages/api/package.json` to depend on `@oss/llm` and update its import. Delete `packages/api/src/ollama.ts`.

See the Migration section and Module Shape in the PRD for the exact file layout.

## Acceptance criteria

- [ ] `packages/llm` builds cleanly with `tsc`
- [ ] `packages/api` imports `extractInvoiceFromOllama` from `@oss/llm` without errors
- [ ] `packages/api/src/ollama.ts` no longer exists
- [ ] `OLLAMA_MODEL` env var is read at runtime; changing it changes the model used
- [ ] `extractInvoiceFromOllama` accepts an optional `headers` param and forwards it to the fetch call
- [ ] `OLLAMA_URL` env var overrides the default `http://localhost:11434` base URL

## Blocked by

None — can start immediately.

## User stories addressed

- `packages/api` continues to work unchanged after migration
- Extraction logic has a single canonical home in `@oss/llm`

## Completion

Created `packages/llm` (`@oss/llm`) as a standalone ESM package with no `workspace:*` dependencies. The package contains:

- `src/config.ts` — zod schema parsing `OLLAMA_MODEL` (default: `llama3.2-vision`) and `OLLAMA_URL` (default: `http://localhost:11434`) from `process.env`
- `src/extract.ts` — extraction logic migrated from `packages/api/src/ollama.ts`; `extractInvoiceFromOllama` now accepts an optional `headers` param forwarded to the fetch call; reads model and base URL from config at runtime
- `src/index.ts` — re-exports `extractInvoiceFromOllama` and `OllamaExtraction`
- `.env.example` — documents all env vars

Updated `packages/api/package.json` to add `"@oss/llm": "workspace:*"`. Updated `packages/api/src/routers/index.ts` import from `@oss/api/ollama` to `@oss/llm`. Deleted `packages/api/src/ollama.ts`. Both packages typecheck cleanly (pre-existing JSX errors in other packages are unrelated).

## Suggested Commit

DIEGO: 001 PRD-0001 — scaffold @oss/llm and migrate extraction logic from packages/api

- packages/llm: new standalone ESM package with config.ts (zod env parsing), extract.ts (migrated from api/ollama.ts with optional headers param), index.ts
- packages/api: added @oss/llm dep, updated import in routers/index.ts, deleted ollama.ts
