# agentos-website

Public site for [AgentOS](../agentos) — a local, provider-neutral agent
execution control plane.

This is not a chatbot landing page. The page *is* an inspect docket: two
sessions captured from AgentOS 0.5.0, replayed as the product actually
printed them.

## What is unusual about the product (and therefore the site)

AgentOS does not chat, wrap one model, or pretend adapter output is
success. It records four different facts:

```
REQUESTED ≠ ATTEMPTED ≠ EXECUTED ≠ VERIFIED
```

Default execution mode is `simulated`. `LIVE` needs explicit authority.
`result_state` for a simulated echo stays `PARTIAL`. Cost stays `UNKNOWN`
until a charge is measured. A destructive `rm -rf` is refused by policy
and the target is left intact.

The site language comes from that inspect surface — manila docket, stamped
states, event journal — not from generic AI/SaaS chrome.

## Captured sessions

Recorded 2026-09-25 in an isolated `$AGENTOS_HOME` against AgentOS 0.5.0:

- **echo** — `obj_fb47cae95169` completed; mode `simulated`;
  `result_state=PARTIAL`; `cost=UNKNOWN`; structural verify passed.
- **refuse** — `obj_d842b4ff4b84` blocked; three policy refusals of
  `rm -rf /tmp`; marker file still present.

Machine paths were rewritten to `$TMP` / `$AGENTOS_HOME`. The site does
not call a running engine.

## Commands

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

## Principles

- No invented claims. Numbers and states come from the captured CLI runs
  or from `src/product.json` (a snapshot of `agentos/product.json`).
- Supported and planned stay separate. Planned items are labelled planned.
- No analytics, cookies, or `curl | sh`.
- Websites never import AgentOS source. They describe it.

## Deploy

Static Vite. Vercel detects it. Set `VITE_SITE_URL` when a canonical
domain exists. There is no live URL until one is assigned.
