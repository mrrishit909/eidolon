# Performance report

Hardware: Apple M3 Pro laptop, Chrome stable, **software WebGL (SwiftShader)**, 1280 x 800. Command: `node scripts/measure.mjs` after `npm run build` and `node scripts/serve.ts`.

| Measure | Value | Budget |
|---|---|---|
| Transfer (18 requests, uncompressed local server) | 253 KB | n/a |
| JS gzipped (all chunks) | 565 KB | 750 KB |
| dress-form GLB / thread-spool GLB | 25.8 KB / 12.2 KB | 40 / 20 KB |
| Draw calls / triangles / geometries | 5 / 2,204 / 5 | 40 / 30,000 |
| LCP | 3.0 s | none set |
| CLS | 0 | 0.1 |
| Long-task total during load | 1.8 s | none set |
| Median / p95 frame time | 16.7 / 16.7 ms (60 fps, software) | none set |

Triangle count is dominated by the garment plane's 24x32 subdivision (needed for a smooth drape curve); draw calls stay at 5 because the garment, dress form and thread spool are each a single mesh with no instancing needed at this scale.

Degradation: frame loop pauses when the tab is hidden; `?gfx=off` and WebGL context loss swap to the poster; reduced motion removes the intro timeline and snaps the camera instead of lerping.
