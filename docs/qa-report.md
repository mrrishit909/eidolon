# QA report

Run on Apple M3 Pro, Chrome (stable), Playwright 1.63, WebGL through SwiftShader. Last full run: 19 e2e passed, 10 unit/API tests passed.

| Matrix row | Covered by | Result |
|---|---|---|
| Intro: first load, skip, reduced motion | demo walk, "reduced motion" test | pass |
| Input: click, keyboard | fabric swatch buttons, "keyboard-only" nav test | pass |
| Input: range (sequence scrub) | "sequence scrub moves between stages", "out-of-range clamps natively" | pass |
| Input: empty/invalid | idempotent notes POST tested in `apps/api/test/api.test.ts` | pass |
| Fabric choice changes the render, not just the readout | "fabric choice actually changes the rendered garment" (pixel-sample check) | pass |
| Responsive | 375 px: HUD and readout visible | pass (one size) |
| Motion: reduced | static keyframe list, no GSAP timeline mounted | pass |
| Graphics: success | all WebGL e2e tests | pass |
| Graphics: failure | `?gfx=off` swaps to the poster with zero canvas elements | pass |
| Graphics: slow GPU | SwiftShader median frame 16.7 ms | pass as a bound |
| Visual regression | 7 stages against the poster fallback | pass |
| Performance | `tests/e2e/performance.spec.ts` | pass |

**A real flake found and fixed here**: a keyboard-activation test called `.focus()` on a nav button immediately after `page.goto()`, before the data fetch resolved and the HUD actually mounted; the focus landed on a DOM node that React then replaced on first real render, so the later `Enter` keypress hit nothing. Fixed by waiting for `getByTestId("hud")` to be visible before focusing. Worth checking the equivalent tests in earlier blueprints if they ever start failing under heavier load.
