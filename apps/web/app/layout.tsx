import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "EIDOLON", description: "EIDOLON: digital couture and material physics atelier. All data is synthetic." };
export const viewport: Viewport = { themeColor: "#090909", width: "device-width", initialScale: 1 };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
