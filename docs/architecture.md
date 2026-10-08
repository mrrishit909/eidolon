# Architecture

```
model/build.py ──Blender──> source.blend + exports/{dress-form,thread-spool}.glb + renders/poster.png
model/validate.py ─fresh-scene re-import─> exports/validation.json
data/simulators/generate.ts ──> data/generated/{fabrics,log}.json (seeded, synthetic)
        │                              │
scripts/copy-assets.ts ──────────> apps/web/public/{data,models,posters}
                                       │
apps/web (Next.js 16 static export) ───┘      apps/api (node:http + ws) serves the same JSON on the book's /v1 contract
   App ─ store (external, useSyncExternalStore) ─ Panels (all DOM) + Scene (R3F canvas) + Intro (GSAP)
packages/domain: garment (stage ladder, wrap amount, drape amount, walk phase) - pure, tested
packages/schemas: shared types + runtime validators
```

**One mesh, seven stages.** The book's rule is that every stage transforms the same garment representation. This is satisfied literally: `Garment` is a single `THREE.PlaneGeometry` whose vertex shader mixes between a flat "pattern" layout and a cylindrical "wrapped around a body" layout (`uWrap`), adds a sag term that grows from the seam stage onward (`uDrape`), and pulls the panel halves together as the sequence approaches the seam stage (`uSew`). No geometry is swapped between stages, only shader uniforms.

**Fabric swatches change both color and physics**, not just a tint: `drapeAmountAt(t, stiffness)` takes the selected fabric's stiffness (0 = fluid silk, close to 1 = rigid denim) and reduces the sag amplitude accordingly, so switching from Silk Charmeuse to Raw Denim visibly flattens the drape, not just recolors it.

**WebGPU.** Ships WebGL2, same reasoning as the rest of the volume.

**Stack substitutions.** The book names Houdini, Marvelous Designer and Rapier (a physics engine) for this blueprint. None are used: the drape is a closed-form shader function, not a physics simulation, which keeps the budget tiny and the behavior fully deterministic and testable. This is a documented simplification, not a real cloth solver.

**Budgets** (asserted in `tests/e2e/performance.spec.ts`): dress-form GLB < 40 KB, thread-spool GLB < 20 KB, gzipped JS < 750 KB, draw calls < 40, triangles < 30,000.

**Not built.** A real cloth physics solver (Rapier or otherwise), Houdini, Marvelous Designer, Lenis (GSAP + a native scroll listener cover this slice's needs), auth.
