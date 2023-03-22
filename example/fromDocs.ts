import { CurseForge } from "https://deno.land/x/minecraft_curseforge_api@0.2.0/mod.ts";
import { API_KEY } from "./utils/apiKey.ts";

const curseForge = new CurseForge(API_KEY);

const modLoader: CurseForge.ModLoader = "Forge";
const minecraftVersion: CurseForge.MinecraftVersion = "1.19.2";

const mod = await curseForge.getMod("quark");

if (!mod) {
  console.log("Couldn't find a mod with that slug!");
  Deno.exit(1);
}

const file = await curseForge.getNewestFile(
  mod.id,
  { minecraftVersion, modLoader },
);

if (!file) {
  console.log("Couldn't find a file for this mod loader and MC version!");
  Deno.exit(1);
}

const graph = await curseForge.getDependencyGraph(
  { file, mod, minecraftVersion, modLoader },
);

if (!graph) {
  console.log("Couldn't make the dependency graph!");
  console.log(
    "When you provide both file and mod, this happens if file.modID !== mod.id",
  );
  Deno.exit(1);
}

const { dependencies } = graph;
console.log(dependencies.required && Object.keys(dependencies.required));
// [ "autoreglib" ]   Quark's only required dependency

console.log(dependencies.required?.autoreglib);
// {
//    mod: the AutoRegLib mod object,
//    file?: newest file matching your criteria, if one was found
//    dependencies?: that file's dependencies, in the same shape as this
// }
