# EIDOLON

Digital couture and material physics atelier (blueprint 05, Advanced Engineering Build Book Vol. VIII). Editorial couture, living fabric. The public site is static; the Blender asset is scripted.

- Build the asset: `npm run model` (needs Blender 4.5 at ~/Applications). Then `node scripts/copy-assets.ts`.
- Data: `npm run seed` (deterministic, synthetic). Tests: `npm test` (domain + API), `npm run e2e` after `npm run build`.
- Scroll moves through Thread -> Pattern -> Panel -> Seam -> Drape -> Silhouette -> Runway; every stage transforms the same garment mesh.
- Multi-agent is the DEVELOPMENT process (see .claude/agents); the product contains no agents.
- Everything in the UI is a synthetic fabric/drape model. Do not present it as a real cloth simulation.
