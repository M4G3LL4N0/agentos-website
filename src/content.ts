import product from "./product.json";

export const PRODUCT = product;

export const THESIS =
  "AgentOS is a local control plane for agent work. Humans and other systems hand it an objective. It inspects state, picks a capability, executes behind an adapter, and refuses to treat adapter output as the truth.";

export const INEQUALITY: {
  key: "requested" | "attempted" | "executed" | "verified";
  word: string;
  meaning: string;
}[] = [
  {
    key: "requested",
    word: "REQUESTED",
    meaning:
      "An objective exists. Nothing has run. Creating a ticket is not work.",
  },
  {
    key: "attempted",
    word: "ATTEMPTED",
    meaning:
      "The engine dispatched a capability. An attempt number exists. Dispatch is not a result.",
  },
  {
    key: "executed",
    word: "EXECUTED",
    meaning:
      "An adapter returned output. Simulated and inspect modes cap result_state at PARTIAL or UNKNOWN. LIVE is the only path to a COMPLETED result.",
  },
  {
    key: "verified",
    word: "VERIFIED",
    meaning:
      "A verifier ran against real evidence. VERIFIED is never pre-claimed. A fresh LIVE success lands in VERIFYING until a check passes.",
  },
];

export const MODES = [
  {
    id: "inspect",
    body: "Show what would run. No side effects. result_state stays UNKNOWN.",
  },
  {
    id: "simulated",
    body: "The default. Adapters may return output. result_state caps at PARTIAL. This is not LIVE execution.",
  },
  {
    id: "live",
    body: "Real side effects. Requires explicit authorization. Fail-closed without it.",
  },
] as const;

export const SURFACES = [
  {
    id: "CLI",
    invoke: "agentos …",
    body: "The command center. Thin wrappers. --json keeps the exit code.",
  },
  {
    id: "HTTP",
    invoke: "agentos serve",
    body: "Stdlib server on loopback. No auth in v0.5.0. Bind to trusted networks only.",
  },
  {
    id: "MCP",
    invoke: "agentos mcp",
    body: "Stdio JSON-RPC. Same tools as the CLI: inspect, run, delegate, verify, recover.",
  },
] as const;

export const NOT_THIS = [
  {
    claim: "Not a chatbot",
    body: "There is no conversation surface. The unit of work is an objective with a recorded lifecycle.",
  },
  {
    claim: "Not PAIOS",
    body: "PAIOS is a personal operating environment. AgentOS is the execution control plane. The supervisor model names PAIOS as a caller, not as this codebase.",
  },
  {
    claim: "Not OrgOS",
    body: "Organizational strategy, roles, and governance stay in a future separate project. AgentOS will not grow those insides.",
  },
  {
    claim: "Not a Grok wrapper",
    body: "The core has no provider logic. Grok, OpenCode, GitHub, xAI, and the rest sit behind adapters. Detection is never READY.",
  },
] as const;

export const INSTALL = [
  {
    title: "Clone the repository",
    command: "git clone https://github.com/M4G3LL4N0/agentos.git && cd agentos",
  },
  {
    title: "Create a virtualenv",
    command: "python3.11 -m venv .venv",
  },
  {
    title: "Install the package",
    command: ".venv/bin/python -m pip install -e .",
  },
  {
    title: "Initialize an isolated home",
    command:
      'export AGENTOS_HOME="$(mktemp -d)" && .venv/bin/agentos init && .venv/bin/agentos status',
  },
] as const;
