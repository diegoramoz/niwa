---
id: "002"
title: Native Ollama start script for Mac (bun run start)
prd: "0001"
status: open
type: afk
blocked_by: ["001"]
created: 2026-04-10
---

## Parent PRD

prds/0001-llm-package/PRD.md

## What to build

Add `scripts/start.ts` to `packages/llm`. When `OLLAMA_BACKEND=native` (or unset), the script:

1. Checks that the `ollama` CLI is installed — exits with a helpful install message if not
2. Spawns `ollama serve` as a background child process
3. Polls `localhost:11434` until ready
4. Runs `ollama pull $OLLAMA_MODEL` if the model isn't already available (skip if already pulled)
5. Logs each step clearly to stdout
6. On `SIGINT`/`SIGTERM`, kills the child process and exits cleanly

Wire it as `"start": "bun scripts/start.ts"` in `package.json`. Also add `.env.example` documenting all env vars (`OLLAMA_MODEL`, `CF_TUNNEL_NAME`, `CF_TUNNEL_TOKEN`).

See the Model configurability section of the PRD for env var details.

## Acceptance criteria

- [ ] `bun run start` on a Mac with Ollama installed starts the server and prints a ready message
- [ ] If `ollama` CLI is not installed, the script prints a helpful install message and exits non-zero
- [ ] If the model is already pulled, the pull step is skipped with a log message
- [ ] `OLLAMA_MODEL=llava bun run start` uses `llava` instead of `llama3.2-vision`
- [ ] `Ctrl+C` cleanly terminates the `ollama serve` child process
- [ ] `.env.example` documents all env vars with descriptions

## Blocked by

- ISSUE-001

## User stories addressed

- Developer runs one command on Mac to start Ollama and pull the model
