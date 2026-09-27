# AgentOS website — instructions for agents in this repo

The portfolio rules in `~/startups/_portfolio/AGENTS.md` apply. This file
adds project rules only.

## What this is

Public site for AgentOS. Static Vite + TypeScript. The page is an inspect
docket built from captured CLI sessions, not a generic AI marketing site.

## How to work here

- Install: `pnpm install`
- Dev: `pnpm dev`
- Test: `pnpm test`
- Typecheck / lint / build: `pnpm typecheck` / `pnpm lint` / `pnpm build`

## Rules

1. Read `CURRENT_STATE.md` before changing anything. If it and the page
   disagree, the captured product sessions win; fix the page.
2. No invented claims. Do not add dashboard mockups, fake metrics, or
   provider logos as decoration.
3. Do not import AgentOS source. Snapshot `product.json` when the product
   version changes.
4. Keep AgentOS ≠ PAIOS ≠ OrgOS explicit.
5. Never push, tag, or deploy unless explicitly asked.
6. Visual language stays the docket: manila strip, stamped states, journal.
   Do not "improve" it into a gradient hero or three-column feature grid.
