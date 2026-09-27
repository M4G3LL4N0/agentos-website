import "./styles.css";
import {
  INEQUALITY,
  INSTALL,
  MODES,
  NOT_THIS,
  PRODUCT,
  SURFACES,
  THESIS,
} from "./content";
import type { InspectState } from "./inspect";
import { fullVisible, renderInspect } from "./inspect";
import type { InequalityKey, SessionId } from "./sessions";
import { CAPABILITIES, LOOP, SESSIONS, TRIAGE } from "./sessions";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state: InspectState = {
  sessionId: "echo",
  visible: reduceMotion ? fullVisible("echo") : 0,
  focus: null,
  playing: false,
};

let timer: number | null = null;

function $(id: string): HTMLElement {
  const node = document.getElementById(id);
  if (node === null) {
    throw new Error(`missing #${id}`);
  }
  return node;
}

function setMeta(): void {
  const title = `${PRODUCT.name} — ${PRODUCT.tagline}`;
  document.title = title;
  const version = document.getElementById("product-version");
  if (version !== null) {
    version.textContent = `v${PRODUCT.version}`;
  }
}

function paint(): void {
  renderInspect($("inspect-root"), state);
  const session = SESSIONS[state.sessionId];
  const command = document.getElementById("inspect-command");
  if (command !== null) {
    command.textContent = session.command;
  }
  const note = document.getElementById("inspect-note");
  if (note !== null) {
    note.textContent = session.note;
  }
  document.querySelectorAll<HTMLButtonElement>("[data-session]").forEach((button) => {
    const active = button.dataset.session === state.sessionId;
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.classList.toggle("is-on", active);
  });
  const play = document.getElementById("inspect-play");
  if (play !== null) {
    play.textContent = state.playing ? "halt" : "replay";
  }
}

function stopPlay(): void {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
  state.playing = false;
}

function play(): void {
  stopPlay();
  const total = fullVisible(state.sessionId);
  if (reduceMotion) {
    state.visible = total;
    paint();
    return;
  }
  state.visible = 0;
  state.playing = true;
  paint();
  timer = window.setInterval(() => {
    state.visible += 1;
    if (state.visible >= total) {
      stopPlay();
    }
    paint();
  }, 90);
}

function onInspectClick(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const session = target.closest("[data-session]");
  if (session instanceof HTMLButtonElement && session.dataset.session !== undefined) {
    stopPlay();
    state.sessionId = session.dataset.session as SessionId;
    state.visible = fullVisible(state.sessionId);
    state.focus = null;
    paint();
    return;
  }
  if (target.id === "inspect-play") {
    if (state.playing) {
      stopPlay();
      paint();
    } else {
      play();
    }
    return;
  }
  const word = target.closest<HTMLElement>(".inequality__word");
  if (word?.dataset.key !== undefined) {
    const key = word.dataset.key as InequalityKey;
    state.focus = state.focus === key ? null : key;
    const meaning = INEQUALITY.find((item) => item.key === key);
    const panel = document.getElementById("inequality-meaning");
    if (panel !== null && meaning !== undefined) {
      panel.hidden = false;
      panel.replaceChildren();
      const label = document.createElement("strong");
      label.textContent = meaning.word;
      panel.append(label, document.createTextNode(` — ${meaning.meaning}`));
    }
    paint();
  }
}

function renderLoop(): void {
  const host = document.getElementById("loop-list");
  if (host === null) {
    return;
  }
  for (const stage of LOOP) {
    const item = document.createElement("li");
    item.textContent = stage;
    host.append(item);
  }
}

function renderModes(): void {
  const host = document.getElementById("mode-list");
  if (host === null) {
    return;
  }
  for (const mode of MODES) {
    const item = document.createElement("li");
    item.className = "mode";
    const id = document.createElement("strong");
    id.textContent = mode.id;
    const body = document.createElement("p");
    body.textContent = mode.body;
    item.append(id, body);
    host.append(item);
  }
}

function renderSurfaces(): void {
  const host = document.getElementById("surface-list");
  if (host === null) {
    return;
  }
  for (const surface of SURFACES) {
    const item = document.createElement("li");
    item.className = "surface";
    const id = document.createElement("strong");
    id.textContent = surface.id;
    const invoke = document.createElement("code");
    invoke.textContent = surface.invoke;
    const body = document.createElement("p");
    body.textContent = surface.body;
    item.append(id, invoke, body);
    host.append(item);
  }
}

function renderCaps(): void {
  const host = document.getElementById("cap-body");
  if (host === null) {
    return;
  }
  for (const cap of CAPABILITIES) {
    const tr = document.createElement("tr");
    const id = document.createElement("th");
    id.scope = "row";
    id.textContent = cap.id;
    const ready = document.createElement("td");
    ready.textContent = cap.readiness;
    ready.dataset.tone = cap.readiness;
    const health = document.createElement("td");
    health.textContent = cap.health;
    health.dataset.tone = cap.health;
    tr.append(id, ready, health);
    host.append(tr);
  }
}

function renderTriage(): void {
  const host = document.getElementById("triage-list");
  if (host === null) {
    return;
  }
  for (const item of TRIAGE) {
    const li = document.createElement("li");
    li.className = "triage";
    const obj = document.createElement("code");
    obj.textContent = item.objective;
    const res = document.createElement("strong");
    res.textContent = item.resolution;
    const reason = document.createElement("p");
    reason.textContent = item.reason;
    li.append(obj, res, reason);
    host.append(li);
  }
}

function renderNot(): void {
  const host = document.getElementById("not-list");
  if (host === null) {
    return;
  }
  for (const item of NOT_THIS) {
    const li = document.createElement("li");
    const claim = document.createElement("strong");
    claim.textContent = item.claim;
    const body = document.createElement("p");
    body.textContent = item.body;
    li.append(claim, body);
    host.append(li);
  }
}

function renderInstall(): void {
  const host = document.getElementById("install-list");
  if (host === null) {
    return;
  }
  for (const step of INSTALL) {
    const li = document.createElement("li");
    const title = document.createElement("h3");
    title.textContent = step.title;
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = step.command;
    pre.append(code);
    li.append(title, pre);
    host.append(li);
  }
}

function setCanonical(): void {
  const raw = import.meta.env.VITE_SITE_URL as string | undefined;
  const base = (raw ?? "").replace(/\/$/, "");
  if (base === "") {
    return;
  }
  const canonical = document.getElementById("canonical-url");
  if (canonical instanceof HTMLLinkElement) {
    canonical.href = `${base}/`;
  }
  const ogUrl = document.getElementById("og-url");
  if (ogUrl instanceof HTMLMetaElement) {
    ogUrl.content = `${base}/`;
  }
  const ogImage = document.getElementById("og-image");
  if (ogImage instanceof HTMLMetaElement) {
    ogImage.content = `${base}/og.svg`;
  }
}

function main(): void {
  setMeta();
  setCanonical();
  const thesis = document.getElementById("thesis");
  if (thesis !== null) {
    thesis.textContent = THESIS;
  }
  renderLoop();
  renderModes();
  renderSurfaces();
  renderCaps();
  renderTriage();
  renderNot();
  renderInstall();
  $("inspect-board").addEventListener("click", onInspectClick);
  paint();
  if (!reduceMotion) {
    play();
  }
}

main();
