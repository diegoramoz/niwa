# 01 - Identity demo shell with client owner flow

Status: closed

## What to build

Create a dedicated `apps/ack` Next app scaffold with app-router and app-scoped env loading, then deliver the first guided demo step end-to-end: initialize an in-memory demo session and create/render the client owner DID plus DID document in the browser.

## Acceptance criteria

- [x] `apps/ack` runs with the same monorepo workflow as existing apps (`dev`, `build`, `start`)
- [x] Env bootstrap follows the existing `@oss/env/*` pattern and loads without db/auth dependencies
- [x] The guided UI includes a step that creates the client owner in-memory and renders DID artifacts
- [x] One app-level integration test verifies this first step is executable in-browser

## Blocked by

None - can start immediately
