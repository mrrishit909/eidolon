import { describe, expect, it } from "vitest";
import { stageAt, wrapAmountAt, drapeAmountAt, walkPhaseAt, mulberry32 } from "../src/index.ts";
import { validateFabric, validateLogEntry, STAGES } from "@eidolon/schemas";

describe("garment", () => {
  it("stageAt steps through the ladder in order and clamps", () => {
    expect(STAGES.map((_, i) => stageAt(i))).toEqual(STAGES);
    expect(stageAt(-1)).toBe("thread"); expect(stageAt(99)).toBe("runway");
  });
  it("wrap goes from 0 at thread/pattern to 1 by silhouette", () => {
    expect(wrapAmountAt(0)).toBe(0); expect(wrapAmountAt(1)).toBe(0); expect(wrapAmountAt(5)).toBe(1); expect(wrapAmountAt(6)).toBe(1);
  });
  it("drape is 0 before seam and grows with stage, reduced by stiffness", () => {
    expect(drapeAmountAt(2, 0.1)).toBe(0);
    expect(drapeAmountAt(6, 0.1)).toBeGreaterThan(drapeAmountAt(4, 0.1));
    expect(drapeAmountAt(6, 0.9)).toBeLessThan(drapeAmountAt(6, 0.1));
  });
  it("walk phase is 0 before the runway stage", () => expect(walkPhaseAt(3, 10)).toBe(0));
});
describe("schemas + rng", () => {
  it("validators reject bad records", () => {
    expect(validateFabric({ id: "silk", name: "x", stiffness: 0.1, colorHex: "#D7B9A3" })).toBe(true);
    expect(validateFabric({ id: "silk", name: "x", stiffness: 2, colorHex: "#D7B9A3" })).toBe(false);
    expect(validateFabric({ id: "silk", name: "x", stiffness: 0.1, colorHex: "notacolor" })).toBe(false);
    expect(validateLogEntry({ id: "l1", stage: "thread", text: "note" })).toBe(true);
    expect(validateLogEntry({ id: "l1", stage: "nope", text: "note" })).toBe(false);
  });
  it("rng repeats per seed", () => { const a = mulberry32(5), b = mulberry32(5); expect([a(), a()]).toEqual([b(), b()]); });
});
