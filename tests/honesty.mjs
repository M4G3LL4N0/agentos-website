import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sessions = readFileSync(join(root, "src/sessions.ts"), "utf8");
const product = JSON.parse(readFileSync(join(root, "src/product.json"), "utf8"));
const html = readFileSync(join(root, "index.html"), "utf8");

const required = [
  'mode: "simulated"',
  'resultState: "PARTIAL"',
  'cost: "UNKNOWN"',
  'status: "BLOCKED"',
  "policy_denied",
  'kind: "structural"',
  "markerIntact: true",
  "obj_fb47cae95169",
  "obj_d842b4ff4b84",
];

const missing = required.filter((needle) => !sessions.includes(needle));
if (missing.length > 0) {
  throw new Error(`session honesty failed; missing ${missing.join(", ")}`);
}

if (product.version !== "0.5.0") {
  throw new Error(`product snapshot version drifted: ${product.version}`);
}

if (!html.includes("Requested is not verified.")) {
  throw new Error("page lost the product thesis");
}

if (html.includes("linear-gradient") || html.includes("particle")) {
  throw new Error("generic decoration leaked into markup");
}

process.stdout.write("honesty fixtures ok\n");
