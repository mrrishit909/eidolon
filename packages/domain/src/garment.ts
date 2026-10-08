// EIDOLON: a deterministic garment-state model. Not a real cloth simulation; a plausible, documented stand-in.
import { STAGES, type Stage } from "@eidolon/schemas";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export function stageAt(t: number): Stage {
  return STAGES[Math.max(0, Math.min(STAGES.length - 1, Math.round(t)))];
}
/** How much the flat pattern has wrapped into a body silhouette: 0 at thread/pattern, 1 by silhouette/runway. */
export function wrapAmountAt(t: number): number {
  return clamp((t - 1.5) / 3);
}
/** Cloth sag amplitude: grows from seam onward, reduced by fabric stiffness (0 = fluid, 1 = rigid). */
export function drapeAmountAt(t: number, stiffness: number): number {
  const stageDrape = clamp((t - 3) / 3);
  return stageDrape * (1 - stiffness * 0.8);
}
/** Runway walk cycle phase (0..1 repeating) only meaningful at the runway stage; elsewhere 0. */
export function walkPhaseAt(t: number, clock: number): number {
  return t >= 5.5 ? (clock * 0.6) % 1 : 0;
}
