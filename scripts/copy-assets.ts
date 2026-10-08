// Copies the generated data and the validated GLBs + poster into the web app's public folder.
import { cpSync, mkdirSync } from "node:fs";
const root = new URL("../", import.meta.url).pathname, pub = root + "apps/web/public/";
mkdirSync(pub + "data", { recursive: true }); mkdirSync(pub + "models", { recursive: true }); mkdirSync(pub + "posters", { recursive: true });
cpSync(root + "data/generated", pub + "data", { recursive: true });
cpSync(root + "model/exports/dress-form.glb", pub + "models/dress-form.glb");
cpSync(root + "model/exports/thread-spool.glb", pub + "models/thread-spool.glb");
cpSync(root + "model/renders/poster.png", pub + "posters/dress-form.png");
console.log("assets copied");
