import type { InequalityKey, Session, SessionId } from "./sessions";
import { SESSIONS } from "./sessions";

export interface InspectState {
  sessionId: SessionId;
  visible: number;
  focus: InequalityKey | null;
  playing: boolean;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className !== undefined) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

function toneFor(value: string): string {
  const v = value.toUpperCase();
  if (
    v === "COMPLETED" ||
    v === "VERIFIED" ||
    v === "OK" ||
    v === "AVAILABLE" ||
    v === "PASS"
  ) {
    return "pass";
  }
  if (
    v === "FAILED" ||
    v === "BLOCKED" ||
    v === "REFUSED" ||
    v === "UNAVAILABLE" ||
    v === "FAIL"
  ) {
    return "stop";
  }
  if (
    v === "RUNNING" ||
    v === "VERIFYING" ||
    v === "PARTIAL" ||
    v === "AUTH_REQUIRED" ||
    v === "UNKNOWN"
  ) {
    return "caution";
  }
  return "field";
}

function stamp(value: string): HTMLSpanElement {
  const node = el("span", `stamp stamp--${toneFor(value)}`);
  node.textContent = value;
  return node;
}

function row(label: string, value: string | HTMLElement, hint?: string): HTMLElement {
  const line = el("div", "docket__row");
  if (hint !== undefined) {
    line.dataset.inequality = hint;
  }
  const key = el("dt", "docket__key", label);
  const val = el("dd", "docket__val");
  if (typeof value === "string") {
    val.append(stamp(value));
  } else {
    val.append(value);
  }
  line.append(key, val);
  return line;
}

export function renderInspect(root: HTMLElement, state: InspectState): void {
  const session = SESSIONS[state.sessionId];
  const shown = session.events.slice(0, state.visible);
  const reached = new Set(
    shown.map((event) => event.inequality).filter((key): key is InequalityKey => key !== undefined),
  );

  root.replaceChildren();
  root.append(buildStub(session, reached));
  root.append(buildFace(session, state, shown, reached));
}

function buildStub(
  session: Session,
  reached: Set<InequalityKey>,
): HTMLElement {
  const stub = el("aside", "stub");
  stub.setAttribute("aria-label", "Execution loop");
  const title = el("p", "stub__title", "LOOP");
  stub.append(title);
  const stages = [
    ["OBJECTIVE", "requested"],
    ["SELECT", "attempted"],
    ["EXECUTE", "executed"],
    ["VERIFY", "verified"],
  ] as const;
  const list = el("ol", "stub__list");
  for (const [name, key] of stages) {
    const item = el("li", reached.has(key) ? "stub__item is-on" : "stub__item");
    item.textContent = name;
    list.append(item);
  }
  stub.append(list);
  const mode = el("p", "stub__mode", `mode ${session.mode}`);
  stub.append(mode);
  return stub;
}

function buildFace(
  session: Session,
  state: InspectState,
  shown: Session["events"],
  reached: Set<InequalityKey>,
): HTMLElement {
  const face = el("div", "docket__face");

  const head = el("header", "docket__head");
  const kind = el("p", "docket__kind", "execution docket");
  const id = el("p", "docket__id", session.objectiveId);
  const title = el("h2", "docket__title", session.title);
  head.append(kind, id, title);
  face.append(head);

  const ineq = el("div", "inequality");
  ineq.setAttribute("role", "tablist");
  ineq.setAttribute("aria-label", "Execution facts");
  const keys: InequalityKey[] = ["requested", "attempted", "executed", "verified"];
  const words = ["REQUESTED", "ATTEMPTED", "EXECUTED", "VERIFIED"];
  keys.forEach((key, index) => {
    if (index > 0) {
      ineq.append(el("span", "inequality__neq", "≠"));
    }
    const button = el("button", "inequality__word");
    button.type = "button";
    button.dataset.key = key;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", state.focus === key ? "true" : "false");
    button.classList.toggle("is-reached", reached.has(key));
    button.classList.toggle("is-focus", state.focus === key);
    button.textContent = words[index] ?? key;
    ineq.append(button);
  });
  face.append(ineq);

  const fields = el("dl", "docket__fields");
  fields.append(row("status", session.status, "requested"));
  fields.append(row("mode", session.mode, "attempted"));
  fields.append(row("result", session.resultState, "executed"));
  fields.append(row("verify", session.verify, "verified"));
  fields.append(row("v-state", session.verificationState, "executed"));
  fields.append(row("cost", session.cost));
  const cap = el("span", "docket__plain", session.capability);
  fields.append(row("via", cap));
  fields.append(row("attempt", String(session.attempt), "attempted"));
  if (state.focus !== null) {
    for (const line of fields.querySelectorAll<HTMLElement>("[data-inequality]")) {
      line.classList.toggle("is-focus", line.dataset.inequality === state.focus);
    }
  }
  face.append(fields);

  if (session.next) {
    const next = el("p", "docket__next");
    next.append(el("span", "docket__key", "next"));
    next.append(document.createTextNode(session.next));
    face.append(next);
  }

  if (session.markerIntact === true) {
    const marker = el(
      "p",
      "docket__marker",
      "marker file still present after the run — the command never executed",
    );
    face.append(marker);
  }

  const journal = el("ol", "journal");
  journal.setAttribute("aria-label", "Event journal");
  for (const event of shown) {
    const item = el("li", "journal__item");
    if (event.inequality !== undefined && state.focus === event.inequality) {
      item.classList.add("is-focus");
    }
    item.append(el("time", "journal__at", event.at));
    item.append(el("span", "journal__type", event.type));
    item.append(el("span", "journal__detail", event.detail));
    journal.append(item);
  }
  if (shown.length === 0) {
    journal.append(el("li", "journal__empty", "press replay to stamp the journal"));
  }
  face.append(journal);

  const ev = el("ul", "evidence");
  ev.setAttribute("aria-label", "Evidence");
  for (const item of session.evidence) {
    const li = el("li", "evidence__item");
    li.append(el("span", "evidence__kind", item.kind));
    li.append(el("span", "evidence__detail", item.detail));
    ev.append(li);
  }
  face.append(ev);

  return face;
}

export function fullVisible(sessionId: SessionId): number {
  return SESSIONS[sessionId].events.length;
}
