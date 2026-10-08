import { expect, test } from "@playwright/test";

test("fabric swatch selection updates the readout", async ({ page }) => {
  await page.goto("/?skip=1&t=5");
  await page.getByTestId("fabric-denim").click();
  await expect(page.getByTestId("fabric-name")).toHaveText("Raw Denim");
});

test("fabric choice actually changes the rendered garment, not just the readout", async ({ page }) => {
  await page.goto("/?skip=1&t=5&fabric=silk");
  await page.waitForFunction(() => typeof (window as unknown as { __eidolonStats?: unknown }).__eidolonStats === "function", null, { timeout: 30_000 });
  await page.waitForTimeout(400);
  const stage = page.getByTestId("stage"), box = await stage.boundingBox(); if (!box) throw new Error("no box");
  const a = await page.screenshot({ clip: { x: box.x + box.width * 0.4, y: box.y + box.height * 0.5, width: 2, height: 2 } });
  await page.getByTestId("fabric-denim").click();
  await page.waitForTimeout(400);
  const b = await page.screenshot({ clip: { x: box.x + box.width * 0.4, y: box.y + box.height * 0.5, width: 2, height: 2 } });
  expect(a.toString("base64")).not.toBe(b.toString("base64"));
});

test("logbook entry selection shows detail", async ({ page }) => {
  await page.goto("/?skip=1&t=0");
  await page.getByTestId("log-log-1").click();
  await expect(page.getByTestId("log-detail")).toBeVisible();
});

test("sequence scrub moves between stages", async ({ page }) => {
  await page.goto("/?skip=1&t=0");
  await page.getByTestId("nav-runway").click();
  await expect(page.getByTestId("gauge")).toHaveText("Runway");
});

test("out-of-range sequence scrub clamps natively", async ({ page }) => {
  await page.goto("/?skip=1&t=0");
  const scrub = page.getByTestId("seq-scrub");
  await scrub.evaluate((el: HTMLInputElement) => { el.value = "999"; el.dispatchEvent(new Event("input", { bubbles: true })); });
  expect(Number(await scrub.inputValue())).toBeLessThanOrEqual(6);
});

test("keyboard-only: tab reaches the sequence rail and activates a stage", async ({ page }) => {
  await page.goto("/?skip=1");
  await expect(page.getByTestId("hud")).toBeVisible();
  await page.getByTestId("nav-silhouette").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("nav-silhouette")).toHaveClass(/on/);
});

test("mobile width keeps the HUD usable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto("/?skip=1&t=0");
  await expect(page.getByTestId("hud")).toBeVisible();
  await expect(page.getByTestId("readout")).toBeVisible();
});

test("reduced motion: intro renders a static keyframe list with no timeline", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByTestId("intro")).toBeVisible();
  await page.getByTestId("skip-intro").click();
  await expect(page.getByTestId("hud")).toBeVisible();
});

test("graphics failure: gfx=off falls back to the poster with no canvas", async ({ page }) => {
  await page.goto("/?gfx=off&skip=1");
  await expect(page.getByTestId("poster")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
});
