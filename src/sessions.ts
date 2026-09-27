/**
 * Captured from AgentOS 0.5.0 on 2026-09-25 in an isolated $AGENTOS_HOME.
 * Machine-specific paths were rewritten to $TMP / $AGENTOS_HOME.
 * Nothing here is invented: IDs, states, evidence, and timestamps are real.
 */

export type SessionId = "echo" | "refuse";

export type InequalityKey =
  | "requested"
  | "attempted"
  | "executed"
  | "verified";

export interface SessionEvent {
  at: string;
  type: string;
  detail: string;
  inequality?: InequalityKey;
}

export interface SessionEvidence {
  kind: string;
  detail: string;
  source: string;
}

export interface SessionFailure {
  type: string;
  attempt: number;
  detail: string;
}

export interface Session {
  id: SessionId;
  label: string;
  command: string;
  capturedAt: string;
  version: string;
  note: string;
  objectiveId: string;
  title: string;
  status: string;
  verify: string;
  strategy: string;
  next: string;
  mode: string;
  resultState: string;
  verificationState: string;
  cost: string;
  capability: string;
  executionId: string;
  attempt: number;
  events: SessionEvent[];
  evidence: SessionEvidence[];
  failures: SessionFailure[];
  markerIntact?: boolean;
}

export const SESSIONS: Record<SessionId, Session> = {
  echo: {
    id: "echo",
    label: "echo",
    command:
      'agentos objective create "Say hello" --operation echo --params \'{"hello":"world"}\'\nagentos run obj_fb47cae95169\nagentos inspect obj_fb47cae95169',
    capturedAt: "2026-09-25T13:40:28Z",
    version: "0.5.0",
    note: "Default mode is simulated. The objective completed; result_state stayed PARTIAL; cost stayed UNKNOWN.",
    objectiveId: "obj_fb47cae95169",
    title: "Say hello",
    status: "COMPLETED",
    verify: "VERIFIED",
    strategy: "operation:echo via echo [DIRECT]",
    next: "",
    mode: "simulated",
    resultState: "PARTIAL",
    verificationState: "UNVERIFIED",
    cost: "UNKNOWN",
    capability: "echo:echo",
    executionId: "exec_3737f3c00320",
    attempt: 1,
    events: [
      {
        at: "13:40:26.662",
        type: "objective.created",
        detail: "Say hello",
        inequality: "requested",
      },
      {
        at: "13:40:26.664",
        type: "objective.ready",
        detail: "READY — not yet running",
      },
      {
        at: "13:40:28.365",
        type: "objective.started",
        detail: "engine entered RUNNING",
      },
      {
        at: "13:40:28.374",
        type: "capability.selected",
        detail:
          "strategy=DIRECT: single execution step. selected echo score=100 [health=OK(100); history=none; learned=no_history]",
      },
      {
        at: "13:40:28.377",
        type: "execution.started",
        detail: "exec_3737f3c00320 attempt=1",
        inequality: "attempted",
      },
      {
        at: "13:40:28.377",
        type: "normalized_result",
        detail: "result=PARTIAL verification=UNVERIFIED mode=simulated",
        inequality: "executed",
      },
      {
        at: "13:40:28.378",
        type: "execution.completed",
        detail: "adapter returned payload; engine did not promote to COMPLETED result",
      },
      {
        at: "13:40:28.378",
        type: "verification.started",
        detail: "method=structural",
      },
      {
        at: "13:40:28.379",
        type: "verification.passed",
        detail: "adapter succeeded with non-empty output and no error",
        inequality: "verified",
      },
      {
        at: "13:40:28.391",
        type: "objective.completed",
        detail: "strategy=DIRECT plan_id=plan_f2f359f20c53",
      },
    ],
    evidence: [
      {
        kind: "echoed",
        detail: "echo adapter returned the input payload",
        source: "echo",
      },
      {
        kind: "normalized_result",
        detail: "result=PARTIAL verification=UNVERIFIED mode=simulated",
        source: "engine",
      },
      {
        kind: "structural",
        detail: "adapter succeeded with non-empty output and no error",
        source: "verifier",
      },
    ],
    failures: [],
  },
  refuse: {
    id: "refuse",
    label: "refuse",
    command:
      'agentos objective create "Wipe tmp" --operation shell.run --params \'{"command":"rm -rf /tmp && touch $TMP/still-here"}\'\nagentos run obj_d842b4ff4b84\nagentos inspect obj_d842b4ff4b84',
    capturedAt: "2026-09-25T13:41:28Z",
    version: "0.5.0",
    note: "Policy refused the command before the shell ran. Three bounded attempts. The marker file was still there afterward.",
    objectiveId: "obj_d842b4ff4b84",
    title: "Wipe tmp",
    status: "BLOCKED",
    verify: "UNVERIFIED",
    strategy: "operation:shell.run via shell [DIRECT]",
    next: "execution refused by policy (destructive or approval-required); grant approval via policy configuration, then run recover. AgentOS stops here rather than acting without authority.",
    mode: "simulated",
    resultState: "BLOCKED",
    verificationState: "UNVERIFIED",
    cost: "UNKNOWN",
    capability: "shell:shell.run",
    executionId: "exec_334913cd78d2",
    attempt: 3,
    markerIntact: true,
    events: [
      {
        at: "13:41:14.969",
        type: "objective.created",
        detail: "Wipe tmp",
        inequality: "requested",
      },
      {
        at: "13:41:27.981",
        type: "execution.started",
        detail: "exec_12d5bce3d8a2 attempt=1",
        inequality: "attempted",
      },
      {
        at: "13:41:27.995",
        type: "policy_denied",
        detail:
          "blocked by pattern '*rm -rf /*'; destructive operation not allowed by policy; operation class 'standard' requires approval",
      },
      {
        at: "13:41:27.995",
        type: "normalized_result",
        detail: "result=BLOCKED verification=UNVERIFIED mode=simulated",
      },
      {
        at: "13:41:28.033",
        type: "verification.failed",
        detail: "method=exit_code — adapter reported no exit code",
      },
      {
        at: "13:41:28.100",
        type: "execution.started",
        detail: "exec_a182acdc2add attempt=2",
      },
      {
        at: "13:41:28.200",
        type: "policy_denied",
        detail: "same refusal, attempt 2 of 3",
      },
      {
        at: "13:41:28.300",
        type: "execution.started",
        detail: "exec_334913cd78d2 attempt=3",
      },
      {
        at: "13:41:28.439",
        type: "objective.blocked",
        detail:
          "AgentOS stops here rather than acting without authority",
      },
    ],
    evidence: [
      {
        kind: "policy_denied",
        detail:
          "blocked by pattern '*rm -rf /*'; destructive operation not allowed by policy; operation class 'standard' requires approval",
        source: "shell",
      },
      {
        kind: "normalized_result",
        detail: "result=BLOCKED verification=UNVERIFIED mode=simulated",
        source: "engine",
      },
    ],
    failures: [
      {
        type: "connectivity",
        attempt: 1,
        detail:
          "refused by execution policy: blocked by pattern '*rm -rf /*'; destructive operation not allowed by policy",
      },
      {
        type: "connectivity",
        attempt: 2,
        detail:
          "refused by execution policy: blocked by pattern '*rm -rf /*'; destructive operation not allowed by policy",
      },
      {
        type: "connectivity",
        attempt: 3,
        detail:
          "refused by execution policy: blocked by pattern '*rm -rf /*'; destructive operation not allowed by policy",
      },
    ],
  },
};

export const CAPABILITIES = [
  { id: "echo", readiness: "AVAILABLE", health: "OK" },
  { id: "filesystem", readiness: "AVAILABLE", health: "OK" },
  { id: "shell", readiness: "AVAILABLE", health: "OK" },
  { id: "github", readiness: "AVAILABLE", health: "AVAILABLE" },
  { id: "grok", readiness: "AVAILABLE", health: "AVAILABLE" },
  { id: "hermes", readiness: "AVAILABLE", health: "AVAILABLE" },
  { id: "openclaw", readiness: "AVAILABLE", health: "AVAILABLE" },
  { id: "opencode", readiness: "AVAILABLE", health: "AVAILABLE" },
  { id: "xai", readiness: "AUTH_REQUIRED", health: "AUTH_REQUIRED" },
  { id: "browser-harness", readiness: "UNKNOWN", health: "UNKNOWN" },
  { id: "langgraph", readiness: "UNAVAILABLE", health: "UNAVAILABLE" },
  { id: "openhands", readiness: "UNAVAILABLE", health: "UNAVAILABLE" },
  { id: "grokbot-office", readiness: "UNAVAILABLE", health: "UNAVAILABLE" },
] as const;

export const TRIAGE = [
  {
    objective: "calculate the sum of these totals",
    resolution: "DETERMINISTIC",
    reason: "deterministic computation; no model required",
    match: ["calculate", "sum", "totals"],
  },
  {
    objective: "Say hello",
    resolution: "PREMIUM",
    reason: "no cheaper rule matched; premium reasoning required",
    match: [],
  },
] as const;

export const LOOP = [
  "OBJECTIVE",
  "UNDERSTAND",
  "INSPECT",
  "DISCOVER",
  "PLAN",
  "SELECT",
  "EXECUTE",
  "VERIFY",
  "PERSIST",
  "LEARN",
  "NEXT",
] as const;
