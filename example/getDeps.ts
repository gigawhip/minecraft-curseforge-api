import { CurseForge } from "../src/mod.ts";
import { API_KEY } from "./utils/apiKey.ts";

// "configured" and "catalogue" have a circular relationship
// this makes them excellent candidates for testing
const SLUG = "configured";

const curseForge = await new CurseForge(API_KEY);
const mod = await curseForge.getMod(SLUG);

if (!mod) {
  console.log(`Couldn't find a mod with slug "${SLUG}"`);
  Deno.exit(1);
}

// const depDict = await curseForge.getDependenciesDeep({
//   mod,
//   minecraftVersion: "1.19.2",
//   modLoader: "Forge",
// });

// console.log(depDict);

const depGraph = await curseForge.getDependencyGraph({
  mod,
  minecraftVersion: "1.19.2",
  modLoader: "Forge",
});

console.log(depGraph);
// console.log(depGraph?.dependencies?.optional?.catalogue);
