import { CurseForge } from "../src/CurseForge.ts";
import { API_KEY } from "./utils/apiKey.ts";

const curseForge = new CurseForge(API_KEY);
const modLoader: CurseForge.ModLoader = "Forge";
const minecraftVersion: CurseForge.MinecraftVersion = "1.19.2";

const mod = await curseForge.getMod("quark");

if (!mod) {
  console.log("Couldn't find a mod with that slug!");
  Deno.exit(1);
}

const file = await curseForge
  .getNewestFile(mod.id, { minecraftVersion, modLoader });

if (!file) {
  console.log("Couldn't find a file for this mod loader and MC version!");
  Deno.exit(1);
}

curseForge
  .dependencies({ file, minecraftVersion, modLoader })
  .toFiles()
  .then((depFiles) =>
    depFiles.forEach((depFile) => console.log(depFile.displayName))
  );
