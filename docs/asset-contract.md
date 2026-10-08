# Asset contract

## dress-form.glb
Root empty `DressForm`. `FormTorso`, `FormNeck`, `FormPole`, `FormBase` share one pivot. Shown as a single `<primitive>` once the sequence reaches the panel stage (`state.t >= 2.3`), standing in for the invisible body the garment drapes around.

## thread-spool.glb
Root empty `ThreadSpool`. `SpoolBody`, `SpoolCap` (x2) share one pivot. Shown only before the pattern stage (`state.t < 1.3`), rotating slowly.

Both assets are procedural primitive composition from `model/build.py`. The garment itself is not a Blender asset: it is a single procedural plane mesh deformed entirely by a vertex shader (see `docs/architecture.md`), which is how "every stage transforms the same garment representation" is satisfied without needing per-stage geometry swaps.
