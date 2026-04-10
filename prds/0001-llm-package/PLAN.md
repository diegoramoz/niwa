# Plan: LLM Package — Local Ollama with Cloudflare Tunnel

> Source PRD: prds/0001-llm-package/PRD.md

## Architectural decisions

- **Package name**: `@oss/llm` at `packages/llm/` — no `workspace:*` dependencies
- **Entry point**: `src/index.ts` exports `extractInvoiceFromOllama` and `OllamaExtraction`
- **Config**: env vars parsed with zod in `src/config.ts`; loaded from `packages/llm/.env` locally
- **Backend**: native Ollama only — `ollama serve` on the host, exposes `localhost:11434`
- **Model**: `OLLAMA_MODEL` env var, defaults to `llama3.2-vision`
- **Tunnel**: named Cloudflare Tunnel, static hostname, secured with Cloudflare Access service tokens
- **Auth headers**: `extractInvoiceFromOllama` accepts optional `headers` param for `CF-Access-Client-Id` / `CF-Access-Client-Secret`
- **Migration**: `packages/api/src/ollama.ts` deleted; `packages/api` imports from `@oss/llm`

---

## Phase 1: Scaffold the package and migrate extraction logic

**User stories**: `packages/api` keeps working; extraction logic has a canonical home

### What to build

Create `packages/llm` with `package.json`, `tsconfig.json`, and `src/config.ts`. Move `packages/api/src/ollama.ts` to `packages/llm/src/extract.ts`, adding the optional `headers` parameter to `extractInvoiceFromOllama`. Export everything from `src/index.ts`. Add `@oss/llm` as a dependency in `packages/api/package.json` and update its import. Delete the original `ollama.ts`.

### Acceptance criteria

- [ ] `packages/llm` builds cleanly with `tsc`
- [ ] `packages/api` imports `extractInvoiceFromOllama` from `@oss/llm` without errors
- [ ] `packages/api/src/ollama.ts` no longer exists
- [ ] `OLLAMA_MODEL` env var is read at runtime; changing it changes the model used
- [ ] `extractInvoiceFromOllama` accepts an optional `headers` param and forwards it to the fetch call

---

## Phase 2: Native Ollama start script

**User stories**: Developer runs one command on Mac to start Ollama and pull the model

### What to build

Add `scripts/start.ts`. When `OLLAMA_BACKEND=native` (or unset), the script checks if `ollama` CLI is installed, spawns `ollama serve` as a background child process, waits for `localhost:11434` to become ready, then runs `ollama pull $OLLAMA_MODEL` if the model isn't already available. Logs each step clearly. On `SIGINT`/`SIGTERM`, shuts down the child process.

### Acceptance criteria

- [ ] `bun run start` on a Mac with Ollama installed starts the server and prints a ready message
- [ ] If `ollama` is not installed, the script prints a helpful install message and exits non-zero
- [ ] If the model is already pulled, the pull step is skipped
- [ ] `OLLAMA_MODEL=llava bun run start` uses `llava` instead of `llama3.2-vision`
- [ ] `Ctrl+C` cleanly stops the `ollama serve` process

---

## Phase 3: Cloudflare Tunnel integration

**User stories**: Developer exposes local Ollama to the internet with a stable URL

### What to build

Add `scripts/tunnel.ts` that runs `cloudflared tunnel run $CF_TUNNEL_NAME` using the token from `CF_TUNNEL_TOKEN`. The `bun run start` script calls the tunnel step after Ollama is ready, prints the public URL, and keeps both processes alive. Add a `bun run tunnel` script entry in `package.json` for tunnel-only mode (when Ollama is already running).

### Acceptance criteria

- [ ] `bun run tunnel` starts the Cloudflare tunnel and prints the public hostname
- [ ] `bun run start` runs Ollama then the tunnel; both stay alive until `Ctrl+C`
- [ ] If `CF_TUNNEL_TOKEN` is missing, the script prints a setup instruction and exits non-zero
- [ ] `Ctrl+C` shuts down both the tunnel and Ollama processes cleanly

---

## Phase 4: Cloudflare Access headers wired to `packages/api`

**User stories**: Website calls local Ollama through the tunnel with Cloudflare Access auth

### What to build

Update the call site in `packages/api` that calls `extractInvoiceFromOllama` to read `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` from env and pass them as headers. Update `packages/api` env validation to include these vars. Add `OLLAMA_URL`, `CF_ACCESS_CLIENT_ID`, and `CF_ACCESS_CLIENT_SECRET` to the website's env documentation / turbo `globalEnv`.

### Acceptance criteria

- [ ] When `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` are set, they are sent as `CF-Access-Client-Id` and `CF-Access-Client-Secret` headers
- [ ] When they are not set, the fetch proceeds without those headers (local dev against `localhost:11434`)
- [ ] `OLLAMA_URL` env var overrides the default `http://localhost:11434` base URL
- [ ] `turbo.json` `globalEnv` includes the three new website env vars
