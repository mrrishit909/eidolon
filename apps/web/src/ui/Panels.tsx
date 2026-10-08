"use client";
import { useEffect, useRef } from "react";
import { drapeAmountAt, stageAt, wrapAmountAt } from "@eidolon/domain";
import type { Data } from "../data";
import { set, state, STAGES, stageIndex, useStore } from "../store";

const LABELS: Record<string, string> = { thread: "Thread", pattern: "Pattern", panel: "Panel", seam: "Seam", drape: "Drape", silhouette: "Silhouette", runway: "Runway" };
const go = (t: number) => set({ t, playing: false });

function Readout({ data }: { data: Data }) {
  const s = useStore(), fabric = data.fabrics.find((f) => f.id === s.fabricId) ?? data.fabrics[0];
  return (
    <dl className="readout" data-testid="readout">
      <div><dt>Stage</dt><dd>{LABELS[stageAt(s.t)]}</dd></div>
      <div><dt>Fabric</dt><dd data-testid="fabric-name">{fabric.name}</dd></div>
      <div><dt>Wrap</dt><dd>{Math.round(wrapAmountAt(s.t) * 100)}%</dd></div>
      <div><dt>Drape</dt><dd data-testid="drape-pct">{Math.round(drapeAmountAt(s.t, fabric.stiffness) * 100)}%</dd></div>
    </dl>
  );
}

function Fabrics({ data }: { data: Data }) {
  const s = useStore();
  return (
    <section aria-labelledby="h-fabric"><h2 id="h-fabric">Fabric</h2>
      <div className="transport">{data.fabrics.map((f) => <button key={f.id} className={`btn ${s.fabricId === f.id ? "primary" : "ghost"}`} aria-pressed={s.fabricId === f.id} onClick={() => set({ fabricId: f.id })} data-testid={`fabric-${f.id}`}>{f.name}</button>)}</div>
    </section>
  );
}

function Logbook({ data }: { data: Data }) {
  const s = useStore(), stage = stageAt(s.t), rows = data.log.filter((l) => l.stage === stage), sel = data.log.find((l) => l.id === s.selLog);
  return (
    <section aria-labelledby="h-log"><h2 id="h-log">Atelier Notes</h2>
      <ul>{rows.map((l) => <li key={l.id}><button className={`row ${l.id === s.selLog ? "on" : ""}`} onClick={() => set({ selLog: l.id })} data-testid={`log-${l.id}`}>{l.text}</button></li>)}</ul>
      {sel && <aside className="note" data-testid="log-detail"><p>{sel.text}</p></aside>}
    </section>
  );
}

export default function Panels({ data }: { data: Data }) {
  const s = useStore(), stage = STAGES[Math.round(s.t)];
  const lock = useRef(0);
  useEffect(() => {
    const onWheel = (e: WheelEvent) => { if ((e.target as Element).closest(".panel,.rail,.intro")) return; const n = performance.now(); if (n - lock.current < 700 || Math.abs(e.deltaY) < 20 || !state.introDone) return; lock.current = n; const i = stageIndex(STAGES[Math.round(state.t)]) + (e.deltaY > 0 ? 1 : -1); if (STAGES[i]) go(i); };
    addEventListener("wheel", onWheel, { passive: true }); return () => removeEventListener("wheel", onWheel);
  }, []);
  return (
    <div className="hud" data-testid="hud">
      <header className="top"><span className="brand">EIDOLON</span><span className="gauge" data-testid="gauge">{LABELS[stage]}</span>
        <button className="btn ghost" aria-pressed={s.pauseMotion} onClick={() => set({ pauseMotion: !s.pauseMotion })} data-testid="pause-motion">{s.pauseMotion ? "Resume motion" : "Pause motion"}</button></header>
      <nav className="rail" aria-label="Sequence">{STAGES.map((st, i) => <button key={st} className={st === stage ? "on" : ""} aria-current={st === stage ? "page" : undefined} onClick={() => go(i)} data-testid={`nav-${st}`}><b>{LABELS[st]}</b></button>)}</nav>
      <main className="panel" key={stage} tabIndex={-1}>
        <label className="scrub">Sequence <input type="range" min={0} max={6} step={0.05} value={s.t} onChange={(e) => go(Number(e.target.value))} aria-valuetext={LABELS[stage]} data-testid="seq-scrub" /><output>{LABELS[stage]}</output></label>
        <Readout data={data} />
        <Fabrics data={data} />
        <Logbook data={data} />
      </main>
    </div>
  );
}
