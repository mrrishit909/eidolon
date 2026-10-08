import type { Fabric, LogEntry } from "@eidolon/schemas";
export type Data = { fabrics: Fabric[]; log: LogEntry[] };
export const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export async function loadData(): Promise<Data> {
  const g = async <T,>(n: string) => (await fetch(`${base}/data/${n}.json`)).json() as Promise<T>;
  const [fabrics, log] = await Promise.all([g<Fabric[]>("fabrics"), g<LogEntry[]>("log")]);
  return { fabrics, log };
}
