---
name: document-api
description: "Generate or update API documentation by reading source code. Use when user wants to document, update docs for, or understand API endpoints in a codebase."
---

# Document API

Generate/update API documentation by reading source code.

## Workflow

### 1. Identify the API Source

Ask the user (or infer from context) where the API source lives. Focus on:

- **REST endpoints**: look for route handler files (e.g. `route.ts`, `*.controller.ts`, `*.router.ts`)
- **RPC / typed routers**: e.g. oRPC routers, gRPC proto files
- **Database schema**: table definitions and relationships
- **Auth middleware**: files that enforce authentication/authorization

### 2. For Each Endpoint, Capture

- HTTP method + path (REST) or procedure name + type (query/mutation/subscription)
- Request body / query params with types
- Response shape with types
- Auth requirements (public, Bearer token, session, API key, HMAC, etc.)
- Side effects (jobs, webhooks, file uploads, events)

### 3. Cross-Reference with the Current Project

Search the current workspace for usages of the documented endpoints. Flag:

- Endpoints consumed here that have changed in the source
- New endpoints not yet used by this project
- Deprecated endpoints still in use

### 4. Write Documentation

Output to `docs/api.md` (or a path the user specifies). Follow the structure in [TEMPLATE.md](TEMPLATE.md).

### 5. Summary

After updating, print a short summary of:

- Number of endpoints documented
- Any breaking changes detected vs. current usage
- Any new endpoints not yet consumed by this project
