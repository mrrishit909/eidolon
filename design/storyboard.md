# Storyboard

| t (wall-clock s) | Frame | Shared element forward |
|---|---|---|
| 0.0 | A single thread, caption "A single thread" | the thread spool prop, already present |
| 1.8-3.8 | `live.sewProgress` animates 0 to 0.3, camera dollies in slightly; caption "It sews itself into a seam" | the camera dolly path |
| 3.8-8.3 | `state.t` animates 0 to 3 (thread through seam): the garment plane shader's `uSew` pulls the panel halves together | `state.t`, read by `Garment`'s shader uniforms |
| 8.3-11.3 | `state.t` continues 3 to 5 (drape through silhouette): `uWrap` wraps the flat pattern into a body shape, `uDrape` adds sag; the dress form fades in once the body becomes meaningful | the same `Garment` mesh, the same `DressForm` primitive |
| 12.4-14.8 | `state.t` animates 5 to 6 (runway): the garment group rotates one full turn | the same group's rotation, reused by the post-intro runway stage |
| 14.8-16.4 | `state.t` animates back to 1 (pattern): caption "The garment explodes back into pattern pieces" | the same shader, running in reverse |
| 16.4 | Light mask expands, revealing the HUD at the Pattern stage | the same `--mask` mechanism as every blueprint in this volume |

**Reduced motion** replaces the above with three static captioned frames (Thread, Drape, Atelier).
