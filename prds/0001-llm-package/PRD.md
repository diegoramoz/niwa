---
id: "0001"
title: LLM Package — Local Ollama with Cloudflare Tunnel
status: draft
created: 2026-04-10
---

# LLM Package — Local Ollama with Cloudflare Tunnel

## Problem

The monorepo needs to run vision-model inference (invoice image extraction) against a locally hosted LLM. Today, the Ollama integration lives in `packages/api/src/ollama.ts` — buried inside the API package with no way to run, manage, or expose Ollama independently. There is no tooling to start Ollama, pull models, or securely expose the local instance to the website running in production.

## Solution

Create a standalone `packages/llm` package (`@oss/llm`) that:

1. **Owns all Ollama interaction logic** — the existing `packages/api/src/ollama.ts` moves here; `packages/api` imports from `@oss/llm`
2. **Provides runnable scripts** to start Ollama (native or Docker), pull the required model, and launch a Cloudflare Tunnel — all in one command
3. **Secures the public endpoint** with Cloudflare Access service tokens so only the website can call it

The package has **no dependencies on other `@oss/*` packages** — it is self-contained and can be run on any machine (Mac with Apple Silicon, Linux with CUDA GPU, Windows with WSL2) without pulling in the rest of the monorepo.

## Goals

- Single command (`bun run start`) to go from zero to a publicly reachable, authenticated Ollama endpoint
- Model is configurable via env var — swap `llama3.2-vision` for any Ollama-compatible model without code changes
- Native Ollama only — runs directly on the host machine, using Metal on macOS
- `packages/api` continues to work unchanged after the migration of `ollama.ts`

## Non-Goals

- PDF-to-image conversion (already excluded in existing code)
- Building a general-purpose LLM proxy or API gateway
- Automating Cloudflare account/tunnel creation (documented, but done manually once)
- Docker or containerised Ollama — native only

## Key Design Decisions

### Package independence
`@oss/llm` depends only on external npm packages (`ollama`, `cloudflared`, `dotenv`, `zod`). No `workspace:*` deps. This means it can be copied to a GPU machine and run with `bun install && bun run start` without pulling the whole monorepo.

### Cloudflare Tunnel — static named tunnel
A named tunnel is created once (`cloudflared tunnel create llm`) and gets a permanent hostname. The tunnel name and hostname are stored in `.env` inside `packages/llm`. The website reads `OLLAMA_URL` (the permanent hostname) plus `CF_ACCESS_CLIENT_ID` / `CF_ACCESS_CLIENT_SECRET` from its own env.

### Cloudflare Access authentication
The tunnel is wrapped with a Cloudflare Access service token policy. The website sends `CF-Access-Client-Id` and `CF-Access-Client-Secret` headers on every request. The `extractInvoiceFromOllama` function (moved from `packages/api`) accepts optional auth headers so callers can inject them.

### Backend
Native Ollama only — `ollama serve` runs directly on the host. Fast on macOS via Metal GPU. Exposes Ollama on `localhost:11434`.

### Model configurability
`OLLAMA_MODEL` env var (default: `llama3.2-vision`). The extraction function reads this at runtime so no code changes are needed to swap models.

## Module Shape

```
packages/llm/
├── package.json              # name: @oss/llm, no workspace deps
├── tsconfig.json
├── .env.example              # OLLAMA_MODEL, CF_TUNNEL_NAME, CF_TUNNEL_TOKEN
├── src/
│   ├── index.ts              # exports: extractInvoiceFromOllama, OllamaExtraction
│   ├── extract.ts            # invoice extraction logic (moved from packages/api)
│   └── config.ts             # env var parsing with zod
└── scripts/
    ├── start.ts              # full stack: ollama + model pull + tunnel
    └── tunnel.ts             # tunnel only (ollama already running)
```

## Environment Variables

### `packages/llm/.env`
| Variable | Default | Description |
|---|---|---|
| `OLLAMA_MODEL` | `llama3.2-vision` | Any model available in Ollama |
| `CF_TUNNEL_NAME` | — | Name of the named Cloudflare tunnel |
| `CF_TUNNEL_TOKEN` | — | Token from `cloudflared tunnel token` |

### Website env (set in deployment platform)
| Variable | Description |
|---|---|
| `OLLAMA_URL` | Permanent Cloudflare tunnel hostname |
| `CF_ACCESS_CLIENT_ID` | Cloudflare Access service token ID |
| `CF_ACCESS_CLIENT_SECRET` | Cloudflare Access service token secret |

## Migration: `packages/api/src/ollama.ts`

1. Move `packages/api/src/ollama.ts` → `packages/llm/src/extract.ts`
2. Add `@oss/llm` as a dependency in `packages/api/package.json`
3. Update `packages/api` imports: `import { extractInvoiceFromOllama } from "@oss/llm"`
4. Delete `packages/api/src/ollama.ts`

The `extractInvoiceFromOllama` function signature gains an optional `headers` parameter for passing Cloudflare Access credentials:

```ts
extractInvoiceFromOllama(buffer: Buffer, mimeType: string, headers?: Record<string, string>): Promise<OllamaExtraction>
```

## Setup Runbook (one-time, documented in README)

1. Install `cloudflared` locally
2. `cloudflared tunnel login`
3. `cloudflared tunnel create llm`
4. Create a Cloudflare Access application + service token for the tunnel
5. Copy `.env.example` → `.env`, fill in values
6. `bun run start`

## Acceptance Criteria

- [ ] `bun run start` in `packages/llm` starts Ollama, pulls the model if missing, starts the tunnel, and prints the public URL
- [ ] `bun run tunnel` starts only the tunnel (Ollama assumed running)
- [ ] `extractInvoiceFromOllama` works when called from `packages/api` via the `@oss/llm` import
- [ ] Cloudflare Access headers are forwarded correctly when env vars are set
- [ ] `OLLAMA_MODEL` env var changes the model without code edits
- [ ] `OLLAMA_BACKEND=docker` starts Ollama via Docker Compose with GPU flags
- [ ] `packages/api/src/ollama.ts` is deleted; no broken imports remain
