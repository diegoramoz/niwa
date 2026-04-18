# Niwa 庭

I built this to demonstrate how I approach full-stack engineering as a startup generalist, from database schema design to infrastructure to UI. Every decision here reflects how I'd build a production-grade full-stack application: end-to-end type safety, secure infrastructure, and clean separation of concerns across a monorepo.

- [finance.zdiego.com](https://finance.zdiego.com) — AI-powered invoice scanner and expense dashboard

---

## Apps

### `finance` — [finance.zdiego.com](https://finance.zdiego.com)
A fully functional demo of an AI invoice scanner. Users submit their invoices on finance.zdiego.com and an ollama vision LLM extracts structured data from it. Turning pdfs/images into a queryable database.

This setup achieves private inference because the LLM runs on a local machine, which is exposed to the internet using a Cloudflare Tunnel + Zero Trust Access.

![Finance app demo](apps/finance/public/finance.gif)

**What's next:** The extraction performance can be improved with image compression (reduce payload size), and better PDF processing strategies. The economics only make sense at high volume, thousands of invoices per day, and that's exactly the target use case I'm validating.

### `web` — [ramoz.dev](https://ramoz.dev)
A frontend component showcase. I open-source the components I've built and refined across projects — starting with things like the `Wireframe` layout component. This app is intentionally frontend-only: no backend, just patterns and primitives worth sharing.

![Web app demo](apps/web/public/wireframe.gif)

---

## Stack

**Monorepo**
- [Turborepo](https://turbo.build) — task orchestration and build caching
- [Bun](https://bun.sh) — package manager and runtime

**Frontend**
- [Next.js 16](https://nextjs.org) + React 19
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com) — component primitives
- [TanStack Form](https://tanstack.com/form) — form management
- [TanStack Table](https://tanstack.com/table) — data tables
- [TanStack Query](https://tanstack.com/query) — server state

**Backend & Data**
- [oRPC](https://orpc.unnoq.com) — end-to-end typesafe RPC
- [Drizzle ORM](https://orm.drizzle.team) + [Neon](https://neon.tech) — serverless Postgres
- [Better Auth](https://better-auth.com) + passkeys — authentication
- [Zod v4](https://zod.dev) — schema validation, co-located with Drizzle table definitions

**Infrastructure**
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) + Zero Trust Access — securely exposes local services to deployed apps
- [Ollama](https://ollama.com) — local LLM / vision model inference

**Tooling**
- [Biome](https://biomejs.dev) + [Ultracite](https://ultracite.dev) — linting and formatting
- [Husky](https://typicode.github.io/husky/) + lint-staged — pre-commit hooks
- [Resend](https://resend.com) + [React Email](https://react.email) — transactional email
- [Polar](https://polar.sh) — billing

---

## Packages

| Package | Description |
|---|---|
| `api` | oRPC router — widgets, users, invoices, credit cards, addresses, bugs, plans, ping, ollama |
| `auth` | Better Auth config with passkey plugin |
| `db` | Drizzle schema + Neon client. Tables use a bigint internal PK and a public nanoId — the bigint never leaves the server |
| `ui` | Shared component library |
| `llm` | Starts Ollama locally and exposes it via a Cloudflare Tunnel with Zero Trust auth |
| `local-machine` | A minimal Bun HTTP server used to learn and validate the Cloudflare Tunnel setup before applying it to `llm` |
| `env` | Type-safe environment variables |
| `config` | Shared TypeScript and tooling config |
| `shared` | Shared utilities — input validation presets, metadata, allowed character sets |

---

Created by [Diego](https://zdiego.com)
