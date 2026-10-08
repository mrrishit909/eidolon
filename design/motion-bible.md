# Motion bible

## Easing and durations
- Camera: exponential smoothing (`1 - exp(-dt * 2.6)`).
- Intro: `power1.inOut` for most beats, `power2.in` for the fabric-growing clock advance (accelerating, like gaining momentum), `power2.inOut` for the explode-back-to-pattern reversal and the final mask reveal.

## Camera rules
- The camera always looks at a fixed point near the garment's center; only its position and the garment's own rotation (at the runway stage) change.
- Runway rotation and intro "model turns once" share the same mechanism: the garment group's `rotation.y`, driven by `walkPhaseAt`, which is 0 everywhere except the runway stage.

## Scroll mapping
- Wheel over the stage steps one stage per gesture (rate-limited 700ms).
- The Sequence slider in the panel is the one continuous drag surface, writing the same `state.t` the wheel and rail write.

## Reduced-motion equivalents
- Intro: three static captioned frames.
- Post-intro: camera lerp becomes an instant snap; the garment's own shader-driven deformation (wrap/drape) is a function of `state.t`, not of elapsed real time, so it is already motion-safe (no continuous unprompted animation) regardless of the reduced-motion flag.

## Purpose audit
Every animated value maps to the sequence position, the selected fabric's physical properties, or direct interaction feedback. The garment's deformation has no decorative-only component: the wrap, drape and seam-pull values are all read by the HUD's own readouts, so the visual and the numbers never disagree.
