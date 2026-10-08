"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { live, set, state, useStore } from "../store";

// Steps follow blueprint section 2: 0 thread floats, 1 sews a seam, 2 fabric grows, 3 drapes around a body, 4 body visible, 5 turn, 6 explode to pieces, 7 flatten to atelier.
export default function Intro({ onDone }: { onDone: () => void }) {
  const s = useStore();
  const [caption, setCaption] = useState("");
  const mask = useRef<HTMLDivElement>(null), root = useRef<HTMLDivElement>(null), tl = useRef<gsap.core.Timeline | null>(null);

  const finish = (instant: boolean) => {
    tl.current?.kill(); document.documentElement.style.setProperty("--mask", "200%"); live.sewProgress = 1;
    set({ introDone: true, introStep: 99, t: 1 });
    if (instant && root.current) root.current.style.display = "none";
    onDone();
  };

  useEffect(() => {
    if (s.reduced) return;
    gsap.ticker.lagSmoothing(0);
    const t = gsap.timeline({ defaults: { ease: "power1.inOut" }, onComplete: () => finish(false) });
    tl.current = t;
    const sew = { v: 0 }, clock = { v: 0 };
    t.call(() => { set({ introStep: 0 }); setCaption("A single thread."); }, [], 0)
      .call(() => { set({ introStep: 1 }); setCaption("It sews itself into a seam."); }, [], 1.8)
      .to(sew, { v: 0.3, duration: 2, onUpdate: () => { live.sewProgress = sew.v; } }, 1.8)
      .call(() => { set({ introStep: 2 }); setCaption("Fabric grows from the seam."); }, [], 3.8)
      .to(clock, { v: 3, duration: 4.5, ease: "power2.in", onUpdate: () => set({ t: clock.v }) }, 3.8)
      .call(() => { set({ introStep: 3 }); setCaption("Panels fold and drape around an invisible body."); }, [], 8.3)
      .to(clock, { v: 5, duration: 3, onUpdate: () => set({ t: clock.v }) }, 8.3)
      .call(() => { set({ introStep: 4 }); setCaption("The body becomes visible."); }, [], 11.3)
      .call(() => { set({ introStep: 5 }); setCaption("The model turns once."); }, [], 12.4)
      .to(clock, { v: 6, duration: 2.4, onUpdate: () => set({ t: clock.v }) }, 12.4)
      .call(() => { set({ introStep: 6 }); setCaption("The garment explodes back into pattern pieces."); }, [], 14.8)
      .to(clock, { v: 1, duration: 1.6, ease: "power2.inOut", onUpdate: () => set({ t: clock.v }) }, 14.8)
      .call(() => { set({ introStep: 7 }); setCaption(""); }, [], 16.4)
      .to({ v: 0 }, { v: 160, duration: 1.8, ease: "power2.inOut", onUpdate: function () { document.documentElement.style.setProperty("--mask", `${this.targets()[0].v}%`); } }, 16.4);
    return () => { t.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.reduced]);

  if (s.introDone && !s.reduced) return null;
  if (s.reduced) {
    const frames = [["Thread", "A single thread sews itself into a seam; fabric grows."], ["Drape", "Panels fold and drape around an invisible body, which becomes visible."], ["Atelier", "The garment explodes back into pattern pieces, which flatten into the atelier."]];
    return (
      <div className="intro intro-static" ref={root} role="dialog" aria-label="Opening story" data-testid="intro">
        <ol>{frames.map(([d, c], i) => <li key={i}><b>{d}</b> {c}</li>)}</ol>
        <button className="btn primary" onClick={() => finish(true)} data-testid="skip-intro">Enter the atelier</button>
      </div>
    );
  }
  return (
    <div className="intro" ref={root} data-testid="intro" data-step={s.introStep}>
      <div className="intro-dark" style={{ opacity: s.introStep === 0 ? 1 : 0 }} />
      <p className="caption" role="status">{caption}</p>
      <button className="btn skip" onClick={() => { const t = tl.current; if (t && t.time() < 16.4) { live.sewProgress = 1; set({ t: 1 }); t.seek(16.4); } else finish(false); }} data-testid="skip-intro" autoFocus>Skip intro</button>
      <div className="light-mask" ref={mask} aria-hidden />
    </div>
  );
}
