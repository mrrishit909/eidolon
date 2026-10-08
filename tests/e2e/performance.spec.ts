import { expect, test } from "@playwright/test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";
const out = new URL("../../apps/web/out/", import.meta.url).pathname;
const size = (dir: string): number => readdirSync(dir).reduce((a, f) => { const p = join(dir, f), s = statSync(p); return a + (s.isDirectory() ? size(p) : f.endsWith(".js") ? gzipSync(readFileSync(p)).length : 0); }, 0);

test("download weight stays inside the budget", () => {
  expect(statSync(out + "models/dress-form.glb").size).toBeLessThan(40_000);
  expect(statSync(out + "models/thread-spool.glb").size).toBeLessThan(20_000);
  expect(size(out + "_next/static/chunks")).toBeLessThan(750_000);
});
test("scene cost: draw calls and triangles are bounded", async ({ page }) => {
  await page.goto("/?skip=1&t=5"); await page.waitForFunction(() => typeof (window as unknown as { __eidolonStats?: unknown }).__eidolonStats === "function", null, { timeout: 30_000 }); await page.waitForTimeout(2000);
  const st = await page.evaluate(() => (window as unknown as { __eidolonStats: () => { calls: number; triangles: number } }).__eidolonStats());
  console.log("renderer", JSON.stringify(st));
  expect(st.calls).toBeLessThan(40); expect(st.triangles).toBeLessThan(30_000);
});
test("interaction stays responsive while the canvas renders", async ({ page }) => {
  await page.goto("/?skip=1&t=0"); await expect(page.getByTestId("hud")).toBeVisible({ timeout: 30_000 }); await page.waitForTimeout(2000);
  const t0 = Date.now(); const scrub = page.getByTestId("seq-scrub"); await scrub.focus(); await page.keyboard.press("End"); await expect(page.getByTestId("drape-pct")).not.toHaveText("0%");
  console.log("scrub-to-readout ms", Date.now() - t0); expect(Date.now() - t0).toBeLessThan(3000);
});
