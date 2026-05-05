# 06 - Verified interaction gate with haiku fulfillment

Status: closed

## What to build

Deliver the end-to-end interaction step where the server agent refuses fulfillment until client identity validation succeeds via DID exchange, challenge signing, and VC verification, then completes the haiku response after verification passes.

## Acceptance criteria

- [x] The interaction path shows a blocked state when identity verification has not completed
- [x] DID exchange, challenge validation, and VC verification are executed in the app-based flow
- [x] The server agent fulfills the request only after successful verification
- [x] The guided UI clearly shows both blocked and successful outcomes

## Blocked by

- /Users/diego/dev/niwa/.scratch/ack-identity-demo-replatform/issues/05-server-ownership-vc-and-protocol-route-surfaces.md
