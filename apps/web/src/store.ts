import { useSyncExternalStore } from "react";
import { STAGES, type Stage } from "@eidolon/schemas";
export { STAGES };
export type State = { t: number; fabricId: string; playing: boolean; speed: number; selLog: string | null; introDone: boolean; introStep: number; reduced: boolean; pauseMotion: boolean; gfx: "webgl" | "poster" };
export const state: State = { t: 0, fabricId: "silk", playing: false, speed: 1, selLog: null, introDone: false, introStep: 0, reduced: false, pauseMotion: false, gfx: "webgl" };
export const live = { sewProgress: 0 };
let snap = { ...state };
const subs = new Set<() => void>();
export function set(p: Partial<State>) { Object.assign(state, p); snap = { ...state }; subs.forEach((f) => f()); }
export const useStore = () => useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => snap, () => snap);
export const stageIndex = (s: Stage) => STAGES.indexOf(s);
