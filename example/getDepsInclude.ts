import { CurseForge } from "../src/mod.ts";
import { API_KEY } from "./utils/apiKey.ts";

const slug = "quark";
const minecraftVersion = "1.19.2";
const modLoader = "Forge";

const curseForge = await new CurseForge(API_KEY);
const mod = await curseForge.getMod(slug);

if (!mod) {
  console.log(`Couldn't find a mod with slug "${slug}"`);
  Deno.exit(1);
}

const allDeps = await curseForge.getDependenciesDeep({
  mod,
  minecraftVersion,
  modLoader,
});

console.log("all deps", Object.keys(allDeps || {}));

const reqDeps = await curseForge.getDependenciesDeep({
  mod,
  minecraftVersion,
  modLoader,
  include: ["required"],
});

console.log("include required", Object.keys(reqDeps || {}));

const otherDeps = await curseForge.getDependenciesDeep({
  mod,
  minecraftVersion,
  modLoader,
  exclude: ["required"],
});

console.log("exclude required", Object.keys(otherDeps || {}));
