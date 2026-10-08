import { expect, test } from "@playwright/test";
const STAGES = ["thread", "pattern", "panel", "seam", "drape", "silhouette", "runway"];
for (let i = 0; i < STAGES.length; i++) {
  test(`visual: ${STAGES[i]}`, async ({ page }) => {
    await page.goto(`/?gfx=off&skip=1&t=${i}`); await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
    await expect(page.getByTestId("hud")).toBeVisible(); await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot(`${STAGES[i]}.png`, { maxDiffPixelRatio: 0.05 });
  });
}
