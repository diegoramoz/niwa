---
id: "0003"
title: ACK Identity Demo Replatform to the Next App Stack
status: draft
created: 2026-05-05
---

# ACK Identity Demo Replatform to the Next App Stack

## Problem

The current ACK identity demo lives in `ack/demos/identity` as a standalone TypeScript CLI that spins up two local Hono servers and walks the user through identity creation, credential issuance, DID exchange, verification, and fulfillment. It proves the protocol flow, but it does not match the application stack used by this monorepo's product apps.

That gap creates three problems:

1. The demo is hard to reuse from app-router applications because its orchestration, transport, and UI are tied to a local CLI runtime.
2. The core ACK-ID flow is mixed with demo-specific runtime concerns such as local ports, process memory, and terminal prompts.
3. There is no migration path that shows how to preserve the demo's behavior while adopting the conventions already used by `apps/web` and `apps/finance`.

## Solution

Create a dedicated Next.js app in this monorepo that preserves behavioral parity with the current ACK identity demo while adopting the app stack used by the existing apps:

1. **Dedicated app boundary**: build a new app under `apps/` instead of embedding the demo inside `apps/web` or `apps/finance`
2. **Shared package boundary**: extract reusable identity orchestration into workspace packages; keep the app layer thin
3. **App-router transport**: expose protocol steps through Next route handlers rather than Hono servers
4. **Guided browser UX**: replace the CLI walkthrough with an inspectable multi-step browser flow
5. **Ephemeral first pass**: keep the first version in memory to preserve scope and behavior parity
6. **Pluggable payload layer**: keep the haiku exchange as a demo payload, not a core identity dependency

## Goals

- Preserve the current demo's end-to-end flow:
  - owner creation
  - client agent creation
  - ownership VC issuance
  - server owner and agent creation
  - DID exchange and identity verification
  - successful fulfillment after verification
- Replatform the flow onto a Next 16 app-router application using the same monorepo conventions as the current apps
- Make reusable ACK-ID orchestration available to future apps through shared packages
- Keep protocol-relevant endpoints explicit and testable as HTTP route handlers
- Provide an implementation-ready migration path with phases, risks, and validation criteria

## Non-Goals

- Adding database persistence in the first pass
- Folding the demo into `apps/web` or `apps/finance`
- Redesigning the flow into a different product experience
- Changing ACK-ID semantics or replacing the did/vc verification sequence with app-local shortcuts
- Making the haiku interaction a required architectural concern of the identity layer

## Key Design Decisions

### Behavioral parity before product adaptation
The migration targets the existing demo behavior, not a reimagined product. The browser experience should teach and expose the same protocol steps the CLI currently demonstrates.

### Dedicated app, shared logic
The new host should be a dedicated Next app under `apps/`, using the same stack conventions as `apps/web` and `apps/finance`:

- Next app router
- app-scoped env bootstrap via `@oss/env/*`
- shared workspace packages for reusable domain logic
- `turbo` task integration

Reusable identity logic moves into a shared package, while the app owns:

- page flow
- route handlers
- request wiring
- demo-specific presentation

### Explicit protocol route handlers
The current demo exposes protocol surfaces over HTTP:

- `POST /chat`
- `POST /identity/challenge`
- `GET /identity/vc`

The migrated app should preserve that transport model using Next route handlers. UI-triggered orchestration may use server actions or direct fetches, but protocol steps remain explicit endpoints.

### Single-host path namespacing instead of multiple localhost ports
The CLI demo differentiates the client and server agents with separate ports (`5678` and `5679`). In the app-router version, both agents live under the same application host and are separated by route namespace instead:

- `POST /api/demo/agents/client/chat`
- `POST /api/demo/agents/client/identity/challenge`
- `GET /api/demo/agents/client/identity/vc`
- `POST /api/demo/agents/server/chat`
- `POST /api/demo/agents/server/identity/challenge`
- `GET /api/demo/agents/server/identity/vc`

This keeps the DID document service endpoints honest while removing the need for two local servers.

### Ephemeral first pass
The first migration keeps generated keys, DID documents, ownership credentials, and conversation state in memory. This preserves demo parity and avoids expanding scope into data modeling, persistence, and long-lived session design.

Persistence is explicitly deferred.

### Pluggable payload interaction
The haiku exchange stays in the migrated demo because it proves that fulfillment is gated by identity verification. However, it should be treated as a payload module behind the identity gate, not part of the core identity package.

## Proposed Module Shape

```text
apps/ack/
├── package.json
├── next.config.ts
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── demo/
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   └── api/
│   │       └── demo/
│   │           ├── session/route.ts
│   │           ├── reset/route.ts
│   │           └── agents/
│   │               └── [agentId]/
│   │                   ├── chat/route.ts
│   │                   └── identity/
│   │                       ├── challenge/route.ts
│   │                       └── vc/route.ts
│   └── lib/
│       └── demo-client.ts
│
packages/identity/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── owner.ts
    ├── agent.ts
    ├── credential-issuer.ts
    ├── credential-verifier.ts
    ├── session.ts
    ├── in-memory-session-store.ts
    ├── verification.ts
    └── payloads/
        └── haiku.ts
```

Notes:

- `packages/identity` is a working name for the shared workspace package.
- `agentcommercekit` remains the underlying protocol library.
- The app owns the route tree and page composition; the package owns identity orchestration and verification.

## Environment Variables

### App env
The dedicated app should follow the same `@oss/env/*` pattern as the existing apps.

Required for the first pass:

- `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`
- `PORT` optional for local dev
- `VERCEL_PROJECT_PRODUCTION_URL` optional for deployment-aware base URL generation

### Not in scope yet

- database credentials
- credential persistence storage
- background workers or queues

## UX Shape

The app should be a guided, inspectable browser demo instead of a hidden backend flow. Each step should surface the same artifacts the CLI exposes:

- owner DID
- owner DID document
- client and server agent DID documents
- issued ownership credentials
- identity verification result
- final fulfilled response

The UI should make it obvious when fulfillment is blocked pending verification and when verification succeeds.

## Testing Strategy

The migration is only complete if parity is proven at two levels:

1. **Shared package tests** for owner creation, agent DID document generation, VC issuance, challenge verification, and identity validation
2. **App integration tests** for the full browser flow from session setup through verified fulfillment

## Acceptance Criteria

- [ ] A new dedicated Next app exists under `apps/` and follows the monorepo's existing app conventions
- [ ] The app demonstrates the same end-to-end ACK identity flow as `ack/demos/identity`
- [ ] Reusable identity orchestration no longer lives only inside app-local files
- [ ] Route handlers explicitly implement chat, identity challenge, and VC retrieval surfaces
- [ ] The first pass runs entirely in memory with no database dependency
- [ ] The haiku interaction is replaceable without rewriting the core identity package
- [ ] The migration includes package-level tests and app-level integration coverage
