---
id: "004"
title: Wire Cloudflare Access headers from packages/api to the tunnel
prd: "0001"
status: open
type: afk
blocked_by: ["001", "003"]
created: 2026-04-10
---

## Parent PRD

prds/0001-llm-package/PRD.md

## What to build

Update the call site in `packages/api` that calls `extractInvoiceFromOllama` to read `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` from env and pass them as the optional `headers` argument (`CF-Access-Client-Id`, `CF-Access-Client-Secret`). When either env var is absent, the headers object is omitted and the fetch proceeds without auth headers (for local dev against `localhost:11434`).

Add `OLLAMA_URL`, `CF_ACCESS_CLIENT_ID`, and `CF_ACCESS_CLIENT_SECRET` to `packages/api`'s env validation and to `turbo.json` `globalEnv`.

See the Cloudflare Access authentication section of the PRD for header names and the Environment Variables table for where each var lives.

## Acceptance criteria

- [ ] When `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` are set, they are sent as `CF-Access-Client-Id` and `CF-Access-Client-Secret` headers on every Ollama request
- [ ] When they are not set, the fetch proceeds without those headers (no error)
- [ ] `OLLAMA_URL` env var overrides the default base URL in `packages/api`'s call site
- [ ] `turbo.json` `globalEnv` includes `OLLAMA_URL`, `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET`
- [ ] `packages/api` env validation schema includes the three new vars

## Blocked by

- ISSUE-001
- ISSUE-003

## User stories addressed

- Website calls local Ollama through the tunnel with Cloudflare Access auth
