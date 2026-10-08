// EIDOLON: shared types + runtime validators.
export const STAGES = ["thread", "pattern", "panel", "seam", "drape", "silhouette", "runway"] as const;
export type Stage = (typeof STAGES)[number];
export type Fabric = { id: string; name: string; stiffness: number; colorHex: string };
export type LogEntry = { id: string; stage: Stage; text: string };

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
export function validateFabric(r: unknown): r is Fabric {
  const o = r as Fabric;
  return !!o && typeof o.id === "string" && isNum(o.stiffness) && o.stiffness >= 0 && o.stiffness <= 1 && /^#[0-9a-fA-F]{6}$/.test(o.colorHex);
}
export function validateLogEntry(r: unknown): r is LogEntry {
  const o = r as LogEntry;
  return !!o && typeof o.id === "string" && STAGES.includes(o.stage) && typeof o.text === "string";
}
