import { CurseForge } from "../src/mod.ts";
import { API_KEY } from "./utils/apiKey.ts";

// "configured" and "catalogue" have a circular relationship
// this makes them excellent candidates for testing
const SLUG = "configured";
const minecraftVersion = "1.19.2";
const modLoader = "Forge";
const options = { minecraftVersion, modLoader } as const;

const curseForge = await new CurseForge(API_KEY, options);
const mod = await curseForge.getMod(SLUG);

if (!mod) {
  console.log(`Couldn't find a mod with slug "${SLUG}"`);
  Deno.exit(1);
}

const file = await curseForge.getNewestFile(mod.id);

if (!file) {
  console.log(
    `Couldn't find a file for ${mod.name}} (${minecraftVersion} ${modLoader})`,
  );
  Deno.exit(1);
}

const dependencies = curseForge.dependencies(file);

// async iterable
console.log("iterating over dependencies:");
for await (const [_, file] of dependencies) {
  console.log(file && file.displayName);
}
console.log();

console.log("dependencies as a map:");
const map = await dependencies.toMap();
for (const [modID, file] of map.entries()) {
  console.log(`key: ${modID}; val: ${file && file.displayName}`);
}
console.log();

console.log("dependencies as a graph:");
const rootNode = await dependencies.toGraph();
const rootModID = rootNode.file.modID;
const childModID = rootNode.file.dependencies.optional?.[0]!;
const childNode = rootNode.dependencies.optional?.[childModID];
const grandChildNode = childNode?.dependencies.optional?.[rootModID];
console.log("confirming configured and catalogue are circular dependencies");
console.log(rootNode === grandChildNode);
