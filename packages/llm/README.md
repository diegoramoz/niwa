# @oss/llm

Standalone package that starts Ollama and exposes port `11434` publicly via a Cloudflare Tunnel with Zero Trust Access authentication.

The finance app reaches Ollama through the tunnel subdomain, authenticating with a Cloudflare Access service token (`CF-Access-Client-Id` / `CF-Access-Client-Secret`).

## Quick start

```bash
cp .env.example .env
# fill in CF_TUNNEL_TOKEN and CF_TUNNEL_HOSTNAME (see runbook below)
bun run start
```

`bun run start` will:

1. Check `ollama` CLI is installed
2. Start `ollama serve` if not already running
3. Wait for Ollama to become ready on port `11434`
4. Start the Cloudflare Tunnel
5. Print the public URL and keep both processes running

Press `Ctrl+C` to shut everything down cleanly.

## Scripts

| Command | Description |
|---|---|
| `bun run start` | Start Ollama + Cloudflare Tunnel |
| `bun run tunnel` | Start the Cloudflare Tunnel only (Ollama assumed running) |

## Environment variables

Copy `.env.example` to `.env` and fill in the values.

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_URL` | `http://localhost:11434` | Base URL of the local Ollama server |
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

### 3. Create a named tunnel

```bash
cloudflared tunnel create llm
```

### 4. Route the tunnel hostname

```bash
cloudflared tunnel route dns llm llm.example.com
```

### 5. Get the tunnel token

```bash
cloudflared tunnel token llm
```

Copy the token into `CF_TUNNEL_TOKEN` in your `.env`.

### 6. Create a Zero Trust Access application

1. Go to **Cloudflare Zero Trust → Access → Applications → Add an application**
2. Choose **Self-hosted**, set the domain to your tunnel hostname (`llm.example.com`)
3. Under **Policies**, create a policy that allows only service tokens (Action: Service Auth)

### 7. Create a service token

1. Go to **Cloudflare Zero Trust → Access → Service Auth → Service Tokens → Create Service Token**
2. Copy the **Client ID** and **Client Secret** into the finance app's environment:

| Variable | Value |
|---|---|
| `OLLAMA_URL` | `https://llm.example.com` |
| `OLLAMA_MODEL` | Model name (e.g. `llama3.2-vision`) |
| `CF_ACCESS_CLIENT_ID` | Client ID from step 7 |
| `CF_ACCESS_CLIENT_SECRET` | Client Secret from step 7 |

### 8. Run

```bash
bun run start
```
