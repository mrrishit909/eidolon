// Synthetic EIDOLON fabric swatches and atelier log. Deterministic. Not a real cloth simulation.
import { mkdirSync, writeFileSync } from "node:fs";
import type { Fabric, LogEntry } from "../../packages/schemas/src/index.ts";

const fabrics: Fabric[] = [
  { id: "silk", name: "Silk Charmeuse", stiffness: 0.08, colorHex: "#D7B9A3" },
  { id: "wool", name: "Wool Crepe", stiffness: 0.42, colorHex: "#6A5CFF" },
  { id: "denim", name: "Raw Denim", stiffness: 0.78, colorHex: "#233544" },
  { id: "chiffon", name: "Silk Chiffon", stiffness: 0.03, colorHex: "#EAE4DA" },
];
const log: LogEntry[] = [
  { id: "log-1", stage: "thread", text: "A single thread, the atelier's raw material." },
  { id: "log-2", stage: "pattern", text: "Pattern pieces flattened and marked for cutting." },
  { id: "log-3", stage: "panel", text: "Panels folded along their seam lines." },
  { id: "log-4", stage: "seam", text: "Seams closed; the garment holds its first shape." },
  { id: "log-5", stage: "drape", text: "Drape tested on the form; fabric choice changes the fall." },
  { id: "log-6", stage: "silhouette", text: "Full silhouette reviewed against the body." },
  { id: "log-7", stage: "runway", text: "Runway pass, one full turn." },
];
mkdirSync(new URL("../generated", import.meta.url), { recursive: true });
const out = (n: string, v: unknown) => writeFileSync(new URL(`../generated/${n}.json`, import.meta.url), JSON.stringify(v));
out("fabrics", fabrics); out("log", log);
console.log(`EIDOLON seeded: ${fabrics.length} fabrics, ${log.length} log entries`);
