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

function logDeps(msg: string, result?: Record<string, unknown>) {
  console.log(msg, Object.keys(result || {}));
}

logDeps(
  "all deps",
  await curseForge.getDependenciesDeep({
    mod,
    minecraftVersion,
    modLoader,
  }),
);

logDeps(
  "include required",
  await curseForge.getDependenciesDeep({
    mod,
    minecraftVersion,
    modLoader,
    include: ["required"],
  }),
);

logDeps(
  "exclude required",
  await curseForge.getDependenciesDeep({
    mod,
    minecraftVersion,
    modLoader,
    exclude: ["required"],
  }),
);
