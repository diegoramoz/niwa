# Plan: ACK Identity Demo Replatform to the Next App Stack

> Source PRD: prds/0003-ack-identity-demo-replatform/PRD.md

## Architectural decisions

- **Target**: preserve behavioral parity with `ack/demos/identity`, not a product redesign
- **Host**: new dedicated Next app under `apps/`, using the same stack conventions as `apps/web` and `apps/finance`
- **Shared logic**: extract identity orchestration into a shared workspace package (`packages/identity` as a working name)
- **Transport**: use Next route handlers for protocol surfaces rather than Hono or internal-only RPC
- **State model**: keep the first pass ephemeral and in memory
- **UX**: guided multi-step browser demo with inspectable artifacts
- **Payload layer**: keep the haiku interaction, but isolate it from the core identity flow
- **Validation**: package-level tests plus app-level integration tests

---

## Phase 1: Scaffold the dedicated app and env boundary

**User stories**: the monorepo has a real app-shell target for the migrated demo; env and runtime conventions match the other apps

### What to build

Create a new app under `apps/ack` with the same baseline conventions used by the existing Next apps:

- `package.json` with `dev`, `build`, and `start` scripts
- `next.config.ts` with `typedRoutes` and `reactCompiler`
- `src/app/` app-router structure
- app-scoped env bootstrap such as `@oss/env/ack`
- any required Tailwind or UI package setup needed to match the app stack

The initial app should render a placeholder guided demo shell and load without depending on database or auth packages.

### Acceptance criteria

- [ ] `apps/ack` exists and runs with the same monorepo workflow as the other apps
- [ ] Env loading follows the same pattern as the existing apps
- [ ] The app can render a demo shell without accessing a database
- [ ] The app boundary is isolated from `apps/web` and `apps/finance`

---

## Phase 2: Extract reusable identity orchestration into a shared package

**User stories**: ACK identity behavior is reusable and no longer trapped inside a CLI demo

### What to build

Create a new shared package for the demo's reusable identity orchestration. Port the domain pieces from `ack/demos/identity/src/` into package modules with minimal runtime assumptions:

- owner creation
- agent identity creation and DID document composition
- credential issuer
- credential verifier
- challenge signing and verification
- session modeling for the two-agent demo

The package should wrap `agentcommercekit` but remain UI-agnostic and transport-agnostic.

### Acceptance criteria

- [ ] Owner creation is available from the shared package
- [ ] Agent DID document generation is available from the shared package
- [ ] Ownership VC issuance and verification are available from the shared package
- [ ] Identity verification no longer depends on CLI prompts or Hono runtime code
- [ ] The package can be imported from the new app without circular workspace coupling

---

## Phase 3: Replace port-based local servers with app-router route handlers

**User stories**: the migrated app preserves the demo's HTTP protocol semantics without running two separate Node servers

### What to build

Implement route handlers for the client and server agents under a namespaced app-router path. The handlers should preserve the current demo surfaces:

- `POST /api/demo/agents/[agentId]/chat`
- `POST /api/demo/agents/[agentId]/identity/challenge`
- `GET /api/demo/agents/[agentId]/identity/vc`

Create a demo session initializer that provisions the two owners, two agents, and ownership credentials in memory. The generated DID documents should publish service endpoints that resolve back to these route handlers.

### Acceptance criteria

- [ ] The app can initialize an in-memory demo session with two owners and two agents
- [ ] Both agents expose explicit route handlers for chat, challenge signing, and VC retrieval
- [ ] DID document service endpoints resolve to app-router routes, not localhost ports
- [ ] The server agent blocks fulfillment until identity validation succeeds

---

## Phase 4: Build the guided browser walkthrough

**User stories**: a user can inspect the ACK identity flow visually without using the CLI

### What to build

Create a multi-step browser UI that mirrors the current demo sequence and renders the intermediate artifacts. The UI should clearly separate the phases:

1. Create client owner
2. Create client agent
3. Issue client ownership VC
4. Create server owner and server agent
5. Issue server ownership VC
6. Start interaction and verify identity before fulfillment

The walkthrough should display relevant DID documents, credentials, verification outcomes, and the final fulfilled response.

### Acceptance criteria

- [ ] The UI exposes the same conceptual steps as the CLI demo
- [ ] Generated DID documents and credentials are visible and inspectable
- [ ] The user can see that fulfillment is blocked before verification
- [ ] The user can see that fulfillment succeeds after verification

---

## Phase 5: Make the haiku exchange a replaceable payload module

**User stories**: the identity layer can survive even if the demo payload changes later

### What to build

Separate the haiku-specific behavior from the core identity orchestration. Keep the same demo outcome for parity, but structure the code so the payload can be swapped later for a different verified interaction.

At minimum, isolate:

- provider selection and model access
- haiku-specific prompt logic
- any tool wiring that is not strictly part of ACK-ID verification

### Acceptance criteria

- [ ] The identity package does not require haiku-specific code to function
- [ ] The app still reproduces the current haiku flow
- [ ] Replacing the haiku payload would not require rewriting credential issuance or verification

---

## Phase 6: Prove parity with tests

**User stories**: another engineer can trust that the migration preserved behavior, not just visuals

### What to build

Add focused automated coverage at two levels:

- shared package tests for identity primitives and verification
- app integration or end-to-end tests for the guided browser flow

The app-level flow should prove the same sequence the CLI demonstrates: initialization, ownership credential availability, DID exchange, identity challenge, VC validation, and gated fulfillment.

### Acceptance criteria

- [ ] Shared package tests cover owner creation, agent creation, VC issuance, and verification
- [ ] App integration tests cover the browser flow end to end
- [ ] A failing verification path is tested
- [ ] A successful verification path is tested

---

## Risks and follow-up work

- **Single-host DID endpoint design**: the document assumes path-based namespacing can replace separate ports without breaking the meaning of service endpoints
- **Runtime state in serverless contexts**: in-memory state is acceptable for local demo parity but not a durable deployment model
- **Provider friction**: the current haiku flow still depends on Anthropic or OpenAI credentials; local fallback is deferred
- **Future persistence**: storing owners, agents, credentials, and conversations in a database is intentionally deferred to a later phase

## Deferred work

- Database-backed identity and session persistence
- Multi-user session isolation beyond in-memory demo scope
- Embedding the shared identity package into `apps/web`, `apps/finance`, or `native`
- Replacing the haiku interaction with another verified business workflow