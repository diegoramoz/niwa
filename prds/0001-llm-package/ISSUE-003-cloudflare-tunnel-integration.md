---
id: "003"
title: Cloudflare Tunnel integration — bun run tunnel and full bun run start
prd: "0001"
status: open
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
