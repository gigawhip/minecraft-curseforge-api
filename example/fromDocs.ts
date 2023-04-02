// import { CurseForge } from "https://deno.land/x/minecraft_curseforge_api@0.5.0/mod.ts";
import { CurseForge } from "../src/mod.ts";
import { API_KEY } from "./utils/apiKey.ts";

const modLoader: CurseForge.ModLoader = "Forge";
const minecraftVersion: CurseForge.MinecraftVersion = "1.19.2";
const curseForge = new CurseForge(API_KEY, { minecraftVersion, modLoader });

const mod = await curseForge.getMod("quark");

if (!mod) {
  console.log("Couldn't find a mod with that slug!");
  Deno.exit(1);
}

const file = await curseForge.getNewestFile(mod.id);

if (!file) {
  console.log("Couldn't find a file for this mod loader and MC version!");
  Deno.exit(1);
}

curseForge
  .dependencies(file, { include: ["required"] })
  .toFiles()
  .then((depFiles) =>
    depFiles.forEach((depFile) => console.log(depFile.displayName))
  );
