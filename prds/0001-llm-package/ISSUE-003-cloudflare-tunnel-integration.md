---
id: "003"
title: Cloudflare Tunnel integration — bun run tunnel and full bun run start
prd: "0001"
status: closed
type: afk
blocked_by: ["002"]
created: 2026-04-10
---

## Parent PRD

prds/0001-llm-package/PRD.md

## What to build

Add `scripts/tunnel.ts` that runs `cloudflared tunnel run $CF_TUNNEL_NAME` using `CF_TUNNEL_TOKEN`. Wire it as `"tunnel": "bun scripts/tunnel.ts"` in `package.json`.

Extend `scripts/start.ts` to call the tunnel step after Ollama is ready. Print the public tunnel hostname to stdout. Keep both processes alive until `Ctrl+C`, which shuts down both cleanly.

If `CF_TUNNEL_TOKEN` is missing, print a setup instruction referencing the runbook in the PRD and exit non-zero.

See the Cloudflare Tunnel — static named tunnel section of the PRD for naming conventions and the Setup Runbook for the one-time manual steps (which should be documented in a `README.md`).

## Acceptance criteria

- [ ] `bun run tunnel` starts the Cloudflare tunnel and prints the public hostname
- [ ] `bun run start` runs Ollama then the tunnel; both stay alive until `Ctrl+C`
- [ ] If `CF_TUNNEL_TOKEN` is missing, the script prints setup instructions and exits non-zero
- [ ] `Ctrl+C` shuts down both the tunnel and Ollama processes cleanly
- [ ] `README.md` in `packages/llm` documents the one-time Cloudflare setup runbook

## Blocked by

- ISSUE-002

## User stories addressed

- Developer exposes local Ollama to the internet with a stable URL

## Completion

Added `scripts/tunnel.ts` as a standalone script that:
- Loads `.env` via dotenv at startup
- Checks `CF_TUNNEL_TOKEN` is set — if not, prints setup instructions referencing `README.md` and exits non-zero
- Spawns `cloudflared tunnel run --token $CF_TUNNEL_TOKEN` with stdout/stderr inherited
- Prints `https://$CF_TUNNEL_HOSTNAME` if set, otherwise a fallback message
- Exports `spawnTunnel(token, hostname?)` using `import.meta.main` guard so it can be imported without side effects
- Registers SIGINT/SIGTERM handlers that kill the tunnel process and exit cleanly

Extended `scripts/start.ts` to:
- Check `CF_TUNNEL_TOKEN` before starting Ollama (exit non-zero with runbook reference if missing)
- Import and call `spawnTunnel()` after Ollama is ready and model is pulled
- Extend SIGINT/SIGTERM cleanup to also kill the tunnel process
- Use `Promise.race([ollamaProc.exited, tunnelProc.exited])` to detect unexpected child exits

Added `"tunnel": "bun scripts/tunnel.ts"` to `package.json` scripts.

Updated `.env.example` with `CF_TUNNEL_HOSTNAME` (public tunnel hostname, printed on startup).

Created `README.md` with quick-start instructions and the full one-time Cloudflare setup runbook (install cloudflared, authenticate, create tunnel, route DNS, get token, create Access application and service token, configure website env).

`bun run typecheck` and `bun test` both pass cleanly (6 unit tests).

## Suggested Commit

DIEGO: 003 PRD-0001 — Cloudflare Tunnel integration (bun run tunnel + extended bun run start)

- packages/llm/scripts/tunnel.ts: spawn cloudflared with token, export spawnTunnel(), SIGINT/SIGTERM cleanup
- packages/llm/scripts/start.ts: check CF_TUNNEL_TOKEN, start tunnel after Ollama ready, kill both on exit
- packages/llm/package.json: added "tunnel" script
- packages/llm/.env.example: added CF_TUNNEL_HOSTNAME
- packages/llm/README.md: quick-start + full one-time Cloudflare setup runbook
