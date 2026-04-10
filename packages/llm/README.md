# @oss/llm

Standalone package that runs local Ollama inference and exposes it publicly via a Cloudflare Tunnel with Access authentication.

## Quick start

```bash
cp .env.example .env
# fill in CF_TUNNEL_TOKEN and CF_TUNNEL_HOSTNAME (see runbook below)
bun run start
```

`bun run start` will:

1. Check `ollama` CLI is installed
2. Start `ollama serve` in the background
3. Wait for Ollama to become ready
4. Pull the configured model if it is not already present
5. Start the Cloudflare Tunnel
6. Print the public URL and keep both processes running

Press `Ctrl+C` to shut everything down cleanly.

## Scripts

| Command | Description |
|---|---|
| `bun run start` | Start Ollama + model pull + Cloudflare Tunnel |
| `bun run tunnel` | Start the Cloudflare Tunnel only (Ollama assumed running) |

## Environment variables

Copy `.env.example` to `.env` and fill in the values.

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_MODEL` | `llama3.2-vision` | Any Ollama-compatible model name |
| `OLLAMA_URL` | `http://localhost:11434` | Base URL of the local Ollama server |
| `CF_TUNNEL_NAME` | — | Name given to the tunnel during `cloudflared tunnel create` |
| `CF_TUNNEL_TOKEN` | — | Token from `cloudflared tunnel token <name>` |
| `CF_TUNNEL_HOSTNAME` | — | Public hostname (e.g. `llm.example.com`) printed on startup |

## One-time Cloudflare setup runbook

These steps are done once per machine. You need a Cloudflare account with a zone (domain) already added.

### 1. Install cloudflared

```bash
# macOS
brew install cloudflared

# Linux
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
  -o /usr/local/bin/cloudflared && chmod +x /usr/local/bin/cloudflared
```

### 2. Authenticate cloudflared

```bash
cloudflared tunnel login
```

A browser window opens. Select the zone (domain) you want to use for the tunnel hostname.

### 3. Create a named tunnel

```bash
cloudflared tunnel create llm
```

This creates a tunnel with a stable UUID and writes credentials to `~/.cloudflared/`. Note the tunnel UUID printed by the command.

### 4. Route the tunnel hostname

```bash
cloudflared tunnel route dns llm llm.example.com
```

Replace `llm.example.com` with the subdomain you want. This creates a CNAME record in your Cloudflare DNS pointing to the tunnel.

### 5. Get the tunnel token

```bash
cloudflared tunnel token llm
```

Copy the token into `CF_TUNNEL_TOKEN` in your `.env`.

### 6. Create a Cloudflare Access application

1. Go to **Cloudflare Zero Trust → Access → Applications → Add an application**
2. Choose **Self-hosted**
3. Set the application domain to your tunnel hostname (`llm.example.com`)
4. Under **Policies**, create a policy that allows only service tokens (Action: Service Auth)

### 7. Create a service token

1. Go to **Cloudflare Zero Trust → Access → Service Auth → Service Tokens → Create Service Token**
2. Give it a name (e.g. `oss-website`)
3. Copy the **Client ID** and **Client Secret** — these go into `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` in the website's environment (not in `packages/llm/.env`)

### 8. Configure the website

In the website's deployment environment set:

| Variable | Value |
|---|---|
| `OLLAMA_URL` | `https://llm.example.com` |
| `CF_ACCESS_CLIENT_ID` | Client ID from step 7 |
| `CF_ACCESS_CLIENT_SECRET` | Client Secret from step 7 |

### 9. Run

```bash
bun run start
```
